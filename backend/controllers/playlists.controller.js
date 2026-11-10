// ========================================================
// VIBELY PLAYLISTS CONTROLLER
// getAllPlaylists, getPlaylistById, getPlaylistWithSongs
// ========================================================

import pool from '../config/db.js';

// GET /api/playlists
export async function getAllPlaylists(req, res) {
  try {
    const [playlists] = await pool.query(
      `SELECT p.*, COUNT(s.id) AS song_count
       FROM playlists p
       LEFT JOIN songs s ON s.playlist_id = p.id
       GROUP BY p.id
       ORDER BY p.id`
    );
    return res.json({ success: true, data: playlists });
  } catch (err) {
    console.error('[getAllPlaylists error]', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
}

// GET /api/playlists/:id
export async function getPlaylistById(req, res) {
  try {
    const { id } = req.params;

    // Support numeric id OR slug
    const isNumeric = /^\d+$/.test(id);
    const field = isNumeric ? 'p.id' : 'p.slug';

    const [rows] = await pool.query(
      `SELECT p.*, COUNT(s.id) AS song_count
       FROM playlists p
       LEFT JOIN songs s ON s.playlist_id = p.id
       WHERE ${field} = ?
       GROUP BY p.id`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Playlist not found.' });
    }

    return res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('[getPlaylistById error]', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
}

// GET /api/playlists/:id/songs
export async function getPlaylistWithSongs(req, res) {
  try {
    const { id } = req.params;

    const isNumeric = /^\d+$/.test(id);
    const field = isNumeric ? 'p.id' : 'p.slug';

    // Get the playlist
    const [playlists] = await pool.query(
      `SELECT * FROM playlists p WHERE ${field} = ?`,
      [id]
    );

    if (playlists.length === 0) {
      return res.status(404).json({ success: false, message: 'Playlist not found.' });
    }

    const playlist = playlists[0];

    // Get songs for this playlist
    const [songs] = await pool.query(
      'SELECT * FROM songs WHERE playlist_id = ? ORDER BY id',
      [playlist.id]
    );

    return res.json({ success: true, data: { ...playlist, songs } });
  } catch (err) {
    console.error('[getPlaylistWithSongs error]', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
}
