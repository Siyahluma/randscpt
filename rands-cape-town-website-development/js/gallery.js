/* ============================================================
   RANDS CAPE TOWN — gallery.js
   Image lightbox: click-to-open, prev/next, keyboard,
   swipe, and close-on-backdrop. Lazy-loaded media friendly.
   ============================================================ */
(function () {
  'use strict';

  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  const lbImg = lightbox.querySelector('.lb-img');
  const lbPrev = lightbox.querySelector('.lb-prev');
  const lbNext = lightbox.querySelector('.lb-next');
  const lbClose = lightbox.querySelector('.lb-close');
  const lbCaption = lightbox.querySelector('.lb-caption');

  let items = [];
  let index = 0;

  function buildItems() {
    // Collect every gallery image registered with data-gallery
    items = Array.from(document.querySelectorAll('[data-gallery]')).map(function (el) {
      return {
        src: el.getAttribute('data-full') || el.querySelector('img')?.src || el.getAttribute('href') || '',
        caption: el.getAttribute('data-caption') || el.getAttribute('alt') || ''
      };
    });
  }

  function show(i) {
    if (!items.length) return;
    index = (i + items.length) % items.length;
    const it = items[index];
    lbImg.classList.add('img-shimmer');
    lbImg.src = it.src;
    lbImg.alt = it.caption;
    if (lbCaption) lbCaption.textContent = it.caption;
    lbImg.onload = function () { lbImg.classList.remove('img-shimmer'); };
  }

  function open(i) { show(i); lightbox.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function close() { lightbox.classList.remove('open'); document.body.style.overflow = ''; }

  // Delegate clicks on any element flagged for the lightbox
  document.addEventListener('click', function (e) {
    const trigger = e.target.closest('[data-gallery]');
    if (trigger) {
      e.preventDefault();
      buildItems();
      const i = items.findIndex(function (it) {
        const src = trigger.getAttribute('data-full') || trigger.querySelector('img')?.src || trigger.getAttribute('href') || '';
        return it.src === src;
      });
      open(i < 0 ? 0 : i);
    }
  });

  if (lbClose) lbClose.addEventListener('click', close);
  if (lbPrev) lbPrev.addEventListener('click', function (e) { e.stopPropagation(); show(index - 1); });
  if (lbNext) lbNext.addEventListener('click', function (e) { e.stopPropagation(); show(index + 1); });
  lightbox.addEventListener('click', function (e) { if (e.target === lightbox) close(); });
  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') show(index + 1);
    if (e.key === 'ArrowLeft') show(index - 1);
  });

  // Touch swipe inside lightbox
  let sx = 0;
  lightbox.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
  lightbox.addEventListener('touchend', function (e) {
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 50) show(dx < 0 ? index + 1 : index - 1);
  }, { passive: true });
})();
