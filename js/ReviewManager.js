class ReviewManager {
  constructor(onSwatchAvailabilityChange) {
    this.onSwatchAvailabilityChange = onSwatchAvailabilityChange;
    this._initRows();
    this._initArrows();
    this.updateSwatchAvailability();
  }

  _initRows() {
    document.querySelectorAll('.article-row').forEach(row => {
      const element  = row.querySelector('.article-headline, .article-image, .article-content');
      const checkbox = row.querySelector('.element-checkbox');
      const stampSpot = row.querySelector('.element-stamp-spot');
      const leftArrow  = row.querySelector('.nav-arrow-left');
      const rightArrow = row.querySelector('.nav-arrow-right');
      const key = row.getAttribute('data-element');
      if (!element) return;

      if (checkbox) checkbox.disabled = true;

      // Select element on click
      element.addEventListener('click', e => {
        if (e.target.classList.contains('element-checkbox')) return;

        // If this element is already checked/locked, ignore clicks entirely
        if (checkbox && checkbox.checked) return;

        const wasSelected = element.classList.contains('is-selected');

        // Deselect all
        document.querySelectorAll('.article-row').forEach(r => {
          const el = r.querySelector('.article-headline, .article-image, .article-content');
          const cb = r.querySelector('.element-checkbox');
          if (el) el.classList.remove('is-selected');
          if (cb && !cb.checked) cb.disabled = true;
        });
        const preview = document.getElementById('stamp-preview');
        if (preview) preview.classList.remove('is-selected');

        if (!wasSelected) {
          element.classList.add('is-selected');
          if (checkbox && !checkbox.checked) {
            checkbox.disabled = !this._hasStamp(stampSpot);
          }
          window.selectedStampTarget = key;
        } else {
          window.selectedStampTarget = null;
        }

        if (typeof updateYellowSwatchAvailability === 'function') {
          updateYellowSwatchAvailability();
        }
      });

      // Checkbox: block check if no stamp
      if (checkbox) {
        checkbox.addEventListener('click', e => {
          e.stopPropagation();
          if (!checkbox.checked && !this._hasStamp(stampSpot)) {
            e.preventDefault();
          }
        });

        checkbox.addEventListener('change', () => {
          if (checkbox.checked) {
            element.classList.remove('is-selected');
            checkbox.disabled = true;
            if (leftArrow)  leftArrow.style.display  = 'none';
            if (rightArrow) rightArrow.style.display = 'none';
            if (window.selectedStampTarget === key) window.selectedStampTarget = null;
          }
          this.updateSwatchAvailability();
        });
      }
    });
  }

  _initArrows() {
    // Arrows are wired by ArticleManager via cycleVariant
  }

  _hasStamp(spot) {
    return !!(spot && spot.querySelector('img'));
  }

  allChecked() {
    const boxes = document.querySelectorAll('.element-checkbox');
    return boxes.length > 0 && Array.from(boxes).every(cb => cb.checked);
  }

  updateSwatchAvailability() {
    const ready = this.allChecked();
    document.querySelectorAll('.stamp-swatch').forEach(swatch => {
      swatch.disabled = swatch.classList.contains('stamp-yellow') ? ready : !ready;
    });
    if (this.onSwatchAvailabilityChange) this.onSwatchAvailabilityChange(ready);
  }

  unlockCheckboxForElement(key) {
    const spot = document.getElementById(`stamp-spot-${key}`);
    const checkbox = document.getElementById(`checkbox-${key}`);
    if (checkbox && !checkbox.checked && this._hasStamp(spot)) {
      checkbox.disabled = false;
    }
  }

  reset() {
    this.updateSwatchAvailability();
  }
}