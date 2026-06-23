// ===== Centralised Sound Manager =====
document.addEventListener('DOMContentLoaded', () => {

  // Helper: clone and play a sound so rapid clicks can overlap
  const play = (audio) => {
    const s = audio.cloneNode();
    s.play().catch(() => {});
  };

  // --- Ambient background (office noise) ---
  const ambient = new Audio('../sounds/office-ambience.mp3');
  ambient.loop = true;
  ambient.volume = 0.3;
  ambient.muted = true;
  ambient.play().catch(() => {});

  const activateAmbient = () => {
    ambient.muted = false;
    if (ambient.paused) ambient.play().catch(() => {});
    document.removeEventListener('click', activateAmbient);
    document.removeEventListener('keydown', activateAmbient);
    document.removeEventListener('touchstart', activateAmbient);
  };
  document.addEventListener('click', activateAmbient);
  document.addEventListener('keydown', activateAmbient);
  document.addEventListener('touchstart', activateAmbient);

  // --- Typewriter click (pause button, approve button) ---
  const typeclick = new Audio('../sounds/typeclick.mp3');
  ['#approve-btn', '#pause-btn'].forEach((sel) => {
    const el = document.querySelector(sel);
    if (el) el.addEventListener('click', () => play(typeclick));
  });

  // --- Stamp sound (stamp swatches) ---
  const stampSound = new Audio('../sounds/stamp.mp3');
  document.querySelectorAll('.stamp-swatch').forEach((swatch) => {
    swatch.addEventListener('click', () => play(stampSound));
  });

  // --- Drawer open (Editor / Memo panels) ---
  const drawerSound = new Audio('../sounds/draweropen.mp3');
  const checkAndPlayDrawer = (toggleId, panelId) => {
    const toggle = document.getElementById(toggleId);
    const panel = document.getElementById(panelId);
    if (!toggle || !panel) return;
    toggle.addEventListener('click', () => {
      setTimeout(() => {
        if (panel.classList.contains('is-open')) play(drawerSound);
      }, 0);
    });
  };
  checkAndPlayDrawer('editor-toggle', 'editor-report');
  checkAndPlayDrawer('memo-toggle', 'memo-report');

});