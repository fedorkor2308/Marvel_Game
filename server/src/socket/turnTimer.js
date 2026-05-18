export class TurnTimer {
  constructor(durationSec, onTick, onExpire) {
    this.remaining = durationSec;
    this._onTick   = onTick;
    this._onExpire = onExpire;
    this._iv       = null;
    this._start();
  }

  _start() {
    this._iv = setInterval(() => {
      this.remaining -= 1;
      this._onTick(this.remaining);
      if (this.remaining <= 0) {
        this.clear();
        this._onExpire();
      }
    }, 1000);
  }

  reset(durationSec) {
    this.clear();
    this.remaining = durationSec;
    this._start();
  }

  clear() {
    clearInterval(this._iv);
    this._iv = null;
  }
}
