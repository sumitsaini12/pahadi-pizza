'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, Phone, Star } from 'lucide-react';
import { MENU_ITEMS } from '../data';
import { MenuItem } from '../types';
import { TEL_PRIMARY, orderMessageUrl } from '../content';
import TiltCard from './motion/TiltCard';
import MobileMenu from './menu/MobileMenu';
import { CATEGORIES, FALLBACK_IMG, sizeLabel } from './menu/categories';

export default function Menu() {
  const [active, setActive] = useState<MenuItem['category']>('Veg Pizzas');
  const [sub, setSub] = useState<string>('All');

  const inCategory = MENU_ITEMS.filter((i) => i.category === active);
  const subCategories = Array.from(new Set(inCategory.map((i) => i.subCategory).filter(Boolean))) as string[];
  const items = sub === 'All' ? inCategory : inCategory.filter((i) => i.subCategory === sub);
  const groups = items.reduce<Record<string, MenuItem[]>>((acc, item) => {
    const key = item.subCategory || 'Other';
    (acc[key] ||= []).push(item);
    return acc;
  }, {});

  return (
    <section id="menu" className="cv-auto grain relative overflow-clip bg-charcoal pb-16 pt-10 text-cream md:py-32">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(233,169,59,0.14),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(200,54,31,0.18),transparent_50%)]" />

      <div className="relative z-[2] mx-auto max-w-7xl px-4 md:px-8">
        {/* Not a Reveal: on phones this header is often the first thing seen after tapping "Menu". */}
        <div className="mx-auto mb-5 max-w-2xl text-left md:mb-16 md:text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-gold md:mb-4">Artisanal Selection</p>
          <h2 className="font-display text-[2.15rem] font-semibold leading-[1.05] md:text-6xl">
            Our Curated <span className="italic text-gold-light">Menu</span>
          </h2>
          <p className="mt-3 text-base leading-relaxed text-cream/80 md:mt-5 md:text-lg md:text-cream/70">
            Handcrafted delicacies made with fresh ingredients and authentic hill-inspired flavors.
          </p>
        </div>

        <MobileMenu />

        {/* Tablet and desktop: category tabs over a card grid */}
        <div className="hidden md:block">
        <div className="mb-12">
          <div
            role="tablist"
            aria-label="Menu categories"
            className="no-scrollbar mx-auto flex w-full max-w-fit gap-2 overflow-x-auto rounded-full border border-cream/10 bg-espresso/95 p-1.5 md:bg-espresso/80 md:backdrop-blur-xl"
          >
            {CATEGORIES.map(({ id, icon: Icon }) => {
              const selected = active === id;
              return (
                <button
                  key={id}
                  role="tab"
                  type="button"
                  id={`tab-${id}`}
                  aria-selected={selected}
                  aria-controls="menu-panel"
                  onClick={() => {
                    setActive(id);
                    setSub('All');
                  }}
                  className={`relative flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition-colors md:px-5 ${
                    selected ? 'text-espresso' : 'text-cream/75 hover:text-cream'
                  }`}
                >
                  {selected && (
                    <motion.span
                      layoutId="menu-pill"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-gold-light to-gold shadow-[0_8px_24px_-8px_rgba(233,169,59,0.8)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  <Icon className="relative h-4 w-4" aria-hidden />
                  <span className="relative whitespace-nowrap">{id}</span>
                </button>
              );
            })}
          </div>
        </div>

        {subCategories.length > 1 && (
          <div className="no-scrollbar -mx-4 mb-12 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:justify-center md:px-0" role="group" aria-label="Filter by style">
            {['All', ...subCategories].map((name) => (
              <button
                key={name}
                type="button"
                aria-pressed={sub === name}
                onClick={() => setSub(name)}
                className={`shrink-0 rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] transition ${
                  sub === name
                    ? 'border-tomato bg-tomato text-white'
                    : 'border-cream/15 text-cream/70 hover:border-cream/40 hover:text-cream'
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        )}

        <div id="menu-panel" role="tabpanel" aria-labelledby={`tab-${active}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={`${active}-${sub}`}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-16"
            >
              {Object.entries(groups).map(([group, list]) => (
                <div key={group}>
                  {group !== 'Other' && (
                    <div className="mb-8 flex items-center gap-4">
                      <h3 className="font-display text-2xl font-semibold text-cream md:text-3xl">{group}</h3>
                      <span aria-hidden className="h-px flex-1 bg-gradient-to-r from-gold/50 to-transparent" />
                      <span className="text-xs font-bold uppercase tracking-widest text-cream/50">
                        {list.length} {list.length === 1 ? 'item' : 'items'}
                      </span>
                    </div>
                  )}
                  <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:snap-none sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3 lg:gap-7 xl:grid-cols-4">
                    {list.map((item, i) => (
                      <motion.div
                        key={item.id}
                        className="w-[82%] max-w-[320px] shrink-0 snap-center sm:w-auto sm:max-w-none"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '0px 0px -8% 0px' }}
                        transition={{ duration: 0.6, delay: (i % 4) * 0.07, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <MenuCard item={item} />
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
        </div>
      </div>
    </section>
  );
}

function MenuCard({ item }: { item: MenuItem }) {
  const [idx, setIdx] = useState(0);
  const [src, setSrc] = useState(item.image);
  const variant = item.variants[idx] || item.variants[0];
  const multi = item.variants.length > 1;

  return (
    <TiltCard max={7} className="h-full" innerClassName="rounded-[2rem]">
      <article className="group flex h-full flex-col overflow-hidden rounded-[2rem] bg-cream text-ink shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)] ring-1 ring-cream/10">
        <div className="relative aspect-[4/3] overflow-hidden bg-cream-2">
          <Image
            src={src}
            alt={item.name}
            fill
            sizes="(min-width: 1280px) 320px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-[1200ms] ease-out group-hover:scale-110"
            onError={() => setSrc(FALLBACK_IMG)}
          />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-espresso/70 via-espresso/0 to-transparent" />
          {item.isPopular && (
            <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-espresso/85 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-gold-light">
              <Star className="h-3 w-3 fill-gold text-gold" aria-hidden />
              Bestseller
            </span>
          )}
          <div className="absolute bottom-4 right-4 rounded-2xl bg-cream px-3.5 py-1.5 shadow-lg" style={{ transform: 'translateZ(40px)' }}>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={variant.price}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="block font-display text-xl font-semibold tabular-nums text-tomato"
              >
                ₹{variant.price}/-
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-6">
          <h4 className="font-display text-xl font-semibold leading-snug md:text-[1.35rem]">{item.name}</h4>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{item.description}</p>

          {multi && (
            <div className="mt-5">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-muted">
                {sizeLabel(item)}
              </p>
              <div className="flex gap-1 rounded-2xl bg-cream-2 p-1" role="radiogroup" aria-label={`${item.name} size`}>
                {item.variants.map((v, i) => (
                  <button
                    key={v.label}
                    type="button"
                    role="radio"
                    aria-checked={idx === i}
                    onClick={() => setIdx(i)}
                    className={`flex-1 rounded-xl px-1.5 py-1.5 text-xs font-bold leading-tight transition ${
                      idx === i ? 'bg-espresso text-cream shadow' : 'text-ink/70 hover:text-ink'
                    }`}
                  >
                    <span className="block">{v.label}</span>
                    <span className="block text-[11px] font-semibold opacity-70">₹{v.price}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-5 grid grid-cols-[1fr_auto] gap-2">
            <a
              href={orderMessageUrl(item.name, multi ? variant.label : undefined)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-whatsapp py-3.5 text-sm font-bold text-white transition hover:brightness-110 active:scale-[0.98]"
            >
              <MessageCircle className="h-4 w-4" aria-hidden />
              Order on WhatsApp
            </a>
            <a
              href={TEL_PRIMARY}
              aria-label={`Call to order ${item.name}`}
              className="grid w-12 place-items-center rounded-2xl border border-bark/15 text-ink transition hover:bg-espresso hover:text-cream"
            >
              <Phone className="h-4 w-4" aria-hidden />
            </a>
          </div>
        </div>
      </article>
    </TiltCard>
  );
}
