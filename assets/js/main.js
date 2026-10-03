(function () {
  'use strict';

  /* ---------------------------------------------------------------
     Mobile sidebar (slide-out)
     --------------------------------------------------------------- */
  var toggle = document.getElementById('sidebar-toggle');
  var sidebar = document.getElementById('sidebar');
  var backdrop = document.getElementById('sidebar-backdrop');

  function setOpen(open) {
    if (!sidebar) return;
    sidebar.classList.toggle('is-open', open);
    if (backdrop) {
      backdrop.classList.toggle('is-open', open);
      backdrop.hidden = !open;
    }
    if (toggle) toggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  }

  if (toggle) {
    toggle.addEventListener('click', function () {
      setOpen(!sidebar.classList.contains('is-open'));
    });
  }
  if (backdrop) backdrop.addEventListener('click', function () { setOpen(false); });
  if (sidebar) {
    sidebar.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        if (window.matchMedia('(max-width: 760px)').matches) setOpen(false);
      });
    });
  }

  /* ---------------------------------------------------------------
     Scroll reveal
     --------------------------------------------------------------- */
  var io = 'IntersectionObserver' in window
    ? new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
        });
      }, { threshold: 0.08 })
    : null;
  document.querySelectorAll('.reveal').forEach(function (el) {
    io ? io.observe(el) : el.classList.add('is-visible');
  });

  /* ---------------------------------------------------------------
     Image protection — deter casual right-click / drag save on
     brand, logo, icon, and profile imagery. Does NOT prevent
     determined copying (devtools, network tab, view-source).
     --------------------------------------------------------------- */
  var PROTECTED_PATHS = ['/img/brand/', '/img/logo/', '/img/icons/', '/img/profile/'];
  function isProtectedImg(el) {
    if (!el || el.tagName !== 'IMG') return false;
    if (el.closest('.protected-img') || el.classList.contains('protected-img')) return true;
    var src = el.getAttribute('src') || el.currentSrc || '';
    for (var i = 0; i < PROTECTED_PATHS.length; i++) {
      if (src.indexOf(PROTECTED_PATHS[i]) !== -1) return true;
    }
    return false;
  }
  document.addEventListener('contextmenu', function (e) {
    if (isProtectedImg(e.target)) e.preventDefault();
  });
  document.addEventListener('dragstart', function (e) {
    if (isProtectedImg(e.target)) e.preventDefault();
  });
  function shouldWatermark(img) {
    var src = (img.getAttribute('src') || img.currentSrc || '').toLowerCase();
    // Skip the brand mark itself — only files named neurovium-*.ext qualify.
    if (/\/neurovium-[a-z0-9-]+\.(svg|png|jpe?g|webp)(\?|$)/i.test(src)) return false;
    if (img.closest('.no-watermark') || img.classList.contains('no-watermark')) return false;
    if (img.classList.contains('card__image') || img.classList.contains('pcard__img')) return false;
    if (img.closest('.card__media') || img.closest('.pcard__media')) return false;
    return true;
  }
  document.querySelectorAll('img').forEach(function (img) {
    if (!isProtectedImg(img)) return;
    img.classList.add('protected-img');
    img.setAttribute('draggable', 'false');
    if (!shouldWatermark(img)) return;
    if (img.closest('.protected-img-wm')) return;
    var wrap = document.createElement('span');
    wrap.className = 'protected-img-wm';
    var parent = img.parentNode;
    parent.insertBefore(wrap, img);
    wrap.appendChild(img);
  });

  /* ---------------------------------------------------------------
     KaTeX — render anything with [data-katex] and the hero equation.
     KaTeX is loaded `defer`, so poll until window.katex exists.
     --------------------------------------------------------------- */
  var N4_EQUATION =
    "\\mathbf{N^{4}} \\;:=\\; \\{\\,\\mathcal{N}_{\\text{Physics}},\\; " +
    "\\mathcal{N}_{\\text{Computation}},\\; \\mathcal{N}_{\\text{Dynamics}}\\,\\} " +
    "\\;\\xrightarrow{\\;\\mathbb{F}\\;}\\; \\mathcal{N}\\text{euroAI}";

  function renderAllKatex() {
    if (!window.katex) { setTimeout(renderAllKatex, 80); return; }
    var hero = document.getElementById('hero-math');
    if (hero && !hero.dataset.rendered) {
      try { window.katex.render(N4_EQUATION, hero, { throwOnError: false, displayMode: true }); }
      catch (e) { hero.textContent = "N⁴ := { N_Physics, N_Computation, N_Dynamics } → NeuroAI"; }
      hero.dataset.rendered = '1';
    }
    document.querySelectorAll('[data-katex]').forEach(function (el) {
      if (el.dataset.rendered) return;
      try { window.katex.render(el.getAttribute('data-katex'), el, { throwOnError: false, displayMode: true }); }
      catch (e) { /* leave raw */ }
      el.dataset.rendered = '1';
    });
  }
  if (document.getElementById('hero-math') || document.querySelector('[data-katex]')) {
    renderAllKatex();
  }

  /* ---------------------------------------------------------------
     Rotating hero epigraph (quotes.js → window.pickQuote)
     --------------------------------------------------------------- */
  var epi = document.getElementById('hero-epigraph');
  if (epi && typeof window.pickQuote === 'function') {
    var q = window.pickQuote();
    var sizeClass = (typeof window.quoteSizeClass === 'function') ? window.quoteSizeClass(q.text) : 'q--md';
    epi.className = 'hero__epigraph ' + sizeClass;
    var t = epi.querySelector('.q-text');
    var w = epi.querySelector('.hero__who');
    if (t) t.textContent = '“' + q.text + '”';
    if (w) w.textContent = '— ' + q.who;
  }

  /* ---------------------------------------------------------------
     News — inline markdown/latex hint for [data-raw] bodies
     --------------------------------------------------------------- */
  document.querySelectorAll('.news__body[data-raw]').forEach(function (el) {
    var raw = el.getAttribute('data-raw');
    if (!raw) return;
    el.innerHTML = raw.split('\n\n').map(function (para) {
      return '<p>' + para
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/\$([^$]+)\$/g, '<code class="news__tex">$1</code>')
        .replace(/\*([^*]+)\*/g, '<em>$1</em>') + '</p>';
    }).join('');
  });

  /* ---------------------------------------------------------------
     Concept Fork panel  (Borges side panel)
     Opens for [data-fork] triggers; data from #concepts-data JSON.
     --------------------------------------------------------------- */
  var conceptsEl = document.getElementById('concepts-data');
  var panel = document.getElementById('fork-panel');
  if (conceptsEl && panel) {
    var CONCEPTS = {};
    try { CONCEPTS = JSON.parse(conceptsEl.textContent || '{}'); } catch (e) { CONCEPTS = {}; }

    var shell = document.getElementById('paper-shell');
    var fTitle = document.getElementById('fork-title');
    var fBody = document.getElementById('fork-body');
    var fRooms = document.getElementById('fork-rooms');
    var fList = document.getElementById('fork-rooms-list');
    var fWarp = document.getElementById('fork-warp');
    var fClose = document.getElementById('fork-close');

    function currentUrl() { return location.pathname; }

    function openFork(name) {
      var c = CONCEPTS[name];
      if (!c) return;
      panel.style.setProperty('--fork-orb', 'var(' + (c.wash || '--wash-oxblood') + ')');
      if (fTitle) fTitle.textContent = name;
      if (fBody) fBody.innerHTML = '<p>' + (c.blurb || '') + '</p>';

      var others = (c.rooms || []).filter(function (r) { return r.url !== currentUrl(); });
      if (fList) {
        fList.innerHTML = others.map(function (r) {
          return '<li><a href="' + r.url + '">' + r.title + '</a> · ' +
            '<span style="font-family:var(--mono);font-size:11px;letter-spacing:0.08em;color:var(--muted);text-transform:uppercase;">' + r.year + '</span></li>';
        }).join('');
      }
      if (fRooms) fRooms.hidden = others.length === 0;
      if (fWarp) {
        fWarp.innerHTML = others.length > 0
          ? '<a class="btn btn--warp" href="' + others[0].url + '">Follow this path into the Maze ' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></a>'
          : '<span style="font-family:var(--mono);font-size:11px;letter-spacing:0.12em;color:var(--muted);text-transform:uppercase;">Only one room holds this concept · stay here</span>';
      }
      panel.hidden = false;
      if (shell) shell.classList.add('has-fork');
      if (window.matchMedia('(max-width: 760px)').matches) {
        panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    function closeFork() {
      panel.hidden = true;
      if (shell) shell.classList.remove('has-fork');
    }

    document.addEventListener('click', function (e) {
      var trig = e.target.closest('[data-fork]');
      if (trig && CONCEPTS[trig.getAttribute('data-fork')]) {
        e.preventDefault();
        openFork(trig.getAttribute('data-fork'));
      }
    });
    if (fClose) fClose.addEventListener('click', closeFork);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeFork(); setOpen(false); }
    });
  } else {
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
  }

  /* ---------------------------------------------------------------
     Gallery lightbox — thumbnails open full size; ← / → / Esc
     --------------------------------------------------------------- */
  (function () {
    var cells = Array.prototype.slice.call(
      document.querySelectorAll('.gallery__cell')
    );
    if (!cells.length) return;

    var box, img, cap, count, prevBtn, nextBtn, closeBtn;
    var group = [], at = 0, lastFocus = null;

    function build() {
      box = document.createElement('div');
      box.className = 'lightbox';
      box.hidden = true;
      box.setAttribute('role', 'dialog');
      box.setAttribute('aria-modal', 'true');
      box.setAttribute('aria-label', 'Image viewer');
      box.innerHTML =
        '<button class="lightbox__btn lightbox__close" type="button" aria-label="Close">×</button>' +
        '<button class="lightbox__btn lightbox__prev" type="button" aria-label="Previous image">←</button>' +
        '<button class="lightbox__btn lightbox__next" type="button" aria-label="Next image">→</button>' +
        '<figure class="lightbox__stage">' +
          '<img class="lightbox__img" alt="">' +
          '<figcaption class="lightbox__cap"></figcaption>' +
        '</figure>' +
        '<div class="lightbox__count" aria-live="polite"></div>';
      document.body.appendChild(box);

      img = box.querySelector('.lightbox__img');
      cap = box.querySelector('.lightbox__cap');
      count = box.querySelector('.lightbox__count');
      prevBtn = box.querySelector('.lightbox__prev');
      nextBtn = box.querySelector('.lightbox__next');
      closeBtn = box.querySelector('.lightbox__close');

      closeBtn.addEventListener('click', close);
      prevBtn.addEventListener('click', function () { go(-1); });
      nextBtn.addEventListener('click', function () { go(1); });
      box.addEventListener('click', function (e) {
        if (e.target === box || e.target === box.querySelector('.lightbox__stage')) close();
      });
      img.addEventListener('load', function () { img.classList.add('is-loaded'); });
    }

    function pad(n) { return (n < 10 ? '0' : '') + n; }

    function show(i) {
      at = (i + group.length) % group.length;
      var cell = group[at];
      img.classList.remove('is-loaded');
      img.src = cell.getAttribute('href');
      img.alt = (cell.querySelector('img') || {}).alt || '';
      cap.textContent = cell.getAttribute('data-caption') || '';
      count.textContent = pad(at + 1) + ' / ' + pad(group.length);
      var solo = group.length < 2;
      prevBtn.disabled = solo;
      nextBtn.disabled = solo;
      /* Warm the neighbours so stepping through feels instant. */
      [-1, 1].forEach(function (d) {
        var n = group[(at + d + group.length) % group.length];
        if (n) { var pre = new Image(); pre.src = n.getAttribute('href'); }
      });
    }

    function go(d) { show(at + d); }

    function open(cell) {
      if (!box) build();
      var id = cell.getAttribute('data-gallery-item');
      group = cells.filter(function (c) {
        return c.getAttribute('data-gallery-item') === id;
      });
      if (!group.length) group = [cell];
      lastFocus = document.activeElement;
      box.hidden = false;
      document.body.style.overflow = 'hidden';
      show(group.indexOf(cell));
      requestAnimationFrame(function () { box.classList.add('is-open'); });
      closeBtn.focus();
    }

    function close() {
      if (!box || box.hidden) return;
      box.classList.remove('is-open');
      document.body.style.overflow = '';
      window.setTimeout(function () {
        box.hidden = true;
        img.src = '';
      }, 180);
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    cells.forEach(function (cell) {
      cell.addEventListener('click', function (e) {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        open(cell);
      });
    });

    document.addEventListener('keydown', function (e) {
      if (!box || box.hidden) return;
      if (e.key === 'Escape') { e.stopPropagation(); close(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); e.stopPropagation(); go(-1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); e.stopPropagation(); go(1); }
    }, true);
  })();

  /* ---------------------------------------------------------------
     BibTeX copy buttons (.citeblock)
     --------------------------------------------------------------- */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest && e.target.closest('[data-cite-copy]');
    if (!btn) return;
    var block = btn.closest('.citeblock');
    var code = block && block.querySelector('pre');
    if (!code) return;
    var text = code.textContent;
    var done = function () {
      btn.textContent = 'Copied';
      btn.classList.add('is-copied');
      setTimeout(function () {
        btn.textContent = 'Copy';
        btn.classList.remove('is-copied');
      }, 1600);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () {});
    } else {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'absolute';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); done(); } catch (err) {}
      document.body.removeChild(ta);
    }
  });

  /* ---------------------------------------------------------------
     Corridor keyboard navigation (paper rooms): ← / →
     --------------------------------------------------------------- */
  if (document.querySelector('.corridor')) {
    document.addEventListener('keydown', function (e) {
      var tag = (e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || e.metaKey || e.ctrlKey) return;
      if (e.key === 'ArrowLeft') {
        var prev = document.querySelector('.corridor__cell:not(.is-next)');
        if (prev && prev.getAttribute('href')) location.href = prev.getAttribute('href');
      }
      if (e.key === 'ArrowRight') {
        var next = document.querySelector('.corridor__cell.is-next');
        if (next && next.getAttribute('href')) location.href = next.getAttribute('href');
      }
    });
  }
})();
