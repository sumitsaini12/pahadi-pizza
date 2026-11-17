/**
 * Where the floating ingredients sit around the photo arch. Shared by the
 * WebGL scene and the lightweight SVG fallback so both look the same.
 *
 * x / y are percentages of the stage box, depth runs 0 (far) to 1 (near) and
 * drives size and parallax strength. Positions hug the arch edges so nothing
 * covers the middle of the photo.
 */
export type IngredientKind = 'basil' | 'tomato' | 'mushroom' | 'chilli' | 'olive';

export type Ingredient = {
  kind: IngredientKind;
  x: number;
  y: number;
  depth: number;
  /** Resting rotation in degrees. */
  rot: number;
  /** Size as a percentage of the stage width (SVG fallback). */
  size: number;
};

export const INGREDIENTS: Ingredient[] = [
  { kind: 'basil', x: 11, y: 17, depth: 0.8, rot: -24, size: 15 },
  { kind: 'olive', x: 72, y: 5, depth: 0.3, rot: 0, size: 7 },
  { kind: 'tomato', x: 89, y: 23, depth: 0.6, rot: 12, size: 14 },
  { kind: 'mushroom', x: 8, y: 52, depth: 0.9, rot: -10, size: 14 },
  { kind: 'chilli', x: 87, y: 60, depth: 0.85, rot: 28, size: 17 },
  { kind: 'basil', x: 84, y: 82, depth: 1, rot: 40, size: 13 },
  { kind: 'tomato', x: 28, y: 3, depth: 0.35, rot: -8, size: 9 },
];

/** Pointer (-1..1) and scroll (0..1) values the WebGL scene reads each frame. */
export type SceneInput = { px: number; py: number; scroll: number };

/** The 3D canvas overhangs the stage by this much on every side (percent). */
export const OVERHANG = 10;
