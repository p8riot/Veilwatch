(() => {
    "use strict";

    // ============================================================================
    // [JS-01] CONFIGURATION + ROUTE METADATA
    // ============================================================================

    const config = window.tosAllInOneConfig;
    const storage = window.tosStorage;
    const notes = window.tosNotes;
    const trackerHost = window.tosTrackerHost;
    const knowledge = window.tosKnowledge;
    const searchApi = window.tosSearch;
    const backupApi = window.tosBackup;

    const routeMeta = {
        home: { title: "Home", nav: true },
        pms: { title: "P.M.S. Tracker", nav: true, protectedTracker: true },
        ass: { title: "A.S.S. Profiler", nav: true, protectedTracker: true },
        encyclopedia: { title: "Ghost Encyclopedia", nav: true },
        "field-tools": { title: "Field Tools", nav: true },
        reference: { title: "Reference", nav: true },
        search: { title: "Global Search", nav: true },
        notes: { title: "My Notes", nav: true },
        maps: { title: "Maps", nav: true, comingSoon: true },
        settings: { title: "Settings", nav: true }
    };

    // ============================================================================
    // [JS-02] ROUTING
    // ============================================================================

    function routeFromHash() {
        const raw = window.location.hash.replace(/^#\/?/, "").trim();
        return config.routes.includes(raw) ? raw : null;
    }

    function navigate(route, { replace = false } = {}) {
        const safeRoute = config.routes.includes(route) ? route : config.defaultRoute;
        const currentRoute = document.body.dataset.route || routeFromHash();
        const leavingProtectedTracker = currentRoute === "pms" || currentRoute === "ass";
        const enteringSharedArea = !["home", "pms", "ass"].includes(safeRoute);

        if (leavingProtectedTracker && enteringSharedArea) {
            sharedOriginRoute = currentRoute;
        } else if (safeRoute === "home" || safeRoute === "pms" || safeRoute === "ass") {
            if (safeRoute !== sharedOriginRoute) {
                sharedOriginRoute = null;
            }
        }

        const nextHash = `#/${safeRoute}`;

        if (replace) {
            window.location.replace(nextHash);
            return;
        }

        if (window.location.hash !== nextHash) {
            window.location.hash = nextHash;
        } else {
            renderRoute(safeRoute);
        }
    }

    function resolveInitialRoute() {
        const hashRoute = routeFromHash();
        if (hashRoute) {
            return hashRoute;
        }

        return storage.getSettings().startupRoute;
    }

    // ============================================================================
    // [JS-03] THEME + ACCESSIBILITY SETTINGS
    // ============================================================================

    function applySettings(settings) {
        document.documentElement.dataset.theme = settings.theme;
        document.documentElement.classList.toggle("user-reduced-motion", settings.reducedMotion);
        document.documentElement.classList.toggle("user-larger-text", settings.largerText);
    }

    function syncSettingsForm(settings) {
        const startup = document.querySelector("#startupRoute");
        const theme = document.querySelector("#themeSelect");
        const reducedMotion = document.querySelector("#reducedMotion");
        const largerText = document.querySelector("#largerText");

        if (startup) startup.value = settings.startupRoute;
        if (theme) theme.value = settings.theme;
        if (reducedMotion) reducedMotion.checked = settings.reducedMotion;
        if (largerText) largerText.checked = settings.largerText;
    }


    // ============================================================================
    // [JS-04] KNOWLEDGE UI STATE + SAFE RENDER HELPERS
    // ============================================================================

    const knowledgeUi = {
        encyclopediaQuery: "",
        selectedGhost: null,
        referenceView: null
    };

    const searchUi = {
        query: "",
        filter: "all",
        results: []
    };

    let pendingNoteContext = null;
    let sharedOriginRoute = null;
    let deferredInstallPrompt = null;

    const sharedMapNames = Object.freeze([
        "St. Joseph's Orphanage",
        "Abaddon Hallows West",
        "Abaddon Hallows East",
        "Abaddon Hallows East (P)",
        "Summerhill Psychiatric",
        "Stone Manor Plantation",
        "317 Aspen Heights",
        "1205 Cedar Street",
        "12 Ravenwood Lane",
        "Blackmeadow",
        "The McGavin House"
    ]);
    const fieldToolsMapState = {
        selected: new Set(sharedMapNames),
        angle: 0,
        spinning: false,
        result: ""
    };

    function escapeHtml(value) {
        return String(value ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    function normalizeSearch(value) {
        return String(value || "").trim().toLowerCase();
    }

    function ghostByName(name) {
        return knowledge?.ghosts?.find((ghost) => ghost.name === name) || null;
    }

    function formatStatValue(value) {
        if (value === null || value === undefined || value === "") return "Not listed";
        return escapeHtml(value);
    }

    function matchingGhostNotes(name) {
        if (!notes) return [];
        const target = normalizeSearch(name);
        return notes.getPersistentNotes().filter((note) => {
            return note.context?.type === "ghost" && normalizeSearch(note.context?.label) === target;
        });
    }

    // ============================================================================
    // [JS-05] SCREEN TEMPLATES
    // ============================================================================

    function placeholder(title, message, badge = "Planned for 0.4.0") {
        return `
            <section class="screen-card placeholder-card" aria-labelledby="screenHeading">
                <span class="eyebrow">${badge}</span>
                <h1 id="screenHeading">${title}</h1>
                <p>${message}</p>
            </section>
        `;
    }

        function renderHome() {
        return `
            <section class="home-shell" aria-labelledby="screenHeading">
                <div class="home-overlay" aria-hidden="true"></div>

                <div class="home-content">
                    <header class="home-copy">
                        <span class="eyebrow">The Other Side · Unofficial Companion App</span>
                        <h1 id="screenHeading">Veilwatch</h1>
                        <p>Choose what you want to open.</p>
                    </header>

                    <div class="featured-launcher-grid" aria-label="Featured tools">
                        ${featuredLauncherCard(
                            "pms",
                            "P.M.S. Tracker",
                            "Identify Mode",
                            "./assets/cards/pms-tracker.png",
                            "P.M.S. Tracker app icon",
                            "pms"
                        )}
                        ${featuredLauncherCard(
                            "ass",
                            "A.S.S. Profiler",
                            "Cleanse Mode",
                            "./assets/cards/ass-profiler.png",
                            "A.S.S. Profiler app icon",
                            "ass"
                        )}
                        ${featuredLauncherCard(
                            "encyclopedia",
                            "Ghost Encyclopedia",
                            "Lore, stats and complete ghost information",
                            "./assets/cards/encyclopedia.png",
                            "Ghost Encyclopedia icon",
                            "encyclopedia"
                        )}
                    </div>

                    <div class="utility-launcher-grid" aria-label="More sections">
                        ${utilityLauncherCard("field-tools", "Field Tools", "Map picker and Spirit Box", "./assets/utility/field-tools.png")}
                        ${utilityLauncherCard("reference", "Reference", "Evidence, mechanics and equipment", "./assets/utility/reference.png")}
                        ${utilityLauncherCard("search", "Global Search", "Search the entire knowledge library", "./assets/utility/search.png")}
                        ${utilityLauncherCard("notes", "My Notes", "Persistent personal notes", "./assets/utility/notes.png")}
                        ${utilityLauncherCard("maps", "Maps", "Full map library", "./assets/utility/maps.png", true)}
                        ${utilityLauncherCard("settings", "Settings", "Startup, appearance and data", "./assets/utility/settings.png")}
                    </div>

                    <div class="community-launcher-row" aria-label="Community resource">
                        <div class="wiki-launcher-card">
                            <a class="wiki-launcher-icon-link" href="https://theotherside-game.fandom.com/wiki/The_Other_Side_Wiki" target="_blank" rel="noopener noreferrer" aria-label="Open the unofficial The Other Side Wiki by nena">
                                <img src="./assets/utility/wiki.png" alt="Doorway in the Veil icon">
                            </a>
                            <span>Wiki - by nena</span>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    function featuredLauncherCard(route, title, subtitle, imageSrc, imageAlt, variant) {
        const visual = imageSrc
            ? `<img class="featured-card__image" src="${imageSrc}" alt="${imageAlt}">`
            : `<span class="featured-card__placeholder" aria-hidden="true">ENC</span>`;

        return `
            <button class="featured-card featured-card--${variant}" type="button" data-route="${route}">
                <span class="featured-card__visual">${visual}</span>
                <span class="featured-card__copy">
                    <strong>${title}</strong>
                    <span>${subtitle}</span>
                </span>
            </button>
        `;
    }

    function utilityLauncherCard(route, title, subtitle, imageSrc, disabled = false) {
        const disabledClass = disabled ? " utility-card--disabled" : "";
        const disabledAttr = disabled ? ' aria-disabled="true"' : '';
        const routeAttr = disabled ? "" : ` data-route="${route}"`;
        const status = disabled ? '<span class="utility-card__status">Coming Soon</span>' : "";

        return `
            <button class="utility-card${disabledClass}" type="button"${routeAttr}${disabledAttr}>
                <span class="utility-card__icon-wrap" aria-hidden="true"><img class="utility-card__icon" src="${imageSrc}" alt=""></span>
                <span class="utility-card__copy">
                    <strong>${title}</strong>
                    <span>${subtitle}</span>
                </span>
                ${status}
            </button>
        `;
    }


    function renderFieldTools() {
        const selectedCount = fieldToolsMapState.selected.size;
        const phrases = knowledge?.spiritBox?.phrases || [];
        return `
            <section class="field-tools-screen" aria-labelledby="screenHeading">
                <header class="knowledge-heading">
                    <div>
                        <span class="eyebrow">Shared utilities</span>
                        <h1 id="screenHeading">Field Tools</h1>
                        <p>Shared utilities live here instead of being duplicated inside P.M.S. and A.S.S.</p>
                    </div>
                </header>

                <div class="field-tools-grid">
                    <article class="field-tool-card field-tool-card--wide">
                        <h2>Map Picker</h2>
                        <p>This random picker is available now. The full interactive map library remains Coming Soon.</p>
                        <div class="shared-map-wheel-wrap">
                            <canvas id="sharedMapWheel" class="shared-map-wheel" width="420" height="420" aria-label="Random map picker wheel"></canvas>
                        </div>
                        <div class="shared-map-filter-header">
                            <strong id="sharedMapSelectionCount">${selectedCount} of ${sharedMapNames.length} maps included</strong>
                            <div class="shared-map-filter-actions">
                                <button class="secondary-button" id="sharedMapAll" type="button">All</button>
                                <button class="secondary-button" id="sharedMapNone" type="button">None</button>
                            </div>
                        </div>
                        <div class="shared-map-toggle-grid" id="sharedMapToggleGrid">
                            ${sharedMapNames.map((name) => `<button class="shared-map-toggle" type="button" data-shared-map="${escapeHtml(name)}" aria-pressed="${fieldToolsMapState.selected.has(name)}">${escapeHtml(name)}</button>`).join("")}
                        </div>
                        <div class="shared-map-actions">
                            <button class="primary-button" id="sharedMapSpin" type="button">Spin Wheel</button>
                        </div>
                        <div id="sharedMapResult" class="shared-map-result" aria-live="polite">${escapeHtml(fieldToolsMapState.result)}</div>
                    </article>

                    <article class="field-tool-card">
                        <h2>Spirit Box Phrases</h2>
                        <div class="shared-spirit-grid">
                            ${phrases.map((phrase) => `<span class="shared-spirit-phrase">${escapeHtml(phrase)}</span>`).join("")}
                        </div>
                    </article>
                </div>
            </section>
        `;
    }

    function drawSharedMapWheel() {
        const canvas = document.querySelector("#sharedMapWheel");
        if (!canvas) return;
        const context = canvas.getContext("2d");
        const maps = sharedMapNames.filter((name) => fieldToolsMapState.selected.has(name));
        const size = canvas.width;
        const center = size / 2;
        const radius = center - 8;
        context.clearRect(0, 0, size, size);

        if (!maps.length) {
            context.fillStyle = "rgba(255, 255, 255, 0.08)";
            context.beginPath();
            context.arc(center, center, radius, 0, Math.PI * 2);
            context.fill();
            context.fillStyle = "#f4f7fa";
            context.font = "600 18px system-ui";
            context.textAlign = "center";
            context.fillText("Select at least one map", center, center);
            return;
        }

        const slice = (Math.PI * 2) / maps.length;
        maps.forEach((name, index) => {
            const start = fieldToolsMapState.angle + index * slice - Math.PI / 2;
            const end = start + slice;
            context.beginPath();
            context.moveTo(center, center);
            context.arc(center, center, radius, start, end);
            context.closePath();
            context.fillStyle = index % 2 === 0 ? "#182b3a" : "#263746";
            context.fill();
            context.strokeStyle = "rgba(255, 255, 255, 0.18)";
            context.stroke();

            context.save();
            context.translate(center, center);
            context.rotate(start + slice / 2);
            context.textAlign = "right";
            context.fillStyle = "#ffffff";
            context.font = "600 13px system-ui";
            const label = name.length > 24 ? `${name.slice(0, 22)}…` : name;
            context.fillText(label, radius - 16, 5);
            context.restore();
        });
    }

    function updateSharedMapControls() {
        const count = document.querySelector("#sharedMapSelectionCount");
        const spin = document.querySelector("#sharedMapSpin");
        if (count) count.textContent = `${fieldToolsMapState.selected.size} of ${sharedMapNames.length} maps included`;
        if (spin) spin.disabled = fieldToolsMapState.spinning || fieldToolsMapState.selected.size === 0;
        document.querySelectorAll("[data-shared-map]").forEach((button) => {
            button.setAttribute("aria-pressed", String(fieldToolsMapState.selected.has(button.dataset.sharedMap)));
            button.disabled = fieldToolsMapState.spinning;
        });
        drawSharedMapWheel();
    }

    function spinSharedMapWheel() {
        if (fieldToolsMapState.spinning) return;
        const maps = sharedMapNames.filter((name) => fieldToolsMapState.selected.has(name));
        if (!maps.length) return;

        fieldToolsMapState.spinning = true;
        fieldToolsMapState.result = "";
        updateSharedMapControls();
        const result = document.querySelector("#sharedMapResult");
        if (result) result.textContent = "Spinning…";

        const tau = Math.PI * 2;
        const slice = tau / maps.length;
        const winnerIndex = Math.floor(Math.random() * maps.length);
        const winner = maps[winnerIndex];
        const startAngle = fieldToolsMapState.angle;

        // Pick the winner first, then animate the wheel so that the center of that
        // exact slice finishes under the fixed top pointer. The result text uses
        // the same preselected winner, so the visual wheel and readout cannot diverge.
        const desiredAngle = -(winnerIndex + 0.5) * slice;
        const normalizeAngle = (angle) => ((angle % tau) + tau) % tau;
        const alignmentDelta = (normalizeAngle(desiredAngle) - normalizeAngle(startAngle) + tau) % tau;
        const target = startAngle + (tau * 5) + alignmentDelta;
        const start = performance.now();
        const duration = 1800;

        function frame(now) {
            const t = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            fieldToolsMapState.angle = startAngle + (target - startAngle) * eased;
            drawSharedMapWheel();
            if (t < 1) {
                requestAnimationFrame(frame);
                return;
            }

            fieldToolsMapState.angle = target;
            fieldToolsMapState.spinning = false;
            fieldToolsMapState.result = `Destination: ${winner}`;
            if (result) result.textContent = fieldToolsMapState.result;
            updateSharedMapControls();
        }

        requestAnimationFrame(frame);
    }

    function bindFieldTools() {
        document.querySelectorAll("[data-shared-map]").forEach((button) => {
            button.addEventListener("click", () => {
                const name = button.dataset.sharedMap;
                if (fieldToolsMapState.selected.has(name)) fieldToolsMapState.selected.delete(name);
                else fieldToolsMapState.selected.add(name);
                fieldToolsMapState.result = "";
                const result = document.querySelector("#sharedMapResult");
                if (result) result.textContent = "";
                updateSharedMapControls();
            });
        });

        document.querySelector("#sharedMapAll")?.addEventListener("click", () => {
            sharedMapNames.forEach((name) => fieldToolsMapState.selected.add(name));
            updateSharedMapControls();
        });

        document.querySelector("#sharedMapNone")?.addEventListener("click", () => {
            fieldToolsMapState.selected.clear();
            fieldToolsMapState.result = "";
            const result = document.querySelector("#sharedMapResult");
            if (result) result.textContent = "Select at least one map.";
            updateSharedMapControls();
        });

        document.querySelector("#sharedMapSpin")?.addEventListener("click", spinSharedMapWheel);
        updateSharedMapControls();
    }


    function renderEncyclopedia() {
        if (!knowledge?.ghosts?.length) {
            return placeholder("Ghost Encyclopedia", "Knowledge data is unavailable.", "Data unavailable");
        }

        if (knowledgeUi.selectedGhost) {
            const ghost = ghostByName(knowledgeUi.selectedGhost);
            if (ghost) return renderGhostProfile(ghost);
            knowledgeUi.selectedGhost = null;
        }

        const query = normalizeSearch(knowledgeUi.encyclopediaQuery);
        const filtered = knowledge.ghosts.filter((ghost) => {
            if (!query) return true;
            const text = [ghost.name, ghost.lore, ...(ghost.ev || []), ...(ghost.desc || [])].join(" ").toLowerCase();
            return text.includes(query);
        });

        return `
            <section class="knowledge-screen encyclopedia-screen" aria-labelledby="screenHeading">
                <header class="knowledge-heading">
                    <div>
                        <span class="eyebrow">Shared read-only knowledge</span>
                        <h1 id="screenHeading">Ghost Encyclopedia</h1>
                        <p>${knowledge.metadata.ghostCount} ghost profiles sourced from the protected P.M.S. ${escapeHtml(knowledge.metadata.pms.version)} baseline.</p>
                    </div>
                </header>

                <div class="knowledge-toolbar">
                    <label for="encyclopediaSearch">Search ghosts</label>
                    <input id="encyclopediaSearch" type="search" value="${escapeHtml(knowledgeUi.encyclopediaQuery)}" placeholder="Name, evidence, lore or behavior" autocomplete="off">
                    <span id="encyclopediaCount" class="knowledge-count">${filtered.length} shown</span>
                </div>

                <div id="ghostIndex" class="ghost-index">
                    ${filtered.length ? filtered.map(renderGhostIndexCard).join("") : '<p class="knowledge-empty">No ghost profiles match this search.</p>'}
                </div>
            </section>
        `;
    }

    function renderGhostIndexCard(ghost) {
        const evidence = (ghost.ev || []).map((item) => `<span class="knowledge-chip">${escapeHtml(item)}</span>`).join("");
        return `
            <button class="ghost-index-card" type="button" data-ghost-name="${escapeHtml(ghost.name)}">
                <span class="ghost-index-card__top">
                    <strong>${escapeHtml(ghost.name)}</strong>
                    ${ghost.forced ? `<span class="forced-badge">Forced: ${escapeHtml(ghost.forced)}</span>` : ""}
                </span>
                <span class="ghost-index-card__evidence">${evidence}</span>
                <span class="ghost-index-card__summary">${escapeHtml((ghost.lore || "").slice(0, 180))}</span>
                <span class="ghost-index-card__action">Open profile</span>
            </button>
        `;
    }

    function renderGhostProfile(ghost) {
        const persistent = matchingGhostNotes(ghost.name);
        const speedConfig = knowledge.pmsStats?.speedConfig || {};
        const gameRules = knowledge.pmsStats?.gameRules || {};
        const starred = new Set(ghost.starred || []);
        const speedLabel = (key, value) => `${value}${starred.has(key) ? "*" : ""}`;
        const toMps = (cmps) => Number.isFinite(Number(cmps)) ? `${(Number(cmps) / 100).toFixed(2)} m/s` : null;
        const baseCmps = ghost.speedProfile?.base?.cmps ?? speedConfig.base?.[ghost.speed]?.cmps;
        const losCmps = speedConfig.los?.[ghost.losspeed]?.cmps;
        const baseDisplay = baseCmps ? `${speedLabel("speed", ghost.speed)} (${toMps(baseCmps)})` : speedLabel("speed", ghost.speed);
        const losDisplay = ghost.speedProfile?.los?.display
            ? `${speedLabel("losspeed", ghost.losspeed)} • ${ghost.speedProfile.los.display}`
            : (losCmps ? `${speedLabel("losspeed", ghost.losspeed)} (${toMps(losCmps)})` : speedLabel("losspeed", ghost.losspeed));
        const losMeters = speedConfig.losRangeMeters?.[ghost.los];
        const holySeconds = speedConfig.holySeconds?.[ghost.hw];
        const cooldownSeconds = speedConfig.cooldownSeconds?.[ghost.cooldown];
        const standardHuntBpm = gameRules.heartRate?.allGhostThreshold || 100;
        const huntBpm = Number(ghost.huntThresholdBpm) || standardHuntBpm;
        const stats = [
            ["Base Speed", baseDisplay],
            ["LOS Speed", losDisplay],
            ["LOS Range", `${speedLabel("los", ghost.los)}${Number.isFinite(Number(losMeters)) ? ` (${losMeters}m)` : ""}`],
            ["Holy Water", `${speedLabel("hw", ghost.hw)}${Number.isFinite(Number(holySeconds)) ? ` (${holySeconds}s)` : ""}`],
            ["Hunt Cooldown", `${speedLabel("cooldown", ghost.cooldown)}${Number.isFinite(Number(cooldownSeconds)) ? ` (${cooldownSeconds}s)` : ""}`],
            ["Natural Hunt Threshold", `${huntBpm} BPM${huntBpm < standardHuntBpm ? " (Early)" : " (Standard)"}`]
        ];

        const special = [];
        if (ghost.forced) special.push(`<li><strong>Forced Evidence:</strong> ${escapeHtml(ghost.forced)}</li>`);
        if (ghost.huntThresholdBpm) special.push(`<li><strong>Natural Hunt Threshold:</strong> ${escapeHtml(ghost.huntThresholdBpm)} BPM average team heart rate</li>`);
        if (ghost.huntBehaviorMimic) special.push('<li><strong>Hunt Mimic:</strong> This ghost uses the P.M.S. hunt-behavior mimic rule. See Unique Behaviors for the exact limits.</li>');
        if (ghost.specialDiminishing) special.push(`<li><strong>Special Diminishing Rule:</strong> May provide ${escapeHtml(ghost.specialDiminishingExtra || 1)} extra behavior-generated Diminishing evidence.</li>`);

        return `
            <article class="knowledge-screen ghost-profile" aria-labelledby="screenHeading">
                <header class="profile-header">
                    <button class="knowledge-back" type="button" data-knowledge-back="encyclopedia">← Encyclopedia</button>
                    <span class="eyebrow">Ghost profile</span>
                    <h1 id="screenHeading">${escapeHtml(ghost.name)}</h1>
                    <p>${escapeHtml(ghost.lore || "")}</p>
                </header>

                <section class="profile-section" aria-labelledby="ghostEvidenceHeading">
                    <h2 id="ghostEvidenceHeading">Evidence</h2>
                    <div class="profile-evidence-grid">
                        ${(ghost.ev || []).map((item) => `<button type="button" class="knowledge-chip knowledge-chip--button" data-reference-evidence="${escapeHtml(item)}">${escapeHtml(item)}</button>`).join("")}
                    </div>
                </section>

                <section class="profile-section" aria-labelledby="ghostStatsHeading">
                    <h2 id="ghostStatsHeading">Identification Stats</h2>
                    <dl class="stat-grid">
                        ${stats.map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${formatStatValue(value)}</dd></div>`).join("")}
                    </dl>
                </section>

                <section class="profile-section" aria-labelledby="ghostBehaviorHeading">
                    <h2 id="ghostBehaviorHeading">Unique Behaviors</h2>
                    <ul class="knowledge-list">${(ghost.desc || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
                </section>

                <section class="profile-section" aria-labelledby="ghostInteractionHeading">
                    <h2 id="ghostInteractionHeading">Interaction Behaviors</h2>
                    <dl class="behavior-grid">
                        ${Object.entries(ghost.interactionBehaviors || {}).map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`).join("")}
                    </dl>
                </section>

                ${special.length ? `<section class="profile-section"><h2>Special Rules</h2><ul class="knowledge-list">${special.join("")}</ul></section>` : ""}

                ${ghost.realWorldLore ? `
                    <section class="profile-section">
                        <h2>Real-World Lore</h2>
                        <p class="profile-kicker">${escapeHtml(ghost.realWorldLore.origin)}</p>
                        <p>${escapeHtml(ghost.realWorldLore.summary)}</p>
                    </section>
                ` : ""}

                <section class="profile-section" aria-labelledby="ghostNotesHeading">
                    <div class="profile-section-heading">
                        <div>
                            <h2 id="ghostNotesHeading">My Notes</h2>
                            <p>Personal notes are kept separate from official reference information.</p>
                        </div>
                        <button class="primary-button" type="button" data-new-context-note="ghost" data-context-label="${escapeHtml(ghost.name)}">Add Note</button>
                    </div>
                    ${persistent.length ? `<div class="context-note-list">${persistent.map((note) => `<button type="button" data-open-note="${escapeHtml(note.id)}"><strong>${escapeHtml(note.title)}</strong><span>${escapeHtml((note.body || "").replace(/\\s+/g, " ").slice(0, 150) || "No text")}</span></button>`).join("")}</div>` : '<p class="knowledge-empty">No personal notes for this ghost yet.</p>'}
                </section>
            </article>
        `;
    }

    function referenceCategoryCard(view, title, description, count = "") {
        return `
            <button type="button" class="reference-category-card" data-reference-view="${view}">
                <strong>${escapeHtml(title)}</strong>
                <span>${escapeHtml(description)}</span>
                ${count ? `<small>${escapeHtml(count)}</small>` : ""}
            </button>
        `;
    }

    function renderReference() {
        if (knowledgeUi.referenceView) return renderReferenceDetail(knowledgeUi.referenceView);

        return `
            <section class="knowledge-screen reference-screen" aria-labelledby="screenHeading">
                <header class="knowledge-heading">
                    <div>
                        <span class="eyebrow">Canonical shared library</span>
                        <h1 id="screenHeading">Reference</h1>
                        <p>Read-only reference material sourced from the protected P.M.S. 2.3.1 and A.S.S. 1.4.1 baselines. Reading Reference never changes either tracker.</p>
                    </div>
                </header>
                <div class="reference-category-grid">
                    ${referenceCategoryCard("evidence", "Evidence", "Identify evidence plus A.S.S. evidence levels.", `${knowledge.evidence.length} types`)}
                    ${referenceCategoryCard("behaviors", "Behaviors", "P.M.S. behavior observations and states.", `${knowledge.behaviors.length} controls`)}
                    ${referenceCategoryCard("spirit-box", "Spirit Box", "Canonical phrases and Skia unique responses.", `${knowledge.spiritBox.phrases.length} phrases`)}
                    ${referenceCategoryCard("cleansing", "Cleansing", "A.S.S. investigation, scanner and cleansing field notes.")}
                    ${referenceCategoryCard("equipment", "Equipment", "Affixer commands, scan states and E.A.L. guidance.")}
                    ${referenceCategoryCard("mechanics", "Mechanics", "Hunts, evidence rules, breakers, candles and more.", `${knowledge.mechanics.length} notes`)}
                    ${referenceCategoryCard("locations", "Locations", "Supported locations. Map artwork remains Coming Soon.", `${knowledge.locations.length} locations`)}
                    ${referenceCategoryCard("special", "Special References", "Iblis shapeshifting and other ghost-specific reference material.")}
                </div>
            </section>
        `;
    }

    function renderReferenceDetail(view) {
        let title = "Reference";
        let body = "";

        if (view.startsWith("evidence:")) {
            const name = view.slice(9);
            const entry = knowledge.evidence.find((item) => item.name === name);
            if (entry) {
                title = entry.name;
                body = renderEvidenceReference(entry);
            } else {
                knowledgeUi.referenceView = "evidence";
                return renderReferenceDetail("evidence");
            }
        } else {
            switch (view) {
                case "evidence":
                    title = "Evidence";
                    body = `<div class="reference-item-grid">${knowledge.evidence.map((entry) => `
                        <button type="button" class="reference-item-card" data-reference-evidence="${escapeHtml(entry.name)}">
                            <strong>${escapeHtml(entry.name)}</strong>
                            <span>P.M.S.: ${escapeHtml(entry.identifyLabel)}</span>
                            <small>A.S.S.: ${escapeHtml(entry.cleanseName)}</small>
                        </button>`).join("")}</div>`;
                    break;
                case "behaviors":
                    title = "Behaviors";
                    body = `<div class="reference-stack">${knowledge.behaviors.map((item) => `<article class="reference-article"><h3>${escapeHtml(item.name)}</h3><div class="chip-row">${item.states.map((state) => `<span class="knowledge-chip">${escapeHtml(state)}</span>`).join("")}</div></article>`).join("")}</div>`;
                    break;
                case "spirit-box":
                    title = "Spirit Box";
                    body = `<article class="reference-article"><h3>Canonical Phrases</h3><div class="phrase-grid">${knowledge.spiritBox.phrases.map((phrase) => `<span>${escapeHtml(phrase)}</span>`).join("")}</div></article><article class="reference-article"><h3>Skia Unique Audio Responses</h3><ul class="knowledge-list">${knowledge.spiritBox.skiaUniqueResponses.map((x) => `<li>${escapeHtml(x)}</li>`).join("")}</ul></article>`;
                    break;
                case "cleansing":
                    title = "Cleansing";
                    body = knowledge.cleansing.fieldNotes.map((group) => `<article class="reference-article"><h3>${escapeHtml(group.title)}</h3><ul class="knowledge-list">${group.items.map((x) => `<li>${escapeHtml(x)}</li>`).join("")}</ul></article>`).join("");
                    break;
                case "equipment": {
                    title = "Equipment";
                    const groups = knowledge.cleansing.fieldNotes.filter((group) => /Affixer|Scan Status|System, Logic/i.test(group.title));
                    body = groups.map((group) => `<article class="reference-article"><h3>${escapeHtml(group.title)}</h3><ul class="knowledge-list">${group.items.map((x) => `<li>${escapeHtml(x)}</li>`).join("")}</ul></article>`).join("");
                    break;
                }
                case "mechanics":
                    title = "Mechanics";
                    body = `<div class="reference-stack">${knowledge.mechanics.map((item) => `<article class="reference-article"><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.text)}</p></article>`).join("")}${knowledge.heartRateRanges.length ? `<article class="reference-article"><h3>Heart Rate Status Ranges</h3><ul class="knowledge-list">${knowledge.heartRateRanges.map((x) => `<li>${escapeHtml(x)}</li>`).join("")}</ul></article>` : ""}</div>`;
                    break;
                case "locations":
                    title = "Locations";
                    body = `<div class="location-reference-grid">${knowledge.locations.map((location) => `<article><strong>${escapeHtml(location)}</strong><span>Reference location</span></article>`).join("")}</div><div class="coming-soon-inline"><strong>Maps are Coming Soon.</strong><span>The location list is available now, but map artwork and the map viewer remain disabled in 0.2.0.</span></div>`;
                    break;
                case "special":
                    title = "Special References";
                    body = `<article class="reference-article"><h3>Iblis Shapeshifting Information</h3><ul class="knowledge-list">${knowledge.specialReferences.iblisShapeshifting.map((x) => `<li>${escapeHtml(x)}</li>`).join("")}</ul></article><article class="reference-article"><h3>Skia Unique Audio Responses</h3><ul class="knowledge-list">${knowledge.spiritBox.skiaUniqueResponses.map((x) => `<li>${escapeHtml(x)}</li>`).join("")}</ul></article>`;
                    break;
                default:
                    knowledgeUi.referenceView = null;
                    return renderReference();
            }
        }

        return `
            <section class="knowledge-screen reference-detail" aria-labelledby="screenHeading">
                <header class="profile-header">
                    <button class="knowledge-back" type="button" data-knowledge-back="reference">← Reference</button>
                    <span class="eyebrow">Shared reference</span>
                    <h1 id="screenHeading">${escapeHtml(title)}</h1>
                </header>
                <div class="reference-detail-body">${body}</div>
            </section>
        `;
    }

    function renderEvidenceReference(entry) {
        const levels = entry.cleanseLevels?.length
            ? `<ol class="evidence-level-list">${entry.cleanseLevels.map((level) => `<li><strong>Level ${escapeHtml(level.level)}</strong><span>${escapeHtml(level.text)}</span></li>`).join("")}</ol>`
            : '<p class="knowledge-empty">No A.S.S. level data is listed for this evidence.</p>';
        return `
            <div class="reference-stack">
                <article class="reference-article">
                    <h3>P.M.S. Identify Reference</h3>
                    <dl class="compact-definition-list">
                        <div><dt>Tracker label</dt><dd>${escapeHtml(entry.identifyLabel)}</dd></div>
                        <div><dt>Diminishing allowed</dt><dd>${entry.diminishingAllowed ? "Yes" : "No"}</dd></div>
                        <div><dt>Voice aliases</dt><dd>${entry.aliases.map(escapeHtml).join(", ")}</dd></div>
                    </dl>
                </article>
                <article class="reference-article">
                    <h3>A.S.S. Cleanse Reference: ${escapeHtml(entry.cleanseName)}</h3>
                    ${levels}
                </article>
            </div>
        `;
    }


        function renderProtectedTracker(route, label) {
        return `
            <section class="tracker-screen" aria-label="${label}">
                <div class="tracker-frame-mount" data-tracker-mount="${route}"></div>

                <div class="tracker-shell-controls" aria-label="Veilwatch controls">
                    <button class="tracker-shell-button" type="button" data-route="home">Home</button>
                    <details class="tracker-tools-menu">
                        <summary class="tracker-shell-button">Tools</summary>
                        <div class="tracker-tools-panel">
                            <button type="button" data-investigation-notes="${route}">Investigation Notes</button>
                            <button type="button" data-route="field-tools">Field Tools</button>
                            <button type="button" data-route="notes">My Notes</button>
                            <button type="button" data-route="encyclopedia">Ghost Encyclopedia</button>
                            <button type="button" data-route="reference">Reference</button>
                            <button type="button" data-route="search">Global Search</button>
                            <button type="button" data-route="settings">Settings</button>
                        </div>
                    </details>
                </div>
            </section>
        `;
    }

        function renderSettings() {
        const settings = storage.getSettings();
        return `
            <section class="screen-card settings-screen" aria-labelledby="screenHeading">
                <span class="eyebrow">Veilwatch preferences</span>
                <h1 id="screenHeading">Settings</h1>
                <p class="settings-intro">These settings control the Veilwatch shell. P.M.S. and A.S.S. keep their own existing internal settings and behavior.</p>

                <form id="settingsForm" class="settings-form">
                    <section class="settings-section" aria-labelledby="startupSettingsHeading">
                        <div class="settings-section__heading">
                            <span class="eyebrow">Startup</span>
                            <h2 id="startupSettingsHeading">Launch Behavior</h2>
                        </div>

                        <div class="setting-group">
                            <label for="startupRoute">Open app to</label>
                            <select id="startupRoute" name="startupRoute">
                                <option value="home">Home</option>
                                <option value="pms">P.M.S. Tracker</option>
                                <option value="ass">A.S.S. Profiler</option>
                                <option value="encyclopedia">Ghost Encyclopedia</option>
                                <option value="field-tools">Field Tools</option>
                                <option value="reference">Reference</option>
                                <option value="notes">My Notes</option>
                            </select>
                            <p class="setting-help">Maps is intentionally unavailable as a launch destination while it is Coming Soon.</p>
                        </div>
                    </section>

                    <section class="settings-section" aria-labelledby="appearanceSettingsHeading">
                        <div class="settings-section__heading">
                            <span class="eyebrow">Appearance</span>
                            <h2 id="appearanceSettingsHeading">Shell Appearance</h2>
                        </div>

                        <div class="setting-group">
                            <label for="themeSelect">Color theme</label>
                            <select id="themeSelect" name="theme">
                                <option value="midnight">Midnight</option>
                                <option value="blue-hour">Blue Hour</option>
                                <option value="ash">Ash</option>
                                <option value="blood-moon">Blood Moon</option>
                                <option value="violet-veil">Violet Veil</option>
                                <option value="ectoplasm">Ectoplasm</option>
                                <option value="candlelight">Candlelight</option>
                                <option value="forest-haunt">Forest Haunt</option>
                                <option value="sepia">Antique Sepia</option>
                                <option value="neon-occult">Neon Occult</option>
                                <option value="ghost-light">Ghost Light</option>
                                <option value="moonlit-rose">Moonlit Rose</option>
                                <option value="storm-signal">Storm Signal</option>
                                <option value="graveyard-moss">Graveyard Moss</option>
                                <option value="ember-glow">Ember Glow</option>
                                <option value="arcane-gold">Arcane Gold</option>
                                <option value="high-contrast">High Contrast</option>
                            </select>
                        </div>

                        <label class="toggle-row">
                            <input id="reducedMotion" name="reducedMotion" type="checkbox">
                            <span>
                                <strong>Reduce motion</strong>
                                <small>Minimizes decorative transitions in the Veilwatch shell.</small>
                            </span>
                        </label>

                        <label class="toggle-row">
                            <input id="largerText" name="largerText" type="checkbox">
                            <span>
                                <strong>Larger shell text</strong>
                                <small>Increases text size in new Veilwatch screens. It does not alter P.M.S. or A.S.S.</small>
                            </span>
                        </label>

                        <div class="settings-actions">
                            <button class="primary-button" type="submit">Save Settings</button>
                            <button class="secondary-button" id="resetSettings" type="button">Reset Settings</button>
                        </div>
                        <p id="settingsStatus" class="status-message" role="status" aria-live="polite"></p>
                    </section>
                </form>

                <section class="settings-section" aria-labelledby="installSettingsHeading">
                    <div class="settings-section__heading">
                        <span class="eyebrow">Install</span>
                        <h2 id="installSettingsHeading">Install Veilwatch</h2>
                        <p id="installSupportText">Install Veilwatch for faster launching, app-style navigation, and offline access when hosted from a supported web server.</p>
                    </div>

                    <div class="backup-actions">
                        <button class="primary-button" id="installAppButton" type="button">Install App</button>
                        <button class="secondary-button" id="installHelpButton" type="button">Installation Help</button>
                    </div>
                    <p id="installStatus" class="status-message" role="status" aria-live="polite"></p>

                    <div id="installHelpCard" class="backup-import-card" hidden>
                        <div id="installInstructions" class="setting-help"></div>
                    </div>
                </section>

                <section class="settings-section" aria-labelledby="backupSettingsHeading">
                    <div class="settings-section__heading">
                        <span class="eyebrow">Data</span>
                        <h2 id="backupSettingsHeading">Backup & Restore</h2>
                        <p>Backups include persistent My Notes and, for a full backup, Veilwatch settings. Active investigation notes and temporary tracker state are intentionally excluded.</p>
                    </div>

                    <div class="backup-actions">
                        <button class="primary-button" id="exportBackup" type="button">Export Backup</button>
                        <button class="secondary-button" id="exportNotesOnly" type="button">Export Notes Only</button>
                    </div>

                    <div class="backup-import-card">
                        <label class="file-picker-label" for="backupFile">Choose backup file</label>
                        <input id="backupFile" type="file" accept=".json,application/json">
                        <p id="backupValidationStatus" class="status-message" role="status" aria-live="polite">No backup selected.</p>

                        <div id="backupSummary" class="backup-summary" hidden></div>

                        <fieldset id="backupImportMode" class="backup-mode" disabled>
                            <legend>Import mode</legend>
                            <label>
                                <input type="radio" name="backupMode" value="merge" checked>
                                <span><strong>Merge</strong><small>Keep current My Notes and add the backup. Conflicting note IDs are preserved as separate notes.</small></span>
                            </label>
                            <label>
                                <input type="radio" name="backupMode" value="replace">
                                <span><strong>Replace</strong><small>Replace all current My Notes with the backup. Full backups also restore the backed-up Veilwatch settings.</small></span>
                            </label>
                        </fieldset>

                        <button class="primary-button" id="importBackup" type="button" disabled>Import Backup</button>
                        <p id="backupImportStatus" class="status-message" role="status" aria-live="polite"></p>
                    </div>
                </section>

                <section class="settings-section settings-section--danger" aria-labelledby="dataManagementHeading">
                    <div class="settings-section__heading">
                        <span class="eyebrow">Data management</span>
                        <h2 id="dataManagementHeading">Reset & Delete</h2>
                        <p>These actions are intentionally separate so resetting preferences cannot accidentally erase permanent notes.</p>
                    </div>

                    <div class="danger-action-list">
                        <div class="danger-action-row">
                            <div>
                                <strong>Delete Persistent Notes</strong>
                                <p>Deletes every item in My Notes. Tracker state and settings are not affected.</p>
                            </div>
                            <button class="danger-button" id="deletePersistentNotes" type="button">Delete My Notes</button>
                        </div>

                        <div class="danger-action-row danger-action-row--strong">
                            <div>
                                <strong>Full App Reset</strong>
                                <p>Resets Veilwatch settings, persistent notes, both investigation notes, and saved P.M.S./A.S.S. investigation sessions. Protected tracker source files are never modified.</p>
                            </div>
                            <button class="danger-button" id="fullAppReset" type="button">Full App Reset</button>
                        </div>
                    </div>
                    <p id="dataManagementStatus" class="status-message" role="status" aria-live="polite"></p>
                </section>

                <section class="settings-section" aria-labelledby="aboutSettingsHeading">
                    <div class="settings-section__heading">
                        <span class="eyebrow">About</span>
                        <h2 id="aboutSettingsHeading">Veilwatch</h2>
                    </div>
                    <dl class="settings-about-grid settings-about-grid--compact">
                        <div><dt>Version</dt><dd>${escapeHtml(config.version)}</dd></div>
                    </dl>
                    <p class="setting-help">Created by <a href="https://linktr.ee/p8riot" target="_blank" rel="noopener noreferrer">p8riot</a> using his p8Core App Builder.</p>
                    <p class="setting-help">A product of <a href="https://www.youtube.com/@themidnightwirehq" target="_blank" rel="noopener noreferrer">The Midnight Wire HQ</a>.</p>
                </section>
            </section>
        `;
    }

    function renderNotes() {
        return `
            <section class="notes-screen" aria-labelledby="screenHeading">
                <header class="notes-heading">
                    <div>
                        <span class="eyebrow">Saved locally</span>
                        <h1 id="screenHeading">My Notes</h1>
                        <p>Permanent personal notes that survive P.M.S. and A.S.S. resets.</p>
                    </div>
                    <button class="primary-button" id="newNoteButton" type="button">New Note</button>
                </header>

                <div class="notes-workspace">
                    <aside class="notes-sidebar" aria-label="Saved notes">
                        <label class="notes-search-label" for="notesSearch">Search my notes</label>
                        <input id="notesSearch" class="notes-search" type="search" placeholder="Search titles, text or context" autocomplete="off">
                        <div id="notesList" class="notes-list"></div>
                    </aside>

                    <section class="note-editor" aria-labelledby="noteEditorHeading">
                        <div class="note-editor-heading">
                            <div>
                                <span class="eyebrow">Persistent note</span>
                                <h2 id="noteEditorHeading">New Note</h2>
                            </div>
                            <span id="noteDirtyStatus" class="note-dirty-status" aria-live="polite"></span>
                        </div>

                        <form id="noteForm" class="note-form">
                            <input id="noteId" name="noteId" type="hidden">

                            <label for="noteTitle">Title</label>
                            <input id="noteTitle" name="title" type="text" maxlength="180" placeholder="Note title">

                            <div class="note-context-grid">
                                <div>
                                    <label for="noteContextType">Related to</label>
                                    <select id="noteContextType" name="contextType">
                                        <option value="general">General</option>
                                        <option value="ghost">Ghost</option>
                                        <option value="evidence">Evidence</option>
                                        <option value="location">Location</option>
                                        <option value="reference">Reference</option>
                                        <option value="mechanics">Mechanics</option>
                                        <option value="equipment">Equipment</option>
                                    </select>
                                </div>
                                <div>
                                    <label for="noteContextLabel">Related item</label>
                                    <input id="noteContextLabel" name="contextLabel" type="text" maxlength="160" placeholder="Optional name or topic">
                                </div>
                            </div>

                            <label for="noteBody">Note</label>
                            <textarea id="noteBody" name="body" rows="14" maxlength="50000" placeholder="Write your note..."></textarea>

                            <div class="note-actions">
                                <button class="primary-button" type="submit">Save Note</button>
                                <button class="secondary-button" id="deleteNoteButton" type="button" disabled>Delete Note</button>
                            </div>
                            <p id="noteStatus" class="status-message" role="status" aria-live="polite"></p>
                        </form>
                    </section>
                </div>
            </section>
        `;
    }

    function searchFilterButton(value, label) {
        const active = searchUi.filter === value;
        return `<button type="button" class="search-filter${active ? " search-filter--active" : ""}" data-search-filter="${value}" aria-pressed="${active}">${label}</button>`;
    }

    function searchResultButton(result) {
        const sourceClass = result.source === "personal"
            ? " search-result--personal"
            : (result.source === "community" ? " search-result--community" : "");
        const sourceLabel = result.source === "personal"
            ? "My Notes"
            : (result.source === "community" ? "Community Resource" : "Official Reference");
        return `
            <button type="button" class="search-result${sourceClass}" data-search-result-id="${escapeHtml(result.id)}">
                <span class="search-result__topline">
                    <strong>${escapeHtml(result.title)}</strong>
                    <span class="search-result__type">${escapeHtml(result.group)}</span>
                </span>
                ${result.subtitle ? `<span class="search-result__subtitle">${escapeHtml(result.subtitle)}</span>` : ""}
                <span class="search-result__source">${sourceLabel}</span>
            </button>
        `;
    }

    function searchResultsMarkup(results, query) {
        if (!query.trim()) {
            const counts = searchApi?.counts?.() || { official: 0, community: 0, personal: 0 };
            return `
                <div class="search-empty-state">
                    <strong>Search The Other Side</strong>
                    <p>Search ghosts, evidence, behaviors, Spirit Box material, cleansing, equipment, mechanics, locations, the community wiki, and your persistent notes.</p>
                    <span>${counts.official} official reference entries indexed${counts.community ? ` · ${counts.community} community resource` : ""}${counts.personal ? ` · ${counts.personal} personal notes available` : ""}</span>
                </div>
            `;
        }

        if (!results.length) {
            return '<p class="knowledge-empty">No results match this search and filter.</p>';
        }

        const official = results.filter((item) => item.source === "official");
        const community = results.filter((item) => item.source === "community");
        const personal = results.filter((item) => item.source === "personal");
        const sections = [];

        if (official.length) {
            const groups = new Map();
            official.forEach((item) => {
                if (!groups.has(item.group)) groups.set(item.group, []);
                groups.get(item.group).push(item);
            });

            const groupMarkup = [...groups.entries()].map(([group, items]) => `
                <section class="search-result-group" aria-label="${escapeHtml(group)}">
                    <h3>${escapeHtml(group)}</h3>
                    <div class="search-result-list">${items.map(searchResultButton).join("")}</div>
                </section>
            `).join("");

            sections.push(`
                <section class="search-source-section search-source-section--official" aria-labelledby="officialSearchHeading">
                    <div class="search-source-heading">
                        <h2 id="officialSearchHeading">Official Reference</h2>
                        <span>${official.length} result${official.length === 1 ? "" : "s"}</span>
                    </div>
                    ${groupMarkup}
                </section>
            `);
        }

        if (community.length) {
            sections.push(`
                <section class="search-source-section search-source-section--community" aria-labelledby="communitySearchHeading">
                    <div class="search-source-heading">
                        <h2 id="communitySearchHeading">Community Resource</h2>
                        <span>${community.length} result${community.length === 1 ? "" : "s"}</span>
                    </div>
                    <div class="search-result-list">${community.map(searchResultButton).join("")}</div>
                </section>
            `);
        }

        if (personal.length) {
            sections.push(`
                <section class="search-source-section search-source-section--personal" aria-labelledby="personalSearchHeading">
                    <div class="search-source-heading">
                        <h2 id="personalSearchHeading">My Notes</h2>
                        <span>${personal.length} result${personal.length === 1 ? "" : "s"}</span>
                    </div>
                    <div class="search-result-list">${personal.map(searchResultButton).join("")}</div>
                </section>
            `);
        }

        return sections.join("");
    }

    function renderSearch() {
        if (!searchApi) {
            return placeholder("Global Search", "Search is unavailable in this browser session.", "Search unavailable");
        }

        searchUi.results = searchApi.query(searchUi.query, { filter: searchUi.filter });

        return `
            <section class="search-screen" aria-labelledby="screenHeading">
                <header class="knowledge-heading">
                    <div>
                        <span class="eyebrow">Non-destructive shared search</span>
                        <h1 id="screenHeading">Global Search</h1>
                        <p>Search official Veilwatch knowledge, the community wiki, and your persistent notes. Opening a result never changes P.M.S. or A.S.S. gameplay state.</p>
                    </div>
                </header>

                <div class="global-search-toolbar">
                    <label for="globalSearchInput">Search</label>
                    <div class="global-search-input-row">
                        <input id="globalSearchInput" type="search" value="${escapeHtml(searchUi.query)}" placeholder="Ghost, evidence, wiki, nena, mechanic, location or note..." autocomplete="off" spellcheck="false">
                        <button id="clearGlobalSearch" class="secondary-button" type="button">Clear</button>
                    </div>
                    <div class="search-filter-row" aria-label="Search filters">
                        ${searchFilterButton("all", "All")}
                        ${searchFilterButton("ghost", "Ghosts")}
                        ${searchFilterButton("evidence", "Evidence")}
                        ${searchFilterButton("reference", "Reference")}
                        ${searchFilterButton("location", "Locations")}
                        ${searchFilterButton("note", "My Notes")}
                    </div>
                    <p id="globalSearchStatus" class="search-status" role="status" aria-live="polite"></p>
                </div>

                <div id="globalSearchResults" class="global-search-results">
                    ${searchResultsMarkup(searchUi.results, searchUi.query)}
                </div>
            </section>
        `;
    }

    function renderMaps() {
        return `
            <section class="screen-card coming-soon-screen" aria-labelledby="screenHeading">
                <span class="eyebrow">Planned feature</span>
                <h1 id="screenHeading">Maps</h1>
                <div class="coming-soon-badge">Coming Soon</div>
                <p>The map library is intentionally unavailable while the complete map set is prepared.</p>
            </section>
        `;
    }

    function contentForRoute(route) {
        switch (route) {
            case "home":
                return renderHome();
            case "pms":
                return renderProtectedTracker("pms", "P.M.S. Tracker");
            case "ass":
                return renderProtectedTracker("ass", "A.S.S. Profiler");
            case "encyclopedia":
                return renderEncyclopedia();
            case "field-tools":
                return renderFieldTools();
            case "reference":
                return renderReference();
            case "search":
                return renderSearch();
            case "notes":
                return renderNotes();
            case "maps":
                return renderMaps();
            case "settings":
                return renderSettings();
            default:
                return renderHome();
        }
    }

    // ============================================================================
    // [JS-06] RENDERING + NAVIGATION STATE
    // ============================================================================


    function injectSharedReturnControl(route, main) {
        if (!sharedOriginRoute || route === "home" || route === "pms" || route === "ass") {
            return;
        }

        const label = sharedOriginRoute === "pms" ? "P.M.S. Tracker" : "A.S.S. Profiler";
        const bar = document.createElement("div");
        bar.className = "shared-return-bar";
        bar.innerHTML = `
            <span>Opened from ${label}</span>
            <button type="button">Return to ${label}</button>
        `;
        const button = bar.querySelector("button");
        button.addEventListener("click", () => {
            const target = sharedOriginRoute;
            sharedOriginRoute = null;
            navigate(target);
        });
        main.prepend(bar);
    }

    function renderRoute(route) {
        const safeRoute = config.routes.includes(route) ? route : config.defaultRoute;
        const main = document.querySelector("#appMain");
        const title = routeMeta[safeRoute]?.title || config.productName;

        if (trackerHost) {
            trackerHost.beforeRouteChange(safeRoute);
        }

        if (safeRoute === "pms" || safeRoute === "ass") {
            if (sharedOriginRoute === safeRoute) {
                sharedOriginRoute = null;
            }
        }

        document.title = `${title} · ${config.productName}`;
        document.body.dataset.route = safeRoute;
        main.innerHTML = contentForRoute(safeRoute);
        injectSharedReturnControl(safeRoute, main);

        document.querySelectorAll("[data-nav-route]").forEach((link) => {
            const active = link.dataset.navRoute === safeRoute;
            link.toggleAttribute("aria-current", active);
        });

        bindRenderedScreen(safeRoute);

        if ((safeRoute === "pms" || safeRoute === "ass") && trackerHost) {
            trackerHost.mount(safeRoute, document.querySelector(`[data-tracker-mount="${safeRoute}"]`));
        }

        main.focus({ preventScroll: true });
    }

    function bindRenderedScreen(route) {
        document.querySelectorAll("#appMain button[data-route]").forEach((button) => {
            button.addEventListener("click", () => navigate(button.dataset.route));
        });

        document.querySelectorAll("[data-investigation-notes]").forEach((button) => {
            button.addEventListener("click", () => {
                openInvestigationNotes(button.dataset.investigationNotes, button);
            });
        });

        if (route === "field-tools") {
            bindFieldTools();
        }

        if (route === "encyclopedia" || route === "reference") {
            bindKnowledgeScreen(route);
        }

        if (route === "search") {
            bindGlobalSearch();
        }

        if (route === "notes") {
            bindNotes();
        }

        if (route === "settings") {
            bindSettings();
        }
    }

    function bindKnowledgeScreen(route) {
        const search = document.querySelector("#encyclopediaSearch");
        if (search) {
            search.addEventListener("input", () => {
                knowledgeUi.encyclopediaQuery = search.value;
                const query = normalizeSearch(search.value);
                const cards = [...document.querySelectorAll("[data-ghost-name]")];
                let visible = 0;
                cards.forEach((card) => {
                    const ghost = ghostByName(card.dataset.ghostName);
                    const text = ghost ? [ghost.name, ghost.lore, ...(ghost.ev || []), ...(ghost.desc || [])].join(" ").toLowerCase() : "";
                    const show = !query || text.includes(query);
                    card.hidden = !show;
                    if (show) visible++;
                });
                const count = document.querySelector("#encyclopediaCount");
                if (count) count.textContent = `${visible} shown`;
            });
        }

        document.querySelectorAll("[data-ghost-name]").forEach((button) => {
            button.addEventListener("click", () => {
                knowledgeUi.selectedGhost = button.dataset.ghostName;
                renderRoute("encyclopedia");
            });
        });

        document.querySelectorAll("[data-reference-view]").forEach((button) => {
            button.addEventListener("click", () => {
                knowledgeUi.referenceView = button.dataset.referenceView;
                renderRoute("reference");
            });
        });

        document.querySelectorAll("[data-reference-evidence]").forEach((button) => {
            button.addEventListener("click", () => {
                knowledgeUi.referenceView = `evidence:${button.dataset.referenceEvidence}`;
                navigate("reference");
            });
        });

        document.querySelectorAll("[data-knowledge-back]").forEach((button) => {
            button.addEventListener("click", () => {
                if (button.dataset.knowledgeBack === "encyclopedia") {
                    knowledgeUi.selectedGhost = null;
                    renderRoute("encyclopedia");
                } else {
                    knowledgeUi.referenceView = null;
                    renderRoute("reference");
                }
            });
        });

        document.querySelectorAll("[data-new-context-note]").forEach((button) => {
            button.addEventListener("click", () => {
                pendingNoteContext = {
                    type: button.dataset.newContextNote || "general",
                    label: button.dataset.contextLabel || ""
                };
                navigate("notes");
            });
        });

        document.querySelectorAll("[data-open-note]").forEach((button) => {
            button.addEventListener("click", () => {
                pendingNoteContext = { openNoteId: button.dataset.openNote };
                navigate("notes");
            });
        });
    }


    function bindGlobalSearch() {
        const input = document.querySelector("#globalSearchInput");
        const clearButton = document.querySelector("#clearGlobalSearch");
        const results = document.querySelector("#globalSearchResults");
        const status = document.querySelector("#globalSearchStatus");
        if (!input || !clearButton || !results || !status || !searchApi) return;

        function resultById(id) {
            return searchUi.results.find((item) => item.id === id) || null;
        }

        function openResult(result) {
            if (!result?.target) return;
            const target = result.target;

            if (target.route === "encyclopedia" && target.ghost) {
                knowledgeUi.selectedGhost = target.ghost;
                navigate("encyclopedia");
                return;
            }

            if (target.route === "reference" && target.view) {
                knowledgeUi.referenceView = target.view;
                navigate("reference");
                return;
            }

            if (target.route === "notes" && target.noteId) {
                pendingNoteContext = { openNoteId: target.noteId };
                navigate("notes");
                return;
            }

            if (target.url) {
                const opened = window.open(target.url, "_blank", "noopener,noreferrer");
                if (opened) opened.opener = null;
            }
        }

        function bindResultButtons() {
            results.querySelectorAll("[data-search-result-id]").forEach((button) => {
                button.addEventListener("click", () => openResult(resultById(button.dataset.searchResultId)));
            });
        }

        function refresh() {
            searchUi.query = input.value;
            searchUi.results = searchApi.query(searchUi.query, { filter: searchUi.filter });
            results.innerHTML = searchResultsMarkup(searchUi.results, searchUi.query);

            const query = searchUi.query.trim();
            status.textContent = query
                ? `${searchUi.results.length} result${searchUi.results.length === 1 ? "" : "s"}.`
                : "Enter a search term.";

            document.querySelectorAll("[data-search-filter]").forEach((button) => {
                const active = button.dataset.searchFilter === searchUi.filter;
                button.classList.toggle("search-filter--active", active);
                button.setAttribute("aria-pressed", String(active));
            });

            bindResultButtons();
        }

        input.addEventListener("input", refresh);

        clearButton.addEventListener("click", () => {
            input.value = "";
            searchUi.query = "";
            refresh();
            input.focus();
        });

        document.querySelectorAll("[data-search-filter]").forEach((button) => {
            button.addEventListener("click", () => {
                searchUi.filter = button.dataset.searchFilter || "all";
                refresh();
                input.focus();
            });
        });

        window.addEventListener("tos:notes-changed", refresh, { once: true });
        refresh();
    }


    function bindNotes() {
        const form = document.querySelector("#noteForm");
        const list = document.querySelector("#notesList");
        const search = document.querySelector("#notesSearch");
        const newButton = document.querySelector("#newNoteButton");
        const deleteButton = document.querySelector("#deleteNoteButton");
        const heading = document.querySelector("#noteEditorHeading");
        const dirtyStatus = document.querySelector("#noteDirtyStatus");
        const status = document.querySelector("#noteStatus");
        const idInput = document.querySelector("#noteId");
        const titleInput = document.querySelector("#noteTitle");
        const contextType = document.querySelector("#noteContextType");
        const contextLabel = document.querySelector("#noteContextLabel");
        const bodyInput = document.querySelector("#noteBody");
        let selectedId = null;
        let dirty = false;

        function setDirty(nextDirty) {
            dirty = nextDirty;
            dirtyStatus.textContent = dirty ? "Unsaved changes" : "";
        }

        function confirmDiscard() {
            if (!dirty) return true;
            return window.confirm("Discard the unsaved changes to this note?");
        }

        function formatContext(note) {
            const type = note.context?.type || "general";
            const label = note.context?.label || "";
            const names = {
                general: "General",
                ghost: "Ghost",
                evidence: "Evidence",
                location: "Location",
                reference: "Reference",
                mechanics: "Mechanics",
                equipment: "Equipment"
            };
            return label ? `${names[type] || "General"} · ${label}` : (names[type] || "General");
        }

        function matchesSearch(note, query) {
            if (!query) return true;
            const haystack = [
                note.title,
                note.body,
                note.context?.type,
                note.context?.label
            ].join(" ").toLowerCase();
            return haystack.includes(query);
        }

        function renderList() {
            const query = search.value.trim().toLowerCase();
            const saved = notes.getPersistentNotes().filter((note) => matchesSearch(note, query));
            list.replaceChildren();

            if (!saved.length) {
                const empty = document.createElement("p");
                empty.className = "notes-empty";
                empty.textContent = query ? "No notes match this search." : "No saved notes yet.";
                list.append(empty);
                return;
            }

            saved.forEach((note) => {
                const button = document.createElement("button");
                button.type = "button";
                button.className = "note-list-item";
                button.dataset.noteId = note.id;
                if (note.id === selectedId) button.setAttribute("aria-current", "true");

                const title = document.createElement("strong");
                title.textContent = note.title;
                const meta = document.createElement("span");
                meta.textContent = formatContext(note);
                const preview = document.createElement("small");
                preview.textContent = note.body.trim().replace(/\s+/g, " ").slice(0, 96) || "No text";

                button.append(title, meta, preview);
                button.addEventListener("click", () => {
                    if (note.id === selectedId || !confirmDiscard()) return;
                    openSavedNote(note.id);
                });
                list.append(button);
            });
        }

        function clearEditor() {
            selectedId = null;
            form.reset();
            idInput.value = "";
            contextType.value = "general";
            heading.textContent = "New Note";
            deleteButton.disabled = true;
            status.textContent = "";
            setDirty(false);
            renderList();
            titleInput.focus();
        }

        function openSavedNote(id) {
            const note = notes.getPersistentNote(id);
            if (!note) {
                clearEditor();
                return;
            }

            selectedId = note.id;
            idInput.value = note.id;
            titleInput.value = note.title;
            contextType.value = note.context?.type || "general";
            contextLabel.value = note.context?.label || "";
            bodyInput.value = note.body;
            heading.textContent = note.title;
            deleteButton.disabled = false;
            status.textContent = "";
            setDirty(false);
            renderList();
        }

        form.addEventListener("input", () => setDirty(true));
        search.addEventListener("input", renderList);

        newButton.addEventListener("click", () => {
            if (confirmDiscard()) clearEditor();
        });

        form.addEventListener("submit", (event) => {
            event.preventDefault();
            const result = notes.savePersistentNote({
                id: selectedId || undefined,
                title: titleInput.value,
                body: bodyInput.value,
                context: {
                    type: contextType.value,
                    label: contextLabel.value
                }
            });

            if (!result.ok) {
                status.textContent = result.reason === "empty-note"
                    ? "Add a title or note text before saving."
                    : "This note could not be saved in this browser.";
                return;
            }

            selectedId = result.note.id;
            idInput.value = result.note.id;
            titleInput.value = result.note.title;
            heading.textContent = result.note.title;
            deleteButton.disabled = false;
            setDirty(false);
            status.textContent = "Note saved.";
            renderList();
        });

        deleteButton.addEventListener("click", () => {
            if (!selectedId) return;
            const current = notes.getPersistentNote(selectedId);
            const approved = window.confirm(`Delete "${current?.title || "this note"}"? This cannot be undone.`);
            if (!approved) return;

            const result = notes.deletePersistentNote(selectedId);
            if (!result.ok) {
                status.textContent = "This note could not be deleted.";
                return;
            }

            clearEditor();
            status.textContent = "Note deleted.";
        });

        const incoming = pendingNoteContext;
        pendingNoteContext = null;

        if (incoming?.openNoteId && notes.getPersistentNote(incoming.openNoteId)) {
            openSavedNote(incoming.openNoteId);
        } else if (incoming?.type) {
            clearEditor();
            contextType.value = incoming.type;
            contextLabel.value = incoming.label || "";
            heading.textContent = incoming.label ? `New Note · ${incoming.label}` : "New Note";
            setDirty(false);
        } else {
            const initial = notes.getPersistentNotes()[0];
            if (initial) {
                openSavedNote(initial.id);
            } else {
                clearEditor();
            }
        }
    }

    // ============================================================================
    // [JS-07] INVESTIGATION NOTES DIALOG
    // ============================================================================

    let activeInvestigationTracker = null;
    let investigationOpener = null;
    let investigationSaveTimer = 0;

    function investigationTrackerLabel(tracker) {
        return tracker === "pms" ? "P.M.S. Tracker" : "A.S.S. Profiler";
    }

    function saveInvestigationDraft() {
        if (!activeInvestigationTracker) return;
        const body = document.querySelector("#investigationNotesBody");
        const status = document.querySelector("#investigationNotesStatus");
        if (!body || !status) return;

        const result = notes.saveInvestigationNote(activeInvestigationTracker, body.value);
        status.textContent = result.ok
            ? (body.value.trim() ? "Saved." : "Empty note cleared.")
            : "Could not save this investigation note.";
    }

    function openInvestigationNotes(tracker, opener) {
        if (tracker !== "pms" && tracker !== "ass") return;
        const dialog = document.querySelector("#investigationNotesDialog");
        const title = document.querySelector("#investigationNotesTitle");
        const help = document.querySelector("#investigationNotesHelp");
        const body = document.querySelector("#investigationNotesBody");
        const status = document.querySelector("#investigationNotesStatus");
        const saved = notes.getInvestigationNote(tracker);

        activeInvestigationTracker = tracker;
        investigationOpener = opener || document.activeElement;
        title.textContent = `${investigationTrackerLabel(tracker)} Investigation Notes`;
        help.textContent = `Autosaved locally. These notes are cleared when you reset the ${investigationTrackerLabel(tracker)} investigation. My Notes are not affected.`;
        body.value = saved?.body || "";
        status.textContent = saved?.updatedAt ? "Saved investigation note loaded." : "";

        dialog.showModal();
        window.setTimeout(() => body.focus(), 0);
    }

    function bindInvestigationDialog() {
        const dialog = document.querySelector("#investigationNotesDialog");
        const body = document.querySelector("#investigationNotesBody");
        if (!dialog || !body) return;

        body.addEventListener("input", () => {
            window.clearTimeout(investigationSaveTimer);
            investigationSaveTimer = window.setTimeout(saveInvestigationDraft, 250);
        });

        dialog.addEventListener("close", () => {
            window.clearTimeout(investigationSaveTimer);
            saveInvestigationDraft();
            activeInvestigationTracker = null;
            if (investigationOpener && typeof investigationOpener.focus === "function") {
                investigationOpener.focus();
            }
            investigationOpener = null;
        });

        window.addEventListener("tos:tracker-reset", (event) => {
            const tracker = event.detail?.tracker;
            if (!activeInvestigationTracker || tracker !== activeInvestigationTracker) return;
            body.value = "";
            const status = document.querySelector("#investigationNotesStatus");
            if (status) {
                status.textContent = `Cleared because the ${investigationTrackerLabel(tracker)} investigation was reset.`;
            }
        });
    }

        function isInstalledApp() {
        return window.matchMedia?.("(display-mode: standalone)")?.matches || window.navigator.standalone === true;
    }

    function isIosDevice() {
        return /iphone|ipad|ipod/i.test(window.navigator.userAgent || "");
    }

    function isIosSafari() {
        const ua = window.navigator.userAgent || "";
        return isIosDevice() && /safari/i.test(ua) && !/crios|fxios|edgios/i.test(ua);
    }

    function installInstructionMarkup() {
        const isFileProtocol = window.location.protocol === "file:";
        if (isInstalledApp()) {
            return `<p>Veilwatch is already installed on this device.</p>`;
        }

        if (isFileProtocol) {
            return `<p><strong>Current limitation:</strong> app installation does not work when index.html is opened directly from a file.</p><ol class="knowledge-list"><li>Host Veilwatch on HTTPS or run it from a local web server.</li><li>Open it in Chrome, Edge, or another supported browser.</li><li>Use the browser install prompt or the Install App button here.</li></ol>`;
        }

        if (isIosSafari()) {
            return `<p><strong>iPhone / iPad:</strong> Safari installs Veilwatch manually.</p><ol class="knowledge-list"><li>Open Veilwatch in Safari.</li><li>Tap <strong>Share</strong>.</li><li>Choose <strong>Add to Home Screen</strong>.</li><li>Confirm the name and tap <strong>Add</strong>.</li></ol>`;
        }

        return `<p><strong>Supported install methods:</strong></p><ol class="knowledge-list"><li><strong>Chrome / Edge desktop:</strong> use the install icon in the address bar or the Install App button here.</li><li><strong>Android Chrome / Edge:</strong> use the browser install prompt or browser menu → <strong>Install app</strong> / <strong>Add to Home screen</strong>.</li><li><strong>Other browsers:</strong> look for an install or add-to-home-screen option in the browser menu.</li></ol>`;
    }

    function refreshInstallUi() {
        const button = document.querySelector("#installAppButton");
        const instructions = document.querySelector("#installInstructions");
        const supportText = document.querySelector("#installSupportText");
        const status = document.querySelector("#installStatus");
        if (!button || !instructions || !supportText || !status) return;

        const installed = isInstalledApp();
        const fileProtocol = window.location.protocol === "file:";
        instructions.innerHTML = installInstructionMarkup();

        if (installed) {
            button.disabled = true;
            button.textContent = "Installed";
            supportText.textContent = "Veilwatch is already installed on this device.";
            if (!status.textContent) status.textContent = "App is installed.";
            return;
        }

        if (deferredInstallPrompt) {
            button.disabled = false;
            button.textContent = "Install App";
            supportText.textContent = "This browser can install Veilwatch directly.";
            return;
        }

        if (fileProtocol) {
            button.disabled = true;
            button.textContent = "Install Unavailable";
            supportText.textContent = "Installation requires HTTPS or a local web server instead of opening index.html directly.";
            return;
        }

        if (isIosSafari()) {
            button.disabled = true;
            button.textContent = "Use Safari Share Menu";
            supportText.textContent = "On iPhone and iPad, install Veilwatch from Safari using Add to Home Screen.";
            return;
        }

        button.disabled = true;
        button.textContent = "Browser Menu Install";
        supportText.textContent = "Use your browser's install or add-to-home-screen command if a direct prompt is not available.";
    }

    async function handleInstallClick() {
        const status = document.querySelector("#installStatus");
        if (!status) return;

        if (!deferredInstallPrompt) {
            refreshInstallUi();
            status.textContent = "A direct install prompt is not available right now. See Installation Help for the right method on this device.";
            return;
        }

        try {
            deferredInstallPrompt.prompt();
            const choice = await deferredInstallPrompt.userChoice;
            if (choice?.outcome === "accepted") {
                status.textContent = "Install accepted. Finish the browser prompt to add Veilwatch.";
            } else {
                status.textContent = "Install prompt dismissed.";
            }
        } catch (error) {
            status.textContent = "Install prompt failed in this browser.";
        } finally {
            deferredInstallPrompt = null;
            refreshInstallUi();
        }
    }

    function bindSettings() {
        const form = document.querySelector("#settingsForm");
        const resetButton = document.querySelector("#resetSettings");
        const status = document.querySelector("#settingsStatus");
        const exportBackupButton = document.querySelector("#exportBackup");
        const exportNotesButton = document.querySelector("#exportNotesOnly");
        const backupFile = document.querySelector("#backupFile");
        const validationStatus = document.querySelector("#backupValidationStatus");
        const summary = document.querySelector("#backupSummary");
        const importMode = document.querySelector("#backupImportMode");
        const importButton = document.querySelector("#importBackup");
        const importStatus = document.querySelector("#backupImportStatus");
        const deleteNotesButton = document.querySelector("#deletePersistentNotes");
        const fullResetButton = document.querySelector("#fullAppReset");
        const dataStatus = document.querySelector("#dataManagementStatus");
        const installButton = document.querySelector("#installAppButton");
        const installHelpButton = document.querySelector("#installHelpButton");
        const installHelpCard = document.querySelector("#installHelpCard");
        const current = storage.getSettings();
        let pendingBackup = null;

        syncSettingsForm(current);
        refreshInstallUi();

        form.addEventListener("submit", (event) => {
            event.preventDefault();
            const next = {
                startupRoute: form.startupRoute.value,
                theme: form.theme.value,
                reducedMotion: form.reducedMotion.checked,
                largerText: form.largerText.checked
            };
            const result = storage.saveSettings(next);

            if (!result.ok) {
                status.textContent = "Settings could not be saved in this browser.";
                return;
            }

            applySettings(storage.getSettings());
            status.textContent = "Settings saved.";
        });

        resetButton.addEventListener("click", () => {
            const approved = window.confirm("Reset Veilwatch settings to their defaults? Persistent notes and tracker data will not be affected.");
            if (!approved) return;

            const result = storage.resetSettings();
            applySettings(result.value);
            syncSettingsForm(result.value);
            status.textContent = result.ok ? "Settings reset." : "Settings could not be reset.";
        });

        function exportBackup(kind) {
            if (!backupApi) return;
            const data = kind === "notes-only" ? backupApi.notesOnlyBackup() : backupApi.fullBackup();
            backupApi.downloadJson(data, backupApi.datedFileName(kind));
            importStatus.textContent = kind === "notes-only"
                ? "Notes-only backup exported."
                : "Backup exported.";
        }

        installButton?.addEventListener("click", handleInstallClick);

        installHelpButton?.addEventListener("click", () => {
            if (!installHelpCard) return;
            installHelpCard.hidden = !installHelpCard.hidden;
            installHelpButton.textContent = installHelpCard.hidden ? "Installation Help" : "Hide Installation Help";
        });

        exportBackupButton.addEventListener("click", () => exportBackup("full"));
        exportNotesButton.addEventListener("click", () => exportBackup("notes-only"));

        function clearImportPreview(message = "No backup selected.") {
            pendingBackup = null;
            summary.hidden = true;
            summary.replaceChildren();
            importMode.disabled = true;
            importButton.disabled = true;
            validationStatus.textContent = message;
            importStatus.textContent = "";
        }

        function showBackupSummary(validation) {
            const backup = validation.backup;
            const noteCount = backup.data.persistentNotes.items.length;
            summary.innerHTML = `
                <dl class="backup-summary-grid">
                    <div><dt>Created</dt><dd>${escapeHtml(new Date(backup.createdAt).toLocaleString())}</dd></div>
                    <div><dt>App version</dt><dd>${escapeHtml(backup.appVersion)}</dd></div>
                    <div><dt>Backup type</dt><dd>${backup.backupType === "full" ? "Settings + My Notes" : "My Notes only"}</dd></div>
                    <div><dt>Persistent notes</dt><dd>${noteCount}</dd></div>
                </dl>
                ${validation.warnings.length ? `<p class="backup-warning">${validation.warnings.map(escapeHtml).join(" ")}</p>` : ""}
            `;
            summary.hidden = false;
            importMode.disabled = false;
            importButton.disabled = false;
            validationStatus.textContent = "Backup validated. Review the summary and choose an import mode.";
        }

        backupFile.addEventListener("change", async () => {
            const file = backupFile.files?.[0];
            if (!file) {
                clearImportPreview();
                return;
            }

            importStatus.textContent = "";
            if (file.size > 10 * 1024 * 1024) {
                clearImportPreview("Backup rejected: the selected file is larger than 10 MB.");
                return;
            }

            try {
                const text = await file.text();
                const parsed = JSON.parse(text);
                const validation = backupApi.validateBackup(parsed);
                if (!validation.ok) {
                    clearImportPreview(`Backup rejected: ${validation.errors.join(" ")}`);
                    return;
                }

                pendingBackup = validation.backup;
                showBackupSummary(validation);
            } catch (error) {
                clearImportPreview("Backup rejected: the selected file is not valid JSON.");
            }
        });

        importButton.addEventListener("click", () => {
            if (!pendingBackup) return;
            const mode = document.querySelector('input[name="backupMode"]:checked')?.value || "merge";
            const noteCount = pendingBackup.data.persistentNotes.items.length;
            const settingsText = pendingBackup.backupType === "full" ? " and restore its Veilwatch settings" : "";
            const prompt = mode === "replace"
                ? `Replace all current My Notes with ${noteCount} note${noteCount === 1 ? "" : "s"} from this backup${settingsText}? This cannot be undone unless you exported a backup first.`
                : `Merge ${noteCount} backed-up note${noteCount === 1 ? "" : "s"} into My Notes${settingsText}? Existing notes will not be deleted.`;

            if (!window.confirm(prompt)) return;

            const result = backupApi.importBackup(pendingBackup, mode);
            if (!result.ok) {
                importStatus.textContent = "Import failed. No tracker state was changed.";
                return;
            }

            if (result.settingsImported) {
                applySettings(storage.getSettings());
                syncSettingsForm(storage.getSettings());
            }

            const detail = mode === "merge"
                ? `${result.noteResult.added} added, ${result.noteResult.duplicates} duplicate${result.noteResult.duplicates === 1 ? "" : "s"} skipped${result.noteResult.conflictsPreserved ? `, ${result.noteResult.conflictsPreserved} conflict${result.noteResult.conflictsPreserved === 1 ? "" : "s"} preserved separately` : ""}.`
                : `${result.noteResult.total} persistent note${result.noteResult.total === 1 ? "" : "s"} restored.`;
            importStatus.textContent = `Import complete. ${detail}`;
        });

        deleteNotesButton.addEventListener("click", () => {
            const count = notes.getPersistentNotes().length;
            const approved = window.confirm(`Delete all ${count} persistent My Note${count === 1 ? "" : "s"}? This does not affect tracker state, investigation notes, or settings.`);
            if (!approved) return;

            const result = notes.clearPersistentNotes();
            dataStatus.textContent = result.ok ? "Persistent My Notes deleted." : "Persistent notes could not be deleted.";
        });

        fullResetButton.addEventListener("click", () => {
            const first = window.confirm("Full App Reset will delete persistent My Notes, both investigation notes, saved P.M.S./A.S.S. investigation sessions, and reset Veilwatch settings. Continue?");
            if (!first) return;

            const second = window.confirm("Final confirmation: permanently reset Veilwatch user data now? Protected P.M.S. and A.S.S. source files are not changed.");
            if (!second) return;

            trackerHost?.resetAllHostedTrackers?.();
            const result = storage.clearNamespace();
            if (!result.ok) {
                dataStatus.textContent = "Full App Reset could not be completed in this browser.";
                return;
            }

            dataStatus.textContent = "Full App Reset complete. Reloading Home...";
            window.location.hash = "#/home";
            window.setTimeout(() => window.location.reload(), 50);
        });
    }

    // ============================================================================
    // [JS-08] MOBILE MORE NAVIGATION
    // ============================================================================

    function bindMobileMoreDialog() {
        const dialog = document.querySelector("#mobileMoreDialog");
        const openButton = document.querySelector("#mobileMoreOpen");
        const closeButton = document.querySelector("#mobileMoreClose");
        if (!dialog || !openButton || !closeButton) return;

        openButton.addEventListener("click", () => {
            if (typeof dialog.showModal === "function") {
                dialog.showModal();
            } else {
                dialog.setAttribute("open", "");
            }
        });

        closeButton.addEventListener("click", () => {
            if (typeof dialog.close === "function") {
                dialog.close();
            } else {
                dialog.removeAttribute("open");
                openButton.focus();
            }
        });

        dialog.querySelectorAll("[data-nav-route]").forEach((button) => {
            button.addEventListener("click", () => {
                if (typeof dialog.close === "function") {
                    dialog.close();
                } else {
                    dialog.removeAttribute("open");
                }
            });
        });

        dialog.addEventListener("click", (event) => {
            if (event.target === dialog && typeof dialog.close === "function") {
                dialog.close();
            }
        });
    }

    // ============================================================================
    // [JS-09] APP STARTUP + PWA REGISTRATION
    // ============================================================================

    function registerServiceWorker() {
        if (!("serviceWorker" in navigator)) {
            return;
        }

        window.addEventListener("load", () => {
            navigator.serviceWorker.register("./service-worker.js").catch((error) => {
                console.warn("Service worker registration failed:", error);
            });
        }, { once: true });
    }

    function start() {
        applySettings(storage.getSettings());
        bindInvestigationDialog();
        bindMobileMoreDialog();

        const closeTrackerToolsMenus = () => {
            document.querySelectorAll(".tracker-tools-menu[open]").forEach((menu) => {
                menu.removeAttribute("open");
            });
        };

        document.addEventListener("pointerdown", (event) => {
            document.querySelectorAll(".tracker-tools-menu[open]").forEach((menu) => {
                if (!menu.contains(event.target)) {
                    menu.removeAttribute("open");
                }
            });
        }, true);

        window.addEventListener("tos:tracker-interaction", closeTrackerToolsMenus);

        document.querySelectorAll("[data-nav-route]").forEach((button) => {
            button.addEventListener("click", () => navigate(button.dataset.navRoute));
        });

        window.addEventListener("beforeinstallprompt", (event) => {
            event.preventDefault();
            deferredInstallPrompt = event;
            refreshInstallUi();
        });

        window.addEventListener("appinstalled", () => {
            deferredInstallPrompt = null;
            refreshInstallUi();
        });

        window.matchMedia?.("(display-mode: standalone)")?.addEventListener?.("change", () => refreshInstallUi());

        window.addEventListener("tos:tracker-navigate", (event) => {
            const route = event.detail?.route;
            if (config.routes.includes(route)) navigate(route);
        });

        window.addEventListener("hashchange", () => {
            renderRoute(routeFromHash() || config.defaultRoute);
        });

        const initial = resolveInitialRoute();
        if (!routeFromHash()) {
            navigate(initial, { replace: true });
        } else {
            renderRoute(initial);
        }

        registerServiceWorker();
    }

    start();
})();
