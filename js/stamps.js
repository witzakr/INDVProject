// Map each swatch in the stamps popup to its stamp graphic asset
const stampAssets = {
  'stamp-red': '../img/reject.png',
  'stamp-yellow': '../img/toredact.png',
  'stamp-green': '../img/approved.png'
};

const stampPreview = document.getElementById('stamp-preview');

function allElementsChecked() {
  const boxes = document.querySelectorAll('.element-checkbox');
  if (boxes.length === 0) return false;
  return Array.from(boxes).every((cb) => cb.checked);
}

function updatePreviewLockState() {
  if (!stampPreview) return;
  stampPreview.classList.toggle('is-locked', !allElementsChecked());
  updateYellowSwatchAvailability();
}

// Re-check lock state whenever any checkbox changes
document.querySelectorAll('.element-checkbox').forEach((cb) => {
  cb.addEventListener('change', updatePreviewLockState);
});
updatePreviewLockState();

// Grey out the yellow swatch once all elements are checked
// (only red/green are valid for the final article-level stamp)
function updateYellowSwatchAvailability() {
  const yellowSwatch = document.querySelector('.stamp-swatch.stamp-yellow');
  if (!yellowSwatch) return;
  yellowSwatch.disabled = allElementsChecked();
}

updateYellowSwatchAvailability();

document.querySelectorAll('.stamp-swatch').forEach((swatch) => {
  swatch.addEventListener('click', () => {
    if (!stampPreview || !allElementsChecked()) return;

    // Only red (reject) or green (approved) can be used for the final stamp
    if (swatch.classList.contains('stamp-yellow')) return;

    // Find which color class this swatch has
    const colorClass = Object.keys(stampAssets).find((key) => swatch.classList.contains(key));
    if (!colorClass) return;

    const src = stampAssets[colorClass];

    // Clear the preview, then insert the chosen stamp image with a pop animation
    stampPreview.innerHTML = '';
    const img = document.createElement('img');
    img.src = src;
    img.alt = `${colorClass.replace('stamp-', '')} stamp`;
    img.className = 'preview-stamp-pop';
    stampPreview.appendChild(img);

    // Let the stamp animation play for a moment before moving the article on
    setTimeout(() => {
      // Move the article to the matching pile and bring up the next one
      if (typeof window.finalizeArticleReview === 'function') {
        const outcome = colorClass === 'stamp-green' ? 'approved' : 'rejected';
        window.finalizeArticleReview(outcome);
      }

      // Clear the preview now that the article has moved to its pile
      stampPreview.innerHTML = '';
      stampPreview.classList.add('is-locked');
    }, 700);
  });
});