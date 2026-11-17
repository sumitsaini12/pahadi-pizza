'use client';

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type MouseEvent, type PointerEvent } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import ReelCard from './ReelCard';
import type { ReelItem } from './types';
import { usePrefersReducedMotion, useMediaQuery } from './usePrefersReducedMotion';

const AUTO_ADVANCE_MS = 3600;
/** After the visitor scrolls, drags or presses an arrow, auto-advance waits this long before resuming. */
const RESUME_AFTER_MS = 7000;
/** Cards beyond each edge of the visible strip whose posters are loaded ahead of time. */
const PRELOAD_CARDS = 2;
/** How often, on phones while the strip is on screen, it checks which reel's embed holds focus. */
const FOCUS_POLL_MS = 250;
/** A playing reel stops once less than this share of it is left on screen. */
const MIN_VISIBLE_TO_KEEP_PLAYING = 0.35;

type Props = {
  items: ReelItem[];
  /** Pauses auto-advance, e.g. while the theatre is open. */
  paused: boolean;
  /** Phones: reels play inside their card on the first tap; no theatre opens. */
  inline: boolean;
  onOpen: (index: number) => void;
};

/**
 * Horizontal reel strip: native momentum scrolling and swipe, mouse drag with a little glide,
 * arrow buttons, keyboard arrows between cards, and a gentle auto-advance that loops back to
 * the first reel (wide screens only). Auto-advance stops on hover, focus, interaction, while the theatre is open,
 * off screen, in a background tab, for reduced motion, or with the pause button.
 *
 * On phones only one reel plays at a time. Starting another, pressing Stop, or swiping the reel away
 * stops it. Instagram's embed cannot be paused from the page, so a curated reel is stopped by reloading
 * its embed, which also puts its poster back.
 */
export default function ReelStrip({ items, paused, inline, onOpen }: Props) {
  const scroller = useRef<HTMLUListElement>(null);
  const section = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  // Phones scroll the strip by swipe only: nothing moves under the visitor's thumb.
  const wide = useMediaQuery('(min-width: 768px)');
  const auto = wide && !reduced;

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
  /** Id of the reel playing inside its card (phones). */
  const [playing, setPlaying] = useState<string | null>(null);
  const playingRef = useRef<string | null>(null);
  /** Bumped per reel to remount its player, the only way to stop Instagram's embed. */
  const [resets, setResets] = useState<Record<string, number>>({});

  const play = useCallback((id: string | null) => {
    const prev = playingRef.current;
    if (prev === id) return;
    playingRef.current = id;
    setPlaying(id);
    if (prev) setResets((r) => ({ ...r, [prev]: (r[prev] ?? 0) + 1 }));
  }, []);

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

    // A reel swiped (mostly) off screen stops.
    const id = playingRef.current;
    if (id) {
      const card = el.querySelector<HTMLElement>(`li[data-id="${CSS.escape(id)}"]`);
      const box = el.getBoundingClientRect();
      const r = card?.getBoundingClientRect();
      const shown = r ? Math.max(0, Math.min(r.right, box.right) - Math.max(r.left, box.left)) / r.width : 0;
      if (shown < MIN_VISIBLE_TO_KEEP_PLAYING) play(null);
    }

    if (!inView) return;
    const lo = Math.max(0, first - PRELOAD_CARDS);
    const hi = Math.min(items.length - 1, first + visible + PRELOAD_CARDS);
    setNear((prev) => {
      // Phones keep players only around the visible cards, so a reel far behind cannot keep playing
      // and memory stays low. Wide screens keep loaded posters, so the looping strip never reloads them.
      const next = prev.map((v, i) => (i >= lo && i <= hi) || (!inline && v));
      return next.every((v, i) => v === prev[i]) ? prev : next;
    });
  }, [inView, inline, items.length, stepSize, play]);

  // Curated reels on phones play inside Instagram's embed, which tells the page nothing. A tap there moves focus
  // into that embed, so while the strip is on screen the page checks which reel's embed holds focus
  // (a cheap read, a few times a second) and stops the others. The window's blur event makes the first check instant.
  useEffect(() => {
    if (!inline || !inView) return;
    const check = () => {
      const a = document.activeElement;
      if (!(a instanceof HTMLIFrameElement) || !scroller.current?.contains(a)) return;
      const id = a.closest<HTMLElement>('li[data-id]')?.dataset.id;
      if (id) play(id);
    };
    const onBlur = () => window.setTimeout(check, 0);
    const timer = window.setInterval(check, FOCUS_POLL_MS);
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('blur', onBlur);
      window.clearInterval(timer);
    };
  }, [inline, inView, play]);

  // The theatre opening, or the screen widening, stops a reel playing in the strip.
  useEffect(() => {
    if (paused || !inline) play(null);
  }, [paused, inline, play]);

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
    auto && !userPaused && !paused && !hovering && !focusWithin && inView && pageVisible && now - lastTouch > RESUME_AFTER_MS;
  useEffect(() => {
    if (!auto || userPaused) return;
    const t = window.setInterval(() => setNow(Date.now()), AUTO_ADVANCE_MS);
    return () => window.clearInterval(t);
  }, [auto, userPaused]);
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
          {auto && (
            <button
              type="button"
              onClick={() => setUserPaused((p) => !p)}
              aria-pressed={userPaused}
              aria-label={userPaused ? 'Resume auto-scroll' : 'Pause auto-scroll'}
              className="mr-1 inline-flex h-11 items-center gap-2 rounded-full px-4 text-xs font-bold uppercase tracking-[0.18em] text-muted transition hover:text-tomato"
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
            <li key={item.id} data-id={item.id} className="w-[64vw] max-w-[280px] shrink-0 snap-start sm:w-[40vw] md:w-[260px] lg:w-[272px]">
              <ReelCard
                key={resets[item.id] ?? 0}
                item={item}
                index={i}
                total={items.length}
                near={near[i]}
                inline={inline}
                playing={playing === item.id}
                onOpen={() => onOpen(i)}
                onPlay={() => play(item.id)}
                onStop={() => play(null)}
              />
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
