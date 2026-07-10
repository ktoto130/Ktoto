/* ============================================
   ktoto — Portfolio Script
   ============================================ */

// ── Language System ──
const translations = {
  en: 'en',
  ru: 'ru'
};

let currentLang = 'en';

function setLanguage(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;

  // Update all translatable elements
  document.querySelectorAll('[data-en]').forEach(el => {
    const text = el.getAttribute(`data-${lang}`);
    if (text) {
      // Preserve child elements (like icons inside buttons)
      const childNodes = Array.from(el.childNodes);
      const hasOnlyText = childNodes.every(n => n.nodeType === Node.TEXT_NODE);

      if (hasOnlyText || el.tagName === 'SPAN' || el.tagName === 'P' || el.tagName === 'H1' ||
          el.tagName === 'H2' || el.tagName === 'H3' || el.tagName === 'A' && !el.querySelector('svg')) {
        el.textContent = text;
      } else {
        // For elements with mixed content (e.g., button with icon)
        const textNode = childNodes.find(n => n.nodeType === Node.TEXT_NODE);
        const spanChild = el.querySelector('span:not([class])');
        if (spanChild) {
          spanChild.textContent = text;
        } else if (textNode) {
          textNode.textContent = text;
        } else {
          el.textContent = text;
        }
      }
    }
  });

  // Update lang buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  // Save preference
  localStorage.setItem('portfolio-lang', lang);
}

// Init language from localStorage
function initLanguage() {
  const saved = localStorage.getItem('portfolio-lang');
  if (saved && (saved === 'en' || saved === 'ru')) {
    setLanguage(saved);
  } else {
    setLanguage('en');
  }
}

// Language button events
document.getElementById('langEn').addEventListener('click', () => setLanguage('en'));
document.getElementById('langRu').addEventListener('click', () => setLanguage('ru'));


// ── Navbar Scroll Effect ──
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  navbar.classList.toggle('scrolled', scrollY > 40);
  lastScroll = scrollY;
}, { passive: true });


// ── Mobile Nav Toggle ──
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close mobile nav on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});


// ── Scroll Reveal ──
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  revealElements.forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.08}s`;
    observer.observe(el);
  });
}


// ── Smooth Scroll for Anchor Links ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;

    e.preventDefault();
    const target = document.querySelector(targetId);
    if (target) {
      const offset = 80;
      const pos = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: pos, behavior: 'smooth' });
    }
  });
});


// ── Project Card Tilt Effect (subtle) ──
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / centerY * -3;
    const rotateY = (x - centerX) / centerX * 3;

    card.style.transform = `translateY(-8px) perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});


// ── Init ──
document.addEventListener('DOMContentLoaded', () => {
  initLanguage();
  initScrollReveal();
});
