// Plays a drawer-open sound when the Editor or Memo panel is opened
document.addEventListener('DOMContentLoaded', () => {
  const drawerOpenSound = new Audio('../sounds/draweropen.mp3');

  const playDrawerOpen = () => {
    const sound = drawerOpenSound.cloneNode();
    sound.play().catch(() => {
      // Ignore errors (e.g. if browser blocks autoplay before user interaction)
    });
  };

  const editorToggle = document.getElementById('editor-toggle');
  const editorReport = document.getElementById('editor-report');
  const memoToggle = document.getElementById('memo-toggle');
  const memoReport = document.getElementById('memo-report');

  const checkAndPlay = (toggle, panel) => {
    toggle.addEventListener('click', () => {
      // Wait a tick so shift.js has already toggled the 'is-open' class
      setTimeout(() => {
        if (panel.classList.contains('is-open')) {
          playDrawerOpen();
        }
      }, 0);
    });
  };

  if (editorToggle && editorReport) {
    checkAndPlay(editorToggle, editorReport);
  }

  if (memoToggle && memoReport) {
    checkAndPlay(memoToggle, memoReport);
  }
});