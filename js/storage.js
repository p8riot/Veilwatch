(() => {
    "use strict";

    // ============================================================================
    // [JS-STORAGE-01] NAMESPACE + SERIALIZATION
    // ============================================================================

    const config = window.tosAllInOneConfig;
    const prefix = `${config.storageNamespace}:`;

    function fullKey(key) {
        return `${prefix}${key}`;
    }

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
        const startupRoute = config.startupRoutes.includes(source.startupRoute)
            ? source.startupRoute
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
