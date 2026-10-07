(() => {
    "use strict";

    // ============================================================================
    // [JS-BACKUP-01] BACKUP FORMAT + VALIDATION
    // ============================================================================

    const config = window.tosAllInOneConfig;
    const storage = window.tosStorage;
    const notes = window.tosNotes;
    const productId = config.productId || "veilwatch";
    const legacyProductId = "the-other-side-all-in-one";
    const supportedSchema = Number(config.backupSchema) || 1;

    function nowIso() {
        return new Date().toISOString();
    }

    function backupEnvelope(type, data) {
        return {
            productId,
            productName: config.productName,
            backupSchemaVersion: supportedSchema,
            createdAt: nowIso(),
            appVersion: config.version,
            backupType: type,
            data
        };
    }

    function fullBackup() {
        return backupEnvelope("full", {
            settings: storage.getSettings(),
            persistentNotes: {
                schemaVersion: config.userDataSchema,
                items: notes.getPersistentNotes()
            }
        });
    }

    function notesOnlyBackup() {
        return backupEnvelope("notes-only", {
            persistentNotes: {
                schemaVersion: config.userDataSchema,
                items: notes.getPersistentNotes()
            }
        });
    }

    function isObject(value) {
        return Boolean(value) && typeof value === "object" && !Array.isArray(value);
    }

    function validateBackup(input) {
        const errors = [];
        const warnings = [];
        const source = isObject(input) ? input : null;

        if (!source) {
            return { ok: false, errors: ["Backup root must be a JSON object."], warnings, backup: null };
        }

        if (!new Set([productId, legacyProductId]).has(source.productId)) {
            errors.push("This backup belongs to a different product.");
        }

        const schema = Number(source.backupSchemaVersion);
        if (!Number.isInteger(schema) || schema < 1) {
            errors.push("Backup schema version is missing or invalid.");
        } else if (schema > supportedSchema) {
            errors.push(`This backup uses schema ${schema}, but this app supports up to schema ${supportedSchema}.`);
        } else if (schema < supportedSchema) {
            warnings.push(`This backup uses older schema ${schema}. It will be normalized during import.`);
        }

        if (typeof source.createdAt !== "string" || Number.isNaN(Date.parse(source.createdAt))) {
            errors.push("Backup creation date is missing or invalid.");
        }

        if (typeof source.appVersion !== "string" || !source.appVersion.trim()) {
            errors.push("Backup app version is missing.");
        }

        if (source.backupType !== "full" && source.backupType !== "notes-only") {
            errors.push("Backup type must be full or notes-only.");
        }

        if (!isObject(source.data)) {
            errors.push("Backup data is missing or invalid.");
        }

        const noteItems = source.data?.persistentNotes?.items;
        if (!Array.isArray(noteItems)) {
            errors.push("Persistent notes data is missing or invalid.");
        } else if (noteItems.length > 5000) {
            errors.push("This backup contains too many persistent notes to import safely.");
        } else if (noteItems.some((item) => !isObject(item))) {
            errors.push("One or more persistent note records are invalid.");
        }

        if (source.backupType === "full" && !isObject(source.data?.settings)) {
            errors.push("Full backup is missing settings data.");
        }

        const normalized = errors.length ? null : {
            productId: source.productId,
            productName: typeof source.productName === "string" ? source.productName : config.productName,
            backupSchemaVersion: schema,
            createdAt: source.createdAt,
            appVersion: source.appVersion,
            backupType: source.backupType,
            data: {
                ...(source.backupType === "full" ? { settings: source.data.settings } : {}),
                persistentNotes: {
                    schemaVersion: Number(source.data.persistentNotes?.schemaVersion) || config.userDataSchema,
                    items: noteItems
                }
            }
        };

        return { ok: errors.length === 0, errors, warnings, backup: normalized };
    }

    // ============================================================================
    // [JS-BACKUP-02] IMPORT RULES
    // Merge never deletes current notes. Replace replaces My Notes only. Neither
    // mode imports tracker state or temporary investigation notes.
    // ============================================================================

    function importBackup(input, mode = "merge") {
        const validation = validateBackup(input);
        if (!validation.ok) {
            return { ok: false, reason: "invalid-backup", validation };
        }

        if (mode !== "merge" && mode !== "replace") {
            return { ok: false, reason: "invalid-mode", validation };
        }

        const backup = validation.backup;
        const incomingNotes = backup.data.persistentNotes.items;
        const previousSettings = storage.getSettings();
        const previousNotes = notes.getPersistentNotes();
        let settingsResult = { ok: true, skipped: true };

        if (backup.backupType === "full") {
            settingsResult = storage.saveSettings(backup.data.settings);
            if (!settingsResult.ok) {
                return { ok: false, reason: "settings-import-failed", validation, settingsResult };
            }
        }

        const noteResult = mode === "replace"
            ? notes.replacePersistentNotes(incomingNotes)
            : notes.mergePersistentNotes(incomingNotes);

        if (!noteResult.ok) {
            if (backup.backupType === "full") {
                storage.saveSettings(previousSettings);
            }
            notes.replacePersistentNotes(previousNotes);
            return { ok: false, reason: "notes-import-failed", validation, noteResult, settingsResult };
        }

        return {
            ok: true,
            mode,
            backupType: backup.backupType,
            noteResult,
            settingsImported: backup.backupType === "full",
            settingsResult,
            validation
        };
    }

    // ============================================================================
    // [JS-BACKUP-03] SERIALIZATION + FILE HELPERS
    // ============================================================================

    function stringifyBackup(backup) {
        return `${JSON.stringify(backup, null, 2)}\n`;
    }

    function datedFileName(kind = "backup", date = new Date()) {
        const stamp = date.toISOString().slice(0, 10);
        const suffix = kind === "notes-only" ? "notes" : "backup";
        return `--.json`;
    }

    function downloadJson(backup, filename) {
        const blob = new Blob([stringifyBackup(backup)], { type: "application/json;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.hidden = true;
        document.body.append(link);
        link.click();
        link.remove();
        window.setTimeout(() => URL.revokeObjectURL(url), 0);
    }

    window.tosBackup = Object.freeze({
        fullBackup,
        notesOnlyBackup,
        validateBackup,
        importBackup,
        stringifyBackup,
        datedFileName,
        downloadJson
    });
})();
