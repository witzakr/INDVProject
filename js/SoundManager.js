class SoundManager {
  constructor() {
    this.ambient  = this._load('../sounds/office-ambience.mp3');
    this.typeclick = this._load('../sounds/typeclick.mp3');
    this.stamp     = this._load('../sounds/stamp.mp3');
    this.drawer    = this._load('../sounds/draweropen.mp3');

    this.ambient.loop   = true;
    this.ambient.volume = 0.3;
    this.ambient.muted  = true;
    this.ambient.play().catch(() => {});

    const activate = () => {
      this.ambient.muted = false;
      if (this.ambient.paused) this.ambient.play().catch(() => {});
      document.removeEventListener('click',      activate);
      document.removeEventListener('keydown',    activate);
      document.removeEventListener('touchstart', activate);
    };
    document.addEventListener('click',      activate);
    document.addEventListener('keydown',    activate);
    document.addEventListener('touchstart', activate);
  }

  _load(src) {
    return new Audio(src);
  }

  play(audio) {
    const s = audio.cloneNode();
    s.play().catch(() => {});
  }

  playTypeclick() { this.play(this.typeclick); }
  playStamp()     { this.play(this.stamp); }
  playDrawer()    { this.play(this.drawer); }
}
