class UIManager {
  constructor(soundManager) {
    this.soundManager = soundManager;
    this._initPauseButton();
    this._initPanelToggles();
  }

  _initPauseButton() {
    const btn  = document.getElementById('pause-btn');
    const icon = document.getElementById('pause-icon');
    if (!btn || !icon) return;

    let paused = false;
    btn.addEventListener('click', () => {
      paused = !paused;
      icon.src = paused ? '../img/play.png' : '../img/pause.png';
      btn.setAttribute('aria-label', paused ? 'Play' : 'Pause');
      this.soundManager.playTypeclick();
    });
  }

  _initPanelToggles() {
    const editorToggle = document.getElementById('editor-toggle');
    const editorPanel  = document.getElementById('editor-report');
    const memoToggle   = document.getElementById('memo-toggle');
    const memoPanel    = document.getElementById('memo-report');

    const closePanel = (toggle, panel) => {
      panel.classList.remove('is-open');
      toggle.innerHTML = '&#8595;';
      toggle.setAttribute('aria-expanded', 'false');
    };

    const togglePanel = (toggle, panel, otherToggle, otherPanel) => {
      const isOpen = panel.classList.contains('is-open');
      if (isOpen) {
        closePanel(toggle, panel);
      } else {
        if (otherPanel.classList.contains('is-open')) closePanel(otherToggle, otherPanel);
        panel.classList.add('is-open');
        toggle.innerHTML = '&#8593;';
        toggle.setAttribute('aria-expanded', 'true');
        setTimeout(() => {
          if (panel.classList.contains('is-open')) this.soundManager.playDrawer();
        }, 0);
      }
    };

    if (editorToggle && editorPanel && memoToggle && memoPanel) {
      editorToggle.addEventListener('click', () => togglePanel(editorToggle, editorPanel, memoToggle, memoPanel));
      memoToggle.addEventListener('click',   () => togglePanel(memoToggle, memoPanel, editorToggle, editorPanel));
    }
  }
}
