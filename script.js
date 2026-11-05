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

  /* ---------- 6. Formulaire de contact (envoi vers Google Forms + Sheet) ---------- */
  const FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSetFTX6f4Kh8R5UTbJ2Zm1-r2BgspWQXeD_Ipt8B37kkQXX9Q/formResponse';
  const form = document.getElementById('formulaire');
  const formType = document.getElementById('formType');

  // Les boutons « Planifier une formation » pré-remplissent le type de demande
  document.querySelectorAll('a[data-type]').forEach((a) => {
    a.addEventListener('click', () => { if (formType) formType.value = a.dataset.type; });
  });

  if (form) {
    const status = document.getElementById('formStatus');
    const submit = document.getElementById('formSubmit');
    const setStatus = (msg, cls) => { status.textContent = msg; status.className = 'form-status ' + (cls || ''); };

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let firstBad = null;
      form.querySelectorAll('[required]').forEach((el) => {
        const bad = el.type === 'radio'
          ? !form.querySelector('input[name="' + el.name + '"]:checked')
          : !el.value.trim() || (el.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value));
        el.classList.toggle('invalid', bad);
        if (bad && !firstBad) firstBad = el;
      });
      if (firstBad) {
        setStatus('Merci de remplir les champs obligatoires.', 'err');
        firstBad.focus();
        return;
      }

      submit.disabled = true;
      setStatus('Envoi en cours…');
      const data = new URLSearchParams(new FormData(form));
      fetch(FORM_URL, { method: 'POST', mode: 'no-cors', body: data })
        .then(() => {
          form.reset();
          setStatus('Merci, votre demande a bien été envoyée. Réponse sous 48 h.', 'ok');
        })
        .catch(() => {
          setStatus('L\'envoi a échoué. Écrivez-moi sur WhatsApp ou par e-mail.', 'err');
        })
        .finally(() => { submit.disabled = false; });
    });

    form.addEventListener('input', (e) => e.target.classList.remove('invalid'));
  }

  /* ---------- 7. CV en PDF (impression) ---------- */
  const cvBtn = document.getElementById('downloadCv');
  if (cvBtn) cvBtn.addEventListener('click', () => window.print());
})();
