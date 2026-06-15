const articleCard = document.getElementById('article-card');
const dropZoneLeft = document.getElementById('drop-zone-left');
const dropZoneRight = document.getElementById('drop-zone-right');
const pileLeft = document.getElementById('pile-left');
const pileRight = document.getElementById('pile-right');
const queueCount = document.getElementById('article-queue-count');
const headlineText = document.getElementById('article-headline-text');
const imageText = document.getElementById('article-image-text');
const contentText = document.getElementById('article-content-text');

const TOTAL_ARTICLES = 4;
let currentArticleIndex = 0;
let isReviewing = false;

async function fetchArticle(index) {
  try {
    const response = await fetch(`../articles/article${index + 1}.json`);
    return await response.json();
  } catch (e) {
    console.error(`Failed to load article${index + 1}.json`, e);
    return null;
  }
}

function displayArticle(data) {
  if (!data) return;
  if (headlineText) headlineText.textContent = data.headline || '';
  if (imageText) imageText.textContent = data.image || '';
  if (contentText) contentText.textContent = data.content || '';

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


for (let i = 0; i < 4; i++) {
  addToPile(pileLeft);
}
hideArticle();


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


const pileStampAssets = {
  'stamp-red': '../img/reject.png',
  'stamp-yellow': '../img/toredact.png',
  'stamp-green': '../img/approved.png'
};


document.querySelectorAll('.stamp-swatch').forEach((swatch) => {
  swatch.addEventListener('click', () => {
    if (!isReviewing) return;

    const colorClass = Object.keys(pileStampAssets).find((key) => swatch.classList.contains(key));
    const stampSrc = colorClass ? pileStampAssets[colorClass] : null;

    addToPile(pileRight, stampSrc);
    incrementQueue();
    hideArticle();
    closeStampsShelf();

    if (currentArticleIndex < TOTAL_ARTICLES - 1) {
      currentArticleIndex += 1;
    }
  });
});

function closeStampsShelf() {
  const stampsToggle = document.getElementById('stamps-toggle');
  const stampsPopup = document.getElementById('stamps-popup');
  if (!stampsToggle || !stampsPopup) return;

  stampsPopup.classList.remove('is-open');
  stampsToggle.innerHTML = '&#8593;';
  stampsToggle.setAttribute('aria-expanded', 'false');
}