const mongoose = require('mongoose');

const SongSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  album: { type: String },
  genre: { type: String },
  releaseYear: { type: Number },
  duration: { type: String },
  previewUrl: { type: String },
  albumArtwork: { type: String },
  deezerLink: { type: String },
  spotifyLink: { type: String },
  youtubeLink: { type: String }
});

const PlaylistSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // uuid string from client or generated
  mood: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String },
  coverGradient: { type: String },
  songs: [SongSchema],
  tips: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Playlist', PlaylistSchema);
