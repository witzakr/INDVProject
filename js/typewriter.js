// Plays a typewriter click sound on every button / link-button interaction
document.addEventListener('DOMContentLoaded', () => {
  const clickSound = new Audio('../sounds/typeclick.mp3');

  const playClick = () => {
    // Clone so rapid clicks can overlap without cutting each other off
    const sound = clickSound.cloneNode();
    sound.play().catch(() => {
      // Ignore errors (e.g. if browser blocks autoplay before user interaction)
    });
  };

  const selectors = [
    '#approve-btn'
  ];

  document.querySelectorAll(selectors.join(', ')).forEach((el) => {
    el.addEventListener('click', playClick);
  });
});