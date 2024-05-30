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
  toScreenSpace,
} from './transform';
import { cube } from './primitives';
import Ticker from './ticker';

const app = document.querySelector('#app')!;

const main = () => {
  const width = 800;
  const height = 450;
  const near = -60; // 近平面
  const far = -150; // 遠平面
  let yDeg = 0;

  const canvas = init(width, height);
  app.append(canvas);

  const MVP = compose(
    toScreenSpace(width, height),
    orthographicProjection,
    perspectiveProjection(near, far),
    translate(0, 0, -100),
  );

  const ctx = canvas.getContext('2d')!;

  const ticker = new Ticker();

  ticker.callbacks.push((deltaTime: number) => {
    yDeg += 1 * deltaTime;
    const transform = compose(
      rotateZ(Math.PI / 18),
      rotateY((yDeg * Math.PI) / 180),
      rotateX(Math.PI / 18),
      scale(50),
    );
    ctx.clearRect(0, 0, width, height);
    drawPrimitive(ctx, cube, compose(MVP, transform));
  });
  ticker.start()
};

export default main;
