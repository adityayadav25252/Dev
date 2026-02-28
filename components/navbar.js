/**
 * Reusable Navbar Component
 * Include this file in any HTML page to get the full navbar functionality
 * 
 * Usage:
 * 1. Include navbar HTML in your page
 * 2. Add this script: <script src="components/navbar.js"></script>
 * 3. Make sure GSAP is loaded before this script
 */

class Navbar {
  constructor(options = {}) {
    this.options = {
      navbarSelector: '#navbar',
      progressBarSelector: '#progressBar',
      darkToggleSelector: '#darkToggle',
      navLinksSelector: '.nav-links a',
      sectionsSelector: 'section',
      scrollThreshold: 100,
      ...options
    };

    this.navbar = document.querySelector(this.options.navbarSelector);
    this.progressBar = document.querySelector(this.options.progressBarSelector);
    this.darkToggle = document.querySelector(this.options.darkToggleSelector);
    this.navLinks = document.querySelectorAll(this.options.navLinksSelector);
    this.sections = document.querySelectorAll(this.options.sectionsSelector);
    
    this.lastScroll = 0;
    this.ticking = false;

    this.init();
  }

  init() {
    if (!this.navbar) {
      console.warn('Navbar: Navbar element not found');
      return;
    }

    this.initRollingText();
    this.initScrollEffect();
    this.initActiveSection();
    this.initDarkMode();
    this.initHeaderCube();
    this.initMobileMenu();
  }

  /* ===== ROLLING TEXT ANIMATION ===== */
  initRollingText() {
    if (typeof gsap === 'undefined') {
      console.warn('Navbar: GSAP not loaded, rolling text disabled');
      return;
    }

    this.navLinks.forEach(link => {
      const text = link.textContent.trim();
      link.innerHTML = '';

      const wrapper = document.createElement('span');
      wrapper.className = 'text-wrapper';

      const original = document.createElement('span');
      original.className = 'original-text';

      const rolling = document.createElement('span');
      rolling.className = 'rolling-text';

      text.split('').forEach(letter => {
        const span1 = document.createElement('span');
        span1.className = 'char';
        span1.textContent = letter;
        original.appendChild(span1);

        const span2 = document.createElement('span');
        span2.className = 'char';
        span2.textContent = letter;
        rolling.appendChild(span2);
      });

      wrapper.appendChild(original);
      wrapper.appendChild(rolling);
      link.appendChild(wrapper);

      const origChars = original.querySelectorAll('.char');
      const rollChars = rolling.querySelectorAll('.char');

      gsap.set(rollChars, { y: '100%' });

      const tl = gsap.timeline({ paused: true });

      tl.to(origChars, {
        y: '-100%',
        duration: 0.4,
        stagger: 0.03
      }, 0)
      .to(rollChars, {
        y: '0%',
        duration: 0.4,
        stagger: 0.03
      }, 0);

      link.addEventListener('mouseenter', () => tl.play());
      link.addEventListener('mouseleave', () => tl.reverse());

      link.gsapTimeline = tl;
    });
  }

  /* ===== SCROLL EFFECT - HIDE/SHOW NAVBAR ===== */
  initScrollEffect() {
    window.addEventListener('scroll', () => {
      if (!this.ticking) {
        window.requestAnimationFrame(() => {
          const currentScroll = window.scrollY;

          // Progress bar
          if (this.progressBar) {
            const height = document.documentElement.scrollHeight - window.innerHeight;
            const percent = (currentScroll / height) * 100;
            this.progressBar.style.width = percent + '%';
          }

          // Navbar hide/show on scroll
          if (currentScroll > this.lastScroll && currentScroll > this.options.scrollThreshold) {
            // Scrolling down - hide navbar
            this.navbar.classList.add('hidden');
            this.navbar.classList.remove('visible');
          } else {
            // Scrolling up - show navbar
            this.navbar.classList.remove('hidden');
            this.navbar.classList.add('visible');
          }

          this.lastScroll = currentScroll;
          this.ticking = false;
        });
        this.ticking = true;
      }
    });
  }

  /* ===== ACTIVE SECTION HIGHLIGHT ===== */
  initActiveSection() {
    if (this.sections.length === 0 || this.navLinks.length === 0) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.section === entry.target.id) {
              link.classList.add('active');
              if (link.gsapTimeline) link.gsapTimeline.play();
            } else {
              if (link.gsapTimeline) link.gsapTimeline.reverse();
            }
          });
        }
      });
    }, {
      rootMargin: '-50% 0px -50% 0px'
    });

    this.sections.forEach(section => observer.observe(section));
  }

  /* ===== DARK MODE TOGGLE WITH RIPPLE ANIMATION ===== */
  initDarkMode() {
    if (!this.darkToggle) return;

    // Check for saved preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark');
    }

    // Create ripple element if it doesn't exist
    let ripple = document.querySelector('.theme-ripple');
    if (!ripple) {
      ripple = document.createElement('div');
      ripple.className = 'theme-ripple';
      document.body.appendChild(ripple);
    }

    this.darkToggle.addEventListener('click', (e) => {
      this.animateThemeToggle(e, ripple);
    });

    // Mobile dark mode toggle
    this.darkToggleMobile = document.getElementById('darkToggleMobile');
    if (this.darkToggleMobile) {
      this.darkToggleMobile.addEventListener('click', (e) => {
        this.animateThemeToggle(e, ripple);
      });
    }
  }

  animateThemeToggle(e, ripple) {
    const isDark = document.body.classList.contains('dark');
    const rect = this.darkToggle.getBoundingClientRect();
    
    // Calculate center of the toggle button
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Position ripple at toggle center
    ripple.style.left = centerX + 'px';
    ripple.style.top = centerY + 'px';
    
    // Reset ripple animation
    ripple.classList.remove('animating');
    void ripple.offsetWidth; // Force reflow
    
    // Add spinning animation class to button
    this.darkToggle.classList.add('spinning');
    
    // Animate the hero cube rotation with GSAP
    const heroCube = document.getElementById('heroCube');
    if (heroCube && typeof gsap !== 'undefined') {
      gsap.to(heroCube, {
        rotationY: '+=360',
        duration: 1.0,
        ease: 'power2.inOut'
      });
    }
    
    // Start ripple animation
    ripple.classList.add('animating');
    
    // Toggle theme class immediately so colors start transitioning
    document.body.classList.toggle('dark');
    
    // Save preference
    if (document.body.classList.contains('dark')) {
      localStorage.setItem('theme', 'dark');
    } else {
      localStorage.setItem('theme', 'light');
    }
    
    // Clean up after animation completes
    setTimeout(() => {
      ripple.classList.remove('animating');
      this.darkToggle.classList.remove('spinning');
    }, 1200);
  }

  /* ===== INTERACTIVE HEADER CUBE ===== */
  initHeaderCube() {
    const headerCube = document.querySelector('.header-cube');
    
    if (headerCube) {
      headerCube.addEventListener('click', () => {
        headerCube.style.animation = 'rotateHeaderCube 0.5s linear infinite';
        setTimeout(() => {
          headerCube.style.animation = 'rotateHeaderCube 8s linear infinite';
        }, 2000);
      });
    }
  }

  /* ===== MOBILE MENU ===== */
  initMobileMenu() {
    this.mobileMenuToggle = document.getElementById('mobileMenuToggle');
    this.mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    this.navLinksContainer = document.querySelector('.nav-links');

    if (!this.mobileMenuToggle || !this.navLinksContainer) return;

    // Toggle menu on hamburger click
    this.mobileMenuToggle.addEventListener('click', () => {
      this.toggleMobileMenu();
    });

    // Close menu on overlay click
    if (this.mobileMenuOverlay) {
      this.mobileMenuOverlay.addEventListener('click', () => {
        this.closeMobileMenu();
      });
    }

    // Close menu on nav link click (for same-page navigation)
    this.navLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.closeMobileMenu();
      });
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isMobileMenuOpen()) {
        this.closeMobileMenu();
      }
    });

    // Close menu on window resize (if going to desktop)
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && this.isMobileMenuOpen()) {
        this.closeMobileMenu();
      }
    });
  }

  toggleMobileMenu() {
    const isOpen = this.isMobileMenuOpen();
    if (isOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  openMobileMenu() {
    this.mobileMenuToggle.classList.add('active');
    this.navLinksContainer.classList.add('active');
    if (this.mobileMenuOverlay) {
      this.mobileMenuOverlay.classList.add('active');
    }
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  closeMobileMenu() {
    this.mobileMenuToggle.classList.remove('active');
    this.navLinksContainer.classList.remove('active');
    if (this.mobileMenuOverlay) {
      this.mobileMenuOverlay.classList.remove('active');
    }
    document.body.style.overflow = ''; // Restore scrolling
  }

  isMobileMenuOpen() {
    return this.navLinksContainer.classList.contains('active');
  }
}

// Auto-initialize navbar when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.navbar = new Navbar();
});

// Also support manual initialization
window.Navbar = Navbar;
