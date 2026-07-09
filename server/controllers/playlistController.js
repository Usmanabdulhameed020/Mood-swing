const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
const aiService = require('../services/aiService');
const storageService = require('../services/storageService');
const PlaylistModel = require('../models/Playlist');
const FavoriteModel = require('../models/Favorite');
const musicService = require('../services/musicService');
const { spawn } = require('child_process');
const path = require('path');
const ytdl = require('@distube/ytdl-core');

const isDbConnected = () => mongoose.connection.readyState === 1;

const generatePlaylist = async (req, res) => {
  try {
    const { mood } = req.body;
    if (!mood) {
      return res.status(400).json({ error: 'Mood is required' });
    }

    // Generate the playlist matching the mood (calls OpenAI or local fallback)
    const generated = await aiService.generatePlaylist(mood);

    const playlistData = {
      id: uuidv4(),
      mood: mood.toLowerCase(),
      name: generated.name,
      description: generated.description,
      coverGradient: generated.coverGradient,
      songs: generated.songs,
      tips: generated.tips,
      createdAt: new Date().toISOString()
    };

    if (isDbConnected()) {
      try {
        const dbPlaylist = new PlaylistModel(playlistData);
        await dbPlaylist.save();
      } catch (dbErr) {
        console.error('[Database] Failed to write generated playlist, falling back to storage file:', dbErr.message);
        storageService.savePlaylist(playlistData);
      }
    } else {
      storageService.savePlaylist(playlistData);
    }

    // 2.5 seconds artificial loading delay for the client to show beautiful loading steps
    setTimeout(() => {
      res.status(201).json(playlistData);
    }, 2500);

  } catch (error) {
    console.error('Error generating playlist:', error);
    res.status(500).json({ error: 'Failed to generate playlist', message: error.message });
  }
};

const getHistory = async (req, res) => {
  try {
    if (isDbConnected()) {
      try {
        const playlists = await PlaylistModel.find().sort({ createdAt: -1 });
        return res.status(200).json(playlists);
      } catch (dbErr) {
        console.error('[Database] Failed to fetch history, falling back to storage file:', dbErr.message);
      }
    }
    
    const playlists = storageService.getPlaylists();
    res.status(200).json(playlists);
  } catch (error) {
    console.error('Error fetching playlist history:', error);
    res.status(500).json({ error: 'Failed to fetch history', message: error.message });
  }
};

const getStats = async (req, res) => {
  try {
    // ----------------------------------------------------
    // Option A: MongoDB Aggregation (if connected)
    // ----------------------------------------------------
    if (isDbConnected()) {
      try {
        const totalPlaylists = await PlaylistModel.countDocuments();
        const totalFavorites = await FavoriteModel.countDocuments();

        const moodAgg = await PlaylistModel.aggregate([
          { $group: { _id: "$mood", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 1 }
        ]);
        const mostSelectedMood = moodAgg.length > 0 ? moodAgg[0]._id : "None";

        const favAgg = await FavoriteModel.aggregate([
          { $group: { _id: "$mood", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 1 }
        ]);
        let favoriteMood = favAgg.length > 0 ? favAgg[0]._id : "None";
        if (favoriteMood === 'None' && mostSelectedMood !== 'None') {
          favoriteMood = mostSelectedMood;
        }

        const genreAgg = await PlaylistModel.aggregate([
          { $unwind: "$songs" },
          { $group: { _id: "$songs.genre", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 1 }
        ]);
        const mostListenedGenre = genreAgg.length > 0 ? genreAgg[0]._id : "None";

        const avgAgg = await PlaylistModel.aggregate([
          { $project: { songCount: { $size: "$songs" } } },
          { $group: { _id: null, avgSongs: { $avg: "$songCount" } } }
        ]);
        const avgSongsGenerated = avgAgg.length > 0 ? Math.round(avgAgg[0].avgSongs * 10) / 10 : 0;

        // Weekly Activity
        const dailyActivity = {};
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          const dateString = date.toLocaleDateString('en-US', { weekday: 'short' });
          dailyActivity[dateString] = 0;
        }

        const startDate = new Date();
        startDate.setDate(today.getDate() - 7);
        const recentPlaylists = await PlaylistModel.find({ createdAt: { $gte: startDate } });
        
        recentPlaylists.forEach(pl => {
          const dateString = new Date(pl.createdAt).toLocaleDateString('en-US', { weekday: 'short' });
          if (dailyActivity[dateString] !== undefined) {
            dailyActivity[dateString]++;
          }
        });

        const weeklyActivity = Object.keys(dailyActivity).map(day => ({
          day,
          count: dailyActivity[day]
        }));

        const distAgg = await PlaylistModel.aggregate([
          { $group: { _id: "$mood", count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ]);
        const moodDistribution = distAgg.map(item => ({
          mood: item._id,
          count: item.count
        }));

        return res.status(200).json({
          totalPlaylists,
          totalFavorites,
          mostSelectedMood,
          favoriteMood,
          mostListenedGenre,
          avgSongsGenerated,
          weeklyActivity,
          moodDistribution
        });
      } catch (dbErr) {
        console.error('[Database] Failed to aggregate statistics, falling back to local JSON calculations:', dbErr.message);
      }
    }

    // ----------------------------------------------------
    // Option B: Local JSON Calculations (fallback)
    // ----------------------------------------------------
    const playlists = storageService.getPlaylists();
    const favorites = storageService.getFavorites();

    const totalPlaylists = playlists.length;
    const totalFavorites = favorites.length;

    // Mood counts
    const moodCounts = {};
    const favMoodCounts = {};
    const genreCounts = {};
    
    playlists.forEach(pl => {
      moodCounts[pl.mood] = (moodCounts[pl.mood] || 0) + 1;
      if (pl.songs) {
        pl.songs.forEach(song => {
          if (song.genre) {
            genreCounts[song.genre] = (genreCounts[song.genre] || 0) + 1;
          }
        });
      }
    });

    favorites.forEach(pl => {
      favMoodCounts[pl.mood] = (favMoodCounts[pl.mood] || 0) + 1;
    });

    // Find most selected mood
    let mostSelectedMood = 'None';
    let maxSelected = 0;
    Object.keys(moodCounts).forEach(mood => {
      if (moodCounts[mood] > maxSelected) {
        maxSelected = moodCounts[mood];
        mostSelectedMood = mood;
      }
    });

    // Find favorite mood
    let favoriteMood = 'None';
    let maxFav = 0;
    Object.keys(favMoodCounts).forEach(mood => {
      if (favMoodCounts[mood] > maxFav) {
        maxFav = favMoodCounts[mood];
        favoriteMood = mood;
      }
    });
    if (favoriteMood === 'None' && mostSelectedMood !== 'None') {
      favoriteMood = mostSelectedMood;
    }

    // Find most listened genre
    let mostListenedGenre = 'None';
    let maxGenre = 0;
    Object.keys(genreCounts).forEach(genre => {
      if (genreCounts[genre] > maxGenre) {
        maxGenre = genreCounts[genre];
        mostListenedGenre = genre;
      }
    });

    // Average songs per playlist
    let avgSongsGenerated = 0;
    if (totalPlaylists > 0) {
      const totalSongs = playlists.reduce((acc, pl) => acc + (pl.songs ? pl.songs.length : 0), 0);
      avgSongsGenerated = Math.round((totalSongs / totalPlaylists) * 10) / 10;
    }

    // Weekly activity
    const dailyActivity = {};
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = date.toLocaleDateString('en-US', { weekday: 'short' });
      dailyActivity[dateString] = 0;
    }

    playlists.forEach(pl => {
      const createdDate = new Date(pl.createdAt);
      const diffTime = Math.abs(today - createdDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays <= 7) {
        const dateString = createdDate.toLocaleDateString('en-US', { weekday: 'short' });
        if (dailyActivity[dateString] !== undefined) {
          dailyActivity[dateString]++;
        }
      }
    });

    const weeklyActivity = Object.keys(dailyActivity).map(day => ({
      day,
      count: dailyActivity[day]
    }));

    const moodDistribution = Object.keys(moodCounts).map(mood => ({
      mood,
      count: moodCounts[mood]
    })).sort((a, b) => b.count - a.count);

    res.status(200).json({
      totalPlaylists,
      totalFavorites,
      mostSelectedMood,
      favoriteMood,
      mostListenedGenre,
      avgSongsGenerated,
      weeklyActivity,
      moodDistribution
    });

  } catch (error) {
    console.error('Error generating stats:', error);
    res.status(500).json({ error: 'Failed to generate statistics', message: error.message });
  }
};

const searchSongs = async (req, res) => {
  try {
    const { q, offset = 0 } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(q)}&entity=song&limit=20&offset=${offset}`);
    if (!response.ok) throw new Error("iTunes API error");
    
    const data = await response.json();
    const tracks = data.results || [];
    
    const selectedSongs = [];
    const seenTitles = new Set();
    
    const formatDuration = (ms) => {
      if (!ms) return "3:30";
      const totalSeconds = Math.floor(ms / 1000);
      const m = Math.floor(totalSeconds / 60);
      const s = totalSeconds % 60;
      return `${m}:${s.toString().padStart(2, '0')}`;
    };

    for (const track of tracks) {
      const key = track.trackName.toLowerCase();
      if (!seenTitles.has(key)) {
        if (track.trackTimeMillis && track.trackTimeMillis > 60000) {
          selectedSongs.push({
            title: track.trackName,
            artist: track.artistName,
            album: track.collectionName || "Single",
            genre: track.primaryGenreName || "Pop",
            releaseYear: track.releaseDate ? new Date(track.releaseDate).getFullYear() : new Date().getFullYear(),
            duration: formatDuration(track.trackTimeMillis),
            albumArtwork: track.artworkUrl100 ? track.artworkUrl100.replace('100x100bb', '500x500bb') : null,
            previewUrl: track.previewUrl
          });
          seenTitles.add(key);
        }
      }
      if (selectedSongs.length === 12) break; // Return up to 12 results per batch
    }

    const enrichedSongs = selectedSongs.map(song => ({
      ...song,
      previewUrl: song.previewUrl,
      youtubeLink: null,
      spotifyLink: `https://open.spotify.com/search/${encodeURIComponent(song.title + ' ' + song.artist)}`
    }));

    res.status(200).json(enrichedSongs);
  } catch (error) {
    console.error('Error searching songs:', error);
    res.status(500).json({ error: 'Failed to search songs', message: error.message });
  }
};

const getYoutubeId = async (req, res) => {
  try {
    const { title, artist } = req.query;
    if (!title || !artist) {
      return res.status(400).json({ error: 'Title and artist are required' });
    }
    const enriched = await musicService.searchSongMetadata(title, artist);
    res.status(200).json({ youtubeId: enriched.youtubeId });
  } catch (error) {
    console.error('Error fetching youtube ID:', error);
    res.status(500).json({ error: 'Failed to fetch youtube ID', message: error.message });
  }
};

const downloadSong = (req, res) => {
  const { youtubeId } = req.params;
  if (!youtubeId) return res.status(400).json({ error: 'YouTube ID required' });

  res.header('Content-Disposition', `attachment; filename="song.mp3"`);
  res.header('Content-Type', 'audio/mpeg');

  const ytDlpPath = path.join(__dirname, '..', 'yt-dlp.exe');
  const url = `https://www.youtube.com/watch?v=${youtubeId}`;

  const ytDlp = spawn(ytDlpPath, [
    url,
    '-x', // extract audio
    '--audio-format', 'mp3',
    '--audio-quality', '0',
    '-o', '-' // output to stdout
  ]);

  ytDlp.stdout.pipe(res);

  ytDlp.stderr.on('data', (data) => {
    console.error(`yt-dlp stderr: ${data}`);
  });

  ytDlp.on('close', (code) => {
    if (code !== 0) {
      console.error(`yt-dlp process exited with code ${code}`);
      if (!res.headersSent) res.status(500).end();
    }
  });
};

module.exports = {
  generatePlaylist,
  getHistory,
  getStats,
  searchSongs,
  getYoutubeId,
  downloadSong
};
