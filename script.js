'use strict';

/* ---------------------------------------------------------
   Menú móvil
   --------------------------------------------------------- */
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#nav');
function closeMenu() {
  nav.classList.remove('is-open');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Abrir menú');
}
toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  nav.classList.toggle('is-open', open);
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    toggle.focus();
  }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.nav-wrap')) closeMenu();
});
window.matchMedia('(min-width: 801px)').addEventListener('change', event => {
  if (event.matches) closeMenu();
});
document.querySelector('#year').textContent = new Date().getFullYear();

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Resalta el enlace de la sección visible sin alterar el historial. */
if ('IntersectionObserver' in window) {
  const links = [...nav.querySelectorAll('a[href^="#"]')];
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(link => {
          const active = link.getAttribute('href') === '#' + entry.target.id;
          link.classList.toggle('active', active);
          if (active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      }
    });
  }, { rootMargin: '-15% 0px -55% 0px', threshold: 0 });
  document.querySelectorAll('main section[id]').forEach(section => observer.observe(section));
}

/* ---------------------------------------------------------
   Aparición suave de los bloques al hacer scroll
   --------------------------------------------------------- */
function initReveal() {
  if (reduceMotion || !('IntersectionObserver' in window)) return;

  const targets = document.querySelectorAll([
    '.section-heading',
    '.values-heading',
    '.about-grid > *',
    '.purpose',
    '.value',
    '.location-card',
    '.trust-grid > div',
    '.locations-note',
    '.showcase-copy',
    '.showcase-grid > *',
    '.contact-band .container > *',
    '.carousel',
    '.catalog-cta',
    '.footer-head',
    '.footer-address'
  ].join(','));

  if (!targets.length) return;

  const counters = new Map();
  targets.forEach(el => {
    const parent = el.parentElement;
    const index = counters.get(parent) || 0;
    counters.set(parent, index + 1);
    el.style.transitionDelay = Math.min(index, 5) * 110 + 'ms';
    el.classList.add('reveal');
  });

  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        obs.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

  targets.forEach(el => revealObserver.observe(el));
}
initReveal();

/* ---------------------------------------------------------
   Carrusel de servicios: flechas, puntos, deslizar y auto
   --------------------------------------------------------- */
function initCarousel(root) {
  const track = root.querySelector('[data-track]');
  const viewport = root.querySelector('.carousel-viewport');
  const prev = root.querySelector('[data-prev]');
  const next = root.querySelector('[data-next]');
  const dotsWrap = root.querySelector('[data-dots]');
  if (!track || !viewport || !prev || !next || !dotsWrap) return;

  const slides = Array.from(track.children);
  if (slides.length < 2) return;

  let dots = [];
  let index = 0;
  let perView = 4;
  let gap = 18;
  let maxIndex = slides.length - 1;
  let timer = null;
  let hovering = false;
  let focusInside = false;

  function measure() {
    const style = getComputedStyle(track);
    perView = Math.max(1, Math.round(parseFloat(style.getPropertyValue('--per-view')) || 4));
    gap = parseFloat(style.columnGap || style.gap) || 0;
    maxIndex = Math.max(0, slides.length - perView);
  }

  function stepWidth() {
    return slides[0].getBoundingClientRect().width + gap;
  }

  function buildDots() {
    const count = maxIndex + 1;
    if (dotsWrap.children.length === count) return;
    dotsWrap.textContent = '';
    for (let i = 0; i < count; i += 1) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'carousel-dot';
      dot.setAttribute('aria-label', 'Mostrar servicios desde el ' + (i + 1));
      dot.addEventListener('click', () => {
        goTo(i);
        restart();
      });
      dotsWrap.appendChild(dot);
    }
    dots = Array.from(dotsWrap.children);
  }

  function render() {
    track.style.transform = 'translate3d(' + (-index * stepWidth()) + 'px, 0, 0)';
    prev.disabled = index <= 0;
    next.disabled = index >= maxIndex;
    dots.forEach((dot, i) => {
      const active = i === index;
      dot.classList.toggle('is-active', active);
      if (active) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
  }

  function layout() {
    measure();
    buildDots();
    if (index > maxIndex) index = maxIndex;
    render();
  }

  function goTo(value) {
    index = Math.min(Math.max(value, 0), maxIndex);
    render();
  }

  function advance() {
    if (index >= maxIndex) {
      /* Vuelve al inicio sin arrastrar toda la fila: salto sin animación. */
      track.style.transition = 'none';
      index = 0;
      render();
      void track.offsetHeight;
      track.style.transition = '';
    } else {
      goTo(index + 1);
    }
  }

  function start() {
    if (reduceMotion || hovering || focusInside || document.hidden) return;
    stop();
    timer = window.setInterval(advance, 4600);
  }

  function stop() {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
  }

  function restart() {
    stop();
    start();
  }

  prev.addEventListener('click', () => { goTo(index - 1); restart(); });
  next.addEventListener('click', () => { goTo(index + 1); restart(); });

  root.addEventListener('pointerenter', () => { hovering = true; stop(); });
  root.addEventListener('pointerleave', () => { hovering = false; start(); });
  root.addEventListener('focusin', () => { focusInside = true; stop(); });
  root.addEventListener('focusout', event => {
    if (!root.contains(event.relatedTarget)) {
      focusInside = false;
      start();
    }
  });

  /* Deslizar con el dedo */
  let startX = null;
  let startY = null;
  viewport.addEventListener('touchstart', event => {
    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;
  }, { passive: true });
  viewport.addEventListener('touchend', event => {
    if (startX === null) return;
    const dx = event.changedTouches[0].clientX - startX;
    const dy = event.changedTouches[0].clientY - startY;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
      goTo(dx < 0 ? index + 1 : index - 1);
      restart();
    }
    startX = startY = null;
  }, { passive: true });

  let resizeId = null;
  window.addEventListener('resize', () => {
    if (resizeId) window.clearTimeout(resizeId);
    resizeId = window.setTimeout(layout, 150);
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else start();
  });

  layout();
  start();
}
document.querySelectorAll('[data-carousel]').forEach(initCarousel);

/* ---------------------------------------------------------
   Ondita al presionar botones
   --------------------------------------------------------- */
function ripple(event) {
  const target = event.currentTarget;
  const rect = target.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 2.2;
  const fromX = event.clientX || rect.left + rect.width / 2;
  const fromY = event.clientY || rect.top + rect.height / 2;
  const span = document.createElement('span');
  span.className = 'ripple';
  span.setAttribute('aria-hidden', 'true');
  span.style.width = size + 'px';
  span.style.height = size + 'px';
  span.style.left = (fromX - rect.left - size / 2) + 'px';
  span.style.top = (fromY - rect.top - size / 2) + 'px';
  target.appendChild(span);
  window.setTimeout(() => span.remove(), 650);
}

if (!reduceMotion) {
  document.querySelectorAll('.button, .carousel-btn, .floating-wa').forEach(el => {
    el.addEventListener('pointerdown', ripple);
  });
}
