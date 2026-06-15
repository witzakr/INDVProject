// Plays a sound when the stamps shelf is toggled (opened or closed)
document.addEventListener('DOMContentLoaded', () => {
  const stampShelfSound = new Audio('../sounds/stampshelf.mp3');
  stampShelfSound.volume = 0.1; // adjust this value (0.0 to 1.0) to control loudness

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