document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');

  if (nav && !nav.querySelector('.mobile-nav-cta')) {
    const mobileCta = document.createElement('a');
    mobileCta.className = 'mobile-nav-cta';
    mobileCta.href = 'iletisim.html#teklif';
    mobileCta.textContent = 'TEKLİF AL';
    nav.appendChild(mobileCta);
  }

  const closeMenu = () => {
    body.classList.remove('menu-open');
    menuButton?.setAttribute('aria-expanded', 'false');
  };

  menuButton?.addEventListener('click', () => {
    const isOpen = body.classList.toggle('menu-open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  window.addEventListener('resize', () => { if (window.innerWidth > 1024) closeMenu(); });

  const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 20);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .12 });
    reveals.forEach(el => observer.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-visible'));
  }

  const form = document.querySelector('#contact-form');
  form?.addEventListener('submit', event => {
    event.preventDefault();
    const message = document.querySelector('#form-message');
    message?.classList.add('show');
    message?.setAttribute('role', 'status');
    form.reset();
    message?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
});
