(() => {
    "use strict";

    // ============================================================================
    // [JS-SEARCH-01] NORMALIZATION + INDEX HELPERS
    // ============================================================================

    const knowledge = window.tosKnowledge;
    const notes = window.tosNotes;

    const FILTERS = Object.freeze([
        "all",
        "ghost",
        "evidence",
        "reference",
        "location",
        "note"
    ]);

    function normalize(value) {
        return String(value ?? "")
            .normalize("NFKD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[’']/g, "")
            .replace(/[^a-zA-Z0-9]+/g, " ")
            .trim()
            .toLowerCase()
            .replace(/\s+/g, " ");
    }

    function searchableText(parts) {
        return normalize(parts.flat(Infinity).filter(Boolean).join(" "));
    }

    function makeItem({ id, source = "official", filterType, group, title, subtitle = "", body = "", aliases = [], target }) {
        const titleNorm = normalize(title);
        const aliasNorm = aliases.map(normalize).filter(Boolean);
        const searchText = searchableText([title, subtitle, body, aliases]);

        return Object.freeze({
            id,
            source,
            filterType,
            group,
            title,
            subtitle,
            body,
            aliases: Object.freeze([...aliases]),
            target: Object.freeze({ ...target }),
            _titleNorm: titleNorm,
            _aliasNorm: Object.freeze(aliasNorm),
            _searchText: searchText
        });
    }

    function interactionText(ghost) {
        return Object.entries(ghost.interactionBehaviors || {})
            .flatMap(([label, value]) => [label, value]);
    }

    // ============================================================================
    // [JS-SEARCH-02] READ-ONLY OFFICIAL INDEX
    // ============================================================================

    function buildOfficialIndex() {
        const items = [];

        items.push(makeItem({
            id: "community:wiki-nena",
            source: "community",
            filterType: "reference",
            group: "Community Wiki",
            title: "Wiki - by nena",
            subtitle: "Unofficial The Other Side Wiki",
            body: "Community-created wiki for The Other Side.",
            aliases: ["wiki", "nena", "the other side wiki", "unofficial wiki", "community wiki"],
            target: { url: "https://theotherside-game.fandom.com/wiki/The_Other_Side_Wiki" }
        }));

        if (!knowledge) return Object.freeze(items);

        (knowledge.ghosts || []).forEach((ghost) => {
            items.push(makeItem({
                id: `ghost:${ghost.name}`,
                filterType: "ghost",
                group: "Ghost Encyclopedia",
                title: ghost.name,
                subtitle: (ghost.ev || []).join(" · "),
                body: searchableText([
                    ghost.lore,
                    ghost.desc,
                    ghost.tags,
                    interactionText(ghost),
                    ghost.speed,
                    ghost.losspeed,
                    ghost.los,
                    ghost.hw,
                    ghost.cooldown,
                    ghost.forced,
                    ghost.realWorldLore?.origin,
                    ghost.realWorldLore?.summary
                ]),
                aliases: ["ghost", "entity", "encyclopedia"],
                target: { route: "encyclopedia", ghost: ghost.name }
            }));
        });

        (knowledge.evidence || []).forEach((entry) => {
            items.push(makeItem({
                id: `evidence:${entry.id}`,
                filterType: "evidence",
                group: "Evidence",
                title: entry.name,
                subtitle: `Paranormal Tracker: ${entry.identifyLabel} · Affixer Matrix: ${entry.cleanseName}`,
                body: [
                    `Diminishing ${entry.diminishingAllowed ? "allowed" : "not allowed"}`,
                    ...(entry.cleanseLevels || []).map((level) => `Level ${level.level} ${level.text}`)
                ].join(" "),
                aliases: [
                    ...(entry.aliases || []),
                    entry.identifyLabel,
                    entry.cleanseName,
                    "evidence"
                ],
                target: { route: "reference", view: `evidence:${entry.name}` }
            }));
        });

        (knowledge.behaviors || []).forEach((entry) => {
            items.push(makeItem({
                id: `behavior:${entry.id}`,
                filterType: "reference",
                group: "Behaviors",
                title: entry.name,
                subtitle: "Paranormal Tracker behavior reference",
                body: (entry.states || []).join(" "),
                aliases: ["behavior", "behaviour", ...(entry.states || [])],
                target: { route: "reference", view: "behaviors" }
            }));
        });

        if (knowledge.spiritBox) {
            items.push(makeItem({
                id: "reference:spirit-box-phrases",
                filterType: "reference",
                group: "Spirit Box",
                title: "Spirit Box Phrases",
                subtitle: `${knowledge.spiritBox.phrases?.length || 0} canonical phrases`,
                body: (knowledge.spiritBox.phrases || []).join(" "),
                aliases: ["spirit box", "audio phrases", ...(knowledge.spiritBox.phrases || [])],
                target: { route: "reference", view: "spirit-box" }
            }));

            items.push(makeItem({
                id: "reference:skia-audio",
                filterType: "reference",
                group: "Spirit Box",
                title: "Skia Unique Audio Responses",
                subtitle: "Ghost-specific Spirit Box reference",
                body: (knowledge.spiritBox.skiaUniqueResponses || []).join(" "),
                aliases: ["skia", "spirit box", "audio response"],
                target: { route: "reference", view: "spirit-box" }
            }));
        }

        (knowledge.cleansing?.fieldNotes || []).forEach((group, index) => {
            const equipment = /Affixer|Scan Status|System, Logic/i.test(group.title);
            items.push(makeItem({
                id: `reference:field-note:${index}`,
                filterType: "reference",
                group: equipment ? "Equipment" : "Cleansing",
                title: group.title,
                subtitle: equipment ? "Affixer Matrix equipment reference" : "Affixer Matrix cleansing reference",
                body: (group.items || []).join(" "),
                aliases: [equipment ? "equipment" : "cleansing", "field notes", "affixer matrix"],
                target: { route: "reference", view: equipment ? "equipment" : "cleansing" }
            }));
        });

        (knowledge.mechanics || []).forEach((entry) => {
            items.push(makeItem({
                id: `mechanic:${entry.id}`,
                filterType: "reference",
                group: "Mechanics",
                title: entry.title,
                subtitle: "Game mechanic",
                body: entry.text,
                aliases: ["mechanic", "mechanics", entry.id],
                target: { route: "reference", view: "mechanics" }
            }));
        });

        if (knowledge.heartRateRanges?.length) {
            items.push(makeItem({
                id: "reference:heart-rate-ranges",
                filterType: "reference",
                group: "Mechanics",
                title: "Heart Rate Status Ranges",
                subtitle: "Paranormal Tracker heart-rate reference",
                body: knowledge.heartRateRanges.join(" "),
                aliases: ["heart rate", "bpm", "anxiety", "hunt chance"],
                target: { route: "reference", view: "mechanics" }
            }));
        }

        (knowledge.locations || []).forEach((location) => {
            items.push(makeItem({
                id: `location:${location}`,
                filterType: "location",
                group: "Locations",
                title: location,
                subtitle: "Location reference",
                body: "Supported investigation location",
                aliases: ["location", "map", "maps"],
                target: { route: "reference", view: "locations" }
            }));
        });

        if (knowledge.specialReferences?.iblisShapeshifting?.length) {
            items.push(makeItem({
                id: "reference:iblis-shapeshifting",
                filterType: "reference",
                group: "Special References",
                title: "Iblis Shapeshifting",
                subtitle: "Ghost model and cosmetic reference",
                body: knowledge.specialReferences.iblisShapeshifting.join(" "),
                aliases: ["iblis", "shape shift", "shapeshift", "shapeshifting", "ghost model"],
                target: { route: "reference", view: "special" }
            }));
        }

        return Object.freeze(items);
    }

    const officialIndex = buildOfficialIndex();

    // ============================================================================
    // [JS-SEARCH-03] PERSONAL NOTES INDEX
    // ============================================================================

    function noteIndex() {
        if (!notes) return [];
        return notes.getPersistentNotes().map((note) => makeItem({
            id: `note:${note.id}`,
            source: "personal",
            filterType: "note",
            group: "My Notes",
            title: note.title || "Untitled Note",
            subtitle: note.context?.label
                ? `${note.context.type || "general"}: ${note.context.label}`
                : (note.context?.type || "general"),
            body: note.body || "",
            aliases: [note.context?.type || "", note.context?.label || "", "my notes", "note"],
            target: { route: "notes", noteId: note.id }
        }));
    }

    // ============================================================================
    // [JS-SEARCH-04] MATCHING + RANKING
    // ============================================================================

    function scoreItem(item, normalizedQuery, tokens) {
        if (!normalizedQuery) return 0;
        if (!tokens.every((token) => item._searchText.includes(token))) return 0;

        let score = 20;

        if (item._titleNorm === normalizedQuery) score += 160;
        else if (item._titleNorm.startsWith(normalizedQuery)) score += 120;
        else if (item._titleNorm.includes(normalizedQuery)) score += 90;

        if (item._aliasNorm.some((alias) => alias === normalizedQuery)) score += 130;
        else if (item._aliasNorm.some((alias) => alias.includes(normalizedQuery))) score += 75;

        if (item._searchText.includes(normalizedQuery)) score += 45;

        tokens.forEach((token) => {
            if (item._titleNorm.includes(token)) score += 18;
            if (item._aliasNorm.some((alias) => alias.includes(token))) score += 10;
        });

        if (item.filterType === "ghost") score += 3;
        return score;
    }

    function query(value, options = {}) {
        const normalizedQuery = normalize(value);
        const filter = FILTERS.includes(options.filter) ? options.filter : "all";
        const limit = Math.max(1, Math.min(Number(options.limit) || 100, 200));

        if (!normalizedQuery) return [];
        const tokens = normalizedQuery.split(" ").filter(Boolean);
        const candidates = [...officialIndex, ...noteIndex()];

        return candidates
            .filter((item) => filter === "all" || item.filterType === filter)
            .map((item) => ({ item, score: scoreItem(item, normalizedQuery, tokens) }))
            .filter((entry) => entry.score > 0)
            .sort((a, b) => {
                if (b.score !== a.score) return b.score - a.score;
                const sourcePriority = { official: 0, community: 1, personal: 2 };
                if (a.item.source !== b.item.source) {
                    return (sourcePriority[a.item.source] ?? 9) - (sourcePriority[b.item.source] ?? 9);
                }
                return a.item.title.localeCompare(b.item.title);
            })
            .slice(0, limit)
            .map((entry) => entry.item);
    }

    function counts() {
        const official = officialIndex.filter((item) => item.source === "official").length;
        const community = officialIndex.filter((item) => item.source === "community").length;
        const personal = noteIndex().length;
        return { official, community, personal, total: official + community + personal };
    }

    // ============================================================================
    // [JS-SEARCH-05] PUBLIC READ-ONLY API
    // ============================================================================

    window.tosSearch = Object.freeze({
        filters: FILTERS,
        normalize,
        query,
        counts,
        getOfficialIndex: () => [...officialIndex]
    });
})();
