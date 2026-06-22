/**
 * Formats a playlist into a copyable text string
 */
export const formatPlaylistForCopy = (playlist) => {
  const songsText = playlist.songs
    .map((song, i) => `${i + 1}. ${song.title} - ${song.artist} (Album: ${song.album}, Year: ${song.releaseYear}, Duration: ${song.duration})`)
    .join('\n');
  
  return `🎵 Mood Swing: ${playlist.name} 🎵
Mood: ${playlist.mood.toUpperCase()}
Description: ${playlist.description}

Songs:
${songsText}

Listening Tips:
${playlist.tips.map(tip => `- ${tip}`).join('\n')}

Created with Mood Swing AI Playlist Suggester.`;
};

/**
 * Downloads a playlist as a .txt file
 */
export const downloadPlaylistFile = (playlist) => {
  const text = formatPlaylistForCopy(playlist);
  const element = document.createElement('a');
  const file = new Blob([text], { type: 'text/plain;charset=utf-8' });
  element.href = URL.createObjectURL(file);
  element.download = `${playlist.name.replace(/\s+/g, '_')}_playlist.txt`;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

/**
 * Shares a playlist using the Web Share API (falls back to copying to clipboard)
 */
export const sharePlaylist = async (playlist) => {
  const text = formatPlaylistForCopy(playlist);
  
  if (navigator.share) {
    try {
      await navigator.share({
        title: `Mood Swing - ${playlist.name}`,
        text: `Check out my AI-generated playlist: ${playlist.name} (${playlist.mood})`,
        url: window.location.origin
      });
      return { success: true, method: 'share' };
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error sharing:', error);
      }
    }
  }
  
  // Fallback to copy to clipboard
  try {
    await navigator.clipboard.writeText(text);
    return { success: true, method: 'copy' };
  } catch (error) {
    console.error('Failed to copy text: ', error);
    return { success: false };
  }
};
