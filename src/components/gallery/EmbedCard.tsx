'use client';

import { useState } from 'react';
import { ArrowUpRight, Maximize2, Play, Images } from 'lucide-react';
import { postUrl, type FeaturedPost } from '../../instagram-posts';

/** Height of the account header Instagram draws above the media inside its embed. */
const EMBED_HEADER_PX = 54;

/**
 * A real Instagram post shown through Instagram's official embed.
 * The card is sized from the post's media ratio before the iframe loads, so the page never jumps,
 * and is cropped just below the media; caption and date live in the expanded view.
 */
export default function EmbedCard({ post, onOpen }: { post: FeaturedPost; onOpen: () => void }) {
  const [loaded, setLoaded] = useState(false);
  const url = postUrl(post);
  const isReel = post.kind === 'reel';

  return (
    <article className="group overflow-hidden rounded-[1.75rem] border border-ink/10 bg-white shadow-[0_30px_60px_-40px_rgba(42,28,19,0.55)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_40px_70px_-38px_rgba(42,28,19,0.65)] motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      <div className="[container-type:inline-size]">
        <div
          className="relative overflow-hidden bg-cream-2"
          style={{ height: `calc(${EMBED_HEADER_PX}px + ${post.mediaRatio * 100}cqw)` }}
        >
          {!loaded && (
            <div aria-hidden className="absolute inset-0 animate-pulse bg-gradient-to-br from-cream-2 via-cream to-cream-2 motion-reduce:animate-none" />
          )}
          <iframe
            src={`${url}embed/`}
            title={`${post.label} — Instagram ${isReel ? 'reel' : 'post'} by Pahadi Pizza`}
            loading="lazy"
            scrolling="no"
            allow="encrypted-media; picture-in-picture; clipboard-write"
            onLoad={() => setLoaded(true)}
            className={`absolute inset-x-0 top-0 w-full border-0 transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
            style={{ height: `calc(${EMBED_HEADER_PX}px + ${post.mediaRatio * 100}cqw + 220px)` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 px-5 py-4">
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-tomato">
            {isReel ? <Play className="h-3 w-3 fill-current" aria-hidden /> : <Images className="h-3 w-3" aria-hidden />}
            {isReel ? 'Reel' : 'Post'}
          </p>
          <p className="mt-1 truncate font-display text-lg font-semibold text-ink">{post.label}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={onOpen}
            aria-label={`Expand: ${post.label}`}
            className="grid h-10 w-10 place-items-center rounded-full border border-ink/10 text-ink transition hover:border-tomato hover:text-tomato"
          >
            <Maximize2 className="h-4 w-4" aria-hidden />
          </button>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View on Instagram: ${post.label}`}
            className="grid h-10 w-10 place-items-center rounded-full bg-ink text-cream transition hover:bg-tomato"
          >
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </a>
        </div>
      </div>
    </article>
  );
}
