'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import CanvasBoundary from './CanvasBoundary';

const Pizza3D = dynamic(() => import('./Pizza3D'), { ssr: false });

function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

/**
 * Hero centrepiece. A real pizza photo renders first inside a fixed square
 * (no layout shift, good LCP). On larger screens with motion allowed, the
 * WebGL pizza is loaded once the browser is idle and fades in on top.
 */
export default function HeroVisual() {
  const box = useRef<HTMLDivElement>(null);
  const [want3D, setWant3D] = useState(false);
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const wide = window.matchMedia('(min-width: 768px)');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!wide.matches || reduce.matches || !hasWebGL()) return;

    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    const load = () => setWant3D(true);
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(load, { timeout: 2500 });
      return () => w.cancelIdleCallback?.(id);
    }
    const t = window.setTimeout(load, 1200);
    return () => window.clearTimeout(t);
  }, []);

  // Pause rendering while the hero is off screen.
  useEffect(() => {
    if (!box.current) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: '100px' });
    io.observe(box.current);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={box} className="relative mx-auto aspect-square w-full max-w-[620px]">
      {/* Glow plate */}
      <div aria-hidden className="absolute inset-[8%] rounded-full bg-[radial-gradient(circle,rgba(255,138,60,0.45),rgba(200,54,31,0.15)_45%,transparent_70%)]" />

      {/* Poster: real photo, slowly rotating like a pizza on a peel */}
      <div
        className={`absolute inset-[12%] transition-opacity duration-700 ${ready ? 'opacity-0' : 'opacity-100'}`}
        aria-hidden={ready}
      >
        <div className="relative h-full w-full overflow-hidden rounded-full shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8),0_0_0_10px_rgba(212,145,74,0.25)] animate-spin-slow">
          <Image
            src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=1000"
            alt="A freshly baked Pahadi Pizza topped with melted cheese and vegetables"
            fill
            priority
            /* Hidden below md (the hero shows a small photo there), so phones fetch only the tiniest candidate. */
            sizes="(min-width: 1024px) 460px, (min-width: 768px) 50vw, 1px"
            className="object-cover scale-[1.35]"
          />
        </div>
      </div>

      {want3D && (
        <div className={`absolute inset-[-6%] transition-opacity duration-1000 ${ready ? 'opacity-100' : 'opacity-0'}`}>
          <CanvasBoundary
            onError={() => {
              setReady(false);
              setWant3D(false);
            }}
          >
            <Pizza3D active={visible} onReady={() => setReady(true)} />
          </CanvasBoundary>
        </div>
      )}
    </div>
  );
}
