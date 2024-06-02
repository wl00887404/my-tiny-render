import matrix from './matrix';
import vector from './vector';
import { Matrix, Primitive } from './types';

export const init = (width: number, height: number) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  return canvas;
};

export const strokePrimitive = (
  ctx: CanvasRenderingContext2D,
  primitive: Primitive,
  MVP: Matrix,
) => {
  primitive.forEach(face => {
    ctx.beginPath();
    const positions = face.points.map(point => {
      const pos = vector.normalize(matrix.multiply(MVP, point));
      return vector.get(pos);
    });

    const lastPosition = positions[positions.length - 1];
    ctx.moveTo(lastPosition[0], lastPosition[1]);

    positions.forEach(position => {
      ctx.lineTo(position[0], position[1]);
    });

    ctx.stroke();
  });
};

export const fillPrimitive = (
  ctx: CanvasRenderingContext2D,
  primitive: Primitive,
  MVP: Matrix,
  width: number,
  height: number,
) => {
  const zBuffer = matrix.makeMatrix(width, height, -Infinity);

  primitive.forEach(face => {
    const positions = face.points.map(point => {
      const pos = vector.normalize(matrix.multiply(MVP, point));
      return vector.get(pos);
    });

    fillFace(ctx, positions, face.color, zBuffer);
  });
};

const fillFace = (
  ctx: CanvasRenderingContext2D,
  positions: number[][],
  color: string,
  zBuffer: Matrix,
) => {
  // 假設是五邊形 ABCDE
  // 拆成三角形會是 ABC、ACD、ADE
  for (let i = 0; i < positions.length - 2; i++) {
    fillTriangle(
      ctx,
      [positions[0], positions[i + 1], positions[i + 2]],
      color,
      zBuffer,
    );
  }
};

const fillTriangle = (
  ctx: CanvasRenderingContext2D,
  trianglePositions: number[][],
  color: string,
  zBuffer: Matrix,
) => {
  let top = Infinity;
  let right = 0;
  let bottom = 0;
  let left = Infinity;

  trianglePositions.forEach(pos => {
    top = Math.min(top, pos[1]);
    right = Math.max(right, pos[0]);
    bottom = Math.max(bottom, pos[1]);
    left = Math.min(left, pos[0]);
  });

  top = Math.floor(top);
  right = Math.ceil(right);
  bottom = Math.ceil(bottom);
  left = Math.floor(left);

  for (let x = left; x < right; x++) {
    for (let y = top; y < bottom; y++) {
      const baryCoords = getBaryCoords([x + 0.5, y + 0.5], trianglePositions);

      if (!baryCoords) continue;

      const z =
        baryCoords[0] * trianglePositions[0][2] +
        baryCoords[1] * trianglePositions[1][2] +
        baryCoords[2] * trianglePositions[2][2];

      if (zBuffer[x][y] > z) return;

      zBuffer[x][y] = z;
      ctx.fillStyle = color;
      ctx.fillRect(x, y, 1, 1);
    }
  }
};

export const getBaryCoords = (
  pos: number[],
  trianglePositions: number[][],
): number[] | undefined => {
  let crossUpCount = 0;
  const [aPos, bPos, cPos] = trianglePositions;
  const a = vector.makeVector(aPos[0], aPos[1], 0, 1);
  const b = vector.makeVector(bPos[0], bPos[1], 0, 1);
  const c = vector.makeVector(cPos[0], cPos[1], 0, 1);
  const p = vector.makeVector(pos[0], pos[1], 0, 1);

  // 為了再來計算 area
  // cross 放入的的順序為 bc, ca, ab
  const points = [b, c, a, b];
  const crosses = [];

  for (let i = 0; i < 3; i++) {
    const edge = vector.subtract(points[i + 1], points[i]);
    const toPos = vector.subtract(p, points[i]);

    const cross = vector.cross(edge, toPos);
    crosses.push(cross);

    const crossZ = vector.get(cross)[2];
    crossUpCount += crossZ / Math.abs(crossZ);
  }

  const isInsideTriangle = crossUpCount === 3 || crossUpCount === -3;

  if (!isInsideTriangle) return undefined;

  const triangleCross = vector.cross(
    vector.subtract(b, a),
    vector.subtract(c, a),
  );

  // 三角形面積應該是外積除以 2
  // 但後續要做比例，所以就不除了
  const triangleArea = vector.length(triangleCross);

  return crosses.map(cross => {
    return vector.length(cross) / triangleArea;
  });
};

const canvas = {
  init,
  strokePrimitive,
  fillPrimitive,
};

export default canvas;
