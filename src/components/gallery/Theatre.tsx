'use client';

import { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, ChevronLeft, ChevronRight, Hand, Play, X } from 'lucide-react';
import EmbedFrame from './EmbedFrame';
import { formatPostDate } from './format';
import type { ReelItem } from './types';
import { INSTAGRAM_HANDLE } from '../../constants';

type Props = { items: ReelItem[]; index: number | null; onChange: (i: number | null) => void };

const UP_NEXT = 3;

/**
 * Full-screen theatre that plays a reel on the page.
 * Live API posts play in our own <video> player, started by the click that opened the theatre.
 * Curated posts play inside Instagram's official embed, cropped to the video frame: Instagram does not
 * let a page start its player, so the visitor presses play on the video itself.
 * Keyboard: Escape closes, left and right arrows step, Tab stays inside. Touch: swipe left or right.
 */
export default function Theatre({ items, index, onChange }: Props) {
  const open = index !== null;
  const dialog = useRef<HTMLDivElement>(null);
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
      returnFocus.current?.focus({ preventScroll: true });
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'ArrowLeft') step(-1);
      else if (e.key === 'Tab') trapTab(e, dialog.current);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, close, step]);

  // Swipe on touch screens (outside the embed, which keeps its own touches).
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const onPointerDown = (e: PointerEvent) => {
    if (e.pointerType === 'touch') swipe.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e: PointerEvent) => {
    const s = swipe.current;
    swipe.current = null;
    if (!s) return;
    const dx = e.clientX - s.x;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(e.clientY - s.y) * 1.4) step(dx < 0 ? 1 : -1);
  };

  const item = index !== null ? items[index] : null;

  return (
    <AnimatePresence>
      {item && index !== null && (
        <motion.div
          ref={dialog}
          key="theatre"
          role="dialog"
          aria-modal="true"
          aria-label={`${item.label}, reel ${index + 1} of ${items.length}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          className="fixed inset-0 z-[90] flex flex-col bg-espresso/95 text-cream backdrop-blur-md"
        >
          {/* Top bar */}
          <div className="flex shrink-0 items-center justify-between gap-4 px-4 py-3 md:px-8 md:py-5">
            <div className="flex min-w-0 items-center gap-3">
              <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-[conic-gradient(from_200deg,#f9ce34,#ee2a7b,#6228d7,#f9ce34)] p-[2px]">
                <span className="block h-full w-full overflow-hidden rounded-full bg-cream">
                  <Image src="/app-logo.png" alt="" width={36} height={36} className="h-full w-full object-cover" />
                </span>
              </span>
              <div className="min-w-0 leading-tight">
                <p className="truncate text-sm font-bold">Pahadi Pizza</p>
                <p className="truncate text-xs text-cream/60">@{INSTAGRAM_HANDLE}</p>
              </div>
            </div>
            <p className="font-display text-lg tabular-nums text-cream/80" aria-hidden>
              {String(index + 1).padStart(2, '0')}
              <span className="mx-1 text-cream/30">/</span>
              {String(items.length).padStart(2, '0')}
            </p>
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label="Close"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-cream/10 transition hover:bg-tomato"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
          </div>

          {/* Stage and details */}
          <div
            className="relative flex min-h-0 flex-1 flex-col items-center justify-start gap-5 overflow-y-auto px-4 pb-6 md:flex-row md:justify-center md:gap-10 md:overflow-visible md:px-24 md:pb-10"
            onClick={(e) => e.target === e.currentTarget && close()}
          >
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="w-full shrink-0 md:w-auto"
            >
              <Stage item={item} />
            </motion.div>

            <aside className="w-full max-w-md shrink-0 md:w-80">
              {items.length > 1 && (
                <div className="mb-4 flex items-center justify-between md:hidden">
                  <button type="button" onClick={() => step(-1)} aria-label="Previous reel" className="grid h-11 w-11 place-items-center rounded-full bg-cream/10">
                    <ChevronLeft className="h-5 w-5" aria-hidden />
                  </button>
                  <span className="text-xs text-cream/50">Swipe for more</span>
                  <button type="button" onClick={() => step(1)} aria-label="Next reel" className="grid h-11 w-11 place-items-center rounded-full bg-cream/10">
                    <ChevronRight className="h-5 w-5" aria-hidden />
                  </button>
                </div>
              )}
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-gold-light">{formatPostDate(item.date)}</p>
              <h3 className="mt-2 font-display text-2xl font-semibold leading-tight md:text-3xl">{item.label}</h3>
              {item.with && <p className="mt-2 text-sm text-cream/60">A collab reel with @{item.with}</p>}
              {item.caption && <Caption text={item.caption} />}
              {item.embedUrl && item.kind === 'video' && (
                <p className="mt-4 flex items-center gap-2 text-sm text-cream/70">
                  <Hand className="h-4 w-4 shrink-0 text-gold-light" aria-hidden />
                  Press play on the video to watch it here.
                </p>
              )}
              <a
                href={item.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-cream/20 px-5 py-2.5 text-sm font-semibold transition hover:border-tomato hover:bg-tomato"
              >
                Like or share on Instagram
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </a>

              {items.length > 1 && (
                <div className="mt-8 hidden md:block">
                  <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.24em] text-cream/50">Up next</p>
                  <ul className="space-y-1">
                    {Array.from({ length: Math.min(UP_NEXT, items.length - 1) }, (_, k) => (index + 1 + k) % items.length).map((j) => (
                      <li key={items[j].id}>
                        <button
                          type="button"
                          onClick={() => onChange(j)}
                          className="group flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition hover:bg-cream/10"
                        >
                          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-cream/10 text-cream transition group-hover:bg-tomato">
                            <Play className="ml-0.5 h-3.5 w-3.5 fill-current" aria-hidden />
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-semibold">{items[j].label}</span>
                            <span className="block text-xs text-cream/50">{formatPostDate(items[j].date)}</span>
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </aside>

            {items.length > 1 && (
              <>
                <NavButton side="left" onClick={() => step(-1)} />
                <NavButton side="right" onClick={() => step(1)} />
              </>
            )}
          </div>

          <p className="sr-only" aria-live="polite">
            {item.label}, {index + 1} of {items.length}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Video frame, sized to fit the screen height. */
function Stage({ item }: { item: ReelItem }) {
  const media = item.media;
  if (media) return <MediaStage key={item.id} item={item} />;

  const reel = item.kind === 'video';
  return (
    <div
      className={`relative mx-auto overflow-hidden rounded-[1.5rem] bg-black shadow-[0_40px_90px_-40px_rgba(0,0,0,0.9)] ${
        reel
          ? 'aspect-[9/16] w-[min(100%,calc(62vh*9/16))] md:w-[min(calc(78vh*9/16),460px)]'
          : 'aspect-[4/5] w-[min(100%,calc(62vh*4/5))] md:w-[min(calc(78vh*4/5),600px)]'
      }`}
    >
      <div aria-hidden className="absolute inset-0 animate-pulse bg-gradient-to-br from-bark via-espresso to-bark motion-reduce:animate-none" />
      {/* A photo needs no player, so its embed takes no clicks (Instagram would open the post in a new tab). */}
      {item.embedUrl && (
        <EmbedFrame
          key={item.embedUrl}
          src={item.embedUrl}
          title={`${item.label}, Instagram ${reel ? 'reel' : 'post'} by Pahadi Pizza`}
          shape={reel ? 'reel' : 'post'}
          inert={!reel}
        />
      )}
    </div>
  );
}

/** A live API post: our own player for videos, the image for photos, with dots for album slides. */
function MediaStage({ item }: { item: ReelItem }) {
  const media = item.media!;
  const slides = media.mediaType === 'CAROUSEL_ALBUM' && media.children?.length ? media.children : [media];
  const [slide, setSlide] = useState(0);
  const current = slides[Math.min(slide, slides.length - 1)];
  const isVideo = current.mediaType === 'VIDEO';

  return (
    <div
      className={`relative mx-auto overflow-hidden rounded-[1.5rem] bg-black shadow-[0_40px_90px_-40px_rgba(0,0,0,0.9)] ${
        isVideo ? 'aspect-[9/16] w-[min(100%,calc(62vh*9/16))] md:w-[min(calc(78vh*9/16),460px)]' : 'aspect-[4/5] w-[min(100%,calc(62vh*4/5))] md:w-[min(calc(78vh*4/5),600px)]'
      }`}
    >
      {isVideo ? (
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
        <Image key={current.mediaUrl} src={current.mediaUrl} alt={item.label} fill unoptimized sizes="(min-width: 768px) 50vw, 100vw" className="object-contain" />
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
  );
}

function Caption({ text }: { text: string }) {
  const clean = text.replace(/(^|\s)#\S+/g, '').trim();
  if (!clean) return null;
  return <p className="mt-3 line-clamp-6 whitespace-pre-line text-sm leading-relaxed text-cream/75">{clean}</p>;
}

function NavButton({ side, onClick }: { side: 'left' | 'right'; onClick: () => void }) {
  const Icon = side === 'left' ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === 'left' ? 'Previous reel' : 'Next reel'}
      className={`absolute top-1/2 z-10 hidden h-14 w-14 -translate-y-1/2 place-items-center rounded-full bg-cream/10 transition hover:bg-tomato md:grid ${
        side === 'left' ? 'left-6' : 'right-6'
      }`}
    >
      <Icon className="h-6 w-6" aria-hidden />
    </button>
  );
}

/** Keeps Tab and Shift+Tab inside the dialog. */
function trapTab(e: KeyboardEvent, root: HTMLElement | null) {
  if (!root) return;
  const focusable = Array.from(
    root.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), iframe, video[controls], [tabindex]:not([tabindex="-1"])'),
  ).filter((el) => el.offsetParent !== null || el.tagName === 'IFRAME');
  if (focusable.length === 0) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}
