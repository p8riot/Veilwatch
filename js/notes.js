(() => {
    "use strict";

    // ============================================================================
    // [JS-NOTES-01] STORAGE CONTRACT + NORMALIZATION
    // ============================================================================

    const storage = window.tosStorage;
    const config = window.tosAllInOneConfig;
    const persistentKey = "notes:persistent";
    const investigationKeys = Object.freeze({
        "paranormal-tracker": "notes:investigation:paranormal-tracker",
        "affixer-matrix": "notes:investigation:affixer-matrix"
    });
    const contextTypes = Object.freeze([
        "general",
        "ghost",
        "evidence",
        "location",
        "reference",
        "mechanics",
        "equipment"
    ]);

    function nowIso() {
        return new Date().toISOString();
    }

    function newId() {
        if (window.crypto && typeof window.crypto.randomUUID === "function") {
            return window.crypto.randomUUID();
        }

        return `note-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    }

    function normalizeContext(input) {
        const source = input && typeof input === "object" ? input : {};
        const type = contextTypes.includes(source.type) ? source.type : "general";
        const label = typeof source.label === "string" ? source.label.trim().slice(0, 160) : "";
        const id = typeof source.id === "string" ? source.id.trim().slice(0, 160) : "";

        return { type, label, id };
    }

    function normalizePersistentNote(input) {
        const source = input && typeof input === "object" ? input : {};
        const title = typeof source.title === "string" ? source.title.trim().slice(0, 180) : "";
        const body = typeof source.body === "string" ? source.body.slice(0, 50000) : "";
        const createdAt = typeof source.createdAt === "string" && source.createdAt
            ? source.createdAt
            : nowIso();
        const updatedAt = typeof source.updatedAt === "string" && source.updatedAt
            ? source.updatedAt
            : createdAt;

        return {
            id: typeof source.id === "string" && source.id ? source.id : newId(),
            title: title || "Untitled Note",
            body,
            context: normalizeContext(source.context),
            createdAt,
            updatedAt
        };
    }

    function readPersistentCollection() {
        const raw = storage.readJson(persistentKey, null);
        const items = Array.isArray(raw?.items) ? raw.items : [];

        return {
            schemaVersion: config.userDataSchema,
            items: items
                .filter((item) => item && typeof item === "object")
                .map(normalizePersistentNote)
        };
    }

    function writePersistentCollection(collection) {
        return storage.writeJson(persistentKey, {
            schemaVersion: config.userDataSchema,
            items: collection.items.map(normalizePersistentNote)
        });
    }

    function emitChanged(detail) {
        window.dispatchEvent(new CustomEvent("tos:notes-changed", { detail }));
    }

    // ============================================================================
    // [JS-NOTES-02] PERSISTENT MY NOTES
    // ============================================================================

    function getPersistentNotes() {
        return readPersistentCollection().items
            .slice()
            .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    }

    function getPersistentNote(id) {
        if (!id) return null;
        return readPersistentCollection().items.find((item) => item.id === id) || null;
    }

    function savePersistentNote(input) {
        const incoming = input && typeof input === "object" ? input : {};
        const hasUserContent = String(incoming.title || "").trim() || String(incoming.body || "").trim();
        if (!hasUserContent) {
            return { ok: false, reason: "empty-note" };
        }

        const collection = readPersistentCollection();
        const existingIndex = incoming.id
            ? collection.items.findIndex((item) => item.id === incoming.id)
            : -1;
        const existing = existingIndex >= 0 ? collection.items[existingIndex] : null;
        const timestamp = nowIso();
        const note = normalizePersistentNote({
            ...existing,
            ...incoming,
            id: existing?.id || incoming.id || newId(),
            createdAt: existing?.createdAt || incoming.createdAt || timestamp,
            updatedAt: timestamp
        });

        if (existingIndex >= 0) {
            collection.items[existingIndex] = note;
        } else {
            collection.items.push(note);
        }

        const result = writePersistentCollection(collection);
        if (result.ok) {
            emitChanged({ type: "persistent-save", id: note.id });
        }

        return { ...result, note };
    }

    function deletePersistentNote(id) {
        const collection = readPersistentCollection();
        const nextItems = collection.items.filter((item) => item.id !== id);
        if (nextItems.length === collection.items.length) {
            return { ok: true, removed: false };
        }

        const result = writePersistentCollection({ ...collection, items: nextItems });
        if (result.ok) {
            emitChanged({ type: "persistent-delete", id });
        }

        return { ...result, removed: result.ok };
    }

    function clearPersistentNotes() {
        const result = storage.remove(persistentKey);
        if (result.ok) {
            emitChanged({ type: "persistent-clear" });
        }
        return result;
    }


    function normalizeImportedNotes(items) {
        const usedIds = new Set();
        return (Array.isArray(items) ? items : [])
            .filter((item) => item && typeof item === "object")
            .map(normalizePersistentNote)
            .map((note) => {
                if (!usedIds.has(note.id)) {
                    usedIds.add(note.id);
                    return note;
                }

                const uniqueId = uniqueImportedId(note.id, usedIds);
                usedIds.add(uniqueId);
                return { ...note, id: uniqueId };
            });
    }

    function notesEquivalent(a, b) {
        return a.title === b.title &&
            a.body === b.body &&
            a.context?.type === b.context?.type &&
            a.context?.label === b.context?.label &&
            a.context?.id === b.context?.id &&
            a.createdAt === b.createdAt &&
            a.updatedAt === b.updatedAt;
    }

    function uniqueImportedId(baseId, usedIds) {
        let candidate = `${baseId || "note"}-imported`;
        let counter = 2;
        while (usedIds.has(candidate)) {
            candidate = `${baseId || "note"}-imported-${counter}`;
            counter += 1;
        }
        return candidate;
    }

    function mergePersistentNotes(items) {
        const collection = readPersistentCollection();
        const incoming = normalizeImportedNotes(items);
        const usedIds = new Set(collection.items.map((item) => item.id));
        const byId = new Map(collection.items.map((item) => [item.id, item]));
        let added = 0;
        let duplicates = 0;
        let conflictsPreserved = 0;

        incoming.forEach((note) => {
            const existing = byId.get(note.id);
            if (!existing) {
                collection.items.push(note);
                byId.set(note.id, note);
                usedIds.add(note.id);
                added += 1;
                return;
            }

            if (notesEquivalent(existing, note)) {
                duplicates += 1;
                return;
            }

            const preserved = { ...note, id: uniqueImportedId(note.id, usedIds) };
            collection.items.push(preserved);
            byId.set(preserved.id, preserved);
            usedIds.add(preserved.id);
            added += 1;
            conflictsPreserved += 1;
        });

        const result = writePersistentCollection(collection);
        if (result.ok) {
            emitChanged({ type: "persistent-import-merge", added, duplicates, conflictsPreserved });
        }

        return { ...result, added, duplicates, conflictsPreserved, total: collection.items.length };
    }

    function replacePersistentNotes(items) {
        const incoming = normalizeImportedNotes(items);
        const result = writePersistentCollection({
            schemaVersion: config.userDataSchema,
            items: incoming
        });
        if (result.ok) {
            emitChanged({ type: "persistent-import-replace", total: incoming.length });
        }
        return { ...result, total: incoming.length };
    }

    // ============================================================================
    // [JS-NOTES-03] TRACKER-SPECIFIC INVESTIGATION NOTES
    // ============================================================================

    function validTracker(tracker) {
        return tracker === "paranormal-tracker" || tracker === "affixer-matrix";
    }

    function getInvestigationNote(tracker) {
        if (!validTracker(tracker)) return null;
        const raw = storage.readJson(investigationKeys[tracker], null);

        return {
            schemaVersion: config.userDataSchema,
            tracker,
            body: typeof raw?.body === "string" ? raw.body : "",
            updatedAt: typeof raw?.updatedAt === "string" ? raw.updatedAt : null
        };
    }

    function saveInvestigationNote(tracker, body) {
        if (!validTracker(tracker)) {
            return { ok: false, reason: "invalid-tracker" };
        }

        const normalizedBody = typeof body === "string" ? body.slice(0, 50000) : "";
        if (!normalizedBody.trim()) {
            return clearInvestigationNote(tracker);
        }

        const value = {
            schemaVersion: config.userDataSchema,
            tracker,
            body: normalizedBody,
            updatedAt: nowIso()
        };
        const result = storage.writeJson(investigationKeys[tracker], value);
        if (result.ok) {
            emitChanged({ type: "investigation-save", tracker });
        }
        return { ...result, value };
    }

    function clearInvestigationNote(tracker) {
        if (!validTracker(tracker)) {
            return { ok: false, reason: "invalid-tracker" };
        }

        const result = storage.remove(investigationKeys[tracker]);
        if (result.ok) {
            emitChanged({ type: "investigation-clear", tracker });
        }
        return result;
    }

    window.addEventListener("tos:tracker-reset", (event) => {
        const tracker = event.detail?.tracker;
        if (validTracker(tracker)) {
            clearInvestigationNote(tracker);
        }
    });

    // ============================================================================
    // [JS-NOTES-04] PUBLIC API
    // ============================================================================

    window.tosNotes = Object.freeze({
        contextTypes,
        getPersistentNotes,
        getPersistentNote,
        savePersistentNote,
        deletePersistentNote,
        clearPersistentNotes,
        mergePersistentNotes,
        replacePersistentNotes,
        getInvestigationNote,
        saveInvestigationNote,
        clearInvestigationNote
    });
})();
