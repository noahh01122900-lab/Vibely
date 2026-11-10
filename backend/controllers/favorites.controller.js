// ========================================================
// VIBELY FAVORITES CONTROLLER
// getFavorites, addFavorite, removeFavorite
// All routes are protected (require JWT)
// ========================================================

import pool from '../config/db.js';

// GET /api/favorites
export async function getFavorites(req, res) {
  try {
    const userId = req.user.id;

    const [songs] = await pool.query(
      `SELECT s.*, f.created_at AS favorited_at,
              p.title AS playlist_title, p.slug AS playlist_slug
       FROM favorites f
       JOIN songs s ON f.song_id = s.id
       LEFT JOIN playlists p ON s.playlist_id = p.id
       WHERE f.user_id = ?
       ORDER BY f.created_at DESC`,
      [userId]
    );

    return res.json({ success: true, data: songs });
  } catch (err) {
    console.error('[getFavorites error]', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
}

// POST /api/favorites   body: { song_id }
export async function addFavorite(req, res) {
  try {
    const userId = req.user.id;
    const { song_id } = req.body;

    if (!song_id) {
      return res.status(400).json({ success: false, message: 'song_id is required.' });
    }

    // Verify song exists
    const [songs] = await pool.query('SELECT id FROM songs WHERE id = ?', [song_id]);
    if (songs.length === 0) {
      return res.status(404).json({ success: false, message: 'Song not found.' });
    }

    // Insert or ignore if already favorited
    await pool.query(
      'INSERT IGNORE INTO favorites (user_id, song_id) VALUES (?, ?)',
      [userId, song_id]
    );

    return res.status(201).json({ success: true, message: 'Song added to favorites.' });
  } catch (err) {
    console.error('[addFavorite error]', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
}

// DELETE /api/favorites/:songId
export async function removeFavorite(req, res) {
  try {
    const userId = req.user.id;
    const songId = req.params.songId;

    const [result] = await pool.query(
      'DELETE FROM favorites WHERE user_id = ? AND song_id = ?',
      [userId, songId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Favorite not found.' });
    }

    return res.json({ success: true, message: 'Song removed from favorites.' });
  } catch (err) {
    console.error('[removeFavorite error]', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
}

// GET /api/favorites/check/:songId — check if a song is favorited
export async function checkFavorite(req, res) {
  try {
    const userId = req.user.id;
    const songId = req.params.songId;

    const [rows] = await pool.query(
      'SELECT id FROM favorites WHERE user_id = ? AND song_id = ?',
      [userId, songId]
    );

    return res.json({ success: true, isFavorited: rows.length > 0 });
  } catch (err) {
    console.error('[checkFavorite error]', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
}
