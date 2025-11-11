document.querySelectorAll('.chip').forEach((e) => {
  e.addEventListener('click', () => {
    document
      .querySelectorAll('.chip')
      .forEach((e) => e.classList.remove('active')),
      e.classList.add('active');
  });
}),
  document.querySelectorAll('.segmented__btn').forEach((e) => {
    e.addEventListener('click', () => {
      document
        .querySelectorAll('.segmented__btn')
        .forEach((e) => e.classList.remove('is-active')),
        e.classList.add('is-active');
    });
  }),
  (() => {
    let e = document.getElementById('projects'),
      t = document.getElementById('sbActive');
    function s() {
      let s = e.clientHeight,
        i = e.scrollHeight,
        n = Math.max(24, Math.round((s / i) * 371)),
        c = Math.round((e.scrollTop / Math.max(i - s, 1)) * (371 - n));
      (t.style.height = n + 'px'), (t.style.marginTop = c + 'px');
    }
    e.addEventListener('scroll', s), window.addEventListener('resize', s), s();
  })(),
  (() => {
    let e = document.getElementById('asideArrow'),
      t = document.getElementById('asidePromo');
    function s() {
      let s = !e.classList.contains('is-open');
      e.classList.toggle('is-open', s),
        e.setAttribute('aria-expanded', String(s)),
        t.classList.toggle('is-open', s);
    }
    e.addEventListener('click', s);
  })(),
  (() => {
    let e = document.getElementById('servicesBtn'),
      t = document.getElementById('servicesMenu'),
      s = document.getElementById('servicesInner'),
      i = () => t.querySelector('.services-scrollbar'),
      n = () => document.getElementById('svcSbActive');
    function c() {
      let e = i();
      if (!e) return;
      let t = n();
      if (!t) return;
      let c = e.clientHeight,
        l = s.clientHeight,
        a = s.scrollHeight,
        r = Math.max(24, Math.round((l / a) * c)),
        o = Math.round((s.scrollTop / Math.max(a - l, 1)) * (c - r));
      e.style.setProperty('--svc-h', r + 'px'),
        e.style.setProperty('--svc-top', o + 'px');
    }
    function l() {
      t.classList.contains('is-open') ||
        (t.classList.add('is-open'),
        e.classList.add('is-open'),
        e.setAttribute('aria-expanded', 'true'),
        requestAnimationFrame(c));
    }
    function a() {
      t.classList.contains('is-open') &&
        (t.classList.remove('is-open'),
        e.classList.remove('is-open'),
        e.setAttribute('aria-expanded', 'false'));
    }
    e.addEventListener('click', (e) => {
      e.stopPropagation(), t.classList.contains('is-open') ? a() : l();
    }),
      document.addEventListener('click', (s) => {
        t.contains(s.target) || e.contains(s.target) || a();
      }),
      s.addEventListener('scroll', c, { passive: !0 }),
      window.addEventListener('resize', c),
      t.addEventListener('click', (e) => {
        let t = e.target.closest('[data-toggle]');
        if (t) {
          t.closest('.services-item').classList.toggle('is-open'),
            requestAnimationFrame(c);
          return;
        }
        let s = e.target.closest('.service-opt');
        if (s) {
          s.classList.toggle('is-checked');
          let i = s.querySelector('input');
          i && (i.checked = s.classList.contains('is-checked'));
        }
      }),
      new MutationObserver(() => requestAnimationFrame(c)).observe(s, {
        subtree: !0,
        childList: !0,
      });
  })(),
  (() => {
    let e = document.getElementById('locationBtn'),
      t = document.getElementById('locationMenu'),
      s = t?.querySelector('.location-input');
    function i() {
      !t.classList.contains('is-open') &&
        (t.classList.add('is-open'),
        e.classList.add('is-open'),
        e.setAttribute('aria-expanded', 'true'),
        s && setTimeout(() => s.focus(), 0));
    }
    function n() {
      t.classList.contains('is-open') &&
        (t.classList.remove('is-open'),
        e.classList.remove('is-open'),
        e.setAttribute('aria-expanded', 'false'));
    }
    e &&
      t &&
      (e.addEventListener('click', (e) => {
        e.stopPropagation(), t.classList.contains('is-open') ? n() : i();
      }),
      t.addEventListener('click', (e) => e.stopPropagation()),
      document.addEventListener('click', (s) => {
        t.contains(s.target) || e.contains(s.target) || n();
      }));
  })(),
  (() => {
    let e = document.getElementById('projectModal');
    if (!e) return;
    let t = e.querySelector('.project-modal__dialog'),
      s = e.querySelectorAll('[data-close]'),
      i = document.querySelectorAll('.project__link');
    function n(e) {
      document.documentElement.style.overflow = e ? 'hidden' : '';
    }
    function c(t) {
      t && t.preventDefault(),
        e.classList.add('is-open'),
        e.setAttribute('aria-hidden', 'false'),
        n(!0);
    }
    function l() {
      e.classList.remove('is-open'),
        e.setAttribute('aria-hidden', 'true'),
        n(!1);
    }
    i.forEach((e) => e.addEventListener('click', c)),
      s.forEach((e) => e.addEventListener('click', l)),
      e.addEventListener('click', (e) => {
        t.contains(e.target) || l();
      }),
      window.addEventListener('keydown', (e) => {
        'Escape' === e.key && l();
      });
    let a = Array.from(e.querySelectorAll('.media-slide')),
      r = Array.from(e.querySelectorAll('.media-pagination .dot')),
      o = e.querySelector('#mdPrev'),
      d = e.querySelector('#mdNext'),
      u = 0;
    function p(e) {
      (u = (e + a.length) % a.length),
        a.forEach((e, t) => e.classList.toggle('is-active', t === u)),
        r.forEach((e, t) => e.classList.toggle('is-active', t === u));
    }
    o.addEventListener('click', () => p(u - 1)),
      d.addEventListener('click', () => p(u + 1)),
      r.forEach((e, t) => e.addEventListener('click', () => p(t)));
  })(),
  (() => {
    let e = document.getElementById('mediaBtn'),
      t = document.getElementById('asideScroll');
    function s() {
      e.classList.add('is-open'),
        e.setAttribute('aria-expanded', 'true'),
        t.classList.add('is-open');
    }
    function i() {
      e.classList.remove('is-open'),
        e.setAttribute('aria-expanded', 'false'),
        t.classList.remove('is-open');
    }
    e &&
      t &&
      (e.addEventListener('click', (t) => {
        t.stopPropagation(), e.classList.contains('is-open') ? i() : s();
      }),
      document.addEventListener('click', (s) => {
        e.contains(s.target) || t.contains(s.target) || i();
      }));
  })(),
  (() => {
    let e = document.getElementById('projectModal');
    if (!e) return;
    let t = e.querySelector('.project-modal__dialog'),
      s = e.querySelectorAll('[data-close]'),
      i = document.querySelectorAll('.project__link');
    function n(e) {
      document.documentElement.style.overflow = e ? 'hidden' : '';
    }
    function c(t) {
      t && t.preventDefault(),
        e.classList.add('is-open'),
        e.setAttribute('aria-hidden', 'false'),
        n(!0);
    }
    function l() {
      e.classList.remove('is-open'),
        e.setAttribute('aria-hidden', 'true'),
        n(!1);
    }
    i.forEach((e) => e.addEventListener('click', c)),
      s.forEach((e) => e.addEventListener('click', l)),
      e.addEventListener('click', (e) => {
        t.contains(e.target) || l();
      }),
      window.addEventListener('keydown', (e) => {
        'Escape' === e.key && l();
      });
    let a = Array.from(e.querySelectorAll('.media-slide')),
      r = Array.from(e.querySelectorAll('#mediaDots .dot')),
      o = Array.from(e.querySelectorAll('#mediaDotsMobile .dot')),
      d = e.querySelector('#mdPrev'),
      u = e.querySelector('#mdNext'),
      p = e.querySelector('#mdPrevMobile'),
      v = e.querySelector('#mdNextMobile'),
      L = 0;
    function E(e) {
      (L = (e + a.length) % a.length),
        a.forEach((e, t) => e.classList.toggle('is-active', t === L)),
        [...r, ...o].forEach((e, t) =>
          e.classList.toggle('is-active', t === L)
        );
    }
    [d, p].forEach((e) => e?.addEventListener('click', () => E(L - 1))),
      [u, v].forEach((e) => e?.addEventListener('click', () => E(L + 1))),
      [...r, ...o].forEach((e, t) => e.addEventListener('click', () => E(t)));
  })();
