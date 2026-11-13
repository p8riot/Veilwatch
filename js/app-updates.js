(() => {
    "use strict";

    // Update app files without touching localStorage, including notes and tracker state.
    // Reload only after returning to the app, and never during unsaved work.
    const currentVersion = window.tosAllInOneConfig.version;
    const CHECK_INTERVAL_MS = 30 * 60 * 1000;
    let started = false;
    let registration = null;
    let refreshPending = false;
    let previouslyControlled = false;
    let lastCheck = 0;
    let checking = false;

    function isNewerVersion(candidate) {
        const parse = (value) => /^\d+\.\d+\.\d+$/.test(value)
            ? value.split(".").map(Number)
            : null;
        const remote = parse(candidate);
        const local = parse(currentVersion);
        if (!remote || !local) return false;
        for (let index = 0; index < 3; index += 1) {
            if (remote[index] > local[index]) return true;
            if (remote[index] < local[index]) return false;
        }
        return false;
    }

    function hasUnsavedWork() {
        if (document.querySelector("#noteDirtyStatus")?.textContent.trim() === "Unsaved changes") {
            return true;
        }
        if (document.querySelector("#investigationNotesDialog[open], dialog[open]")) {
            return true;
        }
        // Protect only an active tracker; parked frames remain in the DOM after navigation.
        if (document.querySelector(".tracker-frame-mount > .protected-tracker-frame")) {
            return true;
        }
        if (document.activeElement?.matches?.("input, textarea, [contenteditable='true']")) {
            return true;
        }
        return false;
    }

    function applyOnReturn() {
        if (!refreshPending || document.visibilityState !== "visible" || hasUnsavedWork()) {
            return;
        }
        refreshPending = false;
        window.location.reload();
    }

    async function checkForUpdates() {
        if (!navigator.onLine || checking || Date.now() - lastCheck < 60 * 1000) return;
        checking = true;
        lastCheck = Date.now();
        try {
            // The registration check catches new service workers even when the app stays open.
            if (registration) await registration.update();
            // Also detect a changed release when the service worker itself is unchanged.
            const url = new URL("./app-config.js", document.baseURI);
            const response = await fetch(url, { cache: "no-store" });
            if (!response.ok) return;
            const source = await response.text();
            const match = source.match(/\bversion\s*:\s*["'](\d+\.\d+\.\d+)["']/);
            if (match && isNewerVersion(match[1])) refreshPending = true;
        } catch (_) {
            // Offline or temporarily unavailable GitHub Pages. Existing files remain usable.
        } finally {
            checking = false;
        }
    }

    function start() {
        if (started || !("serviceWorker" in navigator)) return;
        started = true;
        previouslyControlled = Boolean(navigator.serviceWorker.controller);

        navigator.serviceWorker.addEventListener("controllerchange", () => {
            if (previouslyControlled) refreshPending = true;
            previouslyControlled = true;
        });

        window.addEventListener("load", async () => {
            try {
                registration = await navigator.serviceWorker.register("./service-worker.js", {
                    updateViaCache: "none"
                });
                await checkForUpdates();
            } catch (error) {
                console.warn("Veilwatch update registration failed:", error);
            }
        }, { once: true });

        document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === "visible") {
                applyOnReturn();
                void checkForUpdates();
            }
        });
        window.addEventListener("focus", applyOnReturn);
        window.addEventListener("online", () => void checkForUpdates());
        window.setInterval(() => {
            if (document.visibilityState === "visible") void checkForUpdates();
        }, CHECK_INTERVAL_MS);
    }

    window.tosAppUpdates = Object.freeze({ start });
})();
