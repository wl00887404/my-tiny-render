class Ticker {
  lastTimestamp: number | undefined = undefined;
  callbacks: Function[] = [];
  stopFlag = false;

  start() {
    this.stopFlag = false;
    window.requestAnimationFrame(this.update);
  }

  stop() {
    this.stopFlag = true;
  }

  update = (timestamp: number) => {
    const deltaTime = this.lastTimestamp ? timestamp - this.lastTimestamp : 0;
    this.callbacks.forEach(callback => callback(deltaTime));

    this.lastTimestamp = timestamp;
    if (!this.stopFlag) window.requestAnimationFrame(this.update);
  };
}

export default Ticker;
