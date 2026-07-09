import { openDB } from 'idb';

const DB_NAME = 'moodswing-offline-db';
const STORE_NAME = 'downloads';

async function getDb() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    },
  });
}

export async function saveSongOffline(song, blob) {
  const db = await getDb();
  await db.put(STORE_NAME, {
    id: song.youtubeId || song.title + song.artist, // unique ID
    title: song.title,
    artist: song.artist,
    albumArtwork: song.albumArtwork,
    blob: blob,
    downloadedAt: Date.now()
  });
}

export async function getOfflineSongs() {
  const db = await getDb();
  return db.getAll(STORE_NAME);
}

export async function getOfflineSong(id) {
  const db = await getDb();
  return db.get(STORE_NAME, id);
}

export async function deleteOfflineSong(id) {
  const db = await getDb();
  return db.delete(STORE_NAME, id);
}
