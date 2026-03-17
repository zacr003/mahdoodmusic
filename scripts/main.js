// Mahdood — main JavaScript

// ── Nav active state ──
// Highlight the link that matches the current page
(function setActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-links a');
  navLinks.forEach(link => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage) {
      link.classList.add('active');
    }
  });
})();

// ── Contact form validation ──
(function initContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  const successBanner = document.querySelector('.form-success');
  const errorBanner = document.querySelector('.form-error');

  function showError(input, message) {
    input.classList.add('is-invalid');
    let errorEl = input.parentElement.querySelector('.form-group__error');
    if (!errorEl) {
      errorEl = document.createElement('span');
      errorEl.className = 'form-group__error';
      errorEl.setAttribute('role', 'alert');
      input.parentElement.appendChild(errorEl);
    }
    errorEl.textContent = message;
  }

  function clearError(input) {
    input.classList.remove('is-invalid');
    const errorEl = input.parentElement.querySelector('.form-group__error');
    if (errorEl) errorEl.textContent = '';
  }

  function validateForm() {
    let valid = true;

    const name = form.querySelector('#name');
    const email = form.querySelector('#email');
    const eventType = form.querySelector('#event-type');
    const message = form.querySelector('#message');

    // Name: required, min 2 chars
    if (!name.value.trim() || name.value.trim().length < 2) {
      showError(name, 'Please enter your name (at least 2 characters).');
      valid = false;
    } else {
      clearError(name);
    }

    // Email: required, valid format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim() || !emailPattern.test(email.value.trim())) {
      showError(email, 'Please enter a valid email address.');
      valid = false;
    } else {
      clearError(email);
    }

    // Event type: required, must pick a non-empty option
    if (!eventType.value) {
      showError(eventType, 'Please select an event type.');
      valid = false;
    } else {
      clearError(eventType);
    }

    // Message: required, min 10 chars
    if (!message.value.trim() || message.value.trim().length < 10) {
      showError(message, 'Please tell us a bit more (at least 10 characters).');
      valid = false;
    } else {
      clearError(message);
    }

    return valid;
  }

  // Clear individual field errors as the user corrects them
  ['#name', '#email', '#event-type', '#message'].forEach(selector => {
    const el = form.querySelector(selector);
    if (!el) return;
    el.addEventListener('input', () => clearError(el));
    el.addEventListener('change', () => clearError(el));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    try {
      if (!validateForm()) return;

      // Hide any previous banners
      if (successBanner) successBanner.classList.remove('is-visible');
      if (errorBanner) errorBanner.classList.remove('is-visible');

      // Show success state and hide the form
      if (successBanner) {
        const nameVal = form.querySelector('#name').value.trim().split(' ')[0];
        successBanner.querySelector('.form-success__name').textContent = nameVal;
        successBanner.classList.add('is-visible');
        form.hidden = true;
      } else {
        // Fallback: submit the mailto action
        form.submit();
      }
    } catch (err) {
      console.error('Contact form error:', err);
      if (errorBanner) errorBanner.classList.add('is-visible');
    }
  });
})();

// ── Mobile menu toggle ──
(function initMobileMenu() {
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (!toggle || !navLinks) return;

  toggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen);
  });

  // Close menu when a nav link is clicked (on mobile)
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
})();
