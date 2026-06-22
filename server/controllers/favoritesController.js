const mongoose = require('mongoose');
const FavoriteModel = require('../models/Favorite');
const storageService = require('../services/storageService');

const isDbConnected = () => mongoose.connection.readyState === 1;

const getFavorites = async (req, res) => {
  try {
    if (isDbConnected()) {
      try {
        const favorites = await FavoriteModel.find().sort({ createdAt: -1 });
        return res.status(200).json(favorites);
      } catch (dbErr) {
        console.error('[Database] Failed to fetch favorites, falling back to storage file:', dbErr.message);
      }
    }
    
    const favorites = storageService.getFavorites();
    res.status(200).json(favorites);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ error: 'Failed to fetch favorites', message: error.message });
  }
};

const addFavorite = async (req, res) => {
  try {
    const { playlist } = req.body;
    if (!playlist || !playlist.id) {
      return res.status(400).json({ error: 'Valid playlist object is required' });
    }

    if (isDbConnected()) {
      try {
        let fav = await FavoriteModel.findOne({ id: playlist.id });
        if (!fav) {
          fav = new FavoriteModel({
            id: playlist.id,
            mood: playlist.mood,
            name: playlist.name,
            description: playlist.description,
            coverGradient: playlist.coverGradient,
            songs: playlist.songs,
            tips: playlist.tips,
            createdAt: new Date()
          });
          await fav.save();
        }
        return res.status(201).json(fav);
      } catch (dbErr) {
        console.error('[Database] Failed to save favorite, falling back to storage file:', dbErr.message);
      }
    }

    const saved = storageService.addFavorite(playlist);
    res.status(201).json(saved);
  } catch (error) {
    console.error('Error adding favorite:', error);
    res.status(500).json({ error: 'Failed to add playlist to favorites', message: error.message });
  }
};

const deleteFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'Playlist ID is required' });
    }

    if (isDbConnected()) {
      try {
        const result = await FavoriteModel.deleteOne({ id: id });
        if (result.deletedCount > 0) {
          return res.status(200).json({ message: 'Playlist removed from favorites successfully', id });
        }
      } catch (dbErr) {
        console.error('[Database] Failed to delete favorite, falling back to storage file:', dbErr.message);
      }
    }

    storageService.removeFavorite(id);
    res.status(200).json({ message: 'Playlist removed from favorites successfully', id });
  } catch (error) {
    console.error('Error deleting favorite:', error);
    res.status(500).json({ error: 'Failed to remove playlist from favorites', message: error.message });
  }
};

module.exports = {
  getFavorites,
  addFavorite,
  deleteFavorite
};
