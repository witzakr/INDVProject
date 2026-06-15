// Plays a sound when the stamps shelf is toggled (opened or closed)
document.addEventListener('DOMContentLoaded', () => {
  const stampShelfSound = new Audio('../sounds/stampshelf.mp3');

  const playStampShelf = () => {
    const sound = stampShelfSound.cloneNode();
    sound.play().catch(() => {
      // Ignore errors (e.g. if browser blocks autoplay before user interaction)
    });
  };

  const stampsToggle = document.getElementById('stamps-toggle');

  if (stampsToggle) {
    stampsToggle.addEventListener('click', playStampShelf);
  }
});