class EndScreen {
  constructor() {
    this.tiers = [
      {
        min: 18,
        status: 'COMMENDED',
        consequence: 'Your loyalty has been noted. The State is pleased. Continue your service without concern.',
        stamp: '../img/approved.png'
      },
      {
        min: 13,
        status: 'RETAINED',
        consequence: 'Your performance is acceptable. A routine review has been scheduled. No immediate action required.',
        stamp: '../img/approved.png'
      },
      {
        min: 8,
        status: 'ON PROBATION',
        consequence: 'Irregularities in your decisions have been logged. Your household registration has been flagged. You will be monitored.',
        stamp: '../img/toredact.png'
      },
      {
        min: 4,
        status: 'SUSPENDED',
        consequence: 'Your file has been forwarded to the Bureau of Civil Compliance. Your family has been informed of your status. Do not leave your registered address.',
        stamp: '../img/reject.png'
      },
      {
        min: 0,
        status: 'UNDER INVESTIGATION',
        consequence: 'Your actions have been deemed a threat to civil order. This terminal has been locked. A representative will arrive shortly.',
        stamp: '../img/reject.png'
      }
    ];

    this._render();
  }

  _getTier(score) {
    return this.tiers.find(t => score >= t.min);
  }

  _formatTime(seconds) {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
  }

  _render() {
    const score        = parseInt(sessionStorage.getItem('endScore') || '0', 10);
    const articles     = parseInt(sessionStorage.getItem('endArticles') || '0', 10);
    const timeSeconds  = parseInt(sessionStorage.getItem('endTime') || '0', 10);
    const firstName    = sessionStorage.getItem('firstName') || '—';
    const lastName     = sessionStorage.getItem('lastName')  || '—';

    const tier = this._getTier(score);

    this._set('end-employee-name', `${lastName}, ${firstName}`);
    this._set('end-articles',  `${articles} / 4`);
    this._set('end-score',     `${score} / 20`);
    this._set('end-time',      this._formatTime(timeSeconds));
    this._set('end-verdict',   tier.status);
    this._set('end-consequence', tier.consequence);

    // Stamp the result
    const stampEl = document.getElementById('end-stamp');
    if (stampEl && tier.stamp) {
      const img = document.createElement('img');
      img.src = tier.stamp;
      img.alt = tier.status;
      img.className = 'end-stamp-img';
      stampEl.appendChild(img);
    }

    // Apply verdict colour class
    const verdictEl = document.getElementById('end-verdict');
    if (verdictEl) {
      if (score >= 13)     verdictEl.classList.add('verdict-good');
      else if (score >= 8) verdictEl.classList.add('verdict-warn');
      else                 verdictEl.classList.add('verdict-bad');
    }

    // Typewrite the consequence text for atmosphere
    this._typewrite('end-consequence', tier.consequence);
  }

  _set(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  _typewrite(id, text, speed = 28) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = '';
    let i = 0;
    const tick = () => {
      if (i < text.length) {
        el.textContent += text[i++];
        setTimeout(tick, speed);
      }
    };
    setTimeout(tick, 600);
  }
}

document.addEventListener('DOMContentLoaded', () => new EndScreen());
