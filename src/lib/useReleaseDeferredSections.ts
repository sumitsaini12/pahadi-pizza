'use client';

import { useEffect } from 'react';

/**
 * Sections marked `.cv-auto` skip offscreen layout, paint and image loading
 * while the first screen renders. Smooth in-page jumps need real heights, so
 * the skip is switched off on the first touch, key, scroll or wheel, or
 * shortly after load, whichever comes first.
 */
export function useReleaseDeferredSections() {
  useEffect(() => {
    const root = document.documentElement;
    const events = ['pointerdown', 'touchstart', 'keydown', 'wheel', 'scroll'] as const;
    let timer: number | undefined;
    const release = () => {
      root.classList.add('cv-off');
      events.forEach((e) => window.removeEventListener(e, release, true));
      window.clearTimeout(timer);
    };
    events.forEach((e) => window.addEventListener(e, release, { capture: true, passive: true, once: true }));
    const arm = () => {
      timer = window.setTimeout(release, 2500);
    };
    if (document.readyState === 'complete') arm();
    else window.addEventListener('load', arm, { once: true });
    return () => {
      events.forEach((e) => window.removeEventListener(e, release, true));
      window.removeEventListener('load', arm);
      window.clearTimeout(timer);
    };
  }, []);
}
