import { Primitive } from './types';
import vector from './vector';

const t1 = vector.makeVector(0, 0, Math.sqrt(3) * (2 / 3), 1);
const t2 = vector.makeVector(1, 0, -Math.sqrt(3) / 3, 1);
const t3 = vector.makeVector(-1, 0, -Math.sqrt(3) / 3, 1);
const t4 = vector.makeVector(0, Math.sqrt(8 / 3), 0, 1);

// 邊長為 2 的正三角錐
export const tetrahedron: Primitive = [
  { points: [t1, t2, t3], color: 'red' },
  { points: [t1, t2, t4], color: 'blue' },
  { points: [t1, t3, t4], color: 'green' },
  { points: [t2, t3, t4], color: 'yellow' },
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
  { points: [c1, c2, c3, c4], color: 'red' },
  { points: [c5, c6, c7, c8], color: 'red' },
  { points: [c1, c2, c6, c5], color: 'blue' },
  { points: [c4, c3, c7, c8], color: 'blue' },
  { points: [c1, c4, c8, c5], color: 'green' },
  { points: [c2, c3, c7, c6], color: 'green' },
];

const primitives = { tetrahedron, cube };

export default primitives;
