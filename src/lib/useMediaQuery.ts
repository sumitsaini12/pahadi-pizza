'use client';

import { useSyncExternalStore } from 'react';

/**
 * Subscribes to a CSS media query. Returns false on the server and during
 * hydration, so mobile-first markup renders first and never shifts layout.
 */
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}
