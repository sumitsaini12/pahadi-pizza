'use client';

import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/*
 * A fully procedural, veg-topped 3D pizza with floating ingredients.
 * Everything is built from primitives in code: no downloaded models or
 * textures, so there are no licensing questions and the payload stays small.
 */

const COLORS = {
  crust: '#d4914a',
  crustDark: '#a8642a',
  sauce: '#b3301a',
  cheese: '#efb440',
  cheeseLight: '#fbe39a',
  tomato: '#d9412b',
  tomatoInner: '#f07a5c',
  capsicum: '#3f8a3a',
  olive: '#1e1a17',
  corn: '#f6c628',
  paneer: '#fbf4e4',
  onion: '#b7608e',
  basil: '#2f6b2c',
};

/** Small deterministic PRNG so the pizza looks identical on every render. */
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

type Topping = { kind: keyof typeof COLORS | 'capsicumRing'; x: number; z: number; r: number; s: number };

function useToppings(): Topping[] {
  return useMemo(() => {
    const rand = rng(42);
    const list: Topping[] = [];
    const place = (kind: Topping['kind'], count: number, minR = 0.15, maxR = 1.45) => {
      for (let i = 0; i < count; i++) {
        const a = rand() * Math.PI * 2;
        const d = minR + Math.sqrt(rand()) * (maxR - minR);
        list.push({ kind, x: Math.cos(a) * d, z: Math.sin(a) * d, r: rand() * Math.PI * 2, s: 0.85 + rand() * 0.3 });
      }
    };
    place('tomato', 7, 0.3, 1.35);
    place('capsicumRing', 8);
    place('olive', 10);
    place('corn', 26);
    place('paneer', 9);
    place('onion', 6);
    place('basil', 5, 0.2, 1.2);
    return list;
  }, []);
}

function Cheese() {
  // A slightly lumpy disc of melted cheese: radial noise displaces the top surface.
  const geom = useMemo(() => {
    const g = new THREE.CircleGeometry(1.68, 96, 0, Math.PI * 2);
    const pos = g.attributes.position as THREE.BufferAttribute;
    const rand = rng(7);
    const bumps = Array.from({ length: 22 }, () => ({ x: (rand() - 0.5) * 3, y: (rand() - 0.5) * 3, h: 0.02 + rand() * 0.04 }));
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const edge = Math.hypot(x, y) / 1.68;
      let z = 0.05 * (1 - edge * edge);
      for (const b of bumps) z += b.h * Math.exp(-((x - b.x) ** 2 + (y - b.y) ** 2) * 6);
      // Wavy, dripping edge
      const ang = Math.atan2(y, x);
      const wobble = 1 + 0.035 * Math.sin(ang * 9) + 0.02 * Math.sin(ang * 23);
      pos.setXYZ(i, x * wobble, y * wobble, z);
    }
    g.computeVertexNormals();
    return g;
  }, []);
  return (
    <mesh geometry={geom} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.13, 0]}>
      <meshStandardMaterial color={COLORS.cheese} roughness={0.45} metalness={0} emissive="#5a3300" emissiveIntensity={0.12} />
    </mesh>
  );
}

function ToppingMesh({ t }: { t: Topping }) {
  const y = 0.2;
  switch (t.kind) {
    case 'tomato':
      return (
        <group position={[t.x, y, t.z]} rotation={[0, t.r, 0]} scale={t.s}>
          <mesh>
            <cylinderGeometry args={[0.2, 0.2, 0.04, 28]} />
            <meshStandardMaterial color={COLORS.tomato} roughness={0.35} />
          </mesh>
          <mesh position={[0, 0.021, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 0.005, 28]} />
            <meshStandardMaterial color={COLORS.tomatoInner} roughness={0.3} />
          </mesh>
        </group>
      );
    case 'capsicumRing':
      return (
        <mesh position={[t.x, y, t.z]} rotation={[Math.PI / 2, 0, t.r]} scale={t.s}>
          <torusGeometry args={[0.13, 0.025, 8, 24, Math.PI * 1.3]} />
          <meshStandardMaterial color={COLORS.capsicum} roughness={0.3} />
        </mesh>
      );
    case 'olive':
      return (
        <mesh position={[t.x, y, t.z]} rotation={[Math.PI / 2, 0, 0]} scale={t.s}>
          <torusGeometry args={[0.055, 0.03, 10, 20]} />
          <meshStandardMaterial color={COLORS.olive} roughness={0.25} metalness={0.1} />
        </mesh>
      );
    case 'corn':
      return (
        <mesh position={[t.x, y - 0.01, t.z]} scale={[t.s, t.s * 0.8, t.s]}>
          <sphereGeometry args={[0.045, 10, 8]} />
          <meshStandardMaterial color={COLORS.corn} roughness={0.4} />
        </mesh>
      );
    case 'paneer':
      return (
        <mesh position={[t.x, y + 0.01, t.z]} rotation={[0, t.r, 0]} scale={t.s}>
          <boxGeometry args={[0.13, 0.09, 0.13]} />
          <meshStandardMaterial color={COLORS.paneer} roughness={0.7} />
        </mesh>
      );
    case 'onion':
      return (
        <mesh position={[t.x, y, t.z]} rotation={[Math.PI / 2, 0, t.r]} scale={t.s}>
          <torusGeometry args={[0.15, 0.018, 6, 24, Math.PI]} />
          <meshStandardMaterial color={COLORS.onion} roughness={0.35} />
        </mesh>
      );
    case 'basil':
      return (
        <mesh position={[t.x, y + 0.02, t.z]} rotation={[0, t.r, 0]} scale={[t.s * 1.6, 0.15, t.s]}>
          <sphereGeometry args={[0.1, 12, 8]} />
          <meshStandardMaterial color={COLORS.basil} roughness={0.5} />
        </mesh>
      );
    default:
      return null;
  }
}

const BROWN_SPOTS: [number, number, number][] = (() => {
  const rand = rng(99);
  return Array.from({ length: 12 }, () => {
    const a = rand() * Math.PI * 2;
    const d = 0.3 + rand() * 1.2;
    return [Math.cos(a) * d, Math.sin(a) * d, 0.08 + rand() * 0.1];
  });
})();

function Pizza() {
  const group = useRef<THREE.Group>(null);
  const toppings = useToppings();

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    g.rotation.y += delta * 0.18;
    // Ease toward the pointer for a gentle parallax tilt.
    const targetX = 0.55 + state.pointer.y * 0.18;
    const targetZ = -state.pointer.x * 0.12;
    g.rotation.x += (targetX - g.rotation.x) * 0.05;
    g.rotation.z += (targetZ - g.rotation.z) * 0.05;
    g.position.y = Math.sin(state.clock.elapsedTime * 0.9) * 0.06;
  });

  return (
    <group ref={group} rotation={[0.55, 0, 0]}>
      {/* Base */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[1.95, 1.9, 0.18, 96]} />
        <meshStandardMaterial color={COLORS.crustDark} roughness={0.85} />
      </mesh>
      {/* Puffy crust rim */}
      <mesh position={[0, 0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.84, 0.17, 24, 120]} />
        <meshStandardMaterial color={COLORS.crust} roughness={0.75} emissive="#4a1d00" emissiveIntensity={0.15} />
      </mesh>
      {/* Sauce */}
      <mesh position={[0, 0.095, 0]}>
        <cylinderGeometry args={[1.74, 1.74, 0.02, 96]} />
        <meshStandardMaterial color={COLORS.sauce} roughness={0.4} />
      </mesh>
      <Cheese />
      {BROWN_SPOTS.map(([x, z, r], i) => (
        <mesh key={`b${i}`} position={[x, 0.17, z]} scale={[r, 0.12, r]}>
          <sphereGeometry args={[1, 14, 8]} />
          <meshStandardMaterial color="#cf8a2c" roughness={0.6} transparent opacity={0.55} />
        </mesh>
      ))}
      {toppings.map((t, i) => (
        <ToppingMesh key={i} t={t} />
      ))}
    </group>
  );
}

type Floater = { pos: [number, number, number]; kind: 'tomato' | 'basil' | 'olive' | 'paneer' | 'capsicum'; speed: number; phase: number };

const FLOATERS: Floater[] = [
  { pos: [-2.45, 1.35, -0.6], kind: 'basil', speed: 0.8, phase: 0 },
  { pos: [2.35, 1.55, -1], kind: 'tomato', speed: 0.7, phase: 1.2 },
  { pos: [-2.3, -1.35, 0.4], kind: 'tomato', speed: 0.9, phase: 2.1 },
  { pos: [2.3, -1.1, 0.6], kind: 'basil', speed: 0.75, phase: 0.6 },
  { pos: [0.5, 2.1, -1.4], kind: 'olive', speed: 1.1, phase: 1.7 },
  { pos: [-1.3, 2.0, -1.2], kind: 'paneer', speed: 0.95, phase: 2.8 },
  { pos: [1.5, -1.95, 0.2], kind: 'capsicum', speed: 0.85, phase: 0.3 },
];

function FloatingIngredient({ f }: { f: Floater }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime * f.speed + f.phase;
    if (!ref.current) return;
    ref.current.position.set(f.pos[0] + Math.sin(t * 0.7) * 0.12, f.pos[1] + Math.sin(t) * 0.22, f.pos[2]);
    ref.current.rotation.set(t * 0.6, t * 0.4, t * 0.3);
  });
  return (
    <group ref={ref} position={f.pos}>
      {f.kind === 'tomato' && (
        <>
          <mesh>
            <cylinderGeometry args={[0.32, 0.32, 0.07, 32]} />
            <meshStandardMaterial color={COLORS.tomato} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.036, 0]}>
            <cylinderGeometry args={[0.24, 0.24, 0.005, 32]} />
            <meshStandardMaterial color={COLORS.tomatoInner} roughness={0.3} />
          </mesh>
        </>
      )}
      {f.kind === 'basil' && (
        <mesh scale={[2.2, 0.18, 1.2]}>
          <sphereGeometry args={[0.18, 16, 12]} />
          <meshStandardMaterial color={COLORS.basil} roughness={0.45} />
        </mesh>
      )}
      {f.kind === 'olive' && (
        <mesh>
          <torusGeometry args={[0.11, 0.06, 12, 24]} />
          <meshStandardMaterial color={COLORS.olive} roughness={0.25} />
        </mesh>
      )}
      {f.kind === 'paneer' && (
        <mesh>
          <boxGeometry args={[0.26, 0.2, 0.26]} />
          <meshStandardMaterial color={COLORS.paneer} roughness={0.7} />
        </mesh>
      )}
      {f.kind === 'capsicum' && (
        <mesh>
          <torusGeometry args={[0.22, 0.045, 10, 32, Math.PI * 1.4]} />
          <meshStandardMaterial color={COLORS.capsicum} roughness={0.3} />
        </mesh>
      )}
    </group>
  );
}

export default function Pizza3D({ active = true, onReady }: { active?: boolean; onReady?: () => void }) {
  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={[1, 1.75]}
      camera={{ position: [0, 1.2, 7.2], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onCreated={() => onReady?.()}
      aria-hidden
    >
      <ambientLight intensity={0.55} color="#ffe7c2" />
      <hemisphereLight args={['#ffe2b0', '#2a120a', 0.6]} />
      <directionalLight position={[3, 6, 4]} intensity={1.9} color="#fff1d6" />
      <directionalLight position={[-4, 2, -3]} intensity={0.8} color="#ffb070" />
      <pointLight position={[0, -2.5, 1.5]} intensity={6} distance={9} color="#ff6a2a" />
      <Pizza />
      {FLOATERS.map((f, i) => (
        <FloatingIngredient key={i} f={f} />
      ))}
    </Canvas>
  );
}
