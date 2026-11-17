'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Play, Images } from 'lucide-react';
import type { InstagramMedia } from '../../lib/instagram';
import { captionHeadline, formatPostDate } from './format';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

type Props = { media: InstagramMedia; large?: boolean; priority?: boolean; onOpen: () => void };

/** One post from the live API feed. Reels play muted while in view, unless the visitor prefers reduced motion. */
export default function LiveTile({ media, large, priority, onOpen }: Props) {
  const isVideo = media.mediaType === 'VIDEO';
  const poster = isVideo ? media.thumbnailUrl : media.mediaUrl;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);
  const [hover, setHover] = useState(false);
  const reduced = usePrefersReducedMotion();
  const headline = captionHeadline(media.caption, 80);

  useEffect(() => {
    const el = videoRef.current;
    if (!isVideo || !el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.intersectionRatio >= 0.6), { threshold: [0, 0.6] });
    io.observe(el);
    return () => io.disconnect();
  }, [isVideo]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const shouldPlay = !reduced && (inView || hover);
    if (shouldPlay) el.play().catch(() => {});
    else el.pause();
  }, [inView, hover, reduced]);

  return (
    <button
      type="button"
      onClick={onOpen}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-label={`Open ${isVideo ? 'reel' : 'post'} from ${formatPostDate(media.timestamp)}${headline ? `: ${headline}` : ''}`}
      className={`group relative block w-full overflow-hidden rounded-[1.5rem] bg-cream-2 text-left md:rounded-[2rem] ${
        large ? 'aspect-[4/5] md:aspect-auto md:h-full' : 'aspect-[4/5]'
      }`}
    >
      {poster && (
        <Image
          src={poster}
          alt={headline || 'Pahadi Pizza on Instagram'}
          fill
          unoptimized
          priority={priority}
          sizes={large ? '(min-width: 768px) 50vw, 100vw' : '(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw'}
          className="object-cover transition duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      )}
      {isVideo && (
        <video
          ref={videoRef}
          src={media.mediaUrl}
          poster={poster}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden
          tabIndex={-1}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-espresso/0 to-espresso/10 opacity-70 transition group-hover:opacity-100" />

      {media.mediaType !== 'IMAGE' && (
        <span aria-hidden className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-espresso/55 text-cream backdrop-blur">
          {isVideo ? <Play className="h-4 w-4 fill-current" /> : <Images className="h-4 w-4" />}
        </span>
      )}

      <span className="absolute inset-x-0 bottom-0 p-4 text-cream md:p-5">
        <span className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-light">{formatPostDate(media.timestamp)}</span>
        {headline && (
          <span className={`mt-1 line-clamp-2 font-medium leading-snug ${large ? 'text-base md:text-xl' : 'hidden text-sm md:block'}`}>{headline}</span>
        )}
      </span>
    </button>
  );
}
