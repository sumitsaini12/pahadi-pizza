'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Images, Instagram, Loader2, Play, Volume2, VolumeX, X } from 'lucide-react';
import EmbedFrame from './EmbedFrame';
import { formatPostDate } from './format';
import { startPlayback } from './playback';
import type { ReelItem } from './types';

type Props = {
  item: ReelItem;
  index: number;
  total: number;
  /** True once the card is near the visible part of the strip; only then does its poster (and player) load. */
  near: boolean;
  /** Phones: reels play right here in the card instead of opening the theatre. */
  inline: boolean;
  /** This card is the one playing in the strip. */
  playing: boolean;
  /** Opens the theatre (wide screens, and the keyboard fallback for curated reels on phones). */
  onOpen: () => void;
  /** Marks this card as the one playing, which stops any other. */
  onPlay: () => void;
  /** Stops this card and puts its poster back. */
  onStop: () => void;
};

/**
 * One reel in the strip: a branded 9:16 poster (4:5 for a curated photo post) with a play button, date and title.
 * Poster: the live API's own thumbnail, or, for curated posts, Instagram's official embed cropped
 * to its media frame and loaded only when the card comes near view. Until then, and behind it,
 * a branded placeholder keeps the card's size, so nothing shifts.
 *
 * On phones a reel plays inside the card on the first tap:
 * - Curated reels: once Instagram's player inside the cropped embed is ready (it posts MOUNTED), the embed itself
 *   takes the tap (our play button lets it through below 768px), so the tap lands on Instagram's own player and
 *   starts it. Instagram's player pauses on a second tap. A tap before then would be swallowed by the
 *   still-loading embed, so our button takes it instead and shows that the reel is loading.
 * - Live API reels: our own <video> plays from the tap, with sound when the browser allows it,
 *   muted with an unmute button when it does not. A second tap pauses.
 * A sideways swipe scrolls the strip and never starts a reel.
 */
export default function ReelCard({ item, index, total, near, inline, playing, onOpen, onPlay, onStop }: Props) {
  const isVideo = item.kind === 'video';
  const media = item.media;
  // For videos, and albums that open on a video, mediaUrl is an mp4, so the thumbnail is the poster.
  const poster = media ? (media.mediaType === 'IMAGE' ? media.mediaUrl : (media.thumbnailUrl ?? media.mediaUrl)) : undefined;
  const date = formatPostDate(item.date);
  /** Curated reel whose embed takes taps directly on phones. */
  const tapThrough = Boolean(item.embedUrl && isVideo);
  /** Live reel played by our own <video> inside the card on phones. */
  const ownPlayer = Boolean(inline && media && media.mediaType === 'VIDEO');

  const video = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(true);
  const [muted, setMuted] = useState(false);
  /** Instagram's player in a curated reel's embed is ready, so a tap on the card lands on it and plays. */
  const [embedReady, setEmbedReady] = useState(false);
  /** Phones: the card was tapped before the embed was ready. */
  const [waiting, setWaiting] = useState(false);
  const liveTap = tapThrough && embedReady;
  const onEmbedReady = useCallback(() => {
    setEmbedReady(true);
    setWaiting(false);
  }, []);

  // Another card started, or the card left the screen: stop this one.
  useEffect(() => {
    if (!playing) video.current?.pause();
  }, [playing]);

  const onClick = () => {
    if (ownPlayer) {
      const v = video.current;
      if (!v) return;
      if (playing && !v.paused) {
        v.pause();
        return;
      }
      // play() must run inside the tap itself, or iPhones refuse it.
      startPlayback(v, setMuted);
      onPlay();
      return;
    }
    if (inline && tapThrough && !embedReady) {
      // Instagram's player is still loading: a tap now would be lost. Say so; the card takes taps once it is ready.
      setWaiting(true);
      return;
    }
    if (inline && !isVideo) {
      // A photo has nothing to play, and phones get no details page: show it on Instagram.
      window.open(item.permalink, '_blank', 'noopener,noreferrer');
      return;
    }
    onOpen();
  };

  const showPlayIcon = !(playing && (tapThrough || !paused));
  const label = ownPlayer
    ? `${playing && !paused ? 'Pause' : 'Play'} reel: ${item.label}, ${date} (${index + 1} of ${total})`
    : `${isVideo ? 'Play reel' : inline ? 'Open post on Instagram' : 'View post'}: ${item.label}, ${date} (${index + 1} of ${total})`;

  return (
    <article className="group/card relative w-full">
      <div className={`relative overflow-hidden rounded-[1.6rem] ${item.embedUrl && !isVideo ? 'aspect-[4/5]' : 'aspect-[9/16]'} bg-espresso shadow-[0_30px_60px_-36px_rgba(22,14,10,0.75)] ring-1 ring-ink/10 transition duration-500 ease-out group-hover/card:-translate-y-1.5 group-hover/card:shadow-[0_44px_70px_-34px_rgba(22,14,10,0.8)] motion-reduce:transition-none motion-reduce:group-hover/card:translate-y-0`}>
        <Placeholder />

        {near &&
          (ownPlayer ? (
            <video
              ref={video}
              src={media!.mediaUrl}
              poster={poster}
              preload="none"
              playsInline
              loop
              onPlay={() => setPaused(false)}
              onPause={() => setPaused(true)}
              onVolumeChange={(e) => setMuted(e.currentTarget.muted)}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : poster ? (
            <Image
              src={poster}
              alt=""
              fill
              unoptimized
              sizes="(min-width: 1024px) 300px, 72vw"
              className="object-cover transition duration-700 ease-out group-hover/card:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover/card:scale-100"
            />
          ) : item.embedUrl ? (
            <EmbedFrame
              src={item.embedUrl}
              title={`${item.label}, Instagram ${isVideo ? 'reel' : 'post'} by Pahadi Pizza`}
              shape={isVideo ? 'reel' : 'post'}
              inert
              tapThrough={tapThrough}
              onReady={onEmbedReady}
            />
          ) : null)}

        <span
          aria-hidden
          className={`pointer-events-none absolute inset-0 bg-gradient-to-t from-espresso/95 via-espresso/10 to-espresso/35 transition-opacity duration-300 motion-reduce:transition-none ${
            playing ? 'opacity-0' : ''
          }`}
        />

        {/*
          The whole card is the play button. On wide screens it opens the theatre and sits above the poster, so the embed
          never takes the click. On phones it lets taps through to a curated reel's embed, so the first tap plays it.
        */}
        <button
          type="button"
          data-reel
          onClick={onClick}
          aria-label={label}
          className={`absolute inset-0 z-10 flex items-center justify-center rounded-[1.6rem] outline-none focus-visible:ring-4 focus-visible:ring-gold/80 focus-visible:ring-inset ${
            liveTap ? 'max-md:pointer-events-none' : ''
          }`}
        >
          <span
            aria-hidden
            className={`relative grid place-items-center rounded-full shadow-[0_18px_40px_-12px_rgba(200,54,31,0.75)] transition duration-300 ease-out group-hover/card:scale-110 motion-reduce:transition-none motion-reduce:group-hover/card:scale-100 ${
              isVideo ? 'h-[4.5rem] w-[4.5rem] bg-tomato text-cream' : 'h-14 w-14 bg-cream/90 text-ink backdrop-blur'
            } ${showPlayIcon ? '' : 'scale-75 opacity-0'}`}
          >
            {isVideo && <span className="absolute inset-0 rounded-full ring-2 ring-tomato/60 transition duration-500 group-hover/card:scale-125 group-hover/card:opacity-0 motion-reduce:hidden" />}
            {waiting && !embedReady ? (
              <Loader2 className="h-7 w-7 animate-spin motion-reduce:animate-none" />
            ) : isVideo ? (
              <Play className="ml-1 h-7 w-7 fill-current" />
            ) : (
              <Images className="h-6 w-6" />
            )}
          </span>
        </button>

        {waiting && !embedReady && (
          <p role="status" className="pointer-events-none absolute inset-x-0 top-[62%] z-20 text-center text-xs font-semibold text-cream">
            Loading reel… tap again in a moment
          </p>
        )}

        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-2 p-3.5">
          {playing ? (
            <button
              type="button"
              onClick={onStop}
              aria-label={`Stop reel: ${item.label}`}
              className="pointer-events-auto inline-flex h-9 items-center gap-1.5 rounded-full bg-espresso/70 pl-2.5 pr-3.5 text-[11px] font-bold uppercase tracking-[0.18em] text-cream backdrop-blur-md transition hover:bg-tomato focus-visible:outline-2 focus-visible:outline-gold"
            >
              <X className="h-4 w-4" aria-hidden />
              Stop
            </button>
          ) : (
            <span className="rounded-full bg-espresso/60 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-cream backdrop-blur-md">
              {isVideo ? 'Reel' : item.kind === 'album' ? 'Album' : 'Post'}
            </span>
          )}
          <span className="flex items-center gap-2">
            {ownPlayer && playing && muted && (
              <button
                type="button"
                onClick={() => {
                  const v = video.current;
                  if (!v) return;
                  v.muted = false;
                  if (v.paused) startPlayback(v, setMuted);
                }}
                aria-label="Turn sound on"
                className="pointer-events-auto grid h-9 w-9 place-items-center rounded-full bg-tomato text-cream shadow-lg transition hover:bg-tomato-dark focus-visible:outline-2 focus-visible:outline-gold"
              >
                <VolumeX className="h-4 w-4" aria-hidden />
              </button>
            )}
            {ownPlayer && playing && !muted && (
              <button
                type="button"
                onClick={() => {
                  if (video.current) video.current.muted = true;
                }}
                aria-label="Turn sound off"
                className="pointer-events-auto grid h-9 w-9 place-items-center rounded-full bg-espresso/60 text-cream backdrop-blur-md transition hover:bg-tomato focus-visible:outline-2 focus-visible:outline-gold"
              >
                <Volume2 className="h-4 w-4" aria-hidden />
              </button>
            )}
            <a
              href={item.permalink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open on Instagram: ${item.label}`}
              className="pointer-events-auto grid h-9 w-9 place-items-center rounded-full bg-espresso/60 text-cream backdrop-blur-md transition hover:bg-tomato focus-visible:outline-2 focus-visible:outline-gold"
            >
              <Instagram className="h-4 w-4" aria-hidden />
            </a>
          </span>
        </div>

        <div
          className={`pointer-events-none absolute inset-x-0 bottom-0 z-20 p-4 transition-opacity duration-300 motion-reduce:transition-none md:p-5 ${
            playing ? 'opacity-0' : ''
          }`}
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-light">{date}</p>
          <p className="mt-1 line-clamp-2 font-display text-lg font-semibold leading-snug text-cream md:text-xl">{item.label}</p>
        </div>
      </div>
    </article>
  );
}

/** Branded frame shown before (and under) the poster. */
function Placeholder() {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden bg-[radial-gradient(120%_80%_at_50%_0%,#3a2618_0%,#160e0a_70%)]">
      <Image src="/app-logo.png" alt="" width={160} height={160} className="absolute left-1/2 top-[38%] h-28 w-28 -translate-x-1/2 -translate-y-1/2 opacity-[0.12] grayscale" />
    </div>
  );
}
