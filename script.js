const links = document.querySelectorAll('a[href^="#"]');

links.forEach((link) => {
  link.addEventListener('click', (event) => {
    const targetId = link.getAttribute('href');
    if (targetId.startsWith('#')) {
      event.preventDefault();
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
});

// Intersection Observer to reveal sections, project cards, header, images and icons
const observerOptions = { root: null, rootMargin: '0px', threshold: 0.12 };
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // add in-view to trigger CSS transitions
      entry.target.classList.add('in-view');
    }
  });
}, observerOptions);

// observe common elements for entrance animations
document.querySelectorAll('.section, .project-card, .brand-logo, .hero-image-wrapper, .hero-card, .skill-card, .stat-card, .project-image, .footer-brand, .site-nav a, h1, h2, .lead, .tiny-icon').forEach((el) => {
  // add generic animate marker so initial state is set in CSS
  el.classList.add('animate');
  observer.observe(el);
});

// staggered groups (if present) animate their children when the container comes into view
document.querySelectorAll('.stagger').forEach((container) => { container.classList.add('animate'); observer.observe(container); });

// small hover tilt effect for images
document.querySelectorAll('.project-image').forEach((img) => {
  img.addEventListener('mousemove', (e) => {
    const rect = img.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    img.style.transform = `perspective(600px) rotateX(${ -y * 5 }deg) rotateY(${ x * 8 }deg)`;
    img.style.boxShadow = `0 18px 40px rgba(11,20,40,0.35)`;
  });
  img.addEventListener('mouseleave', () => { img.style.transform = ''; img.style.boxShadow = ''; });
});

// add press/click animation for interactive elements
function addPressHandlers(selector) {
  document.querySelectorAll(selector).forEach((el) => {
    el.addEventListener('mousedown', () => el.classList.add('is-pressed'));
    el.addEventListener('touchstart', () => el.classList.add('is-pressed'));
    window.addEventListener('mouseup', () => el.classList.remove('is-pressed'));
    window.addEventListener('touchend', () => el.classList.remove('is-pressed'));
  });
}

addPressHandlers('.btn, .project-card, .skill-card, .stat-card, .site-nav a, .brand-logo');

// mobile side-panel menu toggle
const navToggle = document.querySelector('.nav-toggle');
const sidePanel = document.getElementById('sidePanel');
const sideBackdrop = document.getElementById('sideBackdrop');

if (navToggle && sidePanel && sideBackdrop) {
  function openSide(open) {
    navToggle.classList.toggle('open', open);
    sidePanel.classList.toggle('open', open);
    sideBackdrop.classList.toggle('open', open);
    sidePanel.setAttribute('aria-hidden', !open);
  }

  navToggle.addEventListener('click', () => {
    const isOpen = !sidePanel.classList.contains('open');
    openSide(isOpen);
  });

  // close controls
  sideBackdrop.addEventListener('click', () => openSide(false));
  sidePanel.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => openSide(false)));
  const sideClose = sidePanel.querySelector('.side-close');
  if (sideClose) sideClose.addEventListener('click', () => openSide(false));
}

// Project modal handling
const modal = document.getElementById('project-modal');
const modalTitle = document.getElementById('modal-title');
const modalTech = document.getElementById('modal-tech');
const modalDesc = document.getElementById('modal-desc');

function openModal(card) {
  const title = card.dataset.title || card.querySelector('h3')?.innerText || 'Project';
  const tech = card.dataset.tech || '';
  const detail = card.dataset.detail || card.querySelector('p')?.innerText || '';
  modalTitle.textContent = title;
  modalTech.textContent = tech;
  modalDesc.textContent = detail;
  modal.setAttribute('aria-hidden', 'false');
  modal.classList.add('in-view');
}

function closeModal() {
  modal.setAttribute('aria-hidden', 'true');
  modal.classList.remove('in-view');
}

// open when clicking a project-card
document.querySelectorAll('.project-card').forEach((card) => {
  card.style.cursor = 'pointer';
  card.addEventListener('click', () => openModal(card));
});

// close handlers
modal.querySelectorAll('[data-close], .modal-close').forEach((el) => el.addEventListener('click', closeModal));
window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

