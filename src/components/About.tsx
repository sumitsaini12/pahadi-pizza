'use client';

import { motion } from 'framer-motion';
import { Leaf, Flame, Timer, ShieldCheck } from 'lucide-react';
import { FEATURES } from '../constants';
import { ABOUT } from '../content';
import Reveal from './motion/Reveal';
import TiltCard from './motion/TiltCard';
import AboutStage from './about/AboutStage';
import styles from './about/about.module.css';

const ICONS = { Leaf, Flame, Timer, ShieldCheck };
const ICON_MOTION = { Leaf: styles.iconLeaf, Flame: styles.iconFlame, Timer: styles.iconTimer, ShieldCheck: styles.iconShield };
const ICON_TONES = [
  'bg-basil/10 text-basil ring-basil/15',
  'bg-tomato/10 text-tomato ring-tomato/15',
  'bg-gold/15 text-[#9a6510] ring-gold/25',
  'bg-bark/10 text-bark ring-bark/15',
];

/** Faint contour lines, like a hill-country survey map, behind the section. */
function Contours() {
  return (
    <svg aria-hidden className="pointer-events-none absolute inset-0 hidden h-full w-full text-bark/[0.05] md:block" preserveAspectRatio="none" viewBox="0 0 1440 900">
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <path
            key={i}
            d={`M-40 ${520 + i * 46} C 240 ${420 + i * 40}, 420 ${640 + i * 30}, 720 ${540 + i * 38} S 1200 ${430 + i * 44}, 1480 ${520 + i * 40}`}
          />
        ))}
        {[0, 1, 2, 3].map((i) => (
          <ellipse key={`e${i}`} cx="1220" cy="150" rx={90 + i * 55} ry={50 + i * 34} />
        ))}
      </g>
    </svg>
  );
}

export default function About() {
  return (
    <section id="about" className="relative overflow-hidden bg-cream py-20 md:py-28 lg:py-32">
      <Contours />
      <div aria-hidden className="absolute -left-40 top-24 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(233,169,59,0.22),transparent_65%)]" />
      <div aria-hidden className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(63,107,58,0.12),transparent_65%)]" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-4 md:px-8 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto w-full max-w-[480px] sm:max-w-[520px] lg:max-w-none"
        >
          <AboutStage image={ABOUT.image} imageAlt={ABOUT.imageAlt} badgeValue={ABOUT.badgeValue} badgeText={ABOUT.badgeText} />
        </motion.div>

        <div>
          <Reveal>
            <p className="mb-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.28em] text-tomato">
              <span aria-hidden className="h-px w-10 bg-tomato/60" />
              {ABOUT.eyebrow}
            </p>
            <h2 className="text-balance font-display text-[2.6rem] font-semibold leading-[1.04] text-ink sm:text-5xl md:text-6xl">
              {ABOUT.titleLine1}
              <br />
              <span className="italic text-basil">{ABOUT.titleLine2}</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-xl border-l-2 border-gold/50 pl-5 text-lg leading-relaxed text-muted">{ABOUT.body}</p>
          </Reveal>

          <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:mt-12">
            {FEATURES.map((f, i) => {
              const Icon = ICONS[f.iconName];
              return (
                <Reveal key={f.title} delay={0.15 + i * 0.08} y={24} className="h-full">
                  <div className="h-full">
                    <TiltCard max={7} className="h-full" innerClassName="rounded-3xl">
                      <div
                        className={`${styles.card} group flex h-full items-start gap-4 rounded-3xl border border-bark/10 bg-white/75 p-5 shadow-[0_1px_0_rgba(42,28,19,0.04)] transition duration-500 [transform-style:preserve-3d] hover:border-bark/15 hover:bg-white hover:shadow-[0_30px_50px_-30px_rgba(42,28,19,0.55)] sm:flex-col sm:gap-0 sm:p-6`}
                      >
                        <span
                          className={`${styles.iconBox} grid h-12 w-12 shrink-0 place-items-center rounded-2xl ring-1 ${ICON_TONES[i % ICON_TONES.length]} transition-transform duration-500 [transform:translateZ(0)] group-hover:[transform:translateZ(36px)] sm:mb-4`}
                        >
                          <Icon className={`h-6 w-6 ${ICON_MOTION[f.iconName]}`} aria-hidden />
                        </span>
                        <div className="transition-transform duration-500 group-hover:[transform:translateZ(18px)]">
                          <h3 className="font-display text-xl font-semibold text-ink">{f.title}</h3>
                          <p className="mt-1.5 text-sm leading-relaxed text-muted sm:mt-2">{f.description}</p>
                        </div>
                      </div>
                    </TiltCard>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
