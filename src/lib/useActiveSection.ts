'use client';

import { useEffect, useState } from 'react';

/**
 * Returns the id of the section currently under the reading line
 * (just below the fixed header), for active-link highlighting.
 */
export function useActiveSection(ids: readonly string[], offset = 120) {
  const [active, setActive] = useState<string>(ids[0] ?? '');

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      let current = ids[0] ?? '';
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top - offset <= 0) current = id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [ids, offset]);

  return active;
}
