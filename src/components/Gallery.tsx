import { getInstagramMedia } from '../lib/instagram';
import { FEATURED_POSTS } from '../instagram-posts';
import InstagramGallery from './gallery/InstagramGallery';

/**
 * Gallery of the restaurant's real Instagram posts.
 * With INSTAGRAM_ACCESS_TOKEN set it shows the live feed (re-fetched every 30 minutes);
 * without it, it shows the curated posts in src/instagram-posts.ts through Instagram's own embed.
 */
/** One feature tile plus eight small ones fills the grid exactly at 2, 3 and 4 columns. */
const LIVE_TILES = 9;

export default async function Gallery() {
  // Ask for a few extra, since posts without a usable media URL are skipped.
  const media = await getInstagramMedia(LIVE_TILES + 3);
  return media ? (
    <InstagramGallery mode="live" media={media.slice(0, LIVE_TILES)} />
  ) : (
    <InstagramGallery mode="embed" posts={FEATURED_POSTS} />
  );
}
