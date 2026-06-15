const articleCard = document.getElementById('article-card');
const dropZoneLeft = document.getElementById('drop-zone-left');
const dropZoneRight = document.getElementById('drop-zone-right');
const pileLeft = document.getElementById('pile-left');
const pileRight = document.getElementById('pile-right');
const queueCount = document.getElementById('article-queue-count');
const headlineText = document.getElementById('article-headline-text');
const imageText = document.getElementById('article-image-text');
const contentText = document.getElementById('article-content-text');

// Article content queue. Index 0 is shown first.
const articles = [
  { headline: 'Headline', image: 'Article Image', content: 'Article Content' },
  { headline: 'Headline 2', image: 'Article Image 2', content: 'Article Content 2' },
  { headline: 'Headline 3', image: 'Article Image 3', content: 'Article Content 3' },
  { headline: 'Headline 4', image: 'Article Image 4', content: 'Article Content 4' }
];

let currentArticleIndex = 0;
let isReviewing = false;

function loadArticle(index) {
  if (index >= articles.length) return;
  const article = articles[index];
  if (headlineText) headlineText.textContent = article.headline;
  if (imageText) imageText.textContent = article.image;
  if (contentText) contentText.textContent = article.content;
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
  dropZoneLeft.addEventListener('click', () => {
    if (isReviewing) return;
    if (!pileLeft || pileLeft.children.length === 0) return;

    removeFromPile(pileLeft);
    loadArticle(currentArticleIndex);
    showArticle();
  });
}

// Map each stamp color to the redacted-pile stamp graphic
const pileStampAssets = {
  'stamp-red': '../img/reject.png',
  'stamp-yellow': '../img/toredact.png',
  'stamp-green': '../img/approved.png'
};

// Clicking a stamp sends the reviewed article to the redacted pile,
// marked with that stamp's image
document.querySelectorAll('.stamp-swatch').forEach((swatch) => {
  swatch.addEventListener('click', () => {
    if (!isReviewing) return;

    const colorClass = Object.keys(pileStampAssets).find((key) => swatch.classList.contains(key));
    const stampSrc = colorClass ? pileStampAssets[colorClass] : null;

    addToPile(pileRight, stampSrc);
    incrementQueue();
    hideArticle();
    closeStampsShelf();

    if (currentArticleIndex < articles.length - 1) {
      currentArticleIndex += 1;
    }
  });
});

// Close the stamps shelf popup
function closeStampsShelf() {
  const stampsToggle = document.getElementById('stamps-toggle');
  const stampsPopup = document.getElementById('stamps-popup');
  if (!stampsToggle || !stampsPopup) return;

  stampsPopup.classList.remove('is-open');
  stampsToggle.innerHTML = '&#8593;';
  stampsToggle.setAttribute('aria-expanded', 'false');
}