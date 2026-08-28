document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const root = document.documentElement;
  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  const brandIntro = document.querySelector('[data-brand-intro]');

  if (brandIntro) {
    const introWasShown = root.classList.contains('intro-seen');

    if (introWasShown) {
      brandIntro.remove();
      root.classList.remove('intro-pending');
    } else {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      let introFinished = false;
      body.classList.add('intro-active');
      root.classList.add('intro-active');

      const finishIntro = () => {
        if (introFinished) return;
        introFinished = true;
        body.classList.remove('intro-active');
        root.classList.remove('intro-active');
        root.classList.add('intro-complete');
        brandIntro.style.pointerEvents = 'none';
        window.setTimeout(() => brandIntro.remove(), reducedMotion ? 20 : 80);
        window.setTimeout(() => root.classList.remove('intro-pending'), reducedMotion ? 20 : 180);
      };

      window.setTimeout(finishIntro, 2400);
      try { sessionStorage.setItem('argentIntroShown', '1'); } catch (error) { /* Intro still closes safely. */ }
      window.setTimeout(finishIntro, reducedMotion ? 180 : 2100);
    }
  }

  if (nav && !nav.querySelector('.mobile-nav-cta')) {
    const mobileCta = document.createElement('a');
    mobileCta.className = 'mobile-nav-cta';
    mobileCta.href = 'iletisim.html#teklif';
    mobileCta.textContent = 'TEKLİF AL';
    nav.appendChild(mobileCta);
  }

  const closeMenu = () => {
    body.classList.remove('menu-open');
    root.classList.remove('menu-open');
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.setAttribute('aria-label', 'Menüyü aç');
  };

  menuButton?.addEventListener('click', () => {
    const isOpen = body.classList.toggle('menu-open');
    root.classList.toggle('menu-open', isOpen);
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Menüyü kapat' : 'Menüyü aç');
  });
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && body.classList.contains('menu-open')) closeMenu();
  });
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
  const requestedProduct = new URLSearchParams(window.location.search).get('urun');
  const productSelect = form?.elements.namedItem('product');

  if (requestedProduct && productSelect instanceof HTMLSelectElement) {
    const requestedOption = Array.from(productSelect.options).find(option => option.value === requestedProduct);
    if (requestedOption) productSelect.value = requestedProduct;
  }

  form?.addEventListener('submit', event => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);
    const value = field => String(formData.get(field) || '').trim();
    const productLabel = productSelect instanceof HTMLSelectElement
      ? productSelect.selectedOptions[0]?.textContent?.trim()
      : value('product');
    const lines = [
      '*ARGENT TEKSTİL - YENİ ÜRETİM TALEBİ*',
      '',
      `Ad Soyad: ${value('name')}`
    ];

    if (value('company')) lines.push(`Firma / Marka: ${value('company')}`);
    lines.push(`Telefon: ${value('phone')}`);
    if (value('email')) lines.push(`E-posta: ${value('email')}`);
    lines.push(`Ürün Grubu: ${productLabel}`);
    if (value('quantity')) lines.push(`Tahmini Adet: ${value('quantity')}`);
    lines.push('', 'Mesaj:', value('message'));

    const whatsappUrl = `https://wa.me/905425135777?text=${encodeURIComponent(lines.join('\n'))}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  });

  document.querySelectorAll('[data-product-gallery]').forEach(gallery => {
    const mainImage = gallery.querySelector('[data-main-image]');
    const thumbnails = gallery.querySelectorAll('[data-thumbnail]');

    thumbnails.forEach(thumbnail => {
      thumbnail.addEventListener('click', () => {
        if (!mainImage || thumbnail.classList.contains('is-active')) return;

        mainImage.classList.add('is-changing');
        window.setTimeout(() => {
          mainImage.src = thumbnail.dataset.imageSrc;
          mainImage.alt = thumbnail.dataset.imageAlt || '';
          thumbnails.forEach(item => {
            item.classList.remove('is-active');
            item.setAttribute('aria-pressed', 'false');
          });
          thumbnail.classList.add('is-active');
          thumbnail.setAttribute('aria-pressed', 'true');
          mainImage.classList.remove('is-changing');
        }, 100);
      });
    });
  });
});
