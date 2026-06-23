class MiniIDCard {
  constructor() {
    const firstName = sessionStorage.getItem('firstName') || 'John, F.';
    const lastName  = sessionStorage.getItem('lastName')  || 'Smith';

    this._set('mini-id-first-name', firstName);
    this._set('mini-id-last-name',  lastName);

    const now     = new Date();
    const expires = new Date();
    expires.setFullYear(now.getFullYear() + 5);

    this._set('mini-id-issued',  this._fmt(now));
    this._set('mini-id-expires', this._fmt(expires));
    this._set('mini-id-code',    this._genCode(firstName, lastName));

    this._initFlip();
  }

  _set(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  _fmt(date) {
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    return `${d}.${m}.${date.getFullYear()}`;
  }

  _genCode(first, last) {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const digits  = '0123456789';
    const initials = [(last[0] || 'X'), (first[0] || 'X')].join('').toUpperCase();
    const middle   = Array.from({ length: 3 }, () => digits[Math.floor(Math.random() * 10)]).join('');
    const tail     = letters[Math.floor(Math.random() * 26)] + digits[Math.floor(Math.random() * 10)];
    return `${initials}${middle}${tail}`;
  }

  _initFlip() {
    const card = document.getElementById('mini-id-card-flip');
    if (!card) return;

    const toggle = () => {
      const flipped = card.classList.toggle('is-flipped');
      card.setAttribute('aria-pressed', String(flipped));
    };

    card.addEventListener('click', toggle);
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    });
  }
}
