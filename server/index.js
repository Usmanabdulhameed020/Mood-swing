require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const playlistRouter = require('./routes/playlist');
const favoritesRouter = require('./routes/favorites');

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/moodswing';

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log(`[Database] Successfully connected to MongoDB`);
  })
  .catch((err) => {
    console.error(`[Database] MongoDB connection error: ${err.message}`);
    console.warn(`[Database] ⚠️ MongoDB is offline/not running.`);
  });

// CORS configuration - Allow Vite frontend on any localhost port dynamically
app.use(cors({
  origin: /^http:\/\/localhost(:\d+)?$/,
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Log incoming requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Register routers prefixing with /api
app.use('/api', playlistRouter);
app.use('/api', favoritesRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    dbState: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString() 
  });
});

// Global unhandled error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// Start listening
app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(` AI Mood Playlist Suggester Server Running`);
  console.log(` Port: http://localhost:${PORT}`);
  console.log(` Database: ${MONGODB_URI}`);
  console.log(` Health Check: http://localhost:${PORT}/health`);
  console.log(`===============================================`);
});
