// ========================================================
// VIBELY MUSIC SERVICE
// iTunes Search API Proxy & Song Helpers
// ========================================================

/**
 * Searches the iTunes API for music tracks matching a keyword.
 * Acts as a server-side proxy so clients avoid CORS restrictions.
 */
export async function searchItunesMusic(query, limit = 20) {
  try {
    const encoded = encodeURIComponent(query.trim());
    const url = `https://itunes.apple.com/search?term=${encoded}&media=music&entity=song&limit=${limit}`;

    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`iTunes API returned status ${res.status}`);
    }

    const data = await res.json();
    return (data.results || []).map((item) => ({
      id: item.trackId,
      title: item.trackName,
      artist: item.artistName,
      album: item.collectionName,
      cover: (item.artworkUrl100 || '').replace('100x100bb', '300x300bb'),
      audio: item.previewUrl,
      duration: Math.round((item.trackTimeMillis || 0) / 1000),
    }));
  } catch (err) {
    console.error('[searchItunesMusic error]', err.message);
    return [];
  }
}
