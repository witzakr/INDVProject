class StampManager {
  constructor(reviewManager, soundManager, onFinalize) {
    this.reviewManager = reviewManager;
    this.soundManager  = soundManager;
    this.onFinalize    = onFinalize;
    this.preview       = document.getElementById('stamp-preview');

    this.assets = {
      'stamp-red':    '../img/reject.png',
      'stamp-yellow': '../img/toredact.png',
      'stamp-green':  '../img/approved.png'
    };

    this._initSwatches();
    this._initPreviewLockState();
  }

  _initPreviewLockState() {
    document.querySelectorAll('.element-checkbox').forEach(cb => {
      cb.addEventListener('change', () => this._updatePreviewLock());
    });
    this._updatePreviewLock();
  }

  _updatePreviewLock() {
    if (!this.preview) return;
    this.preview.classList.toggle('is-locked', !this.reviewManager.allChecked());
    this._updateYellowAvailability();
  }

  _updateYellowAvailability() {
    const yellow = document.querySelector('.stamp-swatch.stamp-yellow');
    if (yellow) yellow.disabled = this.reviewManager.allChecked();
  }

  _initSwatches() {
    document.querySelectorAll('.stamp-swatch').forEach(swatch => {
      swatch.addEventListener('click', () => this._onSwatchClick(swatch));
    });
  }

  _onSwatchClick(swatch) {
    const target = window.selectedStampTarget;

    // Stamping a specific article element
    if (target && target !== 'preview') {
      const spot = document.getElementById(`stamp-spot-${target}`);
      if (!spot || spot.classList.contains('is-locked')) return;
      if (swatch.classList.contains('stamp-yellow') && this.reviewManager.allChecked()) return;

      const colorClass = Object.keys(this.assets).find(k => swatch.classList.contains(k));
      if (!colorClass) return;

      this._placeStamp(spot, this.assets[colorClass]);
      this.reviewManager.unlockCheckboxForElement(target);
      this.soundManager.playStamp();
      return;
    }

    // Final stamp on the preview spot
    if (!this.preview || !this.reviewManager.allChecked()) return;
    if (swatch.classList.contains('stamp-yellow')) return;

    const colorClass = Object.keys(this.assets).find(k => swatch.classList.contains(k));
    if (!colorClass) return;

    this.soundManager.playStamp();
    this._placeStampAnimated(this.preview, this.assets[colorClass], () => {
      const outcome = colorClass === 'stamp-green' ? 'approved' : 'rejected';
      if (this.onFinalize) this.onFinalize(outcome, this.assets[colorClass]);
      this.preview.innerHTML = '';
      this.preview.classList.add('is-locked');
    });
  }

  _placeStamp(container, src) {
    container.innerHTML = '';
    const img = document.createElement('img');
    img.src = src;
    img.alt = '';
    container.appendChild(img);
  }

  _placeStampAnimated(container, src, callback) {
    container.innerHTML = '';
    const img = document.createElement('img');
    img.src = src;
    img.alt = '';
    img.className = 'preview-stamp-pop';
    container.appendChild(img);
    setTimeout(callback, 700);
  }
}