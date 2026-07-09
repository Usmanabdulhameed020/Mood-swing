const ytSearch = require('yt-search');

/**
 * Music Service to fetch full song YouTube video IDs.
 */
async function searchSongMetadata(title, artist, songDetails = {}) {
  try {
    const query = `${title} ${artist} audio`;
    
    const r = await ytSearch(query);
    const videos = r.videos;

    if (videos.length > 0) {
      const match = videos[0];
      return {
        youtubeId: match.videoId,
        youtubeLink: match.url,
        // Optional fallback links
        spotifyLink: `https://open.spotify.com/search/${encodeURIComponent(title + ' ' + artist)}`
      };
    }

    return {
      youtubeId: null,
      youtubeLink: null,
      spotifyLink: `https://open.spotify.com/search/${encodeURIComponent(title + ' ' + artist)}`
    };
  } catch (error) {
    console.error(`Error querying YouTube for "${title} - ${artist}":`, error.message);
    return {
      youtubeId: null,
      youtubeLink: null,
      spotifyLink: `https://open.spotify.com/search/${encodeURIComponent(title + ' ' + artist)}`
    };
  }
}

module.exports = {
  searchSongMetadata
};
