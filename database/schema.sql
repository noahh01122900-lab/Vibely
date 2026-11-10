-- ========================================================
-- VIBELY DATABASE SCHEMA
-- Music streaming & discovery platform
-- ========================================================

CREATE DATABASE IF NOT EXISTS vibely_db;
USE vibely_db;

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE,
    password_hash VARCHAR(255),
    provider ENUM('email', 'google', 'facebook', 'guest') DEFAULT 'email',
    avatar VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. PLAYLISTS TABLE (Includes Featured Playlists: Midnight Vibes, Love Songs, Chill Moments)
CREATE TABLE IF NOT EXISTS playlists (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    cover_image VARCHAR(255),
    slug VARCHAR(50) UNIQUE,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. SONGS TABLE
CREATE TABLE IF NOT EXISTS songs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    playlist_id INT,
    title VARCHAR(200) NOT NULL,
    artist VARCHAR(150) NOT NULL,
    audio_url VARCHAR(255) NOT NULL,
    cover_image VARCHAR(255),
    duration_seconds INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE SET NULL
);

-- 4. USER FAVORITES TABLE
CREATE TABLE IF NOT EXISTS favorites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    song_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY user_song_unique (user_id, song_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE
);

-- ========================================================
-- SEED DATA: THE 3 FEATURED PLAYLISTS & THEIR SONGS
-- ========================================================

INSERT INTO playlists (id, title, description, cover_image, slug, is_featured) VALUES
(1, 'Midnight Vibes', 'Relax and enjoy the night with smooth late-night soundscapes', 'assets/images/feature1.png', 'midnight-vibes', TRUE),
(2, 'Love Songs', 'Feel every beat with emotional melodies and romantic rhythms', 'assets/images/feature2.png', 'love-songs', TRUE),
(3, 'Chill Moments', 'Take a little break and unwind with peaceful acoustic vibes', 'assets/images/feature3.png', 'chill-moments', TRUE)
ON DUPLICATE KEY UPDATE title = VALUES(title);

-- Songs for Midnight Vibes (Playlist 1)
INSERT INTO songs (playlist_id, title, artist, audio_url, cover_image) VALUES
(1, 'Don''t love like I love you', 'BlueAzumy03', 'assets/audio/song1.mp3', 'assets/images/feature1.png'),
(1, 'Midnight City Lights', 'Neon Skyline', 'assets/audio/song1.mp3', 'assets/images/song1.png'),
(1, 'After Midnight Thoughts', 'BlueAzumy03 ft. Lofi Moon', 'assets/audio/song1.mp3', 'assets/images/song1.jpg'),
(1, 'Moonlit Drive & Reverie', 'Midnight Groove', 'assets/audio/song1.mp3', 'assets/images/feature1.png'),
(1, 'Late Night Echoes', 'Cosmic Whispers', 'assets/audio/song1.mp3', 'assets/images/song1.png');

-- Songs for Love Songs (Playlist 2)
INSERT INTO songs (playlist_id, title, artist, audio_url, cover_image) VALUES
(2, 'Love Song', 'leberch', 'assets/audio/song2.mp3', 'assets/images/feature2.png'),
(2, 'Heartbeat Harmony', 'leberch ft. Luna', 'assets/audio/song2.mp3', 'assets/images/song2.png'),
(2, 'Forever & Always', 'Velvet Strings', 'assets/audio/song2.mp3', 'assets/images/song2.jpg'),
(2, 'Sweet Romance Acoustic', 'Sweet Serenade', 'assets/audio/song2.mp3', 'assets/images/feature2.png'),
(2, 'Holding Your Hand', 'leberch', 'assets/audio/song2.mp3', 'assets/images/song2.png');

-- Songs for Chill Moments (Playlist 3)
INSERT INTO songs (playlist_id, title, artist, audio_url, cover_image) VALUES
(3, 'Gospel Song Praise Worship', 'echoes of lumen', 'assets/audio/song3.mp3', 'assets/images/feature3.png'),
(3, 'Morning Sun Breeze', 'Calm Horizon', 'assets/audio/song3.mp3', 'assets/images/song3.png'),
(3, 'Sunday Coffee Break', 'Lofi Cafe & Garden', 'assets/audio/song3.mp3', 'assets/images/song3.jpg'),
(3, 'Soft Horizon Peace', 'echoes of lumen', 'assets/audio/song3.mp3', 'assets/images/feature3.png'),
(3, 'Serene Soul Sanctuary', 'Quiet Waters', 'assets/audio/song3.mp3', 'assets/images/song3.png');

