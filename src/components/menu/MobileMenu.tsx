'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { MessageCircle, Phone, Search, Star, X } from 'lucide-react';
import { MENU_ITEMS } from '../../data';
import { MenuItem } from '../../types';
import { TEL_PRIMARY, orderMessageUrl } from '../../content';
import { CATEGORIES, FALLBACK_IMG, sizeLabel } from './categories';

/** Fixed header (64px) + sticky category bar (~60px) + breathing room. */
const STICKY_OFFSET = 136;

const slug = (s: string) => `m-${s.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

/**
 * Phone menu: every category on one scrolling list, a sticky category bar
 * that follows the scroll, a simple search, and compact one-tap order cards.
 */
export default function MobileMenu() {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState<MenuItem['category']>(CATEGORIES[0].id);
  const barRef = useRef<HTMLDivElement>(null);
  // While a tapped chip smooth-scrolls the page, the spy must not flicker through the categories in between.
  const locked = useRef(false);
  const unlockTimer = useRef<number | undefined>(undefined);

  const q = query.trim().toLowerCase();
  const sections = useMemo(
    () =>
      CATEGORIES.map((c) => ({
        ...c,
        items: MENU_ITEMS.filter(
          (i) =>
            i.category === c.id &&
            (!q ||
              i.name.toLowerCase().includes(q) ||
              i.description.toLowerCase().includes(q) ||
              (i.subCategory ?? '').toLowerCase().includes(q)),
        ),
      })).filter((s) => s.items.length > 0),
    [q],
  );
  const total = sections.reduce((n, s) => n + s.items.length, 0);

  // Scroll-spy: the category whose section crosses the line under the sticky bar.
  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      if (locked.current) return;
      let current = sections[0]?.id;
      for (const s of sections) {
        const el = document.getElementById(slug(s.id));
        if (el && el.getBoundingClientRect().top - STICKY_OFFSET - 8 <= 0) current = s.id;
      }
      if (current) setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
    };
  }, [sections]);

  // Keep the active chip in view by scrolling the bar sideways only.
  useEffect(() => {
    const bar = barRef.current;
    const chip = bar?.querySelector<HTMLElement>(`[data-cat="${active}"]`);
    if (!bar || !chip) return;
    const left = chip.offsetLeft - (bar.clientWidth - chip.offsetWidth) / 2;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    bar.scrollTo({ left: Math.max(0, left), behavior: reduce ? 'auto' : 'smooth' });
  }, [active]);

  const jumpTo = (id: MenuItem['category']) => {
    const el = document.getElementById(slug(id));
    if (!el) return;
    setActive(id);
    locked.current = true;
    window.clearTimeout(unlockTimer.current);
    unlockTimer.current = window.setTimeout(() => {
      locked.current = false;
    }, 900);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const top = el.getBoundingClientRect().top + window.scrollY - STICKY_OFFSET + 8;
    window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <div className="md:hidden">
      {/* Search */}
      <div className="relative mb-3">
        <label htmlFor="menu-search" className="sr-only">
          Search the menu
        </label>
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-cream/70" aria-hidden />
        <input
          id="menu-search"
          type="search"
          inputMode="search"
          autoComplete="off"
          placeholder="Search pizza, momo, shake…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-12 w-full rounded-2xl border border-cream/15 bg-espresso/80 pl-12 pr-12 text-base text-cream placeholder:text-cream/60 focus:border-gold focus:outline-none [&::-webkit-search-cancel-button]:hidden"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            aria-label="Clear search"
            className="absolute right-1 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-xl text-cream/80 active:bg-cream/10"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        )}
      </div>

      {/* Sticky category bar */}
      <div className="sticky top-16 z-20 -mx-4 border-b border-cream/10 bg-charcoal/95 px-4 py-2 backdrop-blur-md">
        <nav aria-label="Menu categories">
          <div ref={barRef} className="no-scrollbar flex gap-2 overflow-x-auto scroll-px-4">
            {sections.map(({ id, icon: Icon, items }) => {
              const selected = active === id;
              return (
                <button
                  key={id}
                  type="button"
                  data-cat={id}
                  aria-current={selected ? 'true' : undefined}
                  onClick={() => jumpTo(id)}
                  className={`flex min-h-11 shrink-0 items-center gap-2 rounded-full px-4 text-[15px] font-bold transition active:scale-95 ${
                    selected
                      ? 'bg-gradient-to-r from-gold-light to-gold text-espresso shadow-[0_6px_18px_-8px_rgba(233,169,59,0.9)]'
                      : 'bg-cream/[0.07] text-cream/85 active:bg-cream/15'
                  }`}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                  <span className="whitespace-nowrap">{id}</span>
                  <span className={`text-xs font-semibold tabular-nums ${selected ? 'text-espresso/75' : 'text-cream/70'}`}>
                    {items.length}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>

      <p className="sr-only" aria-live="polite">
        {q ? `${total} ${total === 1 ? 'dish' : 'dishes'} found` : ''}
      </p>

      {sections.length === 0 && (
        <div className="mt-8 rounded-2xl border border-cream/10 bg-cream/[0.04] p-6 text-center">
          <p className="text-base text-cream/85">No dishes match &ldquo;{query}&rdquo;.</p>
          <button
            type="button"
            onClick={() => setQuery('')}
            className="mt-4 min-h-11 rounded-full bg-gold px-6 font-bold text-espresso active:scale-95"
          >
            Show full menu
          </button>
        </div>
      )}

      <div className="mt-4 space-y-8">
        {sections.map(({ id, items }) => (
          <section key={id} id={slug(id)} aria-labelledby={`${slug(id)}-h`}>
            <div className="mb-3 flex items-baseline justify-between gap-3">
              <h3 id={`${slug(id)}-h`} className="font-display text-2xl font-semibold text-cream">
                {id}
              </h3>
              <span className="text-sm font-semibold text-cream/70">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <ul className="space-y-3">
              {items.map((item) => (
                <li key={item.id}>
                  <MobileMenuCard item={item} />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

function VegMark() {
  return (
    <span
      role="img"
      aria-label="Vegetarian"
      title="Vegetarian"
      className="mt-1 grid h-4 w-4 shrink-0 place-items-center rounded-[3px] border-[1.5px] border-basil bg-white"
    >
      <span className="h-2 w-2 rounded-full bg-basil" />
    </span>
  );
}

function MobileMenuCard({ item }: { item: MenuItem }) {
  const [idx, setIdx] = useState(0);
  const [src, setSrc] = useState(item.image);
  const variant = item.variants[idx] || item.variants[0];
  const multi = item.variants.length > 1;

  return (
    <article className="rounded-2xl bg-cream p-3 text-ink shadow-[0_18px_40px_-28px_rgba(0,0,0,0.9)]">
      <div className="flex gap-3">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-cream-2">
          <Image src={src} alt={item.name} fill sizes="96px" className="object-cover" onError={() => setSrc(FALLBACK_IMG)} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2">
            {item.category === 'Veg Pizzas' && <VegMark />}
            <h4 className="font-display text-lg font-semibold leading-snug">{item.name}</h4>
          </div>
          {item.isPopular && (
            <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-espresso px-2.5 py-1 text-xs font-bold uppercase tracking-[0.12em] text-gold-light">
              <Star className="h-3 w-3 fill-gold text-gold" aria-hidden />
              Bestseller
            </span>
          )}
          <p className="mt-1 text-base leading-snug text-muted">{item.description}</p>
          {!multi && (
            <p className="mt-1.5 flex items-baseline gap-2">
              <span className="font-display text-xl font-semibold tabular-nums text-tomato-dark">₹{variant.price}/-</span>
              <span className="text-sm font-semibold text-muted">{variant.label}</span>
            </p>
          )}
        </div>
      </div>

      {multi && (
        <div className="mt-3" role="radiogroup" aria-label={`${item.name} ${sizeLabel(item).toLowerCase()}`}>
          <div className="flex gap-1.5">
            {item.variants.map((v, i) => {
              const on = idx === i;
              return (
                <button
                  key={v.label}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => setIdx(i)}
                  className={`flex min-h-12 flex-1 flex-col items-center justify-center rounded-xl border px-1 leading-tight transition active:scale-[0.97] ${
                    on ? 'border-espresso bg-espresso text-cream' : 'border-bark/15 bg-white text-ink'
                  }`}
                >
                  <span className="text-sm font-bold">{v.label}</span>
                  <span className={`text-sm font-semibold tabular-nums ${on ? 'text-gold-light' : 'text-tomato-dark'}`}>₹{v.price}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-3 flex gap-2">
        <a
          href={orderMessageUrl(item.name, multi ? variant.label : undefined)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-whatsapp px-3 text-base font-bold text-white transition active:scale-[0.98] active:brightness-90"
        >
          <MessageCircle className="h-5 w-5" aria-hidden />
          <span>
            Order on WhatsApp
            {multi && <span className="sr-only"> – {variant.label}, ₹{variant.price}</span>}
          </span>
        </a>
        <a
          href={TEL_PRIMARY}
          aria-label={`Call to order ${item.name}`}
          className="grid min-h-12 w-12 shrink-0 place-items-center rounded-xl border border-bark/20 text-ink transition active:bg-espresso active:text-cream"
        >
          <Phone className="h-5 w-5" aria-hidden />
        </a>
      </div>
    </article>
  );
}
