// Toggle the stamps panel, flipping the arrow direction
const stampsToggle = document.getElementById('stamps-toggle');
const stampsPopup = document.getElementById('stamps-popup');

if (stampsToggle && stampsPopup) {
  stampsToggle.addEventListener('click', () => {
    const isOpen = stampsPopup.classList.toggle('is-open');
    stampsToggle.innerHTML = isOpen ? '&#8595;' : '&#8593;';
    stampsToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
}

// Toggle the Editor / Memo report panels, ensuring only one is open at a time
const editorToggle = document.getElementById('editor-toggle');
const editorReport = document.getElementById('editor-report');
const memoToggle = document.getElementById('memo-toggle');
const memoReport = document.getElementById('memo-report');

function closePanel(toggle, panel) {
  panel.classList.remove('is-open');
  toggle.innerHTML = '&#8595;';
  toggle.setAttribute('aria-expanded', 'false');
}

function togglePanel(toggle, panel, otherToggle, otherPanel) {
  const isOpen = panel.classList.contains('is-open');

  if (isOpen) {
    closePanel(toggle, panel);
  } else {
    if (otherPanel.classList.contains('is-open')) {
      closePanel(otherToggle, otherPanel);
    }
    panel.classList.add('is-open');
    toggle.innerHTML = '&#8593;';
    toggle.setAttribute('aria-expanded', 'true');
  }
}

if (editorToggle && editorReport && memoToggle && memoReport) {
  editorToggle.addEventListener('click', () => {
    togglePanel(editorToggle, editorReport, memoToggle, memoReport);
  });

  memoToggle.addEventListener('click', () => {
    togglePanel(memoToggle, memoReport, editorToggle, editorReport);
  });
}