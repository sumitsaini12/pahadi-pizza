'use client';

import { useCallback, useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

const subscribeTo = (query: string) => (cb: () => void) => {
  const mq = window.matchMedia(query);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
};
const subscribe = subscribeTo(QUERY);

/** True when the visitor asked the OS for less motion. Server render assumes reduced motion, so nothing autoplays before hydration. */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => true,
  );
}

/** True while the media query matches. Server render assumes it does not. */
export function useMediaQuery(query: string) {
  const subscribeQuery = useCallback((cb: () => void) => subscribeTo(query)(cb), [query]);
  return useSyncExternalStore(
    subscribeQuery,
    () => window.matchMedia(query).matches,
    () => false,
  );
}
