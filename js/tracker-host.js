(() => {
    "use strict";

    // ============================================================================
    // [JS-TRACKER-01] TRACKER DEFINITIONS
    // Paranormal Tracker and Affixer Matrix remain independent game-mode applications. The host owns
    // mounting, shared navigation, and persistence transport only.
    // ============================================================================

    const storage = window.tosStorage;

    const trackerDefinitions = Object.freeze({
        "paranormal-tracker": Object.freeze({
            title: "Paranormal Tracker",
            version: "2.3.1",
            src: "./trackers/paranormal-tracker/Index.html",
            storageKey: "tracker:paranormal-tracker:state"
        }),
        "affixer-matrix": Object.freeze({
            title: "Affixer Matrix",
            version: "1.4.1",
            src: "./trackers/affixer-matrix/cleanse.html",
            storageKey: "tracker:affixer-matrix:state"
        })
    });

    const runtimes = new Map();
    let activeTracker = null;
    let parkingRoot = null;

    function ensureParkingRoot() {
        if (parkingRoot) return parkingRoot;
        parkingRoot = document.createElement("div");
        parkingRoot.id = "trackerParking";
        parkingRoot.className = "tracker-parking";
        parkingRoot.hidden = true;
        parkingRoot.setAttribute("aria-hidden", "true");
        document.body.appendChild(parkingRoot);
        return parkingRoot;
    }

    function createRuntime(key) {
        const definition = trackerDefinitions[key];
        if (!definition) return null;

        const iframe = document.createElement("iframe");
        iframe.className = "protected-tracker-frame";
        iframe.title = `${definition.title} ${definition.version}`;
        iframe.src = definition.src;
        iframe.setAttribute("allow", "microphone");
        iframe.setAttribute("loading", "eager");

        const runtime = {
            key,
            definition,
            iframe,
            loaded: false,
            ready: false
        };

        iframe.addEventListener("load", () => {
            runtime.loaded = true;
            sendRestore(runtime);
        });

        runtimes.set(key, runtime);
        return runtime;
    }

    function getRuntime(key) {
        return runtimes.get(key) || createRuntime(key);
    }

    function post(runtime, payload) {
        if (!runtime?.iframe?.contentWindow) return false;
        try {
            runtime.iframe.contentWindow.postMessage(payload, "*");
            return true;
        } catch (error) {
            console.warn(`${runtime.definition.title} bridge post failed:`, error);
            return false;
        }
    }

    function sendRestore(runtime) {
        const saved = storage.readJson(runtime.definition.storageKey, null);
        post(runtime, {
            type: "tos:restore-state",
            tracker: runtime.key,
            componentVersion: runtime.definition.version,
            state: saved
        });
    }

    function requestState(runtime) {
        return post(runtime, {
            type: "tos:request-state",
            tracker: runtime.key
        });
    }

    function clearSavedState(runtime) {
        storage.remove(runtime.definition.storageKey);
        window.dispatchEvent(new CustomEvent("tos:tracker-reset", {
            detail: { tracker: runtime.key }
        }));
    }

    function runtimeForSource(source) {
        for (const runtime of runtimes.values()) {
            if (runtime.iframe.contentWindow === source) return runtime;
        }
        return null;
    }

    // ============================================================================
    // [JS-TRACKER-02] CROSS-DOCUMENT MESSAGE BRIDGE
    // postMessage is deliberately used instead of direct iframe DOM/eval access so
    // the app also works when index.html is opened directly from file://.
    // ============================================================================

    window.addEventListener("message", (event) => {
        const runtime = runtimeForSource(event.source);
        if (!runtime) return;

        const message = event.data;
        if (!message || typeof message !== "object" || message.tracker !== runtime.key) return;

        switch (message.type) {
            case "tos:tracker-ready":
                runtime.ready = true;
                sendRestore(runtime);
                break;

            case "tos:tracker-state":
                if (message.state && typeof message.state === "object") {
                    storage.writeJson(runtime.definition.storageKey, message.state);
                }
                break;

            case "tos:tracker-reset":
                clearSavedState(runtime);
                break;

            case "tos:navigate":
                if (typeof message.route === "string") {
                    window.dispatchEvent(new CustomEvent("tos:tracker-navigate", {
                        detail: {
                            tracker: runtime.key,
                            route: message.route,
                            action: typeof message.action === "string" ? message.action : null,
                            mapName: typeof message.mapName === "string" ? message.mapName : null
                        }
                    }));
                }
                break;

            case "tos:tracker-interaction":
                window.dispatchEvent(new CustomEvent("tos:tracker-interaction", {
                    detail: { tracker: runtime.key }
                }));
                break;

            default:
                break;
        }
    });

    // ============================================================================
    // [JS-TRACKER-03] MOUNTING + PARKING
    // ============================================================================

    function mount(key, mountPoint) {
        const runtime = getRuntime(key);
        if (!runtime || !mountPoint) return false;

        parkActiveTracker(key);
        mountPoint.replaceChildren(runtime.iframe);
        activeTracker = key;

        if (runtime.loaded) sendRestore(runtime);
        return true;
    }

    function parkActiveTracker(exceptKey = null) {
        const parking = ensureParkingRoot();

        for (const [key, runtime] of runtimes) {
            if (key === exceptKey) continue;
            if (runtime.iframe.isConnected && runtime.iframe.parentElement !== parking) {
                requestState(runtime);
                parking.appendChild(runtime.iframe);
            }
        }

        if (activeTracker && activeTracker !== exceptKey) activeTracker = null;
    }

    function beforeRouteChange(nextRoute) {
        if (!activeTracker || nextRoute === activeTracker) return;
        const runtime = runtimes.get(activeTracker);
        if (runtime) requestState(runtime);
        parkActiveTracker(null);
    }

    // ============================================================================
    // [JS-TRACKER-04] RESET + PAGE LIFECYCLE
    // ============================================================================

    function resetHostedTracker(key) {
        const runtime = runtimes.get(key);
        if (runtime?.loaded) {
            post(runtime, { type: "tos:reset-tracker", tracker: key });
        }

        const definition = trackerDefinitions[key];
        if (runtime) {
            clearSavedState(runtime);
        } else if (definition) {
            storage.remove(definition.storageKey);
            window.dispatchEvent(new CustomEvent("tos:tracker-reset", {
                detail: { tracker: key }
            }));
        }
    }

    function resetAllHostedTrackers() {
        resetHostedTracker("paranormal-tracker");
        resetHostedTracker("affixer-matrix");
        return { ok: true };
    }

    window.addEventListener("pagehide", () => {
        for (const runtime of runtimes.values()) requestState(runtime);
    });

    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState !== "hidden") return;
        for (const runtime of runtimes.values()) requestState(runtime);
    });

    window.tosTrackerHost = Object.freeze({
        mount,
        beforeRouteChange,
        parkActiveTracker,
        persistActive() {
            if (!activeTracker) return { ok: false, skipped: true };
            const runtime = runtimes.get(activeTracker);
            return { ok: requestState(runtime) };
        },
        resetAllHostedTrackers
    });
})();
