document.addEventListener('DOMContentLoaded', () => {
  // Shared state for which element/spot is currently selected for stamping
  window.selectedStampTarget = null;

  // --- Instantiate all managers ---
  const sounds  = new SoundManager();
  const piles   = new PileManager();
  const article = new ArticleManager();
  const review  = new ReviewManager(() => {});
  const stamps  = new StampManager(review, sounds, onFinalize);
  const ui      = new UIManager(sounds);
  const miniID  = new MiniIDCard();
  const tutorial = new TutorialManager();

  // --- Initialise the pending pile ---
  piles.initPending(article.TOTAL);
  article.hideCard();

  // --- Wire article arrows ---
  document.querySelectorAll('.article-row').forEach(row => {
    const field      = row.getAttribute('data-element');
    const leftArrow  = row.querySelector('.nav-arrow-left');
    const rightArrow = row.querySelector('.nav-arrow-right');
    if (!field) return;

    leftArrow?.addEventListener('click', e => {
      e.stopPropagation();
      article.cycleVariant(field, -1);
    });
    rightArrow?.addEventListener('click', e => {
      e.stopPropagation();
      article.cycleVariant(field, 1);
    });
  });

  // --- Pending pile click: pull top article into review ---
  const dropZoneLeft = document.getElementById('drop-zone-left');
  if (dropZoneLeft) {
    dropZoneLeft.addEventListener('click', async () => {
      if (article.card && !article.card.classList.contains('is-hidden')) return;
      if (piles.pendingCount === 0) return;

      const data = await article.fetch(article.index);
      if (!data) return;

      piles.takePending();
      article.loadData(data);
      article.showCard();
      review.reset();
      sounds.playDrawer();
    });
  }

  // --- Finalize: send article to approved/rejected pile ---
  function onFinalize(outcome, stampSrc) {
    if (outcome === 'approved') piles.sendToApproved(stampSrc);
    else                        piles.sendToRejected(stampSrc);
    article.incrementQueue();
    article.hideCard();
    article.advance();
  }
});