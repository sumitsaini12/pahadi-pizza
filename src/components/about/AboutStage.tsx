'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import CanvasBoundary from '../three/CanvasBoundary';
import { OVERHANG, type SceneInput } from './ingredients';
import IngredientSprites from './IngredientSprites';
import StatCounter from './StatCounter';
import usePrefersReducedMotion from './usePrefersReducedMotion';
import styles from './about.module.css';

const AboutIngredients3D = dynamic(() => import('../three/AboutIngredients3D'), { ssr: false });

function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

type StageProps = {
  image: string;
  imageAlt: string;
  badgeValue: string;
  badgeText: string;
};

/**
 * A layered "Kumaon foothills" diorama around the story photo.
 *
 * Back to front: morning sky and sun, misty far ridges, the photo inside an
 * arched frame, a pine-covered near ridge the arch sits behind, the stat
 * plaque, then the floating ingredients. Pointer movement tilts the whole
 * stage in 3D and scrolling slides the layers at different speeds.
 *
 * Everyone gets the 2.5D version (CSS transforms + SVG). On wider screens,
 * with motion allowed and WebGL available, real 3D ingredients load once the
 * section is near the viewport and replace the SVG ones.
 */
export default function AboutStage({ image, imageAlt, badgeValue, badgeText }: StageProps) {
  const stage = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({ target: stage, offset: ['start end', 'end start'] });
  const skyY = useTransform(scrollYProgress, [0, 1], ['-4%', '4%']);
  const farY = useTransform(scrollYProgress, [0, 1], ['8%', '-2%']);
  const midY = useTransform(scrollYProgress, [0, 1], ['12%', '-4%']);
  const photoY = useTransform(scrollYProgress, [0, 1], ['-5%', '5%']);
  const nearY = useTransform(scrollYProgress, [0, 1], ['6%', '-6%']);
  const sunY = useTransform(scrollYProgress, [0, 1], ['30%', '-20%']);

  // Pointer tilt (mouse and pen only, so touch scrolling is untouched).
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spring = { stiffness: 120, damping: 18, mass: 0.5 };
  const rotateY = useSpring(useTransform(px, [-1, 1], [-7, 7]), spring);
  const rotateX = useSpring(useTransform(py, [-1, 1], [6, -6]), spring);
  const shiftFar = useSpring(useTransform(px, [-1, 1], [10, -10]), spring);
  const shiftNear = useSpring(useTransform(px, [-1, 1], [-14, 14]), spring);

  // Values the WebGL scene reads every frame, without React re-renders.
  const sceneInput = useRef<SceneInput>({ px: 0, py: 0, scroll: 0.5 });
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    sceneInput.current.scroll = v;
  });

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType === 'touch' || !stage.current) return;
    const r = stage.current.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 2 - 1;
    const y = ((e.clientY - r.top) / r.height) * 2 - 1;
    px.set(x);
    py.set(y);
    sceneInput.current.px = x;
    sceneInput.current.py = y;
  };
  const onLeave = () => {
    px.set(0);
    py.set(0);
    sceneInput.current.px = 0;
    sceneInput.current.py = 0;
  };

  // Pause the 3D layer whenever the stage is off screen.
  const [want3D, setWant3D] = useState(false);
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: '100px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Load it only after the visitor has started scrolling and the stage is
  // close, then wait for an idle moment, so it never competes with the
  // initial page load or the hero.
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    if (!window.matchMedia('(min-width: 768px)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    let idle: number | undefined;
    let near = false;
    let scrolled = false;
    const tryLoad = () => {
      if (!near || !scrolled || idle !== undefined) return;
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      const go = () => {
        if (hasWebGL()) setWant3D(true);
      };
      idle = w.requestIdleCallback ? w.requestIdleCallback(go, { timeout: 1500 }) : window.setTimeout(go, 300);
    };
    const onScroll = () => {
      scrolled = true;
      tryLoad();
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        near = entry.isIntersecting;
        tryLoad();
      },
      { rootMargin: '200px 0px' },
    );
    io.observe(el);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      if (idle !== undefined) {
        if (w.cancelIdleCallback) w.cancelIdleCallback(idle);
        else window.clearTimeout(idle);
      }
    };
  }, []);

  const motionOn = !reduce;

  return (
    <div style={{ perspective: 1400 }} className="relative mx-auto w-full max-w-[560px]">
      <motion.div
        ref={stage}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={motionOn ? { rotateX, rotateY, transformStyle: 'preserve-3d' } : undefined}
        className="relative aspect-[4/5] w-full"
      >
        {/* Backdrop: sky, sun and far ridges, clipped to the card. */}
        <div className="absolute inset-0 overflow-hidden rounded-[2.5rem] bg-gradient-to-b from-[#fde9c8] via-[#f8dcb4] to-[#efd2a6] shadow-[0_50px_90px_-40px_rgba(42,28,19,0.55)] ring-1 ring-bark/10">
          <motion.div style={motionOn ? { y: skyY } : undefined} aria-hidden className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_18%,rgba(255,214,150,0.9),transparent_55%)]" />
          </motion.div>
          <motion.div
            aria-hidden
            style={motionOn ? { y: sunY } : undefined}
            className="absolute right-[14%] top-[9%] h-[22%] w-auto aspect-square rounded-full bg-[radial-gradient(circle,#fff6df_0%,#ffd98f_45%,rgba(255,190,110,0)_72%)]"
          />

          {/* Far ridge with snow caps */}
          <motion.svg
            aria-hidden
            style={motionOn ? { y: farY, x: shiftFar } : undefined}
            className="absolute inset-x-[-6%] bottom-[34%] h-[38%] w-[112%]"
            viewBox="0 0 600 200"
            preserveAspectRatio="none"
          >
            <path fill="#c3c6b0" d="M0 150 L60 92 L110 120 L180 48 L240 108 L300 70 L360 116 L430 36 L500 104 L560 74 L600 96 L600 200 L0 200Z" />
            <path fill="#fffaf0" opacity="0.85" d="M180 48 L164 66 L174 64 L182 72 L192 62 L198 66Z M430 36 L412 56 L424 53 L432 61 L443 51 L450 55Z M300 70 L289 82 L298 80 L304 86 L311 79Z" />
          </motion.svg>
          <div aria-hidden className={`absolute inset-x-[-10%] bottom-[36%] h-[10%] bg-gradient-to-b from-transparent via-[#fbeedd]/80 to-transparent blur-md ${motionOn ? styles.mist : ''}`} />

          {/* Mid ridge */}
          <motion.svg
            aria-hidden
            style={motionOn ? { y: midY } : undefined}
            className="absolute inset-x-[-6%] bottom-[20%] h-[32%] w-[112%]"
            viewBox="0 0 600 200"
            preserveAspectRatio="none"
          >
            <path fill="#9fb488" d="M0 120 C60 80 110 70 160 96 C210 120 250 60 320 58 C390 56 420 110 480 100 C530 92 570 70 600 78 L600 200 L0 200Z" />
            <path fill="#8aa474" d="M0 160 C80 120 150 140 220 130 C300 118 360 150 440 136 C510 124 560 140 600 132 L600 200 L0 200Z" />
          </motion.svg>
        </div>

        {/* The photo, in an arched window that floats above the backdrop. */}
        <motion.div
          style={motionOn ? { y: photoY, z: 30 } : undefined}
          className="absolute left-[21%] right-[21%] top-[11%] bottom-[19%]"
        >
          <div className="relative h-full w-full overflow-hidden rounded-t-[999px] rounded-b-[1.75rem] border-[6px] border-cream bg-espresso shadow-[0_30px_60px_-25px_rgba(42,28,19,0.7)]">
            <Image src={image} alt={imageAlt} fill sizes="(min-width: 1024px) 340px, 60vw" className="scale-[1.08] object-cover" />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-espresso/40 via-transparent to-transparent" />
          </div>
        </motion.div>

        {/* Near ridge with pines: the arch sits behind it. */}
        <motion.div
          aria-hidden
          style={motionOn ? { y: nearY, x: shiftNear, z: 40, scale: 0.972 } : undefined}
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[30%] overflow-hidden rounded-b-[2.5rem]"
        >
          <svg className="absolute inset-x-[-4%] bottom-0 h-full w-[108%]" viewBox="0 0 600 180" preserveAspectRatio="none">
            <path fill="#5f8a55" d="M0 70 C70 40 130 64 200 58 C280 50 330 86 410 74 C480 62 540 44 600 56 L600 180 L0 180Z" />
            <path fill="#3f6b3a" d="M0 110 C90 86 160 112 260 100 C360 88 430 118 520 104 C560 98 585 96 600 98 L600 180 L0 180Z" />
            <g fill="#2c4d29">
              <path d="M28 104 L44 52 L60 104Z" />
              <path d="M52 108 L72 36 L92 108Z" />
              <path d="M520 102 L538 44 L556 102Z" />
              <path d="M548 104 L564 60 L580 104Z" />
              <path d="M470 108 L484 70 L498 108Z" />
            </g>
          </svg>
        </motion.div>

        {/* Stat plaque, docked on the near ridge. */}
        <motion.div
          style={motionOn ? { z: 70 } : undefined}
          className="absolute bottom-[5%] left-[6%] flex max-w-[64%] items-center gap-3 rounded-2xl border border-bark/10 bg-cream/95 py-3 pl-4 pr-5 shadow-[0_24px_50px_-22px_rgba(42,28,19,0.65)] backdrop-blur sm:gap-4 sm:py-4 sm:pl-5 sm:pr-6"
        >
          <StatCounter value={badgeValue} className="font-display text-4xl font-semibold leading-none text-tomato sm:text-5xl" />
          <span aria-hidden className="h-10 w-px shrink-0 bg-bark/15" />
          <p className="text-xs font-semibold leading-snug text-ink/80 sm:text-sm">{badgeText}</p>
        </motion.div>

        {/* Floating ingredients: SVG for everyone, swapped for WebGL when it is ready. */}
        <motion.div aria-hidden style={motionOn ? { z: 90 } : undefined} className="pointer-events-none absolute inset-0">
          <IngredientSprites scroll={scrollYProgress} animate={motionOn} hidden={ready} />
          {want3D && (
            <div
              className={`absolute transition-opacity duration-700 ${ready ? 'opacity-100' : 'opacity-0'}`}
              style={{ inset: `-${OVERHANG}%` }}
            >
              <CanvasBoundary
                onError={() => {
                  setReady(false);
                  setWant3D(false);
                }}
              >
                <AboutIngredients3D active={visible} input={sceneInput} onReady={() => setReady(true)} />
              </CanvasBoundary>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
