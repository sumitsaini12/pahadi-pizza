'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Phone, MessageCircle, MapPin, Clock, ArrowDown } from 'lucide-react';
import { BRAND_NAME, TAGLINE, OPENING_HOURS } from '../constants';
import { HERO_BADGE, HERO_COPY, TEL_PRIMARY, WHATSAPP_URL } from '../content';
import HeroVisual from './three/HeroVisual';
import { useMediaQuery } from '../lib/useMediaQuery';

const EMBERS = Array.from({ length: 14 }, (_, i) => ({
  left: `${(i * 37) % 100}%`,
  delay: `${(i * 0.73) % 6}s`,
  duration: `${6 + ((i * 1.7) % 5)}s`,
  drift: `${((i % 5) - 2) * 18}px`,
  size: 2 + (i % 3),
}));

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const farY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);
  const midY = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);
  const nearY = useTransform(scrollYProgress, [0, 1], ['0%', '34%']);
  const visualY = useTransform(scrollYProgress, [0, 1], ['0%', '-10%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  // Parallax is a desktop flourish; phones get a still, fast hero.
  const wide = useMediaQuery('(min-width: 768px)');
  const still = '0%';

  return (
    <section
      ref={ref}
      id="top"
      className="grain relative overflow-hidden bg-espresso text-cream"
      aria-label={`${BRAND_NAME} – ${TAGLINE}`}
    >
      {/* Warm oven glow */}
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_45%,rgba(232,98,40,0.35),transparent_55%),radial-gradient(ellipse_at_10%_10%,rgba(233,169,59,0.12),transparent_45%)]" />

      {/* Rising embers */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-full overflow-hidden md:block">
        {EMBERS.map((e, i) => (
          <span
            key={i}
            className="absolute bottom-0 rounded-full bg-gold-light shadow-[0_0_8px_2px_rgba(247,160,70,0.8)] animate-ember"
            style={{
              left: e.left,
              width: e.size,
              height: e.size,
              animationDelay: e.delay,
              animationDuration: e.duration,
              ['--drift' as string]: e.drift,
            }}
          />
        ))}
      </div>

      {/* Layered Himalayan foothills (parallax depth) */}
      <motion.svg aria-hidden style={{ y: wide ? farY : still }} className="absolute bottom-0 left-0 h-[52%] w-full" viewBox="0 0 1440 400" preserveAspectRatio="none">
        <defs>
          <linearGradient id="hill-far" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#4a3020" stopOpacity="0.9" />
            <stop offset="1" stopColor="#24170f" />
          </linearGradient>
        </defs>
        <path fill="url(#hill-far)" d="M0 250 L120 170 L210 220 L340 110 L470 215 L560 160 L700 60 L820 185 L930 130 L1060 205 L1180 100 L1300 195 L1440 140 L1440 400 L0 400Z" />
        <path fill="#f8f0e1" opacity="0.14" d="M700 60 L672 93 L688 89 L701 99 L716 87 L728 90Z M340 110 L318 136 L332 133 L343 141 L356 131Z M1180 100 L1158 126 L1172 123 L1183 131 L1196 121Z" />
      </motion.svg>
      <motion.svg aria-hidden style={{ y: wide ? midY : still }} className="absolute bottom-0 left-0 h-[36%] w-full" viewBox="0 0 1440 300" preserveAspectRatio="none">
        <defs>
          <linearGradient id="hill-mid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#35231a" />
            <stop offset="1" stopColor="#1b110b" />
          </linearGradient>
        </defs>
        <path fill="url(#hill-mid)" d="M0 200 L160 120 L300 190 L420 110 L560 200 L720 130 L860 210 L1000 120 L1150 190 L1290 120 L1440 180 L1440 300 L0 300Z" />
        {/* Pine silhouettes */}
        <path fill="#140d08" d="M90 300 L110 230 L130 300Z M128 300 L150 210 L172 300Z M1250 300 L1272 220 L1294 300Z M1296 300 L1314 240 L1332 300Z M610 300 L628 245 L646 300Z" />
      </motion.svg>
      <motion.svg aria-hidden style={{ y: wide ? nearY : still }} className="absolute -bottom-px left-0 h-[20%] w-full text-cream" viewBox="0 0 1440 160" preserveAspectRatio="none">
        <path fill="#140d08" d="M0 90 C200 40 360 120 560 80 C760 40 900 110 1100 70 C1260 40 1360 80 1440 60 L1440 160 L0 160Z" />
        <path fill="currentColor" d="M0 130 C240 100 420 150 720 125 C1000 100 1200 150 1440 120 L1440 160 L0 160Z" />
      </motion.svg>

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-6 px-4 pb-28 pt-20 md:min-h-[100svh] md:grid-cols-[1.05fr_1fr] md:gap-4 md:px-8 md:pb-44 md:pt-32">
        <motion.div style={{ y: wide ? textY : still }} className="md:order-1">
          <motion.p
            initial={{ y: 16 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-4 inline-flex md:mb-6 items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.22em] text-gold-light backdrop-blur"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-basil-light opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-basil-light" />
            </span>
            {HERO_BADGE}
          </motion.p>

          <motion.h1
            initial={{ y: 30 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-between gap-3 font-display text-[clamp(2.9rem,13vw,7.25rem)] font-semibold leading-[0.95] tracking-tight md:block"
          >
            <span>
              Pahadi{' '}
              <span className="block bg-gradient-to-r from-gold-light via-gold to-tomato-light bg-clip-text italic text-transparent">
                Pizza
              </span>
            </span>
            {/* Phones: a small, light pizza photo beside the name instead of the big visual. */}
            <span aria-hidden className="relative block aspect-square w-[34vw] max-w-[150px] shrink-0 overflow-hidden rounded-full shadow-[0_20px_40px_-12px_rgba(0,0,0,0.8),0_0_0_6px_rgba(212,145,74,0.25)] md:hidden">
              <Image
                src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=1000"
                alt=""
                fill
                priority
                sizes="150px"
                className="scale-[1.35] object-cover"
              />
            </span>
          </motion.h1>
          <motion.p
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="mt-4 max-w-xl text-base leading-relaxed text-cream/80 md:mt-6 md:text-xl"
          >
            <span className="font-display text-xl italic text-cream md:text-[1.7rem]">{TAGLINE}.</span>
            <br />
            {HERO_COPY}
          </motion.p>

          <motion.div
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-6 grid grid-cols-2 gap-3 sm:flex sm:flex-row md:mt-9 md:flex-col lg:flex-row"
          >
            {/* Phones: WhatsApp order first, the most common way customers order. */}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[52px] items-center justify-center gap-2 whitespace-nowrap rounded-2xl bg-whatsapp px-4 py-3.5 text-base font-bold text-white shadow-[0_18px_40px_-14px_rgba(21,128,61,0.9)] transition active:scale-[0.97] active:brightness-90 sm:order-2 sm:rounded-full sm:border sm:border-cream/25 sm:bg-cream/10 sm:px-8 sm:py-4 sm:shadow-none sm:backdrop-blur sm:hover:-translate-y-0.5 sm:hover:bg-cream/20 md:gap-3"
            >
              <MessageCircle className="h-5 w-5 sm:text-basil-light" aria-hidden />
              <span className="sm:hidden">WhatsApp</span>
              <span className="hidden sm:inline">WhatsApp Order</span>
            </a>
            <a
              href={TEL_PRIMARY}
              className="group inline-flex min-h-[52px] items-center justify-center gap-2 whitespace-nowrap rounded-2xl bg-tomato px-4 py-3.5 text-base font-bold text-white shadow-[0_18px_40px_-12px_rgba(200,54,31,0.9)] transition active:scale-[0.97] active:bg-tomato-dark sm:order-1 sm:rounded-full sm:px-8 sm:py-4 sm:hover:-translate-y-0.5 sm:hover:bg-tomato-dark md:gap-3"
            >
              <Phone className="h-5 w-5 transition group-hover:rotate-12" aria-hidden />
              Call Now
            </a>
          </motion.div>
          <a
            href="#menu"
            className="mt-3 flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-cream/20 text-base font-bold text-cream transition active:bg-cream/10 sm:hidden"
          >
            View Menu
            <ArrowDown className="h-4 w-4" aria-hidden />
          </a>

          <motion.ul
            className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-cream/80 md:mt-9"
          >
            <li className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gold" aria-hidden /> Main Chauraha, Kaladhungi
            </li>
            <li className="inline-flex items-center gap-2">
              <Clock className="h-4 w-4 text-gold" aria-hidden /> {OPENING_HOURS}
            </li>
          </motion.ul>
        </motion.div>

        <motion.div
          style={{ y: wide ? visualY : still }}
          initial={{ scale: 0.94 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto hidden w-full md:order-2 md:block"
        >
          <HeroVisual />
        </motion.div>
      </div>

      <a
        href="#about"
        className="absolute bottom-24 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-cream/60 transition hover:text-cream md:flex"
      >
        Scroll
        <ArrowDown className="h-4 w-4 animate-bounce" aria-hidden />
      </a>
    </section>
  );
}
