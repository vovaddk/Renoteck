// chips single-select
document.querySelectorAll('.chip').forEach((ch) => {
  ch.addEventListener('click', () => {
    document
      .querySelectorAll('.chip')
      .forEach((x) => x.classList.remove('active'));
    ch.classList.add('active');
  });
});

// segmented control single-select
document.querySelectorAll('.segmented__btn').forEach((b) => {
  b.addEventListener('click', () => {
    document
      .querySelectorAll('.segmented__btn')
      .forEach((x) => x.classList.remove('is-active'));
    b.classList.add('is-active');
  });
});

// активна синя ділянка (висота/зсув) без зміни скролу
(() => {
  const list = document.getElementById('projects');
  const active = document.getElementById('sbActive');
  const TRACK = 371;

  const clamp01 = (x) => Math.max(0, Math.min(1, x));

  function update() {
    const viewH = list.clientHeight;
    const fullH = list.scrollHeight;
    const max = Math.max(fullH - viewH, 1);

    const h = Math.max(24, Math.round((viewH / fullH) * TRACK));
    const top = Math.round((list.scrollTop / max) * (TRACK - h));

    active.style.height = h + 'px';
    active.style.marginTop = top + 'px';
  }
  list.addEventListener('scroll', update);
  window.addEventListener('resize', update);
  update();
})();

(() => {
  const arrow = document.getElementById('asideArrow');
  const promo = document.getElementById('asidePromo');

  function togglePromo() {
    const open = !arrow.classList.contains('is-open');
    arrow.classList.toggle('is-open', open);
    arrow.setAttribute('aria-expanded', String(open));
    promo.classList.toggle('is-open', open);
  }

  arrow.addEventListener('click', togglePromo);
})();
(() => {
  const btn = document.getElementById('servicesBtn');
  const menu = document.getElementById('servicesMenu');
  const inner = document.getElementById('servicesInner');

  const track = () => menu.querySelector('.services-scrollbar');
  const active = () => document.getElementById('svcSbActive');

  function updateServicesScrollbar() {
    const t = track();
    if (!t) return;
    const a = active();
    if (!a) return;

    const trackH = t.clientHeight; // видима висота треку
    const viewH = inner.clientHeight; // видима висота контенту
    const fullH = inner.scrollHeight; // повна висота контенту
    const max = Math.max(fullH - viewH, 1);

    const h = Math.max(24, Math.round((viewH / fullH) * trackH));
    const top = Math.round((inner.scrollTop / max) * (trackH - h));

    t.style.setProperty('--svc-h', h + 'px');
    t.style.setProperty('--svc-top', top + 'px');
  }

  function openMenu() {
    if (menu.classList.contains('is-open')) return;
    menu.classList.add('is-open');
    btn.classList.add('is-open');
    btn.setAttribute('aria-expanded', 'true');
    requestAnimationFrame(updateServicesScrollbar);
  }
  function closeMenu() {
    if (!menu.classList.contains('is-open')) return;
    menu.classList.remove('is-open');
    btn.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
  }

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.classList.contains('is-open') ? closeMenu() : openMenu();
  });

  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !btn.contains(e.target)) closeMenu();
  });

  inner.addEventListener('scroll', updateServicesScrollbar, { passive: true });
  window.addEventListener('resize', updateServicesScrollbar);

  // розкриття секцій і чекбокси
  menu.addEventListener('click', (e) => {
    const toggler = e.target.closest('[data-toggle]');
    if (toggler) {
      toggler.closest('.services-item').classList.toggle('is-open');
      requestAnimationFrame(updateServicesScrollbar);
      return;
    }
    const opt = e.target.closest('.service-opt');
    if (opt) {
      opt.classList.toggle('is-checked');
      const input = opt.querySelector('input');
      if (input) input.checked = opt.classList.contains('is-checked');
    }
  });

  // якщо контент змінюється
  new MutationObserver(() =>
    requestAnimationFrame(updateServicesScrollbar)
  ).observe(inner, { subtree: true, childList: true });
})();
(() => {
  const btn = document.getElementById('locationBtn');
  const menu = document.getElementById('locationMenu');
  const input = menu?.querySelector('.location-input');
  if (!btn || !menu) return;

  function openMenu() {
    if (menu.classList.contains('is-open')) return;
    menu.classList.add('is-open');
    btn.classList.add('is-open');
    btn.setAttribute('aria-expanded', 'true');
    if (input) setTimeout(() => input.focus(), 0);
  }
  function closeMenu() {
    if (!menu.classList.contains('is-open')) return;
    menu.classList.remove('is-open');
    btn.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
  }

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.classList.contains('is-open') ? closeMenu() : openMenu();
  });

  menu.addEventListener('click', (e) => e.stopPropagation());
  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !btn.contains(e.target)) closeMenu();
  });
})();
// open modal from any .project__link
(() => {
  const modal = document.getElementById('projectModal');
  if (!modal) return;

  const dialog = modal.querySelector('.project-modal__dialog');
  const closeEls = modal.querySelectorAll('[data-close]');
  const links = document.querySelectorAll('.project__link');

  function lockBody(lock) {
    document.documentElement.style.overflow = lock ? 'hidden' : '';
  }
  function openModal(e) {
    if (e) e.preventDefault();
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    lockBody(true);
  }
  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    lockBody(false);
  }

  links.forEach((a) => a.addEventListener('click', openModal));
  closeEls.forEach((el) => el.addEventListener('click', closeModal));
  modal.addEventListener('click', (e) => {
    if (!dialog.contains(e.target)) closeModal();
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // lightweight slider (prev/next + dots)
  const slides = Array.from(modal.querySelectorAll('.media-slide'));
  const dots = Array.from(modal.querySelectorAll('.media-pagination .dot'));
  const prev = modal.querySelector('#mdPrev');
  const next = modal.querySelector('#mdNext');

  let idx = 0;
  function setSlide(i) {
    idx = (i + slides.length) % slides.length;
    slides.forEach((s, k) => s.classList.toggle('is-active', k === idx));
    dots.forEach((d, k) => d.classList.toggle('is-active', k === idx));
  }
  prev.addEventListener('click', () => setSlide(idx - 1));
  next.addEventListener('click', () => setSlide(idx + 1));
  dots.forEach((d, k) => d.addEventListener('click', () => setSlide(k)));
})();
(() => {
  const btn = document.getElementById('mediaBtn');
  // ЗМІНЕНО ТУТ:
  const menu = document.getElementById('asideScroll'); // Було 'mediaMenu'

  if (!btn || !menu) return; // Також додав !menu для надійності

  function open() {
    btn.classList.add('is-open');
    btn.setAttribute('aria-expanded', 'true');
    menu.classList.add('is-open'); // Тепер це буде працювати
  }
  function close() {
    btn.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
    menu.classList.remove('is-open'); // І тут
  }

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    btn.classList.contains('is-open') ? close() : open();
  });

  document.addEventListener('click', (e) => {
    // Ця логіка тепер коректно закриватиме меню при кліку поза ним
    if (!btn.contains(e.target) && !menu.contains(e.target)) close();
  });
})();
(() => {
  const modal = document.getElementById('projectModal');
  if (!modal) return;

  const dialog = modal.querySelector('.project-modal__dialog');
  const closeEls = modal.querySelectorAll('[data-close]');
  const links = document.querySelectorAll('.project__link');

  // --- відкриття / закриття ---
  function lockBody(lock) {
    document.documentElement.style.overflow = lock ? 'hidden' : '';
  }
  function openModal(e) {
    if (e) e.preventDefault();
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    lockBody(true);
  }
  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    lockBody(false);
  }

  links.forEach((a) => a.addEventListener('click', openModal));
  closeEls.forEach((el) => el.addEventListener('click', closeModal));
  modal.addEventListener('click', (e) => {
    if (!dialog.contains(e.target)) closeModal();
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // --- універсальний слайдер ---
  const slides = Array.from(modal.querySelectorAll('.media-slide'));
  const dotsDesktop = Array.from(modal.querySelectorAll('#mediaDots .dot'));
  const dotsMobile = Array.from(
    modal.querySelectorAll('#mediaDotsMobile .dot')
  );
  const prevDesktop = modal.querySelector('#mdPrev');
  const nextDesktop = modal.querySelector('#mdNext');
  const prevMobile = modal.querySelector('#mdPrevMobile');
  const nextMobile = modal.querySelector('#mdNextMobile');

  let idx = 0;

  function setSlide(i) {
    idx = (i + slides.length) % slides.length;
    slides.forEach((s, k) => s.classList.toggle('is-active', k === idx));
    [...dotsDesktop, ...dotsMobile].forEach((d, k) =>
      d.classList.toggle('is-active', k === idx)
    );
  }

  // --- події ---
  [prevDesktop, prevMobile].forEach((btn) =>
    btn?.addEventListener('click', () => setSlide(idx - 1))
  );
  [nextDesktop, nextMobile].forEach((btn) =>
    btn?.addEventListener('click', () => setSlide(idx + 1))
  );

  [...dotsDesktop, ...dotsMobile].forEach((d, k) =>
    d.addEventListener('click', () => setSlide(k))
  );
})();
