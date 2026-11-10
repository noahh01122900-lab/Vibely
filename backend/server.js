// ========================================================
// VIBELY BACKEND SERVER
// Express REST API + Static Frontend Hosting
// ========================================================

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { testConnection } from './config/db.js';
import authRoutes from './routes/auth.js';
import songsRoutes from './routes/songs.js';
import playlistsRoutes from './routes/playlists.js';
import favoritesRoutes from './routes/favorites.js';
import { searchItunesMusic } from './services/musicService.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend assets statically
const frontendDir = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendDir));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/songs', songsRoutes);
app.use('/api/playlists', playlistsRoutes);
app.use('/api/favorites', favoritesRoutes);

// iTunes Search proxy
app.get('/api/search', async (req, res) => {
  const q = req.query.q || '';
  if (!q.trim()) {
    return res.status(400).json({ success: false, message: 'Query parameter q is required' });
  }
  const results = await searchItunesMusic(q, parseInt(req.query.limit) || 20);
  return res.json({ success: true, data: results });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Fallback to welcome.html or index.html for root route
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendDir, 'welcome.html'));
});

app.get('/app', (req, res) => {
  res.sendFile(path.join(frontendDir, 'index.html'));
});

// Global 404 handler for API
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[Global Error]', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

// Start server
app.listen(PORT, async () => {
  console.log(`\n🎵 Vibely server running on http://localhost:${PORT}`);
  console.log(`📱 Frontend available at:`);
  console.log(`   - Welcome: http://localhost:${PORT}/welcome.html`);
  console.log(`   - App:     http://localhost:${PORT}/index.html\n`);
  await testConnection();
});
