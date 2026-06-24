class TutorialManager {
  constructor() {
    this.steps = [
      {
        target: 'drop-zone-left',
        title:  'CIVIC-7 // INITIALISING',
        text:   'Welcome, Employee. I am CIVIC-7, your assigned compliance monitoring unit. The stack to your left contains your assigned articles for this shift. Select the top document to begin processing.'
      },
      {
        target: 'article-slot',
        title:  'CIVIC-7 // REVIEW SLOT',
        text:   'Once retrieved, the document will appear here for your assessment. You are expected to review each element carefully before proceeding.'
      },
      {
        target: 'article-card',
        title:  'CIVIC-7 // DOCUMENT COMPONENTS',
        text:   'Each document contains three components: headline, image, and content. Use the arrows to cycle through available variants. Select a component to begin your evaluation.'
      },
      {
        target: 'stamps-rack',
        title:  'CIVIC-7 // STAMP PROTOCOL',
        text:   'The yellow stamp is used to mark individual components during review. Red and green become available only once all components have been evaluated.'
      },
      {
        target: 'stamp-preview',
        title:  'CIVIC-7 // FINAL VERDICT',
        text:   'When all components are assessed, apply your final verdict here. Green indicates compliance. Red indicates rejection. Choose carefully — your decisions are logged.'
      },
      {
        target: 'editor-toggle',
        title:  'CIVIC-7 // EDITOR INTELLIGENCE',
        text:   'This panel contains background intelligence on the article\'s author. Cross-reference their profile with the directive before making your assessment.'
      },
      {
        target: 'memo-toggle',
        title:  'CIVIC-7 // DIRECTIVE',
        text:   'Your directive for this document is contained here. It outlines what the State requires. Deviation from the directive is noted.'
      },
      {
        target: 'drop-zone-right-group',
        title:  'CIVIC-7 // DOCUMENT FILING',
        text:   'Compliant documents are filed to the right. Non-compliant documents are also filed to the right. The State reviews all outcomes.'
      },
      {
        target: 'article-queue-count',
        title:  'CIVIC-7 // SHIFT PROGRESS',
        text:   'This displays your processing progress. Complete all assigned documents before your shift expires. Failure to do so is recorded.'
      }
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