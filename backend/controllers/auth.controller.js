// ========================================================
// VIBELY AUTH CONTROLLER
// register, login, guest, getProfile
// ========================================================

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

function generateToken(user) {
  return jwt.sign(
    { id: user.id, name: user.name, email: user.email, provider: user.provider },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

function userResponse(user, token) {
  return {
    success: true,
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email || null,
      provider: user.provider,
      avatar: user.avatar || null,
    },
  };
}

// POST /api/auth/register
export async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }

    // Check existing email
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }

    const password_hash = await bcrypt.hash(password, 12);
    const avatar = name.charAt(0).toUpperCase();

    const [result] = await pool.query(
      'INSERT INTO users (name, email, password_hash, provider, avatar) VALUES (?, ?, ?, ?, ?)',
      [name, email, password_hash, 'email', avatar]
    );

    const user = { id: result.insertId, name, email, provider: 'email', avatar };
    const token = generateToken(user);

    return res.status(201).json(userResponse(user, token));
  } catch (err) {
    console.error('[register error]', err);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
}

// POST /api/auth/login
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const [rows] = await pool.query('SELECT * FROM users WHERE email = ? AND provider = ?', [email, 'email']);
    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const user = rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = generateToken(user);
    return res.json(userResponse(user, token));
  } catch (err) {
    console.error('[login error]', err);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
}

// POST /api/auth/guest
export async function loginGuest(req, res) {
  try {
    const guestName = `Guest_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const guestEmail = `${guestName.toLowerCase()}@guest.vibely`;

    const [result] = await pool.query(
      'INSERT INTO users (name, email, provider, avatar) VALUES (?, ?, ?, ?)',
      [guestName, guestEmail, 'guest', '👤']
    );

    const user = { id: result.insertId, name: guestName, email: guestEmail, provider: 'guest', avatar: '👤' };
    const token = generateToken(user);

    return res.status(201).json(userResponse(user, token));
  } catch (err) {
    console.error('[guest login error]', err);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
}

// POST /api/auth/social — Google / Facebook (simulated, no real OAuth keys)
export async function socialLogin(req, res) {
  try {
    const { provider, name, email, avatar } = req.body;

    if (!provider || !name) {
      return res.status(400).json({ success: false, message: 'Provider and name are required.' });
    }

    if (!['google', 'facebook'].includes(provider)) {
      return res.status(400).json({ success: false, message: 'Invalid social provider.' });
    }

    let user;

    if (email) {
      // Check if user already exists with this social email
      const [rows] = await pool.query('SELECT * FROM users WHERE email = ? AND provider = ?', [email, provider]);
      if (rows.length > 0) {
        user = rows[0];
      } else {
        const avatarChar = avatar || name.charAt(0).toUpperCase();
        const [result] = await pool.query(
          'INSERT INTO users (name, email, provider, avatar) VALUES (?, ?, ?, ?)',
          [name, email, provider, avatarChar]
        );
        user = { id: result.insertId, name, email, provider, avatar: avatarChar };
      }
    } else {
      // No email — create new social user each time
      const avatarChar = avatar || name.charAt(0).toUpperCase();
      const [result] = await pool.query(
        'INSERT INTO users (name, provider, avatar) VALUES (?, ?, ?)',
        [name, provider, avatarChar]
      );
      user = { id: result.insertId, name, email: null, provider, avatar: avatarChar };
    }

    const token = generateToken(user);
    return res.json(userResponse(user, token));
  } catch (err) {
    console.error('[social login error]', err);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
}

// GET /api/auth/profile  (protected)
export async function getProfile(req, res) {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, provider, avatar, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    return res.json({ success: true, user: rows[0] });
  } catch (err) {
    console.error('[getProfile error]', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
}
