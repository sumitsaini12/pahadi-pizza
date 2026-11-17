'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { GALLERY_IMAGES } from '../content';
import Reveal from './motion/Reveal';

const LAYOUT = [
  'md:col-span-2 md:row-span-2 aspect-[4/3] md:aspect-auto',
  'aspect-[4/3] md:aspect-auto',
  'aspect-[4/3] md:aspect-auto',
  'md:col-span-3 aspect-[16/9] md:aspect-auto',
];
const SPEEDS = [-4, 8, -8, 5];

export default function Gallery() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y0 = useTransform(scrollYProgress, [0, 1], [`${SPEEDS[0]}%`, `${-SPEEDS[0]}%`]);
  const y1 = useTransform(scrollYProgress, [0, 1], [`${SPEEDS[1]}%`, `${-SPEEDS[1]}%`]);
  const y2 = useTransform(scrollYProgress, [0, 1], [`${SPEEDS[2]}%`, `${-SPEEDS[2]}%`]);
  const y3 = useTransform(scrollYProgress, [0, 1], [`${SPEEDS[3]}%`, `${-SPEEDS[3]}%`]);
  const ys = [y0, y1, y2, y3];

  return (
    <section id="gallery" className="relative bg-cream pb-24 md:pb-32">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <Reveal className="mb-12 flex flex-col items-start justify-between gap-4 md:mb-16 md:flex-row md:items-end">
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-tomato">Vibe &amp; Taste</p>
            <h2 className="font-display text-4xl font-semibold leading-[1.05] text-ink md:text-6xl">
              The <span className="italic text-basil">Gallery</span>
            </h2>
          </div>
          <p className="max-w-sm text-muted">Fresh out of the oven, every single time.</p>
        </Reveal>

        <div ref={ref} className="grid grid-cols-1 gap-4 md:h-[1080px] md:grid-cols-3 md:grid-rows-[1fr_1fr_0.9fr] md:gap-6">
          {GALLERY_IMAGES.map((src, i) => (
            <Reveal key={src} delay={i * 0.08} className={`group relative overflow-hidden rounded-[2rem] bg-cream-2 ${LAYOUT[i]}`}>
              <motion.div style={{ y: ys[i] }} className="absolute inset-[-10%]">
                <Image
                  src={src}
                  alt="Freshly baked pizza"
                  fill
                  sizes={i === 3 ? '100vw' : i === 0 ? '(min-width: 768px) 66vw, 100vw' : '(min-width: 768px) 33vw, 100vw'}
                  className="object-cover transition duration-[1400ms] ease-out group-hover:scale-110"
                />
              </motion.div>
              <div aria-hidden className="absolute inset-0 bg-gradient-to-tr from-espresso/40 via-transparent to-gold/10 opacity-80 transition group-hover:opacity-40" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
