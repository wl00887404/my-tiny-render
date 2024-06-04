import { Matrix } from './types';

export const translate = (x: number, y: number, z: number): Matrix => [
  [1, 0, 0, x],
  [0, 1, 0, y],
  [0, 0, 1, z],
  [0, 0, 0, 1],
];

export const scale = (k: number): Matrix => [
  [k, 0, 0, 0],
  [0, k, 0, 0],
  [0, 0, k, 0],
  [0, 0, 0, 1],
];

// radian 是弧度
export const rotateX = (radian: number): Matrix => [
  [1, 0, 0, 0],
  [0, Math.cos(radian), -Math.sin(radian), 0],
  [0, Math.sin(radian), Math.cos(radian), 0],
  [0, 0, 0, 1],
];

export const rotateY = (radian: number): Matrix => [
  [Math.cos(radian), 0, Math.sin(radian), 0],
  [0, 1, 0, 0],
  [-Math.sin(radian), 0, Math.cos(radian), 0],
  [0, 0, 0, 1],
];

export const rotateZ = (radian: number): Matrix => [
  [Math.cos(radian), -Math.sin(radian), 0, 0],
  [Math.sin(radian), Math.cos(radian), 0, 0],
  [0, 0, 1, 0],
  [0, 0, 0, 1],
];

// 留下 x 留下 y
export const orthographicProjection: Matrix = [
  [1, 0, 0, 0],
  [0, 1, 0, 0],
  [0, 0, 1, 0],
  [0, 0, 0, 1],
];

/**
 * 依據相似形原則
 * y' : n = y : z => y' = ny / z，同理得 x' = nx / z
 * 因為矩陣乘法沒辦法獲得 y / z，所以利用齊次座標定義
 * 把目標從 (nx / z , ny / z, ?, 1) 改成 (nx, ny, ?, z) ，並且可推得：
 * nx => row0 = [n, 0, 0, 0]
 * ny => row1 = [0, n, 0, 0]
 * z  => row3 = [0, 0, 1, 0]
 * 
 * row2 未知，暫定為 [a, b, c, d]
 * 從另外兩條件： (1) 近平面所有點在投影後不變 (2) 遠平面中心在投影後不變
 * 
 * (1) => (x, y, n, 1)  與矩陣相乘可得 (nx, ny, nn, n)
 * ax + by + cn + d = nn =>  a = 0, b = 0
 * 
 * (2) => (0, 0, f, 1) 與矩陣相乘可得 (0, 0, ff, f)
 * cf + d = ff => 與 cn + d = nn 解聯立方程式
 * 兩式相減 => c(n - f) = nn - ff = (n + f)(n - f)
 *         => c = n + f, d = -nf
 */
export const perspectiveProjection = (near: number, far: number): Matrix => [
  [near, 0, 0, 0],
  [0, near, 0, 0],
  [0, 0, near + far, -1 * near * far],
  [0, 0, 1, 0],
];

/**
 * fov 是 field of view
 * fov 就是往前看，能夠往上看多少角度
 * near 是近平面的距離，近平面成像的高度會是 near * tan(fov) * 2
 * 成像需要放大的比例 = height / (near * tan(fov) * 2)
 */
export const screenSpaceScale = (
  height: number,
  near: number,
  fov: number,
): Matrix => {
  const scaleRatio = height / (Math.abs(near) * Math.tan(fov) * 2);
  const result = scale(scaleRatio);
  // 因為 canvas 的 Y 是向下，所以要 flip 過來
  result[1][1] *= -1;
  return result;
};

export const screenSpaceTranslate = (width: number, height: number): Matrix => [
  [1, 0, 0, width / 2],
  [0, 1, 0, height / 2],
  [0, 0, 1, 0],
  [0, 0, 0, 1],
];

const transform = {
  translate,
  scale,
  rotateX,
  rotateY,
  rotateZ,
  orthographicProjection,
  perspectiveProjection,
  screenSpaceScale,
  screenSpaceTranslate,
};
export default transform;
