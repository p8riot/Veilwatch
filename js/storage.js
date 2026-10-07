(() => {
    "use strict";

    // ============================================================================
    // [JS-STORAGE-01] NAMESPACE + SERIALIZATION
    // ============================================================================

    const config = window.tosAllInOneConfig;
    const prefix = `${config.storageNamespace}:`;

    const legacyTrackerIds = Object.freeze({
        paranormalTracker: String.fromCharCode(112, 109, 115),
        affixerMatrix: String.fromCharCode(97, 115, 115)
    });

    function fullKey(key) {
        return `${prefix}${key}`;
    }

    function migrateRawKey(oldKey, newKey) {
        try {
            const oldValue = window.localStorage.getItem(oldKey);
            if (oldValue === null) return;
            if (window.localStorage.getItem(newKey) === null) {
                window.localStorage.setItem(newKey, oldValue);
            }
            window.localStorage.removeItem(oldKey);
        } catch (_) {
            // Storage migration is best-effort. Existing data remains untouched on failure.
        }
    }

    function normalizeStartupRouteId(route) {
        if (route === legacyTrackerIds.paranormalTracker) return "paranormal-tracker";
        if (route === legacyTrackerIds.affixerMatrix) return "affixer-matrix";
        return route;
    }

    function migrateLegacyTrackerIdentity() {
        const legacyIdentify = legacyTrackerIds.paranormalTracker;
        const legacyCleanse = legacyTrackerIds.affixerMatrix;

        migrateRawKey(fullKey(`tracker:${legacyIdentify}:state`), fullKey("tracker:paranormal-tracker:state"));
        migrateRawKey(fullKey(`tracker:${legacyCleanse}:state`), fullKey("tracker:affixer-matrix:state"));
        migrateRawKey(fullKey(`notes:investigation:${legacyIdentify}`), fullKey("notes:investigation:paranormal-tracker"));
        migrateRawKey(fullKey(`notes:investigation:${legacyCleanse}`), fullKey("notes:investigation:affixer-matrix"));

        [
            [`${legacyIdentify}-theme`, "paranormal-tracker-theme"],
            [`${legacyIdentify}-reference-collapsed`, "paranormal-tracker-reference-collapsed"],
            [`${legacyIdentify}-ref-mode`, "paranormal-tracker-ref-mode"],
            [`${legacyIdentify}-ref-tab`, "paranormal-tracker-ref-tab"],
            [`${legacyCleanse}-profiler-theme`, "affixer-matrix-theme"],
            [`${legacyCleanse}-fieldnotes-mode`, "affixer-matrix-fieldnotes-mode"],
            [`${legacyCleanse}-fieldnotes-tab`, "affixer-matrix-fieldnotes-tab"]
        ].forEach(([oldKey, newKey]) => migrateRawKey(oldKey, newKey));

        try {
            const sectionPrefix = `${legacyCleanse}-section-`;
            const keys = [];
            for (let index = 0; index < window.localStorage.length; index += 1) {
                const key = window.localStorage.key(index);
                if (key && key.startsWith(sectionPrefix)) keys.push(key);
            }
            keys.forEach((oldKey) => {
                const suffix = oldKey.slice(sectionPrefix.length);
                migrateRawKey(oldKey, `affixer-matrix-section-${suffix}`);
            });
        } catch (_) {
            // Dynamic preference migration is best-effort.
        }

        try {
            const settingsKey = fullKey("settings");
            const raw = window.localStorage.getItem(settingsKey);
            if (raw !== null) {
                const parsed = JSON.parse(raw);
                if (parsed && typeof parsed === "object") {
                    const normalizedRoute = normalizeStartupRouteId(parsed.startupRoute);
                    if (normalizedRoute !== parsed.startupRoute || parsed.schemaVersion !== config.settingsSchema) {
                        window.localStorage.setItem(settingsKey, JSON.stringify({
                            ...parsed,
                            schemaVersion: config.settingsSchema,
                            startupRoute: normalizedRoute
                        }));
                    }
                }
            }
        } catch (_) {
            // Invalid/blocked settings are handled by the normal settings fallback.
        }
    }

    migrateLegacyTrackerIdentity();

    function readJson(key, fallback) {
        try {
            const raw = window.localStorage.getItem(fullKey(key));
            if (raw === null) {
                return fallback;
            }

            const parsed = JSON.parse(raw);
            return parsed && typeof parsed === "object" ? parsed : fallback;
        } catch (error) {
            console.warn("TOS storage read failed:", key, error);
            return fallback;
        }
    }

    function writeJson(key, value) {
        try {
            window.localStorage.setItem(fullKey(key), JSON.stringify(value));
            return { ok: true };
        } catch (error) {
            console.warn("TOS storage write failed:", key, error);
            return { ok: false, error };
        }
    }

    function remove(key) {
        try {
            window.localStorage.removeItem(fullKey(key));
            return { ok: true };
        } catch (error) {
            return { ok: false, error };
        }
    }


    function clearNamespace() {
        try {
            const keys = [];
            for (let index = 0; index < window.localStorage.length; index += 1) {
                const key = window.localStorage.key(index);
                if (key && key.startsWith(prefix)) {
                    keys.push(key);
                }
            }
            keys.forEach((key) => window.localStorage.removeItem(key));
            return { ok: true, removed: keys.length };
        } catch (error) {
            console.warn("TOS storage namespace clear failed:", error);
            return { ok: false, error, removed: 0 };
        }
    }

    // ============================================================================
    // [JS-STORAGE-02] SETTINGS CONTRACT
    // ============================================================================

    const defaultSettings = Object.freeze({
        schemaVersion: config.settingsSchema,
        startupRoute: "home",
        theme: "midnight",
        reducedMotion: false,
        largerText: false
    });

    function normalizeSettings(input) {
        const source = input && typeof input === "object" ? input : {};
        const requestedStartupRoute = normalizeStartupRouteId(source.startupRoute);
        const startupRoute = config.startupRoutes.includes(requestedStartupRoute)
            ? requestedStartupRoute
            : defaultSettings.startupRoute;
        const allowedThemes = [
            "midnight",
            "blue-hour",
            "ash",
            "blood-moon",
            "violet-veil",
            "ectoplasm",
            "candlelight",
            "forest-haunt",
            "sepia",
            "neon-occult",
            "ghost-light",
            "moonlit-rose",
            "storm-signal",
            "graveyard-moss",
            "ember-glow",
            "arcane-gold",
            "high-contrast"
        ];
        const theme = allowedThemes.includes(source.theme)
            ? source.theme
            : defaultSettings.theme;

        return {
            schemaVersion: config.settingsSchema,
            startupRoute,
            theme,
            reducedMotion: Boolean(source.reducedMotion),
            largerText: Boolean(source.largerText)
        };
    }

    function getSettings() {
        return normalizeSettings(readJson("settings", defaultSettings));
    }

    function saveSettings(nextSettings) {
        const normalized = normalizeSettings(nextSettings);
        return writeJson("settings", normalized);
    }

    function resetSettings() {
        const result = writeJson("settings", defaultSettings);
        return {
            ...result,
            value: { ...defaultSettings }
        };
    }

    // ============================================================================
    // [JS-STORAGE-03] PUBLIC API
    // ============================================================================

    window.tosStorage = Object.freeze({
        getSettings,
        saveSettings,
        resetSettings,
        readJson,
        writeJson,
        remove,
        clearNamespace
    });
})();
