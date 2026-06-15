// Map each swatch in the stamps popup to its stamp graphic asset
const stampAssets = {
  'stamp-red': '../img/reject.png',
  'stamp-yellow': '../img/toredact.png',
  'stamp-green': '../img/approved.png'
};

const stampPreview = document.getElementById('stamp-preview');

document.querySelectorAll('.stamp-swatch').forEach((swatch) => {
  swatch.addEventListener('click', () => {
    // Find which color class this swatch has
    const colorClass = Object.keys(stampAssets).find((key) => swatch.classList.contains(key));
    if (!colorClass || !stampPreview) return;

    const src = stampAssets[colorClass];

    // Clear the preview, then insert the chosen stamp image
    stampPreview.innerHTML = '';
    const img = document.createElement('img');
    img.src = src;
    img.alt = `${colorClass.replace('stamp-', '')} stamp`;
    stampPreview.appendChild(img);
  });
});