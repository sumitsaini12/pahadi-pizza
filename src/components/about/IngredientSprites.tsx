'use client';

import { motion, useTransform, type MotionValue } from 'framer-motion';
import { INGREDIENTS, type Ingredient, type IngredientKind } from './ingredients';
import styles from './about.module.css';

/** Small hand-drawn SVG ingredients: the 2.5D fallback for the WebGL scene. */
function Art({ kind }: { kind: IngredientKind }) {
  switch (kind) {
    case 'basil':
      return (
        <svg viewBox="0 0 64 64" className="h-full w-full">
          <defs>
            <linearGradient id="ab-basil" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#6fa35d" />
              <stop offset="1" stopColor="#2f6b2c" />
            </linearGradient>
          </defs>
          <path d="M32 4 C50 14 54 40 32 60 C10 40 14 14 32 4Z" fill="url(#ab-basil)" />
          <path d="M32 8 L32 56 M32 22 L42 16 M32 32 L44 26 M32 42 L42 37 M32 22 L22 16 M32 32 L20 26 M32 42 L22 37" stroke="#cfe3bf" strokeOpacity="0.55" strokeWidth="1.6" strokeLinecap="round" fill="none" />
        </svg>
      );
    case 'tomato':
      return (
        <svg viewBox="0 0 64 64" className="h-full w-full">
          <circle cx="32" cy="32" r="29" fill="#c8361f" />
          <circle cx="32" cy="32" r="23" fill="#ef6a4b" />
          <circle cx="32" cy="32" r="6" fill="#f7a48c" />
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse key={a} cx="32" cy="17" rx="5" ry="7" fill="#c8361f" opacity="0.55" transform={`rotate(${a} 32 32)`} />
          ))}
          <ellipse cx="22" cy="20" rx="7" ry="3" fill="#fff" opacity="0.35" transform="rotate(-35 22 20)" />
        </svg>
      );
    case 'mushroom':
      return (
        <svg viewBox="0 0 64 64" className="h-full w-full">
          <path d="M6 32 C6 14 58 14 58 32 C58 36 6 36 6 32Z" fill="#a8744a" />
          <path d="M10 31 C14 20 50 20 54 31" stroke="#c99a6e" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M24 34 L22 56 C22 60 42 60 42 56 L40 34Z" fill="#f2e3c8" />
          <path d="M26 36 L25 54" stroke="#d9c4a0" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'chilli':
      return (
        <svg viewBox="0 0 64 64" className="h-full w-full">
          <path d="M14 14 C30 18 44 30 52 56 C40 46 22 34 12 20Z" fill="#c8361f" />
          <path d="M18 18 C30 22 40 32 46 46" stroke="#f08a6e" strokeWidth="2.4" fill="none" strokeLinecap="round" opacity="0.7" />
          <path d="M14 14 C10 10 8 6 12 4 M12 20 C9 18 9 13 14 14" stroke="#3f6b3a" strokeWidth="4" fill="#3f6b3a" strokeLinecap="round" />
        </svg>
      );
    case 'olive':
      return (
        <svg viewBox="0 0 64 64" className="h-full w-full">
          <circle cx="32" cy="32" r="26" fill="#2a2420" />
          <circle cx="32" cy="32" r="10" fill="#f8f0e1" />
          <ellipse cx="22" cy="20" rx="6" ry="3" fill="#fff" opacity="0.25" transform="rotate(-35 22 20)" />
        </svg>
      );
  }
}

function Sprite({ item, index, scroll, animate }: { item: Ingredient; index: number; scroll: MotionValue<number>; animate: boolean }) {
  // Nearer ingredients travel further while scrolling: cheap depth parallax.
  const travel = 18 + item.depth * 46;
  const y = useTransform(scroll, [0, 1], [travel, -travel]);
  return (
    <motion.div
      aria-hidden
      style={{ left: `${item.x}%`, top: `${item.y}%`, width: `${item.size}%`, y: animate ? y : 0 }}
      className="absolute -translate-x-1/2 -translate-y-1/2"
    >
      <div
        className={`aspect-square drop-shadow-[0_10px_12px_rgba(42,28,19,0.28)] ${animate ? styles.sprite : ''}`}
        style={{
          ['--r' as string]: `${item.rot}deg`,
          ['--d' as string]: `${6 + (index % 3) * 1.4}s`,
          ['--delay' as string]: `${-index * 0.9}s`,
          transform: `rotate(${item.rot}deg)`,
        }}
      >
        <Art kind={item.kind} />
      </div>
    </motion.div>
  );
}

export default function IngredientSprites({ scroll, animate, hidden }: { scroll: MotionValue<number>; animate: boolean; hidden: boolean }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 transition-opacity duration-700 ${hidden ? 'opacity-0' : 'opacity-100'}`}
    >
      {INGREDIENTS.map((item, i) => (
        <Sprite key={i} item={item} index={i} scroll={scroll} animate={animate} />
      ))}
    </div>
  );
}
