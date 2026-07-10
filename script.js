/* ============================================
   ktoto — Portfolio Script
   ============================================ */

// ── Page Preloader (Lumora Style) ──
document.body.style.overflow = 'hidden';

const loader = document.getElementById('pageLoader');
const loaderBar = document.getElementById('loaderBar');
const loaderCounter = document.getElementById('loaderCounter');

if (loader) {
  let progress = 0;
  const duration = 1200; // 1.2 seconds loading time
  const intervalTime = 15;
  const step = 100 / (duration / intervalTime);

  const timer = setInterval(() => {
    progress += step;
    if (progress >= 100) {
      progress = 100;
      clearInterval(timer);
      
      if (loaderBar) loaderBar.style.width = '100%';
      if (loaderCounter) loaderCounter.textContent = '100';
      
      setTimeout(() => {
        loader.classList.add('exit');
        document.body.style.overflow = ''; // Enable scrolling
      }, 250);
    } else {
      const displayProgress = Math.floor(progress);
      if (loaderBar) loaderBar.style.width = `${displayProgress}%`;
      if (loaderCounter) loaderCounter.textContent = displayProgress.toString().padStart(2, '0');
    }
  }, intervalTime);
}

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


// ── Projects Carousel (Slider) ──
function initProjectsCarousel() {
  const track = document.getElementById('projectsTrack');
  const slides = Array.from(track ? track.children : []);
  const prevBtn = document.querySelector('.prev-arrow');
  const nextBtn = document.querySelector('.next-arrow');
  const dots = document.querySelectorAll('.indicator-dot');
  const viewport = document.querySelector('.projects-carousel-viewport');

  if (!track || slides.length === 0 || !viewport) return;

  let currentIndex = 0;
  let isDragging = false;
  let startX = 0;

  function updateCarousel(index) {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;

    currentIndex = index;

    const paddingLeft = parseInt(window.getComputedStyle(viewport).paddingLeft) || 0;
    const amountToMove = slides[currentIndex].offsetLeft - paddingLeft;
    
    track.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    track.style.transform = `translateX(-${amountToMove}px)`;

    // Toggle active classes on slides
    slides.forEach((slide, idx) => {
      if (idx === currentIndex) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    // Toggle active classes on dot indicators
    dots.forEach((dot, idx) => {
      if (idx === currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  function getPositionX(event) {
    return event.type.includes('mouse') ? event.clientX : event.touches[0].clientX;
  }

  function dragStart(event) {
    isDragging = true;
    startX = getPositionX(event);
    track.style.transition = 'none';
    if (event.type.includes('mouse')) {
      viewport.style.cursor = 'grabbing';
    }
  }

  function dragMove(event) {
    if (!isDragging) return;
    
    const currentX = getPositionX(event);
    const diff = currentX - startX;
    
    const paddingLeft = parseInt(window.getComputedStyle(viewport).paddingLeft) || 0;
    const currentTranslate = -(slides[currentIndex].offsetLeft - paddingLeft) + diff;
    track.style.transform = `translateX(${currentTranslate}px)`;
  }

  function dragEnd(event) {
    if (!isDragging) return;
    isDragging = false;
    viewport.style.cursor = 'grab';
    
    const endX = event.type.includes('mouse') 
      ? event.clientX 
      : (event.changedTouches && event.changedTouches[0] ? event.changedTouches[0].clientX : startX);
      
    const diff = endX - startX;

    if (diff < -60) {
      updateCarousel(currentIndex + 1);
    } else if (diff > 60) {
      updateCarousel(currentIndex - 1);
    } else {
      updateCarousel(currentIndex);
    }
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      updateCarousel(currentIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      updateCarousel(currentIndex + 1);
    });
  }

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      updateCarousel(idx);
    });
  });

  // Touch Events
  viewport.addEventListener('touchstart', dragStart, { passive: true });
  viewport.addEventListener('touchmove', dragMove, { passive: true });
  viewport.addEventListener('touchend', dragEnd);

  // Mouse Events
  viewport.addEventListener('mousedown', dragStart);
  viewport.addEventListener('mousemove', dragMove);
  viewport.addEventListener('mouseup', dragEnd);
  viewport.addEventListener('mouseleave', dragEnd);

  // Window Resize
  window.addEventListener('resize', () => {
    updateCarousel(currentIndex);
  });

  updateCarousel(0);
}


// ── Init ──
document.addEventListener('DOMContentLoaded', () => {
  initLanguage();
  initScrollReveal();
  initProjectsCarousel();
});
