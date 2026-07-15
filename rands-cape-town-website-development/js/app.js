/* ============================================================
   RANDS CAPE TOWN — app.js
   Core UI: loader, sticky nav, mobile menu, smooth scroll,
   active-link highlighting, scroll reveal, counters, back-to-top,
   newsletter, footer year.
   Vanilla JS · no dependencies.
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Loader ---------- */
  function hideLoader() {
    const loader = document.querySelector('.loader');
    if (loader) {
      setTimeout(function () { loader.classList.add('hide'); }, 450);
    }
  }
  window.addEventListener('load', hideLoader);
  // Safety fallback in case 'load' is delayed by media
  setTimeout(hideLoader, 2600);

  /* ---------- Current page → active nav ---------- */
  function markActiveNav() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a[data-page]').forEach(function (a) {
      const p = a.getAttribute('data-page');
      if (p === path || (path === '' && p === 'index.html')) {
        a.classList.add('active');
      }
    });
  }

  /* ---------- Sticky header shadow ---------- */
  const header = document.querySelector('.site-header');
  function onScroll() {
    if (header) header.classList.toggle('scrolled', window.scrollY > 30);
    // Back to top
    const bt = document.querySelector('.back-top');
    if (bt) bt.classList.toggle('show', window.scrollY > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile navigation ---------- */
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  function closeMenu() {
    if (toggle) toggle.classList.remove('open');
    if (links) links.classList.remove('open');
    document.body.style.overflow = '';
  }
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      const open = links.classList.toggle('open');
      toggle.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) closeMenu();
    });
  }

  /* ---------- Smooth scroll for in-page anchors ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      const id = a.getAttribute('href');
      if (id.length > 1) {
        const el = document.querySelector(id);
        if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
      }
    });
  });

  /* ---------- Back to top ---------- */
  const backTop = document.querySelector('.back-top');
  if (backTop) backTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el, i) {
      // Stagger children that declare data-stagger
      if (el.hasAttribute('data-stagger')) el.style.setProperty('--i', i % 8);
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add('active'); });
  }

  /* ---------- Animated counters ---------- */
  function animateCounter(el) {
    const target = parseFloat(el.getAttribute('data-target')) || 0;
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    const decimals = (String(target).split('.')[1] || '').length;
    const duration = 1800;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = (target * eased).toFixed(decimals);
      el.textContent = prefix + Number(val).toLocaleString() + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  const counters = document.querySelectorAll('.counter .num[data-target]');
  if ('IntersectionObserver' in window && counters.length) {
    const cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          cio.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { cio.observe(c); });
  }

  /* ---------- Newsletter signup (front-end only) ---------- */
  document.querySelectorAll('.newsletter').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const btn = form.querySelector('button');
      if (!input || !input.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
        input.focus();
        input.style.borderColor = 'var(--deep-red)';
        return;
      }
      input.style.borderColor = '';
      if (btn) { const t = btn.textContent; btn.textContent = 'Joined ✓'; btn.disabled = true; }
      input.value = '';
      input.placeholder = 'Thank you — see you at Rands!';
    });
  });

  /* ---------- Footer year ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Init ---------- */
  markActiveNav();
})();
