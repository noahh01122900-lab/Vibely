// ========================================================
// VIBELY AUTH ROUTES
// POST /api/auth/register
// POST /api/auth/login
// POST /api/auth/guest
// POST /api/auth/social
// GET  /api/auth/profile  (protected)
// ========================================================

import { Router } from 'express';
import { register, login, loginGuest, socialLogin, getProfile } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/guest', loginGuest);
router.post('/social', socialLogin);
router.get('/profile', authenticate, getProfile);

export default router;
