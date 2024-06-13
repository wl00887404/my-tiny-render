import { Primitive, Color } from './types';
import vector from './vector';

const red: Color = [1, 0, 0];
const orange: Color = [1, 0.6509803921568628, 0];
const yellow: Color = [1, 1, 0];
const green: Color = [0, 0.5019607843137255, 0];
const blue: Color = [0, 0, 1];
const purple: Color = [
  0.5019607843137255, 0.011764705882352941, 0.5019607843137255,
];

const t1 = vector.makeVector(0, 0, Math.sqrt(3) * (2 / 3), 1);
const t2 = vector.makeVector(1, 0, -Math.sqrt(3) / 3, 1);
const t3 = vector.makeVector(-1, 0, -Math.sqrt(3) / 3, 1);
const t4 = vector.makeVector(0, Math.sqrt(8 / 3), 0, 1);

// 邊長為 2 的正三角錐
export const tetrahedron: Primitive = [
  { points: [t1, t2, t3], color: red },
  { points: [t1, t2, t4], color: blue },
  { points: [t1, t3, t4], color: green },
  { points: [t2, t3, t4], color: yellow },
];

const c1 = vector.makeVector(1, -1, 1, 1);
const c2 = vector.makeVector(-1, -1, 1, 1);
const c3 = vector.makeVector(-1, -1, -1, 1);
const c4 = vector.makeVector(1, -1, -1, 1);

const c5 = vector.makeVector(1, 1, 1, 1);
const c6 = vector.makeVector(-1, 1, 1, 1);
const c7 = vector.makeVector(-1, 1, -1, 1);
const c8 = vector.makeVector(1, 1, -1, 1);

// 邊長為 2 的 正方體
export const cube: Primitive = [
  { points: [c1, c2, c3, c4], color: red }, // 1
  { points: [c5, c6, c7, c8], color: purple }, // 6
  { points: [c1, c2, c6, c5], color: orange }, // 2
  { points: [c4, c3, c7, c8], color: blue }, // 5
  { points: [c1, c4, c8, c5], color: yellow }, // 3
  { points: [c2, c3, c7, c6], color: green }, // 4
];

const primitives = { tetrahedron, cube };

export default primitives;
