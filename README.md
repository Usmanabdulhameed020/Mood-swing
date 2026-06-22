# Mood Swing 🎵 | AI Mood Playlist Suggester

Mood Swing is a premium, Spotify/Apple Music-inspired web application that utilizes intelligent local logic to curate personalized 5-song playlists matching your current mood. Complete with custom album artwork, listening tips, usage statistics, and local library savings, Mood Swing is built to showcase rich aesthetic design, smooth micro-animations, and clean, accessible code.

---

## 🚀 Features

*   **Intelligent Mood Suggestions**: Select from 10 distinct animated mood cards (😊 Happy, 😔 Sad, 😌 Relaxed, ⚡ Energetic, 🎯 Focused, ❤️ Romantic, 😴 Sleepy, 🔥 Motivated, 🌧️ Lonely, 🤩 Excited) to generate unique playlist names, custom descriptions, song lists, and tips.
*   **Immersive Audio Loading**: Beautiful full-screen vinyl spinning animation and floating music notes displaying real-time preparation steps.
*   **Rich Interactive Song Rows**: Highlighting title, artist, album, genre, release year, duration, and action buttons for copying detail, sharing, or liking.
*   **Persistent Custom Theme**: Beautiful dark mode enabled by default, togglable to light mode, and stored locally in `localStorage`.
*   **Saved Library & Search Filters**: Full-featured **History** and **Favorites** routes with instant search inputs and mood filters.
*   **Statistics and Trends**: Visual analytics showing total created count, most selected mood, favorite mood, and a frequency distribution bar chart.
*   **Action Actions**: Copy formatted playlist details directly, download a structured `.txt` file, or use the native Web Share API.

---

## 🛠️ Tech Stack

### Frontend
*   **Framework**: React 19
*   **Scaffolder**: Vite
*   **Styling**: Tailwind CSS v4 (using the `@tailwindcss/vite` compiler plugin)
*   **Routing**: React Router v7
*   **Animations**: Framer Motion
*   **Icons**: Lucide React

### Backend & Storage
*   **Runtime**: Node.js
*   **Server Framework**: Express.js
*   **Storage**: JSON file-based database for playlists, history and statistics
*   **Identifier Utility**: UUID

---

## 📁 Folder Structure

```
Mood Swing/
├── client/                     # Frontend client workspace
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/         # Button, Card, Badge, SearchBar, EmptyState, LoadingSpinner
│   │   │   ├── home/           # HeroSection, MoodSelector, MoodCard
│   │   │   ├── layout/         # Header, Footer, Layout, ThemeToggle, MobileNav
│   │   │   ├── loading/        # LoadingScreen, VinylSpinner, MusicNotes
│   │   │   ├── playlist/       # PlaylistCover, PlaylistHeader, SongCard, SongList, PlaylistActions, ListeningTips
│   │   │   └── stats/          # StatsOverview, MoodDistribution
│   │   ├── context/            # ThemeContext, PlaylistContext
│   │   ├── hooks/              # useTheme, usePlaylist
│   │   ├── pages/              # HomePage, PlaylistPage, FavoritesPage, HistoryPage, StatsPage
│   │   ├── utils/              # api, constants, helpers
│   │   ├── App.jsx             # Routes & lazy loaded pages
│   │   ├── index.css           # Tailwind v4 directives and animations
│   │   └── main.jsx            # DOM Renderer with BrowserRouter
│   ├── index.html              # HTML shell & Google Font imports
│   ├── package.json            # Client configuration dependencies
│   └── vite.config.js          # Vite React + Tailwind compiler configs
├── server/                     # Backend API server
│   ├── controllers/            # playlistController, favoritesController
│   ├── data/                   # songs.js (Large real song database)
│   ├── routes/                 # playlist.js, favorites.js (express routing)
│   ├── services/               # aiService, storageService
│   ├── storage/                # Created JSON data storage directory
│   ├── index.js                # Express listener & middleware entry
│   └── package.json            # Node configuration scripts
└── README.md                   # Installation & documentation guide (this file)
```

---

## ⚙️ Environment Variables

A `.env` config file can be created in the `server/` directory if you wish to run on a custom port.

**Server Environment Options (`server/.env`):**
```env
PORT=3001
```

**Client API Destination (`client/src/utils/api.js`):**
```javascript
// Configured to point directly to localhost:3001
const BASE_URL = 'http://localhost:3001/api';
```

---

## 🔧 Installation and Running

Follow these steps to run the application locally:

### 1. Start the Backend API
Navigate to the `server/` folder, install dependencies, and start the listener:
```bash
cd server
npm install
npm run dev
```
The server will boot up and print confirmation on: **`http://localhost:3001`**.

### 2. Start the Frontend Client
Navigate to the `client/` folder, install dependencies, and spin up the development compiler:
```bash
cd ../client
npm install
npm run dev
```
Open your browser and navigate to the local interface: **`http://localhost:5173`**.

---

## 📊 API Documentation

The backend service exports routes prefixed with `/api`. All JSON responses are handled with standard response headers.

### Playlists Router
*   **`POST /api/generate`**: Creates a new playlist suggestion.
    *   **Body**: `{ "mood": "happy" }`
    *   **Returns**: `{ id, mood, name, description, coverGradient, songs[], tips[], createdAt }`
*   **`GET /api/history`**: Returns the list of all generated playlists (newest first).
*   **`GET /api/stats`**: Returns statistics summarizing usage, favorites count, distribution, and daily trends.

### Favorites Router
*   **`GET /api/favorites`**: Returns all saved playlists.
*   **`POST /api/favorite`**: Adds a playlist to the library.
    *   **Body**: `{ "playlist": { ... } }`
*   **`DELETE /api/favorite/:id`**: Removes a playlist from favorites by its string ID.
