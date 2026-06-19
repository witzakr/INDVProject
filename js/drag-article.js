const articleCard = document.getElementById('article-card');
const dropZoneLeft = document.getElementById('drop-zone-left');
const pileLeft = document.getElementById('pile-left');
const pileApproved = document.getElementById('pile-approved');
const pileRejected = document.getElementById('pile-rejected');
const queueCount = document.getElementById('article-queue-count');
const headlineText = document.getElementById('article-headline-text');
const imageText = document.getElementById('article-image-text');
const contentText = document.getElementById('article-content-text');

// Total number of articles — add more JSON files and bump this number
const TOTAL_ARTICLES = 4;
let currentArticleIndex = 0;
let isReviewing = false;

// Currently loaded article data, and which variant (0-2) is shown per field
let currentArticleData = null;
const variantIndex = { headline: 0, image: 0, content: 0 };

async function fetchArticle(index) {
  try {
    const response = await fetch(`../articles/article${index + 1}.json`);
    return await response.json();
  } catch (e) {
    console.error(`Failed to load article${index + 1}.json`, e);
    return null;
  }
}

function renderVariant(field) {
  if (!currentArticleData) return;
  const values = currentArticleData[field];
  if (!Array.isArray(values)) return;

  const idx = variantIndex[field];
  const text = values[idx] || '';

  if (field === 'headline' && headlineText) headlineText.textContent = text;
  if (field === 'image' && imageText) imageText.textContent = text;
  if (field === 'content' && contentText) contentText.textContent = text;

  // The main variant (index 0) is always pre-stamped blue and locked;
  // any other variant clears the spot so it can be freely stamped
  const spot = document.getElementById(`stamp-spot-${field}`);
  if (spot) {
    if (idx === 0) {
      spot.innerHTML = '';
      const img = document.createElement('img');
      img.src = '../img/Watermark.png';
      img.alt = 'main stamp';
      spot.appendChild(img);
      spot.classList.add('is-locked');
    } else {
      spot.innerHTML = '';
      spot.classList.remove('is-locked');
    }
  }
}

function displayArticle(data) {
  if (!data) return;
  currentArticleData = data;
  variantIndex.headline = 0;
  variantIndex.image = 0;
  variantIndex.content = 0;

  // Reset per-element checkboxes and stamp spots for the new article
  document.querySelectorAll('.element-checkbox').forEach((cb) => {
    cb.checked = false;
    cb.disabled = true;
  });
  document.querySelectorAll('.element-stamp-spot').forEach((spot) => {
    spot.innerHTML = '';
    spot.classList.remove('is-locked');
  });
  document.querySelectorAll('.article-headline, .article-image, .article-content').forEach((el) => {
    el.classList.remove('is-selected');
  });
  document.querySelectorAll('.nav-arrow').forEach((arrow) => {
    arrow.style.display = '';
  });
  window.selectedStampTarget = null;

  // Reset the bottom stamp preview too
  const stampPreview = document.getElementById('stamp-preview');
  if (stampPreview) {
    stampPreview.innerHTML = '';
    stampPreview.classList.remove('is-selected');
    stampPreview.classList.add('is-locked');
  }

  if (typeof updateSwatchAvailability === 'function') {
    updateSwatchAvailability();
  }

  renderVariant('headline');
  renderVariant('image');
  renderVariant('content');

  // Editor panel
  if (data.editor) {
    const e = data.editor;
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val || ''; };
    set('editor-first-name', e.firstName);
    set('editor-last-name', e.lastName);
    set('editor-affiliation', e.affiliation);
    set('editor-occupation', e.occupation);
    set('editor-marital-status', e.maritalStatus);
    set('editor-reputation', e.reputation);
    set('editor-briefing', e.briefing);
  }

  // Memo panel
  if (data.memo) {
    const el = document.getElementById('memo-directive');
    if (el) el.textContent = data.memo.directive || '';
  }
}

function incrementQueue() {
  if (!queueCount) return;
  const [current, total] = queueCount.textContent.split('/').map((n) => parseInt(n, 10));
  if (isNaN(current) || isNaN(total)) return;
  const next = Math.min(current + 1, total);
  queueCount.textContent = `${next}/${total}`;
}

function addToPile(pile, stampSrc) {
  if (!pile) return;
  const card = document.createElement('div');
  card.className = 'pile-card';

  const offsetX = (Math.random() - 0.5) * 12;
  const offsetY = -pile.children.length * 4;
  const rotation = (Math.random() - 0.5) * 10;

  card.style.transform = `translate(${offsetX}px, ${offsetY}px) rotate(${rotation}deg)`;

  if (stampSrc) {
    const img = document.createElement('img');
    img.src = stampSrc;
    img.className = 'pile-card-stamp';
    img.alt = '';
    card.appendChild(img);
  }

  pile.appendChild(card);
}

function removeFromPile(pile) {
  if (!pile || pile.children.length === 0) return;
  pile.removeChild(pile.lastElementChild);
}

function showArticle() {
  if (!articleCard) return;
  articleCard.classList.remove('is-hidden', 'is-appearing');
  // restart animation
  requestAnimationFrame(() => {
    articleCard.classList.add('is-appearing');
  });
  isReviewing = true;
}

function hideArticle() {
  if (!articleCard) return;
  articleCard.classList.add('is-hidden');
  articleCard.classList.remove('is-appearing');
  isReviewing = false;
}

// Initialize: left pile starts with 4 stacked cards (article-queue total),
// article card starts hidden until a card is picked from the pile
for (let i = 0; i < 4; i++) {
  addToPile(pileLeft);
}
hideArticle();

// Click the left (unredacted) pile to bring the top article into review
if (dropZoneLeft) {
  dropZoneLeft.addEventListener('click', async () => {
    if (isReviewing) return;
    if (!pileLeft || pileLeft.children.length === 0) return;

    const data = await fetchArticle(currentArticleIndex);
    if (!data) return;

    removeFromPile(pileLeft);
    displayArticle(data);
    showArticle();
  });
}

// Wire up the left/right arrows on each article row to cycle through variants
document.querySelectorAll('.article-row').forEach((row) => {
  const field = row.getAttribute('data-element');
  const leftArrow = row.querySelector('.nav-arrow-left');
  const rightArrow = row.querySelector('.nav-arrow-right');
  if (!field) return;

  if (leftArrow) {
    leftArrow.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!currentArticleData || !Array.isArray(currentArticleData[field])) return;
      const total = currentArticleData[field].length;
      variantIndex[field] = (variantIndex[field] - 1 + total) % total;
      renderVariant(field);
    });
  }

  if (rightArrow) {
    rightArrow.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!currentArticleData || !Array.isArray(currentArticleData[field])) return;
      const total = currentArticleData[field].length;
      variantIndex[field] = (variantIndex[field] + 1) % total;
      renderVariant(field);
    });
  }
});

// Called once the bottom stamp spot is stamped (green = approved, red = rejected).
// Moves the article into the matching pile and brings up the next one.
window.finalizeArticleReview = function (outcome) {
  const stampSrc = outcome === 'approved' ? '../img/approved.png' : '../img/reject.png';
  const targetPile = outcome === 'approved' ? pileApproved : pileRejected;

  addToPile(targetPile, stampSrc);
  incrementQueue();
  hideArticle();

  if (currentArticleIndex < TOTAL_ARTICLES - 1) {
    currentArticleIndex += 1;
  }
};