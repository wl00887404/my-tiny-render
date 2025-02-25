import { Quaternion } from './types';

export const makeQuaternion = (x = 0, y = 0, z = 0, w = 1) => {
  return [x, y, z, w];
};

export const add = (q1: Quaternion, q2: Quaternion) => {
  const [x1, y1, z1, w1] = q1;
  const [x2, y2, z2, w2] = q2;

  return [x1 + x2, y1 + y2, z1 + z2, w1 + w2];
};

/**
 * ii = -1, jj = -1, kk = -1, ijk = -1
 * ij = k, ji = -k
 * jk = i, kj = -i
 * ki = j, ik = -j
 */
export const multiply = (q1: Quaternion, q2: Quaternion) => {
  /**
   * (x1 * i, y1 * j, z1 * k, w1) * (x2 * i, y2 * j, z2 * k, w2)
   * i = iw + jk + kj + wi
   *   = (x1 * w2) *  i + (y1 * z2) * jk + (z1 * y2) * kj + (w1 * x2) * i
   *   = (x1 * w2) + (y1 * z2) - (z1 * y2) + (w1 * x2)
   *
   * j = ik + jw + ki + wj
   *   = (x1 * z2) * ik + (y1 * w2) * j + (z1 * x2) * ki + (w1 * y2) * j
   *   = - (x1 * z2) + (y1 * w2) + (z1 * x2) + (w1 * y2)
   *
   * k = ij + ji + kw + wk
   *   = (z1 * w2) * k + (x1 * y2) * ij + (y1 * x2) * ji + (w1 * z2) * k
   *   = (z1 * w2) + (x1 * y2) - (y1 * x2) + (w1 * z2)
   *
   * w = ii + jj + kk + ww
   *   = x1 * x2 * ii + y1 * y2 * jj + z1 * z2 * kk + w1 * w2
   *   = - (x1 * x2) - (y1 * y2) - (z1 * z2) + (w1 * w2)
   */

  const [x1, y1, z1, w1] = q1;
  const [x2, y2, z2, w2] = q2;

  return [
    x1 * w2 + y1 * z2 + w1 * x2 - z1 * y2,
    y1 * w2 + z1 * x2 + w1 * y2 - x1 * z2,
    z1 * w2 + x1 * y2 + w1 * z2 - y1 * x2,
    w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2,
  ];
};

export const conjugate = (q: Quaternion) => {
  const [x, y, z, w] = q;
  return [x * -1, y * -1, z * -1, w];
};

export const getRotateMatrix = (q: Quaternion) => {
  /**
   * 目標把向量 [a, b, c] 轉換成 [d, e, f]
   * 藉由公式 [d, e, f, g] = q * [a, b, c, 0] * conjugate(q)
   *   = [x, y, z, w] * [a, b, c, 0] * [-x, -y, -z, w0]
   *
   * 先看前兩項 [x, y, z, w] * [a, b, c, 0]
   * x' = x * 0 + y * c + w * a - z * b
   *    = y * c + w * a - z * b
   * y' = y * 0 + z * a + w * b - x * c
   *    = z * a + w * b - x * c
   * z' = z * 0 + x * b + w * c - y * a
   *    = x * b + w * c - y * a
   * w' = w * 0 - x * a - y * b - z * c
   *    = - x * a - y * b - z * c
   *
   * 再看後兩項 [x', y', z', w'] * [-x, -y, -z, w]
   *
   * d = (x' * w) + (y' * -z) - (z' * -y) + (w' * -x)
   *   = (x' * w) - (y' * z) + (z' * y) - (w' * x)
   *   = (yw * c + ww * a - zw * b) + (xz * c - zz * a - zw * b) + (xy * b + yw * c - yy * a) + (xx * a +  xy * b + xz * c)
   *   = (ww - zz - yy + xx) * a + (- zw - zw + xy + xy) * b + (yw + xz + yw + xz) *  c
   *   = (1 - 2yy - 2zz)) * a + (2xy - 2zw) * b + (2xz + 2yw) * c
   *
   * e = - (x' * -z) + (y' * w) + (z' * -x) + (w * -y)
   *   = (x' * z) + (y' * w) - (z' * x) - (w * y)
   *   = (yz * c + zw * a - zz * b) + (zw * a + ww * b - xw * c) + (-xx * b - xw * c + xy * a) + (xy * a + yy * b + yz * c)
   *   = (2xy + 2zw) * a + (1 - 2xx - 2zz) * b + (2yz - 2xw) * c
   *
   * f = (z' * w) + (x' * -y) - (y' * -x) + (w' * -z)
   *   = (z' * w) - (x' * y) + (y' * x) - (w' * z)
   *   = (xw * b + ww * c - yw * a) + (-yy * c - yw * a + yz * b) + (xz * a + xw * b - xx * c) + (xz * a + yz * b + zz * c)
   *   = (2xz - 2yw) * a + (2xw + 2yz) * b + (1 -2xx -2yy) * c
   *
   * g = - (x' * -x) - (y' * -y) - (z' * -z) + (w' * w)
   *   = (x' * x) + (y' * y) + (z' * z) + (w' * w)
   *   = (xy * c + xw * a - xz * b) + (yz * a + yw * b - xy * c) + (xz * b + zw * c - yz * a) + (- xw * a - yw * b - zw * c)
   *   = (0) * a + (0) * b + (0) * c
   *   = 0
   */

  const [x, y, z, w] = q;

  return [
    [
      1 - 2 * y * y - 2 * z * z,
      2 * x * y - 2 * z * w,
      2 * x * z + 2 * y * w,
      0,
    ],
    [
      2 * x * y + 2 * z * w,
      1 - 2 * x * x - 2 * z * z,
      2 * y * z - 2 * x * w,
      0,
    ],
    [
      2 * x * z - 2 * y * w,
      2 * x * w + 2 * y * z,
      1 - 2 * x * x - 2 * y * y,
      0,
    ],
    [0, 0, 0, 1],
  ];
};

const quaternion = {
  makeQuaternion,
  add,
  multiply,
  conjugate,
  getRotateMatrix,
};
export default quaternion;
