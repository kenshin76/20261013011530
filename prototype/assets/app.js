/* PAGEWAY 교육 — 체험 사이트 (이용자 화면). 가상 자료이며 서버 연결이 없습니다. */
(function () {
  'use strict';
  var S0 = window.SEED;
  var KEY = 'pageway-proto-v1';
  var H = S0.hosts;
  var App = window.PW = {};

  /* ---------------- 상태 저장 ---------------- */
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function fresh() {
    return {
      v: 1,
      books: clone(S0.books), authors: clone(S0.authors), materials: clone(S0.materials),
      news: clone(S0.news), boards: clone(S0.boards), exceptions: clone(S0.exceptions), ops: clone(S0.ops),
      failLog: [{ url: 'http://textbook.example.co.kr/Home/Boards_Download_Resource?resourceid=3277', at: '2027-02-21 08:14', reason: '대응표에 없는 자료 ID' }],
      dlErrors: [], downloads: {}, verify: null,
      activity: [
        { at: '2027-02-21 17:40', msg: '자료 「글쓰기 수업 평가 기준표」를 메인에 노출했습니다' },
        { at: '2027-02-19 11:02', msg: '도서 「소설을 여는 열쇠」에 작가 정민우(지은이)를 연결했습니다' },
        { at: '2027-01-19 23:20', msg: '1차 전환(단행본) 완료 — 옛 주소 전수 검증 통과' }
      ]
    };
  }
  var storageOk = true, storageRecovered = false, recoveryBackupOk = false;
  function positive(n) { return typeof n === 'number' && Number.isFinite(n) && n > 0; }
  function textFields(o, names) { return o && names.every(function (k) { return typeof o[k] === 'string'; }); }
  function records(a, check, nonempty) {
    var seen = {};
    return Array.isArray(a) && (!nonempty || a.length > 0) && a.every(function (o) {
      if (!o || !positive(o.id) || !Number.isSafeInteger(o.id) || seen[o.id] || !check(o)) return false;
      seen[o.id] = true; return true;
    });
  }
  function legacyPair(a) { return Array.isArray(a) && ['textbook', 'books'].indexOf(a[0]) >= 0 && positive(a[1]); }
  function recoverState(s) {
    var out = fresh();
    if (!s || typeof s !== 'object' || s.v !== 1) { storageRecovered = true; return out; }
    function use(k, valid) {
      if (valid) out[k] = clone(s[k]); else storageRecovered = true;
    }
    use('authors', records(s.authors, function (a) { return textFields(a, ['name', 'birth', 'bio']) && (a.legacy == null || positive(a.legacy)); }, true));
    use('books', records(s.books, function (b) {
      return textFields(b, ['title', 'series', 'desc', 'main']) && ['textbook', 'books'].indexOf(b.kind) >= 0 && positive(b.year) && legacyPair(b.legacy) &&
        Array.isArray(b.authors) && b.authors.every(function (a) { return Array.isArray(a) && positive(a[0]) && typeof a[1] === 'string'; }) &&
        Array.isArray(b.cats) && b.cats.every(function (c) { return typeof c === 'string'; });
    }));
    use('materials', records(s.materials, function (m) {
      return textFields(m, ['title', 'type', 'grade', 'theme', 'date', 'file', 'size', 'desc']) && Array.isArray(m.books) && m.books.every(positive) &&
        ['reading', 'main', 'library', 'pinned'].every(function (k) { return typeof m[k] === 'boolean'; }) && (m.missing == null || typeof m.missing === 'boolean') && Number.isFinite(m.order) && (m.legacy == null || positive(m.legacy));
    }));
    use('news', records(s.news, function (n) { return textFields(n, ['kind', 'title', 'date', 'body']) && legacyPair(n.legacy); }));
    var boardCodes = Object.create(null);
    use('boards', Array.isArray(s.boards) && s.boards.every(function (b) {
      if (!textFields(b, ['code', 'name']) || !/^[a-zA-Z0-9_-]+$/.test(b.code) || boardCodes[b.code] || ['basic', 'gallery', 'file'].indexOf(b.type) < 0 || !positive(b.perPage) || typeof b.useCategory !== 'boolean' || typeof b.allowAttach !== 'boolean') return false;
      boardCodes[b.code] = true;
      return records(b.posts, function (p) { return textFields(p, ['title', 'date']) && (p.body == null || typeof p.body === 'string') && (p.views == null || Number.isFinite(p.views) && p.views >= 0) && (b.type !== 'file' || textFields(p, ['file', 'size'])); });
    }));
    use('exceptions', Array.isArray(s.exceptions) && s.exceptions.every(function (e) {
      return textFields(e, ['path', 'key', 'value', 'to', 'note']) && ['textbook', 'books'].indexOf(e.host) >= 0 && (e.status === 410 || e.status === 301 && /^\/(books|materials|news|authors)\/\d+$/.test(e.to));
    }));
    ['failLog', 'dlErrors', 'activity'].forEach(function (k) {
      var fields = k === 'failLog' ? ['url', 'at', 'reason'] : k === 'activity' ? ['at', 'msg'] : ['title', 'at'];
      use(k, Array.isArray(s[k]) && s[k].every(function (o) { return textFields(o, fields); }));
    });
    use('downloads', s.downloads && !Array.isArray(s.downloads) && typeof s.downloads === 'object' && Object.keys(s.downloads).every(function (k) { return /^\d+$/.test(k) && Number.isFinite(s.downloads[k]) && s.downloads[k] >= 0; }));
    use('verify', s.verify === null || s.verify && Number.isFinite(s.verify.total) && Number.isFinite(s.verify.pass) && Number.isFinite(s.verify.fail) && Number.isFinite(s.verify.gone) && typeof s.verify.at === 'string' && Array.isArray(s.verify.rows) && s.verify.rows.every(function (r) { return textFields(r, ['url', 'src', 'target', 'title']) && typeof r.ok === 'boolean'; }));
    use('ops', s.ops && /^\d{4}-(0[1-9]|1[0-2])$/.test(s.ops.month) && Number.isFinite(s.ops.alloc) && s.ops.alloc > 0 && Number.isFinite(s.ops.carry) && s.ops.carry >= 0 && s.ops.carry <= 4 && records(s.ops.items, function (i) {
      return textFields(i, ['title', 'status']) && ['대기', '진행', '완료'].indexOf(i.status) >= 0 && positive(i.md) && Number.isInteger(i.md * 2) && positive(i.prio) && (i.month == null || /^\d{4}-(0[1-9]|1[0-2])$/.test(i.month));
    }));
    // Preserve valid edits; only repair broken references and missing collections.
    out.books.forEach(function (b) {
      var aa = b.authors.filter(function (x) { return out.authors.some(function (a) { return a.id === x[0]; }); });
      if (aa.length !== b.authors.length || !aa.length) { storageRecovered = true; b.authors = aa.length ? aa : [[out.authors[0].id, '지은이']]; }
      var cc = b.cats.filter(function (id, i, arr) { return arr.indexOf(id) === i && S0.cats.some(function (c) { return c.id === id && c.kind === b.kind; }); });
      if (!cc.length) cc = [S0.cats.find(function (c) { return c.kind === b.kind; }).id];
      if (JSON.stringify(cc) !== JSON.stringify(b.cats) || cc.indexOf(b.main) < 0) { storageRecovered = true; b.cats = cc; b.main = cc.indexOf(b.main) >= 0 ? b.main : cc[0]; }
    });
    out.materials.forEach(function (m) {
      var ids = m.books.filter(function (id, i, arr) { return arr.indexOf(id) === i && out.books.some(function (b) { return b.id === id; }); });
      if (ids.length !== m.books.length) { storageRecovered = true; m.books = ids; }
    });
    return out;
  }
  function load() {
    storageRecovered = false;
    recoveryBackupOk = false;
    var raw;
    try { raw = localStorage.getItem(KEY); } catch (e) { storageOk = false; return fresh(); }
    if (!raw) return fresh();
    var s;
    try { s = recoverState(JSON.parse(raw)); } catch (e) { storageRecovered = true; s = fresh(); }
    // Keep a recoverable copy before any repaired state can replace the original.
    if (storageRecovered) {
      try { localStorage.setItem(KEY + '-recovery-backup', raw); recoveryBackupOk = true; } catch (e) { storageOk = false; }
    }
    return s;
  }
  var st = load();
  App.st = function () { return st; };
  App.save = function () {
    if (storageRecovered && !recoveryBackupOk) { storageOk = false; return; }
    try { localStorage.setItem(KEY, JSON.stringify(st)); storageOk = true; } catch (e) { storageOk = false; }
  };
  App.reset = function () {
    st = fresh();
    storageRecovered = false;
    recoveryBackupOk = false;
    try { localStorage.removeItem(KEY); localStorage.removeItem(KEY + '-recovery-backup'); } catch (e) { /* 저장소 차단 */ }
    App.save();
  };
  App.storageOk = function () { return storageOk; };
  App.storageRecovered = function () { return storageRecovered; };
  App.recoveryNotice = function () {
    return '저장된 체험 자료 일부를 복구했습니다. 확인 가능한 변경 내용은 유지했습니다. ' +
      (recoveryBackupOk ? '기존 저장 자료는 브라우저에 별도로 보관했습니다.' : '원본 백업을 저장할 수 없어 복구 후 변경은 현재 화면에서만 유지합니다.');
  };
  App.log = function (msg) {
    st.activity.unshift({ at: nowStr(), msg: msg });
    st.activity = st.activity.slice(0, 30);
  };
  function nowStr() {
    var d = new Date(); function p(n) { return (n < 10 ? '0' : '') + n; }
    return S0.today + ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
  }
  App.nowStr = nowStr;

  /* ---------------- 공통 도우미 ---------------- */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  App.esc = esc;
  function $(sel, el) { return (el || document).querySelector(sel); }
  function $$(sel, el) { return Array.prototype.slice.call((el || document).querySelectorAll(sel)); }
  App.$ = $; App.$$ = $$;

  /* Editor-dialog keyboard lifecycle; the screen beneath remains unchanged. */
  var activeDialog = null;
  var focusSelector = 'a[href],button:not([disabled]),input:not([disabled]):not([type="hidden"]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
  function dialogControls(overlay) {
    return $$(focusSelector, overlay).filter(function (el) {
      return !el.disabled && el.tabIndex >= 0 && !el.closest('[hidden],[inert]') && el.getClientRects().length > 0;
    });
  }
  function focusDialog(overlay, last) {
    var controls = dialogControls(overlay), target = controls.length ? controls[last ? controls.length - 1 : 0] : $('[role="dialog"]', overlay) || overlay;
    if (!controls.length) target.setAttribute('tabindex', '-1');
    target.focus();
  }
  function restoreDialogFocus(rec) {
    var target = rec.opener && document.body.contains(rec.opener) ? rec.opener : rec.returnSelector ? $(rec.returnSelector) : null;
    if (!target || target.disabled || target.getClientRects().length === 0) target = $('#main');
    if (target) target.focus({ preventScroll: true });
  }
  App.openDialog = function (overlay, opener, returnSelector) {
    if (activeDialog) App.closeDialog(activeDialog.overlay, false);
    var root = $('#root'), skip = $('[data-skip-to-main]');
    activeDialog = { overlay: overlay, opener: opener || document.activeElement, returnSelector: returnSelector,
      background: [root, skip].filter(Boolean).map(function (el) { var old = !!el.inert; el.inert = true; return { el: el, inert: old }; }),
      overflow: document.body.style.overflow };
    document.body.style.overflow = 'hidden';
    focusDialog(overlay);
  };
  App.closeDialog = function (overlay, restore, afterClose) {
    var rec = activeDialog && activeDialog.overlay === overlay ? activeDialog : null;
    if (rec) {
      activeDialog = null;
      rec.background.forEach(function (old) { old.el.inert = old.inert; });
      document.body.style.overflow = rec.overflow;
    }
    overlay.remove();
    if (afterClose) afterClose();
    if (rec && restore !== false) restoreDialogFocus(rec);
  };
  App.closeDialogs = function (restore) { if (activeDialog) App.closeDialog(activeDialog.overlay, restore); };
  App.paintDialog = function (overlay, paint) {
    var focused = document.activeElement, key = null;
    if (focused && overlay.contains(focused)) {
      if (focused.id) key = { name: 'id', value: focused.id };
      else ['data-a', 'data-r', 'data-cat', 'data-main', 'data-mat', 'data-up', 'data-down', 'data-del', 'data-addauthor', 'data-bk', 'data-save', 'data-cancel'].some(function (name) {
        if (!focused.hasAttribute(name)) return false;
        key = { name: name, value: focused.getAttribute(name) }; return true;
      });
    }
    paint();
    if (key) {
      var escaped = String(key.value).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
      var target = $('[' + key.name + '="' + escaped + '"]', overlay);
      if (target && !target.disabled) target.focus({ preventScroll: true }); else focusDialog(overlay);
    } else if (activeDialog && activeDialog.overlay === overlay && !overlay.contains(document.activeElement)) focusDialog(overlay);
  };
  document.addEventListener('keydown', function (e) {
    if (!activeDialog || e.isComposing || e.keyCode === 229) return;
    var overlay = activeDialog.overlay;
    if (!document.body.contains(overlay)) { App.closeDialog(overlay, false); return; }
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); App.closeDialog(overlay); return; }
    if (e.key !== 'Tab') return;
    var controls = dialogControls(overlay), first = controls[0], last = controls[controls.length - 1], focused = document.activeElement;
    if (!controls.length || !overlay.contains(focused) || e.shiftKey && (focused === first || focused === overlay || focused === $('[role="dialog"]', overlay)) || !e.shiftKey && focused === last) {
      e.preventDefault(); focusDialog(overlay, !!e.shiftKey);
    }
  }, true);
  document.addEventListener('focusin', function (e) {
    if (activeDialog && document.body.contains(activeDialog.overlay) && !activeDialog.overlay.contains(e.target)) focusDialog(activeDialog.overlay);
  }, true);
  function norm(s) { return String(s || '').toLowerCase().replace(/\s+/g, ''); }
  App.norm = norm;
  function book(id) { return st.books.find(function (b) { return b.id === +id; }); }
  function author(id) { return st.authors.find(function (a) { return a.id === +id; }); }
  function material(id) { return st.materials.find(function (m) { return m.id === +id; }); }
  function cat(id) { return S0.cats.find(function (c) { return c.id === id; }); }
  App.book = book; App.author = author; App.material = material; App.cat = cat;
  var KIND = { textbook: '교과서·참고서', books: '단행본' };
  App.KIND = KIND;

  function toast(msg) {
    var t = document.createElement('div'); t.className = 'toast'; t.textContent = msg;
    $('#toasts').appendChild(t);
    setTimeout(function () { t.remove(); }, 2600);
  }
  App.toast = toast;

  function qs(obj) {
    var p = new URLSearchParams();
    Object.keys(obj || {}).forEach(function (k) { if (obj[k] !== '' && obj[k] != null) p.set(k, obj[k]); });
    var s = p.toString(); return s ? '?' + s : '';
  }
  function link(path, q) { return '#' + path + qs(q); }
  App.link = link;
  function go(path, q) { location.hash = path + qs(q); }
  App.go = go;
  function parse() {
    var h = location.hash.slice(1) || '/';
    // Old fragment links must not be treated as a service route.
    if (h === 'main') h = '/';
    var i = h.indexOf('?');
    var path = i < 0 ? h : h.slice(0, i);
    try { path = decodeURI(path); } catch (e) { path = '/invalid-address'; }
    var q = {};
    if (i >= 0) new URLSearchParams(h.slice(i + 1)).forEach(function (v, k) { q[k] = v; });
    return { path: path || '/', q: q };
  }
  App.parse = parse;
  function shareUrl() {
    if (location.href) { var u = new URL(location.href); u.search = ''; u.hash = location.hash; return u.href; }
    return location.origin + location.pathname + location.hash;
  }
  function prettyUrl() { try { return decodeURIComponent(shareUrl()).replace(/\+/g, ' '); } catch (e) { return shareUrl(); } }

  /* ---------------- 표지 그래픽 ---------------- */
  var PAL = [
    ['#294951', '#c8d8d1'], ['#445c54', '#ded6bc'], ['#554f47', '#e1cfb5'], ['#253746', '#b9ced1'], ['#505368', '#d0c9db'],
    ['#345a65', '#cad9de'], ['#6b4c50', '#dbcac9'], ['#3d594e', '#c9d8c5'], ['#635344', '#ded1b9'], ['#38495f', '#bdc8d9'],
    ['#63524e', '#e3d4c9'], ['#34565b', '#c8d9d4']
  ];
  function coverHTML(b, lg) {
    var p = PAL[(b.id * 7 + (b.kind === 'textbook' ? 3 : 0)) % PAL.length];
    var sh = '<span class="cv-edition">PAGEWAY · ' + b.year + '</span><i class="cv-rule" style="background:' + p[1] + '"></i><span class="cv-category">' + (b.kind === 'textbook' ? 'LEARNING' : 'READING') + '</span>';
    var who = b.authors.map(function (x) { var a = author(x[0]); return a ? a.name : ''; }).filter(Boolean).slice(0, 2).join(' · ');
    return '<div class="cover' + (lg ? ' lg' : '') + '" style="background:' + p[0] + '">' + sh +
      '<div class="cv-t">' + esc(b.title) + '</div><div class="cv-a">' + esc(who) + '</div></div>';
  }
  App.coverHTML = coverHTML;
  function miniCover(b) { return '<span class="mini" title="' + esc(b.title) + '">' + coverHTML(b) + '</span>'; }

  function bookCard(b, q) {
    var who = b.authors.map(function (x) { var a = author(x[0]); return a ? a.name : ''; }).filter(Boolean).join(', ');
    return '<a class="bcard" href="' + link('/books/' + b.id) + '">' + coverHTML(b) +
      '<h3>' + hl(b.title, q) + '</h3><div class="meta"><span class="kind ' + b.kind + '">' + KIND[b.kind] + '</span> ' + hl(who, q) + '</div></a>';
  }
  function hl(text, q) {
    text = String(text || '');
    if (!q) return esc(text);
    var t = q.trim(); if (!t) return esc(text);
    var i = text.toLowerCase().indexOf(t.toLowerCase());
    if (i < 0) return esc(text);
    return esc(text.slice(0, i)) + '<mark>' + esc(text.slice(i, i + t.length)) + '</mark>' + esc(text.slice(i + t.length));
  }

  /* 노출 순서 — 상단 고정(지정 순서) → 나머지 자동 최신순 */
  function ordered(flag) {
    var list = st.materials.filter(function (m) { return !flag || m[flag]; });
    var pin = list.filter(function (m) { return m.pinned; }).sort(function (a, b) { return a.order - b.order; });
    var rest = list.filter(function (m) { return !m.pinned; }).sort(function (a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : b.id - a.id; });
    return pin.concat(rest);
  }
  App.ordered = ordered;

  var FCOL = { pdf: '#8c4d51', zip: '#646079', hwp: '#42607b', pptx: '#88683e', xlsx: '#3d6b59' };
  function fileIcon(name) {
    var ext = String(name).split('.').pop().toLowerCase();
    return '<span class="ficon" style="background:' + (FCOL[ext] || '#5d6680') + '">' + esc(ext.toUpperCase()) + '</span>';
  }
  App.fileIcon = fileIcon;

  function mcard(m) {
    var bs = m.books.map(book).filter(Boolean);
    return '<article class="mcard"><div class="top">' +
      '<span class="tag t-' + esc(m.type) + '">' + esc(m.type) + '</span><span class="tag">' + esc(m.grade) + '</span></div>' +
      '<h3><a href="' + link('/materials/' + m.id) + '">' + esc(m.title) + '</a></h3><p>' + esc(m.desc) + '</p>' +
      '<div class="mbooks">' + bs.slice(0, 4).map(function (b) { return '<a href="' + link('/books/' + b.id) + '">' + miniCover(b) + '</a>'; }).join('') +
      '<small>연결 도서 ' + bs.length + '권</small></div>' +
      '<div class="mfoot"><span>' + esc(m.date) + ' · ' + esc(m.size) + '</span><button class="btn xs" data-dl="' + m.id + '">내려받기</button></div></article>';
  }

  /* 다운로드 — 공개·파일 상태 확인 후 제공(체험) */
  function download(id) {
    var m = material(id); if (!m) return;
    if (m.missing) {
      st.dlErrors.unshift({ id: m.id, title: m.title, at: nowStr() });
      st.dlErrors = st.dlErrors.slice(0, 20);
      App.save();
      openNotice('파일을 준비하고 있어요', '「' + m.title + '」 파일을 확인하는 중입니다. 이 체험 환경에서는 확인 요청을 브라우저에 기록합니다.');
      return;
    }
    st.downloads[m.id] = (st.downloads[m.id] || 0) + 1; App.save();
    openNotice('자료 내려받기', '「' + m.file + '」의 내려받기 요청을 확인했습니다. 이 사이트는 체험 환경으로, 실제 파일은 전송하지 않습니다.');
  }
  function openNotice(title, body) {
    var d = document.createElement('div'); d.className = 'redir';
    d.innerHTML = '<div class="redir-card" role="dialog" aria-modal="true"><h3>' + esc(title) + '</h3><p class="muted">' + esc(body) + '</p><div class="row" style="justify-content:flex-end"><button class="btn dark" data-close>확인</button></div></div>';
    document.body.appendChild(d);
    d.addEventListener('click', function (e) { if (e.target === d || e.target.hasAttribute('data-close')) d.remove(); });
    $('[data-close]', d).focus();
  }
  App.openNotice = openNotice;

  /* ---------------- 옛 주소(QR) 호환 계층 ---------------- */
  function resolve(raw) {
    var steps = [];
    var u;
    try { u = new URL(String(raw).trim()); } catch (e) { return { status: 'bad', steps: [{ t: '주소 형식 확인', d: '올바른 주소가 아닙니다', ok: false }] }; }
    var host = u.hostname.toLowerCase();
    var scheme = u.protocol.replace(':', '');
    if (scheme !== 'http' && scheme !== 'https') return { status: 'bad', steps: [{ t: '주소 형식 확인', d: 'HTTP 또는 HTTPS 주소를 입력해 주세요', ok: false }] };
    var site = host === H.textbook ? 'textbook' : host === H.books ? 'books' : host === H.unified ? 'unified' : null;
    steps.push({ t: 'ALB 리스너 수신', d: scheme.toUpperCase() + ' ' + (scheme === 'http' ? 80 : 443) + ' · Host ' + host + (scheme === 'https' && site && site !== 'unified' ? ' · 옛 도메인 인증서 유지' : ''), ok: !!site });
    if (!site) return { status: 'bad', steps: steps, reason: '등록되지 않은 도메인' };
    var path = (u.pathname.replace(/\/+$/, '') || '/').toLowerCase();
    var params = Object.create(null);
    var ambiguous = false;
    u.searchParams.forEach(function (v, k) { k = k.toLowerCase(); v = v.trim(); if (Object.prototype.hasOwnProperty.call(params, k) && params[k] !== v) ambiguous = true; params[k] = v; });
    if (ambiguous) return { status: 'bad', steps: steps.concat([{ t: '식별 키 확인', d: '같은 식별 키에 서로 다른 값이 있습니다', ok: false }]) };
    if (site === 'unified') {
      steps.push({ t: '통합 도메인 요청', d: '리다이렉트 없이 그대로 처리', ok: true });
      return { status: 200, target: u.pathname + u.search, steps: steps };
    }
    steps.push({ t: 'ALB 호스트 규칙', d: host + ' → 통합 애플리케이션(신규 서버)', ok: true });
    var shown = path + (Object.keys(params).length ? '?' + Object.keys(params).map(function (k) { return k + '=' + params[k]; }).join('&') : '');
    steps.push({ t: '레거시 호환 계층 · 정규화', d: '원본 ' + (site === 'textbook' ? '교과서·참고서' : '단행본') + ' · ' + shown, ok: true });

    var ex = st.exceptions.find(function (e) { return e.host === site && e.path === path && (!e.key || params[e.key] === String(e.value)); });
    var target = null, title = '', kind = '';
    if (ex) {
      steps.push({ t: '예외 매핑표 일치', d: (ex.note || '') + (ex.status === 410 ? ' → 410 폐기 안내' : ' → ' + ex.to), ok: true });
      if (ex.status === 410) return { status: 410, steps: steps, site: site, path: path, params: params };
      target = ex.to; title = titleOf(target);
    } else {
      var r = rule(site, path, params);
      if (r) {
        steps.push({ t: '대응표 조회', d: r.map, ok: !!r.target });
        target = r.target; title = r.title; kind = r.kind;
      } else {
        steps.push({ t: '주소 규칙 확인', d: '알려진 옛 주소 형식이 아닙니다', ok: false });
      }
    }
    if (!target) return { status: 'guide', steps: steps, site: site, path: path, params: params };
    steps.push({ t: '301 Moved Permanently', d: 'Location: https://' + H.unified + target, ok: true });
    steps.push({ t: '200 OK · 목적지 확인', d: title || target, ok: true });
    return { status: 301, target: target, title: title, steps: steps, site: site, path: path, params: params, kind: kind };
  }
  App.resolve = resolve;
  function titleOf(target) {
    var m = target.match(/^\/(books|materials|news|authors)\/(\d+)/);
    if (!m) return target;
    var o = m[1] === 'books' ? book(m[2]) : m[1] === 'materials' ? material(m[2]) : m[1] === 'news' ? st.news.find(function (n) { return n.id === +m[2]; }) : author(m[2]);
    return o ? (o.title || o.name) : '';
  }
  function rule(site, path, p) {
    var label = site === 'textbook' ? '교과서·참고서' : '단행본';
    if (path === '/home/bookdetail') {
      var b = st.books.find(function (x) { return x.legacy[0] === site && String(x.legacy[1]) === p.bookid; });
      return { map: label + ' · 도서 · 옛 ID ' + (p.bookid || '-') + (b ? ' → 신규 ID ' + b.id : ' → 대응 없음'), target: b ? '/books/' + b.id : null, title: b && b.title, kind: 'book' };
    }
    if (path === '/home/boards_download_resource') {
      var m = site === 'textbook' && st.materials.find(function (x) { return String(x.legacy) === p.resourceid; });
      return { map: label + ' · 자료 · 옛 ID ' + (p.resourceid || '-') + (m ? ' → 신규 ID ' + m.id : ' → 대응 없음'), target: m ? '/materials/' + m.id : null, title: m && m.title, kind: 'material' };
    }
    if (path === '/home/newsdetail') {
      var n = st.news.find(function (x) { return x.legacy[0] === site && String(x.legacy[1]) === p.newsid; });
      return { map: label + ' · 소식 · 옛 ID ' + (p.newsid || '-') + (n ? ' → 신규 ID ' + n.id : ' → 대응 없음'), target: n ? '/news/' + n.id : null, title: n && n.title, kind: 'news' };
    }
    if (path === '/home/authordetail') {
      var a = site === 'books' && st.authors.find(function (x) { return String(x.legacy) === p.authorid; });
      return { map: label + ' · 작가 · 옛 ID ' + (p.authorid || '-') + (a ? ' → 신규 ID ' + a.id : ' → 대응 없음'), target: a ? '/authors/' + a.id : null, title: a && a.name, kind: 'author' };
    }
    if (path === '/home/books') {
      var lc = S0.legacyCats[site], c = '';
      Object.keys(lc).forEach(function (k) { if (p[k] && lc[k][p[k]]) c = lc[k][p[k]]; });
      var t = '/books?type=' + site + (c ? '&cat=' + c : '');
      return { map: label + ' · 도서 목록' + (c ? ' · 필터 → ' + cat(c).name : ''), target: t, title: label + ' 도서 목록' + (c ? ' · ' + cat(c).name : ''), kind: 'list' };
    }
    if (path === '/home/boards') return { map: '자료실 목록', target: '/resources', title: '자료실', kind: 'list' };
    if (path === '/home/news') return { map: '소식 목록', target: '/news', title: '소식', kind: 'list' };
    if (path === '/' || path === '/home' || path === '/home/index') return { map: label + ' 첫 화면', target: '/books?type=' + site, title: label + ' 도서 목록', kind: 'list' };
    return null;
  }

  /* ---------------- 레이아웃 ---------------- */
  var NAV = [
    ['/books?type=textbook', '교과서·참고서', function (r) { return r.path === '/books' && r.q.type === 'textbook'; }],
    ['/books?type=books', '단행본', function (r) { return r.path === '/books' && r.q.type === 'books'; }],
    ['/reading', '독서 교육 제안', function (r) { return r.path === '/reading'; }],
    ['/resources', '자료실', function (r) { return r.path === '/resources' || r.path.indexOf('/resources/') === 0 || r.path.indexOf('/materials') === 0; }],
    ['/news', '소식', function (r) { return r.path.indexOf('/news') === 0; }]
  ];
  function header(r) {
    return '<header class="hd"><div class="wrap hd-in">' +
      '<a class="logo" href="#/" aria-label="PAGEWAY 교육 홈"><span class="logo-m"></span><span>PAGEWAY<small>교과서 · 참고서 · 단행본</small></span></a>' +
      '<nav class="nav" id="nav">' + NAV.map(function (n) { return '<a href="#' + n[0] + '" class="' + (n[2](r) ? 'on' : '') + '">' + n[1] + '</a>'; }).join('') + '</nav>' +
      '<div class="hd-act">' + (r.path === '/' ? '<a class="btn home-main" href="../index.html" aria-label="제안서 메인 화면으로">' + ICON.back + '<span>메인으로</span></a>' : '') +
      '<a class="icon-btn" href="#/search" aria-label="통합 검색">' + ICON.search + '</a>' +
      '<a class="btn adm-link" href="#/admin/login">' + ICON.admin + '관리자</a>' +
      '<button class="icon-btn menu-btn" id="menuBtn" aria-label="메뉴 열기" aria-expanded="false">' + ICON.menu + '</button></div></div></header>';
  }
  function footer() {
    return '<footer class="ft"><div class="wrap ft-in"><div><div class="logo"><span class="logo-m"></span><span>PAGEWAY</span></div>' +
      '<p style="margin:14px 0 0;font-size:14px;max-width:320px">교과서·참고서와 단행본, 그리고 수업 자료를 한 곳에서.</p></div>' +
      '<div><h5>도서</h5><a href="#/books?type=textbook">교과서·참고서</a><a href="#/books?type=books">단행본</a><a href="#/search">통합 검색</a></div>' +
      '<div><h5>수업</h5><a href="#/reading">독서 교육 제안</a><a href="#/resources">자료실</a><a href="#/news">소식</a></div>' +
      '<div><h5>안내</h5><a href="#/qr">예전 주소 찾기</a><a href="#/admin/login">관리자</a></div>' +
      '<div class="copy"><span>가상의 브랜드·도서·인물·자료로 구성한 체험 사이트입니다.</span><span>© PAGEWAY 교육 (가상)</span></div></div></footer>';
  }
  var ICON = {
    admin: '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/></svg>',
    search: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    menu: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    back: '<svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 18l-6-6 6-6"/></svg>',
    arrow: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    copy: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>'
  };
  App.ICON = ICON;

  function searchBox(q, type, big) {
    return '<form class="sbox" data-search role="search"><label class="sr" for="sType">검색 범위</label><select id="sType" name="type">' +
      [['all', '전체'], ['textbook', '교과서·참고서'], ['books', '단행본']].map(function (o) { return '<option value="' + o[0] + '"' + (type === o[0] ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('') +
      '</select><label class="sr" for="sQ">검색어</label><input id="sQ" name="q" value="' + esc(q || '') + '" placeholder="도서명·작가·시리즈 검색" autocomplete="off"' + (big ? '' : '') + '><button class="btn pri" type="submit">' + ICON.search + ' 검색</button></form>';
  }

  /* ---------------- 화면: 홈 ---------------- */
  function vHome() {
    var tb = st.books.filter(function (b) { return b.kind === 'textbook'; }).length;
    var bk = st.books.length - tb;
    var newBooks = st.books.slice().sort(function (a, b) { return b.year - a.year || b.id - a.id; }).slice(0, 10);
    var mats = ordered('main').slice(0, 6);
    var series = {};
    st.books.forEach(function (b) { if (b.series) (series[b.series] = series[b.series] || []).push(b); });
    var seriesTop = Object.keys(series).filter(function (s) { return series[s].length > 1; }).slice(0, 4);
    var reads = ordered().filter(function (m) { return m.reading; }).slice(0, 3);
    return '<section class="hero">' +
      '<div class="wrap"><span class="hero-k">PAGEWAY EDUCATION</span>' +
      '<h1>책에서 시작되는<br><em>새로운 배움</em></h1><p class="lead">교과서부터 단행본까지, 찾으시는 책과<br class="desktop-br"> 수업에 필요한 자료를 한곳에서 만나세요.</p>' +
      searchBox('', 'all', true) +
      '<div class="hot"><span>추천 검색어</span>' + ['문학', '정민우', '교실 밖 과학', '중학 국어', '그림책'].map(function (k) { return '<a href="' + link('/search', { q: k }) + '">' + k + '</a>'; }).join('') + '</div></div></section>' +
      '<div class="wrap"><div class="entry">' +
      '<a class="ent tb" href="#/books?type=textbook"><span class="n">' + tb + '종</span><div><b>교과서·참고서</b><p>교과서, 자습서, 평가문제집과 수업 자료</p></div></a>' +
      '<a class="ent bk" href="#/books?type=books"><span class="n">' + bk + '종</span><div><b>단행본</b><p>어린이·청소년·선생님을 위한 책</p></div></a>' +
      '<a class="ent rd" href="#/reading"><span class="n">' + st.materials.filter(function (m) { return m.reading; }).length + '개 제안</span><div><b>독서 교육 제안</b><p>한 권을 깊게, 여러 권을 함께 읽는 수업</p></div></a></div>' +
      '<section class="sec"><div class="sec-h"><div><span class="eyebrow">TEACHING RESOURCES</span><h2>수업을 준비하는 선생님께</h2><p>지도안과 활동지, 평가 자료를 찾아보세요.</p></div><a class="more" href="#/resources">자료실 전체 ' + ICON.arrow + '</a></div>' +
      '<div class="grid-m">' + mats.map(mcard).join('') + '</div></section>' +
      '<section class="sec"><div class="sec-h"><div><h2>새로 나온 책</h2></div><a class="more" href="#/books?type=all">전체 도서 ' + ICON.arrow + '</a></div>' +
      '<div class="rail">' + newBooks.map(function (b) { return bookCard(b); }).join('') + '</div></section>' +
      '<section class="sec"><div class="sec-h"><div><h2>시리즈로 만나기</h2><p>한 권에서 다음 이야기로, 함께 읽으면 더 좋은 책들.</p></div></div><div class="grid-m">' +
      seriesTop.map(function (s) {
        var bs = series[s];
        return '<a class="mcard" href="' + link('/search', { q: s }) + '"><div class="top"><span class="kind ' + bs[0].kind + '">' + KIND[bs[0].kind] + '</span><span class="tag">' + bs.length + '권</span></div><h3>' + esc(s) + '</h3><div class="mbooks">' + bs.slice(0, 5).map(miniCover).join('') + '</div></a>';
      }).join('') + '</div></section>' +
      '<section class="sec"><div class="editorial"><img src="assets/images/reading-workshop.jpg" alt="책과 활동 자료를 함께 읽고 이야기를 나누는 선생님들" width="1536" height="1024" loading="lazy"><div><span class="eyebrow">READ · THINK · SHARE</span><h2>한 권을 깊게,<br>여러 권을 함께.</h2><p>책을 읽고 질문을 나누는 시간.<br>주제별 독서 활동과 수업 자료를 만나보세요.</p><a class="btn dark" href="#/reading">독서 교육 제안 ' + ICON.arrow + '</a></div></div></section>' +
      '<section class="sec"><div class="sec-h"><div><h2>독서 교육 제안</h2><p>함께 읽을 책과 수업에 활용할 자료를 소개합니다.</p></div><a class="more" href="#/reading">더 보기 ' + ICON.arrow + '</a></div><div class="grid-m">' + reads.map(rcard).join('') + '</div></section>' +
      '<section class="sec"><div class="sec-h"><div><h2>소식</h2></div><a class="more" href="#/news">전체 소식 ' + ICON.arrow + '</a></div><div class="nlist">' + st.news.slice(0, 3).map(nitem).join('') + '</div></section></div>';
  }

  /* ---------------- 화면: 통합 검색 (GET 주소) ---------------- */
  function doSearch(q, type) {
    var n = norm(q);
    if (!n) return { books: [], authors: [], series: [] };
    var authors = st.authors.filter(function (a) { return norm(a.name).indexOf(n) >= 0; });
    var aIds = authors.map(function (a) { return a.id; });
    var books = st.books.filter(function (b) {
      return norm(b.title).indexOf(n) >= 0 || norm(b.series).indexOf(n) >= 0 || b.authors.some(function (x) { return aIds.indexOf(x[0]) >= 0; });
    });
    var series = [];
    books.forEach(function (b) { if (b.series && norm(b.series).indexOf(n) >= 0 && series.indexOf(b.series) < 0) series.push(b.series); });
    return { all: books, books: books.filter(function (b) { return type === 'all' || !type || b.kind === type; }), authors: authors, series: series };
  }
  function vSearch(r) {
    var q = r.q.q || '', type = r.q.type || 'all', page = Math.max(1, parseInt(r.q.page, 10) || 1);
    var res = doSearch(q, type);
    var all = res.all || [];
    var cnt = { all: all.length, textbook: all.filter(function (b) { return b.kind === 'textbook'; }).length, books: all.filter(function (b) { return b.kind === 'books'; }).length };
    var per = 8, pages = Math.max(1, Math.ceil(res.books.length / per));
    if (page > pages) page = pages;
    var slice = res.books.slice((page - 1) * per, page * per);
    var body;
    if (!q) body = '<div class="empty"><h3>무엇을 찾고 계신가요?</h3><p>도서명, 작가 이름, 시리즈 이름 중 무엇이든 입력해 보세요.</p></div>';
    else if (!all.length) body = '<div class="empty"><h3>「' + esc(q) + '」에 맞는 책을 찾지 못했어요</h3><p>띄어쓰기 없이, 또는 더 짧은 검색어로 다시 찾아보세요.</p><a class="btn dark" href="#/books?type=all">전체 도서 보기</a></div>';
    else {
      body = (res.authors.length || res.series.length ? '<div class="hits">' +
        res.authors.map(function (a) { return '<a class="hit" href="' + link('/authors/' + a.id) + '"><span class="av" style="background:' + PAL[a.id % PAL.length][0] + '">' + esc(a.name.slice(0, 1)) + '</span><span>' + hl(a.name, q) + '<small>작가 · 도서 ' + st.books.filter(function (b) { return b.authors.some(function (x) { return x[0] === a.id; }); }).length + '권</small></span></a>'; }).join('') +
        res.series.map(function (s) { return '<span class="hit"><span class="av" style="background:var(--brand)">S</span><span>' + hl(s, q) + '<small>시리즈</small></span></span>'; }).join('') + '</div>' : '') +
        (slice.length ? '<div class="grid-b">' + slice.map(function (b) { return bookCard(b, q); }).join('') + '</div>' : '<div class="empty"><h3>이 구분에는 결과가 없어요</h3><p>다른 탭에서 결과를 확인해 보세요.</p></div>') +
        (pages > 1 ? '<nav class="pager" aria-label="페이지">' + Array.from({ length: pages }, function (_, i) { return '<a href="' + link('/search', { q: q, type: type, page: i + 1 }) + '" class="' + (i + 1 === page ? 'on' : '') + '">' + (i + 1) + '</a>'; }).join('') + '</nav>' : '');
    }
    return '<div class="wrap"><div class="ph"><h1>통합 검색</h1><p>교과서·참고서와 단행본을 한 번에 — 도서명 · 작가 · 시리즈</p></div>' +
      '<div class="s-head">' + searchBox(q, type) +
      (q ? '<div class="share"><span class="muted">검색 결과를 함께 나누세요.</span><button class="btn sm" data-copy>' + ICON.copy + ' 주소 복사</button></div>' : '') + '</div>' +
      (q ? '<div class="tabs" role="tablist">' + [['all', '전체'], ['textbook', '교과서·참고서'], ['books', '단행본']].map(function (t) {
        return '<a role="tab" aria-selected="' + (type === t[0]) + '" class="tab ' + (type === t[0] ? 'on' : '') + '" href="' + link('/search', { q: q, type: t[0] }) + '">' + t[1] + ' <b>' + cnt[t[0]] + '</b></a>';
      }).join('') + '</div>' : '<div style="height:20px"></div>') + body + '</div>';
  }

  /* ---------------- 화면: 도서 목록 ---------------- */
  function vBooks(r) {
    var type = r.q.type || 'all', c = r.q.cat || '', sort = r.q.sort || 'new', page = Math.max(1, parseInt(r.q.page, 10) || 1);
    var list = st.books.filter(function (b) { return (type === 'all' || b.kind === type) && (!c || b.cats.indexOf(c) >= 0); });
    list.sort(sort === 'title' ? function (a, b) { return a.title.localeCompare(b.title, 'ko'); } : function (a, b) { return b.year - a.year || b.id - a.id; });
    var per = 12, pages = Math.max(1, Math.ceil(list.length / per)); if (page > pages) page = pages;
    var cats = S0.cats.filter(function (x) { return type === 'all' || x.kind === type; });
    var groups = {}; cats.forEach(function (x) { var g = (type === 'all' ? KIND[x.kind] + ' · ' : '') + x.group; (groups[g] = groups[g] || []).push(x); });
    var title = type === 'textbook' ? '교과서·참고서' : type === 'books' ? '단행본' : '전체 도서';
    return '<div class="wrap"><div class="ph"><div class="crumb"><a href="#/">홈</a><span>›</span><span>' + title + '</span></div><h1>' + title + (c && cat(c) ? ' · ' + esc(cat(c).name) : '') + '</h1><p>총 ' + list.length + '종 · 관심 있는 분야의 책을 찾아보세요.</p></div>' +
      '<div class="layout"><aside class="side"><h4>구분</h4><div class="chips">' +
      [['all', '전체'], ['textbook', '교과서·참고서'], ['books', '단행본']].map(function (t) { return '<a class="chip ' + (type === t[0] ? 'on ' + (t[0] === 'textbook' ? 'tb' : t[0] === 'books' ? 'bk' : '') : '') + '" href="' + link('/books', { type: t[0] }) + '">' + t[1] + '</a>'; }).join('') + '</div>' +
      Object.keys(groups).map(function (g) { return '<h4>' + esc(g) + '</h4><div class="chips">' + groups[g].map(function (x) { return '<a class="chip ' + (c === x.id ? 'on' : '') + '" href="' + link('/books', { type: type, cat: c === x.id ? '' : x.id, sort: sort }) + '">' + esc(x.name) + '</a>'; }).join('') + '</div>'; }).join('') +
      '<h4>정렬</h4><div class="chips"><a class="chip ' + (sort === 'new' ? 'on' : '') + '" href="' + link('/books', { type: type, cat: c }) + '">최신순</a><a class="chip ' + (sort === 'title' ? 'on' : '') + '" href="' + link('/books', { type: type, cat: c, sort: 'title' }) + '">제목순</a></div></aside>' +
      '<div>' + (list.length ? '<div class="grid-b">' + list.slice((page - 1) * per, page * per).map(function (b) { return bookCard(b); }).join('') + '</div>' : '<div class="empty"><h3>이 분류에는 아직 책이 없어요</h3><p>다른 분류를 골라 보세요.</p></div>') +
      (pages > 1 ? '<nav class="pager">' + Array.from({ length: pages }, function (_, i) { return '<a class="' + (i + 1 === page ? 'on' : '') + '" href="' + link('/books', { type: type, cat: c, sort: sort === 'new' ? '' : sort, page: i + 1 }) + '">' + (i + 1) + '</a>'; }).join('') + '</nav>' : '') + '</div></div></div>';
  }

  /* ---------------- 화면: 도서 상세 ---------------- */
  function dlRows(list) {
    return '<div class="dl">' + list.map(function (m) {
      return '<div class="dl-row">' + fileIcon(m.file) + '<div><b><a href="' + link('/materials/' + m.id) + '">' + esc(m.title) + '</a></b><small>' + esc(m.type) + ' · ' + esc(m.grade) + ' · ' + esc(m.size) + '</small></div><button class="btn sm dark" data-dl="' + m.id + '">내려받기</button></div>';
    }).join('') + '</div>';
  }
  function vBook(id) {
    var b = book(id); if (!b) return vMissing();
    var mats = ordered('library').filter(function (m) { return m.books.indexOf(b.id) >= 0; });
    var reads = mats.filter(function (m) { return m.reading; });
    var same = st.books.filter(function (x) { return x.id !== b.id && ((b.series && x.series === b.series) || x.authors.some(function (a) { return b.authors.some(function (y) { return y[0] === a[0]; }); })); }).slice(0, 6);
    return '<div class="wrap"><div class="bd"><div class="cover-wrap">' + coverHTML(b, true) + '</div><div>' +
      '<div class="crumb"><a href="#/">홈</a><span>›</span><a href="' + link('/books', { type: b.kind }) + '">' + KIND[b.kind] + '</a></div>' +
      '<span class="kind ' + b.kind + '">' + KIND[b.kind] + '</span>' + (b.series ? ' <a class="series" href="' + link('/search', { q: b.series }) + '">' + esc(b.series) + ' 시리즈</a>' : '') +
      '<h1>' + esc(b.title) + '</h1>' +
      '<div class="people">' + b.authors.map(function (x) { var a = author(x[0]); if (!a) return ''; return '<a class="person" href="' + link('/authors/' + a.id) + '"><i style="background:' + PAL[a.id % PAL.length][0] + '">' + esc(a.name.slice(0, 1)) + '</i>' + esc(a.name) + ' <small>' + esc(x[1]) + '</small></a>'; }).join('') + '</div>' +
      '<div class="catrow">' + [b.main].concat(b.cats.filter(function (c) { return c !== b.main; })).map(function (c) { var x = cat(c); return x ? '<a class="' + (c === b.main ? 'main' : '') + '" href="' + link('/books', { type: b.kind, cat: c }) + '">' + (c === b.main ? '★ ' : '') + esc(x.name) + '</a>' : ''; }).join('') + '</div>' +
      '<p class="desc">' + esc(b.desc) + '</p><p class="muted" style="font-size:14px">' + b.year + '년 출간</p>' +
      '<div class="row" style="margin-top:16px"><button class="btn" data-copy>' + ICON.copy + ' 이 책 주소 복사</button></div></div></div>' +
      '<div class="box" id="mats"><h3>이 책과 연결된 수업 자료 <span class="tag">' + mats.length + '</span></h3>' +
      (mats.length ? dlRows(mats) : '<p class="muted" style="margin:0">아직 연결된 자료가 없어요.</p>') + '</div>' +
      (reads.length ? '<section class="sec"><div class="sec-h"><div><h2>이 책으로 하는 독서 교육</h2></div></div><div class="grid-m">' + reads.map(rcard).join('') + '</div></section>' : '') +
      (same.length ? '<section class="sec"><div class="sec-h"><div><h2>함께 보면 좋은 책</h2></div></div><div class="rail">' + same.map(function (x) { return bookCard(x); }).join('') + '</div></section>' : '') + '</div>';
  }

  /* ---------------- 화면: 작가 ---------------- */
  function vAuthor(id) {
    var a = author(id); if (!a) return vMissing();
    var bs = st.books.filter(function (b) { return b.authors.some(function (x) { return x[0] === a.id; }); });
    return '<div class="wrap"><div class="ph"><div class="crumb"><a href="#/">홈</a><span>›</span><span>작가</span></div>' +
      '<div class="row" style="gap:18px"><span class="hit" style="padding:0;box-shadow:none;background:none"><span class="av" style="width:72px;height:72px;font-size:28px;background:' + PAL[a.id % PAL.length][0] + '">' + esc(a.name.slice(0, 1)) + '</span></span><div><h1>' + esc(a.name) + '</h1><p>' + esc(a.bio || '') + '</p></div></div></div>' +
      '<div class="grid-b" style="margin-top:20px">' + bs.map(function (b) {
        var role = (b.authors.find(function (x) { return x[0] === a.id; }) || [])[1];
        return '<a class="bcard" href="' + link('/books/' + b.id) + '">' + coverHTML(b) + '<h3>' + esc(b.title) + '</h3><div class="meta"><span class="kind ' + b.kind + '">' + KIND[b.kind] + '</span> ' + esc(role || '') + '</div></a>';
      }).join('') + '</div></div>';
  }

  /* ---------------- 화면: 독서 교육 제안 ---------------- */
  var BAND = ['#315354', '#40536a', '#466454', '#625a6c', '#766447', '#745459', '#44646b'];
  var PHOTOS = ['reading-desk.jpg', 'reading-workshop.jpg', 'reading-lounge.jpg', 'reading-classroom.jpg'];
  function rcard(m) {
    var bs = m.books.map(book).filter(Boolean);
    return '<article class="rcard"><div class="band"><img src="assets/images/' + PHOTOS[m.id % PHOTOS.length] + '" alt="" width="1536" height="1024" loading="lazy"><b>' + esc(m.theme) + ' · ' + esc(m.grade) + '</b></div>' +
      '<div class="body"><div class="top"><span class="tag t-' + esc(m.type) + '">' + esc(m.type) + '</span></div><h3><a href="' + link('/materials/' + m.id) + '">' + esc(m.title) + '</a></h3><p>' + esc(m.desc) + '</p>' +
      '<div class="linked">' + bs.map(function (b) { return '<a href="' + link('/books/' + b.id) + '"><span class="kind ' + b.kind + '">' + (b.kind === 'textbook' ? '교과' : '단행') + '</span>' + esc(b.title) + '</a>'; }).join('') + '</div>' +
      '<div class="mfoot"><span>연결 도서 ' + bs.length + '권</span><button class="btn xs" data-dl="' + m.id + '">자료 받기</button></div></div></article>';
  }
  function gradeGroup(g) {
    g = String(g || '').trim();
    if (!g || /전체|전학년|공통/.test(g)) return '전체';
    if (/교사/.test(g)) return '교사';
    if (/초/.test(g)) return '초등';
    if (/중/.test(g) && /고/.test(g)) return '중·고등';
    if (/고/.test(g)) return '고등';
    if (/중/.test(g)) return '중등';
    return '기타';
  }
  function vReading(r) {
    var q = r.q.q || '', theme = r.q.theme || '', grade = r.q.grade || '';
    var all = ordered().filter(function (m) { return m.reading; });
    var themes = []; all.forEach(function (m) { if (themes.indexOf(m.theme) < 0) themes.push(m.theme); });
    var grades = ['초등', '중등', '중·고등', '고등', '교사', '전체', '기타'].filter(function (g) { return all.some(function (m) { return gradeGroup(m.grade) === g; }); });
    var n = norm(q);
    var list = all.filter(function (m) {
      if (theme && m.theme !== theme) return false;
      if (grade && gradeGroup(m.grade) !== grade) return false;
      if (!n) return true;
      return norm(m.title + m.desc).indexOf(n) >= 0 || m.books.some(function (id) { var b = book(id); return b && norm(b.title).indexOf(n) >= 0; });
    });
    return '<div class="wrap"><div class="rp-hero"><span class="eyebrow">READING TOGETHER</span>' +
      '<h1>독서 교육 제안</h1><p>함께 읽고, 생각을 나누는 수업을 준비하세요.<br>주제와 대상에 맞는 책, 지도안과 활동지를 소개합니다.</p>' +
      '<form class="sbox" data-rsearch style="max-width:640px;box-shadow:var(--sh)"><label class="sr" for="rQ">제안 안에서 검색</label><input id="rQ" name="q" value="' + esc(q) + '" placeholder="자료 이름이나 책 제목으로 찾기"><button class="btn pri">' + ICON.search + ' 찾기</button></form></div>' +
      '<div class="filters"><span class="lbl">주제</span><div class="chips"><a class="chip ' + (!theme ? 'on' : '') + '" href="' + link('/reading', { q: q, grade: grade }) + '">전체</a>' + themes.map(function (t) { return '<a class="chip ' + (theme === t ? 'on' : '') + '" href="' + link('/reading', { q: q, grade: grade, theme: t }) + '">' + esc(t) + '</a>'; }).join('') + '</div>' +
      '<span class="lbl" style="margin-left:8px">대상</span><div class="chips"><a class="chip ' + (!grade ? 'on' : '') + '" href="' + link('/reading', { q: q, theme: theme }) + '">전체</a>' + grades.map(function (g) { return '<a class="chip ' + (grade === g ? 'on' : '') + '" href="' + link('/reading', { q: q, theme: theme, grade: g }) + '">' + (g === '전체' ? '공통' : g) + '</a>'; }).join('') + '</div></div>' +
      (q || theme || grade ? '<div class="share" style="margin:-4px 0 18px"><span class="muted">총 ' + list.length + '건</span><button class="btn sm" data-copy>' + ICON.copy + ' 주소 복사</button></div>' : '') +
      (list.length ? '<div class="grid-m">' + list.map(rcard).join('') + '</div>' : '<div class="empty"><h3>조건에 맞는 제안이 없어요</h3><p>검색어나 필터를 바꿔 보세요.</p><a class="btn dark" href="#/reading">조건 지우기</a></div>') + '</div>';
  }

  /* ---------------- 화면: 자료 상세 ---------------- */
  function vMaterial(id) {
    var m = material(id); if (!m) return vMissing();
    var bs = m.books.map(book).filter(Boolean);
    return '<div class="wrap"><div class="ph"><div class="crumb"><a href="#/">홈</a><span>›</span><a href="#/resources">자료실</a></div>' +
      '<div class="top row" style="margin-bottom:10px"><span class="tag t-' + esc(m.type) + '">' + esc(m.type) + '</span><span class="tag">' + esc(m.grade) + '</span>' + (m.reading ? '<span class="tag pin">독서 교육 제안</span>' : '') + '</div>' +
      '<h1>' + esc(m.title) + '</h1><p>' + esc(m.desc) + '</p></div>' +
      '<div class="cols"><div class="box"><h3>파일</h3>' + dlRows([m]) + '<p class="muted" style="font-size:13px;margin:12px 0 0">' + esc(m.date) + ' 등록</p></div>' +
      '<div class="box"><h3>이 자료와 연결된 책 <span class="tag">' + bs.length + '</span></h3><div class="mbooks" style="gap:14px">' + bs.map(function (b) { return '<a href="' + link('/books/' + b.id) + '" style="width:92px">' + coverHTML(b) + '<small style="display:block;margin-top:6px;font-weight:600;color:var(--ink)">' + esc(b.title) + '</small></a>'; }).join('') + '</div></div></div></div>';
  }

  /* ---------------- 화면: 자료실 (게시판 유형) ---------------- */
  var TYPE_NAME = { basic: '일반형', gallery: '갤러리형', file: '파일 다운로드' };
  App.TYPE_NAME = TYPE_NAME;
  function boardPageSize(bd) { return Number.isSafeInteger(bd.perPage) && bd.perPage > 0 ? Math.min(100, bd.perPage) : 10; }
  function vResources(r) {
    var code = r.q.board || 'materials';
    var tabs = '<div class="btabs"><a class="chip ' + (code === 'materials' ? 'on' : '') + '" href="#/resources">수업 자료</a>' +
      st.boards.map(function (b) { return '<a class="chip ' + (code === b.code ? 'on' : '') + '" href="' + link('/resources', { board: b.code }) + '">' + esc(b.name) + '</a>'; }).join('') + '</div>';
    var body;
    if (code === 'materials') {
      body = '<div class="grid-m">' + ordered('library').map(mcard).join('') + '</div>';
    } else {
      var bd = st.boards.find(function (b) { return b.code === code; });
      var per = bd ? boardPageSize(bd) : 10, total = bd ? bd.posts.length : 0;
      var pages = Math.max(1, Math.ceil(total / per));
      var page = Math.min(pages, Math.max(1, parseInt(r.q.page, 10) || 1)), offset = (page - 1) * per;
      var posts = bd ? bd.posts.slice(offset, offset + per) : [];
      if (!bd) body = '<div class="empty"><h3>게시판을 찾을 수 없어요</h3></div>';
      else if (!bd.posts.length) body = '<div class="empty"><h3>아직 글이 없어요</h3><p>' + TYPE_NAME[bd.type] + ' 게시판이 준비되었습니다.</p></div>';
      else if (bd.type === 'gallery') body = '<div class="gal">' + posts.map(function (p) {
        return '<a href="' + link('/resources/' + bd.code + '/' + p.id) + '"><div class="ph-img"><img src="assets/images/' + PHOTOS[p.id % PHOTOS.length] + '" alt="" width="1536" height="1024" loading="lazy"></div><div class="cap"><b>' + esc(p.title) + '</b><small>' + esc(p.date) + '</small></div></a>';
      }).join('') + '</div>';
      else if (bd.type === 'file') body = '<div class="box">' + '<div class="dl">' + posts.map(function (p) { return '<div class="dl-row">' + fileIcon(p.file || 'a.pdf') + '<div><b>' + esc(p.title) + '</b><small>' + esc(p.date) + ' · ' + esc(p.size || '') + '</small></div><button class="btn sm dark" data-toast="체험 환경에서는 실제 파일을 전송하지 않습니다: ' + esc(p.file || '') + '">내려받기</button></div>'; }).join('') + '</div></div>';
      else body = '<div class="tscroll"><table class="tbl"><thead><tr><th style="width:70px">번호</th><th>제목</th><th style="width:130px">등록일</th><th class="num" style="width:90px">조회</th></tr></thead><tbody>' +
        posts.map(function (p, i) { return '<tr><td>' + (total - offset - i) + '</td><td><a href="' + link('/resources/' + bd.code + '/' + p.id) + '">' + esc(p.title) + '</a></td><td>' + esc(p.date) + '</td><td class="num">' + (p.views || 0) + '</td></tr>'; }).join('') + '</tbody></table></div>';
      if (bd && pages > 1) body += '<nav class="pager" aria-label="게시판 페이지">' + Array.from({ length: pages }, function (_, i) {
        return '<a class="' + (page === i + 1 ? 'on' : '') + '"' + (page === i + 1 ? ' aria-current="page"' : '') + ' href="' + link('/resources', { board: code, page: i + 1 }) + '">' + (i + 1) + '</a>';
      }).join('') + '</nav>';
    }
    return '<div class="wrap"><div class="ph"><h1>자료실</h1><p>수업에 필요한 자료와 독서 활동 이야기를 만나세요.</p></div>' + tabs + body + '</div>';
  }

  function vPost(code, id) {
    var bd = st.boards.find(function (b) { return b.code === code; });
    var p = bd && bd.posts.find(function (x) { return x.id === +id; });
    if (!p) return vMissing();
    var seedBoard = S0.boards.find(function (b) { return b.code === code; });
    var seedPost = seedBoard && seedBoard.posts.find(function (x) { return x.id === p.id; });
    var body = p.body || (seedPost && seedPost.body) || '자료실의 안내와 수업 자료를 확인해 주세요.';
    var at = bd.posts.indexOf(p), listPage = Math.floor(at / boardPageSize(bd)) + 1;
    var list = link('/resources', { board: code, page: listPage > 1 ? listPage : '' });
    return '<div class="wrap" style="max-width:820px"><div class="ph"><div class="crumb"><a href="#/resources">자료실</a><span>›</span><a href="' + list + '">' + esc(bd.name) + '</a></div><h1>' + esc(p.title) + '</h1><p>' + esc(p.date) + ' · ' + esc(bd.name) + '</p></div>' +
      '<article class="box post-body">' + (bd.type === 'gallery' ? '<figure><img src="assets/images/' + PHOTOS[p.id % PHOTOS.length] + '" alt="책과 독서 활동 자료의 구성 예시" width="1536" height="1024"><figcaption>독서 활동 자료 구성 예시 이미지</figcaption></figure>' : '') +
      body.split(/\n\s*\n/).map(function (text) { return '<p>' + esc(text) + '</p>'; }).join('') + '</article>' +
      '<nav class="post-nav" aria-label="게시글 이동"><a class="btn" href="' + list + '">목록으로</a>' +
      (at > 0 ? '<a class="btn" href="' + link('/resources/' + code + '/' + bd.posts[at - 1].id) + '">이전 글</a>' : '') +
      (at < bd.posts.length - 1 ? '<a class="btn" href="' + link('/resources/' + code + '/' + bd.posts[at + 1].id) + '">다음 글</a>' : '') + '</nav></div>';
  }

  /* ---------------- 화면: 소식 ---------------- */
  function nitem(n) { return '<a class="nitem" href="' + link('/news/' + n.id) + '"><span class="nk ' + esc(n.kind) + '">' + esc(n.kind) + '</span><div><b>' + esc(n.title) + '</b></div><small>' + esc(n.date) + '</small></a>'; }
  function vNews() { return '<div class="wrap"><div class="ph"><h1>소식</h1><p>공지·행사·보도</p></div><div class="nlist">' + st.news.map(nitem).join('') + '</div></div>'; }
  function vNewsOne(id) {
    var n = st.news.find(function (x) { return x.id === +id; }); if (!n) return vMissing();
    return '<div class="wrap" style="max-width:820px"><div class="ph"><div class="crumb"><a href="#/news">소식</a></div><span class="nk ' + esc(n.kind) + '">' + esc(n.kind) + '</span><h1 style="margin-top:12px">' + esc(n.title) + '</h1><p>' + esc(n.date) + '</p></div><div class="box"><p style="margin:0;font-size:17px">' + esc(n.body) + '</p></div><p style="margin-top:20px"><a class="more" href="#/news">← 목록으로</a></p></div>';
  }

  /* ---------------- 화면: QR·옛 주소 ---------------- */
  function qrSvg(seed) {
    var h = 0; for (var i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
    var N = 21, cells = '';
    function rnd() { h ^= h << 13; h >>>= 0; h ^= h >>> 17; h ^= h << 5; h >>>= 0; return h / 4294967296; }
    function finder(x, y) { return '<rect x="' + x + '" y="' + y + '" width="7" height="7" fill="#121a33"/><rect x="' + (x + 1) + '" y="' + (y + 1) + '" width="5" height="5" fill="#fff"/><rect x="' + (x + 2) + '" y="' + (y + 2) + '" width="3" height="3" fill="#121a33"/>'; }
    for (var y = 0; y < N; y++) for (var x = 0; x < N; x++) {
      if ((x < 8 && y < 8) || (x > 12 && y < 8) || (x < 8 && y > 12)) continue;
      if (rnd() > 0.52) cells += '<rect x="' + x + '" y="' + y + '" width="1" height="1"/>';
    }
    return '<svg class="qr" viewBox="0 0 21 21" shape-rendering="crispEdges" aria-hidden="true"><g fill="#121a33">' + cells + '</g>' + finder(0, 0) + finder(14, 0) + finder(0, 14) + '</svg>';
  }
  var QRS = [
    ['교과서 「고등 화법과 언어」 표지 안쪽', 'http://textbook.example.co.kr/Home/BookDetail?bookid=1203'],
    ['단행본 「말하기의 온도」 띠지', 'http://books.example.co.kr/Home/BookDetail?bookid=1203'],
    ['문학 단원 활동지 하단', 'http://textbook.example.co.kr/Home/Boards_Download_Resource?resourceid=3302'],
    ['개정 전 단행본 홍보물', 'http://books.example.co.kr/Home/BookDetail?bookid=2011'],
    ['대문자로 인쇄된 옛 QR', 'https://TEXTBOOK.example.co.kr/home/BOOKDETAIL?BookID=1201'],
    ['확인되지 않은 옛 자료 QR', 'http://textbook.example.co.kr/Home/Boards_Download_Resource?resourceid=3277']
  ];
  function vQr() {
    return '<div class="wrap"><div class="ph"><h1>예전 주소 찾기</h1><p>책에 적힌 주소로 찾으시는 도서와 자료를 확인하세요.</p></div>' +
      '<div class="box" style="margin-bottom:22px"><h3>주소 연결 예시</h3><p class="muted" style="margin:-6px 0 0">아래 항목을 누르면 해당 도서나 자료로 이동합니다. QR 그림은 스캔용 코드가 아닌 예시이며, 주소 이동은 브라우저에서 재현한 체험 기능입니다.</p></div>' +
      '<div class="qr-grid">' + QRS.map(function (q) { return '<button class="qr-card" data-legacy="' + esc(q[1]) + '"><div class="qr-row">' + qrSvg(q[1]) + '<b>' + esc(q[0]) + '</b></div><code>' + esc(q[1]) + '</code></button>'; }).join('') + '</div>' +
      '<div class="box" style="margin-top:22px"><h3>예전 주소를 직접 입력하기</h3><form class="row" data-legacy-form><label class="sr" for="lgU">예전 주소</label><input class="inp grow" id="lgU" name="u" placeholder="http://textbook.example.co.kr/Home/BookDetail?bookid=1101"><button class="btn pri">이동해 보기</button></form></div></div>';
  }
  function runLegacy(url) {
    var res = resolve(url);
    var ov = document.createElement('div'); ov.className = 'redir';
    ov.innerHTML = '<div class="redir-card" role="dialog" aria-modal="true" aria-label="주소 안내"><h3>' + (res.status === 301 ? '새 주소로 안내하고 있어요' : res.status === 410 ? '제공이 끝난 자료예요' : '주소를 확인하고 있어요') + '</h3><p class="muted" style="margin:0"><code class="mono">' + esc(url) + '</code></p>' +
      '<ol class="trace">' + res.steps.map(function (s, i) { return '<li data-i="' + i + '" class="' + (s.ok ? 'ok' : 'ng') + '"><i>' + (s.ok ? '✓' : '!') + '</i><div><b>' + esc(s.t) + '</b><code>' + esc(s.d) + '</code></div></li>'; }).join('') + '</ol>' +
      '<div class="row" style="justify-content:flex-end"><button class="btn" data-x>닫기</button>' + (res.status === 301 ? '<button class="btn pri" data-goto>바로 이동</button>' : '<button class="btn pri" data-goto>안내 화면 보기</button>') + '</div></div>';
    document.body.appendChild(ov);
    var lis = $$('.trace li', ov), i = 0, done = false;
    var timer = setInterval(function () { if (lis[i]) lis[i].classList.add('on'); i++; if (i > lis.length) { clearInterval(timer); finish(); } }, 320);
    function finish() {
      if (done) return; done = true; clearInterval(timer); lis.forEach(function (l) { l.classList.add('on'); });
      setTimeout(function () { if (document.body.contains(ov)) target(); }, 900);
    }
    function target() {
      ov.remove();
      if (res.status === 301 || res.status === 200) { location.hash = res.target; App.render(); return; }
      if (res.status === 'guide') { st.failLog.unshift({ url: url, at: nowStr(), reason: '대응표·예외표에 없는 주소' }); st.failLog = st.failLog.slice(0, 40); App.save(); }
      App.lastLegacy = { url: url, status: res.status, reason: res.reason || (res.steps.length ? res.steps[res.steps.length - 1].d : '') };
      location.hash = '/moved';
      App.render();
    }
    ov.addEventListener('click', function (e) {
      if (e.target.hasAttribute('data-goto')) { clearInterval(timer); done = true; target(); }
      if (e.target.hasAttribute('data-x') || e.target === ov) { clearInterval(timer); done = true; ov.remove(); }
    });
  }
  App.runLegacy = runLegacy;
  function vMoved() {
    var l = App.lastLegacy || {};
    var gone = l.status === 410, bad = l.status === 'bad';
    var title = gone ? '이 자료는 더 이상 제공되지 않아요' : bad ? '입력한 주소를 확인해 주세요' : '연결할 도서나 자료를 찾지 못했어요';
    var message = gone ? '저작권 기간 만료 등으로 제공이 끝난 자료입니다. 비슷한 자료를 검색해 보세요.' : bad ? 'HTTP 또는 HTTPS 주소인지 확인해 주세요. 이 체험 사이트에 등록된 예전 주소만 연결할 수 있습니다.' : '해당 주소의 연결 대상을 확인할 수 없습니다. 아래에서 책을 검색하거나 자료실을 이용해 주세요.';
    if (l.status === 'guide') message += ' 이 체험 환경의 확인 요청은 브라우저에 기록됩니다.';
    return '<div class="wrap" style="max-width:760px"><div class="empty" style="margin-top:48px;text-align:left;padding:36px">' +
      '<span class="tag ' + (gone ? '' : 'pin') + '">' + (gone ? '410 · 제공 종료' : bad ? '주소 확인 필요' : '연결 안내') + '</span>' +
      '<h1 style="margin-top:14px;font-size:26px">' + title + '</h1><p>' + message + '</p>' +
      (bad && l.reason ? '<p class="muted" style="font-size:14px">' + esc(l.reason) + '</p>' : '') +
      (l.url ? '<p><code class="mono" style="background:var(--paper);padding:4px 8px;border-radius:6px;word-break:break-all">' + esc(l.url) + '</code></p>' : '') +
      searchBox('', 'all') + '<div class="row" style="margin-top:16px"><a class="btn" href="#/resources">자료실 보기</a><a class="btn" href="#/news">소식 보기</a></div></div></div>';
  }
  function vMissing() { return '<div class="wrap"><div class="empty" style="margin-top:48px"><h1>페이지를 찾을 수 없어요</h1><p>주소를 다시 확인하시거나 검색해 보세요.</p><a class="btn dark" href="#/">홈으로</a></div></div>'; }

  /* ---------------- 렌더 ---------------- */
  function render() {
    App.closeDialogs(false);
    var r = parse();
    var root = $('#root');
    if (/^\/admin(?:\/|$)/.test(r.path)) {
      if (window.PWAuth && (r.path === '/admin/login' || !window.PWAuth.current())) { window.PWAuth.render(r, root); }
      else if (window.PWAdmin) { window.PWAdmin.render(r, root); document.title = '관리자 — PAGEWAY 교육'; }
      window.scrollTo(0, 0);
      return;
    }
    var p = r.path, view, m;
    if (p === '/') view = vHome();
    else if (p === '/search') view = vSearch(r);
    else if (p === '/books') view = vBooks(r);
    else if ((m = p.match(/^\/books\/(\d+)$/))) view = vBook(m[1]);
    else if ((m = p.match(/^\/authors\/(\d+)$/))) view = vAuthor(m[1]);
    else if (p === '/reading') view = vReading(r);
    else if ((m = p.match(/^\/materials\/(\d+)$/))) view = vMaterial(m[1]);
    else if (p === '/resources') view = vResources(r);
    else if ((m = p.match(/^\/resources\/([a-zA-Z0-9_-]+)\/(\d+)$/))) view = vPost(m[1], m[2]);
    else if (p === '/news') view = vNews();
    else if ((m = p.match(/^\/news\/(\d+)$/))) view = vNewsOne(m[1]);
    else if (p === '/qr') view = vQr();
    else if (p === '/moved') view = vMoved();
    else view = vMissing();
    root.innerHTML = header(r) + '<main id="main" tabindex="-1">' + (storageRecovered ? '<div class="wrap"><p class="notice info">' + esc(App.recoveryNotice()) + '</p></div>' : '') + view + '</main>' + footer();
    var t = $('h1', root); document.title = (t && p !== '/' ? t.textContent + ' — ' : '') + 'PAGEWAY 교육';
    if (!App.keepScroll) window.scrollTo(0, 0);
    App.keepScroll = false;
  }
  App.render = render;

  /* ---------------- 이벤트 ---------------- */
  document.addEventListener('submit', function (e) {
    var f = e.target;
    if (f.hasAttribute('data-search')) {
      e.preventDefault();
      var q = f.q.value.trim(), type = f.type.value;
      go('/search', { q: q, type: type === 'all' ? '' : type });
    } else if (f.hasAttribute('data-rsearch')) {
      e.preventDefault();
      var r = parse();
      go('/reading', { q: f.q.value.trim(), theme: r.q.theme, grade: r.q.grade });
    } else if (f.hasAttribute('data-legacy-form')) {
      e.preventDefault();
      if (f.u.value.trim()) runLegacy(f.u.value.trim());
    }
  });
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-skip-to-main],[data-dl],[data-copy],[data-legacy],[data-toast],#menuBtn');
    if (!t) return;
    if (t.hasAttribute('data-skip-to-main')) {
      e.preventDefault(); var main = $('#main');
      if (main) { main.focus({ preventScroll: true }); main.scrollIntoView({ block: 'start' }); }
    }
    else if (t.hasAttribute('data-dl')) { e.preventDefault(); download(+t.getAttribute('data-dl')); }
    else if (t.hasAttribute('data-copy')) {
      var url = shareUrl();
      var ok = function () { toast('주소를 복사했어요 — 붙여 넣으면 같은 화면이 열립니다'); };
      if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(url).then(ok, function () { toast(url); });
      else toast(url);
    }
    else if (t.hasAttribute('data-legacy')) runLegacy(t.getAttribute('data-legacy'));
    else if (t.hasAttribute('data-toast')) { e.preventDefault(); toast(t.getAttribute('data-toast')); }
    else if (t.id === 'menuBtn') { var n = $('#nav'); var o = n.classList.toggle('open'); t.setAttribute('aria-expanded', o); }
  });
  window.addEventListener('hashchange', render);
  window.addEventListener('storage', function (e) { if (e.key === KEY || e.key === null) { st = load(); render(); } });
  document.addEventListener('DOMContentLoaded', function () {
    var sp = new URLSearchParams(location.search).get('u');
    render();
    if (sp) setTimeout(function () { runLegacy(sp); }, 60);
  });
})();
