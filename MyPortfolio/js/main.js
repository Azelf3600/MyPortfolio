// ══════════════════════════════════════════════
// CUSTOM CURSOR
// ══════════════════════════════════════════════
const cur  = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

(function tick() {
  cur.style.left = mx + 'px'; cur.style.top = my + 'px';
  rx += (mx - rx) * .1; ry += (my - ry) * .1;
  ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
  requestAnimationFrame(tick);
})();

document.querySelectorAll('a, button, .proj-card, .sk, .tag, .stat, .exp-item').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cur.style.width = '14px'; cur.style.height = '14px';
    ring.style.width = '46px'; ring.style.height = '46px';
  });
  el.addEventListener('mouseleave', () => {
    cur.style.width = '6px'; cur.style.height = '6px';
    ring.style.width = '28px'; ring.style.height = '28px';
  });
});

// ══════════════════════════════════════════════
// NAV — scroll shadow
// ══════════════════════════════════════════════
const nav = document.getElementById('navbar');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 40));

// ══════════════════════════════════════════════
// BURGER MENU
// ══════════════════════════════════════════════
const burger = document.getElementById('burger');
const links  = document.getElementById('nav-links');

burger.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  const [s1, s2, s3] = burger.querySelectorAll('span');
  s1.style.transform = open ? 'rotate(45deg) translate(5px,4px)' : '';
  s2.style.opacity   = open ? '0' : '1';
  s3.style.transform = open ? 'rotate(-45deg) translate(5px,-4px)' : '';
});

links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  links.classList.remove('open');
  burger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
}));

// ══════════════════════════════════════════════
// ACTIVE NAV LINK on scroll
// ══════════════════════════════════════════════
const secs  = document.querySelectorAll('section[id]');
const navAs = document.querySelectorAll('.nav-links a');

function setActive() {
  let current = '';
  secs.forEach(s => { if (scrollY >= s.offsetTop - 130) current = s.id; });
  navAs.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
}
window.addEventListener('scroll', setActive);
setActive();

// ══════════════════════════════════════════════
// SCROLL REVEAL
// ══════════════════════════════════════════════
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: .08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// ══════════════════════════════════════════════
// PROJECT CAROUSEL — drag + arrow + dots
// ══════════════════════════════════════════════
const carousel  = document.getElementById('projCarousel');
const arrowL    = document.getElementById('arrowLeft');
const arrowR    = document.getElementById('arrowRight');
const dots      = document.querySelectorAll('.cdot');
const cards     = carousel ? Array.from(carousel.querySelectorAll('.proj-card')) : [];

if (carousel && cards.length) {

  // ── Drag to scroll ──
  let isDown = false, startX = 0, scrollLeft = 0, hasDragged = false;

  carousel.addEventListener('mousedown', e => {
    isDown = true;
    hasDragged = false;
    startX = e.pageX - carousel.offsetLeft;
    scrollLeft = carousel.scrollLeft;
    carousel.style.cursor = 'grabbing';
  });

  document.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const x    = e.pageX - carousel.offsetLeft;
    const walk = (x - startX) * 1.4;
    if (Math.abs(walk) > 4) hasDragged = true;
    carousel.scrollLeft = scrollLeft - walk;
    syncDots();
  });

  document.addEventListener('mouseup', () => {
    isDown = false;
    carousel.style.cursor = 'grab';
  });

  // Block click-through on drag
  carousel.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', e => { if (hasDragged) e.preventDefault(); });
  });

  // Touch support
  let touchStartX = 0, touchScrollLeft = 0;
  carousel.addEventListener('touchstart', e => {
    touchStartX    = e.touches[0].pageX;
    touchScrollLeft = carousel.scrollLeft;
  }, { passive: true });
  carousel.addEventListener('touchmove', e => {
    const dx = touchStartX - e.touches[0].pageX;
    carousel.scrollLeft = touchScrollLeft + dx;
    syncDots();
  }, { passive: true });

  // ── Arrow navigation ──
  function getCardWidth() {
    return cards[0].offsetWidth + 2; // +2 for gap
  }

  arrowL.addEventListener('click', () => {
    carousel.scrollBy({ left: -getCardWidth(), behavior: 'smooth' });
    setTimeout(syncDots, 350);
  });
  arrowR.addEventListener('click', () => {
    carousel.scrollBy({ left: getCardWidth(), behavior: 'smooth' });
    setTimeout(syncDots, 350);
  });

  // ── Dots sync ──
  function syncDots() {
    const cw    = getCardWidth();
    const index = Math.round(carousel.scrollLeft / cw);
    const clamped = Math.max(0, Math.min(index, cards.length - 1));
    dots.forEach((d, i) => d.classList.toggle('active', i === clamped));
    arrowL.classList.toggle('disabled', carousel.scrollLeft <= 0);
    arrowR.classList.toggle('disabled', carousel.scrollLeft + carousel.offsetWidth >= carousel.scrollWidth - 2);
  }

  // ── Dot click ──
  dots.forEach(d => {
    d.addEventListener('click', () => {
      const i = parseInt(d.dataset.i);
      carousel.scrollTo({ left: i * getCardWidth(), behavior: 'smooth' });
      setTimeout(syncDots, 350);
    });
  });

  carousel.addEventListener('scroll', syncDots);
  syncDots();
}

// contact form removed — email opens via mailto: link directly