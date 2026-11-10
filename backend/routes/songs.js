// ========================================================
// VIBELY SONGS ROUTES
// GET /api/songs
// GET /api/songs/search?q=keyword
// GET /api/songs/playlist/:playlistId
// GET /api/songs/:id
// ========================================================

import { Router } from 'express';
import {
  getAllSongs,
  getSongById,
  getSongsByPlaylist,
  searchSongs,
} from '../controllers/songs.controller.js';

const router = Router();

// Note: specific routes BEFORE parameterized routes to avoid conflicts
router.get('/search', searchSongs);
router.get('/playlist/:playlistId', getSongsByPlaylist);
router.get('/', getAllSongs);
router.get('/:id', getSongById);

export default router;
