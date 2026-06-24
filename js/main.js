document.addEventListener('DOMContentLoaded', () => {
  window.selectedStampTarget = null;

  // --- Instantiate all managers ---
  const sounds   = new SoundManager();
  const piles    = new PileManager();
  const article  = new ArticleManager();
  const review   = new ReviewManager(() => {});
  const stamps   = new StampManager(review, sounds, onFinalize);
  const ui       = new UIManager(sounds);
  const miniID   = new MiniIDCard();
  const tutorial = new TutorialManager();

  // --- Scoring ---
  let totalScore    = 0;
  let articlesProcessed = 0;
  const shiftStart  = Date.now();

  // --- Initialise pending pile ---
  piles.initPending(article.TOTAL);
  article.hideCard();
  sessionStorage.removeItem('consequences');

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

  // --- Score an article's element choices against its correct answers ---
  function scoreArticle(outcome) {
    let score = 0;
    const correct = article.data?.correct;
    if (correct) {
      if (article.variants.headline === correct.headline) score++;
      if (article.variants.image    === correct.image)    score++;
      if (article.variants.content  === correct.content)  score++;
    }
    // Final stamp: green = approved = correct per memo directive
    if (outcome === 'approved') score += 2;
    return score;
  }

  // --- Finalize: score, send to pile, advance ---
  function onFinalize(outcome, stampSrc) {
    const articleScore = scoreArticle(outcome);
    totalScore += articleScore;
    articlesProcessed++;

    // Store consequence for this article
    const consequences = JSON.parse(sessionStorage.getItem('consequences') || '[]');
    const consequence  = article.data?.consequences?.[outcome] || null;
    if (consequence) {
      consequences.push({
        index:  article.index + 1,
        outcome,
        text:   consequence
      });
      sessionStorage.setItem('consequences', JSON.stringify(consequences));
    }

    if (outcome === 'approved') piles.sendToApproved(stampSrc);
    else                        piles.sendToRejected(stampSrc);

    article.incrementQueue();
    article.hideCard();
    article.advance();
  }

  // --- End Shift button ---
  const endShiftBtn = document.getElementById('end-shift-btn');
  if (endShiftBtn) {
    endShiftBtn.addEventListener('click', () => {
      const elapsed = Math.floor((Date.now() - shiftStart) / 1000);
      sessionStorage.setItem('endScore',    String(totalScore));
      sessionStorage.setItem('endArticles', String(articlesProcessed));
      sessionStorage.setItem('endTime',     String(elapsed));
      window.location.href = 'end.html';
    });
  }
});