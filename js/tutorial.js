const tutorialSteps = [
  {
    target: 'drop-zone-left',
    title: 'Pending Pile',
    text: 'This is your stack of pending articles. Click it to pull the top article into the review slot.'
  },
  {
    target: 'article-slot',
    title: 'Review Slot',
    text: 'Articles appear here once pulled from the pending pile. This is where you review each article before making a decision.'
  },
  {
    target: 'article-card',
    title: 'Article Elements',
    text: 'Each article has three parts: headline, image, and content. Click an element to select it, then use the arrows to switch between variants.'
  },
  {
    target: 'stamps-rack',
    title: 'Stamp Rack',
    text: 'Use the yellow stamp to mark individual article elements (headline, image, content). Once all elements are checked, red and green unlock for the final verdict.'
  },
  {
    target: 'stamp-preview',
    title: 'Final Verdict Stamp',
    text: 'Once all three elements are checked, stamp this spot with green (approved) or red (rejected) to finalize the article and send it to the matching pile.'
  },
  {
    target: 'editor-toggle',
    title: 'Editor Report',
    text: 'Click here to open the Editor Report — background information about the article\'s author including their affiliation, reputation, and a briefing.'
  },
  {
    target: 'memo-toggle',
    title: 'Memo',
    text: 'Click here to open the Memo — your directive for this article. It tells you what to look for and how to judge whether each element meets communication standards.'
  },
  {
    target: 'drop-zone-right-group',
    title: 'Approved & Rejected Piles',
    text: 'Articles you approve go to the Approved pile. Articles you reject go to the Rejected pile. Each stamped card visually reflects your decision.'
  },
  {
    target: 'article-queue-count',
    title: 'Article Queue',
    text: 'This tracks your progress through the current shift. Each finalized article increments the counter. Complete all articles before your shift ends.'
  }
];

let currentStep = 0;

// --- DOM setup ---
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

const spotlight = document.getElementById('tutorial-spotlight');
const tooltip = document.getElementById('tutorial-tooltip');
const titleEl = document.getElementById('tutorial-tooltip-title');
const textEl = document.getElementById('tutorial-tooltip-text');
const prevBtn = document.getElementById('tutorial-prev');
const nextBtn = document.getElementById('tutorial-next');
const stepCount = document.getElementById('tutorial-step-count');
const closeBtn = document.getElementById('tutorial-close');

function getTarget(step) {
  const id = step.target;
  return document.getElementById(id) || document.querySelector(`.${id}`);
}

function positionSpotlight(el) {
  if (!el) {
    spotlight.style.display = 'none';
    return;
  }
  const rect = el.getBoundingClientRect();
  const pad = 12;
  spotlight.style.display = 'block';
  spotlight.style.top = `${rect.top - pad}px`;
  spotlight.style.left = `${rect.left - pad}px`;
  spotlight.style.width = `${rect.width + pad * 2}px`;
  spotlight.style.height = `${rect.height + pad * 2}px`;
}

function positionTooltip(el) {
  const tooltipRect = tooltip.getBoundingClientRect();
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  if (!el) {
    tooltip.style.top = '50%';
    tooltip.style.left = '50%';
    tooltip.style.transform = 'translate(-50%, -50%)';
    return;
  }

  const rect = el.getBoundingClientRect();
  const pad = 20;
  const tooltipW = 300;
  const tooltipH = 180;

  let top, left;

  // Try below
  if (rect.bottom + tooltipH + pad < vh) {
    top = rect.bottom + pad;
  } else if (rect.top - tooltipH - pad > 0) {
    // Try above
    top = rect.top - tooltipH - pad;
  } else {
    top = Math.max(pad, Math.min(rect.top, vh - tooltipH - pad));
  }

  // Center horizontally relative to target
  left = rect.left + rect.width / 2 - tooltipW / 2;
  left = Math.max(pad, Math.min(left, vw - tooltipW - pad));

  tooltip.style.top = `${top}px`;
  tooltip.style.left = `${left}px`;
  tooltip.style.transform = 'none';
}

function showStep(index) {
  const step = tutorialSteps[index];
  const el = getTarget(step);

  titleEl.textContent = step.title;
  textEl.textContent = step.text;
  stepCount.textContent = `${index + 1} / ${tutorialSteps.length}`;
  prevBtn.disabled = index === 0;
  nextBtn.textContent = index === tutorialSteps.length - 1 ? 'Finish ✓' : 'Next &#8594;';
  nextBtn.innerHTML = index === tutorialSteps.length - 1 ? 'Finish ✓' : 'Next &#8594;';

  positionSpotlight(el);
  positionTooltip(el);

  // Animate tooltip in
  tooltip.classList.remove('tutorial-tooltip-enter');
  requestAnimationFrame(() => tooltip.classList.add('tutorial-tooltip-enter'));
}

function openTutorial() {
  currentStep = 0;
  overlay.classList.add('is-visible');
  showStep(currentStep);
}

function closeTutorial() {
  overlay.classList.remove('is-visible');
  spotlight.style.display = 'none';
}

prevBtn.addEventListener('click', () => {
  if (currentStep > 0) {
    currentStep--;
    showStep(currentStep);
  }
});

nextBtn.addEventListener('click', () => {
  if (currentStep < tutorialSteps.length - 1) {
    currentStep++;
    showStep(currentStep);
  } else {
    closeTutorial();
  }
});

closeBtn.addEventListener('click', closeTutorial);
overlay.addEventListener('click', (e) => {
  if (e.target === overlay) closeTutorial();
});

// Wire the info button
const infoBtn = document.getElementById('info-btn');
if (infoBtn) {
  infoBtn.addEventListener('click', openTutorial);
}