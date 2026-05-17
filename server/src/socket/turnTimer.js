export class TurnTimer {
  /**
   * @param {number}   durationSec - how long the turn lasts
   * @param {function} onTick      - called every second with (remaining: number)
   * @param {function} onExpire    - called once when remaining hits 0
   */
  constructor(durationSec, onTick, onExpire) {
    this.remaining = durationSec;
    this._onTick   = onTick;
    this._onExpire = onExpire;
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

  /** Restart with a new (or same) duration. */
  reset(durationSec = this.remaining) {
    this.clear();
    this.remaining = durationSec;
    this._start();
  }

  clear() {
    clearInterval(this._iv);
  }
}
