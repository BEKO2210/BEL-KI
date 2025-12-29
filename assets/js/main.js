// BEL KI - Main JavaScript
// Navigation, Scroll Effects, Cookie Banner, and General Interactions

// ============================================
// NAVIGATION
// ============================================

class Navigation {
  constructor() {
    this.burger = document.querySelector('.burger-menu');
    this.navLinks = document.querySelector('.nav-links');
    this.header = document.querySelector('.header');

    if (this.burger && this.navLinks) {
      this.init();
    }
  }

  init() {
    // Burger menu toggle
    this.burger.addEventListener('click', () => {
      this.burger.classList.toggle('active');
      this.navLinks.classList.toggle('active');
    });

    // Close menu when clicking on a link
    const links = this.navLinks.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', () => {
        this.burger.classList.remove('active');
        this.navLinks.classList.remove('active');
      });
    });

    // Header scroll effect
    this.handleScroll();
    window.addEventListener('scroll', () => this.handleScroll());
  }

  handleScroll() {
    if (window.scrollY > 50) {
      this.header.style.background = 'rgba(10, 10, 10, 0.95)';
    } else {
      this.header.style.background = 'rgba(20, 20, 20, 0.6)';
    }
  }
}

// ============================================
// SCROLL ANIMATIONS
// ============================================

class ScrollAnimations {
  constructor() {
    this.elements = document.querySelectorAll('.fade-in');
    this.init();
  }

  init() {
    this.observeElements();
    window.addEventListener('scroll', () => this.checkElements());
    this.checkElements(); // Initial check
  }

  observeElements() {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });

      this.elements.forEach(el => observer.observe(el));
    } else {
      // Fallback for older browsers
      this.checkElements();
    }
  }

  checkElements() {
    if ('IntersectionObserver' in window) return;

    this.elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight - 100;
      if (isVisible) {
        el.classList.add('visible');
      }
    });
  }
}

// ============================================
// COOKIE BANNER
// ============================================

class CookieBanner {
  constructor() {
    this.banner = document.querySelector('.cookie-banner');
    if (this.banner) {
      this.init();
    }
  }

  init() {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setTimeout(() => {
        this.banner.classList.add('show');
      }, 1000);
    }

    // Setup buttons
    const acceptBtn = this.banner.querySelector('.accept-cookies');
    const declineBtn = this.banner.querySelector('.decline-cookies');

    if (acceptBtn) {
      acceptBtn.addEventListener('click', () => this.accept());
    }
    if (declineBtn) {
      declineBtn.addEventListener('click', () => this.decline());
    }
  }

  accept() {
    localStorage.setItem('cookieConsent', 'accepted');
    this.hideBanner();
  }

  decline() {
    localStorage.setItem('cookieConsent', 'declined');
    this.hideBanner();
  }

  hideBanner() {
    this.banner.classList.remove('show');
  }
}

// ============================================
// PROGRESS BAR ANIMATION
// ============================================

class ProgressBar {
  constructor() {
    this.bars = document.querySelectorAll('.progress-bar');
    if (this.bars.length > 0) {
      this.init();
    }
  }

  init() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const targetWidth = bar.getAttribute('data-progress') || '0';
          setTimeout(() => {
            bar.style.width = targetWidth + '%';
          }, 200);
          observer.unobserve(bar);
        }
      });
    }, { threshold: 0.5 });

    this.bars.forEach(bar => observer.observe(bar));
  }
}

// ============================================
// COPY TO CLIPBOARD
// ============================================

class CopyToClipboard {
  constructor() {
    this.buttons = document.querySelectorAll('.copy-btn');
    if (this.buttons.length > 0) {
      this.init();
    }
  }

  init() {
    this.buttons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const codeBlock = btn.closest('.code-block');
        const codeContent = codeBlock.querySelector('.code-content');

        if (codeContent) {
          this.copyText(codeContent.textContent, btn);
        }
      });
    });
  }

  copyText(text, button) {
    navigator.clipboard.writeText(text).then(() => {
      const originalText = button.textContent;
      button.textContent = '✓ Kopiert!';
      button.style.background = '#00ff88';

      setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
      }, 2000);
    }).catch(err => {
      console.error('Fehler beim Kopieren:', err);
      button.textContent = '✗ Fehler';
    });
  }
}

// ============================================
// SMOOTH SCROLL TO ANCHOR
// ============================================

function smoothScrollToAnchor() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      e.preventDefault();
      const target = document.querySelector(href);

      if (target) {
        const offsetTop = target.offsetTop - 80; // Account for fixed header
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ============================================
// TILT EFFECT FOR CARDS
// ============================================

class TiltEffect {
  constructor() {
    this.cards = document.querySelectorAll('.tilt-card');
    if (this.cards.length > 0) {
      this.init();
    }
  }

  init() {
    this.cards.forEach(card => {
      card.addEventListener('mousemove', (e) => this.handleTilt(e, card));
      card.addEventListener('mouseleave', () => this.resetTilt(card));
    });
  }

  handleTilt(e, card) {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
  }

  resetTilt(card) {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
  }
}

// ============================================
// INITIALIZE ALL
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  new Navigation();
  new ScrollAnimations();
  new CookieBanner();
  new ProgressBar();
  new CopyToClipboard();
  new TiltEffect();
  smoothScrollToAnchor();

  // Add visible class to elements that are already in view
  setTimeout(() => {
    document.querySelectorAll('.fade-in').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        el.classList.add('visible');
      }
    });
  }, 100);
});

// Performance: Reduce animations on low-end devices
if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
  document.documentElement.classList.add('reduce-motion');
}
