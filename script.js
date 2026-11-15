/* =================================================================
   Dieuvit Kibamba Niangui · Portfolio
   En-tête au défilement, menu mobile, apparition des blocs,
   lien actif dans le menu, année du pied de page, CV en PDF.
================================================================= */

(function () {
  'use strict';

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 0. Lettres du grand nom découpées ---------- */
  document.querySelectorAll('.split').forEach((el) => {
    const txt = el.textContent;
    el.textContent = '';
    [...txt].forEach((c, i) => {
      const s = document.createElement('span');
      s.className = 'ch';
      s.textContent = c;
      s.style.transitionDelay = (0.06 * i + (el.closest('.line-2') ? 0.35 : 0.05)) + 's';
      el.appendChild(s);
    });
  });

  /* ---------- 0b. Écran de chargement (une seule fois par visite) ---------- */
  const loader = document.getElementById('loader');
  const startShow = () => {
    document.body.classList.remove('is-loading');
    if (loader) loader.classList.add('done');
    requestAnimationFrame(() => document.documentElement.classList.add('ready'));
  };
  let seen = false;
  try { seen = sessionStorage.getItem('dk-intro') === '1'; sessionStorage.setItem('dk-intro', '1'); } catch (e) {}
  if (!loader || reduce || seen) {
    if (loader) loader.style.display = 'none';
    startShow();
  } else {
    const bar = document.getElementById('loaderBar');
    const pct = document.getElementById('loaderPct');
    let finished = false;
    const finish = () => { if (finished) return; finished = true; setTimeout(startShow, 150); };
    const t0 = performance.now(), DUR = 1400;
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / DUR);
      const e = 1 - Math.pow(1 - p, 3);
      bar.style.width = (e * 100) + '%';
      pct.textContent = Math.round(e * 100);
      if (p < 1 && !finished) requestAnimationFrame(tick); else finish();
    };
    requestAnimationFrame(tick);
    document.getElementById('loaderSkip').addEventListener('click', finish);
  }

  /* ---------- 0c. Barre de progression de lecture ---------- */
  const progress = document.getElementById('progressBar');

  /* ---------- 0d. Compte à rebours JSB 2027 ---------- */
  const cd = document.getElementById('countdown');
  if (cd) {
    const target = new Date(cd.dataset.target).getTime();
    const u = (k) => cd.querySelector('[data-u="' + k + '"]');
    const pad = (n) => String(n).padStart(2, '0');
    const run = () => {
      let d = Math.max(0, target - Date.now()) / 1000;
      const days = Math.floor(d / 86400); d -= days * 86400;
      const h = Math.floor(d / 3600); d -= h * 3600;
      const m = Math.floor(d / 60); const s = Math.floor(d - m * 60);
      u('d').textContent = days; u('h').textContent = pad(h); u('m').textContent = pad(m); u('s').textContent = pad(s);
    };
    run(); setInterval(run, 1000);
  }

  /* ---------- 0e. Chiffres qui montent ---------- */
  const counters = document.querySelectorAll('.count');
  const countUp = (el) => {
    const to = +el.dataset.to;
    if (reduce) { el.textContent = to; return; }
    const from = to > 1000 ? to - 25 : 0;
    const t0 = performance.now(), DUR = 1600;
    const step = (t) => {
      const p = Math.min(1, (t - t0) / DUR);
      el.textContent = Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if ('IntersectionObserver' in window) {
    const co = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { countUp(e.target); co.unobserve(e.target); }
    }), { threshold: .6 });
    counters.forEach((c) => co.observe(c));
  } else counters.forEach((c) => (c.textContent = c.dataset.to));

  /* ---------- 0f. Frise : filtres, année active, ligne qui se remplit ---------- */
  const frise = document.getElementById('frise');
  const fill = document.getElementById('friseFill');
  const blocks = frise ? [...frise.querySelectorAll('.year-block')] : [];
  const evs = frise ? [...frise.querySelectorAll('.ev')] : [];
  document.querySelectorAll('.filter').forEach((b) => b.addEventListener('click', () => {
    document.querySelectorAll('.filter').forEach((x) => x.classList.toggle('active', x === b));
    const f = b.dataset.f;
    evs.forEach((ev) => ev.classList.toggle('hide', f !== 'all' && ev.dataset.cat !== f));
    blocks.forEach((bl) => bl.classList.toggle('empty', !bl.querySelector('.ev:not(.hide)')));
    scrollFx();
  }));

  /* ---------- 0g. Effets liés au défilement ---------- */
  const heroImg = document.querySelector('.hero-bg');
  let ticking = false;
  const scrollFx = () => {
    ticking = false;
    const y = window.scrollY, vh = window.innerHeight;
    const max = document.documentElement.scrollHeight - vh;
    if (progress) progress.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')';
    if (heroImg && !reduce && y < vh * 1.2) heroImg.style.transform = 'translateY(' + (y * 0.25) + 'px)';
    if (frise) {
      const r = frise.getBoundingClientRect();
      const mid = vh * 0.55;
      const p = Math.min(1, Math.max(0, (mid - r.top) / r.height));
      fill.style.height = (p * 100) + '%';
      evs.forEach((ev) => { if (ev.getBoundingClientRect().top < vh * 0.8) ev.classList.add('on'); });
      let act = null;
      blocks.forEach((bl) => { if (!bl.classList.contains('empty') && bl.getBoundingClientRect().top < mid) act = bl; });
      blocks.forEach((bl) => bl.classList.toggle('active', bl === act));
    }
  };
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(scrollFx); } }, { passive: true });
  window.addEventListener('resize', scrollFx);
  scrollFx();

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

  // Aide affichée sous « Décrivez votre besoin » selon le service choisi
  const HINTS = {
    "Formation en intelligence artificielle": "Précisez : votre niveau (débutant, intermédiaire, avancé), seul ou en groupe (combien de personnes), en présentiel à Brazzaville ou à distance, et ce que vous voulez savoir faire.",
    "Mise en place d'agents IA et d'automatisations": "Précisez : votre activité, les tâches à automatiser, les outils que vous utilisez déjà (Gmail, Sheets, WhatsApp…).",
    "Formation à la création de vidéos avec l'IA": "Précisez : votre niveau, le type de vidéos visées (TikTok, publicité, éducation…) et le format (présentiel ou à distance).",
    "Réalisation de vidéos ou de publicités": "Précisez : le produit ou le message, la durée souhaitée, les réseaux visés et la date de diffusion.",
    "Publicité sur la page TikTok Le Raconteur": "Précisez : ce que vous voulez promouvoir, votre public cible et la période souhaitée.",
    "Création de portfolio ou de site vitrine": "Précisez : pour qui (vous, une entreprise…), ce que le site doit présenter, et si vous avez déjà des textes et des photos.",
    "Conseil en recherche, thèse ou mémoire": "Précisez : votre niveau (licence, master, doctorat), votre sujet et l'aide attendue (protocole, analyse de données, relecture, présentation).",
    "Cours de SVT ou soutien scolaire": "Précisez : la classe de l'élève, les matières, l'objectif (Brevet, Bac D…) et les disponibilités.",
    "Autre demande": "Décrivez votre demande le plus clairement possible."
  };
  const hint = document.getElementById('formHint');
  const updateHint = () => {
    if (!hint || !formType) return;
    hint.textContent = HINTS[formType.value] || 'Choisissez un service pour voir quoi préciser.';
  };
  if (formType) formType.addEventListener('change', updateHint);

  // Les boutons des services pré-remplissent le service souhaité
  document.querySelectorAll('a[data-type]').forEach((a) => {
    a.addEventListener('click', () => {
      if (formType) { formType.value = a.dataset.type; updateHint(); }
    });
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
          updateHint();
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
