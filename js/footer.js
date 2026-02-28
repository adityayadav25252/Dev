/* =========================================
   FOOTER JS — DEV CUBE TECH (Pro Animated)
   Drop into: js/footer.js
   Add <script src="js/footer.js"></script>
   at bottom of index.html (after other scripts)
   ========================================= */

(function () {
  'use strict';

  /* ── 1. REBUILD FOOTER HTML ───────────────────────────
     Replaces the old plain <footer><div>DEV CUBE TECH</div></footer>
     with the new animated structure.
  ─────────────────────────────────────────────────────── */
  const oldFooter = document.querySelector('footer');
  if (!oldFooter) return;

  // Create new footer element
  const footer = document.createElement('footer');
  footer.className = 'footer';
  footer.id = 'siteFooter';

  footer.innerHTML = `
    <div class="footer-scanlines"></div>
    <div class="footer-spotlight" id="footerSpotlight"></div>
    <div class="footer-border"></div>
    <div class="footer-meta">
      <span>EST. 2024</span>
      <span>BHOPAL, MP — INDIA</span>
      <span>DIGITAL EXCELLENCE</span>
    </div>
    <div class="footer-word-wrap" id="footerWord"></div>
    <div class="footer-copy">© 2026 — ALL RIGHTS RESERVED</div>
  `;

  oldFooter.replaceWith(footer);

  /* ── 2. SPLIT TEXT INTO LETTER SPANS ─────────────── */
  const words = ['DEV', ' ', 'CUBE', ' ', 'TECH'];
  const wrap  = document.getElementById('footerWord');

  words.forEach(word => {
    if (word === ' ') {
      const sp = document.createElement('span');
      sp.className = 'footer-space';
      wrap.appendChild(sp);
    } else {
      [...word].forEach(char => {
        const span = document.createElement('span');
        span.className = 'footer-letter';
        span.textContent = char;
        wrap.appendChild(span);
      });
    }
  });

  const letters    = [...wrap.querySelectorAll('.footer-letter')];
  const spotlight  = document.getElementById('footerSpotlight');

  /* ── 3. MOUSE MOVE — proximity glow + letter lift ── */
  footer.addEventListener('mousemove', e => {
    const rect = footer.getBoundingClientRect();
    spotlight.style.left = (e.clientX - rect.left) + 'px';
    spotlight.style.top  = (e.clientY - rect.top)  + 'px';

    const mx = e.clientX;
    const my = e.clientY;

    letters.forEach(letter => {
      const lr   = letter.getBoundingClientRect();
      const cx   = lr.left + lr.width  / 2;
      const cy   = lr.top  + lr.height / 2;
      const dist = Math.hypot(mx - cx, my - cy);

      letter.classList.remove('hovered', 'near');
      if      (dist < 60)  letter.classList.add('hovered');
      else if (dist < 140) letter.classList.add('near');
    });
  });

  footer.addEventListener('mouseleave', () => {
    letters.forEach(l => l.classList.remove('hovered', 'near'));
  });

  /* ── 4. CLICK — shockwave ripple ─────────────────── */
  footer.addEventListener('click', e => {
    const rect   = footer.getBoundingClientRect();
    const ripple = document.createElement('div');
    ripple.className = 'footer-ripple';
    ripple.style.left = (e.clientX - rect.left) + 'px';
    ripple.style.top  = (e.clientY - rect.top)  + 'px';
    footer.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });

  /* ── 5. DOUBLE CLICK — glitch burst ──────────────── */
  footer.addEventListener('dblclick', () => {
    wrap.classList.add('glitching');
    setTimeout(() => wrap.classList.remove('glitching'), 450);
  });

  /* ── 6. SCROLL ENTRY — replay letter animation ───── */
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      letters.forEach((l, i) => {
        l.style.animationName  = 'none';
        l.style.animationDelay = `${i * 0.05}s`;
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            l.style.animationName = '';
          })
        );
      });
    });
  }, { threshold: 0.3 });

  io.observe(footer);

})();
