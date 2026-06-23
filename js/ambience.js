document.addEventListener('DOMContentLoaded', () => {
  const ambientSound = new Audio('/ounds/office-ambience.mp3');
  ambientSound.loop = true;
  ambientSound.volume = 0.8;
  ambientSound.muted = true;

  ambientSound.play().catch(() => {});

  const activate = () => {
    ambientSound.muted = false;
    if (ambientSound.paused) {
      ambientSound.play().catch(() => {});
    }
    document.removeEventListener('click', activate);
    document.removeEventListener('keydown', activate);
    document.removeEventListener('touchstart', activate);
  };

  document.addEventListener('click', activate);
  document.addEventListener('keydown', activate);
  document.addEventListener('touchstart', activate);
});