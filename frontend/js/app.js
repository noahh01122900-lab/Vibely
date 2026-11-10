// ========================================================
// VIBELY MUSIC PLAYER & DASHBOARD CONTROLLER
// Spotify-inspired layout, Anime Sunset Vibe, Glassmorphism
// ========================================================

// ==================================
// 1. MUSIC LIBRARY & FEATURED PLAYLISTS
// ==================================

const featurePlaylists = {
    midnight: {
        name: "Midnight Vibes",
        eyebrow: "CURATED PLAYLIST • NIGHT TIME",
        description: "Relax and enjoy the night",
        songs: [
            {
                title: "Don't love like I love you",
                artist: "BlueAzumy03",
                audio: "assets/audio/song1.mp3",
                cover: "assets/images/feature1.png",
                playlistName: "Midnight Vibes"
            },
            {
                title: "Midnight City Lights",
                artist: "Neon Skyline",
                audio: "assets/audio/song1.mp3",
                cover: "assets/images/song1.png",
                playlistName: "Midnight Vibes"
            },
            {
                title: "After Midnight Thoughts",
                artist: "BlueAzumy03 ft. Lofi Moon",
                audio: "assets/audio/song1.mp3",
                cover: "assets/images/song1.jpg",
                playlistName: "Midnight Vibes"
            },
            {
                title: "Moonlit Drive & Reverie",
                artist: "Midnight Groove",
                audio: "assets/audio/song1.mp3",
                cover: "assets/images/feature1.png",
                playlistName: "Midnight Vibes"
            },
            {
                title: "Late Night Echoes",
                artist: "Cosmic Whispers",
                audio: "assets/audio/song1.mp3",
                cover: "assets/images/song1.png",
                playlistName: "Midnight Vibes"
            }
        ]
    },
    love: {
        name: "Love Songs",
        eyebrow: "CURATED PLAYLIST • ROMANCE",
        description: "Feel every beat",
        songs: [
            {
                title: "Love Song",
                artist: "leberch",
                audio: "assets/audio/song2.mp3",
                cover: "assets/images/feature2.png",
                playlistName: "Love Songs"
            },
            {
                title: "Heartbeat Harmony",
                artist: "leberch ft. Luna",
                audio: "assets/audio/song2.mp3",
                cover: "assets/images/song2.png",
                playlistName: "Love Songs"
            },
            {
                title: "Forever & Always",
                artist: "Velvet Strings",
                audio: "assets/audio/song2.mp3",
                cover: "assets/images/song2.jpg",
                playlistName: "Love Songs"
            },
            {
                title: "Sweet Romance Acoustic",
                artist: "Sweet Serenade",
                audio: "assets/audio/song2.mp3",
                cover: "assets/images/feature2.png",
                playlistName: "Love Songs"
            },
            {
                title: "Holding Your Hand",
                artist: "leberch",
                audio: "assets/audio/song2.mp3",
                cover: "assets/images/song2.png",
                playlistName: "Love Songs"
            }
        ]
    },
    chill: {
        name: "Chill Moments",
        eyebrow: "CURATED PLAYLIST • CHILL & RELAX",
        description: "Take a little break",
        songs: [
            {
                title: "Gospel Song Praise Worship",
                artist: "echoes of lumen",
                audio: "assets/audio/song3.mp3",
                cover: "assets/images/feature3.png",
                playlistName: "Chill Moments"
            },
            {
                title: "Morning Sun Breeze",
                artist: "Calm Horizon",
                audio: "assets/audio/song3.mp3",
                cover: "assets/images/song3.png",
                playlistName: "Chill Moments"
            },
            {
                title: "Sunday Coffee Break",
                artist: "Lofi Cafe & Garden",
                audio: "assets/audio/song3.mp3",
                cover: "assets/images/song3.jpg",
                playlistName: "Chill Moments"
            },
            {
                title: "Soft Horizon Peace",
                artist: "echoes of lumen",
                audio: "assets/audio/song3.mp3",
                cover: "assets/images/feature3.png",
                playlistName: "Chill Moments"
            },
            {
                title: "Serene Soul Sanctuary",
                artist: "Quiet Waters",
                audio: "assets/audio/song3.mp3",
                cover: "assets/images/song3.png",
                playlistName: "Chill Moments"
            }
        ]
    }
};

const localSongs = [
    featurePlaylists.midnight.songs[0],
    featurePlaylists.love.songs[0],
    featurePlaylists.chill.songs[0],
    featurePlaylists.midnight.songs[1],
    featurePlaylists.love.songs[1],
    featurePlaylists.chill.songs[1],
    featurePlaylists.midnight.songs[2],
    featurePlaylists.love.songs[2],
    featurePlaylists.chill.songs[2]
];

// Current active song array
let songs = [...localSongs];
let currentSongIndex = -1;
let currentActiveVibe = null;
let shuffleMode = false;
let repeatMode = false;

// ==================================
// 2. DOM ELEMENT REFERENCES
// ==================================

// Bottom Player
const audioPlayer = document.getElementById("audioPlayer");
const playBtn = document.getElementById("playBtn");
const previousBtn = document.getElementById("previousBtn");
const nextBtn = document.getElementById("nextBtn");
const shuffleBtn = document.getElementById("shuffleBtn");
const repeatBtn = document.getElementById("repeatBtn");
const currentTitle = document.getElementById("currentTitle");
const currentArtist = document.getElementById("currentArtist");
const playerCover = document.getElementById("playerCover");
const currentTime = document.getElementById("currentTime");
const duration = document.getElementById("duration");
const progressBar = document.getElementById("progressBar");
const volumeControl = document.getElementById("volumeControl");
const playerFavBtn = document.getElementById("playerFavBtn");
const queueBtn = document.getElementById("queueBtn");
const fullscreenBtn = document.getElementById("fullscreenBtn");

// Right Sidebar (Now Playing Panel)
const rightCoverImg = document.getElementById("rightCoverImg");
const rightCurrentTitle = document.getElementById("rightCurrentTitle");
const rightCurrentArtist = document.getElementById("rightCurrentArtist");
const rightFavBtn = document.getElementById("rightFavBtn");
const rightProgressBar = document.getElementById("rightProgressBar");
const rightCurrentTime = document.getElementById("rightCurrentTime");
const rightDuration = document.getElementById("rightDuration");
const rightShuffleBtn = document.getElementById("rightShuffleBtn");
const rightPrevBtn = document.getElementById("rightPrevBtn");
const rightPlayBtn = document.getElementById("rightPlayBtn");
const rightNextBtn = document.getElementById("rightNextBtn");
const rightRepeatBtn = document.getElementById("rightRepeatBtn");
const recommendedList = document.getElementById("recommendedList");

// Topbar & Navigation
const searchInput = document.getElementById("searchInput");
const songList = document.getElementById("songList");
const sectionEyebrow = document.getElementById("sectionEyebrow");
const sectionTitle = document.getElementById("sectionTitle");
const resetVibeBtn = document.getElementById("resetVibeBtn");
const musicCards = document.querySelectorAll(".music-card");
const notificationBtn = document.getElementById("notificationBtn");
const upgradeBtn = document.getElementById("upgradeBtn");

// Hero Banner Carousel
const heroHeading = document.getElementById("heroHeading");
const heroSubtitle = document.getElementById("heroSubtitle");
const heroSlideTag = document.getElementById("heroSlideTag");
const heroCoverImg = document.getElementById("heroCoverImg");
const heroVinylTitle = document.getElementById("heroVinylTitle");
const heroVinylArtist = document.getElementById("heroVinylArtist");
const heroPlayBtn = document.getElementById("heroPlayBtn");
const heroExploreBtn = document.getElementById("heroExploreBtn");
const carouselPrev = document.getElementById("carouselPrev");
const carouselNext = document.getElementById("carouselNext");
const carouselDots = document.getElementById("carouselDots");

// Favorites View Elements
const favoritesNav = document.getElementById("favoritesNav");
const favoritesSection = document.getElementById("favorites");
const favoritesList = document.getElementById("favoritesList");
const emptyFavorites = document.getElementById("emptyFavorites");
const favoritesCount = document.getElementById("favoritesCount");
const clearFavoritesBtn = document.getElementById("clearFavoritesBtn");

// ==================================
// 3. FAVORITES MANAGEMENT (localStorage)
// ==================================

let favorites = JSON.parse(localStorage.getItem("vibely_favorites") || "[]");

function saveFavorites() {
    localStorage.setItem("vibely_favorites", JSON.stringify(favorites));
}

function getSongKey(song) {
    return `${song.title}|||${song.artist}`;
}

function isFavorite(song) {
    if (!song) return false;
    return favorites.some(f => getSongKey(f) === getSongKey(song));
}

function toggleFavorite(song) {
    if (!song) return;
    const key = getSongKey(song);
    const index = favorites.findIndex(f => getSongKey(f) === key);

    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push({ ...song });
    }

    saveFavorites();
    displaySongs(songs);
    updatePlayerFavBtn();
    updateFavoritesView();
    updateFavBadge();
}

function updatePlayerFavBtn() {
    const isFav = currentSongIndex >= 0 && isFavorite(songs[currentSongIndex]);

    if (playerFavBtn) {
        playerFavBtn.textContent = isFav ? "♥" : "♡";
        playerFavBtn.classList.toggle("favorited", isFav);
        playerFavBtn.style.visibility = currentSongIndex >= 0 ? "visible" : "hidden";
    }

    if (rightFavBtn) {
        rightFavBtn.textContent = isFav ? "♥" : "♡";
        rightFavBtn.classList.toggle("favorited", isFav);
    }
}

function updateFavBadge() {
    let badge = favoritesNav.querySelector(".fav-badge");
    const mobileFavBadge = document.getElementById("mobileFavBadge");

    if (favorites.length > 0) {
        if (!badge) {
            badge = document.createElement("span");
            badge.className = "fav-badge";
            favoritesNav.appendChild(badge);
        }
        badge.textContent = favorites.length;

        if (mobileFavBadge) {
            mobileFavBadge.textContent = favorites.length;
            mobileFavBadge.style.display = "inline-flex";
        }
    } else {
        if (badge) badge.remove();
        if (mobileFavBadge) mobileFavBadge.style.display = "none";
    }
}

// Toggle favorites on bottom player and right panel
if (playerFavBtn) {
    playerFavBtn.addEventListener("click", () => {
        if (currentSongIndex >= 0 && currentSongIndex < songs.length) {
            toggleFavorite(songs[currentSongIndex]);
            playerFavBtn.classList.add("pop");
            setTimeout(() => playerFavBtn.classList.remove("pop"), 350);
        }
    });
}

if (rightFavBtn) {
    rightFavBtn.addEventListener("click", () => {
        if (currentSongIndex >= 0 && currentSongIndex < songs.length) {
            toggleFavorite(songs[currentSongIndex]);
            rightFavBtn.classList.add("pop");
            setTimeout(() => rightFavBtn.classList.remove("pop"), 350);
        }
    });
}

// ==================================
// 4. FORMAT TIME (m:ss)
// ==================================

function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

// ==================================
// 5. DISPLAY SONGS IN DISCOVER LIST
// ==================================

function displaySongs(songArray) {
    if (!songList) return;
    songList.innerHTML = "";

    songArray.forEach((song, idx) => {
        const songItem = document.createElement("div");
        songItem.className = "song-item";

        if (idx === currentSongIndex) {
            songItem.classList.add("selected");
        }

        const cover = document.createElement("div");
        cover.className = "song-cover";

        const image = document.createElement("img");
        image.src = song.cover;
        image.alt = `${song.title} artwork`;
        image.onerror = () => { cover.textContent = "🎵"; };
        cover.appendChild(image);

        const info = document.createElement("div");
        info.className = "song-info";

        const title = document.createElement("h3");
        title.textContent = song.title;

        const artist = document.createElement("p");
        artist.textContent = `${song.artist} ${song.playlistName ? "• " + song.playlistName : ""}`;

        info.append(title, artist);

        // Heart Button
        const favBtn = document.createElement("button");
        favBtn.className = "song-fav-btn";
        favBtn.textContent = isFavorite(song) ? "♥" : "♡";
        if (isFavorite(song)) favBtn.classList.add("favorited");
        favBtn.title = isFavorite(song) ? "Remove from favorites" : "Add to favorites";

        favBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            toggleFavorite(song);
            favBtn.classList.add("pop");
            setTimeout(() => favBtn.classList.remove("pop"), 350);
        });

        songItem.append(cover, info, favBtn);

        // Play on click
        songItem.addEventListener("click", () => {
            loadSong(idx);
        });

        songList.appendChild(songItem);
    });
}

// ==================================
// 6. LOAD & PLAY MUSIC
// ==================================

function loadSong(index) {
    if (index < 0 || index >= songs.length) return;

    currentSongIndex = index;
    const song = songs[currentSongIndex];

    audioPlayer.src = song.audio;

    // Update Bottom Player
    currentTitle.textContent = song.title;
    currentArtist.textContent = song.artist;
    playerCover.innerHTML = "";
    const bImg = document.createElement("img");
    bImg.src = song.cover;
    bImg.alt = song.title;
    bImg.onerror = () => { playerCover.textContent = "🎧"; };
    playerCover.appendChild(bImg);

    // Update Right Sidebar Panel
    if (rightCurrentTitle) rightCurrentTitle.textContent = song.title;
    if (rightCurrentArtist) rightCurrentArtist.textContent = song.artist;
    if (rightCoverImg) rightCoverImg.src = song.cover;

    // Reset progress
    progressBar.value = 0;
    if (rightProgressBar) rightProgressBar.value = 0;
    currentTime.textContent = "0:00";
    if (rightCurrentTime) rightCurrentTime.textContent = "0:00";
    duration.textContent = "0:00";
    if (rightDuration) rightDuration.textContent = "0:00";

    displaySongs(songs);
    playMusic();
    updatePlayerFavBtn();
    updateFeaturedCardsUI();
}

async function playMusic() {
    if (currentSongIndex === -1) {
        loadSong(0);
        return;
    }

    const song = songs[currentSongIndex];
    if (!song || !song.audio) {
        alert("Sorry, this song doesn't have an available audio preview.");
        return;
    }

    try {
        await audioPlayer.play();

        // Update play button text on both players
        playBtn.textContent = "⏸";
        if (rightPlayBtn) rightPlayBtn.textContent = "⏸";
        playerCover.classList.add("playing");

        updateFeaturedCardsUI();
    } catch (error) {
        playBtn.textContent = "▶";
        if (rightPlayBtn) rightPlayBtn.textContent = "▶";
        playerCover.classList.remove("playing");
        updateFeaturedCardsUI();
        console.error("Playback failed:", error);
    }
}

function pauseMusic() {
    audioPlayer.pause();
    playBtn.textContent = "▶";
    if (rightPlayBtn) rightPlayBtn.textContent = "▶";
    playerCover.classList.remove("playing");
    updateFeaturedCardsUI();
}

function togglePlayPause() {
    if (currentSongIndex === -1) {
        loadSong(0);
    } else if (audioPlayer.paused) {
        playMusic();
    } else {
        pauseMusic();
    }
}

playBtn.addEventListener("click", togglePlayPause);
if (rightPlayBtn) rightPlayBtn.addEventListener("click", togglePlayPause);

// ==================================
// 7. NEXT / PREVIOUS / SHUFFLE / REPEAT
// ==================================

function nextSong() {
    if (songs.length === 0) return;

    if (shuffleMode) {
        let randomIndex = Math.floor(Math.random() * songs.length);
        if (randomIndex === currentSongIndex && songs.length > 1) {
            randomIndex = (randomIndex + 1) % songs.length;
        }
        loadSong(randomIndex);
    } else {
        const nextIndex = (currentSongIndex + 1) % songs.length;
        loadSong(nextIndex);
    }
}

function previousSong() {
    if (songs.length === 0) return;
    const prevIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(prevIndex);
}

nextBtn.addEventListener("click", nextSong);
previousBtn.addEventListener("click", previousSong);
if (rightNextBtn) rightNextBtn.addEventListener("click", nextSong);
if (rightPrevBtn) rightPrevBtn.addEventListener("click", previousSong);

// Shuffle & Repeat handlers
function toggleShuffle() {
    shuffleMode = !shuffleMode;
    if (shuffleBtn) shuffleBtn.classList.toggle("active", shuffleMode);
    if (rightShuffleBtn) rightShuffleBtn.classList.toggle("active", shuffleMode);
}

function toggleRepeat() {
    repeatMode = !repeatMode;
    if (repeatBtn) repeatBtn.classList.toggle("active", repeatMode);
    if (rightRepeatBtn) rightRepeatBtn.classList.toggle("active", repeatMode);
}

if (shuffleBtn) shuffleBtn.addEventListener("click", toggleShuffle);
if (rightShuffleBtn) rightShuffleBtn.addEventListener("click", toggleShuffle);
if (repeatBtn) repeatBtn.addEventListener("click", toggleRepeat);
if (rightRepeatBtn) rightRepeatBtn.addEventListener("click", toggleRepeat);

// Auto-advance or Repeat on song end
audioPlayer.addEventListener("ended", () => {
    if (repeatMode) {
        audioPlayer.currentTime = 0;
        playMusic();
    } else {
        playNextSameArtist();
    }
});


async function playNextSameArtist() {
    const currentSong = songs[currentSongIndex];

    if (!currentSong) {
        console.log("Current song not found!");
        return;
    }

    const artistName = currentSong.artist;

    try {
        console.log("Searching artist:", artistName);

        const url = `https://itunes.apple.com/search?term=${encodeURIComponent(artistName)}&entity=song&limit=50&country=KH`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        console.log("API results:", data.results.length);

        const artistSongs = data.results.filter(song =>
            song.artistName.toLowerCase() === artistName.toLowerCase() &&
            song.previewUrl &&
            song.trackId !== currentSong.trackId
        );

        if (artistSongs.length === 0) {
            console.log("No more songs found!");
            return;
        }

        const nextTrack = artistSongs[
            Math.floor(Math.random() * artistSongs.length)
        ];

        console.log("Next song:", nextTrack.trackName);

        songs.push({
            title: nextTrack.trackName,
            artist: nextTrack.artistName,
            audio: nextTrack.previewUrl,
            cover: nextTrack.artworkUrl100 || "",
            appleUrl: nextTrack.trackViewUrl || "",
            trackId: nextTrack.trackId
        });

        loadSong(songs.length - 1);

    } catch (error) {
        console.error("Auto-next error:", error);
    }
}


// ==================================
// 8. PROGRESS BAR & TIMINGS
// ==================================

audioPlayer.addEventListener("timeupdate", () => {
    if (!audioPlayer.duration) return;

    const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressBar.value = progress;
    if (rightProgressBar) rightProgressBar.value = progress;

    const formatted = formatTime(audioPlayer.currentTime);
    currentTime.textContent = formatted;
    if (rightCurrentTime) rightCurrentTime.textContent = formatted;
});

audioPlayer.addEventListener("loadedmetadata", () => {
    const formatted = formatTime(audioPlayer.duration);
    duration.textContent = formatted;
    if (rightDuration) rightDuration.textContent = formatted;
});

progressBar.addEventListener("input", () => {
    if (!audioPlayer.duration) return;
    audioPlayer.currentTime = (progressBar.value / 100) * audioPlayer.duration;
});

if (rightProgressBar) {
    rightProgressBar.addEventListener("input", () => {
        if (!audioPlayer.duration) return;
        audioPlayer.currentTime = (rightProgressBar.value / 100) * audioPlayer.duration;
    });
}

// Volume
audioPlayer.volume = Number(volumeControl.value);
volumeControl.addEventListener("input", () => {
    audioPlayer.volume = Number(volumeControl.value);
    const volIcon = document.getElementById("volumeIcon");
    if (volIcon) {
        volIcon.textContent = audioPlayer.volume === 0 ? "🔇" : (audioPlayer.volume < 0.4 ? "🔉" : "🔊");
    }
});

// ==================================
// 9. HERO CAROUSEL CONTROLLER
// ==================================

const heroSlides = [
    {
        tag: "FEATURED SOUNDTRACK • SUNSET LOFI",
        heading: "Feel the music.<br><span>Live the vibe.</span>",
        subtitle: "Discover your favorite songs and make every moment special with curated anime sunset vibes.",
        cover: "assets/images/feature1.png",
        title: "Midnight Vibes",
        artist: "BlueAzumy03",
        vibe: "midnight",
        songIndex: 0
    },
    {
        tag: "FEATURED SOUNDTRACK • ROMANTIC BEATS",
        heading: "Heartbeat Harmony.<br><span>Feel every pulse.</span>",
        subtitle: "Immerse yourself in gentle romantic acoustics and heartfelt melodies crafted for the soul.",
        cover: "assets/images/feature2.png",
        title: "Love Songs",
        artist: "leberch",
        vibe: "love",
        songIndex: 1
    },
    {
        tag: "FEATURED SOUNDTRACK • CHILL TRANQUILITY",
        heading: "Breathe in peace.<br><span>Unwind your mind.</span>",
        subtitle: "Take a little break from the world with gentle morning breezes and soothing lofi ambiance.",
        cover: "assets/images/feature3.png",
        title: "Chill Moments",
        artist: "echoes of lumen",
        vibe: "chill",
        songIndex: 2
    }
];

let currentHeroIndex = 0;

function updateHeroSlide(index) {
    currentHeroIndex = (index + heroSlides.length) % heroSlides.length;
    const slide = heroSlides[currentHeroIndex];

    if (heroSlideTag) heroSlideTag.textContent = slide.tag;
    if (heroHeading) heroHeading.innerHTML = slide.heading;
    if (heroSubtitle) heroSubtitle.textContent = slide.subtitle;
    if (heroCoverImg) heroCoverImg.src = slide.cover;
    if (heroVinylTitle) heroVinylTitle.textContent = slide.title;
    if (heroVinylArtist) heroVinylArtist.textContent = slide.artist;

    if (carouselDots) {
        const dots = carouselDots.querySelectorAll(".dot");
        dots.forEach((d, i) => d.classList.toggle("active", i === currentHeroIndex));
    }
}

if (carouselNext) carouselNext.addEventListener("click", () => updateHeroSlide(currentHeroIndex + 1));
if (carouselPrev) carouselPrev.addEventListener("click", () => updateHeroSlide(currentHeroIndex - 1));

if (carouselDots) {
    carouselDots.querySelectorAll(".dot").forEach((d, i) => {
        d.addEventListener("click", () => updateHeroSlide(i));
    });
}

// Hero Play Now button
if (heroPlayBtn) {
    heroPlayBtn.addEventListener("click", () => {
        const slide = heroSlides[currentHeroIndex];
        selectVibe(slide.vibe);
    });
}

if (heroExploreBtn) {
    heroExploreBtn.addEventListener("click", () => {
        const featSection = document.getElementById("featuredSection");
        if (featSection) featSection.scrollIntoView({ behavior: "smooth" });
    });
}

// ==================================
// 10. RECENTLY PLAYED & RECOMMENDED LISTS
// ==================================

// Click handler for 4 Recently Played Cards
document.querySelectorAll(".recent-card").forEach((card) => {
    card.addEventListener("click", () => {
        const vibe = card.getAttribute("data-vibe");
        const songIdx = parseInt(card.getAttribute("data-song-idx"), 10);

        if (vibe && featurePlaylists[vibe]) {
            songs = [...featurePlaylists[vibe].songs];
            currentActiveVibe = vibe;
            loadSong(songIdx || 0);
        } else {
            loadSong(songIdx || 0);
        }
    });
});

const seeAllRecentBtn = document.getElementById("seeAllRecentBtn");
if (seeAllRecentBtn) {
    seeAllRecentBtn.addEventListener("click", () => {
        const disc = document.getElementById("discover");
        if (disc) disc.scrollIntoView({ behavior: "smooth" });
    });
}

// Populate "Recommended For You" in Right Sidebar
function populateRecommendedList() {
    if (!recommendedList) return;
    recommendedList.innerHTML = "";

    const recs = [
        featurePlaylists.midnight.songs[1],
        featurePlaylists.love.songs[1],
        featurePlaylists.chill.songs[1],
        featurePlaylists.midnight.songs[3]
    ];

    recs.forEach((item) => {
        const div = document.createElement("div");
        div.className = "rec-item";
        div.innerHTML = `
            <img src="${item.cover}" alt="${item.title}" class="rec-cover">
            <div class="rec-meta">
                <h5>${item.title}</h5>
                <p>${item.artist}</p>
            </div>
            <button type="button" class="rec-play-btn" aria-label="Play ${item.title}">▶</button>
        `;

        div.addEventListener("click", () => {
            const foundIdx = songs.findIndex(s => getSongKey(s) === getSongKey(item));
            if (foundIdx > -1) {
                loadSong(foundIdx);
            } else {
                songs.push({ ...item });
                loadSong(songs.length - 1);
            }
        });

        recommendedList.appendChild(div);
    });
}

// ==================================
// 11. PLAYLIST SHORTCUTS & FEATURED VIBES
// ==================================

function updateFeaturedCardsUI() {
    musicCards.forEach((card) => {
        const vibe = card.getAttribute("data-vibe");
        const playBtnEl = card.querySelector(".card-play-btn");

        if (vibe === currentActiveVibe) {
            card.classList.add("active");
            if (playBtnEl) {
                playBtnEl.textContent = (!audioPlayer.paused && currentSongIndex !== -1) ? "⏸" : "▶";
            }
        } else {
            card.classList.remove("active");
            if (playBtnEl) {
                playBtnEl.textContent = "▶";
            }
        }
    });
}

function selectVibe(vibeKey) {
    const playlist = featurePlaylists[vibeKey];
    if (!playlist) return;

    if (currentActiveVibe === vibeKey) {
        togglePlayPause();
        updateFeaturedCardsUI();
        return;
    }

    currentActiveVibe = vibeKey;
    songs = [...playlist.songs];
    currentSongIndex = -1;

    if (sectionEyebrow) sectionEyebrow.textContent = playlist.eyebrow;
    if (sectionTitle) sectionTitle.textContent = `${playlist.name} (${songs.length} Tracks)`;
    if (resetVibeBtn) resetVibeBtn.style.display = "inline-block";

    loadSong(0);
    updateFeaturedCardsUI();

    const discoverSection = document.getElementById("discover");
    if (discoverSection) {
        discoverSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}

function resetToAllSongs() {
    currentActiveVibe = null;
    songs = [...localSongs];
    currentSongIndex = -1;

    if (sectionEyebrow) sectionEyebrow.textContent = "YOUR PERSONAL COLLECTION";
    if (sectionTitle) sectionTitle.textContent = "Discover Music";
    if (resetVibeBtn) resetVibeBtn.style.display = "none";

    updateFeaturedCardsUI();
    displaySongs(songs);
}

musicCards.forEach((card) => {
    card.addEventListener("click", () => {
        const vibe = card.getAttribute("data-vibe");
        if (vibe) selectVibe(vibe);
    });
});

if (resetVibeBtn) resetVibeBtn.addEventListener("click", resetToAllSongs);

// Playlist shortcuts in left sidebar
document.querySelectorAll(".shortcut-link").forEach((btn) => {
    btn.addEventListener("click", () => {
        const shortcut = btn.getAttribute("data-shortcut");
        if (shortcut === "chill") selectVibe("chill");
        else if (shortcut === "gaming") selectVibe("midnight");
        else if (shortcut === "study") selectVibe("chill");
        else if (shortcut === "top50") resetToAllSongs();
    });
});

// ==================================
// 12. FAVORITES VIEW TOGGLE
// ==================================

let showingFavorites = false;

favoritesNav.addEventListener("click", (e) => {
    e.preventDefault();
    showingFavorites = !showingFavorites;

    document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
    if (showingFavorites) {
        favoritesNav.classList.add("active");
        favoritesSection.style.display = "block";
        updateFavoritesView();
        favoritesSection.scrollIntoView({ behavior: "smooth" });
    } else {
        favoritesSection.style.display = "none";
        document.getElementById("navHome").classList.add("active");
    }
});

document.querySelectorAll('.nav-link:not(#favoritesNav)').forEach(link => {
    link.addEventListener("click", () => {
        showingFavorites = false;
        favoritesSection.style.display = "none";
        document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
        link.classList.add("active");
        if (link.id === "navHome") resetToAllSongs();
    });
});

function updateFavoritesView() {
    if (!favoritesList) return;
    favoritesList.innerHTML = "";

    if (favorites.length === 0) {
        emptyFavorites.style.display = "block";
        clearFavoritesBtn.style.display = "none";
        favoritesCount.textContent = "";
    } else {
        emptyFavorites.style.display = "none";
        clearFavoritesBtn.style.display = "inline-block";
        favoritesCount.textContent = `(${favorites.length})`;

        favorites.forEach((song) => {
            const songItem = document.createElement("div");
            songItem.className = "song-item";

            const cover = document.createElement("div");
            cover.className = "song-cover";
            const image = document.createElement("img");
            image.src = song.cover;
            image.alt = song.title;
            image.onerror = () => { cover.textContent = "🎵"; };
            cover.appendChild(image);

            const info = document.createElement("div");
            info.className = "song-info";
            const title = document.createElement("h3");
            title.textContent = song.title;
            const artist = document.createElement("p");
            artist.textContent = song.artist;
            info.append(title, artist);

            const removeBtn = document.createElement("button");
            removeBtn.className = "song-fav-btn favorited";
            removeBtn.textContent = "♥";
            removeBtn.title = "Remove from favorites";
            removeBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                toggleFavorite(song);
            });

            songItem.append(cover, info, removeBtn);

            songItem.addEventListener("click", () => {
                const exIdx = songs.findIndex(s => getSongKey(s) === getSongKey(song));
                if (exIdx > -1) {
                    loadSong(exIdx);
                } else {
                    songs.push({ ...song });
                    loadSong(songs.length - 1);
                }
            });

            favoritesList.appendChild(songItem);
        });
    }
}

if (clearFavoritesBtn) {
    clearFavoritesBtn.addEventListener("click", () => {
        if (confirm("Remove all liked songs?")) {
            favorites = [];
            saveFavorites();
            updateFavoritesView();
            displaySongs(songs);
            updatePlayerFavBtn();
            updateFavBadge();
        }
    });
}

// ==================================
// 13. SPOTIFY-STYLE LIVE SEARCH CONTROLLER
// ==================================

const searchWrapper = document.getElementById("searchWrapper");
const searchClearBtn = document.getElementById("searchClearBtn");
const spotifySearchDropdown = document.getElementById("spotifySearchDropdown");

let searchTimeout;
let recentSearches = JSON.parse(localStorage.getItem("vibely_recent_searches") || '["Midnight Vibes", "Love Song", "Chill Moments"]');

function saveRecentSearches() {
    localStorage.setItem("vibely_recent_searches", JSON.stringify(recentSearches.slice(0, 8)));
}

function addRecentSearch(term) {
    if (!term || typeof term !== "string") return;
    const clean = term.trim();
    if (!clean) return;
    recentSearches = [clean, ...recentSearches.filter(t => t.toLowerCase() !== clean.toLowerCase())].slice(0, 6);
    saveRecentSearches();
}

// Gather all unique in-memory tracks for instant 0ms search
function getAllSearchableSongs() {
    const pool = [
        ...localSongs,
        ...featurePlaylists.midnight.songs,
        ...featurePlaylists.love.songs,
        ...featurePlaylists.chill.songs
    ];
    // Deduplicate by title + artist
    const seen = new Set();
    return pool.filter(s => {
        const key = getSongKey(s);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}

function openSpotifySearch() {
    if (!spotifySearchDropdown) return;
    spotifySearchDropdown.style.display = "block";
    const query = searchInput.value.trim();

    if (query === "") {
        if (searchClearBtn) searchClearBtn.style.display = "none";
        renderSpotifySearchEmpty();
    } else {
        if (searchClearBtn) searchClearBtn.style.display = "grid";
        performSpotifySearch(query);
    }
}

function closeSpotifySearch() {
    if (spotifySearchDropdown) {
        spotifySearchDropdown.style.display = "none";
    }
}

// Render empty / focused state (Recent Searches & Browse Categories)
function renderSpotifySearchEmpty() {
    if (!spotifySearchDropdown) return;

    let recentHtml = "";
    if (recentSearches.length > 0) {
        recentHtml = `
            <div class="recent-searches-header">
                <span>RECENT SEARCHES</span>
                <button type="button" class="clear-recent-btn" id="btnClearRecent">Clear History</button>
            </div>
            <div class="recent-searches-chips">
                ${recentSearches.map(term => `
                    <button type="button" class="search-chip" data-search-term="${term}">
                        <span>⌕</span>
                        <span>${term}</span>
                    </button>
                `).join("")}
            </div>
        `;
    }

    spotifySearchDropdown.innerHTML = `
        <div class="spotify-empty-state-wrap">
            ${recentHtml}
            <div>
                <div class="recent-searches-header" style="margin-top: 6px;">
                    <span>BROWSE GENRES & MOODS</span>
                </div>
                <div class="spotify-browse-grid">
                    <div class="spotify-browse-card card-chill" data-browse-vibe="chill">
                        <h4>Chill & Lofi</h4>
                        <span>Gentle beats & calm</span>
                        <div class="browse-icon">🎧</div>
                    </div>
                    <div class="spotify-browse-card card-midnight" data-browse-vibe="midnight">
                        <h4>Midnight Anime</h4>
                        <span>Night drive & synth</span>
                        <div class="browse-icon">🌙</div>
                    </div>
                    <div class="spotify-browse-card card-love" data-browse-vibe="love">
                        <h4>Love & Romance</h4>
                        <span>Heartbeat acoustics</span>
                        <div class="browse-icon">💕</div>
                    </div>
                    <div class="spotify-browse-card card-gaming" data-browse-shortcut="gaming">
                        <h4>Gaming Beats</h4>
                        <span>High energy focus</span>
                        <div class="browse-icon">🎮</div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Attach listeners to chips
    spotifySearchDropdown.querySelectorAll(".search-chip").forEach(chip => {
        chip.addEventListener("click", () => {
            const term = chip.getAttribute("data-search-term");
            searchInput.value = term;
            if (searchClearBtn) searchClearBtn.style.display = "grid";
            performSpotifySearch(term);
        });
    });

    const btnClearRecent = document.getElementById("btnClearRecent");
    if (btnClearRecent) {
        btnClearRecent.addEventListener("click", () => {
            recentSearches = [];
            saveRecentSearches();
            renderSpotifySearchEmpty();
        });
    }

    // Attach listeners to browse cards
    spotifySearchDropdown.querySelectorAll("[data-browse-vibe]").forEach(card => {
        card.addEventListener("click", () => {
            const vibe = card.getAttribute("data-browse-vibe");
            closeSpotifySearch();
            selectVibe(vibe);
        });
    });

    spotifySearchDropdown.querySelectorAll("[data-browse-shortcut]").forEach(card => {
        card.addEventListener("click", () => {
            closeSpotifySearch();
            selectVibe("midnight");
        });
    });
}

// Render search results like Spotify (Top Result + Songs List)
function renderSpotifySearchResults(query, matches) {
    if (!spotifySearchDropdown) return;

    if (matches.length === 0) {
        spotifySearchDropdown.innerHTML = `
            <div class="spotify-no-results">
                <span>⌕</span>
                <h4>No results found for "${query}"</h4>
                <p>Please check your spelling, or try searching for "love", "night", or "chill".</p>
            </div>
        `;
        return;
    }

    const topResult = matches[0];
    const otherSongs = matches.slice(1, 6);

    const topResultHtml = `
        <div class="spotify-top-column">
            <div class="search-column-title">TOP RESULT</div>
            <div class="spotify-top-result-card" id="spotifyTopCard">
                <img src="${topResult.cover}" alt="${topResult.title}" class="spotify-top-art">
                <div class="spotify-top-title">${topResult.title}</div>
                <div class="spotify-top-artist">${topResult.artist}</div>
                <span class="spotify-type-pill">SONG</span>
                <button type="button" class="spotify-top-play-btn" title="Play">▶</button>
            </div>
        </div>
    `;

    const otherSongsHtml = `
        <div class="spotify-songs-column">
            <div class="search-column-title">SONGS</div>
            <div class="spotify-songs-list">
                ${(otherSongs.length > 0 ? otherSongs : [topResult]).map((song, i) => `
                    <div class="spotify-song-row" data-result-idx="${matches.indexOf(song)}">
                        <img src="${song.cover}" alt="${song.title}" class="spotify-row-art">
                        <div class="spotify-row-info">
                            <div class="spotify-row-title">${song.title}</div>
                            <div class="spotify-row-artist">${song.artist}</div>
                        </div>
                        <div class="spotify-row-right">
                            <span class="spotify-row-time">3:12</span>
                            <button type="button" class="spotify-row-fav ${isFavorite(song) ? "favorited" : ""}" data-fav-idx="${matches.indexOf(song)}">
                                ${isFavorite(song) ? "♥" : "♡"}
                            </button>
                        </div>
                    </div>
                `).join("")}
            </div>
        </div>
    `;

    spotifySearchDropdown.innerHTML = `
        <div class="spotify-search-results-grid">
            ${topResultHtml}
            ${otherSongsHtml}
        </div>
    `;

    // Click Top Result -> Play song
    const topCard = document.getElementById("spotifyTopCard");
    if (topCard) {
        topCard.addEventListener("click", () => {
            playSearchResult(topResult);
        });
    }

    // Click song rows -> Play song
    spotifySearchDropdown.querySelectorAll(".spotify-song-row").forEach(row => {
        row.addEventListener("click", (e) => {
            if (e.target.closest(".spotify-row-fav")) return; // Don't trigger play on heart click
            const idx = parseInt(row.getAttribute("data-result-idx"), 10);
            if (matches[idx]) {
                playSearchResult(matches[idx]);
            }
        });
    });

    // Heart buttons on search rows
    spotifySearchDropdown.querySelectorAll(".spotify-row-fav").forEach(favBtn => {
        favBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            const idx = parseInt(favBtn.getAttribute("data-fav-idx"), 10);
            if (matches[idx]) {
                toggleFavorite(matches[idx]);
                favBtn.textContent = isFavorite(matches[idx]) ? "♥" : "♡";
                favBtn.classList.toggle("favorited", isFavorite(matches[idx]));
            }
        });
    });
}

function playSearchResult(song) {
    addRecentSearch(song.title);

    // Check if song exists in current playlist
    const foundIdx = songs.findIndex(s => getSongKey(s) === getSongKey(song));
    if (foundIdx > -1) {
        loadSong(foundIdx);
    } else {
        // Append to current song list and play
        songs.unshift({ ...song });
        loadSong(0);
    }

    closeSpotifySearch();
}

function performSpotifySearch(query) {
    const q = query.toLowerCase();
    const allPool = getAllSearchableSongs();

    // Instant 0ms local match
    const localMatches = allPool.filter(s =>
        s.title.toLowerCase().includes(q) ||
        s.artist.toLowerCase().includes(q) ||
        (s.playlistName && s.playlistName.toLowerCase().includes(q))
    );

    renderSpotifySearchResults(query, localMatches);

    // If query is >= 2 chars, fetch supplemental online songs from iTunes API
    clearTimeout(searchTimeout);
    if (query.length >= 2) {
        searchTimeout = setTimeout(async () => {
            try {
                const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=8`;
                const response = await fetch(url);
                if (!response.ok) return;
                const data = await response.json();

                const onlineTracks = data.results.map(track => ({
                    title: track.trackName,
                    artist: track.artistName,
                    audio: track.previewUrl || null,
                    cover: track.artworkUrl100 || "",
                    playlistName: "iTunes Search"
                })).filter(t => !!t.audio);

                // Merge with local matches
                const merged = [...localMatches];
                onlineTracks.forEach(ot => {
                    if (!merged.some(m => getSongKey(m) === getSongKey(ot))) {
                        merged.push(ot);
                    }
                });

                // Re-render with augmented tracks
                if (searchInput.value.trim().toLowerCase() === q) {
                    renderSpotifySearchResults(query, merged);
                }
            } catch (err) {
                // Online search optional fallback - local matches already displayed
            }
        }, 320);
    }
}

// Event Listeners for Search
if (searchInput) {
    searchInput.addEventListener("focus", () => {
        openSpotifySearch();
    });

    searchInput.addEventListener("input", () => {
        const query = searchInput.value.trim();
        if (searchClearBtn) {
            searchClearBtn.style.display = query ? "grid" : "none";
        }

        if (query === "") {
            renderSpotifySearchEmpty();
        } else {
            performSpotifySearch(query);
        }
    });

    searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeSpotifySearch();
            searchInput.blur();
        }
    });
}

if (searchClearBtn) {
    searchClearBtn.addEventListener("click", () => {
        searchInput.value = "";
        searchClearBtn.style.display = "none";
        renderSpotifySearchEmpty();
        searchInput.focus();
    });
}

// Close search dropdown when clicking outside
document.addEventListener("click", (e) => {
    if (searchWrapper && !searchWrapper.contains(e.target)) {
        closeSpotifySearch();
    }
});

// Sidebar "Search" navigation item focuses the search bar
const navSearch = document.getElementById("navSearch");
if (navSearch) {
    navSearch.addEventListener("click", (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        searchInput.focus();
        openSpotifySearch();
    });
}

// ==================================
// 14. AUXILIARY BUTTONS (QUEUE, FULLSCREEN, UPGRADE, NOTIFICATIONS)
// ==================================

if (queueBtn) {
    queueBtn.addEventListener("click", () => {
        const nextList = songs.slice(currentSongIndex + 1, currentSongIndex + 4).map(s => s.title).join(", ");
        alert(`Up Next in Queue:\n${nextList || "End of current list"}`);
    });
}

if (fullscreenBtn) {
    fullscreenBtn.addEventListener("click", () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
        } else {
            document.exitFullscreen().catch(() => {});
        }
    });
}

if (notificationBtn) {
    notificationBtn.addEventListener("click", () => {
        alert("🔔 Vibely Notifications:\n• New anime sunset vibes added to Chill Moments!\n• Your personalized playlist 'Anime Dreams' is ready.");
    });
}

if (upgradeBtn) {
    upgradeBtn.addEventListener("click", () => {
        alert("👑 Vibely PRO Plan:\n• Ad-free streaming\n• Ultra Hi-Fi Lossless Audio (320kbps)\n• Offline downloads & Unlimited skips\n\nStarting at only $4.99/month!");
    });
}

// ==================================
// 15. THEME TOGGLE (SYNCED)
// ==================================


const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");

function updateThemeIcon(iconName) {
    if (!themeToggle) return;

    themeToggle.innerHTML = `<i data-lucide="${iconName}"></i>`;
    lucide.createIcons();
}

function applyMainTheme(theme) {
    if (theme === "light") {
        document.body.classList.add("light-mode");
        updateThemeIcon("moon");
    } else {
        document.body.classList.remove("light-mode");
        updateThemeIcon("sun");
    }
}

const savedTheme = localStorage.getItem("vibely_theme") || "dark";
applyMainTheme(savedTheme);

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        const isLight = document.body.classList.contains("light-mode");
        const newTheme = isLight ? "dark" : "light";

        localStorage.setItem("vibely_theme", newTheme);
        applyMainTheme(newTheme);
    });
}

// ==================================
// 15. MOBILE DRAWER & BOTTOM NAVIGATION
// ==================================

const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const sidebarCloseBtn = document.getElementById("sidebarCloseBtn");
const sidebarBackdrop = document.getElementById("sidebarBackdrop");
const leftSidebarEl = document.getElementById("leftSidebar") || document.querySelector(".left-sidebar");
const mobileNavMenuBtn = document.getElementById("mobileNavMenuBtn");

function openMobileSidebar() {
    if (leftSidebarEl) leftSidebarEl.classList.add("mobile-open");
    if (sidebarBackdrop) sidebarBackdrop.classList.add("active");
    document.body.classList.add("drawer-open");
}

function closeMobileSidebar() {
    if (leftSidebarEl) leftSidebarEl.classList.remove("mobile-open");
    if (sidebarBackdrop) sidebarBackdrop.classList.remove("active");
    document.body.classList.remove("drawer-open");
}

if (mobileMenuBtn) mobileMenuBtn.addEventListener("click", openMobileSidebar);
if (mobileNavMenuBtn) mobileNavMenuBtn.addEventListener("click", openMobileSidebar);
if (sidebarCloseBtn) sidebarCloseBtn.addEventListener("click", closeMobileSidebar);
if (sidebarBackdrop) sidebarBackdrop.addEventListener("click", closeMobileSidebar);

// Close mobile drawer when clicking links inside sidebar on phone screens
if (leftSidebarEl) {
    leftSidebarEl.querySelectorAll(".nav-link, .shortcut-link, .logo").forEach((item) => {
        item.addEventListener("click", () => {
            if (window.innerWidth <= 768) {
                closeMobileSidebar();
            }
        });
    });
}

// Mobile Bottom Nav items handling
const mobileNavHome = document.getElementById("mobileNavHome");
const mobileNavSearch = document.getElementById("mobileNavSearch");
const mobileNavLibrary = document.getElementById("mobileNavLibrary");
const mobileNavFavorites = document.getElementById("mobileNavFavorites");

function setActiveMobileNav(activeEl) {
    document.querySelectorAll(".mobile-nav-item").forEach(item => item.classList.remove("active"));
    if (activeEl) activeEl.classList.add("active");
}

if (mobileNavHome) {
    mobileNavHome.addEventListener("click", (e) => {
        e.preventDefault();
        setActiveMobileNav(mobileNavHome);
        showingFavorites = false;
        if (favoritesSection) favoritesSection.style.display = "none";
        document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
        const navHome = document.getElementById("navHome");
        if (navHome) navHome.classList.add("active");
        resetToAllSongs();
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

if (mobileNavSearch) {
    mobileNavSearch.addEventListener("click", (e) => {
        e.preventDefault();
        setActiveMobileNav(mobileNavSearch);
        window.scrollTo({ top: 0, behavior: "smooth" });
        if (searchInput) {
            searchInput.focus();
            if (searchInput.value.trim().length > 0) {
                showSpotifyDropdown(searchInput.value.trim());
            } else {
                showSpotifyBrowseGrid();
            }
        }
    });
}

if (mobileNavLibrary) {
    mobileNavLibrary.addEventListener("click", (e) => {
        e.preventDefault();
        setActiveMobileNav(mobileNavLibrary);
        showingFavorites = false;
        if (favoritesSection) favoritesSection.style.display = "none";
        const discoverEl = document.getElementById("discover");
        if (discoverEl) discoverEl.scrollIntoView({ behavior: "smooth" });
    });
}

if (mobileNavFavorites) {
    mobileNavFavorites.addEventListener("click", (e) => {
        e.preventDefault();
        setActiveMobileNav(mobileNavFavorites);
        showingFavorites = true;
        document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
        if (favoritesNav) favoritesNav.classList.add("active");
        if (favoritesSection) {
            favoritesSection.style.display = "block";
            updateFavoritesView();
            favoritesSection.scrollIntoView({ behavior: "smooth" });
        }
    });
}

// ==================================
// 16. INITIALIZATION
// ==================================

displaySongs(songs);
updateFavBadge();
updatePlayerFavBtn();
populateRecommendedList();
updateHeroSlide(0);

console.log("Vibely Premium Music Dashboard initialized 🎵");
