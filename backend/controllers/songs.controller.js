// ========================================================
// VIBELY SONGS CONTROLLER
// getAllSongs, getSongById, getSongsByPlaylist
// ========================================================

import pool from '../config/db.js';

// GET /api/songs
export async function getAllSongs(req, res) {
  try {
    const [songs] = await pool.query(
      `SELECT s.*, p.title AS playlist_title, p.slug AS playlist_slug
       FROM songs s
       LEFT JOIN playlists p ON s.playlist_id = p.id
       ORDER BY s.playlist_id, s.id`
    );
    return res.json({ success: true, data: songs });
  } catch (err) {
    console.error('[getAllSongs error]', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
}

// GET /api/songs/:id
export async function getSongById(req, res) {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      `SELECT s.*, p.title AS playlist_title, p.slug AS playlist_slug
       FROM songs s
       LEFT JOIN playlists p ON s.playlist_id = p.id
       WHERE s.id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Song not found.' });
    }

    return res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('[getSongById error]', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
}

// GET /api/songs/playlist/:playlistId
export async function getSongsByPlaylist(req, res) {
  try {
    const { playlistId } = req.params;
    const [songs] = await pool.query(
      `SELECT s.*, p.title AS playlist_title, p.slug AS playlist_slug
       FROM songs s
       LEFT JOIN playlists p ON s.playlist_id = p.id
       WHERE s.playlist_id = ?
       ORDER BY s.id`,
      [playlistId]
    );
    return res.json({ success: true, data: songs });
  } catch (err) {
    console.error('[getSongsByPlaylist error]', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
}

// GET /api/songs/search?q=keyword
export async function searchSongs(req, res) {
  try {
    const { q } = req.query;
    if (!q || q.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Search query is required.' });
    }

    const keyword = `%${q.trim()}%`;
    const [songs] = await pool.query(
      `SELECT s.*, p.title AS playlist_title, p.slug AS playlist_slug
       FROM songs s
       LEFT JOIN playlists p ON s.playlist_id = p.id
       WHERE s.title LIKE ? OR s.artist LIKE ?
       ORDER BY s.title`,
      [keyword, keyword]
    );
    return res.json({ success: true, data: songs });
  } catch (err) {
    console.error('[searchSongs error]', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
}
