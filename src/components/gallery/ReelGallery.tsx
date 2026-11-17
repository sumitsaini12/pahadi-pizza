'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowUpRight, Instagram } from 'lucide-react';
import Reveal from '../motion/Reveal';
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from '../../constants';
import ReelStrip from './ReelStrip';
import Theatre from './Theatre';
import type { ReelItem } from './types';
import { useMediaQuery } from './usePrefersReducedMotion';

type Props = { mode: 'live' | 'embed'; items: ReelItem[] };

export default function ReelGallery({ mode, items }: Props) {
  const [open, setOpen] = useState<number | null>(null);
  // Phones play reels right in the strip; wider screens open the theatre, which starts the reel at once.
  const inline = !useMediaQuery('(min-width: 768px)');
  const reels = items.filter((i) => i.kind === 'video').length;

  return (
    <section id="gallery" aria-labelledby="gallery-title" className="relative overflow-hidden bg-cream pb-24 pt-12 md:pb-32 md:pt-16">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <Reveal className="mb-10 flex flex-col items-start justify-between gap-6 md:mb-12 md:flex-row md:items-end">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.28em] text-tomato">
              <Instagram className="h-4 w-4" aria-hidden />
              Fresh from our Instagram
            </p>
            <h2 id="gallery-title" className="font-display text-4xl font-semibold leading-[1.05] text-ink md:text-6xl">
              The <span className="italic text-basil">Gallery</span>
            </h2>
            <p className="mt-4 max-w-lg text-muted">
              {reels} reels from our kitchen at Main Chauraha: fresh pizzas, mandua momos and happy guests. Press any reel to watch it right here.
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
              <span className="truncate text-xs text-muted">{mode === 'live' ? 'Live from Instagram' : 'Follow for new reels'}</span>
            </span>
            <span className="ml-auto inline-flex shrink-0 items-center gap-1 rounded-full bg-tomato px-4 py-2 text-sm font-semibold text-cream transition group-hover:bg-tomato-dark">
              Follow
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </span>
          </a>
        </Reveal>
      </div>

      <ReelStrip items={items} paused={open !== null} inline={inline} onOpen={setOpen} />

      <div className="mx-auto mt-10 flex max-w-7xl justify-center px-4 md:px-8">
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-6 py-3 text-sm font-semibold text-ink transition hover:border-tomato hover:text-tomato"
        >
          <Instagram className="h-4 w-4" aria-hidden />
          See all posts on Instagram
        </a>
      </div>

      <Theatre items={items} index={open} onChange={setOpen} />
    </section>
  );
}
