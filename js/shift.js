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