'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Leaf, Flame, Timer, ShieldCheck } from 'lucide-react';
import { FEATURES } from '../constants';
import { ABOUT } from '../content';
import Reveal from './motion/Reveal';
import TiltCard from './motion/TiltCard';
import { useMediaQuery } from '../lib/useMediaQuery';

const ICONS = { Leaf, Flame, Timer, ShieldCheck };
const ICON_TONES = ['bg-basil/10 text-basil', 'bg-tomato/10 text-tomato', 'bg-gold/15 text-[#9a6510]', 'bg-bark/10 text-bark'];

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);
  const badgeY = useTransform(scrollYProgress, [0, 1], ['30%', '-30%']);
  const wide = useMediaQuery('(min-width: 768px)');

  return (
    <section id="about" className="relative overflow-hidden bg-cream py-16 md:py-32">
      <div aria-hidden className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(233,169,59,0.28),transparent_65%)]" />
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 md:gap-16 md:px-8 lg:grid-cols-2 lg:gap-20">
        <div ref={ref} className="relative">
          <div aria-hidden className="absolute -inset-3 rotate-[-3deg] rounded-[2.5rem] bg-gradient-to-br from-tomato/20 via-gold/20 to-basil/20" />
          <TiltCard max={6} innerClassName="rounded-[2.25rem]">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] shadow-[0_40px_80px_-30px_rgba(42,28,19,0.6)] sm:aspect-[5/5] md:rounded-[2.25rem] lg:aspect-[4/5]">
              <motion.div style={{ y: wide ? imgY : '0%' }} className="absolute inset-[-8%]">
                <Image src={ABOUT.image} alt={ABOUT.imageAlt} fill sizes="(min-width: 1024px) 560px, 100vw" className="object-cover" />
              </motion.div>
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-espresso/50 via-transparent to-transparent" />
            </div>
          </TiltCard>
          <motion.div
            style={{ y: wide ? badgeY : '0%' }}
            className="absolute -bottom-6 right-2 flex max-w-[16rem] items-center gap-3 rounded-2xl border border-bark/10 bg-cream p-4 shadow-[0_30px_60px_-25px_rgba(42,28,19,0.55)] sm:-right-6 md:-bottom-8 md:block md:max-w-[15rem] md:rounded-3xl md:p-7"
          >
            <p className="font-display text-4xl font-semibold text-tomato md:text-5xl">{ABOUT.badgeValue}</p>
            <p className="text-base font-semibold leading-snug text-ink/80 md:mt-1 md:text-sm">{ABOUT.badgeText}</p>
          </motion.div>
        </div>

        <div>
          <Reveal>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-tomato">{ABOUT.eyebrow}</p>
            <h2 className="text-balance font-display text-[2.15rem] font-semibold leading-[1.05] text-ink md:text-6xl">
              {ABOUT.titleLine1}
              <br />
              <span className="italic text-basil">{ABOUT.titleLine2}</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted md:mt-6 md:text-lg">{ABOUT.body}</p>
          </Reveal>

          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 md:mt-12 md:gap-4">
            {FEATURES.map((f, i) => {
              const Icon = ICONS[f.iconName];
              return (
                <Reveal key={f.title} delay={i * 0.08}>
                  <div className="group flex h-full gap-4 rounded-2xl border border-bark/10 bg-white/70 p-4 transition sm:block sm:rounded-3xl sm:p-6 duration-500 hover:-translate-y-1 hover:bg-white hover:shadow-[0_25px_50px_-30px_rgba(42,28,19,0.5)]">
                    <span className={`grid h-12 w-12 shrink-0 place-items-center sm:mb-4 rounded-2xl ${ICON_TONES[i % ICON_TONES.length]} transition duration-500 group-hover:rotate-[-8deg] group-hover:scale-110`}>
                      <Icon className="h-6 w-6" aria-hidden />
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-semibold text-ink sm:text-xl">{f.title}</h3>
                      <p className="mt-1 text-base leading-relaxed text-muted sm:mt-2 sm:text-sm">{f.description}</p>
                    </div>
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
