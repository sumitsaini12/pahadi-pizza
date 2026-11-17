'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';

/** Mounts the Google Maps iframe only when it nears the viewport, inside a fixed-size frame (no layout shift). */
export default function LazyMap({ src, title }: { src: string; title: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: '300px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={box} className="relative h-full w-full bg-cream-2">
      {show ? (
        <iframe
          src={src}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={title}
          className="h-full w-full"
        />
      ) : (
        <div className="grid h-full w-full place-items-center text-muted">
          <span className="flex items-center gap-2 text-base font-semibold">
            <MapPin className="h-5 w-5 text-tomato" aria-hidden />
            Loading map…
          </span>
        </div>
      )}
    </div>
  );
}
