class Ticker {
  fps = 60;
  lastTimestamp: number | undefined = undefined;
  callbacks: Function[] = [];
  start = () => {
    window.requestAnimationFrame(this.update);
  };

  update = (timestamp: number) => {
    const frameDuration = 1000 / this.fps;
    const frames = this.lastTimestamp
      ? Math.floor((timestamp - this.lastTimestamp) / frameDuration)
      : 1;

    this.callbacks.forEach(callback => callback(frames));

    this.lastTimestamp = this.lastTimestamp
      ? this.lastTimestamp + frames * frameDuration
      : timestamp;
    window.requestAnimationFrame(this.update);
  };
}

export default Ticker;
