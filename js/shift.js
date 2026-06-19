// Toggle the stamps panel, flipping the arrow direction
const stampsToggle = document.getElementById('stamps-toggle');
const stampsPopup = document.getElementById('stamps-popup');

if (stampsToggle && stampsPopup) {
  stampsToggle.addEventListener('click', () => {
    const isOpen = stampsPopup.classList.toggle('is-open');
    stampsToggle.innerHTML = isOpen ? '&#8595;' : '&#8593;';
    stampsToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
}

// Toggle the Editor / Memo report panels, ensuring only one is open at a time
const editorToggle = document.getElementById('editor-toggle');
const editorReport = document.getElementById('editor-report');
const memoToggle = document.getElementById('memo-toggle');
const memoReport = document.getElementById('memo-report');

function closePanel(toggle, panel) {
  panel.classList.remove('is-open');
  toggle.innerHTML = '&#8595;';
  toggle.setAttribute('aria-expanded', 'false');
}

function togglePanel(toggle, panel, otherToggle, otherPanel) {
  const isOpen = panel.classList.contains('is-open');

  if (isOpen) {
    closePanel(toggle, panel);
  } else {
    if (otherPanel.classList.contains('is-open')) {
      closePanel(otherToggle, otherPanel);
    }
    panel.classList.add('is-open');
    toggle.innerHTML = '&#8593;';
    toggle.setAttribute('aria-expanded', 'true');
  }
}

if (editorToggle && editorReport && memoToggle && memoReport) {
  editorToggle.addEventListener('click', () => {
    togglePanel(editorToggle, editorReport, memoToggle, memoReport);
  });

  memoToggle.addEventListener('click', () => {
    togglePanel(memoToggle, memoReport, editorToggle, editorReport);
  });
}

// Toggle pause/play icon
const pauseBtn = document.getElementById('pause-btn');
const pauseIcon = document.getElementById('pause-icon');

if (pauseBtn && pauseIcon) {
  let isPaused = false;

  pauseBtn.addEventListener('click', () => {
    isPaused = !isPaused;
    pauseIcon.src = isPaused ? '../img/play.png' : '../img/pause.png';
    pauseBtn.setAttribute('aria-label', isPaused ? 'Play' : 'Pause');
  });
}

// Show game rules in a simple alert box
const infoBtn = document.getElementById('info-btn');

if (infoBtn) {
  infoBtn.addEventListener('click', () => {
    alert(
      'RULES\n\n' +
      'Each article has three parts: headline, image, and content.\n\n' +
      'Review each part and stamp it according to whether it matches the directive:\n' +
      '- If it matches: stamp it Approved.\n' +
      '- If it does not match: stamp it Redacted.\n\n' +
      'Once all three parts are checked, if two or more parts were redacted, ' +
      'the entire article must be rejected.'
    );
  });
}

// Highlight an article element (headline/image/content) when selected,
// and only allow checking its checkbox once it has been selected
window.selectedStampTarget = null; // 'headline' | 'image' | 'content' | 'preview' | null

document.querySelectorAll('.article-row').forEach((row) => {
  const element = row.querySelector('.article-headline, .article-image, .article-content');
  const checkbox = row.querySelector('.element-checkbox');
  const stampSpot = row.querySelector('.element-stamp-spot');
  const leftArrow = row.querySelector('.nav-arrow-left');
  const rightArrow = row.querySelector('.nav-arrow-right');
  const key = row.getAttribute('data-element');
  if (!element) return;

  function hasStamp() {
    return !!(stampSpot && stampSpot.querySelector('img'));
  }

  // Checkboxes start disabled until their element is selected (and stamped)
  if (checkbox) checkbox.disabled = true;

  element.addEventListener('click', (e) => {
    // Don't toggle selection when clicking the checkbox itself
    if (e.target.classList.contains('element-checkbox')) return;

    const wasSelected = element.classList.contains('is-selected');

    // Deselect all elements first, and re-disable their checkboxes
    document.querySelectorAll('.article-row').forEach((r) => {
      const el = r.querySelector('.article-headline, .article-image, .article-content');
      const cb = r.querySelector('.element-checkbox');
      if (el) el.classList.remove('is-selected');
      if (cb && !cb.checked) cb.disabled = true;
    });

    // Deselect the bottom stamp preview too
    const stampPreview = document.getElementById('stamp-preview');
    if (stampPreview) stampPreview.classList.remove('is-selected');

    if (!wasSelected) {
      element.classList.add('is-selected');
      // Only allow checking if this element has already been stamped
      if (checkbox && !checkbox.checked) checkbox.disabled = !hasStamp();
      window.selectedStampTarget = key;
    } else {
      window.selectedStampTarget = null;
    }

    if (typeof updateYellowSwatchAvailability === 'function') {
      updateYellowSwatchAvailability();
    }
  });

  // Unhighlight the element once its checkbox is checked, and hide its arrows
  if (checkbox) {
    checkbox.addEventListener('click', (e) => {
      e.stopPropagation();
      // Block checking if there's no stamp yet (extra safety)
      if (!checkbox.checked && !hasStamp()) {
        e.preventDefault();
      }
    });

    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        element.classList.remove('is-selected');
        checkbox.disabled = true;
        if (leftArrow) leftArrow.style.display = 'none';
        if (rightArrow) rightArrow.style.display = 'none';
        if (window.selectedStampTarget === key) {
          window.selectedStampTarget = null;
        }
      }
      updateSwatchAvailability();
    });
  }
});

// Only the yellow swatch can be used to stamp elements until all
// three article elements have been checked off
function allElementsCheckedForSwatches() {
  const boxes = document.querySelectorAll('.element-checkbox');
  if (boxes.length === 0) return false;
  return Array.from(boxes).every((cb) => cb.checked);
}

function updateSwatchAvailability() {
  const ready = allElementsCheckedForSwatches();
  document.querySelectorAll('.stamp-swatch').forEach((swatch) => {
    if (swatch.classList.contains('stamp-yellow')) {
      swatch.disabled = false;
    } else {
      swatch.disabled = !ready;
    }
  });
}

updateSwatchAvailability();

// Map each stamp swatch color to its stamp graphic
const elementStampAssets = {
  'stamp-red': '../img/reject.png',
  'stamp-yellow': '../img/toredact.png',
  'stamp-green': '../img/approved.png'
};

// Clicking a stamp swatch fills the currently selected element's stamp spot
document.querySelectorAll('.stamp-swatch').forEach((swatch) => {
  swatch.addEventListener('click', () => {
    if (!window.selectedStampTarget || window.selectedStampTarget === 'preview') return;

    const spot = document.getElementById(`stamp-spot-${window.selectedStampTarget}`);
    if (!spot || spot.classList.contains('is-locked')) return;

    const colorClass = Object.keys(elementStampAssets).find((key) => swatch.classList.contains(key));
    const src = colorClass ? elementStampAssets[colorClass] : null;
    if (!src) return;

    spot.innerHTML = '';
    const img = document.createElement('img');
    img.src = src;
    img.alt = `${colorClass.replace('stamp-', '')} stamp`;
    spot.appendChild(img);

    // Now that this element has a stamp, allow checking its checkbox
    const checkbox = document.getElementById(`checkbox-${window.selectedStampTarget}`);
    if (checkbox && !checkbox.checked) checkbox.disabled = false;
  });
});