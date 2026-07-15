/* ============================================================
   RANDS CAPE TOWN — videos.js
   Fullscreen video modal player for the gallery.
   NOTE: In production, drop real MP4 files into /videos/ and
   update the `src` values. Public sample clips are used here so
   the modal is demonstrable out-of-the-box.
   ============================================================ */
(function () {
  'use strict';

  const modal = document.getElementById('videoModal');
  if (!modal) return;

  const player = modal.querySelector('.m-video');
  const cap = modal.querySelector('.m-cap');
  const closeBtn = modal.querySelector('.m-close');

  // Real clips would live under /videos/ (e.g. '/videos/summer-lineup.mp4').
  // These public samples stand in for the demo.
  const VIDEOS = {
    'summer': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    'djnight': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    'vip':     'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4'
  };

  function open(id, title) {
    const src = VIDEOS[id] || '/videos/' + id + '.mp4';
    player.src = src;
    if (cap) cap.textContent = title || '';
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    player.play().catch(function () {});
  }
  function close() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    player.pause();
    player.removeAttribute('src');
    player.load();
  }

  document.addEventListener('click', function (e) {
    const trigger = e.target.closest('[data-video]');
    if (trigger) {
      e.preventDefault();
      open(trigger.getAttribute('data-video'), trigger.getAttribute('data-title'));
    }
  });

  if (closeBtn) closeBtn.addEventListener('click', close);
  modal.addEventListener('click', function (e) { if (e.target === modal) close(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('open')) close();
  });
})();
