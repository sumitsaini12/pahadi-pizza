'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Height of the account bar Instagram draws above the media in its embed.
 * Below it the media is always 1.25 times the embed's width (a 4:5 frame), at any width.
 */
const HEADER_PX = 54;

/**
 * Reels play as a 9:16 video in the middle of that 4:5 frame, with black bars and soft edges around it.
 * For a reel the frame is scaled up so the video alone fills a 9:16 box:
 * the embed is drawn 1.56 times wider than the box and centred, which also trims the soft edges.
 */
const REEL_SCALE = 1.56;

function frameStyle(shape: 'reel' | 'post') {
  if (shape === 'post') return { top: -HEADER_PX, left: 0, width: '100cqw', height: `calc(${HEADER_PX}px + 125cqw + 260px)` };
  const width = REEL_SCALE * 100;
  const mediaHeight = width * 1.25;
  const cropY = (mediaHeight - (16 / 9) * 100) / 2;
  return {
    top: `calc(${-HEADER_PX}px - ${cropY.toFixed(2)}cqw)`,
    left: `${(-(width - 100) / 2).toFixed(2)}cqw`,
    width: `${width.toFixed(2)}cqw`,
    height: `calc(${HEADER_PX}px + ${mediaHeight.toFixed(2)}cqw + 260px)`,
  };
}

type Props = {
  src: string;
  title: string;
  /** Poster mode: the frame is decoration under our own card button, so it takes no clicks or focus. */
  inert?: boolean;
  /** 'reel' fills a 9:16 parent with the video alone; 'post' fills a 4:5 parent with the photo. */
  shape?: 'reel' | 'post';
  /**
   * Phones only (below 768px): the frame takes taps even in poster mode, so a tap lands on Instagram's own
   * play button and starts the reel at once. Keyboard and screen readers still use our card button.
   * The frame only takes taps once Instagram's player is ready; until then our card button takes them.
   */
  tapThrough?: boolean;
  className?: string;
  /** Called once Instagram's player inside the frame is ready to take a tap. Keep it stable (useCallback). */
  onReady?: () => void;
};

/** If Instagram ever stops announcing that its player mounted, treat the frame as ready this long after it loads. */
const READY_FALLBACK_MS = 6000;

/** Instagram's embed posts `{type: 'MOUNTED'}` to the page once its player script has started. */
function isMounted(data: unknown) {
  let d = data;
  if (typeof d === 'string') {
    try {
      d = JSON.parse(d);
    } catch {
      return false;
    }
  }
  return typeof d === 'object' && d !== null && (d as { type?: unknown }).type === 'MOUNTED';
}

/**
 * Instagram's official embed, cropped to just its media.
 * The account bar, captions and footer are cut away by the parent's overflow;
 * the attribution and a link to the post are shown by our own UI around it.
 * The parent must be a 9:16 box for a reel and a 4:5 box for a post.
 */
export default function EmbedFrame({ src, title, inert, shape = 'post', tapThrough, className = '', onReady }: Props) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [loaded, setLoaded] = useState(false);
  // The frame's own load event fires while Instagram still shows a static picture: a tap then focuses the frame
  // but plays nothing. Its player is only ready once Instagram posts MOUNTED.
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.source && e.source === frame.current?.contentWindow && isMounted(e.data)) setReady(true);
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  useEffect(() => {
    if (!loaded || ready) return;
    const t = window.setTimeout(() => setReady(true), READY_FALLBACK_MS);
    return () => window.clearTimeout(t);
  }, [loaded, ready]);

  useEffect(() => {
    if (ready) onReady?.();
  }, [ready, onReady]);

  return (
    <div className={`absolute inset-0 overflow-hidden [container-type:inline-size] ${className}`}>
      <iframe
        ref={frame}
        src={src}
        title={title}
        scrolling="no"
        allow="autoplay; encrypted-media; picture-in-picture; clipboard-write; fullscreen"
        allowFullScreen
        onLoad={() => setLoaded(true)}
        tabIndex={inert ? -1 : undefined}
        aria-hidden={inert || undefined}
        data-ready={ready || undefined}
        className={`absolute max-w-none border-0 transition-opacity duration-500 ${ready ? 'opacity-100' : 'opacity-0'} ${
          inert ? `pointer-events-none ${tapThrough && ready ? 'max-md:pointer-events-auto' : ''}` : ''
        }`}
        style={frameStyle(shape)}
      />
    </div>
  );
}
