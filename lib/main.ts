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

  const canvas = init(width, height);
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
    const direction = e.shiftKey ? -1 : 1;
    if (e.keyCode === 88) {
      xRotation += (Math.PI / 180) * direction;
    } else if (e.keyCode === 89) {
      yRotation += (Math.PI / 180) * direction;
    } else if (e.keyCode === 90) {
      zRotation += (Math.PI / 180) * direction;
    }
  };

  ticker.callbacks.push((_deltaTime: number) => {
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
