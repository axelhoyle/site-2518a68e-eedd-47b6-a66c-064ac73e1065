/* =============================================
   MALIN JOSTEUS STRAND — script.js
   ============================================= */

(function () {
  'use strict';

  /* ---------- THEME TOGGLE ---------- */
  var themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme');
      var next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }

  /* ---------- NAV TOGGLE (MOBILE) ---------- */
  var navToggle = document.getElementById('navToggle');
  var siteNav = document.querySelector('.site-nav');
  if (navToggle && siteNav) {
    navToggle.addEventListener('click', function () {
      var open = siteNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-label', open ? 'Stäng meny' : 'Öppna meny');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    siteNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        siteNav.classList.remove('is-open');
        navToggle.setAttribute('aria-label', 'Öppna meny');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------- HERO PARALLAX ---------- */
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var heroBg = document.getElementById('heroBg');

  function applyParallax() {
    if (!heroBg || prefersReducedMotion) return;
    var scrollY = window.scrollY || window.pageYOffset;
    heroBg.style.transform = 'translateY(' + (scrollY * 0.35) + 'px)';
  }

  if (!prefersReducedMotion && heroBg) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          applyParallax();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    /* Mouse parallax on hero */
    var heroSection = document.querySelector('.hero');
    if (heroSection) {
      heroSection.addEventListener('mousemove', function (e) {
        if (prefersReducedMotion) return;
        var rect = heroSection.getBoundingClientRect();
        var cx = rect.left + rect.width / 2;
        var cy = rect.top + rect.height / 2;
        var dx = (e.clientX - cx) / rect.width;
        var dy = (e.clientY - cy) / rect.height;
        var scrollY = window.scrollY || window.pageYOffset;
        heroBg.style.transform =
          'translateY(' + (scrollY * 0.35) + 'px) translate(' +
          (dx * 12) + 'px, ' + (dy * 8) + 'px)';
      });
      heroSection.addEventListener('mouseleave', function () {
        applyParallax();
      });
    }
  }

  /* ---------- LOGO WRITE-IN (scroll-driven clip-path) ---------- */
  var colorImg = document.querySelector('.name-write-img .color');
  function updateLogoReveal() {
    if (!colorImg) return;
    var scrollY = window.scrollY || window.pageYOffset;
    var progress = Math.min(scrollY / 420, 1);
    var pct = Math.round(progress * 100);
    colorImg.style.clipPath = 'inset(0 ' + (100 - pct) + '% 0 0)';
  }
  if (colorImg) {
    if (prefersReducedMotion) {
      colorImg.style.clipPath = 'inset(0 0% 0 0)';
    } else {
      window.addEventListener('scroll', function () {
        requestAnimationFrame(updateLogoReveal);
      }, { passive: true });
      updateLogoReveal();
    }
  }

  /* ---------- REVEAL ON SCROLL ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

})();