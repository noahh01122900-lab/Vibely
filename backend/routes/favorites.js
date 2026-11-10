// ========================================================
// VIBELY FAVORITES ROUTES
// GET    /api/favorites             (protected)
// POST   /api/favorites             (protected)
// DELETE /api/favorites/:songId     (protected)
// GET    /api/favorites/check/:songId (protected)
// ========================================================

import { Router } from 'express';
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  checkFavorite,
} from '../controllers/favorites.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

// All favorites routes require authentication
router.use(authenticate);

router.get('/check/:songId', checkFavorite);
router.get('/', getFavorites);
router.post('/', addFavorite);
router.delete('/:songId', removeFavorite);

export default router;
