import matrix from './matrix';
import { Matrix, Primitive } from './types';
import { normalize } from './vector';

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
    const positions = face.map(point => {
      const pos = normalize(matrix.multiply(MVP, point));

      return { x: pos[0][0], y: pos[1][0], z: pos[2][0] };
    });

    ctx.moveTo(positions[0].x, positions[0].y);

    positions
      .concat(positions[0])
      .slice(1)
      .forEach(position => {
        ctx.lineTo(position.x, position.y);
      });

    ctx.stroke();
  });
};

const canvas = {
  init,
  strokePrimitive,
};

export default canvas;
