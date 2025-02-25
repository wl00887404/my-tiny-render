import { strokePrimitive, fillPrimitive, init } from './canvas';
import matrix, { compose } from './matrix';
import {
  translate,
  scale,
  rotateX,
  rotateY,
  rotateZ,
  perspectiveProjection,
  orthographicProjection,
  screenSpaceScale,
  screenSpaceTranslate,
} from './transform';
import primitives from './primitives';
import Ticker from './ticker';
import vector from './vector';
import quaternion from './quaternion';
import { Vector } from './types';

const app = document.querySelector('#app')!;

const stroke = () => {
  const width = 800;
  const height = 450;
  const near = -10; // 近平面
  const far = -50; // 遠平面
  const fov = Math.PI / 3;
  let xRotation = 0;
  let yRotation = 0;
  let zRotation = 0;
  const rotateSpeed = 0.5;

  const canvas = init(width, height);
  const ctx = canvas.getContext('2d')!;
  app.append(canvas);

  const input = {
    x: false,
    y: false,
    z: false,
    shift: false,
  };

  window.onkeydown = e => {
    const key = e.key.toLowerCase();
    if (key !== 'x' && key !== 'y' && key !== 'z' && key != 'shift') return;
    input[key] = true;
  };

  window.onkeyup = e => {
    const key = e.key.toLowerCase();
    if (key !== 'x' && key !== 'y' && key !== 'z' && key != 'shift') return;
    input[key] = false;
  };

  const MVP = compose(
    screenSpaceTranslate(width, height),
    screenSpaceScale(height, near, fov),
    orthographicProjection,
    perspectiveProjection(near, far),
  );

  const ticker = new Ticker();

  ticker.callbacks.push((deltaTime: number) => {
    const direction = input.shift ? -1 : 1;
    if (input.x) {
      xRotation += rotateSpeed * (Math.PI / 180) * direction * deltaTime;
    }
    if (input.y) {
      yRotation += rotateSpeed * (Math.PI / 180) * direction * deltaTime;
    }
    if (input.z) {
      zRotation += rotateSpeed * (Math.PI / 180) * direction * deltaTime;
    }

    const transform = compose(
      translate(0, 0, -20),
      rotateZ(zRotation),
      rotateY(yRotation),
      rotateX(xRotation),
      scale(8),
    );
    ctx.clearRect(0, 0, width, height);
    strokePrimitive(ctx, primitives.cube, compose(MVP, transform));
  });
  ticker.start();
};

const fill = () => {
  const width = 800;
  const height = 450;
  const near = -10; // 近平面
  const far = -50; // 遠平面
  const fov = Math.PI / 3;
  let xRotation = 0;
  let yRotation = 0;
  let zRotation = 0;
  const rotateSpeed = 30 * (Math.PI / 180);

  const canvas = init(width, height);
  const ctx = canvas.getContext('2d')!;
  app.append(canvas);

  const MVP = compose(
    screenSpaceTranslate(width, height),
    screenSpaceScale(height, near, fov),
    orthographicProjection,
    perspectiveProjection(near, far),
  );

  const draw = () => {
    console.time('drawCall');
    const transform = compose(
      translate(0, 0, -20),
      rotateZ(zRotation),
      rotateY(yRotation),
      rotateX(xRotation),
      scale(8),
    );
    ctx.clearRect(0, 0, width, height);
    fillPrimitive(ctx, primitives.cube, compose(MVP, transform), width, height);
    console.timeEnd('drawCall');
  };

  draw();

  window.onkeydown = e => {
    const key = e.key.toLowerCase();
    if (key === 'x') {
      xRotation += rotateSpeed;
    }
    if (key === 'y') {
      yRotation += rotateSpeed;
    }
    if (key === 'z') {
      zRotation += rotateSpeed;
    }

    draw();
  };
};

const quaternionTest = () => {
  const radian = (30 * Math.PI) / 180;

  const point = vector.makeVector(1, 0, 0, 1);

  const rotateByMatrixTest = () => {
    const rotateMatrix = rotateY(radian);
    const result = matrix.multiply(rotateMatrix, point);

    console.group('rotated by matrix');
    console.log('before rotate');
    console.table(point);

    console.log('rotate 30 deg');
    console.table(result);

    console.log('rotate 60 deg');
    console.table(matrix.multiply(rotateMatrix, result));
    console.groupEnd();
  };
  rotateByMatrixTest();

  let q = quaternion.makeQuaternion(0, 0, 0, 1);

  const cos = Math.cos(radian / 2);
  const sin = Math.sin(radian / 2);

  const getPoint = (point: Vector) => {
    const [x, y, z, w] = vector.get(point);
    const q1 = q;
    const q2 = quaternion.makeQuaternion(x, y, z, 0);
    const q3 = quaternion.conjugate(q1);

    const qResult = quaternion.multiply(quaternion.multiply(q1, q2), q3);

    return vector.makeVector(qResult[0], qResult[1], qResult[2], w);
  };

  const rotateByQuaternion = () => {
    console.group('rotated by quaternion');
    console.log('before rotate');
    console.table(getPoint(point));

    console.log('rotate 30 deg');
    q = quaternion.multiply(q, quaternion.makeQuaternion(0, sin, 0, cos));
    console.table(getPoint(point));

    console.log('rotate 60 deg');
    q = quaternion.multiply(q, quaternion.makeQuaternion(0, sin, 0, cos));
    console.table(getPoint(point));
    console.groupEnd();
  };
  rotateByQuaternion();

  const rotateByMatrixFromQuaternion = () => {
    q = quaternion.makeQuaternion(0, 0, 0, 1);
    console.group('rotated by rotate matrix from quaternion');
    console.log('before rotate');
    console.table(point);

    console.log('rotate 30 deg');
    q = quaternion.multiply(q, quaternion.makeQuaternion(0, sin, 0, cos));
    console.table(matrix.multiply(quaternion.getRotateMatrix(q), point));

    console.log('rotate 60 deg');
    q = quaternion.multiply(q, quaternion.makeQuaternion(0, sin, 0, cos));
    console.table(matrix.multiply(quaternion.getRotateMatrix(q), point));
    console.groupEnd();
  };
  rotateByMatrixFromQuaternion();
};

const main = {
  stroke,
  fill,
  quaternionTest,
};

export default main;
