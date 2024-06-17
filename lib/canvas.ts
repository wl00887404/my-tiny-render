import matrix from './matrix';
import vector from './vector';
import { Color, Matrix, Primitive, Vector } from './types';

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

const getColorString = (color: Color, weight = 1) => {
  const [r, g, b] = color.map(c => {
    const weightedC = c + (1 - weight) * (1 - c);

    return Math.round(weightedC * 255);
  });

  return `rgb(${r}, ${g}, ${b})`;
};

const getBoundingBox = (positions: number[][]) => {
  let top = Infinity;
  let right = 0;
  let bottom = 0;
  let left = Infinity;

  positions.forEach(pos => {
    top = Math.min(top, pos[1]);
    right = Math.max(right, pos[0]);
    bottom = Math.max(bottom, pos[1]);
    left = Math.min(left, pos[0]);
  });

  top = Math.floor(top);
  right = Math.ceil(right);
  bottom = Math.ceil(bottom);
  left = Math.floor(left);

  return [top, right, bottom, left];
};

export const fillPrimitive = (
  ctx: CanvasRenderingContext2D,
  primitive: Primitive,
  MVP: Matrix,
  width: number,
  height: number,
  msaaLevel: number = 1,
) => {
  const frameBuffer: Color[][] = Array.from({ length: width * msaaLevel }, () =>
    Array.from({ length: height * msaaLevel }, () => [1, 1, 1]),
  );
  const zBuffer: number[][] = Array.from({ length: width * msaaLevel }, () =>
    Array.from({ length: height * msaaLevel }, () => -Infinity),
  );

  primitive.forEach(face => {
    const positions = face.points.map(point => {
      const pos = vector.normalize(matrix.multiply(MVP, point));

      return vector.get(pos);
    });
    fillFace(positions, face.color, frameBuffer, zBuffer, msaaLevel);
  });

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const color = [0, 0, 0];

      for (let i = 0; i < msaaLevel; i++) {
        for (let j = 0; j < msaaLevel; j++) {
          for (let k = 0; k < 3; k++) {
            color[k] += frameBuffer[x * msaaLevel + i][y * msaaLevel + j][k];
          }
        }
      }

      for (let i = 0; i < 3; i++) color[i] /= msaaLevel * msaaLevel;

      ctx.fillStyle = getColorString(color);
      ctx.fillRect(x, y, 1, 1);
    }
  }
};

const fillFace = (
  positions: number[][],
  color: Color,
  frameBuffer: Color[][],
  zBuffer: number[][],
  msaaLevel: number = 1,
) => {
  // 假設是五邊形 ABCDE
  // 拆成三角形會是 ABC、ACD、ADE
  for (let i = 0; i < positions.length - 2; i++) {
    fillTriangle(
      [positions[0], positions[i + 1], positions[i + 2]],
      color,
      frameBuffer,
      zBuffer,
      msaaLevel,
    );
  }
};

const fillTriangle = (
  trianglePositions: number[][],
  color: Color,
  frameBuffer: Color[][],
  zBuffer: number[][],
  msaaLevel: number = 1,
) => {
  const [top, right, bottom, left] = getBoundingBox(trianglePositions);
  const [aPoint, bPoint, cPoint] = trianglePositions;
  const a = vector.makeVector(aPoint[0], aPoint[1], 0, 1);
  const b = vector.makeVector(bPoint[0], bPoint[1], 0, 1);
  const c = vector.makeVector(cPoint[0], cPoint[1], 0, 1);

  const triangleCross = vector.cross(
    vector.subtract(b, a),
    vector.subtract(c, a),
  );

  // 三角形面積應該是外積除以 2
  // 但後續要做比例，所以就不除了
  const triangleArea = vector.length(triangleCross);

  for (let x = left; x < right; x++) {
    for (let y = top; y < bottom; y++) {
      const baryCoords = getBaryCoords(x + 0.5, y + 0.5, a, b, c, triangleArea);

      const z =
        baryCoords[0] * trianglePositions[0][2] +
        baryCoords[1] * trianglePositions[1][2] +
        baryCoords[2] * trianglePositions[2][2];

      const space = 1 / msaaLevel / 2;

      for (let i = 0; i < msaaLevel; i++) {
        for (let j = 0; j < msaaLevel; j++) {
          const centerX = x + space + space * 2 * i;
          const centerY = y + space + space * 2 * j;

          if (zBuffer[x * msaaLevel + i][y * msaaLevel + j] > z) continue;
          if (!isInsideTriangle(centerX, centerY, a, b, c)) continue;

          zBuffer[x * msaaLevel + i][y * msaaLevel + j] = z;
          frameBuffer[x * msaaLevel + i][y * msaaLevel + j] = color;
        }
      }
    }
  }
};

export const getBaryCoords = (
  x: number,
  y: number,
  a: Vector,
  b: Vector,
  c: Vector,
  triangleArea: number,
): number[] => {
  const p = vector.makeVector(x, y, 0, 1);

  // 為了再來計算 area
  // cross 放入的的順序為 bc, ca, ab
  const points = [b, c, a, b];
  const crosses = [];

  for (let i = 0; i < 3; i++) {
    const edge = vector.subtract(points[i + 1], points[i]);
    const toPos = vector.subtract(p, points[i]);

    const cross = vector.cross(edge, toPos);
    crosses.push(cross);
  }

  return crosses.map(cross => {
    return vector.length(cross) / triangleArea;
  });
};

const isInsideTriangle = (
  x: number,
  y: number,
  a: Vector,
  b: Vector,
  c: Vector,
) => {
  // 因為只看 Z 值，所以只需要做 x1 * y2 - y1 * x2 就好了
  let upCount = 0;
  let downCount = 0;

  const points = [b, c, a, b];

  for (let i = 0; i < 3; i++) {
    const x1 = points[i + 1][0][0] - points[i][0][0];
    const y1 = points[i + 1][1][0] - points[i][1][0];
    const x2 = x - points[i][0][0];
    const y2 = y - points[i][1][0];

    const crossZ = x1 * y2 - y1 * x2;

    if (crossZ == 0) continue;
    if (crossZ > 0) upCount++;
    else downCount++;
  }

  return upCount === 0 || downCount === 0;
};

const canvas = {
  init,
  strokePrimitive,
  fillPrimitive,
};

export default canvas;
