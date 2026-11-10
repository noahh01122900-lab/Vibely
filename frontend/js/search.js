// ========================================================
// VIBELY LIVE SEARCH ENGINE (search.js)
// Debounced multi-tier search across local library, backend API
// and iTunes Music API with history & genre filtering
// ========================================================

class VibelySearchEngine {
    constructor(options = {}) {
        this.debounceDelay = options.debounceDelay || 320;
        this.debounceTimer = null;
        this.currentQuery = "";
        this.activeFilter = "all"; // 'all' | 'songs' | 'artists' | 'playlists'
        this.recentSearchesLimit = 8;

        this.cache = new Map();
        this.storageKey = "vibely_recent_searches";
    }

    // ----------------------------------------------------
    // Debounced Search Handler
    // ----------------------------------------------------
    search(query, callback) {
        clearTimeout(this.debounceTimer);
        const trimmed = (query || "").trim();
        this.currentQuery = trimmed;

        if (!trimmed) {
            this._dispatch("searchclear");
            if (callback) callback({ query: "", results: [] });
            return;
        }

        this._dispatch("searchloading", { query: trimmed });

        this.debounceTimer = setTimeout(async () => {
            const results = await this.executeSearch(trimmed);
            this._saveRecentSearch(trimmed);
            this._dispatch("searchresults", { query: trimmed, results });
            if (callback) callback({ query: trimmed, results });
        }, this.debounceDelay);
    }

    // ----------------------------------------------------
    // Multi-tier Search Execution
    // ----------------------------------------------------
    async executeSearch(query) {
        const cacheKey = `${query.toLowerCase()}::${this.activeFilter}`;
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        const normalizedQuery = query.toLowerCase();

        // Tier 1: Local Library Search
        const localMatches = this.searchLocalLibrary(normalizedQuery);

        // Tier 2: Backend API Search (if server is running)
        let backendMatches = [];
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2000);
            const res = await fetch(`/api/songs/search?q=${encodeURIComponent(query)}`, {
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (res.ok) {
                const data = await res.json();
                if (data.success && Array.isArray(data.data)) {
                    backendMatches = data.data.map(item => ({
                        title: item.title,
                        artist: item.artist,
                        cover: item.cover_image || item.cover || "assets/images/feature1.png",
                        audio: item.audio_url || item.audio || "assets/audio/song1.mp3",
                        source: "library",
                        playlistName: item.genre || "Vibely Library"
                    }));
                }
            }
        } catch (e) {
            // Backend offline or running purely frontend — gracefully ignored
        }

        // Tier 3: External iTunes Preview API
        let itunesMatches = [];
        try {
            const itunesUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=12`;
            const res = await fetch(itunesUrl);
            if (res.ok) {
                const data = await res.json();
                if (data.results && Array.isArray(data.results)) {
                    itunesMatches = data.results.map(item => ({
                        title: item.trackName,
                        artist: item.artistName,
                        cover: (item.artworkUrl100 || "").replace("100x100bb", "400x400bb"),
                        audio: item.previewUrl,
                        source: "itunes",
                        duration: Math.round((item.trackTimeMillis || 30000) / 1000),
                        playlistName: item.primaryGenreName || "Online Music"
                    }));
                }
            }
        } catch (e) {
            console.debug("[VibelySearch] External API search skipped:", e.message);
        }

        // Merge & deduplicate by title + artist
        const seen = new Set();
        const combined = [];

        [...localMatches, ...backendMatches, ...itunesMatches].forEach(song => {
            if (!song.title || !song.audio) return;
            const key = `${song.title.toLowerCase()}:::${song.artist.toLowerCase()}`;
            if (!seen.has(key)) {
                seen.add(key);
                combined.push(song);
            }
        });

        this.cache.set(cacheKey, combined);
        return combined;
    }

    // ----------------------------------------------------
    // Local In-Memory Fallback
    // ----------------------------------------------------
    searchLocalLibrary(query) {
        const matches = [];
        if (typeof featurePlaylists === "object" && featurePlaylists !== null) {
            Object.values(featurePlaylists).forEach(pl => {
                if (Array.isArray(pl.songs)) {
                    pl.songs.forEach(song => {
                        const titleMatch = song.title && song.title.toLowerCase().includes(query);
                        const artistMatch = song.artist && song.artist.toLowerCase().includes(query);
                        const playlistMatch = song.playlistName && song.playlistName.toLowerCase().includes(query);

                        if (titleMatch || artistMatch || playlistMatch) {
                            matches.push({ ...song, source: "local" });
                        }
                    });
                }
            });
        }
        return matches;
    }

    // ----------------------------------------------------
    // Recent Searches Management
    // ----------------------------------------------------
    getRecentSearches() {
        try {
            const raw = localStorage.getItem(this.storageKey);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    }

    _saveRecentSearch(term) {
        if (!term || term.length < 2) return;
        try {
            let list = this.getRecentSearches();
            list = [term, ...list.filter(t => t.toLowerCase() !== term.toLowerCase())];
            list = list.slice(0, this.recentSearchesLimit);
            localStorage.setItem(this.storageKey, JSON.stringify(list));
            this._dispatch("recentsearcheschange", { searches: list });
        } catch (e) {
            // Ignore quota exceeded
        }
    }

    removeRecentSearch(term) {
        try {
            let list = this.getRecentSearches();
            list = list.filter(t => t !== term);
            localStorage.setItem(this.storageKey, JSON.stringify(list));
            this._dispatch("recentsearcheschange", { searches: list });
        } catch (e) {
            // Ignore
        }
    }

    clearRecentSearches() {
        localStorage.removeItem(this.storageKey);
        this._dispatch("recentsearcheschange", { searches: [] });
    }

    // ----------------------------------------------------
    // Helpers
    // ----------------------------------------------------
    static highlightMatch(text, query) {
        if (!query || !text) return text;
        const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(${escaped})`, 'gi');
        return text.replace(regex, '<mark class="search-highlight">$1</mark>');
    }

    _dispatch(eventName, detail = {}) {
        const event = new CustomEvent(`vibely:${eventName}`, { detail });
        window.dispatchEvent(event);
    }
}

// Attach globally
window.VibelySearchEngine = VibelySearchEngine;
if (!window.vibelySearch) {
    window.vibelySearch = new VibelySearchEngine();
}
