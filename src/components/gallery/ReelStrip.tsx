'use client';

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type MouseEvent, type PointerEvent } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import ReelCard from './ReelCard';
import type { ReelItem } from './types';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

const AUTO_ADVANCE_MS = 3600;
/** After the visitor scrolls, drags or presses an arrow, auto-advance waits this long before resuming. */
const RESUME_AFTER_MS = 7000;
/** Cards beyond each edge of the visible strip whose posters are loaded ahead of time. */
const PRELOAD_CARDS = 2;

type Props = {
  items: ReelItem[];
  /** Pauses auto-advance, e.g. while the theatre is open. */
  paused: boolean;
  onOpen: (index: number) => void;
};

/**
 * Horizontal reel strip: native momentum scrolling and swipe, mouse drag with a little glide,
 * arrow buttons, keyboard arrows between cards, and a gentle auto-advance that loops back to
 * the first reel. Auto-advance stops on hover, focus, interaction, while the theatre is open,
 * off screen, in a background tab, for reduced motion, or with the pause button.
 */
export default function ReelStrip({ items, paused, onOpen }: Props) {
  const scroller = useRef<HTMLUListElement>(null);
  const section = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  const [inView, setInView] = useState(false);
  const [near, setNear] = useState<boolean[]>(() => items.map(() => false));
  const [progress, setProgress] = useState(0);
  const [current, setCurrent] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [lastTouch, setLastTouch] = useState(0);
  const [pageVisible, setPageVisible] = useState(true);
  const [now, setNow] = useState(0);

  /** Distance between the starts of two neighbouring cards. */
  const stepSize = useCallback(() => {
    const el = scroller.current;
    const a = el?.children[0] as HTMLElement | undefined;
    const b = el?.children[1] as HTMLElement | undefined;
    return a && b ? b.offsetLeft - a.offsetLeft : (a?.offsetWidth ?? 300);
  }, []);

  /** Recomputes progress, the current card and which posters should be loaded. */
  const measure = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 0);
    const step = stepSize();
    const first = Math.round(el.scrollLeft / step);
    const visible = Math.ceil(el.clientWidth / step);
    setCurrent(Math.min(first, items.length - 1));
    if (!inView) return;
    setNear((prev) => {
      const lo = Math.max(0, first - PRELOAD_CARDS);
      const hi = Math.min(items.length - 1, first + visible + PRELOAD_CARDS);
      if (prev.slice(lo, hi + 1).every(Boolean)) return prev;
      return prev.map((v, i) => v || (i >= lo && i <= hi));
    });
  }, [inView, items.length, stepSize]);

  // Posters only start loading once the strip is close to the viewport.
  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: '400px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  useEffect(() => {
    const onVis = () => setPageVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  const go = useCallback(
    (dir: 1 | -1) => {
      const el = scroller.current;
      if (!el) return;
      const behavior: ScrollBehavior = reduced ? 'auto' : 'smooth';
      const max = el.scrollWidth - el.clientWidth;
      if (dir > 0 && el.scrollLeft >= max - 4) el.scrollTo({ left: 0, behavior });
      else if (dir < 0 && el.scrollLeft <= 4) el.scrollTo({ left: max, behavior });
      else el.scrollBy({ left: dir * stepSize(), behavior });
    },
    [reduced, stepSize],
  );

  const touched = () => setLastTouch(Date.now());
  const manual = (dir: 1 | -1) => {
    touched();
    go(dir);
  };

  // Auto-advance. `now` ticks so a pause after interaction ends on its own.
  const running =
    !reduced && !userPaused && !paused && !hovering && !focusWithin && inView && pageVisible && now - lastTouch > RESUME_AFTER_MS;
  useEffect(() => {
    if (reduced || userPaused) return;
    const t = window.setInterval(() => setNow(Date.now()), AUTO_ADVANCE_MS);
    return () => window.clearInterval(t);
  }, [reduced, userPaused]);
  useEffect(() => {
    if (running && now) go(1);
    // Advance once per tick only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [now]);

  // Mouse drag with a short glide. Touch and trackpads use the browser's own momentum scrolling.
  const drag = useRef<{ x: number; left: number; moved: boolean; v: number; t: number; lastX: number } | null>(null);
  const glide = useRef<number | null>(null);
  const suppressClick = useRef(false);

  const stopGlide = () => {
    if (glide.current !== null) cancelAnimationFrame(glide.current);
    glide.current = null;
  };

  const onPointerDown = (e: PointerEvent<HTMLUListElement>) => {
    if (e.pointerType !== 'mouse' || e.button !== 0 || !scroller.current) return;
    stopGlide();
    drag.current = { x: e.clientX, left: scroller.current.scrollLeft, moved: false, v: 0, t: e.timeStamp, lastX: e.clientX };
  };

  const onPointerMove = (e: PointerEvent<HTMLUListElement>) => {
    const d = drag.current;
    const el = scroller.current;
    if (!d || !el) return;
    const dx = e.clientX - d.x;
    if (!d.moved && Math.abs(dx) > 6) {
      d.moved = true;
      el.setPointerCapture(e.pointerId);
      el.style.scrollSnapType = 'none';
      el.style.cursor = 'grabbing';
      touched();
    }
    if (!d.moved) return;
    el.scrollLeft = d.left - dx;
    const dt = Math.max(1, e.timeStamp - d.t);
    d.v = (e.clientX - d.lastX) / dt;
    d.t = e.timeStamp;
    d.lastX = e.clientX;
  };

  const endDrag = () => {
    const d = drag.current;
    const el = scroller.current;
    drag.current = null;
    if (!d?.moved || !el) return;
    suppressClick.current = true;
    el.style.cursor = '';
    let v = reduced ? 0 : d.v * 16;
    const tick = () => {
      if (Math.abs(v) < 0.5) {
        el.style.scrollSnapType = '';
        glide.current = null;
        return;
      }
      el.scrollLeft -= v;
      v *= 0.92;
      glide.current = requestAnimationFrame(tick);
    };
    tick();
  };

  // A drag that ends over a card must not open it.
  const onClickCapture = (e: MouseEvent) => {
    if (!suppressClick.current) return;
    suppressClick.current = false;
    e.preventDefault();
    e.stopPropagation();
  };

  // Left and right arrows move focus between cards.
  const onKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const buttons = Array.from(scroller.current?.querySelectorAll<HTMLButtonElement>('button[data-reel]') ?? []);
    const i = buttons.indexOf(document.activeElement as HTMLButtonElement);
    if (i < 0) return;
    e.preventDefault();
    touched();
    const next = buttons[(i + (e.key === 'ArrowRight' ? 1 : -1) + buttons.length) % buttons.length];
    next.focus({ preventScroll: true });
    next.closest('li')?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', inline: 'start', block: 'nearest' });
  };

  const showAutoToggle = !reduced;

  return (
    <div ref={section} onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}>
      <div className="mx-auto mb-6 flex max-w-7xl items-center justify-between gap-4 px-4 md:px-8">
        <p className="text-sm font-semibold text-muted" aria-live="off">
          <span className="font-display text-2xl font-semibold tabular-nums text-ink">{String(current + 1).padStart(2, '0')}</span>
          <span className="mx-1.5 text-ink/30">/</span>
          <span className="tabular-nums">{String(items.length).padStart(2, '0')}</span>
          <span className="ml-3 hidden sm:inline">Newest first</span>
        </p>
        <div className="flex items-center gap-2">
          {showAutoToggle && (
            <button
              type="button"
              onClick={() => setUserPaused((p) => !p)}
              aria-pressed={userPaused}
              aria-label={userPaused ? 'Resume auto-scroll' : 'Pause auto-scroll'}
              className="mr-1 hidden h-11 items-center gap-2 rounded-full px-4 text-xs font-bold uppercase tracking-[0.18em] text-muted transition hover:text-tomato md:inline-flex"
            >
              {userPaused ? <Play className="h-3.5 w-3.5 fill-current" aria-hidden /> : <Pause className="h-3.5 w-3.5 fill-current" aria-hidden />}
              {userPaused ? 'Play' : 'Pause'}
            </button>
          )}
          <ArrowButton dir={-1} onClick={() => manual(-1)} />
          <ArrowButton dir={1} onClick={() => manual(1)} />
        </div>
      </div>

      <div className="relative">
        <ul
          ref={scroller}
          aria-label="Reels from Pahadi Pizza on Instagram"
          onScroll={measure}
          onWheel={(e) => Math.abs(e.deltaX) > Math.abs(e.deltaY) && touched()}
          onTouchStart={touched}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onClickCapture={onClickCapture}
          onKeyDown={onKeyDown}
          onFocus={() => setFocusWithin(true)}
          onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && setFocusWithin(false)}
          className="reel-strip flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-6 pt-2 md:cursor-grab md:gap-6"
        >
          {items.map((item, i) => (
            <li key={item.id} className="w-[64vw] max-w-[280px] shrink-0 snap-start sm:w-[40vw] md:w-[260px] lg:w-[272px]">
              <ReelCard item={item} index={i} total={items.length} near={near[i]} onOpen={() => onOpen(i)} />
            </li>
          ))}
        </ul>
        <span aria-hidden className="pointer-events-none absolute inset-y-0 right-0 hidden w-24 bg-gradient-to-l from-cream to-transparent md:block" />
      </div>

      <div className="mx-auto mt-2 max-w-7xl px-4 md:px-8">
        <div className="h-[3px] overflow-hidden rounded-full bg-ink/10" aria-hidden>
          <div
            className="h-full origin-left rounded-full bg-tomato transition-transform duration-300 ease-out motion-reduce:transition-none"
            style={{ transform: `scaleX(${Math.max(progress, 1 / Math.max(items.length, 1))})` }}
          />
        </div>
      </div>
    </div>
  );
}

function ArrowButton({ dir, onClick }: { dir: 1 | -1; onClick: () => void }) {
  const Icon = dir > 0 ? ChevronRight : ChevronLeft;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir > 0 ? 'Next reels' : 'Previous reels'}
      className="grid h-12 w-12 place-items-center rounded-full border border-ink/15 bg-white/70 text-ink shadow-[0_14px_30px_-22px_rgba(42,28,19,0.7)] transition hover:border-tomato hover:bg-tomato hover:text-cream active:scale-95"
    >
      <Icon className="h-5 w-5" aria-hidden />
    </button>
  );
}
