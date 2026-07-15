/* ============================================================
   RANDS CAPE TOWN — slider.js
   Hero slideshow: auto-advance, arrows, dot navigation,
   pause-on-hover, keyboard support.
   ============================================================ */
(function () {
  'use strict';
  const root = document.querySelector('.hero');
  if (!root) return;

  const slides = Array.from(root.querySelectorAll('.slide'));
  const dots = Array.from(root.querySelectorAll('.slider-dot'));
  const prevBtn = root.querySelector('.slider-arrow.prev');
  const nextBtn = root.querySelector('.slider-arrow.next');
  if (!slides.length) return;

  let current = 0;
  let timer = null;
  const INTERVAL = 5500;

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach(function (s, i) { s.classList.toggle('active', i === current); });
    dots.forEach(function (d, i) { d.classList.toggle('active', i === current); });
    // Re-trigger entrance animations on the active slide content
    const content = slides[current].querySelector('.hero-anim');
    if (content) {
      content.classList.remove('anim-up');
      void content.offsetWidth; // reflow
      content.classList.add('anim-up');
    }
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function start() { stop(); timer = setInterval(next, INTERVAL); }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }

  // Arrows
  if (nextBtn) nextBtn.addEventListener('click', function () { next(); start(); });
  if (prevBtn) prevBtn.addEventListener('click', function () { prev(); start(); });

  // Dots
  dots.forEach(function (d, i) {
    d.addEventListener('click', function () { goTo(i); start(); });
  });

  // Pause on hover / focus
  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', start);

  // Keyboard
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { next(); start(); }
    if (e.key === 'ArrowLeft') { prev(); start(); }
  });

  // Pause when tab hidden
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop(); else start();
  });

  // Touch swipe
  let startX = 0;
  root.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; stop(); }, { passive: true });
  root.addEventListener('touchend', function (e) {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) { dx < 0 ? next() : prev(); }
    start();
  }, { passive: true });

  goTo(0);
  start();
})();
