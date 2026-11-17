'use client';

import Image from 'next/image';
import { Images, Instagram, Play } from 'lucide-react';
import EmbedFrame from './EmbedFrame';
import { formatPostDate } from './format';
import type { ReelItem } from './types';

type Props = {
  item: ReelItem;
  index: number;
  total: number;
  /** True once the card is near the visible part of the strip; only then does its poster load. */
  near: boolean;
  onOpen: () => void;
};

/**
 * One reel in the strip: a branded 9:16 poster (4:5 for a curated photo post) with a play button, date and title.
 * Poster: the live API's own thumbnail, or, for curated posts, Instagram's official embed cropped
 * to its media frame and loaded only when the card comes near view. Until then, and behind it,
 * a branded placeholder keeps the card's size, so nothing shifts.
 */
export default function ReelCard({ item, index, total, near, onOpen }: Props) {
  const isVideo = item.kind === 'video';
  // For videos, and albums that open on a video, mediaUrl is an mp4, so the thumbnail is the poster.
  const poster = item.media ? (item.media.mediaType === 'IMAGE' ? item.media.mediaUrl : (item.media.thumbnailUrl ?? item.media.mediaUrl)) : undefined;
  const date = formatPostDate(item.date);

  return (
    <article className="group/card relative w-full">
      <div className={`relative overflow-hidden rounded-[1.6rem] ${item.embedUrl && !isVideo ? 'aspect-[4/5]' : 'aspect-[9/16]'} bg-espresso shadow-[0_30px_60px_-36px_rgba(22,14,10,0.75)] ring-1 ring-ink/10 transition duration-500 ease-out group-hover/card:-translate-y-1.5 group-hover/card:shadow-[0_44px_70px_-34px_rgba(22,14,10,0.8)] motion-reduce:transition-none motion-reduce:group-hover/card:translate-y-0`}>
        <Placeholder />

        {near &&
          (poster ? (
            <Image
              src={poster}
              alt=""
              fill
              unoptimized
              sizes="(min-width: 1024px) 300px, 72vw"
              className="object-cover transition duration-700 ease-out group-hover/card:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover/card:scale-100"
            />
          ) : item.embedUrl ? (
            <EmbedFrame src={item.embedUrl} title={`${item.label}, Instagram ${isVideo ? 'reel' : 'post'} by Pahadi Pizza`} shape={isVideo ? 'reel' : 'post'} inert />
          ) : null)}

        <span aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-espresso/95 via-espresso/10 to-espresso/35" />

        {/* The whole card opens the theatre; it sits above the poster, so the embed never takes the click. */}
        <button
          type="button"
          data-reel
          onClick={onOpen}
          aria-label={`${isVideo ? 'Play reel' : 'View post'}: ${item.label}, ${date} (${index + 1} of ${total})`}
          className="absolute inset-0 z-10 flex items-center justify-center rounded-[1.6rem] outline-none focus-visible:ring-4 focus-visible:ring-gold/80 focus-visible:ring-inset"
        >
          <span
            aria-hidden
            className={`relative grid place-items-center rounded-full shadow-[0_18px_40px_-12px_rgba(200,54,31,0.75)] transition duration-300 ease-out group-hover/card:scale-110 motion-reduce:transition-none motion-reduce:group-hover/card:scale-100 ${
              isVideo ? 'h-[4.5rem] w-[4.5rem] bg-tomato text-cream' : 'h-14 w-14 bg-cream/90 text-ink backdrop-blur'
            }`}
          >
            {isVideo && <span className="absolute inset-0 rounded-full ring-2 ring-tomato/60 transition duration-500 group-hover/card:scale-125 group-hover/card:opacity-0 motion-reduce:hidden" />}
            {isVideo ? <Play className="ml-1 h-7 w-7 fill-current" /> : <Images className="h-6 w-6" />}
          </span>
        </button>

        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between p-3.5">
          <span className="rounded-full bg-espresso/60 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-cream backdrop-blur-md">
            {isVideo ? 'Reel' : item.kind === 'album' ? 'Album' : 'Post'}
          </span>
          <a
            href={item.permalink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open on Instagram: ${item.label}`}
            className="pointer-events-auto grid h-9 w-9 place-items-center rounded-full bg-espresso/60 text-cream backdrop-blur-md transition hover:bg-tomato focus-visible:outline-2 focus-visible:outline-gold"
          >
            <Instagram className="h-4 w-4" aria-hidden />
          </a>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 p-4 md:p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-light">{date}</p>
          <p className="mt-1 line-clamp-2 font-display text-lg font-semibold leading-snug text-cream md:text-xl">{item.label}</p>
        </div>
      </div>
    </article>
  );
}

/** Branded frame shown before (and under) the poster. */
function Placeholder() {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden bg-[radial-gradient(120%_80%_at_50%_0%,#3a2618_0%,#160e0a_70%)]">
      <Image src="/app-logo.png" alt="" width={160} height={160} className="absolute left-1/2 top-[38%] h-28 w-28 -translate-x-1/2 -translate-y-1/2 opacity-[0.12] grayscale" />
    </div>
  );
}
