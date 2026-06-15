// Retrieve user data from registration
const firstName = sessionStorage.getItem('firstName') || 'John, F.';
const lastName = sessionStorage.getItem('lastName') || 'Smith';
const age = sessionStorage.getItem('age');

document.getElementById('id-first-name').textContent = firstName;
document.getElementById('id-last-name').textContent = lastName;

// Generate issue date (today) and expiry date (+5 years), in DD.MM.YYY-style format
function formatDate(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

const issued = new Date();
const expires = new Date();
expires.setFullYear(expires.getFullYear() + 5);

document.getElementById('id-issued').textContent = formatDate(issued);
document.getElementById('id-expires').textContent = formatDate(expires);

// Generate a unique ID code, e.g. SJF534T6
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

document.getElementById('id-code').textContent = generateIdCode(firstName, lastName);

// Approve button: stamps the watermark and unlocks "Start Shift"
const approveBtn = document.getElementById('approve-btn');
const watermark = document.getElementById('id-watermark');
const startShiftBtn = document.getElementById('start-shift-btn');

if (approveBtn) {
  approveBtn.addEventListener('click', () => {
    watermark.classList.add('is-approved');
    startShiftBtn.classList.remove('is-disabled');
    startShiftBtn.removeAttribute('aria-disabled');
    approveBtn.disabled = true;
    approveBtn.textContent = 'Approved';
  });
}

// Flip card on click / keyboard activation
const flipCard = document.getElementById('id-card-flip');
if (flipCard) {
  const toggleFlip = () => {
    const flipped = flipCard.classList.toggle('is-flipped');
    flipCard.setAttribute('aria-pressed', flipped ? 'true' : 'false');
  };

  flipCard.addEventListener('click', toggleFlip);
  flipCard.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleFlip();
    }
  });
}