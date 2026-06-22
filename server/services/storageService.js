const fs = require('fs');
const path = require('path');

const STORAGE_DIR = path.join(__dirname, '..', 'storage');
const PLAYLISTS_FILE = path.join(STORAGE_DIR, 'playlists.json');
const FAVORITES_FILE = path.join(STORAGE_DIR, 'favorites.json');

// Ensure storage directory and JSON files exist
const initStorage = () => {
  if (!fs.existsSync(STORAGE_DIR)) {
    fs.mkdirSync(STORAGE_DIR, { recursive: true });
  }
  
  if (!fs.existsSync(PLAYLISTS_FILE)) {
    fs.writeFileSync(PLAYLISTS_FILE, JSON.stringify([]));
  }
  
  if (!fs.existsSync(FAVORITES_FILE)) {
    fs.writeFileSync(FAVORITES_FILE, JSON.stringify([]));
  }
};

const readData = (filePath) => {
  try {
    initStorage();
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading file from disk: ${filePath}`, error);
    return [];
  }
};

const writeData = (filePath, data) => {
  try {
    initStorage();
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing file to disk: ${filePath}`, error);
    return false;
  }
};

module.exports = {
  getPlaylists: () => readData(PLAYLISTS_FILE),
  savePlaylist: (playlist) => {
    const playlists = readData(PLAYLISTS_FILE);
    playlists.unshift(playlist); // Add to the beginning of list
    writeData(PLAYLISTS_FILE, playlists);
    return playlist;
  },
  getFavorites: () => readData(FAVORITES_FILE),
  addFavorite: (playlist) => {
    const favorites = readData(FAVORITES_FILE);
    if (!favorites.some(fav => fav.id === playlist.id)) {
      favorites.unshift(playlist);
      writeData(FAVORITES_FILE, favorites);
    }
    return playlist;
  },
  removeFavorite: (id) => {
    const favorites = readData(FAVORITES_FILE);
    const updatedFavorites = favorites.filter(fav => fav.id !== id);
    writeData(FAVORITES_FILE, updatedFavorites);
    return true;
  }
};
