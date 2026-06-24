class ArticleManager {
  constructor() {
    this.TOTAL    = 4;
    this.index    = 0;
    this.data     = null;
    this.variants = { headline: 0, image: 0, content: 0 };

    this.card        = document.getElementById('article-card');
    this.headlineEl  = document.getElementById('article-headline-text');
    this.imageEl     = document.getElementById('article-image-text');
    this.contentEl   = document.getElementById('article-content-text');
    this.queueCount  = document.getElementById('article-queue-count');
  }

  async fetch(index) {
    try {
      const res = await fetch(`../articles/article${index + 1}.json`);
      return await res.json();
    } catch (e) {
      console.error(`Failed to load article${index + 1}.json`, e);
      return null;
    }
  }

  renderVariant(field) {
    if (!this.data) return;
    const values = this.data[field];
    if (!Array.isArray(values)) return;

    const idx  = this.variants[field];
    const text = values[idx] || '';

    if (field === 'headline' && this.headlineEl) this.headlineEl.textContent = text;
    if (field === 'image'    && this.imageEl)    this.imageEl.textContent    = text;
    if (field === 'content'  && this.contentEl)  this.contentEl.textContent  = text;

    // Main variant (index 0) gets the locked blue watermark stamp
    const spot = document.getElementById(`stamp-spot-${field}`);
    if (spot) {
      if (idx === 0) {
        spot.innerHTML = '';
        const img = document.createElement('img');
        img.src = '../img/Watermark.png';
        img.alt = '';
        spot.appendChild(img);
        spot.classList.add('is-locked');
      } else {
        spot.innerHTML = '';
        spot.classList.remove('is-locked');
      }
    }
  }

  cycleVariant(field, direction) {
    if (!this.data || !Array.isArray(this.data[field])) return;
    const total = this.data[field].length;
    this.variants[field] = (this.variants[field] + direction + total) % total;
    this.renderVariant(field);
  }

  loadData(data) {
    this.data = data;
    this.variants = { headline: 0, image: 0, content: 0 };

    // Reset UI state for new article
    document.querySelectorAll('.element-checkbox').forEach(cb => {
      cb.checked = false;
      cb.disabled = true;
    });
    document.querySelectorAll('.element-stamp-spot').forEach(spot => {
      spot.innerHTML = '';
      spot.classList.remove('is-locked');
    });
    document.querySelectorAll('.article-headline, .article-image, .article-content').forEach(el => {
      el.classList.remove('is-selected');
    });
    document.querySelectorAll('.nav-arrow').forEach(arrow => {
      arrow.style.display = '';
    });
    window.selectedStampTarget = null;

    const preview = document.getElementById('stamp-preview');
    if (preview) {
      preview.innerHTML = '';
      preview.classList.add('is-locked');
    }

    this.renderVariant('headline');
    this.renderVariant('image');
    this.renderVariant('content');

    // Populate editor panel
    if (data.editor) {
      const e = data.editor;
      const set = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val || '';
      };
      set('editor-first-name',    e.firstName);
      set('editor-last-name',     e.lastName);
      set('editor-affiliation',   e.affiliation);
      set('editor-occupation',    e.occupation);
      set('editor-marital-status', e.maritalStatus);
      set('editor-reputation',    e.reputation);
      set('editor-briefing',      e.briefing);
    }

    // Populate memo panel
    if (data.memo) {
      const el = document.getElementById('memo-directive');
      if (el) el.textContent = data.memo.directive || '';
    }
  }

  showCard() {
    if (!this.card) return;
    this.card.classList.remove('is-hidden', 'is-appearing');
    requestAnimationFrame(() => this.card.classList.add('is-appearing'));
  }

  hideCard() {
    if (!this.card) return;
    this.card.classList.add('is-hidden');
    this.card.classList.remove('is-appearing');
  }

  incrementQueue() {
    if (!this.queueCount) return;
    const [current, total] = this.queueCount.textContent.split('/').map(Number);
    if (!isNaN(current) && !isNaN(total)) {
      this.queueCount.textContent = `${Math.min(current + 1, total)}/${total}`;
    }
  }

  advance() {
    if (this.index < this.TOTAL - 1) this.index++;
  }

  get hasMore() {
    return this.index < this.TOTAL - 1;
  }
}