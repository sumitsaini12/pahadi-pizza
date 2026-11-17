import type { InstagramMedia } from '../../lib/instagram';

/**
 * One reel or post in the gallery, whichever source it came from.
 * `embedUrl` is set for curated posts (played through Instagram's official embed);
 * `media` is set for posts from the live API (played with our own <video> player).
 */
export type ReelItem = {
  id: string;
  kind: 'video' | 'image' | 'album';
  label: string;
  caption?: string;
  /** ISO date or date-time. */
  date: string;
  permalink: string;
  embedUrl?: string;
  /** Instagram handle of a collab reel's main author, if it is not the restaurant. */
  with?: string;
  media?: InstagramMedia;
};
