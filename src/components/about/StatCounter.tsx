'use client';

import { useEffect, useRef } from 'react';
import { animate } from 'framer-motion';

/**
 * Shows a stat like "5+" and counts the number up the first time it scrolls
 * into view. The server renders the final value, so crawlers, no-JS visitors
 * and reduced-motion visitors always see the real figure. The digits sit in a
 * fixed-width tabular box, so counting never shifts the layout.
 */
export default function StatCounter({ value, className = '' }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const match = /^(\d+)(.*)$/.exec(value);

  useEffect(() => {
    const el = ref.current;
    const m = /^(\d+)(.*)$/.exec(value);
    if (!el || !m) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const target = Number(m[1]);
    const suffix = m[2];
    const r = el.getBoundingClientRect();
    // Already on screen when the page loaded: leave the real value alone.
    if (r.top < window.innerHeight && r.bottom > 0) return;

    el.textContent = `0${suffix}`;
    let stop: (() => void) | undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const controls = animate(0, target, {
          duration: 1.4,
          ease: [0.22, 1, 0.36, 1],
          onUpdate: (v) => {
            el.textContent = `${Math.round(v)}${suffix}`;
          },
        });
        stop = () => controls.stop();
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      stop?.();
      el.textContent = value;
    };
  }, [value]);

  const digits = match ? match[1].length + match[2].length : value.length;
  return (
    <span className={className}>
      <span className="sr-only">{value}</span>
      <span
        ref={ref}
        aria-hidden
        className="inline-block text-left tabular-nums"
        style={{ minWidth: `${digits * 0.62}em` }}
      >
        {value}
      </span>
    </span>
  );
}
