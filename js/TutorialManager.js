class TutorialManager {
  constructor() {
    this.steps = [
      { target: 'drop-zone-left',       title: 'Pending Pile',        text: 'This is your stack of pending articles. Click it to pull the top article into the review slot.' },
      { target: 'article-slot',         title: 'Review Slot',         text: 'Articles appear here once pulled from the pending pile. This is where you review each article before making a decision.' },
      { target: 'article-card',         title: 'Article Elements',    text: 'Each article has three parts: headline, image, and content. Click an element to select it, then use the arrows to switch between variants.' },
      { target: 'stamps-rack',          title: 'Stamp Rack',          text: 'Use the yellow stamp to mark individual article elements. Once all elements are checked, red and green unlock for the final verdict.' },
      { target: 'stamp-preview',        title: 'Final Verdict Stamp', text: 'Once all three elements are checked, stamp this spot with green (approved) or red (rejected) to finalize the article.' },
      { target: 'editor-toggle',        title: 'Editor Report',       text: 'Click here to open the Editor Report — background info about the article\'s author.' },
      { target: 'memo-toggle',          title: 'Memo',                text: 'Click here to open the Memo — your directive for this article.' },
      { target: 'drop-zone-right-group',title: 'Approved & Rejected', text: 'Articles you approve go to the Approved pile. Articles you reject go to the Rejected pile.' },
      { target: 'article-queue-count',  title: 'Article Queue',       text: 'This tracks your progress through the current shift. Complete all articles before your shift ends.' }
    ];

    this.current = 0;
    this._buildDOM();
    this._bindInfoButton();
  }

  _buildDOM() {
    const overlay = document.createElement('div');
    overlay.id = 'tutorial-overlay';
    overlay.innerHTML = `
      <div class="tutorial-spotlight" id="tutorial-spotlight"></div>
      <div class="tutorial-tooltip" id="tutorial-tooltip">
        <h3 class="tutorial-tooltip-title" id="tutorial-tooltip-title"></h3>
        <p class="tutorial-tooltip-text" id="tutorial-tooltip-text"></p>
        <div class="tutorial-tooltip-nav">
          <button type="button" id="tutorial-prev" class="tutorial-btn">&#8592; Back</button>
          <span class="tutorial-step-count" id="tutorial-step-count"></span>
          <button type="button" id="tutorial-next" class="tutorial-btn">Next &#8594;</button>
        </div>
        <button type="button" id="tutorial-close" class="tutorial-close">✕ Close</button>
      </div>
    `;
    document.body.appendChild(overlay);

    this.overlay    = overlay;
    this.spotlight  = document.getElementById('tutorial-spotlight');
    this.tooltip    = document.getElementById('tutorial-tooltip');
    this.titleEl    = document.getElementById('tutorial-tooltip-title');
    this.textEl     = document.getElementById('tutorial-tooltip-text');
    this.stepCount  = document.getElementById('tutorial-step-count');
    this.prevBtn    = document.getElementById('tutorial-prev');
    this.nextBtn    = document.getElementById('tutorial-next');
    this.closeBtn   = document.getElementById('tutorial-close');

    this.prevBtn.addEventListener('click',  () => this._prev());
    this.nextBtn.addEventListener('click',  () => this._next());
    this.closeBtn.addEventListener('click', () => this.close());
    this.overlay.addEventListener('click',  e => { if (e.target === this.overlay) this.close(); });
  }

  _bindInfoButton() {
    const btn = document.getElementById('info-btn');
    if (btn) btn.addEventListener('click', () => this.open());
  }

  _getTarget(step) {
    return document.getElementById(step.target) || document.querySelector(`.${step.target}`);
  }

  _positionSpotlight(el) {
    if (!el) { this.spotlight.style.display = 'none'; return; }
    const r = el.getBoundingClientRect(), pad = 12;
    Object.assign(this.spotlight.style, {
      display: 'block',
      top:    `${r.top  - pad}px`,
      left:   `${r.left - pad}px`,
      width:  `${r.width  + pad * 2}px`,
      height: `${r.height + pad * 2}px`
    });
  }

  _positionTooltip(el) {
    const vw = window.innerWidth, vh = window.innerHeight;
    const tw = 300, th = 200, pad = 20;
    if (!el) {
      Object.assign(this.tooltip.style, { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' });
      return;
    }
    const r = el.getBoundingClientRect();
    let top = r.bottom + pad < vh ? r.bottom + pad : r.top - th - pad;
    top = Math.max(pad, Math.min(top, vh - th - pad));
    let left = r.left + r.width / 2 - tw / 2;
    left = Math.max(pad, Math.min(left, vw - tw - pad));
    Object.assign(this.tooltip.style, { top: `${top}px`, left: `${left}px`, transform: 'none' });
  }

  _showStep(index) {
    const step = this.steps[index];
    const el   = this._getTarget(step);

    this.titleEl.textContent = step.title;
    this.textEl.textContent  = step.text;
    this.stepCount.textContent = `${index + 1} / ${this.steps.length}`;
    this.prevBtn.disabled = index === 0;
    this.nextBtn.innerHTML = index === this.steps.length - 1 ? 'Finish ✓' : 'Next &#8594;';

    this._positionSpotlight(el);
    this._positionTooltip(el);

    this.tooltip.classList.remove('tutorial-tooltip-enter');
    requestAnimationFrame(() => this.tooltip.classList.add('tutorial-tooltip-enter'));
  }

  _prev() { if (this.current > 0) this._showStep(--this.current); }
  _next() {
    if (this.current < this.steps.length - 1) this._showStep(++this.current);
    else this.close();
  }

  open()  { this.current = 0; this.overlay.classList.add('is-visible'); this._showStep(0); }
  close() { this.overlay.classList.remove('is-visible'); this.spotlight.style.display = 'none'; }
}
