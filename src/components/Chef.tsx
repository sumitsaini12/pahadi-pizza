'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChefHat, Quote } from 'lucide-react';
import { CHEF } from '../content';
import Reveal from './motion/Reveal';
import TiltCard from './motion/TiltCard';

export default function Chef() {
  // Try the chef's photo, then the old fallback; if both are unavailable show a branded card.
  const sources = [CHEF.photo, CHEF.photoFallback];
  const [attempt, setAttempt] = useState(0);
  const photo = sources[attempt];

  return (
    <section id="chef" className="relative overflow-hidden bg-cream py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grain relative overflow-hidden rounded-[2.5rem] bg-espresso px-6 py-14 text-cream shadow-[0_50px_100px_-40px_rgba(22,14,10,0.9)] md:px-14 md:py-20 lg:rounded-[3rem]">
          <div aria-hidden className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(200,54,31,0.35),transparent_65%)]" />
          <div aria-hidden className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(233,169,59,0.2),transparent_65%)]" />

          <div className="relative z-[2] grid grid-cols-1 items-center gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
            <div className="order-2 lg:order-1">
              <Reveal>
                <p className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.28em] text-gold">
                  <ChefHat className="h-4 w-4" aria-hidden />
                  {CHEF.eyebrow}
                </p>
                <h2 className="font-display text-4xl font-semibold leading-[1.02] md:text-6xl">{CHEF.name}</h2>
              </Reveal>

              <Reveal delay={0.1} className="mt-8 text-lg leading-relaxed text-cream/75">
                <p className="text-xl text-cream/90">{CHEF.intro}</p>
                <ul className="mt-6 space-y-4">
                  {CHEF.points.map((pt) => (
                    <li key={pt.label} className="border-l-2 border-gold/50 pl-4">
                      <span className="block text-xs font-bold uppercase tracking-[0.2em] text-gold">{pt.label}</span>
                      <span className="mt-1 block">{pt.text}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal delay={0.2}>
                <blockquote className="relative mt-8 rounded-3xl border border-gold/20 bg-cream/5 p-6 pl-14 font-display text-xl italic leading-snug text-cream md:text-2xl">
                  <Quote className="absolute left-5 top-6 h-6 w-6 text-gold" aria-hidden />
                  &ldquo;{CHEF.quote}&rdquo;
                </blockquote>
              </Reveal>

              <Reveal delay={0.3}>
                <dl className="mt-10 grid grid-cols-3 gap-2 sm:gap-3 md:gap-6">
                  {CHEF.stats.map((s) => (
                    <div key={s.label} className="flex flex-col-reverse rounded-2xl border border-cream/10 bg-cream/[0.04] px-1.5 py-4 text-center md:p-5">
                      <dt className="mt-1 text-[9px] font-bold uppercase tracking-[0.08em] text-cream/60 sm:text-[10px] sm:tracking-[0.16em] md:text-xs">{s.label}</dt>
                      <dd className="whitespace-nowrap font-display text-2xl font-semibold text-gold-light sm:text-3xl md:text-4xl">{s.value}</dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            </div>

            <Reveal className="order-1 lg:order-2" y={50}>
              <div className="relative mx-auto max-w-sm lg:max-w-none">
                <div aria-hidden className="absolute inset-0 translate-x-4 translate-y-4 rotate-3 rounded-[2rem] border-2 border-gold/40" />
                <TiltCard max={9} innerClassName="rounded-[2rem]">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-2xl">
                    {photo ? (
                      <Image
                        src={photo}
                        alt={CHEF.name}
                        fill
                        sizes="(min-width: 1024px) 440px, 90vw"
                        className="object-cover transition duration-700 hover:scale-105"
                        onError={() => setAttempt((a) => a + 1)}
                      />
                    ) : (
                      <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_50%_35%,#3a2618,#160e0a_70%)]">
                        <div className="text-center">
                          <span className="mx-auto block h-40 w-40 overflow-hidden rounded-full ring-4 ring-gold/40 md:h-48 md:w-48">
                            <Image src="/app-logo.png" alt="" width={192} height={192} className="h-full w-full object-cover" />
                          </span>
                          <ChefHat className="mx-auto mt-6 h-8 w-8 text-gold" aria-hidden />
                        </div>
                      </div>
                    )}
                    <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-espresso/70 via-transparent to-transparent" />
                    <p className="absolute bottom-5 left-5 right-5 font-display text-2xl font-semibold text-cream" style={{ transform: 'translateZ(50px)' }}>
                      {CHEF.name}
                    </p>
                  </div>
                </TiltCard>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
