class IDCard {
  constructor() {
    this.firstName = sessionStorage.getItem('firstName') || 'John, F.';
    this.lastName  = sessionStorage.getItem('lastName')  || 'Smith';

    this._populateFields();
    this._initApproveButton();
    this._initFlip();
  }

  _set(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  _formatDate(date) {
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    return `${d}.${m}.${date.getFullYear()}`;
  }

  _generateCode(first, last) {
    const L = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const D = '0123456789';
    const initials = [(last?.[0] || 'X'), (first?.[0] || 'X')].join('').toUpperCase();
    const middle   = Array.from({ length: 3 }, () => D[Math.floor(Math.random() * 10)]).join('');
    const tail     = L[Math.floor(Math.random() * 26)] + D[Math.floor(Math.random() * 10)];
    return `${initials}${middle}${tail}`;
  }

  _populateFields() {
    this._set('id-first-name', this.firstName);
    this._set('id-last-name',  this.lastName);
    this._set('id-code',       this._generateCode(this.firstName, this.lastName));

    const issued  = new Date();
    const expires = new Date();
    expires.setFullYear(issued.getFullYear() + 5);

    this._set('id-issued',  this._formatDate(issued));
    this._set('id-expires', this._formatDate(expires));
  }

  _initApproveButton() {
    const approveBtn    = document.getElementById('approve-btn');
    const watermark     = document.getElementById('id-watermark');
    const startShiftBtn = document.getElementById('start-shift-btn');
    if (!approveBtn) return;

    const clickSound = new Audio('../sounds/stamp.mp3');

    approveBtn.addEventListener('click', () => {
      const s = clickSound.cloneNode();
      s.play().catch(() => {});

      watermark?.classList.add('is-approved');
      startShiftBtn?.classList.remove('is-disabled');
      startShiftBtn?.removeAttribute('aria-disabled');
      approveBtn.disabled     = true;
      approveBtn.textContent  = 'Approved';
    });
  }

  _initFlip() {
    const card = document.getElementById('id-card-flip');
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

document.addEventListener('DOMContentLoaded', () => new IDCard());