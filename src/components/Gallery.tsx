import { getInstagramMedia, type InstagramMedia } from '../lib/instagram';
import { postUrl, showcasePosts } from '../instagram-posts';
import ReelGallery from './gallery/ReelGallery';
import type { ReelItem } from './gallery/types';
import { captionHeadline } from './gallery/format';

/** How many posts the live feed shows (the API is paged through until this many are in). */
const LIVE_LIMIT = 48;

/**
 * Reel strip of the restaurant's real Instagram posts.
 * With INSTAGRAM_ACCESS_TOKEN set it shows the live feed (re-fetched every 30 minutes) and plays
 * videos with the site's own player; without it, it shows the curated reels in
 * src/instagram-posts.ts and plays them through Instagram's official embed.
 */
export default async function Gallery() {
  const media = await getInstagramMedia(LIVE_LIMIT);
  if (media) return <ReelGallery mode="live" items={media.map(fromMedia)} />;

  const items: ReelItem[] = showcasePosts().map((p) => ({
    id: p.code,
    kind: p.kind === 'reel' ? 'video' : 'image',
    label: p.label,
    date: p.date,
    permalink: postUrl(p),
    embedUrl: `${postUrl(p)}embed/`,
    with: p.with,
  }));
  return <ReelGallery mode="embed" items={items} />;
}

function fromMedia(m: InstagramMedia): ReelItem {
  return {
    id: m.id,
    kind: m.mediaType === 'VIDEO' ? 'video' : m.mediaType === 'CAROUSEL_ALBUM' ? 'album' : 'image',
    label: captionHeadline(m.caption, 70) || (m.mediaType === 'VIDEO' ? 'A reel from our kitchen' : 'From our kitchen'),
    caption: m.caption,
    date: m.timestamp,
    permalink: m.permalink,
    media: m,
  };
}
