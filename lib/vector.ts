import matrix from './matrix';
import { Vector } from './types';

export const makeVector = (
  x: number,
  y: number,
  z: number,
  w: number,
): Vector => {
  const result = [[x], [y], [z]];

  if (w !== undefined) result.push([w]);

  return result;
};

export const add: (v: Vector, w: Vector) => Vector = matrix.add;
export const subtract: (v: Vector, w: Vector) => Vector = matrix.subtract;

export const get = (v: Vector) => {
  return v.map(x => x[0]);
};

export const scale: (v: Vector, k: number) => Vector = matrix.scale;

export const dot = (v: Vector, w: Vector): number => {
  const [x1, y1, z1] = get(v);
  const [x2, y2, z2] = get(w);

  return x1 * x2 + y1 * y2 + z1 * z2;
};

export const cross = (v: Vector, w: Vector): Vector => {
  const [x1, y1, z1] = get(v);
  const [x2, y2, z2] = get(w);

  return makeVector(y1 * z2 - z1 * y2, z1 * x2 - x1 * z2, x1 * y2 - y1 * x2, 0);
};

export const length = (v: Vector) => {
  return Math.sqrt(dot(v, v));
};

export const normalize = (v: Vector): Vector => {
  if (isVector(v)) {
    return scale(v, 1 / length(v));
  }

  const [x, y, z, w] = get(v);
  return makeVector(x / w, y / w, z / w, 1);
};

export const isPoint = (v: Vector): boolean => v[3][0] !== 0;
export const isVector = (v: Vector): boolean => v[3][0] === 0;

const vector = {
  makeVector,
  normalize,
  add,
  subtract,
  get,
  scale,
  dot,
  cross,
  length,
  isPoint,
  isVector,
};

export default vector;
