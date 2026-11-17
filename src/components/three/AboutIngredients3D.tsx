'use client';

import { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { INGREDIENTS, OVERHANG, type Ingredient, type SceneInput } from '../about/ingredients';

/*
 * Procedural 3D ingredients (basil, tomato, mushroom, chilli, olive) that
 * float around the About photo. Built from primitives in code: no model or
 * texture downloads. The canvas is transparent and ignores the pointer; the
 * parent feeds pointer and scroll position in through `input`.
 */

const C = {
  basil: '#3f7d36',
  basilLight: '#7fb26a',
  tomato: '#c8361f',
  tomatoFlesh: '#ef6a4b',
  tomatoCore: '#f7a48c',
  seed: '#f5d37a',
  capTop: '#9b6a42',
  capUnder: '#e6cfa8',
  stem: '#f2e3c8',
  chilli: '#c42d18',
  chilliStem: '#3f6b3a',
  olive: '#221c18',
};

function Basil() {
  const geom = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, -0.5);
    s.bezierCurveTo(0.36, -0.3, 0.32, 0.3, 0, 0.56);
    s.bezierCurveTo(-0.32, 0.3, -0.36, -0.3, 0, -0.5);
    const g = new THREE.ExtrudeGeometry(s, { depth: 0.02, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 2, curveSegments: 24 });
    // Curl the leaf a little so it catches light like a real one.
    const pos = g.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      pos.setZ(i, pos.getZ(i) + x * x * 0.9 - y * 0.08);
    }
    g.computeVertexNormals();
    return g;
  }, []);
  return (
    <group>
      <mesh geometry={geom}>
        <meshStandardMaterial color={C.basil} roughness={0.45} />
      </mesh>
      <mesh position={[0, 0.02, 0.05]}>
        <cylinderGeometry args={[0.012, 0.012, 0.95, 6]} />
        <meshStandardMaterial color={C.basilLight} roughness={0.5} />
      </mesh>
    </group>
  );
}

function Tomato() {
  return (
    <group rotation={[Math.PI / 2, 0, 0]}>
      <mesh>
        <cylinderGeometry args={[0.42, 0.42, 0.08, 40]} />
        <meshStandardMaterial color={C.tomato} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.041, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.004, 40]} />
        <meshStandardMaterial color={C.tomatoFlesh} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0.044, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.004, 20]} />
        <meshStandardMaterial color={C.tomatoCore} roughness={0.3} />
      </mesh>
      {[0, 1, 2, 3, 4].map((i) => {
        const a = (i / 5) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.21, 0.05, Math.sin(a) * 0.21]} scale={[1, 0.4, 1.6]} rotation={[0, -a, 0]}>
            <sphereGeometry args={[0.035, 8, 6]} />
            <meshStandardMaterial color={C.seed} roughness={0.4} />
          </mesh>
        );
      })}
    </group>
  );
}

function Mushroom() {
  return (
    <group>
      <mesh position={[0, 0.12, 0]}>
        <sphereGeometry args={[0.38, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={C.capTop} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.12, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.38, 32]} />
        <meshStandardMaterial color={C.capUnder} roughness={0.8} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.1, 0.13, 0.44, 20]} />
        <meshStandardMaterial color={C.stem} roughness={0.8} />
      </mesh>
    </group>
  );
}

function Chilli() {
  const geom = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.45, 0.25, 0),
      new THREE.Vector3(-0.1, 0.12, 0.05),
      new THREE.Vector3(0.25, -0.1, 0),
      new THREE.Vector3(0.45, -0.42, -0.05),
    ]);
    const g = new THREE.TubeGeometry(curve, 48, 0.1, 14, false);
    // Taper the pod toward its tip.
    const pos = g.attributes.position as THREE.BufferAttribute;
    const segs = 49;
    const ring = 15;
    for (let s = 0; s < segs; s++) {
      const t = s / (segs - 1);
      const center = curve.getPoint(t);
      const k = t < 0.1 ? 0.75 + t * 2.5 : 1 - Math.pow(Math.max(0, t - 0.35) / 0.65, 1.6) * 0.92;
      for (let r = 0; r < ring; r++) {
        const i = s * ring + r;
        pos.setXYZ(
          i,
          center.x + (pos.getX(i) - center.x) * k,
          center.y + (pos.getY(i) - center.y) * k,
          center.z + (pos.getZ(i) - center.z) * k,
        );
      }
    }
    g.computeVertexNormals();
    return g;
  }, []);
  return (
    <group>
      <mesh geometry={geom}>
        <meshStandardMaterial color={C.chilli} roughness={0.22} metalness={0.05} />
      </mesh>
      <mesh position={[-0.5, 0.29, 0]} rotation={[0, 0, Math.PI / 3]}>
        <coneGeometry args={[0.1, 0.12, 12]} />
        <meshStandardMaterial color={C.chilliStem} roughness={0.5} />
      </mesh>
      <mesh position={[-0.6, 0.36, 0]} rotation={[0, 0, Math.PI / 4]}>
        <cylinderGeometry args={[0.025, 0.03, 0.18, 8]} />
        <meshStandardMaterial color={C.chilliStem} roughness={0.5} />
      </mesh>
    </group>
  );
}

function Olive() {
  return (
    <mesh>
      <torusGeometry args={[0.16, 0.09, 14, 28]} />
      <meshStandardMaterial color={C.olive} roughness={0.2} metalness={0.15} />
    </mesh>
  );
}

const ART = { basil: Basil, tomato: Tomato, mushroom: Mushroom, chilli: Chilli, olive: Olive };
const SCALE = { basil: 0.5, tomato: 0.58, mushroom: 0.6, chilli: 0.56, olive: 0.7 };

function Floater({ item, index, input }: { item: Ingredient; index: number; input: React.RefObject<SceneInput> }) {
  const ref = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  const span = 100 + OVERHANG * 2;
  const baseX = ((item.x + OVERHANG) / span - 0.5) * viewport.width;
  const baseY = (0.5 - (item.y + OVERHANG) / span) * viewport.height;
  const z = (item.depth - 0.5) * 1.6;
  const scale = SCALE[item.kind] * (0.7 + item.depth * 0.45);
  const Art = ART[item.kind];
  const phase = index * 1.37;

  useFrame((state) => {
    const g = ref.current;
    if (!g) return;
    const t = state.clock.elapsedTime * 0.8 + phase;
    const { px, py, scroll } = input.current;
    const d = 0.35 + item.depth;
    // Float + scroll-linked lift (nearer = faster) + pointer parallax.
    const tx = baseX + Math.sin(t * 0.6) * 0.06 + px * 0.22 * d;
    const ty = baseY + Math.sin(t) * 0.1 + (0.5 - scroll) * -0.9 * d - py * 0.18 * d;
    g.position.x += (tx - g.position.x) * 0.08;
    g.position.y += (ty - g.position.y) * 0.08;
    // Tilt and turn within a range that keeps each piece facing the camera.
    g.rotation.x = Math.sin(t * 0.7) * 0.3 + (scroll - 0.5) * 1.1 + py * 0.3;
    g.rotation.y = Math.sin(t * 0.45) * 0.55 + (scroll - 0.5) * 1.4 + px * 0.45;
    g.rotation.z = (item.rot * Math.PI) / 180 + Math.sin(t * 0.5) * 0.2;
  });

  return (
    <group ref={ref} position={[baseX, baseY, z]} scale={scale}>
      <Art />
    </group>
  );
}

export default function AboutIngredients3D({
  active,
  input,
  onReady,
}: {
  active: boolean;
  input: React.RefObject<SceneInput>;
  onReady?: () => void;
}) {
  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 8], fov: 35 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
      onCreated={() => onReady?.()}
      style={{ pointerEvents: 'none' }}
      aria-hidden
    >
      <ambientLight intensity={0.7} color="#fff3dc" />
      <hemisphereLight args={['#fff4dc', '#7a5a3a', 0.7]} />
      <directionalLight position={[4, 6, 6]} intensity={1.6} color="#fff1d6" />
      <directionalLight position={[-5, -2, 3]} intensity={0.6} color="#ffc48a" />
      {INGREDIENTS.map((item, i) => (
        <Floater key={i} item={item} index={i} input={input} />
      ))}
    </Canvas>
  );
}
