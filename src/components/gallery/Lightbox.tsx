'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { InstagramMedia } from '../../lib/instagram';
import { formatPostDate } from './format';
import { INSTAGRAM_HANDLE } from '../../constants';

export type LightboxItem = { type: 'media'; media: InstagramMedia } | { type: 'embed'; url: string; label: string };

type Props = { items: LightboxItem[]; index: number | null; onChange: (i: number | null) => void };

/** Full-screen viewer for gallery posts, with caption, date and a link back to Instagram. */
export default function Lightbox({ items, index, onChange }: Props) {
  const open = index !== null;
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  const close = useCallback(() => onChange(null), [onChange]);
  const step = useCallback(
    (d: number) => index !== null && onChange((index + d + items.length) % items.length),
    [index, items.length, onChange],
  );

  useEffect(() => {
    if (!open) return;
    returnFocus.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      returnFocus.current?.focus();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, close, step]);

  const item = index !== null ? items[index] : null;
  const href = item ? (item.type === 'media' ? item.media.permalink : item.url) : '#';

  return (
    <AnimatePresence>
      {item && index !== null && (
        <motion.div
          key="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Instagram post"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-espresso/90 px-3 pb-3 pt-16 backdrop-blur-sm md:p-8 lg:px-24"
          onClick={(e) => e.target === e.currentTarget && close()}
        >
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-3 top-3 z-10 grid h-11 w-11 place-items-center rounded-full bg-cream/10 text-cream transition hover:bg-cream/20 md:right-6 md:top-6"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>

          {items.length > 1 && (
            <>
              <NavButton side="left" onClick={() => step(-1)} />
              <NavButton side="right" onClick={() => step(1)} />
            </>
          )}

          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex max-h-full w-full max-w-5xl flex-col overflow-hidden rounded-[1.5rem] bg-cream md:flex-row md:rounded-[2rem]"
          >
            {item.type === 'media' ? (
              <MediaView media={item.media} />
            ) : (
              <div className="flex w-full justify-center bg-white">
                <iframe
                  src={`${item.url}embed/captioned/`}
                  title={`${item.label} on Instagram`}
                  allow="encrypted-media; picture-in-picture; clipboard-write"
                  className="h-[min(70vh,820px)] w-full md:h-[min(80vh,820px)] max-w-[540px] border-0"
                />
              </div>
            )}

            {item.type === 'embed' && (
              <div className="flex shrink-0 items-center justify-between gap-4 border-t border-ink/10 px-5 py-4 md:w-72 md:flex-col md:items-start md:justify-end md:gap-6 md:border-l md:border-t-0 md:p-8">
                <div>
                  <p className="hidden text-[11px] font-bold uppercase tracking-[0.2em] text-tomato md:block">@{INSTAGRAM_HANDLE}</p>
                  <p className="font-display text-lg font-semibold text-ink md:mt-2 md:text-2xl">{item.label}</p>
                  <p className="mt-3 hidden text-sm text-muted md:block">Open it on Instagram to watch with sound, like and share.</p>
                </div>
                <ViewOnInstagram href={href} />
              </div>
            )}
          </motion.div>

          <p className="sr-only" aria-live="polite">
            Post {index + 1} of {items.length}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MediaView({ media }: { media: InstagramMedia }) {
  const slides = media.mediaType === 'CAROUSEL_ALBUM' && media.children?.length ? media.children : [media];
  const [slide, setSlide] = useState(0);
  const current = slides[Math.min(slide, slides.length - 1)];

  return (
    <>
      <div className="relative aspect-[4/5] max-h-[62vh] w-full shrink-0 bg-espresso md:aspect-auto md:h-[min(80vh,760px)] md:max-h-none md:w-[58%]">
        {current.mediaType === 'VIDEO' ? (
          <video
            key={current.mediaUrl}
            src={current.mediaUrl}
            poster={current.thumbnailUrl}
            controls
            autoPlay
            playsInline
            className="absolute inset-0 h-full w-full object-contain"
          />
        ) : (
          <Image key={current.mediaUrl} src={current.mediaUrl} alt={media.caption?.slice(0, 120) || 'Pahadi Pizza on Instagram'} fill unoptimized sizes="(min-width: 768px) 60vw, 100vw" className="object-contain" />
        )}
        {slides.length > 1 && (
          <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSlide(i)}
                aria-label={`Show slide ${i + 1} of ${slides.length}`}
                aria-current={i === slide}
                className={`h-2 rounded-full transition-all ${i === slide ? 'w-6 bg-cream' : 'w-2 bg-cream/50'}`}
              />
            ))}
          </div>
        )}
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-5 md:p-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-tomato">{formatPostDate(media.timestamp)}</p>
        {media.caption && <p className="whitespace-pre-line text-sm leading-relaxed text-ink md:text-base">{media.caption}</p>}
        <div className="mt-auto pt-2">
          <ViewOnInstagram href={media.permalink} />
        </div>
      </div>
    </>
  );
}

function ViewOnInstagram({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex shrink-0 items-center gap-2 rounded-full bg-tomato px-5 py-2.5 text-sm font-semibold text-cream transition hover:bg-tomato-dark"
    >
      View on Instagram
      <ArrowUpRight className="h-4 w-4" aria-hidden />
    </a>
  );
}

function NavButton({ side, onClick }: { side: 'left' | 'right'; onClick: () => void }) {
  const Icon = side === 'left' ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === 'left' ? 'Previous post' : 'Next post'}
      className={`absolute top-3 z-10 grid h-11 w-11 place-items-center rounded-full bg-cream/10 text-cream transition hover:bg-cream/20 md:top-1/2 md:-translate-y-1/2 ${
        side === 'left' ? 'left-3 md:left-6' : 'left-16 md:left-auto md:right-6'
      }`}
    >
      <Icon className="h-5 w-5" aria-hidden />
    </button>
  );
}
