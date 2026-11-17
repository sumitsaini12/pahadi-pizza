'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Review } from '../types';

/** Phones: one review per swipe, with snap, dots and large previous/next buttons. */
export default function ReviewsCarousel({ reviews }: { reviews: Review[] }) {
  const track = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const card = el.firstElementChild as HTMLElement | null;
        if (!card) return;
        const step = card.offsetWidth + 12;
        setIndex(Math.max(0, Math.min(reviews.length - 1, Math.round(el.scrollLeft / step))));
      });
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reviews.length]);

  const go = (i: number) => {
    const el = track.current;
    const card = el?.children[i] as HTMLElement | undefined;
    if (!el || !card) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollTo({ left: card.offsetLeft - el.offsetLeft - 16, behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <div className="relative z-[2] md:hidden" role="region" aria-roledescription="carousel" aria-label="Customer reviews">
      <ul
        ref={track}
        className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 pb-2"
      >
        {reviews.map((review, i) => (
          <li
            key={review.id}
            className="w-[86%] shrink-0 snap-start"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${reviews.length}`}
          >
            <figure className="flex h-full flex-col rounded-[1.5rem] border border-cream/10 bg-[#251912] p-6">
              <div className="mb-4 flex gap-1" role="img" aria-label={`${review.rating} out of 5 stars`}>
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} aria-hidden className={`h-5 w-5 ${s < review.rating ? 'fill-gold text-gold' : 'text-cream/25'}`} />
                ))}
              </div>
              <blockquote className="flex-1 font-display text-lg italic leading-relaxed text-cream/90">
                &ldquo;{review.comment}&rdquo;
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-cream/10 pt-4">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-tomato to-gold font-bold text-white" aria-hidden>
                  {review.author.charAt(0)}
                </span>
                <span>
                  <span className="block font-bold text-cream">{review.author}</span>
                  <span className="block text-sm text-cream/70">{review.date}</span>
                </span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>

      <div className="mt-5 flex items-center justify-between gap-3 px-4">
        <button
          type="button"
          onClick={() => go(Math.max(0, index - 1))}
          disabled={index === 0}
          aria-label="Previous review"
          className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-cream/20 text-cream transition active:scale-95 active:bg-cream/10 disabled:opacity-35"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden />
        </button>
        <div className="flex flex-wrap items-center justify-center gap-1.5" aria-hidden>
          {reviews.map((r, i) => (
            <span
              key={r.id}
              className={`h-2 rounded-full transition-all duration-300 ${i === index ? 'w-6 bg-gold' : 'w-2 bg-cream/30'}`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => go(Math.min(reviews.length - 1, index + 1))}
          disabled={index === reviews.length - 1}
          aria-label="Next review"
          className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-cream/20 text-cream transition active:scale-95 active:bg-cream/10 disabled:opacity-35"
        >
          <ChevronRight className="h-5 w-5" aria-hidden />
        </button>
      </div>
      <p className="sr-only" aria-live="polite">
        Review {index + 1} of {reviews.length}
      </p>
    </div>
  );
}
