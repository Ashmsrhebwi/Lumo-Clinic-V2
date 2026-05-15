// ─── NAVBAR SCROLL ───
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });
}

// ─── FAQ TOGGLE ───
function toggleFaq(el) {
  const item = el.parentElement;
  const allItems = document.querySelectorAll('.faq-item');
  allItems.forEach(i => { if (i !== item) i.classList.remove('open'); });
  item.classList.toggle('open');
}

// ─── SCROLL ANIMATIONS ───
function observeFadeUps() {
  const elements = document.querySelectorAll('.fade-up:not(.visible), .fade-in:not(.visible)');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  elements.forEach(el => observer.observe(el));
}

// ─── MOBILE DRAWER MENU ───
function openMobileMenu() {
  const overlay = document.getElementById('nav-overlay');
  const drawer = document.getElementById('nav-drawer');
  if (overlay && drawer) {
    overlay.classList.add('open');
    drawer.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeMobileMenu() {
  const overlay = document.getElementById('nav-overlay');
  const drawer = document.getElementById('nav-drawer');
  if (overlay && drawer) {
    overlay.classList.remove('open');
    drawer.classList.remove('open');
    document.body.style.overflow = '';
  }
}

function toggleMobileMenu() {
  const drawer = document.getElementById('nav-drawer');
  if (drawer) {
    if (drawer.classList.contains('open')) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }
}

function toggleDrawerSub(el) {
  const li = el.parentElement;
  const isOpen = li.classList.contains('open');
  // close all
  document.querySelectorAll('.nav-drawer-links > li').forEach(l => l.classList.remove('open'));
  if (!isOpen) li.classList.add('open');
}

// ─── PREMIUM LOADER HANDLER ───
window.addEventListener('load', () => {
  const loader = document.getElementById('premium-loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('loader-hidden');
      document.body.style.overflow = 'auto';
    }, 1500);
  } else {
    document.body.style.overflow = 'auto';
  }
  observeFadeUps();
});

// Initial state: prevent scroll during loader if present
if (document.getElementById('premium-loader')) {
  document.body.style.overflow = 'hidden';
}
