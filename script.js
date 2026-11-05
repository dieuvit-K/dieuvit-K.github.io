/* =================================================================
   Dieuvit Kibamba Niangui · Portfolio
   En-tête au défilement, menu mobile, apparition des blocs,
   lien actif dans le menu, année du pied de page, CV en PDF.
================================================================= */

(function () {
  'use strict';

  /* ---------- 1. En-tête au défilement ---------- */
  const header = document.querySelector('.site-header');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 12);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 2. Menu mobile ---------- */
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('nav');
  const navLinks = nav ? nav.querySelectorAll('.nav-link') : [];
  const MOBILE = 1040;

  const setMenu = (open) => {
    nav.classList.toggle('open', open);
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    document.body.style.overflow = open ? 'hidden' : '';
  };

  if (toggle && nav) {
    toggle.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
    navLinks.forEach((link) => link.addEventListener('click', () => {
      if (window.innerWidth <= MOBILE) setMenu(false);
    }));
    window.addEventListener('resize', () => {
      if (window.innerWidth > MOBILE && nav.classList.contains('open')) setMenu(false);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('open')) setMenu(false);
    });
    document.addEventListener('click', (e) => {
      if (nav.classList.contains('open') && !nav.contains(e.target) && !toggle.contains(e.target)) setMenu(false);
    });
  }

  /* ---------- 3. Apparition des blocs ---------- */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('visible'));
  }

  /* ---------- 4. Lien actif dans le menu ---------- */
  const sections = document.querySelectorAll('main section[id]');
  if ('IntersectionObserver' in window && sections.length) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((l) => { l.classList.remove('active'); l.removeAttribute('aria-current'); });
        const link = document.querySelector('.nav-link[href="#' + entry.target.id + '"]');
        if (link && !link.classList.contains('nav-cta')) {
          link.classList.add('active');
          link.setAttribute('aria-current', 'true');
        }
      });
    }, { threshold: 0, rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- 5. Année du pied de page ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- 6. CV en PDF (impression) ---------- */
  const cvBtn = document.getElementById('downloadCv');
  if (cvBtn) cvBtn.addEventListener('click', () => window.print());
})();
