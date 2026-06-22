const express = require('express');
const router = express.Router();
const playlistController = require('../controllers/playlistController');

// Production routes
router.post('/playlists/generate', playlistController.generatePlaylist);
router.get('/history', playlistController.getHistory);
router.get('/statistics', playlistController.getStats);

// Legacy fallback routes for client robustness
router.post('/generate', playlistController.generatePlaylist);
router.get('/stats', playlistController.getStats);

module.exports = router;
