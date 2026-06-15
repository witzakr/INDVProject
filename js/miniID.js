// Populate the mini ID card with the same data used on id.html
const firstName = sessionStorage.getItem('firstName') || 'John, F.';
const lastName = sessionStorage.getItem('lastName') || 'Smith';

document.getElementById('mini-id-first-name').textContent = firstName;
document.getElementById('mini-id-last-name').textContent = lastName;

function formatDate(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

const issued = new Date();
const expires = new Date();
expires.setFullYear(expires.getFullYear() + 5);

document.getElementById('mini-id-issued').textContent = formatDate(issued);
document.getElementById('mini-id-expires').textContent = formatDate(expires);

function generateIdCode(first, last) {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const digits = '0123456789';

  const initials =
    (last?.[0] || 'X').toUpperCase() +
    (first?.[0] || 'X').toUpperCase();

  let middle = '';
  for (let i = 0; i < 3; i++) {
    middle += digits[Math.floor(Math.random() * digits.length)];
  }

  let tail = letters[Math.floor(Math.random() * letters.length)] +
             digits[Math.floor(Math.random() * digits.length)];

  return `${initials}${middle}${tail}`;
}

document.getElementById('mini-id-code').textContent = generateIdCode(firstName, lastName);

// Flip the mini ID card on click / keyboard activation
const miniFlipCard = document.getElementById('mini-id-card-flip');
if (miniFlipCard) {
  const toggleFlip = () => {
    const flipped = miniFlipCard.classList.toggle('is-flipped');
    miniFlipCard.setAttribute('aria-pressed', flipped ? 'true' : 'false');
  };

  miniFlipCard.addEventListener('click', toggleFlip);
  miniFlipCard.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleFlip();
    }
  });
}