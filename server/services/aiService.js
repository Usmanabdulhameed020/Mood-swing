const musicService = require('./musicService');

const moodMetadata = {
  happy: {
    names: [
      "Serotonin Boost", "Radiant Rays", "Sunshine Melodies", "Pure Euphoria", 
      "Smile Factory", "Golden Hours", "Vibrant Daydreams", "Cloud Nine Rhythm",
      "Happy Go Lucky", "Joyride Vibes"
    ],
    descriptions: [
      "A handpicked collection of upbeat tunes to boost your mood and keep you smiling all day long.",
      "Bright, sunny melodies and warm grooves designed to lift your spirits instantly.",
      "Inject some high-quality positivity into your day with these infectious feel-good rhythms.",
      "The ultimate sonic pick-me-up. Press play and let the good vibes take over."
    ],
    gradients: ["from-amber-400 to-orange-500", "from-yellow-300 to-pink-500"],
    tips: [
      "Listen while going for a morning walk to supercharge your day.",
      "Open the window and let the sunlight in while playing this playlist.",
      "Sing along as loud as you can — it releases happy chemicals in the brain!"
    ],
    complementary: ["excited", "motivated"]
  },
  sad: {
    names: [
      "Melancholy Rain", "Echoes of Solitude", "Quiet Tears", "Healing Scars",
      "Heavy Hearts", "Midnight Blue", "Soft Whispers", "The Art of Letdown",
      "Rainy Day Catharsis", "Somber Strings"
    ],
    descriptions: [
      "Gentle, melancholic songs to accompany you through reflective moments and quiet nights.",
      "A soothing safe space of introspective and emotionally resonant melodies.",
      "Beautifully sad tracks for when you need to feel your feelings and let it all out.",
      "Sometimes you just need to embrace the blues. Here is the perfect soundtrack for reflection."
    ],
    gradients: ["from-blue-600 to-indigo-900", "from-slate-700 to-blue-900"],
    tips: [
      "Grab a warm cup of tea and find a comfortable, quiet corner.",
      "Don't hold back your tears — letting them flow is a healthy release.",
      "Listen with headphones on in a darkened room to fully absorb the depth of these tracks."
    ],
    complementary: ["lonely"]
  },
  relaxed: {
    names: [
      "Zen State", "Floating on Air", "Tranquil Tide", "Drifting Slowly",
      "Quiet Mind", "Serene Spaces", "Slow Brewed Peace", "The Calm Lounge",
      "Velvet Twilight", "Soft Landing"
    ],
    descriptions: [
      "A calming blend of ambient, acoustic, and soft melodies to help you unwind and destress.",
      "Melt away the tension of the day with these smooth, tranquil, and peaceful soundscapes.",
      "Slow down the pace of life. A soothing collection of tracks to find your inner calm.",
      "Escape the noise of the world with this collection of gentle, restorative tunes."
    ],
    gradients: ["from-teal-400 to-emerald-600", "from-green-300 to-cyan-600"],
    tips: [
      "Practice deep breathing: inhale for 4 seconds, hold for 4, exhale for 6.",
      "Light a lavender candle or use an oil diffuser to set a relaxing mood.",
      "Dim the lights and let the music gently wash over you."
    ],
    complementary: ["sleepy", "focused"]
  },
  energetic: {
    names: [
      "High Voltage", "Power Surge", "Sonic Fuel", "Adrenaline Rush",
      "Apex Energy", "Beast Mode", "Electric Heartbeat", "Maximum Speed",
      "Hyperdrive", "Neon Pulse"
    ],
    descriptions: [
      "High-bpm, high-intensity tracks to supercharge your workout or get your blood pumping.",
      "Unleash your full potential with this explosive mix of high-energy beats.",
      "An electric combination of rhythms guaranteed to wake you up and get you moving.",
      "No limits, no brakes. Pure kinetic energy packed into five unstoppable tracks."
    ],
    gradients: ["from-orange-500 to-red-600", "from-yellow-400 to-red-500"],
    tips: [
      "Perfect for your cardio sessions, running, or intensive workouts.",
      "Use this to break through the afternoon slump instead of reaching for a third coffee.",
      "Stand up and do some quick stretches or jumping jacks while listening!"
    ],
    complementary: ["motivated", "excited"]
  },
  focused: {
    names: [
      "Deep Focus", "Flow State", "Brain Waves", "The Study Room",
      "Cognitive Shift", "Infinite Horizon", "Monotasking", "Linear Logic",
      "Synaptic Currents", "Mind Palace"
    ],
    descriptions: [
      "Minimalist instrumentals and post-rock masterpieces designed to keep you locked in.",
      "Enhance your concentration and enter a perfect state of flow with these focus-inducing tracks.",
      "A carefully calibrated soundscape to shield you from distractions and sharpen your mind.",
      "No lyrics, no disruptions. Just pure auditory alignment for deep work and study."
    ],
    gradients: ["from-indigo-600 to-purple-800", "from-cyan-700 to-indigo-800"],
    tips: [
      "Put your phone in another room or on 'Do Not Disturb' mode.",
      "Use the Pomodoro technique: work for 25 minutes, then take a 5-minute break.",
      "Keep a clean workspace to reduce visual clutter alongside the audio focus."
    ],
    complementary: ["relaxed"]
  },
  romantic: {
    names: [
      "Love Letters", "Heartstrings", "Midnight Romance", "Warm Embrace",
      "Sweet Nothings", "Eternal Spark", "Rose-Colored Melodies", "Velvet Love",
      "Slow Dance in the Dark", "Coupled Beats"
    ],
    descriptions: [
      "Beautiful ballads and soulful love songs to soundtrack your most intimate moments.",
      "A sweet, heartfelt collection of tracks celebrating connection, love, and romance.",
      "Soft grooves and lyrical declarations of love to melt your heart and set the mood.",
      "Whether it is a date night or a quiet evening together, here is the perfect musical backdrop."
    ],
    gradients: ["from-pink-500 to-rose-600", "from-purple-500 to-pink-600"],
    tips: [
      "Share this playlist directly with someone special in your life.",
      "Perfect for a cozy dinner date at home with dim lighting.",
      "Take a moment to dance slowly in the living room with your partner."
    ],
    complementary: ["relaxed"]
  },
  sleepy: {
    names: [
      "Slumberland Express", "Deep Sleep", "Nightfall Lullabies", "Dream State",
      "Restless No More", "Into the Dreamscape", "Moonlight Drift", "Pillow Talk",
      "Stardust Whispers", "Sleepy Hollow"
    ],
    descriptions: [
      "Ultra-slow, calming textures and gentle melodies to guide you into a peaceful slumber.",
      "Leave the day behind and drift off into a deep sleep with these quiet night soundscapes.",
      "A soft, slow-moving auditory blanket to warm your mind and ease you into sleep.",
      "Calm down your racing thoughts. The ultimate soundtrack for a restful night."
    ],
    gradients: ["from-violet-950 via-indigo-900 to-slate-950", "from-blue-950 to-purple-950"],
    tips: [
      "Set a sleep timer on your device so the music stops automatically after you fall asleep.",
      "Avoid looking at screens for at least 30 minutes before playing this playlist.",
      "Ensure your bedroom temperature is slightly cool for optimal sleep comfort."
    ],
    complementary: ["relaxed"]
  },
  motivated: {
    names: [
      "Unstoppable Force", "Grind & Glory", "Rise Up", "The Breakthrough",
      "Champion Mindset", "Drive & Determination", "Limitless", "Chasing Greatness",
      "Fire Inside", "Conquer the Day"
    ],
    descriptions: [
      "Inspiring lyrics and powerful build-ups to fuel your ambition and drive.",
      "Get inspired to crush your goals and conquer whatever challenges lie ahead.",
      "The perfect motivational boost for when you need to dig deep and push through.",
      "A powerful soundtrack for builders, dreamers, and high achievers who refuse to stop."
    ],
    gradients: ["from-red-500 via-orange-500 to-yellow-500", "from-purple-600 to-pink-500"],
    tips: [
      "Write down your top 3 goals for the day before hitting play.",
      "Listen during your morning commute to set a productive, ambitious tone.",
      "Focus on the inspiring lyrics of these songs and apply that energy to your work."
    ],
    complementary: ["energetic", "excited"]
  },
  lonely: {
    names: [
      "Midnight Conversations", "Echoes in the Dark", "Alone in a Crowd", "Ghost Towns",
      "Quiet Companions", "The Lonely Road", "Solitary Beats", "Reflections of Me",
      "Drifting Apart", "Whispers of the Wind"
    ],
    descriptions: [
      "A collection of tracks that understand. A musical companion for those quiet, solitary hours.",
      "Beautiful, melancholic melodies that remind you that you are not alone in your feelings.",
      "Soothing songs to comfort you when you feel isolated or disconnected from the world.",
      "Gently introspective music that acts as a warm, understanding presence in empty rooms."
    ],
    gradients: ["from-slate-600 to-slate-800", "from-zinc-700 to-blue-900"],
    tips: [
      "Remember that loneliness is a universal human experience that passes with time.",
      "Reach out to an old friend or family member after listening, even just a simple text.",
      "Take a walk in a public space, like a park or cafe, to feel connected to the world's flow."
    ],
    complementary: ["sad"]
  },
  excited: {
    names: [
      "Pure Hype", "Electric Party", "Unstoppable Joy", "Carnival Vibes",
      "Euphoric Dance", "Peak Excitement", "Glitter & Gold", "Neon Celebration",
      "Vibrant Rush", "Weekend Warmup"
    ],
    descriptions: [
      "High-energy anthems and dancefloor-ready bangers to match your ecstatic mood.",
      "Get ready to dance, jump, and celebrate with this supercharged, euphoric playlist.",
      "Infectious beats and ecstatic vocals to celebrate life's most exciting moments.",
      "The ultimate soundtrack for pre-parties, celebrations, or when you are just feeling amazing."
    ],
    gradients: ["from-pink-500 via-purple-500 to-cyan-500", "from-cyan-400 via-pink-500 to-yellow-400"],
    tips: [
      "Turn the volume up and share the excitement with friends around you.",
      "Perfect playlist for getting ready for a fun night out.",
      "Let loose and dance like nobody is watching!"
    ],
    complementary: ["happy", "energetic"]
  }
};

// Format duration from ms to mm:ss
function formatDuration(ms) {
  if (!ms) return "3:30";
  const totalSeconds = Math.floor(ms / 1000);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// Shuffle array helper
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Generate playlist via iTunes Search API dynamically
async function generateLocal(mood) {
  const lowerMood = mood.toLowerCase();
  const metadata = moodMetadata[lowerMood] || moodMetadata.happy;
  
  let selectedSongs = [];
  try {
    const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(lowerMood)}&entity=song&limit=50`);
    if (!response.ok) throw new Error("iTunes API error");
    
    const data = await response.json();
    const tracks = data.results || [];
    
    const shuffledPool = shuffleArray(tracks);
    const seenTitles = new Set();
    
    for (const track of shuffledPool) {
      const key = track.trackName.toLowerCase();
      if (!seenTitles.has(key)) {
        // Only select tracks over 1 minute
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
      if (selectedSongs.length === 5) break;
    }
  } catch (error) {
    console.error("iTunes fetch failed:", error);
  }

  // Pick random playlist details
  const name = metadata.names[Math.floor(Math.random() * metadata.names.length)];
  const description = metadata.descriptions[Math.floor(Math.random() * metadata.descriptions.length)];
  const shuffledTips = shuffleArray(metadata.tips);
  const tips = shuffledTips.slice(0, 2);

  return {
    name,
    description,
    songs: selectedSongs,
    tips
  };
}

const generatePlaylist = async (mood) => {
  const lowerMood = mood.toLowerCase();
  const metadata = moodMetadata[lowerMood] || moodMetadata.happy;
  
  // 1. Generate core playlist details and 5 songs using iTunes Search
  let playlistData = await generateLocal(lowerMood);

  // 2. Assign cover gradient
  const coverGradient = metadata.gradients[Math.floor(Math.random() * metadata.gradients.length)];

  // 3. Keep iTunes direct preview URLs for instant playback
  const enrichedSongs = playlistData.songs.map(song => ({
    ...song,
    previewUrl: song.previewUrl,
    youtubeLink: null,
    spotifyLink: `https://open.spotify.com/search/${encodeURIComponent(song.title + ' ' + song.artist)}`
  }));

  return {
    name: playlistData.name,
    description: playlistData.description,
    coverGradient,
    songs: enrichedSongs,
    tips: playlistData.tips
  };
};

module.exports = {
  generatePlaylist
};
