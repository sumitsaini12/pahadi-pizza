'use client';

import { useState } from 'react';

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
  className?: string;
};

/**
 * Instagram's official embed, cropped to just its media.
 * The account bar, captions and footer are cut away by the parent's overflow;
 * the attribution and a link to the post are shown by our own UI around it.
 * The parent must be a 9:16 box for a reel and a 4:5 box for a post.
 */
export default function EmbedFrame({ src, title, inert, shape = 'post', className = '' }: Props) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={`absolute inset-0 overflow-hidden [container-type:inline-size] ${className}`}>
      <iframe
        src={src}
        title={title}
        scrolling="no"
        allow="autoplay; encrypted-media; picture-in-picture; clipboard-write; fullscreen"
        allowFullScreen
        onLoad={() => setLoaded(true)}
        tabIndex={inert ? -1 : undefined}
        aria-hidden={inert || undefined}
        className={`absolute max-w-none border-0 transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'} ${
          inert ? 'pointer-events-none' : ''
        }`}
        style={frameStyle(shape)}
      />
    </div>
  );
}
