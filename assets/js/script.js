/* ========= Helpers ========= */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/* ========= Chips ========= */
(() => {
  const chips = $$('.chip');
  if (!chips.length) return;
  chips.forEach((ch) => {
    ch.addEventListener('click', () => {
      chips.forEach((c) => c.classList.remove('active'));
      ch.classList.add('active');
    });
  });
})();

/* ========= Segmented control ========= */
(() => {
  const btns = $$('.segmented__btn');
  if (!btns.length) return;
  btns.forEach((b) => {
    b.addEventListener('click', () => {
      btns.forEach((x) => x.classList.remove('is-active'));
      b.classList.add('is-active');
    });
  });
})();

/* ========= Custom scrollbar for #projects ========= */
(() => {
  const host = $('#projects');
  const thumb = $('#sbActive'); // thumb height track is 371px in layout
  if (!host || !thumb) return;

  const TRACK_H = 371; // match your CSS/markup
  const MIN_THUMB = 24;

  const update = () => {
    const viewH = host.clientHeight;
    const scrollH = host.scrollHeight;
    const thumbH = Math.max(MIN_THUMB, Math.round((viewH / scrollH) * TRACK_H));
    const top = Math.round(
      (host.scrollTop / Math.max(scrollH - viewH, 1)) * (TRACK_H - thumbH)
    );
    thumb.style.height = thumbH + 'px';
    thumb.style.marginTop = top + 'px';
  };

  host.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();

/* ========= Aside promo toggle ========= */
(() => {
  const btn = $('#asideArrow');
  const panel = $('#asidePromo');
  if (!btn || !panel) return;

  const toggle = () => {
    const willOpen = !btn.classList.contains('is-open');
    btn.classList.toggle('is-open', willOpen);
    btn.setAttribute('aria-expanded', String(willOpen));
    panel.classList.toggle('is-open', willOpen);
  };

  btn.addEventListener('click', toggle);
})();

/* ========= Mutually exclusive aside actions ========= */
const ACTIONS = [
  { btn: '#servicesBtn', panel: '#servicesMenu' },
  { btn: '#locationBtn', panel: '#locationMenu' },
  { btn: '#mediaBtn', panel: '#asideScroll' },
];

function closeActions(exceptBtnSelector) {
  ACTIONS.forEach(({ btn, panel }) => {
    if (btn === exceptBtnSelector) return;
    const b = $(btn);
    const p = $(panel);
    if (b) {
      b.classList.remove('is-open');
      b.setAttribute('aria-expanded', 'false');
    }
    if (p) p.classList.remove('is-open');
  });
}

/* ========= Services menu (fixed scope) ========= */
(() => {
  const btn = $('#servicesBtn');
  const menu = $('#servicesMenu');
  const inner = $('#servicesInner'); // scrollable area
  const track = () => menu?.querySelector('.services-scrollbar'); // custom track
  if (!btn || !menu || !inner) return;

  const updateScrollbar = () => {
    const t = track();
    if (!t) return;
    const cH = t.clientHeight;
    const vH = inner.clientHeight;
    const sH = inner.scrollHeight;
    const thumbH = Math.max(24, Math.round((vH / sH) * cH));
    const top = Math.round(
      (inner.scrollTop / Math.max(sH - vH, 1)) * (cH - thumbH)
    );
    t.style.setProperty('--svc-h', thumbH + 'px');
    t.style.setProperty('--svc-top', top + 'px');
  };

  const open = () => {
    closeActions('#servicesBtn');
    if (menu.classList.contains('is-open')) return;
    menu.classList.add('is-open');
    btn.classList.add('is-open');
    btn.setAttribute('aria-expanded', 'true');
    requestAnimationFrame(updateScrollbar);
  };

  const close = () => {
    if (!menu.classList.contains('is-open')) return;
    menu.classList.remove('is-open');
    btn.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
  };

  btn.addEventListener('click', (ev) => {
    ev.stopPropagation();
    menu.classList.contains('is-open') ? close() : open();
  });

  document.addEventListener('click', (ev) => {
    if (menu.contains(ev.target) || btn.contains(ev.target)) return;
    close();
  });

  inner.addEventListener('scroll', updateScrollbar, { passive: true });
  window.addEventListener('resize', updateScrollbar);

  const primeHeads = () => {
    $$('.services-item__head', menu).forEach((h) => {
      h.setAttribute('role', 'button');
      h.setAttribute('tabindex', '0');
      const item = h.closest('.services-item');
      const expanded = item?.classList.contains('is-open');
      h.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    });
  };
  primeHeads();

  menu.addEventListener('click', (ev) => {
    // Клік по всій шапці відкриває/закриває
    const head = ev.target.closest('.services-item__head');
    if (head) {
      const item = head.closest('.services-item');
      if (item) {
        item.classList.toggle('is-open');
        head.setAttribute('aria-expanded', item.classList.contains('is-open'));
        requestAnimationFrame(updateScrollbar);
      }
      return;
    }

    // Старий тригер по стрілці теж лишається
    const tg = ev.target.closest('[data-toggle]');
    if (tg) {
      const item = tg.closest('.services-item');
      const headEl = item?.querySelector('.services-item__head');
      if (item) item.classList.toggle('is-open');
      if (headEl)
        headEl.setAttribute(
          'aria-expanded',
          item.classList.contains('is-open')
        );
      requestAnimationFrame(updateScrollbar);
      return;
    }

    // Клік по опції
    const row = ev.target.closest('.service-opt');
    if (row) {
      const input = row.querySelector('input');
      if (!input) return;
      if (ev.target !== input) input.checked = !input.checked;
      row.classList.toggle('is-checked', input.checked);
    }
  });

  menu.addEventListener('keydown', (ev) => {
    const head = ev.target.closest('.services-item__head');
    if (!head) return;
    if (ev.key === 'Enter' || ev.key === ' ') {
      ev.preventDefault();
      head.click();
    }
  });

  new MutationObserver(() => {
    requestAnimationFrame(() => {
      primeHeads();
      updateScrollbar();
    });
  }).observe(menu, { subtree: true, childList: true });
})();

/* ========= Location menu ========= */
(() => {
  const btn = $('#locationBtn');
  const menu = $('#locationMenu');
  if (!btn || !menu) return;
  const input = menu.querySelector('.location-input');

  const open = () => {
    closeActions('#locationBtn');
    if (menu.classList.contains('is-open')) return;
    menu.classList.add('is-open');
    btn.classList.add('is-open');
    btn.setAttribute('aria-expanded', 'true');
    if (input) setTimeout(() => input.focus(), 0);
  };

  const close = () => {
    if (!menu.classList.contains('is-open')) return;
    menu.classList.remove('is-open');
    btn.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
  };

  btn.addEventListener('click', (ev) => {
    ev.stopPropagation();
    menu.classList.contains('is-open') ? close() : open();
  });

  menu.addEventListener('click', (ev) => ev.stopPropagation());

  document.addEventListener('click', (ev) => {
    if (menu.contains(ev.target) || btn.contains(ev.target)) return;
    close();
  });
})();

/* ========= Media panel (aside scroll) ========= */
(() => {
  const btn = document.querySelector('#mediaBtn');
  const panel = document.querySelector('#asideScroll');
  if (!btn || !panel) return;

  const open = () => {
    // закриваємо інші меню, залишаємо лише media
    closeActions('#mediaBtn');
    btn.classList.add('is-open');
    btn.setAttribute('aria-expanded', 'true');
    panel.classList.add('is-open');
  };

  const close = () => {
    btn.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
    panel.classList.remove('is-open');
  };

  // toggle за кліком по кнопці
  btn.addEventListener('click', (ev) => {
    ev.stopPropagation();
    btn.classList.contains('is-open') ? close() : open();
  });

  // клік поза панеллю — закрити
  document.addEventListener('click', (ev) => {
    if (btn.contains(ev.target) || panel.contains(ev.target)) return;
    close();
  });

  // ВІДКРИВАЄМО ЗА ЗАМОВЧУВАННЯМ
  requestAnimationFrame(open);
})();

/* ========= Project modal (single implementation) ========= */
(() => {
  const modal = document.getElementById('projectModal');
  if (!modal) return;

  const dialog = modal.querySelector('.project-modal__dialog');
  const triggers = document.querySelectorAll('.project, .project__link'); // увесь кард + лінк
  const closers = modal.querySelectorAll('[data-close]');

  const lockScroll = (on) => {
    document.documentElement.style.overflow = on ? 'hidden' : '';
  };

  let swiper = null;
  const initSwiper = window.__initMediaSwiper || null; // якщо у тебе є ініціалізація окремо

  function open(ev) {
    if (ev) ev.preventDefault();
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    lockScroll(true);
    initSwiper && initSwiper(); // або прибери рядок, якщо ініціалізація вже є нижче
  }

  function close() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    lockScroll(false);
  }

  // клік по всій картці .project або по .project__link
  triggers.forEach((t) => {
    // доступність для всієї картки
    if (t.classList.contains('project')) {
      t.setAttribute('role', 'button');
      t.setAttribute('tabindex', '0');
      t.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open();
        }
      });
    }
    t.addEventListener('click', (e) => {
      // блокуємо перехід по <a>, модалка важливіша
      if (t.matches('.project__link')) e.preventDefault();
      open();
    });
  });

  // закриття
  closers.forEach((c) => c.addEventListener('click', close));
  modal.addEventListener('click', (e) => {
    if (!dialog.contains(e.target)) close();
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
})();

// 1) Ініціалізація Swiper з дефолтними bullet класами
const mediaSwiper = new Swiper('#mediaSwiper', {
  slidesPerView: 1,
  loop: true,
  autoHeight: true,
  navigation: { prevEl: '#mdPrev', nextEl: '#mdNext' },
  pagination: {
    el: '#mediaDots', // цей самий вузол переносимо між слотами
    clickable: true,
    bulletClass: 'swiper-pagination-bullet',
    bulletActiveClass: 'swiper-pagination-bullet-active',
    // без renderBullet — використовуємо дефолтні <span>
  },
});

// 2) Перенесення #mediaDots між десктоп/моб
(() => {
  const swiperRoot = document.getElementById('mediaSwiper');
  const dots = document.getElementById('mediaDots');
  const mobileSlot = document.getElementById('mediaDotsMobile');
  if (!swiperRoot || !dots || !mobileSlot) return;

  const mq = window.matchMedia('(max-width: 767.98px)');
  const place = () => {
    if (mq.matches) {
      if (!mobileSlot.contains(dots)) mobileSlot.appendChild(dots);
    } else {
      if (!swiperRoot.contains(dots)) swiperRoot.appendChild(dots);
    }
    // Після перенесення оновити позиціонування всередині Swiper
    mediaSwiper.pagination && mediaSwiper.pagination.render();
    mediaSwiper.pagination && mediaSwiper.pagination.update();
  };
  mq.addEventListener
    ? mq.addEventListener('change', place)
    : mq.addListener(place);
  place();
})();
const prevMob = document.getElementById('mdPrevMobile');
const nextMob = document.getElementById('mdNextMobile');
if (prevMob) prevMob.addEventListener('click', () => mediaSwiper.slidePrev());
if (nextMob) nextMob.addEventListener('click', () => mediaSwiper.slideNext());
