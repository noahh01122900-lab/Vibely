// ========================================================
// VIBELY AUDIO PLAYER ENGINE (player.js)
// Standalone audio controller with queue, shuffle, repeat,
// MediaSession API, Web Audio Analyser & event dispatching
// ========================================================

class VibelyAudioPlayer {
    constructor() {
        this.audio = new Audio();
        this.audio.preload = "metadata";

        this.currentTrack = null;
        this.currentIndex = -1;
        this.playlist = [];
        this.queue = [];

        this.isPlaying = false;
        this.isMuted = false;
        this.volume = parseFloat(localStorage.getItem("vibely_volume") ?? "0.8");
        this.audio.volume = this.volume;

        // Playback modes: repeat ('off' | 'all' | 'one'), shuffle (boolean)
        this.repeatMode = localStorage.getItem("vibely_repeat") || "off"; // 'off' | 'all' | 'one'
        this.isShuffle = localStorage.getItem("vibely_shuffle") === "true";
        this.shuffledOrder = [];

        // Web Audio Context for visualizer frequency analysis
        this.audioContext = null;
        this.analyser = null;
        this.sourceNode = null;
        this.analyserData = null;

        this._setupAudioListeners();
        this._setupMediaSession();
        this._setupKeyboardShortcuts();
    }

    // ----------------------------------------------------
    // Internal Event Handlers
    // ----------------------------------------------------
    _setupAudioListeners() {
        this.audio.addEventListener("play", () => {
            this.isPlaying = true;
            this._dispatch("play", { track: this.currentTrack });
            this._updateMediaSessionState();
        });

        this.audio.addEventListener("pause", () => {
            this.isPlaying = false;
            this._dispatch("pause", { track: this.currentTrack });
            this._updateMediaSessionState();
        });

        this.audio.addEventListener("timeupdate", () => {
            this._dispatch("timeupdate", {
                currentTime: this.audio.currentTime,
                duration: this.audio.duration || 0,
                progress: (this.audio.currentTime / (this.audio.duration || 1)) * 100
            });
        });

        this.audio.addEventListener("loadedmetadata", () => {
            this._dispatch("loadedmetadata", {
                duration: this.audio.duration,
                track: this.currentTrack
            });
        });

        this.audio.addEventListener("ended", () => {
            this._dispatch("ended", { track: this.currentTrack });
            this.handleTrackEnded();
        });

        this.audio.addEventListener("error", (e) => {
            console.warn("[VibelyPlayer] Playback error:", e);
            this._dispatch("error", { error: e, track: this.currentTrack });
        });
    }

    _dispatch(eventName, detail = {}) {
        const event = new CustomEvent(`vibely:${eventName}`, { detail });
        window.dispatchEvent(event);
    }

    // ----------------------------------------------------
    // Playback Controls
    // ----------------------------------------------------
    async loadTrack(track, autoplay = true) {
        if (!track || !track.audio) return false;

        this.currentTrack = track;
        this.audio.src = track.audio;

        this._updateMediaSessionMetadata(track);
        this._dispatch("trackchange", { track });

        if (autoplay) {
            return this.play();
        }
        return true;
    }

    async play(track = null) {
        if (track) {
            return this.loadTrack(track, true);
        }

        this._initAudioContext();

        try {
            await this.audio.play();
            this.isPlaying = true;
            return true;
        } catch (err) {
            console.warn("[VibelyPlayer] Autoplay prevented or stream interrupted:", err);
            this.isPlaying = false;
            return false;
        }
    }

    pause() {
        this.audio.pause();
        this.isPlaying = false;
    }

    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    seek(seconds) {
        if (!isFinite(seconds)) return;
        this.audio.currentTime = Math.max(0, Math.min(seconds, this.audio.duration || 0));
    }

    seekPercentage(percent) {
        if (!this.audio.duration) return;
        const target = (Math.max(0, Math.min(percent, 100)) / 100) * this.audio.duration;
        this.seek(target);
    }

    setVolume(value) {
        const vol = Math.max(0, Math.min(1, parseFloat(value) || 0));
        this.volume = vol;
        this.audio.volume = vol;
        if (vol > 0 && this.isMuted) {
            this.isMuted = false;
        }
        localStorage.setItem("vibely_volume", vol.toString());
        this._dispatch("volumechange", { volume: this.volume, isMuted: this.isMuted });
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        this.audio.muted = this.isMuted;
        this._dispatch("volumechange", { volume: this.volume, isMuted: this.isMuted });
        return this.isMuted;
    }

    // ----------------------------------------------------
    // Playlist & Queue Navigation
    // ----------------------------------------------------
    setPlaylist(songs, startIndex = 0, autoplay = true) {
        if (!Array.isArray(songs) || songs.length === 0) return;
        this.playlist = [...songs];
        this.currentIndex = startIndex >= 0 && startIndex < songs.length ? startIndex : 0;
        this._buildShuffleOrder();

        if (autoplay) {
            this.loadTrack(this.playlist[this.currentIndex], true);
        }
    }

    addToQueue(track) {
        if (!track) return;
        this.queue.push(track);
        this._dispatch("queuechange", { queue: [...this.queue] });
    }

    clearQueue() {
        this.queue = [];
        this._dispatch("queuechange", { queue: [] });
    }

    next() {
        // 1. If queue has tracks, play from queue first
        if (this.queue.length > 0) {
            const nextTrack = this.queue.shift();
            this._dispatch("queuechange", { queue: [...this.queue] });
            return this.loadTrack(nextTrack, true);
        }

        // 2. Play from current playlist
        if (this.playlist.length === 0) return;

        if (this.isShuffle && this.shuffledOrder.length === this.playlist.length) {
            const currentShufflePos = this.shuffledOrder.indexOf(this.currentIndex);
            const nextShufflePos = (currentShufflePos + 1) % this.shuffledOrder.length;
            this.currentIndex = this.shuffledOrder[nextShufflePos];
        } else {
            this.currentIndex = (this.currentIndex + 1) % this.playlist.length;
        }

        return this.loadTrack(this.playlist[this.currentIndex], true);
    }

    prev() {
        // If current song played more than 3 seconds, replay from start
        if (this.audio.currentTime > 3) {
            this.seek(0);
            return;
        }

        if (this.playlist.length === 0) return;

        if (this.isShuffle && this.shuffledOrder.length === this.playlist.length) {
            const currentShufflePos = this.shuffledOrder.indexOf(this.currentIndex);
            const prevShufflePos = (currentShufflePos - 1 + this.shuffledOrder.length) % this.shuffledOrder.length;
            this.currentIndex = this.shuffledOrder[prevShufflePos];
        } else {
            this.currentIndex = (this.currentIndex - 1 + this.playlist.length) % this.playlist.length;
        }

        return this.loadTrack(this.playlist[this.currentIndex], true);
    }

    handleTrackEnded() {
        if (this.repeatMode === "one") {
            this.seek(0);
            this.play();
            return;
        }

        if (this.repeatMode === "off" && this.currentIndex === this.playlist.length - 1 && this.queue.length === 0) {
            this.pause();
            this.seek(0);
            return;
        }

        this.next();
    }

    toggleShuffle() {
        this.isShuffle = !this.isShuffle;
        localStorage.setItem("vibely_shuffle", this.isShuffle.toString());
        if (this.isShuffle) this._buildShuffleOrder();
        this._dispatch("modechange", { shuffle: this.isShuffle, repeat: this.repeatMode });
        return this.isShuffle;
    }

    toggleRepeat() {
        const modes = ["off", "all", "one"];
        const nextIdx = (modes.indexOf(this.repeatMode) + 1) % modes.length;
        this.repeatMode = modes[nextIdx];
        localStorage.setItem("vibely_repeat", this.repeatMode);
        this._dispatch("modechange", { shuffle: this.isShuffle, repeat: this.repeatMode });
        return this.repeatMode;
    }

    _buildShuffleOrder() {
        const len = this.playlist.length;
        this.shuffledOrder = Array.from({ length: len }, (_, i) => i);
        for (let i = len - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.shuffledOrder[i], this.shuffledOrder[j]] = [this.shuffledOrder[j], this.shuffledOrder[i]];
        }
    }

    // ----------------------------------------------------
    // Media Session API & Global Lockscreen Integration
    // ----------------------------------------------------
    _setupMediaSession() {
        if (!("mediaSession" in navigator)) return;

        navigator.mediaSession.setActionHandler("play", () => this.play());
        navigator.mediaSession.setActionHandler("pause", () => this.pause());
        navigator.mediaSession.setActionHandler("previoustrack", () => this.prev());
        navigator.mediaSession.setActionHandler("nexttrack", () => this.next());
        navigator.mediaSession.setActionHandler("seekto", (details) => {
            if (details.seekTime !== undefined) this.seek(details.seekTime);
        });
    }

    _updateMediaSessionMetadata(track) {
        if (!("mediaSession" in navigator) || !track) return;

        const coverSrc = track.cover
            ? (track.cover.startsWith("http") ? track.cover : new URL(track.cover, window.location.href).href)
            : "";

        navigator.mediaSession.metadata = new MediaMetadata({
            title: track.title || "Vibely Track",
            artist: track.artist || "Unknown Artist",
            album: track.playlistName || "Vibely Music",
            artwork: coverSrc ? [{ src: coverSrc, sizes: "512x512", type: "image/png" }] : []
        });
    }

    _updateMediaSessionState() {
        if (!("mediaSession" in navigator)) return;
        navigator.mediaSession.playbackState = this.isPlaying ? "playing" : "paused";
    }

    // ----------------------------------------------------
    // Keyboard Shortcuts (Space = Play/Pause, Esc = Close, etc.)
    // ----------------------------------------------------
    _setupKeyboardShortcuts() {
        window.addEventListener("keydown", (e) => {
            // Ignore when typing inside input / textarea
            const tag = (e.target.tagName || "").toLowerCase();
            if (tag === "input" || tag === "textarea" || e.target.isContentEditable) return;

            if (e.code === "Space") {
                e.preventDefault();
                this.togglePlay();
            } else if (e.code === "ArrowRight" && e.shiftKey) {
                e.preventDefault();
                this.next();
            } else if (e.code === "ArrowLeft" && e.shiftKey) {
                e.preventDefault();
                this.prev();
            }
        });
    }

    // ----------------------------------------------------
    // Web Audio API Visualizer Support
    // ----------------------------------------------------
    _initAudioContext() {
        if (this.audioContext) return;
        try {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (!AudioContextClass) return;

            this.audioContext = new AudioContextClass();
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 64;
            this.sourceNode = this.audioContext.createMediaElementSource(this.audio);
            this.sourceNode.connect(this.analyser);
            this.analyser.connect(this.audioContext.destination);

            this.analyserData = new Uint8Array(this.analyser.frequencyBinCount);
        } catch (e) {
            // Browser security or cross-origin policy may restrict
            console.debug("[VibelyPlayer] Web Audio context initialization deferred:", e.message);
        }
    }

    getFrequencyData() {
        if (!this.analyser || !this.analyserData) return null;
        this.analyser.getByteFrequencyData(this.analyserData);
        return this.analyserData;
    }

    // ----------------------------------------------------
    // Helpers
    // ----------------------------------------------------
    static formatTime(seconds) {
        if (isNaN(seconds) || seconds < 0) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    }
}

// Attach globally
window.VibelyAudioPlayer = VibelyAudioPlayer;
if (!window.vibelyPlayer) {
    window.vibelyPlayer = new VibelyAudioPlayer();
}
