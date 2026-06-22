/**
 * Music Service to fetch real song metadata, previews, and links.
 * Connects to Deezer's public API to query previews and cover art.
 */
async function searchSongMetadata(title, artist) {
  try {
    const query = `track:"${title}" artist:"${artist}"`;
    const url = `https://api.deezer.com/search?q=${encodeURIComponent(query)}`;
    
    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(3000) // 3 second timeout
    });

    if (!response.ok) {
      throw new Error(`Deezer API response error: ${response.status}`);
    }

    const data = await response.json();
    
    // Fallbacks
    const spotifyLink = `https://open.spotify.com/search/${encodeURIComponent(title + ' ' + artist)}`;
    const youtubeLink = `https://www.youtube.com/results?search_query=${encodeURIComponent(title + ' ' + artist)}`;

    if (data && data.data && data.data.length > 0) {
      const match = data.data[0];
      return {
        previewUrl: match.preview || null,
        albumArtwork: match.album ? match.album.cover_medium : null,
        deezerLink: match.link || null,
        spotifyLink,
        youtubeLink
      };
    }

    // Try a broader search if track/artist specific search fails
    const broadUrl = `https://api.deezer.com/search?q=${encodeURIComponent(title + ' ' + artist)}`;
    const broadResponse = await fetch(broadUrl, {
      signal: AbortSignal.timeout(3000)
    });
    if (broadResponse.ok) {
      const broadData = await broadResponse.json();
      if (broadData && broadData.data && broadData.data.length > 0) {
        const match = broadData.data[0];
        return {
          previewUrl: match.preview || null,
          albumArtwork: match.album ? match.album.cover_medium : null,
          deezerLink: match.link || null,
          spotifyLink,
          youtubeLink
        };
      }
    }

    return {
      previewUrl: null,
      albumArtwork: null,
      deezerLink: null,
      spotifyLink,
      youtubeLink
    };
  } catch (error) {
    console.error(`Error querying Deezer for "${title} - ${artist}":`, error.message);
    return {
      previewUrl: null,
      albumArtwork: null,
      deezerLink: null,
      spotifyLink: `https://open.spotify.com/search/${encodeURIComponent(title + ' ' + artist)}`,
      youtubeLink: `https://www.youtube.com/results?search_query=${encodeURIComponent(title + ' ' + artist)}`
    };
  }
}

module.exports = {
  searchSongMetadata
};
