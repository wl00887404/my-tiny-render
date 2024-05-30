import { Vector } from './types';

export const makeVector = (x: number, y: number, z: number, w: number): Vector => {
  const result = [[x], [y], [z]];

  if (w !== undefined) result.push([w]);

  return result;
};

export const normalize = (vector: Vector): Vector => {
  if (vector[3][0] === 0) {
    //TODO: 正規化向量
  }

  return [
    [vector[0][0] / vector[3][0]],
    [vector[1][0] / vector[3][0]],
    [vector[2][0] / vector[3][0]],
    [vector[3][0] / vector[3][0]],
  ];
};

const vector = {
  makeVector,
  normalize,
};

export default vector;
