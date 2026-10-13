/* 제안 요약 — 등장 효과 · 프로토타입 버튼 노출 (내용은 HTML에 모두 있으며, JS가 없어도 그대로 보입니다) */
(function () {
  'use strict';
  var doc = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;

  /* 등장 효과 */
  if (hasIO && !reduce) {
    doc.classList.add('js');
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    document.querySelectorAll('.rv').forEach(function (el, i) {
      el.style.transitionDelay = Math.min((i % 4) * 60, 180) + 'ms';
      io.observe(el);
    });
    /* 인쇄 · 캡처 대비 안전장치 */
    window.addEventListener('beforeprint', function () { document.querySelectorAll('.rv').forEach(function (el) { el.classList.add('in'); }); });
  }

  /* 중앙 프로토타입 버튼이 화면 밖으로 나가면 상단·떠 있는 버튼을 보여 줌 */
  var main = document.getElementById('protoBtn');
  var top = document.getElementById('topCta');
  var fl = document.getElementById('floatCta');
  var bar = document.querySelector('.top');
  var close = document.querySelector('.close .pbtn');
  var passedMain = false;
  var closeVisible = false;
  function setButtonState(button, on) {
    if (!button) return;
    button.classList.toggle('on', on);
    button.setAttribute('aria-hidden', on ? 'false' : 'true');
    button.tabIndex = on ? 0 : -1;
  }
  function updateButtons() {
    setButtonState(top, passedMain);
    setButtonState(fl, passedMain && !closeVisible);
  }
  updateButtons();
  if (main && hasIO) {
    var ctaObserver = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.target === main) passedMain = !e.isIntersecting && e.boundingClientRect.top < 0;
        if (e.target === close) closeVisible = e.isIntersecting;
      });
      updateButtons();
    });
    ctaObserver.observe(main);
    if (close) ctaObserver.observe(close);
  }

  /* 펼쳐 보기 — 인쇄 시 모두 펼침, 주소의 #으로 들어오면 해당 항목 펼침 */
  var accs = document.querySelectorAll('details.acc');
  window.addEventListener('beforeprint', function () { accs.forEach(function (d) { d.open = true; }); });
  function openHash() { var id = location.hash.slice(1); if (!id) return; var el = document.getElementById(id); var d = el && el.closest('details.acc'); if (d) d.open = true; }
  openHash(); window.addEventListener('hashchange', openHash);
  /* 같은 주소의 안내 링크를 다시 눌러도 대상 항목을 펼침 */
  document.querySelectorAll('a[href="#dh5s"]').forEach(function (link) {
    link.addEventListener('click', function () { document.getElementById('dh5s').open = true; });
  });
  accs.forEach(function (d) { d.addEventListener('toggle', function () { if (d.open) d.querySelectorAll('.rv').forEach(function (el) { el.classList.add('in'); }); }); });
  window.addEventListener('scroll', function () { if (bar) bar.classList.toggle('scrolled', window.scrollY > 8); }, { passive: true });
})();
