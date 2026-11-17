'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Instagram, ArrowUpRight } from 'lucide-react';
import Reveal from '../motion/Reveal';
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from '../../constants';
import type { InstagramMedia } from '../../lib/instagram';
import { postUrl, type FeaturedPost } from '../../instagram-posts';
import LiveTile from './LiveTile';
import EmbedCard from './EmbedCard';
import Lightbox, { type LightboxItem } from './Lightbox';

type Props = { mode: 'live'; media: InstagramMedia[] } | { mode: 'embed'; posts: FeaturedPost[] };

export default function InstagramGallery(props: Props) {
  const [open, setOpen] = useState<number | null>(null);

  const items: LightboxItem[] =
    props.mode === 'live'
      ? props.media.map((m) => ({ type: 'media', media: m }))
      : props.posts.map((p) => ({ type: 'embed', url: postUrl(p), label: p.label }));

  return (
    <section id="gallery" aria-labelledby="gallery-title" className="relative bg-cream pb-24 md:pb-32">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <Reveal className="mb-10 flex flex-col items-start justify-between gap-6 md:mb-14 md:flex-row md:items-end">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.28em] text-tomato">
              <Instagram className="h-4 w-4" aria-hidden />
              Fresh from our Instagram
            </p>
            <h2 id="gallery-title" className="font-display text-4xl font-semibold leading-[1.05] text-ink md:text-6xl">
              The <span className="italic text-basil">Gallery</span>
            </h2>
            <p className="mt-4 max-w-md text-muted">
              {props.mode === 'live'
                ? 'Our latest pizzas, reels and happy guests, straight from the kitchen to your screen.'
                : 'Reels, offers and happy guests, as posted by our kitchen in Kaladhungi.'}
            </p>
          </div>

          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex w-full items-center gap-3 rounded-full border border-ink/10 bg-white/70 py-2 pl-2 pr-2 shadow-[0_18px_40px_-28px_rgba(42,28,19,0.6)] backdrop-blur transition hover:border-tomato/40 hover:bg-white md:w-auto"
          >
            <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-[conic-gradient(from_200deg,#f9ce34,#ee2a7b,#6228d7,#f9ce34)] p-[2px]">
              <span className="block h-full w-full overflow-hidden rounded-full bg-cream">
                <Image src="/app-logo.png" alt="" width={44} height={44} className="h-full w-full object-cover" />
              </span>
            </span>
            <span className="flex min-w-0 flex-col leading-tight">
              <span className="truncate text-sm font-bold text-ink">@{INSTAGRAM_HANDLE}</span>
              <span className="truncate text-xs text-muted">{props.mode === 'live' ? 'Live from Instagram' : 'Follow for new reels'}</span>
            </span>
            <span className="ml-auto inline-flex shrink-0 items-center gap-1 rounded-full bg-tomato px-4 py-2 text-sm font-semibold text-cream transition group-hover:bg-tomato-dark">
              Follow
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </span>
          </a>
        </Reveal>

        {props.mode === 'live' ? (
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
            {props.media.map((m, i) => (
              <li key={m.id} className={i === 0 ? 'col-span-2 row-span-2' : ''}>
                <Reveal delay={Math.min(i, 6) * 0.05} y={20} className="h-full">
                  <LiveTile media={m} large={i === 0} priority={i < 2} onOpen={() => setOpen(i)} />
                </Reveal>
              </li>
            ))}
          </ul>
        ) : (
          <ul className="columns-1 gap-5 md:columns-2 lg:columns-3 lg:gap-6">
            {props.posts.map((p, i) => (
              <li key={p.code} className="mb-5 break-inside-avoid lg:mb-6">
                <Reveal delay={Math.min(i, 5) * 0.06} y={20}>
                  <EmbedCard post={p} onOpen={() => setOpen(i)} />
                </Reveal>
              </li>
            ))}
          </ul>
        )}

        <Reveal className="mt-10 flex justify-center">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-6 py-3 text-sm font-semibold text-ink transition hover:border-tomato hover:text-tomato"
          >
            <Instagram className="h-4 w-4" aria-hidden />
            See all posts on Instagram
          </a>
        </Reveal>
      </div>

      <Lightbox items={items} index={open} onChange={setOpen} />
    </section>
  );
}
