/* PAGEWAY 교육 — 관리자 체험 화면. 브라우저에만 저장되는 가상 자료입니다. */
(function () {
  'use strict';
  var A = window.PW, S0 = window.SEED;
  var esc = A.esc, $ = A.$, $$ = A.$$, link = A.link, toast = A.toast;
  function st() { return A.st(); }
  function authorized() { return window.PWAuth && window.PWAuth.current(); }
  function save(msg) { if (msg) A.log(msg); A.save(); if (!A.storageOk()) toast('브라우저 저장소를 쓸 수 없어 이 화면에서만 유지됩니다'); }

  function icon(paths) { return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + paths + '</svg>'; }
  var PIN = icon('<path d="m9 3 6 0-1 6 4 4H6l4-4-1-6ZM12 13v8"/>');
  var MENU = [
    ['/admin', '대시보드', icon('<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>')],
    ['/admin/books', '도서', icon('<path d="M12 5v16M3 4h5a4 4 0 0 1 4 2 4 4 0 0 1 4-2h5v15h-5a4 4 0 0 0-4 2 4 4 0 0 0-4-2H3Z"/>')],
    ['/admin/authors', '작가 마스터', icon('<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>')],
    ['/admin/materials', '자료 · 노출 순서', icon('<path d="M5 3h9l5 5v13H5ZM14 3v5h5M9 12h6M9 16h6"/>')],
    ['/admin/boards', '게시판', icon('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9h10M7 13h10M7 17h5"/>')],
    ['/admin/redirects', '옛 주소 · 301', icon('<path d="M4 5v6h14M14 7l4 4-4 4M20 19h-8"/>')],
    ['/admin/ops', '운영 요청', icon('<rect x="5" y="5" width="14" height="16" rx="2"/><path d="M9 3h6v4H9ZM9 12l2 2 4-4M9 18h6"/>')]
  ];
  var ROLES = ['지은이', '그림', '글·그림', '옮긴이', '엮은이', '대표 저자', '공동 저자', '감수'];

  function shell(r, title, sub, body, actions) {
    return '<div class="adm"><aside class="adm-side"><a class="logo" href="#/admin"><span class="logo-m"></span><span>PAGEWAY<small>콘텐츠 관리</small></span></a>' +
      '<div class="grp">운영</div>' +
      MENU.map(function (m, i) { return (i === 5 ? '<div class="grp">사이트 관리</div>' : '') + '<a class="it ' + (r.path === m[0] ? 'on' : '') + '" href="#' + m[0] + '"><span aria-hidden="true">' + m[2] + '</span>' + m[1] + '</a>'; }).join('') +
      '<div class="bottom"><div class="admin-account"><span>' + esc(authorized().name) + '</span><small>' + esc(authorized().email) + '</small></div><a class="btn sm" href="#/">사이트 보기</a><button class="btn sm" data-admin-logout>로그아웃</button><small>체험용 자료 · 변경 내용은 현재 브라우저에 저장됩니다.</small></div></aside>' +
      '<main class="adm-main" id="main" tabindex="-1"><div class="adm-top"><div><h1>' + title + '</h1>' + (sub ? '<p>' + sub + '</p>' : '') + '</div><div class="row">' + (actions || '') + '</div></div>' +
      (A.storageOk() ? '' : '<div class="notice bad" style="margin-bottom:14px">브라우저 저장소를 사용할 수 없어 변경 내용이 새로고침 후 유지되지 않습니다.</div>') +
      (A.storageRecovered() ? '<div class="notice info" style="margin-bottom:14px">' + esc(A.recoveryNotice()) + '</div>' : '') +
      body + '</main></div>';
  }

  /* ---------------- 대시보드 ---------------- */
  function vDash() {
    var s = st();
    var tb = s.books.filter(function (b) { return b.kind === 'textbook'; }).length;
    var v = s.verify;
    var errs = s.materials.filter(function (m) { return m.missing; });
    return '<div class="kpis">' +
      kpi('도서', s.books.length + '종', '교과서·참고서 ' + tb + ' · 단행본 ' + (s.books.length - tb)) +
      kpi('작가 마스터', s.authors.length + '명', '도서-작가 연결 ' + s.books.reduce(function (n, b) { return n + b.authors.length; }, 0) + '건') +
      kpi('자료', s.materials.length + '건', '상단 고정 ' + s.materials.filter(function (m) { return m.pinned; }).length + '건') +
      (v ? kpi('옛 주소 검증', Math.round(v.pass / v.total * 1000) / 10 + '%', v.pass + ' / ' + v.total + '건 통과 · ' + v.at, v.fail ? '' : 'ok') : kpi('옛 주소 검증', '검증 전', '<a href="#/admin/redirects" style="color:var(--tb);font-weight:700">전수 검증 실행 →</a>')) +
      '</div>' +
      '<div class="adm-banner"><div><span class="eyebrow">CONTENT WORKSPACE</span><h2>책과 자료를 한곳에서 관리하세요.</h2><p>새 자료를 등록하고, 연결할 도서와 노출 위치를 설정하세요.</p><div class="row"><a class="btn dark sm" href="#/admin/materials">자료 관리</a><a class="btn sm" href="#/admin/books">도서 관리</a></div></div><img src="assets/images/reading-workshop.jpg" alt="책과 수업 자료를 함께 살펴보는 선생님들" width="1536" height="1024"></div>' +
      '<div class="cols"><div class="panel"><h2>확인이 필요한 옛 주소 <a class="btn xs" href="#/admin/redirects">관리</a></h2>' +
      (s.failLog.length ? '<div class="tscroll"><table class="atbl"><tbody>' + s.failLog.slice(0, 5).map(function (f) { return '<tr><td class="mono" style="word-break:break-all">' + esc(f.url) + '</td><td style="white-space:nowrap" class="muted">' + esc(f.at) + '</td></tr>'; }).join('') + '</tbody></table></div>' : '<p class="muted" style="margin:0">매핑 실패 기록이 없습니다.</p>') + '</div>' +
      '<div class="panel"><h2>파일 확인 필요</h2>' + (errs.length ? errs.map(function (m) {
        var c = s.dlErrors.filter(function (d) { return d.id === m.id; }).length;
        return '<div class="row" style="justify-content:space-between;padding:8px 0;border-bottom:1px solid #eceef3"><span><b>' + esc(m.title) + '</b><br><small class="muted">' + esc(m.file) + ' · 내려받기 시도 ' + c + '회</small></span><button class="btn xs" data-fixfile="' + m.id + '">파일 다시 연결</button></div>';
      }).join('') : '<p class="muted" style="margin:0">모든 자료 파일이 정상입니다.</p>') + '</div></div>' +
      '<div class="panel"><h2>최근 작업</h2><table class="atbl"><tbody>' + s.activity.slice(0, 8).map(function (a) { return '<tr><td class="muted" style="width:150px;white-space:nowrap">' + esc(a.at) + '</td><td>' + esc(a.msg) + '</td></tr>'; }).join('') + '</tbody></table></div>';
  }
  function kpi(t, b, s, cls) { return '<div class="kpi ' + (cls || '') + '"><small>' + t + '</small><b>' + b + '</b><span>' + s + '</span></div>'; }

  /* ---------------- 도서 (작가·카테고리·자료 N:M) ---------------- */
  function vBooks(r) {
    var s = st(), q = r.q.q || '', k = r.q.kind || '';
    var n = A.norm(q);
    var list = s.books.filter(function (b) { return (!k || b.kind === k) && (!n || A.norm(b.title + b.series).indexOf(n) >= 0); });
    return '<div class="panel"><form class="row" data-afilter style="margin-bottom:14px"><input class="inp grow" name="q" value="' + esc(q) + '" placeholder="도서명·시리즈 검색" aria-label="도서 검색"><select class="sel" name="kind" style="width:160px" aria-label="구분"><option value="">전체</option><option value="textbook"' + (k === 'textbook' ? ' selected' : '') + '>교과서·참고서</option><option value="books"' + (k === 'books' ? ' selected' : '') + '>단행본</option></select><button class="btn sm dark">검색</button></form>' +
      '<div class="tscroll"><table class="atbl"><thead><tr><th style="width:46px"></th><th>도서</th><th>작가 (역할 · 순서)</th><th>카테고리 (★ 대표)</th><th class="c">연결 자료</th><th>원본 · 옛 ID</th><th></th></tr></thead><tbody>' +
      list.map(function (b) {
        var mats = s.materials.filter(function (m) { return m.books.indexOf(b.id) >= 0; }).length;
        return '<tr><td><span style="display:block;width:36px">' + A.coverHTML(b) + '</span></td><td><b>' + esc(b.title) + '</b><br><span class="kind ' + b.kind + '">' + A.KIND[b.kind] + '</span> <small class="muted">' + esc(b.series || '') + '</small></td>' +
          '<td>' + b.authors.map(function (x, i) { var a = A.author(x[0]); return (i + 1) + '. ' + esc(a ? a.name : '?') + ' <small class="muted">' + esc(x[1]) + '</small>'; }).join('<br>') + '</td>' +
          '<td>' + [b.main].concat(b.cats.filter(function (c) { return c !== b.main; })).map(function (c) { var x = A.cat(c); return x ? (c === b.main ? '<b>★ ' + esc(x.name) + '</b>' : esc(x.name)) : ''; }).join(' · ') + '</td>' +
          '<td class="c">' + mats + '</td><td class="mono">' + (b.legacy[0] === 'textbook' ? '교과서' : '단행본') + ' · ' + b.legacy[1] + '</td>' +
          '<td><button class="btn xs" data-editbook="' + b.id + '">편집</button></td></tr>';
      }).join('') + '</tbody></table></div></div>';
  }
  function bookDrawer(id, opener) {
    var s = st(), b = A.book(id); if (!b) return;
    var draft = { authors: b.authors.map(function (x) { return x.slice(); }), cats: b.cats.slice(), main: b.main, mats: s.materials.filter(function (m) { return m.books.indexOf(b.id) >= 0; }).map(function (m) { return m.id; }) };
    var d = document.createElement('div'); d.className = 'modal';
    document.body.appendChild(d);
    function paint() {
      A.paintDialog(d, function () {
      var cats = S0.cats.filter(function (c) { return c.kind === b.kind; });
      d.innerHTML = '<div class="drawer" role="dialog" aria-modal="true" aria-label="도서 편집"><h2>' + esc(b.title) + '</h2><p class="muted" style="margin:0">' + A.KIND[b.kind] + ' · 신규 ID ' + b.id + ' · 옛 ID ' + b.legacy[1] + '</p>' +
        '<h4>작가 연결 <small class="muted">작가 마스터에서 선택 · 역할과 표시 순서 지정</small></h4>' +
        draft.authors.map(function (x, i) {
          return '<div class="arow"><select class="sel" data-a="' + i + '" aria-label="작가">' + s.authors.map(function (a) { return '<option value="' + a.id + '"' + (a.id === x[0] ? ' selected' : '') + '>' + esc(a.name) + (a.birth ? ' (' + esc(a.birth) + ')' : '') + '</option>'; }).join('') + '</select>' +
            '<select class="sel" data-r="' + i + '" aria-label="역할">' + ROLES.map(function (r) { return '<option' + (r === x[1] ? ' selected' : '') + '>' + r + '</option>'; }).join('') + '</select>' +
            '<div class="ordbtns"><button class="btn xs" data-up="' + i + '" aria-label="위로"' + (i ? '' : ' disabled') + '>↑</button><button class="btn xs" data-down="' + i + '" aria-label="아래로"' + (i < draft.authors.length - 1 ? '' : ' disabled') + '>↓</button><button class="btn xs" data-del="' + i + '" aria-label="연결 해제">✕</button></div></div>';
        }).join('') + '<button class="btn sm" data-addauthor>+ 작가 연결</button>' +
        '<h4>카테고리 <small class="muted">여러 개 선택 · 대표 1개</small></h4><div class="catgrid">' + cats.map(function (c) {
          var on = draft.cats.indexOf(c.id) >= 0;
          return '<div class="cat-option ' + (on ? 'on' : '') + '"><label class="cat-choice" for="cat-' + c.id + '"><input id="cat-' + c.id + '" type="checkbox" data-cat="' + c.id + '"' + (on ? ' checked' : '') + '>' + esc(c.name) + ' <small class="muted">' + esc(c.group) + '</small></label><label class="rep" for="rep-' + c.id + '"><input id="rep-' + c.id + '" type="radio" name="main" data-main="' + c.id + '" aria-label="' + esc(c.name) + ' 대표 분류"' + (draft.main === c.id ? ' checked' : '') + (on ? '' : ' disabled') + '>대표</label></div>';
        }).join('') + '</div>' +
        '<h4>연결 자료 <small class="muted">자료 하나를 여러 도서에 연결</small></h4><div class="checklist">' + s.materials.map(function (m) { return '<label><input type="checkbox" data-mat="' + m.id + '"' + (draft.mats.indexOf(m.id) >= 0 ? ' checked' : '') + '>' + esc(m.title) + ' <small class="muted">' + esc(m.type) + '</small></label>'; }).join('') + '</div>' +
        '<div class="dfoot"><button class="btn" data-cancel>취소</button><button class="btn pri" data-save>저장</button></div></div>';
      });
    }
    paint();
    A.openDialog(d, opener, '[data-editbook="' + b.id + '"]');
    d.addEventListener('change', function (e) {
      var t = e.target;
      if (t.hasAttribute('data-a')) draft.authors[+t.getAttribute('data-a')][0] = +t.value;
      if (t.hasAttribute('data-r')) draft.authors[+t.getAttribute('data-r')][1] = t.value;
      if (t.hasAttribute('data-cat')) {
        var c = t.getAttribute('data-cat');
        if (t.checked) draft.cats.push(c); else draft.cats = draft.cats.filter(function (x) { return x !== c; });
        if (draft.cats.indexOf(draft.main) < 0) draft.main = draft.cats[0] || '';
        paint();
      }
      if (t.hasAttribute('data-main') && t.checked && draft.cats.indexOf(t.getAttribute('data-main')) >= 0) draft.main = t.getAttribute('data-main');
      if (t.hasAttribute('data-mat')) { var id = +t.getAttribute('data-mat'); if (t.checked) draft.mats.push(id); else draft.mats = draft.mats.filter(function (x) { return x !== id; }); }
    });
    d.addEventListener('click', function (e) {
      var t = e.target;
      if (t === d || t.hasAttribute('data-cancel')) { A.closeDialog(d); return; }
      if (t.hasAttribute('data-up')) { var i = +t.getAttribute('data-up'); swap(draft.authors, i, i - 1); paint(); }
      if (t.hasAttribute('data-down')) { var j = +t.getAttribute('data-down'); swap(draft.authors, j, j + 1); paint(); }
      if (t.hasAttribute('data-del')) { draft.authors.splice(+t.getAttribute('data-del'), 1); paint(); }
      if (t.hasAttribute('data-addauthor')) { draft.authors.push([s.authors[0].id, '지은이']); paint(); }
      if (t.hasAttribute('data-save')) {
        if (!draft.authors.length) { toast('작가를 한 명 이상 연결해 주세요'); return; }
        if (!draft.cats.length) { toast('카테고리를 하나 이상 선택해 주세요'); return; }
        if (draft.cats.indexOf(draft.main) < 0) { toast('선택한 분류 중 대표 분류를 지정해 주세요'); return; }
        var seen = {}, dupA = draft.authors.some(function (x) { var k = x[0] + '|' + x[1]; if (seen[k]) return true; seen[k] = 1; return false; });
        if (dupA) { toast('같은 작가·역할이 두 번 연결되어 있어요'); return; }
        b.authors = draft.authors; b.cats = draft.cats; b.main = draft.main;
        s.materials.forEach(function (m) {
          var has = m.books.indexOf(b.id) >= 0, want = draft.mats.indexOf(m.id) >= 0;
          if (want && !has) m.books.push(b.id);
          if (!want && has) m.books = m.books.filter(function (x) { return x !== b.id; });
        });
        save('도서 「' + b.title + '」의 작가·카테고리·자료 연결을 수정했습니다');
        A.closeDialog(d, true, function () { toast('저장했습니다 — 사이트에 바로 반영됩니다'); A.render(); });
      }
    });
  }
  function swap(a, i, j) { if (j < 0 || j >= a.length) return; var t = a[i]; a[i] = a[j]; a[j] = t; }

  /* ---------------- 작가 마스터 · CSV 적재 ---------------- */
  var csvRows = null;
  function vAuthors() {
    var s = st();
    return '<div class="cols"><div class="panel"><h2>작가 마스터 <small>' + s.authors.length + '명</small></h2><div class="tscroll"><table class="atbl"><thead><tr><th>이름</th><th>출생</th><th class="c">도서</th><th>옛 ID</th></tr></thead><tbody>' +
      s.authors.map(function (a) { var n = s.books.filter(function (b) { return b.authors.some(function (x) { return x[0] === a.id; }); }).length; return '<tr><td><a href="' + link('/authors/' + a.id) + '"><b>' + esc(a.name) + '</b></a></td><td>' + esc(a.birth || '-') + '</td><td class="c">' + n + '</td><td class="mono">' + esc(a.legacy || '-') + '</td></tr>'; }).join('') +
      '</tbody></table></div></div>' +
      '<div class="panel"><h2>작가 목록 CSV 적재</h2><p class="muted" style="margin-top:-6px;font-size:14px">이름의 띄어쓰기·출생연도로 기존 작가와 겹치는 후보를 찾아, 담당자가 확인한 뒤 병합합니다.</p>' +
      '<div class="field"><label for="csvT">CSV 내용</label><textarea class="ta" id="csvT" rows="6">' + esc(S0.csvSample) + '</textarea></div><button class="btn dark sm" data-csv>분석하기</button>' +
      '<div id="csvOut" style="margin-top:14px">' + csvView() + '</div></div></div>';
  }
  function csvView() {
    if (!csvRows) return '';
    if (!csvRows.length) return '<div class="notice ok">처리할 행이 없습니다.</div>';
    return csvRows.map(function (r, i) {
      if (r.error) return '<div class="notice bad">' + esc(r.name) + ' — ' + esc(r.error) + '</div>';
      if (r.done) return '<div class="notice ok" style="margin-top:6px">' + esc(r.name) + ' — ' + esc(r.done) + '</div>';
      if (r.match) return '<div class="dup"><span class="grow"><b>' + esc(r.name) + '</b>' + (r.birth ? ' (' + esc(r.birth) + ')' : '') + ' <span class="st warn">중복 후보</span><br><small class="muted">기존: ' + esc(r.match.name) + (r.match.birth ? ' (' + esc(r.match.birth) + ')' : '') + ' · ' + esc(r.why) + '</small></span><button class="btn xs dark" data-merge="' + i + '">기존 작가와 병합</button><button class="btn xs" data-new="' + i + '">새 작가로 등록</button></div>';
      return '<div class="dup" style="background:#f4fbf8;border-color:#c4ead8"><span class="grow"><b>' + esc(r.name) + '</b>' + (r.birth ? ' (' + esc(r.birth) + ')' : '') + ' <span class="st ok">신규</span></span><button class="btn xs dark" data-new="' + i + '">등록</button></div>';
    }).join('');
  }
  function analyzeCsv(text) {
    var s = st();
    var lines = text.split(/\r?\n/).map(function (l) { return l.trim(); }).filter(Boolean);
    if (lines.length && /이름/.test(lines[0])) lines.shift();
    csvRows = lines.map(function (l) {
      var c = l.split(','); var name = (c[0] || '').trim(), birth = (c[1] || '').trim();
      var m = s.authors.find(function (a) { return A.norm(a.name) === A.norm(name); });
      var why = !m ? '' : (m.name !== name ? '이름 띄어쓰기 차이' : (birth && m.birth === birth ? '이름·출생연도 일치' : '이름 일치'));
      return { name: name, birth: birth, match: m || null, why: why, error: birth && !/^\d{4}$/.test(birth) ? '출생연도는 네 자리 숫자로 입력하거나 비워 주세요.' : '' };
    }).filter(function (r) { return r.name; });
  }

  /* ---------------- 자료 · 노출 순서 ---------------- */
  function vMaterials() {
    var s = st();
    var list = A.ordered();
    var pinned = list.filter(function (m) { return m.pinned; });
    var rest = list.filter(function (m) { return !m.pinned; });
    function row(m, i, isPin) {
      return '<tr data-row="' + m.id + '"' + (isPin ? ' draggable="true"' : '') + '><td class="c">' + (isPin ? '<span class="drag" title="끌어서 순서 변경">⠿</span>' : '<span class="muted" style="font-size:12px">자동</span>') + '</td>' +
        '<td><button class="pinbtn ' + (m.pinned ? 'on' : '') + '" data-pin="' + m.id + '" aria-pressed="' + m.pinned + '" aria-label="상단 고정" title="상단 고정">' + PIN + '</button></td>' +
        '<td><b>' + esc(m.title) + '</b><br><small class="muted">' + esc(m.type) + ' · ' + esc(m.grade) + (m.reading ? ' · 독서 교육 제안' : '') + '</small></td>' +
        '<td class="c">' + m.books.length + '권</td>' +
        '<td class="c"><button class="sw ' + (m.main ? 'on' : '') + '" data-flag="main" data-id="' + m.id + '" aria-pressed="' + m.main + '" aria-label="메인 노출"></button></td>' +
        '<td class="c"><button class="sw ' + (m.library ? 'on' : '') + '" data-flag="library" data-id="' + m.id + '" aria-pressed="' + m.library + '" aria-label="자료실 노출"></button></td>' +
        '<td>' + esc(m.date) + '</td><td>' + (m.missing ? '<span class="st bad">파일 없음</span>' : '<span class="st ok">정상</span>') + '</td>' +
        '<td><div class="row" style="gap:4px;flex-wrap:nowrap">' + (isPin ? '<button class="btn xs" data-mup="' + m.id + '"' + (i ? '' : ' disabled') + ' aria-label="위로">↑</button><button class="btn xs" data-mdown="' + m.id + '"' + (i < pinned.length - 1 ? '' : ' disabled') + ' aria-label="아래로">↓</button>' : '') + '<button class="btn xs" data-editmat="' + m.id + '">편집</button></div></td></tr>';
    }
    var head = '<thead><tr><th class="c" style="width:44px">순서</th><th style="width:48px">고정</th><th>자료</th><th class="c">연결 도서</th><th class="c">메인</th><th class="c">자료실</th><th>등록일</th><th>파일</th><th></th></tr></thead>';
    return '<div class="cols"><div class="panel"><h2>메인 노출 미리보기 <small>상단 고정 → 나머지 최신순</small></h2><ol style="margin:0;padding-left:20px">' + A.ordered('main').map(function (m) { return '<li style="padding:3px 0">' + (m.pinned ? '<span class="tag pin">고정</span> ' : '') + esc(m.title) + ' <small class="muted">' + esc(m.date) + '</small></li>'; }).join('') + '</ol></div>' +
      '<div class="panel"><h2>자료실 노출 미리보기</h2><ol style="margin:0;padding-left:20px;max-height:260px;overflow:auto">' + A.ordered('library').map(function (m) { return '<li style="padding:3px 0">' + (m.pinned ? '<span class="tag pin">고정</span> ' : '') + esc(m.title) + '</li>'; }).join('') + '</ol></div></div>' +
      '<div class="panel"><h2>자료 목록 <small>고정 자료는 끌거나 ↑↓로 순서를 정합니다</small></h2><div class="tscroll"><table class="atbl" id="matTbl">' + head + '<tbody id="pinBody">' +
      (pinned.length ? pinned.map(function (m, i) { return row(m, i, true); }).join('') : '<tr><td colspan="9" class="muted">상단 고정 자료가 없습니다. 자료의 고정 버튼을 눌러 설정하세요.</td></tr>') +
      '</tbody><tbody><tr><td colspan="9" style="background:#fafbfc;font-size:12.5px;color:var(--mute);font-weight:700">아래는 등록일 최신순으로 자동 정렬됩니다</td></tr>' + rest.map(function (m, i) { return row(m, i, false); }).join('') + '</tbody></table></div></div>';
  }
  function renumber() { A.ordered().filter(function (m) { return m.pinned; }).forEach(function (m, i) { m.order = i + 1; }); }
  function matDrawer(id, opener) {
    var s = st(), isNew = !id;
    var m = isNew ? { id: 0, legacy: null, title: '', type: '활동지', grade: '', theme: '', reading: false, books: [], main: false, library: true, pinned: false, order: 0, date: S0.today, file: '', size: '1.0 MB', desc: '' } : JSON.parse(JSON.stringify(A.material(id)));
    var d = document.createElement('div'); d.className = 'modal'; document.body.appendChild(d);
    var filt = '';
    function paint() {
      A.paintDialog(d, function () {
      var n = A.norm(filt);
      d.innerHTML = '<div class="drawer" role="dialog" aria-modal="true" aria-label="자료 편집"><h2>' + (isNew ? '자료 등록' : '자료 편집') + '</h2><p class="muted" style="margin:0">자료는 도서와 별도로 등록하고 여러 도서에 연결합니다</p>' +
        '<h4>기본 정보</h4><div class="field"><label for="mT">자료명</label><input class="inp" id="mT" value="' + esc(m.title) + '"></div>' +
        '<div class="row"><div class="field grow"><label for="mY">유형</label><select class="sel" id="mY">' + ['지도안', '활동지', '평가', '가이드', '수업 슬라이드', '영상', '교과서 맛보기'].map(function (t) { return '<option' + (t === m.type ? ' selected' : '') + '>' + t + '</option>'; }).join('') + '</select></div>' +
        '<div class="field grow"><label for="mG">대상</label><input class="inp" id="mG" value="' + esc(m.grade) + '" placeholder="예: 중1 ~ 중3"></div><div class="field grow"><label for="mH">주제</label><input class="inp" id="mH" value="' + esc(m.theme) + '"></div></div>' +
        '<div class="field"><label for="mD">설명</label><input class="inp" id="mD" value="' + esc(m.desc) + '"></div>' +
        '<div class="field"><label for="mF">파일 이름</label><input class="inp" id="mF" value="' + esc(m.file) + '" placeholder="예: lesson_plan.pdf"></div>' +
        '<h4>노출</h4><div class="row"><label class="row"><input type="checkbox" id="mR"' + (m.reading ? ' checked' : '') + '> 독서 교육 제안에 표시</label><label class="row"><input type="checkbox" id="mM"' + (m.main ? ' checked' : '') + '> 메인</label><label class="row"><input type="checkbox" id="mL"' + (m.library ? ' checked' : '') + '> 자료실</label></div>' +
        '<h4>연결 도서 <small class="muted">' + m.books.length + '권 선택</small></h4><input class="inp" id="mQ" value="' + esc(filt) + '" placeholder="도서명으로 찾기" style="margin-bottom:8px"><div class="checklist">' +
        s.books.filter(function (b) { return !n || A.norm(b.title).indexOf(n) >= 0; }).map(function (b) { return '<label><input type="checkbox" data-bk="' + b.id + '"' + (m.books.indexOf(b.id) >= 0 ? ' checked' : '') + '><span class="kind ' + b.kind + '">' + (b.kind === 'textbook' ? '교과' : '단행') + '</span>' + esc(b.title) + '</label>'; }).join('') + '</div>' +
        '<div class="dfoot"><button class="btn" data-cancel>취소</button><button class="btn pri" data-save>저장</button></div></div>';
      });
    }
    function pull() {
      m.title = $('#mT', d).value.trim(); m.type = $('#mY', d).value; m.grade = $('#mG', d).value.trim(); m.theme = $('#mH', d).value.trim();
      m.desc = $('#mD', d).value.trim(); m.file = $('#mF', d).value.trim(); m.reading = $('#mR', d).checked; m.main = $('#mM', d).checked; m.library = $('#mL', d).checked;
    }
    paint();
    A.openDialog(d, opener, isNew ? '[data-newmat]' : '[data-editmat="' + id + '"]');
    d.addEventListener('input', function (e) { if (e.target.id === 'mQ') { pull(); filt = e.target.value; paint(); var q = $('#mQ', d); q.focus(); q.setSelectionRange(filt.length, filt.length); } });
    d.addEventListener('change', function (e) { var t = e.target; if (t.hasAttribute('data-bk')) { var b = +t.getAttribute('data-bk'); if (t.checked) m.books.push(b); else m.books = m.books.filter(function (x) { return x !== b; }); pull(); paint(); } });
    d.addEventListener('click', function (e) {
      var t = e.target;
      if (t === d || t.hasAttribute('data-cancel')) { A.closeDialog(d); return; }
      if (t.hasAttribute('data-save')) {
        pull();
        if (!m.title) { toast('자료명을 입력해 주세요'); return; }
        if (!m.file) { toast('파일 이름을 입력해 주세요'); return; }
        if (!m.theme) m.theme = m.type;
        if (!m.grade) m.grade = '전체';
        if (isNew) { m.id = s.materials.reduce(function (x, y) { return Math.max(x, y.id); }, 0) + 1; s.materials.push(m); }
        else { var i = s.materials.findIndex(function (x) { return x.id === m.id; }); s.materials[i] = m; }
        save((isNew ? '자료를 등록했습니다: ' : '자료를 수정했습니다: ') + m.title + ' (연결 도서 ' + m.books.length + '권)');
        A.closeDialog(d, true, function () { toast('저장했습니다'); A.render(); });
      }
    });
  }

  /* ---------------- 게시판 ---------------- */
  var newType = 'basic';
  function vBoards() {
    var s = st();
    return '<div class="panel"><h2>게시판 목록 <small>게시판별 유형과 운영 설정을 확인합니다.</small></h2><div class="tscroll"><table class="atbl"><thead><tr><th>이름</th><th>코드</th><th>유형</th><th>설정</th><th class="c">글</th><th></th></tr></thead><tbody>' +
      s.boards.map(function (b) { return '<tr><td><b>' + esc(b.name) + '</b></td><td class="mono">' + esc(b.code) + '</td><td><span class="st info">' + A.TYPE_NAME[b.type] + '</span></td><td class="muted">목록 ' + b.perPage + '개 · 분류 ' + (b.useCategory ? '사용' : '미사용') + ' · 첨부 ' + (b.allowAttach ? '허용' : '미허용') + '</td><td class="c">' + b.posts.length + '</td><td><a class="btn xs" href="' + link('/resources', { board: b.code }) + '">사이트에서 보기</a></td></tr>'; }).join('') +
      '</tbody></table></div></div>' +
      '<div class="panel"><h2>새 게시판 만들기 <small>게시판 유형과 목록·첨부 설정을 선택하세요.</small></h2>' +
      '<form data-newboard><div class="row"><div class="field grow"><label for="bN">게시판 이름</label><input class="inp" id="bN" name="bname" placeholder="예: 2027 새 학기 자료" required></div><div class="field" style="width:140px"><label for="bP">목록 개수</label><select class="sel" id="bP" name="per"><option>9</option><option selected>10</option><option>12</option><option>20</option></select></div></div>' +
      '<div class="field"><label>유형</label><div class="typecards">' + [['basic', '일반형', '제목 목록과 본문'], ['gallery', '갤러리형', '이미지 카드 격자'], ['file', '파일 다운로드 전용', '파일 목록과 내려받기']].map(function (t) {
        return '<button type="button" class="tcard ' + (newType === t[0] ? 'on' : '') + '" data-type="' + t[0] + '" aria-pressed="' + (newType === t[0]) + '"><div class="tprev ' + t[0] + '">' + (t[0] === 'gallery' ? '<i></i><i></i><i></i>' : t[0] === 'file' ? '<i></i><i></i><i></i><i></i>' : '<i></i><i></i><i></i>') + '</div><b>' + t[1] + '</b><small>' + t[2] + '</small></button>';
      }).join('') + '</div></div>' +
      '<div class="row" style="margin-bottom:14px"><label class="row"><input type="checkbox" name="cat"> 분류 사용</label><label class="row"><input type="checkbox" name="att" checked> 첨부 허용</label></div><button class="btn pri">게시판 만들기</button></form></div>';
  }

  /* ---------------- 옛 주소 · 301 ---------------- */
  var lastTest = null, vFilter = 'fail';
  var SAMPLES = [
    'http://textbook.example.co.kr/Home/BookDetail?bookid=1203',
    'http://books.example.co.kr/Home/BookDetail?bookid=1203',
    'https://TEXTBOOK.example.co.kr/home/BOOKDETAIL?BookID=1201',
    'http://books.example.co.kr/Home/AuthorDetail?authorid=704',
    'http://textbook.example.co.kr/Home/Boards_Download_Resource?resourceid=3290',
    'http://textbook.example.co.kr/Home/Boards_Download_Resource?resourceid=3277'
  ];
  function allLegacyUrls() {
    var s = st(), H = S0.hosts, out = [];
    function add(u, src) { if (!out.some(function (x) { return x.url === u; })) out.push({ url: u, src: src }); }
    s.books.forEach(function (b) {
      var h = H[b.legacy[0]];
      add('http://' + h + '/Home/BookDetail?bookid=' + b.legacy[1], 'DB');
      add('https://' + h.toUpperCase() + '/home/bookdetail?BookId=' + b.legacy[1], '변형');
    });
    s.materials.forEach(function (m) { if (m.legacy) add('http://' + H.textbook + '/Home/Boards_Download_Resource?resourceid=' + m.legacy, 'DB'); });
    s.news.forEach(function (n) { add('http://' + H[n.legacy[0]] + '/Home/NewsDetail?newsid=' + n.legacy[1], 'DB'); });
    s.authors.forEach(function (a) { if (Number.isSafeInteger(a.legacy) && a.legacy > 0) add('http://' + H.books + '/Home/AuthorDetail?authorid=' + a.legacy, 'DB'); });
    ['textbook', 'books'].forEach(function (k) { ['/', '/Home/Books', '/Home/Boards', '/Home/News'].forEach(function (p) { add('https://' + H[k] + p, '목록'); }); });
    add('https://' + H.textbook + '/Home/Books?te1=1', '목록'); add('https://' + H.textbook + '/Home/Books?te1=2', '목록');
    ['1', '2', '3'].forEach(function (v) { add('https://' + H.books + '/Home/Books?ae=' + v, '목록'); });
    S0.logUrls.forEach(function (u) { add(u, '접속 로그'); });
    s.failLog.forEach(function (f) { add(f.url, '실패 기록'); });
    return out;
  }
  function runVerify() {
    var list = allLegacyUrls(), s = st();
    var rows = list.map(function (x) {
      var r = A.resolve(x.url);
      var ok = r.status === 301 && !!r.title;
      return { url: x.url, src: x.src, status: r.status, target: r.target || '', title: r.title || '', ok: ok || r.status === 410, gone: r.status === 410 };
    });
    var pass = rows.filter(function (r) { return r.ok; }).length;
    s.verify = { at: A.nowStr(), total: rows.length, pass: pass, fail: rows.length - pass, gone: rows.filter(function (r) { return r.gone; }).length, rows: rows };
    save('옛 주소 전수 검증 실행 — ' + pass + ' / ' + rows.length + '건 통과');
  }
  function traceHTML(res) {
    return '<ol class="trace" style="margin:12px 0 0">' + res.steps.map(function (s) { return '<li class="on ' + (s.ok ? 'ok' : 'ng') + '"><i>' + (s.ok ? '✓' : '!') + '</i><div><b>' + esc(s.t) + '</b><code>' + esc(s.d) + '</code></div></li>'; }).join('') + '</ol>' +
      '<div class="notice ' + (res.status === 301 ? 'ok' : res.status === 410 ? 'info' : 'bad') + '">' + (res.status === 301 ? '301 → <b>' + esc(res.target) + '</b> · ' + esc(res.title) : res.status === 410 ? '410 — 승인된 폐기 대상으로 안내 화면을 보여 줍니다' : '대응 항목이 없습니다 — 임의의 화면으로 보내지 않고 안내 화면 표시 · 실패 기록 후 예외표에 추가합니다') + '</div>';
  }
  function vRedirects() {
    var s = st(), v = s.verify;
    var rowsAll = v ? v.rows : [];
    var rows = vFilter === 'fail' ? rowsAll.filter(function (r) { return !r.ok; }) : rowsAll;
    var H = S0.hosts;
    return '<div class="panel"><h2>주소 시험기 <small>인쇄된 QR·예전 주소가 어디로 가는지 확인</small></h2><form class="row" data-ltest><input class="inp grow mono" name="u" value="' + esc(lastTest || SAMPLES[0]) + '" aria-label="예전 주소"><button class="btn dark sm">확인</button></form>' +
      '<div class="row" style="margin-top:10px;gap:6px">' + SAMPLES.map(function (u, i) { return '<button class="btn xs" data-sample="' + i + '">' + ['교과서 1203', '단행본 1203', '대소문자 변형', '작가', '폐기 승인(410)', '대응 없음'][i] + '</button>'; }).join('') + '</div>' +
      (lastTest ? traceHTML(A.resolve(lastTest)) : '') + '</div>' +
      '<div class="panel"><h2>전수 검증 <small>DB의 모든 옛 ID + 대소문자·https 변형 + 접속 로그 + 실패 기록</small><button class="btn sm pri" data-verify>전수 검증 실행</button></h2>' +
      (v ? '<div class="kpis" style="margin-bottom:12px">' + kpi('검증 대상', v.total + '건', v.at) + kpi('통과', v.pass + '건', '301 → 목적지 확인 · 410 승인 ' + v.gone + '건 포함', 'ok') + kpi('조치 필요', v.fail + '건', v.fail ? '예외표에 추가하세요' : '모두 처리됨', v.fail ? '' : 'ok') + kpi('통과율', Math.round(v.pass / v.total * 1000) / 10 + '%', '목표 100%', v.fail ? '' : 'ok') + '</div>' +
        '<div class="row" style="margin-bottom:8px"><button class="chip ' + (vFilter === 'fail' ? 'on' : '') + '" data-vf="fail">조치 필요</button><button class="chip ' + (vFilter === 'all' ? 'on' : '') + '" data-vf="all">전체</button></div>' +
        '<div class="tscroll" style="max-height:380px;overflow:auto"><table class="atbl"><thead><tr><th>옛 주소</th><th>출처</th><th>결과</th><th>목적지</th><th></th></tr></thead><tbody>' +
        (rows.length ? rows.map(function (r) { return '<tr><td class="mono" style="word-break:break-all">' + esc(r.url) + '</td><td><span class="st mute">' + esc(r.src) + '</span></td><td>' + (r.gone ? '<span class="st info">410</span>' : r.ok ? '<span class="st ok">301</span>' : '<span class="st bad">대응 없음</span>') + '</td><td>' + esc(r.title || r.target || '-') + '</td><td>' + (r.ok ? '' : '<button class="btn xs" data-addex="' + esc(r.url) + '">예외표에 추가</button>') + '</td></tr>'; }).join('') : '<tr><td colspan="5" class="ok-t">조치가 필요한 주소가 없습니다 — 전부 통과</td></tr>') + '</tbody></table></div>'
        : '<p class="muted" style="margin:0">아직 검증하지 않았습니다. 「전수 검증 실행」을 눌러 보세요.</p>') + '</div>' +
      '<div class="cols"><div class="panel"><h2>예외 매핑표 <small>규칙으로 연결되지 않는 옛 주소</small></h2><div class="tscroll"><table class="atbl"><thead><tr><th>원본</th><th>옛 주소</th><th>처리</th><th>메모</th><th></th></tr></thead><tbody>' +
      s.exceptions.map(function (e, i) { return '<tr><td class="nw">' + (e.host === 'textbook' ? '교과서' : '단행본') + '</td><td class="mono">' + esc(e.path) + (e.key ? '?' + esc(e.key) + '=' + esc(e.value) : '') + '</td><td>' + (e.status === 410 ? '<span class="st info">410 폐기</span>' : '<span class="st ok">301</span> <span class="mono">' + esc(e.to) + '</span>') + '</td><td class="muted">' + esc(e.note) + '</td><td><button class="btn xs" data-delex="' + i + '" aria-label="삭제">✕</button></td></tr>'; }).join('') +
      '</tbody></table></div>' +
      '<form data-exform style="margin-top:14px;border-top:1px solid #eceef3;padding-top:14px" id="exForm"><div class="row"><div class="field" style="width:160px"><label for="eH">원본</label><select class="sel" id="eH" name="host"><option value="textbook">교과서·참고서</option><option value="books">단행본</option></select></div><div class="field grow"><label for="eU">옛 주소 (경로?키=값)</label><input class="inp mono" id="eU" name="u" placeholder="/Home/Boards_Download_Resource?resourceid=3277" required></div></div>' +
      '<div class="row"><div class="field" style="width:130px"><label for="eS">처리</label><select class="sel" id="eS" name="status"><option value="301">301 이동</option><option value="410">410 폐기</option></select></div><div class="field grow"><label for="eT">목적지 (통합 도메인 내부 경로)</label><select class="sel" id="eT" name="to"><option value="">선택</option>' +
      s.materials.map(function (m) { return '<option value="/materials/' + m.id + '">자료 · ' + esc(m.title) + '</option>'; }).join('') + s.books.map(function (b) { return '<option value="/books/' + b.id + '">도서 · ' + esc(b.title) + '</option>'; }).join('') + '</select></div></div>' +
      '<div class="field"><label for="eN">메모 (승인 근거)</label><input class="inp" id="eN" name="note" placeholder="예: 자료 통합 — 담당자 승인"></div><button class="btn dark sm">예외표에 추가</button></form></div>' +
      '<div class="panel"><h2>원본별 ID 대응표 <small>원본 도메인 + 유형 + 옛 ID → 신규 ID</small></h2><div class="tscroll" style="max-height:420px;overflow:auto"><table class="atbl"><thead><tr><th>원본</th><th>유형</th><th class="c">옛 ID</th><th class="c">신규 ID</th><th>대상</th></tr></thead><tbody>' +
      s.books.slice().sort(function (a, b) { return a.legacy[1] - b.legacy[1]; }).map(function (b) { var dup = s.books.filter(function (x) { return x.legacy[1] === b.legacy[1]; }).length > 1; return '<tr' + (dup ? ' style="background:#fff8ec"' : '') + '><td class="nw">' + (b.legacy[0] === 'textbook' ? '교과서' : '단행본') + '</td><td class="nw">도서</td><td class="c mono">' + b.legacy[1] + (dup ? ' <span class="st warn">같은 ID</span>' : '') + '</td><td class="c mono">' + b.id + '</td><td>' + esc(b.title) + '</td></tr>'; }).join('') +
      s.materials.map(function (m) { return '<tr><td class="nw">교과서</td><td class="nw">자료</td><td class="c mono">' + m.legacy + '</td><td class="c mono">' + m.id + '</td><td>' + esc(m.title) + '</td></tr>'; }).join('') +
      '</tbody></table></div><p class="muted" style="font-size:13px;margin:10px 0 0">두 사이트에 같은 옛 ID(1203)가 있어도 원본 도메인으로 구분해 서로 다른 책으로 연결합니다. 호스트: ' + H.textbook + ' · ' + H.books + ' → ' + H.unified + '</p></div></div>' +
      '<div class="panel"><h2>매핑 실패 기록 <small>전환 후 2주간 매일 확인</small></h2>' + (s.failLog.length ? '<div class="tscroll"><table class="atbl"><tbody>' + s.failLog.map(function (f) { return '<tr><td class="mono" style="word-break:break-all">' + esc(f.url) + '</td><td class="muted">' + esc(f.reason) + '</td><td class="muted" style="white-space:nowrap">' + esc(f.at) + '</td><td><button class="btn xs" data-addex="' + esc(f.url) + '">예외표에 추가</button></td></tr>'; }).join('') + '</tbody></table></div>' : '<p class="muted" style="margin:0">기록이 없습니다.</p>') + '</div>';
  }

  /* ---------------- 과업 B — 수업지원자료실 운영 ---------------- */
  var opsDraft = null;
  function shiftMonth(month, delta) {
    var a = month.split('-').map(Number), total = a[0] * 12 + a[1] - 1 + delta;
    return Math.floor(total / 12) + '-' + String(total % 12 + 1).padStart(2, '0');
  }
  function sum(items, field) { return items.reduce(function (n, i) { return n + (Number(i[field]) || 0); }, 0); }
  function prepareOps() {
    var o = st().ops, changed = false, baseUsed = 0, borrowed = 0;
    o.items.forEach(function (it) {
      if (!it.month) { it.month = it.over === '다음 달 이동' ? shiftMonth(o.month, 1) : o.month; changed = true; }
      if (!it.funding) {
        it.funding = it.over === '다음 달 이동' ? 'queue' : it.over === '다음 달 선사용' ? 'next' : /^추가 정산/.test(it.over || '') ? 'extra' : 'base';
        changed = true;
      }
      var overflow = Math.max(0, it.md - Math.max(0, o.alloc + o.carry - baseUsed));
      if (!Number.isFinite(it.borrowMD) || it.borrowMD < 0 || it.borrowMD > it.md) { it.borrowMD = it.funding === 'next' ? overflow : 0; changed = true; }
      if (!Number.isFinite(it.extraMD) || it.extraMD < 0 || it.extraMD > it.md) { it.extraMD = it.funding === 'extra' ? overflow : 0; changed = true; }
      if (it.borrowMD + it.extraMD > it.md || it.month === o.month && borrowed + it.borrowMD > Math.min(4, o.alloc)) {
        // Keep the request, but remove an invalid advance from this month's allocation.
        it.month = shiftMonth(o.month, 1); it.funding = 'queue'; it.borrowMD = 0; it.extraMD = 0;
        it.status = '대기'; it.over = '다음 달 이동'; changed = true;
      }
      if (it.month === o.month) { baseUsed += it.md - it.borrowMD - it.extraMD; borrowed += it.borrowMD; }
    });
    if (changed) A.save();
    return o;
  }
  function opsStats(o, month) {
    month = month || o.month;
    var items = o.items.filter(function (i) { return (i.month || o.month) === month; });
    var previous = o.items.filter(function (i) { return i.month === shiftMonth(month, -1); });
    var priorBorrow = sum(previous, 'borrowMD'), borrow = sum(items, 'borrowMD'), extra = sum(items, 'extraMD');
    var carry = month === o.month ? o.carry : 0;
    var baseAvailable = Math.max(0, o.alloc + carry - priorBorrow), planned = sum(items, 'md');
    var basePlanned = planned - borrow - extra;
    return { items: items, planned: planned, used: sum(items.filter(function (i) { return i.status !== '대기'; }), 'md'), borrow: borrow, extra: extra,
      priorBorrow: priorBorrow, baseAvailable: baseAvailable, available: baseAvailable + borrow + extra, remaining: Math.max(0, baseAvailable - basePlanned),
      nextMonth: shiftMonth(month, 1), queued: o.items.filter(function (i) { return i.month === shiftMonth(month, 1); }) };
  }
  A.opsStats = function (month) { return opsStats(prepareOps(), month); };
  function addOp(o, title, md, how) {
    var info = opsStats(o), overflow = Math.max(0, md - info.remaining);
    if (how === 'next' && info.borrow + overflow > Math.min(4, o.alloc)) { toast('다음 달 선사용은 초과분의 누적 합계가 최대 4 MD까지 가능합니다. 다른 처리 방식을 선택해 주세요.'); return false; }
    var month = how === 'queue' ? info.nextMonth : o.month;
    var borrowMD = how === 'next' ? overflow : 0, extraMD = how === 'extra' ? overflow : 0;
    var over = how === 'queue' ? '다음 달 이동' : how === 'next' ? '다음 달 선사용 ' + borrowMD + ' MD' : how === 'extra' ? '추가 정산 ' + (extraMD * 250000).toLocaleString('ko-KR') + '원' : '';
    var item = { id: o.items.reduce(function (x, y) { return Math.max(x, y.id); }, 0) + 1, title: title, md: md, status: '대기',
      month: month, funding: how || 'base', borrowMD: borrowMD, extraMD: extraMD, prio: o.items.filter(function (i) { return i.month === month; }).length + 1, over: over };
    o.items.push(item);
    save('운영 요청 추가: ' + title + ' (' + month + ', ' + md + ' MD' + (over ? ', ' + over : '') + ')');
    return true;
  }
  function vOps() {
    var o = prepareOps(), info = opsStats(o), avail = info.available, used = info.used, planned = info.planned;
    var items = info.items.slice().sort(function (a, b) { return a.prio - b.prio; });
    return '<div class="kpis">' + kpi('이번 달 가용', avail + ' MD', '월 할당 ' + o.alloc + ' + 이월 ' + o.carry + ' − 전월 선사용 ' + info.priorBorrow + ' + 선사용 ' + info.borrow + ' + 추가 ' + info.extra) + kpi('사용 중 · 완료', used + ' MD', '이번 달 진행·완료 항목') + kpi('계획 합계', planned + ' MD', planned > avail ? '가용보다 ' + (planned - avail) + ' MD 많음' : '가용 안에서 진행', planned > avail ? '' : 'ok') + kpi('대기 요청', items.filter(function (i) { return i.status === '대기'; }).length + '건', '이번 달 우선순위에 따라 진행') + '</div>' +
      (info.borrow || info.extra ? '<div class="notice info" style="margin-bottom:18px">다음 달 선사용 ' + info.borrow + ' MD · 추가 정산 ' + info.extra + ' MD (' + (info.extra * 250000).toLocaleString('ko-KR') + '원, 부가세 별도). 초과분만 별도로 집계합니다.</div>' : '') +
      '<div class="panel"><h2>' + o.month + ' 요청 목록 <small>매월 첫 주 우선순위 회의에서 확정</small></h2><div class="bar" style="margin-bottom:14px" aria-label="가용 MD 사용률"><i style="width:' + Math.min(100, planned / avail * 100) + '%;' + (planned > avail ? 'background:var(--warn)' : '') + '"></i></div>' +
      '<div class="tscroll"><table class="atbl"><thead><tr><th class="c">순위</th><th>요청</th><th class="c">예상 MD</th><th>상태</th><th></th></tr></thead><tbody>' +
      items.map(function (it, i) { return '<tr><td class="c"><b>' + (i + 1) + '</b></td><td>' + esc(it.title) + (it.over ? ' <span class="st warn">' + esc(it.over) + '</span>' : '') + '</td><td class="c">' + it.md + '</td><td><select class="sel" style="height:32px;width:100px" data-ostat="' + it.id + '" aria-label="상태">' + ['대기', '진행', '완료'].map(function (s) { return '<option' + (s === it.status ? ' selected' : '') + '>' + s + '</option>'; }).join('') + '</select></td><td><div class="row" style="gap:4px;flex-wrap:nowrap"><button class="btn xs" data-oup="' + it.id + '"' + (i ? '' : ' disabled') + ' aria-label="우선순위 올리기">↑</button><button class="btn xs" data-odown="' + it.id + '"' + (i < items.length - 1 ? '' : ' disabled') + ' aria-label="우선순위 내리기">↓</button></div></td></tr>'; }).join('') +
      '</tbody></table></div>' +
      '<form data-oadd class="row" style="margin-top:14px"><input class="inp grow" name="t" placeholder="새 요청 (예: 자료 카드에 학년 필터 추가)" required aria-label="요청 내용"><input class="inp" name="md" type="number" min="0.5" step="0.5" value="1" style="width:90px" aria-label="예상 MD"><button class="btn dark sm">요청 추가</button></form>' +
      (opsDraft ? '<div class="notice" style="margin-top:12px;flex-direction:column"><b>가용 MD를 넘는 요청입니다 — 처리 방식을 골라 주세요</b><span>요청 ' + opsDraft.md + ' MD · 이번 달 잔여 ' + info.remaining + ' MD · 초과분 ' + Math.max(0, opsDraft.md - info.remaining) + ' MD</span><div class="row" style="margin-top:8px"><button class="btn xs" data-over="next">다음 달 할당 선사용 (누적 최대 4 MD)</button><button class="btn xs" data-over="extra">초과분 추가 정산 (250,000원/MD · 승인 후)</button><button class="btn xs" data-over="queue">다음 달 우선순위로 이동</button><button class="btn xs ghost" data-over="cancel">취소</button></div></div>' : '') + '</div>' +
      '<div class="panel"><h2>' + info.nextMonth + ' 대기 요청 <small>' + info.queued.length + '건 · ' + sum(info.queued, 'md') + ' MD</small></h2>' +
      (info.queued.length ? '<ul style="margin:0;padding-left:20px">' + info.queued.map(function (it) { return '<li>' + esc(it.title) + ' · ' + it.md + ' MD · 다음 달 이동</li>'; }).join('') + '</ul>' : '<p class="muted" style="margin:0">다음 달로 이동한 요청이 없습니다.</p>') + '</div>' +
      '<div class="panel"><h2>이번 달 작업 요약</h2><p style="margin:0" class="muted">작업 ' + items.filter(function (i) { return i.status === '완료'; }).length + '건 완료 · 사용 ' + used + ' MD · 다음 달 이월 예정 ' + Math.min(4, info.remaining) + ' MD (최대 4 MD) · 다음 달 기본 할당에서 선사용 ' + info.borrow + ' MD 차감 · 장애·하자 대응은 할당에서 차감하지 않음</p></div>';
  }

  /* ---------------- 렌더 · 이벤트 ---------------- */
  var VIEWS = {
    '/admin': ['대시보드', '콘텐츠 현황과 확인이 필요한 항목', vDash],
    '/admin/books': ['도서', '작가, 분류, 수업 자료를 관리합니다.', vBooks],
    '/admin/authors': ['작가 마스터', '두 사이트의 작가를 한 곳에서 관리', vAuthors],
    '/admin/materials': ['자료 · 노출 순서', '도서를 연결하고 메인과 자료실의 노출 순서를 설정합니다.', vMaterials, '<button class="btn pri sm" data-newmat>+ 자료 등록</button>'],
    '/admin/boards': ['게시판', '유형을 골라 게시판을 만들면 자료실에 바로 나타납니다', vBoards],
    '/admin/redirects': ['옛 주소 · 301', '예전 주소의 연결 상태를 점검합니다. 브라우저 모의 결과이며 실제 HTTP·ALB 응답 검증은 아닙니다.', vRedirects],
    '/admin/ops': ['운영 요청', '요청별 진행 상황과 월별 작업량을 관리합니다.', vOps]
  };
  function render(r, root) {
    if (!authorized()) { window.PWAuth.render(r, root); return; }
    var v = VIEWS[r.path] || VIEWS['/admin'];
    if (!VIEWS[r.path]) r = { path: '/admin', q: {} };
    root.innerHTML = shell(r, v[0], v[1], v[2](r), v[3]);
    bindDrag();
  }
  function bindDrag() {
    var body = $('#pinBody'); if (!body) return;
    var dragId = null;
    $$('tr[draggable]', body).forEach(function (tr) {
      tr.addEventListener('dragstart', function (e) { dragId = +tr.getAttribute('data-row'); tr.classList.add('dragging'); e.dataTransfer.effectAllowed = 'move'; try { e.dataTransfer.setData('text/plain', String(dragId)); } catch (x) { /* 일부 브라우저 */ } });
      tr.addEventListener('dragend', function () { tr.classList.remove('dragging'); });
      tr.addEventListener('dragover', function (e) { e.preventDefault(); tr.classList.add('over'); });
      tr.addEventListener('dragleave', function () { tr.classList.remove('over'); });
      tr.addEventListener('drop', function (e) {
        e.preventDefault(); tr.classList.remove('over');
        var to = +tr.getAttribute('data-row'); if (!dragId || dragId === to) return;
        var pins = A.ordered().filter(function (m) { return m.pinned; });
        var from = pins.findIndex(function (m) { return m.id === dragId; }), ti = pins.findIndex(function (m) { return m.id === to; });
        var it = pins.splice(from, 1)[0]; pins.splice(ti, 0, it);
        pins.forEach(function (m, i) { m.order = i + 1; });
        save('상단 고정 자료 순서를 변경했습니다'); A.render();
      });
    });
  }
  function moveMat(id, dir) {
    var pins = A.ordered().filter(function (m) { return m.pinned; });
    var i = pins.findIndex(function (m) { return m.id === id; }); swap(pins, i, i + dir);
    pins.forEach(function (m, k) { m.order = k + 1; });
    save('상단 고정 자료 순서를 변경했습니다'); A.render();
  }
  function moveOp(id, dir) {
    var items = opsStats(prepareOps()).items.slice().sort(function (a, b) { return a.prio - b.prio; });
    var i = items.findIndex(function (x) { return x.id === id; }); if (i < 0) return; swap(items, i, i + dir);
    items.forEach(function (x, k) { x.prio = k + 1; }); save(); A.render();
  }
  function prefillException(url) {
    location.hash = '/admin/redirects';
    setTimeout(function () {
      var f = $('#exForm'); if (!f) return;
      try {
        var u = new URL(url);
        f.host.value = u.hostname.toLowerCase() === S0.hosts.books ? 'books' : 'textbook';
        f.u.value = u.pathname + u.search;
      } catch (e) { f.u.value = url; }
      f.scrollIntoView({ behavior: 'smooth', block: 'center' }); f.to.focus();
    }, 60);
  }

  function legacyInput(raw, host) {
    var u = new URL(raw, 'https://' + S0.hosts[host]);
    if (['http:', 'https:'].indexOf(u.protocol) < 0 || u.hostname.toLowerCase() !== S0.hosts[host]) throw new Error('선택한 원본 도메인과 주소가 일치하지 않습니다.');
    var path = (u.pathname.replace(/\/+$/, '') || '/').toLowerCase(), params = Object.create(null);
    u.searchParams.forEach(function (v, k) {
      k = k.toLowerCase(); v = v.trim();
      if (Object.prototype.hasOwnProperty.call(params, k) && params[k] !== v) throw new Error('같은 식별 키에 서로 다른 값이 있습니다.');
      params[k] = v;
    });
    var keys = Object.keys(params), known = { '/home/bookdetail': 'bookid', '/home/boards_download_resource': 'resourceid', '/home/newsdetail': 'newsid', '/home/authordetail': 'authorid' };
    var key = known[path] || (keys.length === 1 ? keys[0] : '');
    if (known[path] && (!params[key] || !/^\d+$/.test(params[key]) || +params[key] <= 0)) throw new Error('해당 경로의 도서·자료 식별 번호를 확인해 주세요.');
    if (!known[path] && keys.length > 1) throw new Error('알려지지 않은 경로는 식별 키 하나로 명확하게 지정해 주세요.');
    return { path: path, key: key, value: key ? params[key] : '', params: params };
  }

  document.addEventListener('click', function (e) {
    if (!authorized() || A.parse().path.indexOf('/admin') !== 0) return;
    var t = e.target.closest('button,a'); if (!t) return;
    var s = st();
    if (t.hasAttribute('data-editbook')) bookDrawer(+t.getAttribute('data-editbook'), t);
    else if (t.hasAttribute('data-csv')) { analyzeCsv($('#csvT').value); $('#csvOut').innerHTML = csvView(); }
    else if (t.hasAttribute('data-merge') || t.hasAttribute('data-new')) {
      var i = +(t.getAttribute('data-merge') || t.getAttribute('data-new')), r = csvRows && csvRows[i];
      if (!r || r.error || r.done) return;
      if (t.hasAttribute('data-merge')) { if (!r.match.birth && r.birth) r.match.birth = r.birth; r.done = '기존 작가 「' + r.match.name + '」와 병합했습니다'; save('CSV 작가 「' + r.name + '」을 기존 작가와 병합했습니다'); }
      else { var id = s.authors.reduce(function (x, y) { return Math.max(x, y.id); }, 0) + 1; s.authors.push({ id: id, name: r.name.replace(/\s+/g, ' '), birth: r.birth, bio: '', legacy: null }); r.done = '새 작가로 등록했습니다 (신규 ID ' + id + ')'; save('작가 「' + r.name + '」을 등록했습니다'); }
      A.render(); setTimeout(function () { var o = $('#csvOut'); if (o) o.innerHTML = csvView(); }, 0);
    }
    else if (t.hasAttribute('data-pin')) {
      var m = A.material(+t.getAttribute('data-pin')); m.pinned = !m.pinned;
      if (m.pinned) m.order = 999; renumber();
      save('자료 「' + m.title + '」 ' + (m.pinned ? '상단 고정' : '고정 해제')); A.render();
    }
    else if (t.hasAttribute('data-flag')) {
      var mm = A.material(+t.getAttribute('data-id')), f = t.getAttribute('data-flag'); mm[f] = !mm[f];
      save('자료 「' + mm.title + '」 ' + (f === 'main' ? '메인' : '자료실') + ' 노출 ' + (mm[f] ? '켬' : '끔')); A.render();
    }
    else if (t.hasAttribute('data-mup')) moveMat(+t.getAttribute('data-mup'), -1);
    else if (t.hasAttribute('data-mdown')) moveMat(+t.getAttribute('data-mdown'), 1);
    else if (t.hasAttribute('data-editmat')) matDrawer(+t.getAttribute('data-editmat'), t);
    else if (t.hasAttribute('data-newmat')) matDrawer(0, t);
    else if (t.hasAttribute('data-fixfile')) { var fm = A.material(+t.getAttribute('data-fixfile')); fm.missing = false; save('자료 「' + fm.title + '」 파일을 다시 연결했습니다'); toast('파일을 다시 연결했습니다 — 이제 내려받을 수 있습니다'); A.render(); }
    else if (t.hasAttribute('data-type')) { newType = t.getAttribute('data-type'); $$('.tcard').forEach(function (c) { var on = c.getAttribute('data-type') === newType; c.classList.toggle('on', on); c.setAttribute('aria-pressed', on); }); }
    else if (t.hasAttribute('data-sample')) { lastTest = SAMPLES[+t.getAttribute('data-sample')]; A.keepScroll = true; A.render(); }
    else if (t.hasAttribute('data-verify')) { runVerify(); A.keepScroll = true; A.render(); toast('전수 검증을 마쳤습니다'); }
    else if (t.hasAttribute('data-vf')) { vFilter = t.getAttribute('data-vf'); A.keepScroll = true; A.render(); }
    else if (t.hasAttribute('data-addex')) prefillException(t.getAttribute('data-addex'));
    else if (t.hasAttribute('data-delex')) { var ex = s.exceptions.splice(+t.getAttribute('data-delex'), 1)[0]; save('예외 매핑을 삭제했습니다: ' + ex.path); A.keepScroll = true; A.render(); }
    else if (t.hasAttribute('data-oup')) moveOp(+t.getAttribute('data-oup'), -1);
    else if (t.hasAttribute('data-odown')) moveOp(+t.getAttribute('data-odown'), 1);
    else if (t.hasAttribute('data-over')) {
      var how = t.getAttribute('data-over');
      if (['next', 'extra', 'queue', 'cancel'].indexOf(how) < 0) return;
      if (how !== 'cancel' && opsDraft && !addOp(prepareOps(), opsDraft.t, opsDraft.md, how)) return;
      opsDraft = null; A.keepScroll = true; A.render();
    }
  });
  document.addEventListener('change', function (e) {
    if (!authorized()) return;
    var t = e.target;
    if (t.hasAttribute && t.hasAttribute('data-ostat')) { var it = opsStats(prepareOps()).items.find(function (x) { return x.id === +t.getAttribute('data-ostat'); }); if (!it || ['대기', '진행', '완료'].indexOf(t.value) < 0) return; it.status = t.value; save('운영 요청 상태 변경: ' + it.title + ' → ' + it.status); A.keepScroll = true; A.render(); }
  });
  document.addEventListener('submit', function (e) {
    if (!authorized()) return;
    var f = e.target, s = st();
    if (f.hasAttribute('data-afilter')) { e.preventDefault(); A.go('/admin/books', { q: f.q.value.trim(), kind: f.kind.value }); }
    else if (f.hasAttribute('data-ltest')) { e.preventDefault(); lastTest = f.u.value.trim(); A.keepScroll = true; A.render(); }
    else if (f.hasAttribute('data-newboard')) {
      e.preventDefault();
      var name = f.bname.value.trim(); if (!name) return;
      if (s.boards.some(function (b) { return b.name === name; })) { toast('같은 이름의 게시판이 있어요'); return; }
      var code = 'board-' + (s.boards.length + 1);
      while (s.boards.some(function (b) { return b.code === code; })) code += 'x';
      s.boards.push({ code: code, name: name, type: newType, perPage: +f.per.value, useCategory: f.cat.checked, allowAttach: f.att.checked, posts: [] });
      save('게시판 「' + name + '」(' + A.TYPE_NAME[newType] + ')을 만들었습니다');
      toast('게시판을 만들었습니다 — 자료실에 바로 표시됩니다'); A.render();
    }
    else if (f.hasAttribute('data-exform')) {
      e.preventDefault();
      var raw = f.u.value.trim(), status = +f.status.value, to = f.to.value;
      var identity;
      try { identity = legacyInput(raw, f.host.value); } catch (error) { toast(error.message); return; }
      var path = identity.path, key = identity.key, value = identity.value;
      if ([301, 410].indexOf(status) < 0) { toast('주소 처리 방식을 확인해 주세요'); return; }
      if (status === 301 && !/^\/(books|materials|news|authors)\/\d+$/.test(to)) { toast('목적지는 통합 도메인 내부의 도서·자료 경로만 지정할 수 있어요'); return; }
      if (s.exceptions.some(function (x) { return x.host === f.host.value && x.path === path && x.key === key && String(x.value) === value; })) { toast('이미 등록된 옛 주소예요'); return; }
      s.exceptions.push({ host: f.host.value, path: path, key: key, value: value, to: status === 301 ? to : '', status: status, note: f.note.value.trim() || '담당자 승인' });
      s.failLog = s.failLog.filter(function (x) {
        try {
          var id = legacyInput(x.url, f.host.value);
          return !(id.path === path && (!key || id.params[key] === value));
        } catch (error) { return true; }
      });
      if (s.verify) runVerify();
      save('예외 매핑 추가: ' + path + (key ? '?' + key + '=' + value : '') + ' → ' + (status === 410 ? '410 폐기' : to));
      toast('예외표에 추가했습니다' + (s.verify ? ' — 전수 검증을 다시 실행했습니다' : '')); A.keepScroll = true; A.render();
    }
    else if (f.hasAttribute('data-oadd')) {
      e.preventDefault();
      var o = prepareOps(), md = Number(f.md.value), title = f.t.value.trim(); if (!title) return;
      if (!Number.isFinite(md) || md < 0.5 || !Number.isInteger(md * 2)) { toast('예상 MD는 0.5 이상의 숫자를 0.5 단위로 입력해 주세요'); return; }
      if (md > opsStats(o).remaining) { opsDraft = { t: title, md: md }; A.keepScroll = true; A.render(); return; }
      addOp(o, title, md, 'base'); A.keepScroll = true; A.render();
    }
  });

  window.PWAdmin = { render: render, resetUI: function () { csvRows = null; lastTest = null; opsDraft = null; newType = 'basic'; vFilter = 'fail'; } };
})();
