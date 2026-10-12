/* ============================================================
   Stack Overflow Clone — script.js
   ============================================================ */

/* ----------------------------------------------------------
   1. HEADER: shrink / shadow on scroll
   ---------------------------------------------------------- */
const header = document.getElementById('main-header');

function onScroll() {
  if (window.scrollY > 40) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
  toggleBackToTop();
}

window.addEventListener('scroll', onScroll, { passive: true });

/* ----------------------------------------------------------
   2. HAMBURGER MENU (mobile)
   ---------------------------------------------------------- */
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  mobileNav.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
  mobileNav.setAttribute('aria-hidden', !isOpen);
});

// Close menu when a nav link is tapped
mobileNav.querySelectorAll('a, button').forEach((el) => {
  el.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileNav.setAttribute('aria-hidden', 'true');
  });
});

// Close on outside click
document.addEventListener('click', (e) => {
  if (!header.contains(e.target)) {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileNav.setAttribute('aria-hidden', 'true');
  }
});

/* ----------------------------------------------------------
   3. SCROLL-REVEAL: fade up elements with class .reveal
   ---------------------------------------------------------- */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target); // animate once
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

/* ----------------------------------------------------------
   4. BACK-TO-TOP BUTTON
   ---------------------------------------------------------- */
const backToTopBtn = document.getElementById('back-to-top');

function toggleBackToTop() {
  if (window.scrollY > 300) {
    backToTopBtn.classList.add('visible');
  } else {
    backToTopBtn.classList.remove('visible');
  }
}

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ----------------------------------------------------------
   5. NEWSLETTER FORM — basic validation + feedback
   ---------------------------------------------------------- */
const newsletterForm = document.getElementById('newsletter-form');
const emailInput     = document.getElementById('newsletter-email');
const formMsg        = document.getElementById('form-msg');

if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();

    // Simple email regex
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!valid) {
      emailInput.classList.add('error');
      formMsg.textContent = 'Please enter a valid email address.';
      formMsg.className   = 'form-msg error';
      return;
    }

    emailInput.classList.remove('error');
    formMsg.textContent = "Thanks! You're subscribed.";
    formMsg.className   = 'form-msg success';
    emailInput.value    = '';

    // Clear success message after 5 s
    setTimeout(() => {
      formMsg.textContent = '';
      formMsg.className   = 'form-msg';
    }, 5000);
  });

  emailInput.addEventListener('input', () => {
    emailInput.classList.remove('error');
    if (formMsg.classList.contains('error')) {
      formMsg.textContent = '';
      formMsg.className   = 'form-msg';
    }
  });
}

/* ----------------------------------------------------------
   6. SMOOTH-SCROLL for anchor links
   ---------------------------------------------------------- */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = header ? header.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - offset - 8;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ----------------------------------------------------------
   7. CTA BUTTON RIPPLE EFFECT
   ---------------------------------------------------------- */
document.querySelectorAll('.cta-btn, .d button, .blog-card button').forEach((btn) => {
  btn.addEventListener('click', function (e) {
    // Remove any existing ripple
    const existing = this.querySelector('.ripple');
    if (existing) existing.remove();

    const ripple = document.createElement('span');
    ripple.className = 'ripple';

    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(255,255,255,0.35);
      width: ${size}px;
      height: ${size}px;
      left: ${e.clientX - rect.left - size / 2}px;
      top: ${e.clientY - rect.top - size / 2}px;
      transform: scale(0);
      animation: rippleAnim 0.55s linear;
      pointer-events: none;
    `;

    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);

    ripple.addEventListener('animationend', () => ripple.remove());
  });
});

/* Inject ripple keyframes once */
(function injectRippleStyle() {
  if (document.getElementById('ripple-style')) return;
  const style = document.createElement('style');
  style.id = 'ripple-style';
  style.textContent = `
    @keyframes rippleAnim {
      to { transform: scale(2.5); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
})();

/* ----------------------------------------------------------
   8. ACTIVE NAV HIGHLIGHT based on scroll position
   ---------------------------------------------------------- */
const sections = document.querySelectorAll('section[id], div[id]');
const navLinks  = document.querySelectorAll('header a');

function highlightActiveNav() {
  let current = '';
  sections.forEach((sec) => {
    const top = sec.getBoundingClientRect().top;
    if (top <= 80) current = sec.getAttribute('id');
  });

  navLinks.forEach((link) => {
    link.classList.remove('active-nav');
    const href = link.getAttribute('href');
    if (href && href === `#${current}`) link.classList.add('active-nav');
  });
}

window.addEventListener('scroll', highlightActiveNav, { passive: true });

/* ----------------------------------------------------------
   9. FEATURE-NOT-AVAILABLE MODAL
   ---------------------------------------------------------- */
const featureModal  = document.getElementById('feature-modal');
const modalClose    = document.getElementById('modal-close');
const modalOk       = document.getElementById('modal-ok');

function openModal() {
  featureModal.classList.add('active');
  featureModal.setAttribute('aria-hidden', 'false');
  // Trap focus on the OK button
  modalOk.focus();
}

function closeModal() {
  featureModal.classList.remove('active');
  featureModal.setAttribute('aria-hidden', 'true');
}

// All nav links and buttons marked with [data-nav]
document.querySelectorAll('[data-nav]').forEach((el) => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  });
});

// Resources <select> — show modal on any selection change
const resourcesSelect = document.getElementById('resources-select');
if (resourcesSelect) {
  resourcesSelect.addEventListener('change', (e) => {
    // Reset the select back to the placeholder
    resourcesSelect.value = '';
    openModal();
  });
}

// Close via × button, OK button, overlay click, or Escape key
modalClose.addEventListener('click', closeModal);
modalOk.addEventListener('click', closeModal);

featureModal.addEventListener('click', (e) => {
  if (e.target === featureModal) closeModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && featureModal.classList.contains('active')) {
    closeModal();
  }
});
