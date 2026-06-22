const express = require('express');
const router = express.Router();
const favoritesController = require('../controllers/favoritesController');

// Production routes
router.get('/favorites', favoritesController.getFavorites);
router.post('/favorites', favoritesController.addFavorite);
router.delete('/favorites/:id', favoritesController.deleteFavorite);

// Legacy fallback routes for client robustness
router.post('/favorite', favoritesController.addFavorite);
router.delete('/favorite/:id', favoritesController.deleteFavorite);

module.exports = router;
