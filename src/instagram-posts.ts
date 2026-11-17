/**
 * Real reels and posts from the restaurant's own Instagram (@pahadi_pizza_uk04), shown through
 * Instagram's official embed whenever no INSTAGRAM_ACCESS_TOKEN is configured.
 *
 * Newest first. `date` is the post's creation day in India time, read from its shortcode (an Instagram media id
 * carries its creation time), and matches the date Instagram shows on the post.
 *
 * `playsInline` records whether Instagram's embed plays the video on our page.
 * Instagram refuses inline playback for some reels (usually ones with licensed music) and shows only
 * "Watch on Instagram" instead. Those reels stay in this list, but the reel strip leaves them out so
 * that every play button on the site plays right there. Re-check a reel by opening
 * https://www.instagram.com/reel/<code>/embed/ and pressing play: if the video starts, set it to true.
 *
 * To add a post: open it on Instagram, copy the code from its link
 * (instagram.com/reel/<code>/ or instagram.com/p/<code>/), and add it at the top.
 * Keep `label` to what the post itself shows or says.
 */
export type FeaturedPost = {
  kind: 'reel' | 'p';
  code: string;
  label: string;
  date: string;
  playsInline: boolean;
};

export const FEATURED_POSTS: FeaturedPost[] = [
  { kind: 'reel', code: 'DfimTwrzt0O', date: '2026-11-10', playsInline: false, label: 'Pizza, momos and chowmein at Main Chauraha' },
  { kind: 'reel', code: 'DfgOV9jibEz', date: '2026-11-09', playsInline: false, label: 'Diwali buy-one-get-one offer' },
  { kind: 'reel', code: 'DfYmET6ypEU', date: '2026-11-06', playsInline: true, label: 'Welcome to Pahadi Pizza' },
  { kind: 'reel', code: 'DfXCtE7I5E2', date: '2026-11-05', playsInline: false, label: 'A guest review at Main Chauraha' },
  { kind: 'reel', code: 'DfT8aY9i7IL', date: '2026-11-04', playsInline: true, label: 'Find us at Main Chauraha' },
  { kind: 'reel', code: 'DfOLx8sB7SV', date: '2026-11-02', playsInline: true, label: 'Guests at Main Chauraha' },
  { kind: 'reel', code: 'DfMoreRirXH', date: '2026-11-01', playsInline: false, label: 'Pahadi Pizza, Kaladhungi' },
  { kind: 'reel', code: 'DfHmSh-C3PL', date: '2026-10-30', playsInline: false, label: 'Guests trying the offer' },
  { kind: 'reel', code: 'DfG7OJlB3wp', date: '2026-10-30', playsInline: true, label: 'Our youngest guest' },
  { kind: 'reel', code: 'De3ovyeOlPC', date: '2026-10-24', playsInline: false, label: 'The Pahadi Pizza wall' },
  { kind: 'reel', code: 'DeqLo1Mi8oy', date: '2026-10-19', playsInline: false, label: 'Sauce on the base' },
  { kind: 'reel', code: 'Dek_owcIFDL', date: '2026-10-17', playsInline: false, label: 'A guest review' },
  { kind: 'reel', code: 'DedT9zxiLoE', date: '2026-10-14', playsInline: true, label: 'Namaste from Pahadi Pizza' },
  { kind: 'reel', code: 'Deapyj5oEm7', date: '2026-10-13', playsInline: true, label: 'Mandua momos' },
  { kind: 'reel', code: 'DeVhlK9os7A', date: '2026-10-11', playsInline: true, label: 'A new reel from the team' },
  { kind: 'reel', code: 'DeN1AR_Jo_3', date: '2026-10-08', playsInline: true, label: 'Mandua momos at Main Chauraha' },
  { kind: 'reel', code: 'DeMR_xzi2mf', date: '2026-10-07', playsInline: true, label: 'A pizza, up close' },
  { kind: 'reel', code: 'DeJzxRDCZXH', date: '2026-10-06', playsInline: false, label: 'Mandua momos, a review from Ramnagar' },
  { kind: 'reel', code: 'DeIkwQnJLeG', date: '2026-10-06', playsInline: false, label: 'The welcome sign' },
  { kind: 'reel', code: 'DeGMN99JrlQ', date: '2026-10-05', playsInline: true, label: 'The neon welcome' },
  { kind: 'reel', code: 'DeAy7gxzg5Z', date: '2026-10-03', playsInline: false, label: 'Order now at Main Chauraha' },
  { kind: 'reel', code: 'Dd-Wn7btRGd', date: '2026-10-02', playsInline: true, label: 'Hot pizza, fresh from the oven' },
  { kind: 'reel', code: 'Dd0DP9VNLa6', date: '2026-09-28', playsInline: true, label: 'Main Chauraha at night' },
  { kind: 'reel', code: 'DdxeMQBpNqS', date: '2026-09-27', playsInline: true, label: 'A customer review' },
  { kind: 'reel', code: 'DdkndlFs2_z', date: '2026-09-22', playsInline: false, label: 'Pahadi Pizza, Kaladhungi' },
  { kind: 'reel', code: 'DdjNP9gqM-a', date: '2026-09-21', playsInline: true, label: 'Inside the restaurant' },
  { kind: 'reel', code: 'DdiL8sqJPL9', date: '2026-09-21', playsInline: true, label: 'The Pahadi Pizza wall' },
  { kind: 'reel', code: 'DdWXhPhKUee', date: '2026-09-16', playsInline: false, label: 'A guest at the table' },
  { kind: 'reel', code: 'DdVFuwHJTla', date: '2026-09-16', playsInline: true, label: 'Welcome to Pahadi Pizza' },
  { kind: 'reel', code: 'DdSl9ueJNqz', date: '2026-09-15', playsInline: false, label: 'Evening in Kaladhungi' },
  { kind: 'reel', code: 'DdP8mV-Jh-N', date: '2026-09-14', playsInline: false, label: 'A guest review' },
  { kind: 'reel', code: 'DdOrBwWC9OF', date: '2026-09-13', playsInline: false, label: 'Order now at Main Chauraha' },
  { kind: 'reel', code: 'DdME7OEC3L_', date: '2026-09-12', playsInline: true, label: 'Order now at Main Chauraha' },
  { kind: 'reel', code: 'DdFrTKop760', date: '2026-09-10', playsInline: false, label: 'Inside the restaurant' },
  { kind: 'reel', code: 'DdBs1QnKtsN', date: '2026-09-08', playsInline: true, label: 'The neon sign at night' },
  { kind: 'reel', code: 'DdAf9LNpepD', date: '2026-09-08', playsInline: false, label: 'The welcome sign' },
  { kind: 'reel', code: 'Dcul1oNphQl', date: '2026-09-01', playsInline: false, label: 'The wall art' },
  { kind: 'reel', code: 'Dcpji_NJQWi', date: '2026-08-30', playsInline: false, label: 'A fresh pizza' },
  { kind: 'reel', code: 'DcgXClti2QN', date: '2026-08-26', playsInline: false, label: 'Pizza party' },
  { kind: 'reel', code: 'DcckbqtCyG5', date: '2026-08-25', playsInline: true, label: 'The shopfront by night' },
  { kind: 'reel', code: 'DcVj4CGCk8f', date: '2026-08-22', playsInline: false, label: 'Mandua momos' },
  { kind: 'reel', code: 'DcOT7d0ii-c', date: '2026-08-19', playsInline: true, label: 'Olives, cheese and a crisp base' },
  { kind: 'reel', code: 'Db-02Ljit1d', date: '2026-08-13', playsInline: false, label: 'A guest review' },
  { kind: 'reel', code: 'DbdP8GtiAGQ', date: '2026-07-31', playsInline: true, label: 'A pizza, ready to serve' },
  { kind: 'p', code: 'DKjLT1vJZfO', date: '2025-06-06', playsInline: false, label: 'The full menu card' },
  { kind: 'p', code: 'DKdZqljT1gl', date: '2025-06-04', playsInline: false, label: 'Straight out of the oven' },
];

export const postUrl = (p: Pick<FeaturedPost, 'kind' | 'code'>) => `https://www.instagram.com/${p.kind}/${p.code}/`;

/** What the gallery shows without a token: every reel that plays on the page, then the photo posts. */
export const showcasePosts = (posts: FeaturedPost[] = FEATURED_POSTS) => [
  ...posts.filter((p) => p.kind === 'reel' && p.playsInline),
  ...posts.filter((p) => p.kind === 'p'),
];
