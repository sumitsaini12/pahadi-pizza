/**
 * Real posts from the restaurant's own Instagram (@pahadi_pizza_uk04), shown with
 * Instagram's official embed whenever no INSTAGRAM_ACCESS_TOKEN is configured.
 *
 * To feature a different post: open it on Instagram, copy the code from its link
 * (instagram.com/p/<code>/ or instagram.com/reel/<code>/), and add it here.
 * `mediaRatio` is the media height divided by its width inside the embed
 * (reels are 1.25, square photos 1). It sizes the card before the embed loads, so nothing jumps.
 */
export type FeaturedPost = {
  kind: 'p' | 'reel';
  code: string;
  label: string;
  mediaRatio: number;
};

export const FEATURED_POSTS: FeaturedPost[] = [
  { kind: 'reel', code: 'DfimTwrzt0O', label: 'Pizza, momos and chowmein at Main Chauraha', mediaRatio: 1.25 },
  { kind: 'p', code: 'DKdZqljT1gl', label: 'Straight out of the oven', mediaRatio: 0.95 },
  { kind: 'reel', code: 'DfHmSh-C3PL', label: 'Guests trying the offer', mediaRatio: 1.25 },
  { kind: 'p', code: 'DKjLT1vJZfO', label: 'The full menu card', mediaRatio: 1 },
  { kind: 'reel', code: 'DfXCtE7I5E2', label: 'A guest review at Main Chauraha', mediaRatio: 1.25 },
  { kind: 'reel', code: 'DfgOV9jibEz', label: 'Diwali buy-one-get-one offer', mediaRatio: 1.25 },
];

export const postUrl = (p: Pick<FeaturedPost, 'kind' | 'code'>) => `https://www.instagram.com/${p.kind}/${p.code}/`;
