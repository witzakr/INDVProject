// Plays a stamp sound effect when a stamp is selected or placed
document.addEventListener('DOMContentLoaded', () => {
  const stampSound = new Audio('../sounds/stamp.mp3');

  const playStamp = () => {
    const sound = stampSound.cloneNode();
    sound.play().catch(() => {
      // Ignore errors (e.g. if browser blocks autoplay before user interaction)
    });
  };

  document.querySelectorAll('.stamp-swatch').forEach((swatch) => {
    swatch.addEventListener('click', playStamp);
  });
});