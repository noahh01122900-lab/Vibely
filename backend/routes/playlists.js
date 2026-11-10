// ========================================================
// VIBELY PLAYLISTS ROUTES
// GET /api/playlists
// GET /api/playlists/:id
// GET /api/playlists/:id/songs
// ========================================================

import { Router } from 'express';
import {
  getAllPlaylists,
  getPlaylistById,
  getPlaylistWithSongs,
} from '../controllers/playlists.controller.js';

const router = Router();

router.get('/', getAllPlaylists);
router.get('/:id/songs', getPlaylistWithSongs);
router.get('/:id', getPlaylistById);

export default router;
