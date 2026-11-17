'use client';

import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';

type TiltCardProps = {
  children: React.ReactNode;
  className?: string;
  /** Maximum tilt in degrees. */
  max?: number;
  /** Classes for the moving layer, e.g. its border radius (the glare inherits it). */
  innerClassName?: string;
};

/**
 * Tilts its content toward the pointer in 3D with a soft glare highlight.
 * Only reacts to mouse/pen, so touch scrolling stays untouched.
 */
export default function TiltCard({ children, className = '', max = 8, innerClassName = '' }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spring = { stiffness: 180, damping: 18, mass: 0.4 };
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), spring);
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), spring);
  const glareX = useTransform(px, [0, 1], ['0%', '100%']);
  const glareY = useTransform(py, [0, 1], ['0%', '100%']);
  const glare = useTransform(
    [glareX, glareY],
    ([x, y]) => `radial-gradient(circle at ${x} ${y}, rgba(255,240,210,0.28), transparent 55%)`,
  );

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType === 'touch' || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <div style={{ perspective: 1100 }} className={className}>
      <motion.div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={reduce ? undefined : { rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className={`relative h-full will-change-transform ${innerClassName}`}
      >
        {children}
        {!reduce && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 [div:hover>&]:opacity-100"
            style={{ backgroundImage: glare }}
          />
        )}
      </motion.div>
    </div>
  );
}
