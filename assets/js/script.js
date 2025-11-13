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

  const isMobileServices = () =>
    window.matchMedia('(max-width: 600px)').matches;

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

  // позиціонуємо ПО ПРАВОМУ краю кнопки тільки на десктопі
  const positionMenu = () => {
    // на мобілці — тільки CSS (left/right: 12px)
    if (isMobileServices()) {
      menu.style.left = '';
      menu.style.right = '';
      return;
    }

    const parent = menu.offsetParent || menu.parentElement;
    if (!parent) return;

    const btnRect = btn.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();
    const menuWidth = menu.offsetWidth;
    if (!menuWidth) return;

    const left = btnRect.right - parentRect.left - menuWidth;
    menu.style.left = `${left}px`;
    // на десктопі right нам не потрібен
    menu.style.right = '';
  };

  const open = () => {
    closeActions('#servicesBtn');
    if (menu.classList.contains('is-open')) return;
    menu.classList.add('is-open');
    btn.classList.add('is-open');
    btn.setAttribute('aria-expanded', 'true');

    requestAnimationFrame(() => {
      positionMenu();
      updateScrollbar();
    });
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

  window.addEventListener('resize', () => {
    if (!menu.classList.contains('is-open')) return;
    positionMenu();
    updateScrollbar();
  });

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

    const tg = ev.target.closest('[data-toggle]');
    if (tg) {
      const item = tg.closest('.services-item');
      const headEl = item?.querySelector('.services-item__head');
      if (item) item.classList.toggle('is-open');
      if (headEl) {
        headEl.setAttribute(
          'aria-expanded',
          item.classList.contains('is-open')
        );
      }
      requestAnimationFrame(updateScrollbar);
      return;
    }

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
      if (menu.classList.contains('is-open')) {
        positionMenu();
      }
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
  if (typeof ACTIONS !== 'undefined' && Array.isArray(ACTIONS)) {
    const indexToRemove = ACTIONS.findIndex(
      (action) => action.panel === '#asideScroll' || action.btn === '#mediaBtn'
    );

    if (indexToRemove > -1) {
      ACTIONS.splice(indexToRemove, 1);
    }
  }

  const btn = document.querySelector('#moreBtn');
  const panel = document.querySelector('#asideScroll');
  const bottomCard = document.querySelector('.aside-card--bottom');
  const aside = document.querySelector('.section-map__aside');
  const mapFrame = document.querySelector('.section-map__frame');

  if (!btn || !panel || !aside || !bottomCard || !mapFrame) {
    console.warn('Один або декілька елементів для aside scroll не знайдено.');
    return;
  }

  const isMobile = () => window.matchMedia('(max-width: 768px)').matches;

  const open = () => {
    closeActions('#moreBtn');

    btn.classList.add('is-open');
    btn.setAttribute('aria-expanded', 'true');
    panel.classList.add('is-open');
    bottomCard.classList.add('is-open');
    aside.classList.add('panel-is-open');

    if (isMobile()) {
      mapFrame.style.marginTop = '35%';
    }
  };

  const close = () => {
    btn.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
    panel.classList.remove('is-open');
    bottomCard.classList.remove('is-open');
    aside.classList.remove('panel-is-open');

    if (isMobile()) {
      mapFrame.style.marginTop = '0';
    }
  };

  const handleModeChange = () => {
    if (isMobile()) {
      btn.style.display = '';

      aside.style.height = '';
      panel.style.height = '';
      panel.style.maxHeight = '';

      if (btn.classList.contains('is-open')) {
        open();
      } else {
        close();
      }
    } else {
      btn.style.display = 'none';

      aside.style.height = '';
      panel.style.height = '';
      panel.style.maxHeight = '';

      mapFrame.style.marginTop = '';

      open();
    }
  };

  btn.addEventListener('click', (ev) => {
    ev.stopPropagation();
    if (btn.classList.contains('is-open')) {
      close();
    } else {
      open();
    }
  });

  document.addEventListener('click', (ev) => {
    if (!isMobile()) return;

    if (
      btn.contains(ev.target) ||
      (bottomCard && bottomCard.contains(ev.target))
    ) {
      return;
    }

    if (btn.classList.contains('is-open')) {
      close();
    }
  });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(handleModeChange, 100);
  });

  const imgs = panel.querySelectorAll('img');
  imgs.forEach((img) => {
    if (img.complete) return;
    img.addEventListener('load', () => {});
  });

  open();

  handleModeChange();
})();

/* ========= Project modal + media swiper ========= */
(() => {
  const modal = document.getElementById('projectModal');
  if (!modal) return;

  const dialog = modal.querySelector('.project-modal__dialog');
  const triggers = document.querySelectorAll('.project, .project__link');
  const closers = modal.querySelectorAll('[data-close]');

  const swiperEl = document.getElementById('mediaSwiper');
  const dots = document.getElementById('mediaDots');
  const mobileSlot = document.getElementById('mediaDotsMobile');

  const prevBtn = document.getElementById('mdPrev');
  const nextBtn = document.getElementById('mdNext');
  const prevMob = document.getElementById('mdPrevMobile');
  const nextMob = document.getElementById('mdNextMobile');

  const mq = window.matchMedia('(max-width: 767.98px)');

  let mediaSwiper = null;

  const lockScroll = (on) => {
    document.documentElement.style.overflow = on ? 'hidden' : '';
    document.body.style.overflow = on ? 'hidden' : '';
  };

  const moveDots = () => {
    if (!dots || !swiperEl || !mobileSlot) return;

    if (mq.matches) {
      if (!mobileSlot.contains(dots)) mobileSlot.appendChild(dots);
      dots.classList.add('media-pagination--mobile');
    } else {
      if (!swiperEl.contains(dots)) swiperEl.appendChild(dots);
      dots.classList.remove('media-pagination--mobile');
    }

    if (
      mediaSwiper &&
      mediaSwiper.pagination &&
      mediaSwiper.pagination.update
    ) {
      mediaSwiper.pagination.update();
    }
  };

  const initMediaSwiper = () => {
    if (!swiperEl || typeof Swiper === 'undefined') return;

    if (mediaSwiper) {
      mediaSwiper.destroy(true, true);
      mediaSwiper = null;
    }

    mediaSwiper = new Swiper(swiperEl, {
      slidesPerView: 1,
      loop: false,
      rewind: true,
      pagination: {
        el: dots,
        clickable: true,
        bulletClass: 'swiper-pagination-bullet',
        bulletActiveClass: 'swiper-pagination-bullet-active',
      },
    });

    requestAnimationFrame(moveDots);
  };

  const destroyMediaSwiper = () => {
    if (!mediaSwiper) return;
    mediaSwiper.destroy(true, true);
    mediaSwiper = null;
  };

  const handlePrev = (e) => {
    e && e.preventDefault();
    if (mediaSwiper) mediaSwiper.slidePrev();
  };

  const handleNext = (e) => {
    e && e.preventDefault();
    if (mediaSwiper) mediaSwiper.slideNext();
  };

  if (prevBtn) prevBtn.addEventListener('click', handlePrev);
  if (nextBtn) nextBtn.addEventListener('click', handleNext);
  if (prevMob) prevMob.addEventListener('click', handlePrev);
  if (nextMob) nextMob.addEventListener('click', handleNext);

  if (mq.addEventListener) {
    mq.addEventListener('change', moveDots);
  } else {
    mq.addListener(moveDots);
  }

  const openModal = (ev) => {
    if (ev) ev.preventDefault();
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    lockScroll(true);
    initMediaSwiper();
  };

  const closeModal = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    lockScroll(false);
    destroyMediaSwiper();
  };

  triggers.forEach((t) => {
    if (t.classList.contains('project')) {
      t.setAttribute('role', 'button');
      t.setAttribute('tabindex', '0');
      t.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal(e);
        }
      });
    }

    t.addEventListener('click', (e) => {
      if (t.matches('.project__link')) e.preventDefault();
      openModal(e);
    });
  });

  closers.forEach((c) => c.addEventListener('click', closeModal));

  modal.addEventListener('click', (e) => {
    if (!dialog.contains(e.target)) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });
})();
