/* Browser-local demo sign-in. This is not server authentication. */
(function () {
  'use strict';
  var A = window.PW, esc = A.esc, $ = A.$, $$ = A.$$;
  var KEY = 'pageway-proto-v1-admin-session';
  var ACCOUNTS = [
    { id: 'admin', name: '운영 관리자', email: 'admin@demo.pageway', password: 'pageway2026' },
    { id: 'editor', name: '콘텐츠 담당', email: 'editor@demo.pageway', password: 'editor2026' }
  ];
  var next = '/admin', user = load();
  function load() {
    try {
      var saved = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (!saved || saved.v !== 1) return null;
      return ACCOUNTS.find(function (a) { return a.email === saved.email; }) || null;
    } catch (e) { return null; }
  }
  function closeOverlays() { $$('.modal,.redir').forEach(function (d) { A.closeDialog(d, false); }); }
  function error(message) {
    var el = $('#loginError');
    if (el) { el.textContent = message; el.hidden = !message; }
  }
  function render(r, root) {
    closeOverlays();
    next = /^\/admin(?:\/(books|authors|materials|boards|redirects|ops))?$/.test(r.path) ? r.path + (Object.keys(r.q).length ? '?' + new URLSearchParams(r.q).toString() : '') : '/admin';
    root.innerHTML = '<main id="main" tabindex="-1" class="login-page"><div class="login-card">' +
      '<section class="login-visual" aria-label="PAGEWAY 콘텐츠 관리"><img src="assets/images/editor-login.jpg" alt="도서관에서 책과 원고를 살펴보는 편집자" width="1024" height="1536"><div class="login-visual-copy"><span>PAGEWAY WORKSPACE</span><h2>좋은 책과 배움이<br>만나는 곳.</h2><p>도서와 수업 자료를 관리하고<br>독자에게 새로운 이야기를 전하세요.</p></div></section>' +
      '<section class="login-panel"><div class="login-top"><a class="logo" href="#/"><span class="logo-m"></span><span>PAGEWAY<small>콘텐츠 관리</small></span></a><a class="login-back" href="#/">사이트로 돌아가기</a></div>' +
      '<h1>관리자 로그인</h1><p class="login-intro">계정 정보를 입력해 관리 화면으로 이동하세요.</p>' +
      (user ? '<p class="login-session">' + esc(user.name) + ' 계정으로 로그인되어 있습니다. <a href="#/admin">관리 화면 열기</a></p>' : '') +
      '<form id="adminLoginForm" data-admin-login><div class="field"><label for="loginEmail">이메일</label><input class="inp" id="loginEmail" name="email" type="email" placeholder="이메일을 입력해 주세요" autocomplete="off" required></div>' +
      '<div class="field"><label for="loginPassword">비밀번호</label><div class="password-field"><input class="inp" id="loginPassword" name="password" type="password" placeholder="비밀번호를 입력해 주세요" autocomplete="off" required><button type="button" data-password-visibility aria-controls="loginPassword" aria-label="비밀번호 보기" aria-pressed="false">보기</button></div></div>' +
      '<p id="loginError" class="login-error" role="alert" aria-live="polite" hidden></p><button class="btn pri login-submit" type="submit">로그인</button></form>' +
      '<section class="demo-accounts" aria-labelledby="demoTitle"><div class="demo-heading"><h2 id="demoTitle">체험계정</h2><span>계정을 누르면 입력칸에 채워집니다.</span></div>' +
      ACCOUNTS.map(function (a) { return '<button type="button" class="demo-account" data-demo-account="' + a.id + '" aria-pressed="false"><span class="demo-name">' + esc(a.name) + '</span><span class="demo-email">' + esc(a.email) + '</span><code>' + esc(a.password) + '</code></button>'; }).join('') +
      '<p class="login-note">두 계정으로 동일한 관리 기능을 체험할 수 있습니다. 실제 계정·서버와 연동되지 않는 체험 환경입니다.</p>' +
      '<div class="demo-reset"><div><strong>처음부터 다시 체험하기</strong><p>로그인하지 않아도 저장된 체험 데이터를 초기화할 수 있습니다.</p></div><button class="btn" type="button" data-login-reset>체험 데이터 초기화</button></div></section>' +
      '<div class="login-bottom"><a href="#/">도서 사이트 보기</a></div></section></div></main>';
    document.title = '관리자 로그인 — PAGEWAY 교육';
  }
  function signIn(email, password) {
    email = String(email || '').trim().toLowerCase();
    var account = ACCOUNTS.find(function (a) { return a.email === email && a.password === password; });
    if (!account) { error('이메일과 비밀번호를 확인해 주세요. 아래 체험계정을 선택해 이용할 수 있습니다.'); return false; }
    user = account;
    try { localStorage.setItem(KEY, JSON.stringify({ v: 1, email: account.email })); }
    catch (e) { A.toast('로그인 상태는 현재 창에서만 유지됩니다.'); }
    A.go(next); A.render(); return true;
  }
  function logout() {
    user = null; closeOverlays();
    try { localStorage.removeItem(KEY); } catch (e) { /* In-memory sign-out remains effective. */ }
    A.go('/admin/login'); A.render();
  }
  window.PWAuth = { current: function () { return user ? { id: user.id, name: user.name, email: user.email } : null; }, render: render, logout: logout };
  document.addEventListener('submit', function (e) {
    if (!e.target.hasAttribute('data-admin-login')) return;
    e.preventDefault(); signIn(e.target.email.value, e.target.password.value);
  });
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-demo-account],[data-password-visibility],[data-admin-logout],[data-login-reset]');
    if (!t) return;
    if (t.hasAttribute('data-demo-account')) {
      var account = ACCOUNTS.find(function (a) { return a.id === t.getAttribute('data-demo-account'); });
      if (!account || !$('#loginEmail') || !$('#loginPassword')) return;
      $('#loginEmail').value = account.email; $('#loginPassword').value = account.password; error('');
      $$('.demo-account').forEach(function (b) { var on = b.getAttribute('data-demo-account') === account.id; b.classList.toggle('selected', on); b.setAttribute('aria-pressed', on); });
      var submit = $('.login-submit'); if (submit) submit.focus();
    } else if (t.hasAttribute('data-password-visibility')) {
      var input = $('#loginPassword'); if (!input) return;
      var show = input.type === 'password'; input.type = show ? 'text' : 'password';
      t.textContent = show ? '숨기기' : '보기'; t.setAttribute('aria-label', show ? '비밀번호 숨기기' : '비밀번호 보기'); t.setAttribute('aria-pressed', show);
    } else if (t.hasAttribute('data-admin-logout')) logout();
    else if (t.hasAttribute('data-login-reset') && confirm('현재 브라우저의 체험 데이터와 로그인 상태를 처음으로 되돌립니다. 변경 내용과 복구 백업은 삭제됩니다. 계속할까요?')) { A.reset(); if (window.PWAdmin) window.PWAdmin.resetUI(); logout(); A.toast('체험 데이터를 초기화했습니다.'); }
  });
  window.addEventListener('storage', function (e) { if (e.key === KEY || e.key === null) { user = load(); if (!user) closeOverlays(); A.render(); } });
})();
