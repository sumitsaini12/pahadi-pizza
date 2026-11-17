import 'server-only';

/**
 * Server-side reader for the restaurant's own Instagram feed, using the official
 * Instagram API with Instagram Login (graph.instagram.com).
 *
 * The access token is read from INSTAGRAM_ACCESS_TOKEN and never leaves the server:
 * only the public media fields below are handed to the client.
 * Results are cached by Next for REVALIDATE_SECONDS, so new uploads appear on their own.
 */

export type InstagramMediaType = 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';

export type InstagramChild = {
  id: string;
  mediaType: InstagramMediaType;
  mediaUrl: string;
  thumbnailUrl?: string;
};

export type InstagramMedia = {
  id: string;
  mediaType: InstagramMediaType;
  /** Image URL, or the video file URL for reels. */
  mediaUrl: string;
  /** Poster frame for videos. */
  thumbnailUrl?: string;
  caption?: string;
  permalink: string;
  timestamp: string;
  children?: InstagramChild[];
};

export const REVALIDATE_SECONDS = 1800;
const API_VERSION = 'v23.0';
const FIELDS =
  'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,children{id,media_type,media_url,thumbnail_url}';

type RawMedia = {
  id: string;
  media_type: InstagramMediaType;
  media_url?: string;
  thumbnail_url?: string;
  caption?: string;
  permalink: string;
  timestamp: string;
  children?: { data: { id: string; media_type: InstagramMediaType; media_url?: string; thumbnail_url?: string }[] };
};

/** Pages of up to 50 posts each that one request may follow. */
const MAX_PAGES = 4;

/**
 * Returns up to `limit` of the latest posts, newest first, following the API's paging cursor,
 * or null when no token is configured or the API call fails.
 * A null result makes the gallery fall back to the curated embeds in src/instagram-posts.ts.
 */
export async function getInstagramMedia(limit = 48): Promise<InstagramMedia[] | null> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN?.trim();
  if (!token) return null;

  const userId = process.env.INSTAGRAM_USER_ID?.trim() || 'me';
  const first = new URL(`https://graph.instagram.com/${API_VERSION}/${encodeURIComponent(userId)}/media`);
  first.searchParams.set('fields', FIELDS);
  first.searchParams.set('limit', String(Math.min(limit, 50)));
  first.searchParams.set('access_token', token);

  const items: InstagramMedia[] = [];
  let next: string | undefined = first.toString();
  try {
    for (let page = 0; next && page < MAX_PAGES && items.length < limit; page++) {
      const res = await fetch(next, { next: { revalidate: REVALIDATE_SECONDS, tags: ['instagram'] } });
      if (!res.ok) {
        // Log the status only: request URLs, including the paging cursors, carry the token.
        console.warn(`[instagram] media request failed with HTTP ${res.status}; showing ${items.length ? 'what loaded so far' : 'fallback posts'}.`);
        break;
      }
      const json = (await res.json()) as { data?: RawMedia[]; paging?: { next?: string } };
      items.push(...(json.data ?? []).map(normalise).filter((m): m is InstagramMedia => m !== null));
      next = json.paging?.next;
    }
  } catch {
    console.warn('[instagram] media request threw; showing fallback posts.');
  }
  return items.length > 0 ? items.slice(0, limit) : null;
}

function normalise(raw: RawMedia): InstagramMedia | null {
  const children = raw.children?.data
    .filter((c) => c.media_url)
    .map((c) => ({ id: c.id, mediaType: c.media_type, mediaUrl: c.media_url!, thumbnailUrl: c.thumbnail_url }));

  // Carousels have no media_url of their own on some accounts; use the first slide.
  const mediaUrl = raw.media_url ?? children?.[0]?.mediaUrl;
  if (!mediaUrl || !raw.permalink) return null; // e.g. copyright-muted reels come back without a URL

  return {
    id: raw.id,
    mediaType: raw.media_type,
    mediaUrl,
    thumbnailUrl: raw.thumbnail_url ?? children?.[0]?.thumbnailUrl,
    caption: raw.caption,
    permalink: raw.permalink,
    timestamp: raw.timestamp,
    children,
  };
}
