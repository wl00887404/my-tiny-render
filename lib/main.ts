import { strokePrimitive, fillPrimitive, init } from './canvas';
import { compose } from './matrix';
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
  const rotateSpeed = 30 * (Math.PI / 180);

  let xRotation = 0;
  let yRotation = 0;
  let zRotation = 0;
  let msaaLevel = 1;

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
    fillPrimitive(
      ctx,
      primitives.cube,
      compose(MVP, transform),
      width,
      height,
      msaaLevel,
    );
    console.timeEnd('drawCall');
  };

  draw();

  const inputKeys = {
    x: 'x',
    y: 'y',
    z: 'z',
    m: 'm',
  };

  window.onkeydown = e => {
    const key = e.key.toLowerCase();
    if (!Object.values(inputKeys).includes(key)) return;

    if (key === inputKeys.x) {
      xRotation += rotateSpeed;
    }
    if (key === inputKeys.y) {
      yRotation += rotateSpeed;
    }
    if (key === inputKeys.z) {
      zRotation += rotateSpeed;
    }

    if (key === inputKeys.m) {
      const nextMsaaLevel =
        Number(prompt('next msaa level: ', msaaLevel.toString())) || 1;
      msaaLevel = nextMsaaLevel;
    }

    draw();
  };
};

const main = {
  stroke,
  fill,
};

export default main;
