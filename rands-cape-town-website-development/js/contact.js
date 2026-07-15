/* ============================================================
   RANDS CAPE TOWN — contact.js
   Front-end-only contact form validation (no backend).
   Validates name, email, subject, message and shows inline
   errors + a success message.
   ============================================================ */
(function () {
  'use strict';

  const form = document.getElementById('contactForm');
  if (!form) return;

  const success = form.querySelector('.form-success');

  const rules = {
    name:    { test: function (v) { return v.trim().length >= 2; }, msg: 'Please enter your name (min 2 characters).' },
    email:   { test: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); }, msg: 'Enter a valid email address.' },
    subject: { test: function (v) { return v.trim().length >= 3; }, msg: 'Please add a subject.' },
    message: { test: function (v) { return v.trim().length >= 10; }, msg: 'Message must be at least 10 characters.' }
  };

  function setError(field, message) {
    const wrap = form.querySelector('[data-field="' + field + '"]');
    if (!wrap) return;
    wrap.classList.add('error');
    const err = wrap.querySelector('.err-msg');
    if (err) err.textContent = message;
  }
  function clearError(field) {
    const wrap = form.querySelector('[data-field="' + field + '"]');
    if (wrap) wrap.classList.remove('error');
  }

  // Live-clear errors as the user types
  Object.keys(rules).forEach(function (field) {
    const input = form.querySelector('[name="' + field + '"]');
    if (input) input.addEventListener('input', function () { clearError(field); });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    let valid = true;
    let firstInvalid = null;

    Object.keys(rules).forEach(function (field) {
      const input = form.querySelector('[name="' + field + '"]');
      const value = input ? input.value : '';
      if (!rules[field].test(value)) {
        setError(field, rules[field].msg);
        valid = false;
        if (!firstInvalid) firstInvalid = input;
      } else {
        clearError(field);
      }
    });

    if (!valid) {
      if (success) success.classList.remove('show');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // Simulated success (no backend in Phase 1)
    if (success) {
      success.textContent = 'Thank you! Your message has been received. Our team will be in touch soon.';
      success.classList.add('show');
    }
    form.reset();
    form.querySelectorAll('.field').forEach(function (f) { f.classList.remove('error'); });
    if (firstInvalid) {} // noop
  });
})();
