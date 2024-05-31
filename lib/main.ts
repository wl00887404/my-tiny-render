import { drawPrimitive, init } from './canvas';
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

const main = () => {
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
  const input = {
    x: false,
    y: false,
    z: false,
    shift: false,
  };

  app.append(canvas);

  const MVP = compose(
    screenSpaceTranslate(width, height),
    screenSpaceScale(height, near, fov),
    orthographicProjection,
    perspectiveProjection(near, far),
  );

  const ctx = canvas.getContext('2d')!;

  const ticker = new Ticker();

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

  ticker.callbacks.push((deltaTime: number) => {
    const direction = input.shift ? -1 : 1;
    if (input.x) {
      xRotation += rotateSpeed * (Math.PI / 180) * direction * deltaTime;
    } else if (input.y) {
      yRotation += rotateSpeed * (Math.PI / 180) * direction * deltaTime;
    } else if (input.z) {
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
    drawPrimitive(ctx, primitives.cube, compose(MVP, transform));
  });
  ticker.start();
};

export default main;
