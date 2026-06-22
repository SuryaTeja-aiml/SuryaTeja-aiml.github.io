document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. Minimal Cursor Dot (GPU-accelerated)
  //    No glow div, no interpolation lag.
  //    Uses transform (composite-only) for buttery 60fps.
  // ==========================================
  const cursor = document.getElementById('custom-cursor');
  let cx = 0, cy = 0;

  if (cursor && window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
      cx = e.clientX;
      cy = e.clientY;
      cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      if (!cursor.classList.contains('visible')) cursor.classList.add('visible');
    }, { passive: true });

    // Enlarge on interactive elements
    const hoverTargets = document.querySelectorAll('a, button, .glass-card, .filter-btn, .tool-tag');
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
    });
  }

  // ==========================================
  // 2. Mobile Menu Toggle
  // ==========================================
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }

  // ==========================================
  // 3. Scroll Spy — highlight active nav link
  // ==========================================
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-link');

  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navItems.forEach(item => {
          item.classList.toggle('active', item.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.3, rootMargin: '0px 0px -30% 0px' });

  sections.forEach(s => spyObserver.observe(s));

  // ==========================================
  // 4. Scroll Reveal (once, CSS-driven)
  // ==========================================
  const revealElements = document.querySelectorAll('.scroll-reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  // ==========================================
  // 5. Course Filter (with CSS transitions)
  // ==========================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const courseCards = document.querySelectorAll('.course-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const year = btn.dataset.year;

      courseCards.forEach(card => {
        const match = year === 'all' || card.dataset.year === year;
        if (match) {
          card.style.display = 'flex';
          requestAnimationFrame(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          });
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.97)';
          setTimeout(() => { card.style.display = 'none'; }, 250);
        }
      });
    });
  });

  // ==========================================
  // 6. Navbar background solidify on scroll
  // ==========================================
  const nav = document.querySelector('.glass-nav');
  if (nav) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          nav.style.background = window.scrollY > 60
            ? 'rgba(6, 8, 15, 0.92)'
            : 'rgba(6, 8, 15, 0.7)';
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }
});
