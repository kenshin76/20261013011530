/* 가상 브랜드·가상 자료 — 실제 출판사·도서·인물과 관계없습니다 */
window.SEED = {
  today: '2027-02-22',
  hosts: { textbook: 'textbook.example.co.kr', books: 'books.example.co.kr', unified: 'www.example.co.kr' },

  cats: [
    { id: 'c1', name: '교과서', kind: 'textbook', group: '구분' },
    { id: 'c2', name: '참고서', kind: 'textbook', group: '구분' },
    { id: 'c3', name: '중학 국어', kind: 'textbook', group: '과목' },
    { id: 'c4', name: '고등 국어', kind: 'textbook', group: '과목' },
    { id: 'c5', name: '문학', kind: 'textbook', group: '과목' },
    { id: 'c6', name: '독서·작문', kind: 'textbook', group: '과목' },
    { id: 'c7', name: '화법·언어', kind: 'textbook', group: '과목' },
    { id: 'c8', name: '자습서', kind: 'textbook', group: '유형' },
    { id: 'c9', name: '평가문제집', kind: 'textbook', group: '유형' },
    { id: 'c20', name: '유아·어린이', kind: 'books', group: '독자' },
    { id: 'c21', name: '청소년', kind: 'books', group: '독자' },
    { id: 'c22', name: '교사·교육', kind: 'books', group: '독자' },
    { id: 'c23', name: '인문', kind: 'books', group: '장르' },
    { id: 'c24', name: '문학', kind: 'books', group: '장르' },
    { id: 'c25', name: '과학', kind: 'books', group: '장르' },
    { id: 'c26', name: '역사', kind: 'books', group: '장르' },
    { id: 'c27', name: '그림책', kind: 'books', group: '장르' }
  ],

  authors: [
    { id: 1, name: '김서윤', birth: '1971', bio: '중등 국어 교사로 일하며 교과서 집필에 참여해 왔습니다.', legacy: 701 },
    { id: 2, name: '박도현', birth: '1976', bio: '국어교육을 연구하고 교사 연수를 이끕니다.', legacy: 702 },
    { id: 3, name: '이하린', birth: '1984', bio: '아이들의 말과 마음을 동화로 옮깁니다.', legacy: 703 },
    { id: 4, name: '정민우', birth: '1978', bio: '청소년 소설을 씁니다. 길을 잃어도 괜찮다고 말하는 이야기를 좋아합니다.', legacy: 704 },
    { id: 5, name: '최유나', birth: '1981', bio: '과학 교사이자 환경 교육 활동가입니다.', legacy: 705 },
    { id: 6, name: '한지석', birth: '1969', bio: '교실에서 질문이 자라는 수업을 연구합니다.', legacy: 706 },
    { id: 7, name: '오세라', birth: '1987', bio: '그림책 작가. 작은 동물들의 하루를 그립니다.', legacy: 707 },
    { id: 8, name: '윤태오', birth: '1979', bio: '시와 산문을 쓰고 고등학교에서 문학을 가르칩니다.', legacy: 708 },
    { id: 9, name: '서지안', birth: '1990', bio: '일러스트레이터. 책과 교과서에 그림을 그립니다.', legacy: 709 },
    { id: 10, name: '강다온', birth: '1983', bio: '어린이·청소년 책을 우리말로 옮깁니다.', legacy: 710 },
    { id: 11, name: '에밀리 로스', birth: '1975', bio: '역사를 그림으로 들려주는 작가입니다.', legacy: 711 },
    { id: 12, name: '문채원', birth: '1980', bio: '독서교육 연구모임에서 활동하는 초등 교사입니다.', legacy: 712 },
    { id: 13, name: '임하준', birth: '1986', bio: '말하기·글쓰기 수업을 설계합니다.', legacy: 713 },
    { id: 14, name: '신예린', birth: '1988', bio: '청소년 상담 교사로 일하며 마음 이야기를 씁니다.', legacy: 714 }
  ],

  /* id = 신규 ID, legacy = 원본 사이트와 옛 bookid (두 사이트의 같은 ID는 원본으로 구분) */
  books: [
    { id: 1, kind: 'textbook', title: '중학 국어 1-1', series: '중학 국어 교과서', year: 2025, authors: [[1, '대표 저자'], [2, '공동 저자']], cats: ['c1', 'c3'], main: 'c1', legacy: ['textbook', 1101], desc: '읽기와 말하기, 쓰기를 한 흐름으로 묶은 단원 구성. 학생이 직접 질문을 만들며 배우는 활동을 담았습니다.' },
    { id: 2, kind: 'textbook', title: '중학 국어 1-2', series: '중학 국어 교과서', year: 2025, authors: [[1, '대표 저자'], [2, '공동 저자']], cats: ['c1', 'c3'], main: 'c1', legacy: ['textbook', 1102], desc: '매체 읽기와 토의 단원을 강화한 1학년 2학기 교과서입니다.' },
    { id: 3, kind: 'textbook', title: '중학 국어 2-1', series: '중학 국어 교과서', year: 2026, authors: [[2, '대표 저자'], [13, '공동 저자']], cats: ['c1', 'c3'], main: 'c1', legacy: ['textbook', 1103], desc: '논리적인 말하기와 근거 있는 글쓰기를 중심에 둔 2학년 교과서입니다.' },
    { id: 4, kind: 'textbook', title: '고등 문학', series: '고등 국어 교과서', year: 2025, authors: [[8, '대표 저자'], [1, '공동 저자']], cats: ['c1', 'c4', 'c5'], main: 'c5', legacy: ['textbook', 1201], desc: '고전과 현대를 잇는 작품 선정, 감상에서 창작까지 이어지는 활동을 담았습니다.' },
    { id: 5, kind: 'textbook', title: '고등 독서와 작문', series: '고등 국어 교과서', year: 2025, authors: [[2, '대표 저자'], [13, '공동 저자']], cats: ['c1', 'c4', 'c6'], main: 'c6', legacy: ['textbook', 1202], desc: '긴 글 읽기와 과정 중심 쓰기를 한 권에서 연결합니다.' },
    { id: 6, kind: 'textbook', title: '고등 화법과 언어', series: '고등 국어 교과서', year: 2026, authors: [[13, '대표 저자'], [2, '공동 저자']], cats: ['c1', 'c4', 'c7'], main: 'c7', legacy: ['textbook', 1203], desc: '대화와 토론, 우리말의 구조를 실제 말하기 장면으로 배웁니다.' },
    { id: 7, kind: 'textbook', title: '중학 국어 1-1 자습서', series: '중학 국어 자습서', year: 2025, authors: [[1, '지은이'], [2, '지은이']], cats: ['c2', 'c3', 'c8'], main: 'c8', legacy: ['textbook', 1301], desc: '교과서 단원별 핵심 정리와 서술형 연습 문제를 담았습니다.' },
    { id: 8, kind: 'textbook', title: '고등 문학 평가문제집', series: '고등 평가문제집', year: 2026, authors: [[8, '지은이']], cats: ['c2', 'c4', 'c5', 'c9'], main: 'c9', legacy: ['textbook', 1302], desc: '작품별 감상 포인트와 수행평가형 문항을 한 권에.' },
    { id: 9, kind: 'textbook', title: '고등 독서 개념 노트', series: '개념 노트', year: 2026, authors: [[13, '지은이']], cats: ['c2', 'c4', 'c6'], main: 'c6', legacy: ['textbook', 1303], desc: '독서 영역의 개념을 도식과 예문으로 정리한 노트형 참고서입니다.' },
    { id: 10, kind: 'books', title: '바람을 읽는 아이', series: '첫 독서', year: 2024, authors: [[3, '지은이'], [9, '그림']], cats: ['c20', 'c24'], main: 'c20', legacy: ['books', 2001], desc: '바람 소리로 친구의 마음을 알아채는 아이, 나루의 사계절 이야기.' },
    { id: 11, kind: 'books', title: '별을 세는 고양이', series: '첫 독서', year: 2025, authors: [[7, '글·그림']], cats: ['c20', 'c27'], main: 'c27', legacy: ['books', 2002], desc: '잠 못 드는 밤, 지붕 위 고양이와 함께 별을 세어 보는 그림책.' },
    { id: 12, kind: 'books', title: '열다섯, 지도 밖으로', series: '', year: 2025, authors: [[4, '지은이']], cats: ['c21', 'c24'], main: 'c21', legacy: ['books', 2003], desc: '정해진 길 대신 처음 가 보는 길을 택한 열다섯 살들의 일주일.' },
    { id: 13, kind: 'books', title: '우리 반 기후 일기', series: '교실 밖 과학', year: 2026, authors: [[5, '지은이'], [9, '그림']], cats: ['c21', 'c25'], main: 'c25', legacy: ['books', 2004], desc: '교실 온도계에서 시작한 한 학기 기후 관찰 기록.' },
    { id: 14, kind: 'books', title: '질문하는 교실', series: '', year: 2024, authors: [[6, '지은이']], cats: ['c22', 'c23'], main: 'c22', legacy: ['books', 2005], desc: '좋은 질문이 수업을 바꾸는 순간들을 모았습니다.' },
    { id: 15, kind: 'books', title: '선생님의 독서 수업', series: '', year: 2025, authors: [[12, '지은이'], [6, '엮은이']], cats: ['c22'], main: 'c22', legacy: ['books', 2006], desc: '한 학기 한 권 읽기를 운영해 온 교사들의 실천 기록.' },
    { id: 16, kind: 'books', title: '시를 건너는 법', series: '생각 키우는 문학 수업', year: 2025, authors: [[8, '지은이']], cats: ['c21', 'c24', 'c22'], main: 'c24', legacy: ['books', 2007], desc: '시 한 편을 천천히 건너는 열두 가지 방법.' },
    { id: 17, kind: 'books', title: '소설을 여는 열쇠', series: '생각 키우는 문학 수업', year: 2026, authors: [[8, '지은이'], [4, '지은이']], cats: ['c21', 'c24'], main: 'c24', legacy: ['books', 2008], desc: '인물, 시점, 갈등 — 소설을 여는 세 개의 열쇠.' },
    { id: 18, kind: 'books', title: '교실 밖 과학 1: 물의 여행', series: '교실 밖 과학', year: 2024, authors: [[5, '지은이'], [9, '그림']], cats: ['c20', 'c25'], main: 'c25', legacy: ['books', 2009], desc: '구름에서 수도꼭지까지, 물 한 방울의 긴 여행.' },
    { id: 19, kind: 'books', title: '말하기의 온도', series: '', year: 2025, authors: [[13, '지은이']], cats: ['c21', 'c23'], main: 'c23', legacy: ['books', 1203], desc: '같은 말도 다르게 닿는 이유. 청소년을 위한 대화 수업.' },
    { id: 20, kind: 'books', title: '그림으로 읽는 역사', series: '', year: 2024, authors: [[11, '지은이'], [10, '옮긴이']], cats: ['c20', 'c26', 'c27'], main: 'c26', legacy: ['books', 2012], desc: '한 장의 그림 속에서 시대를 읽어 내는 어린이 역사 그림책.' },
    { id: 21, kind: 'books', title: '마음 근육 키우기', series: '', year: 2026, authors: [[14, '지은이']], cats: ['c21', 'c23'], main: 'c21', legacy: ['books', 2013], desc: '흔들리는 날에도 나를 지키는 작은 연습들.' },
    { id: 22, kind: 'books', title: '함께 쓰는 글쓰기 수업', series: '', year: 2026, authors: [[13, '지은이'], [12, '지은이']], cats: ['c22'], main: 'c22', legacy: ['books', 2014], desc: '쓰기 공동체를 만드는 열 번의 수업 설계.' },
    { id: 23, kind: 'books', title: '작은 섬의 도서관', series: '첫 독서', year: 2026, authors: [[3, '지은이'], [7, '그림']], cats: ['c20', 'c24'], main: 'c20', legacy: ['books', 2015], desc: '배가 하루 한 번 오는 섬에 도서관이 생긴 날.' },
    { id: 24, kind: 'books', title: '교실 밖 과학 2: 숲의 시간', series: '교실 밖 과학', year: 2026, authors: [[5, '지은이'], [9, '그림']], cats: ['c20', 'c25'], main: 'c25', legacy: ['books', 2010], desc: '나무 한 그루가 숲이 되기까지 걸리는 시간.' }
  ],

  /* 자료 — 도서와 별도로 등록하고 N:M으로 연결 · pinned/order: 상단 고정 순서 */
  materials: [
    { id: 1, legacy: 3301, title: '「시를 건너는 법」 수업 지도안', type: '지도안', grade: '중3 · 고1', theme: '시', reading: true, books: [16, 4], main: true, library: true, pinned: false, order: 0, date: '2027-02-18', file: 'poem_lesson_plan.pdf', size: '2.4 MB', desc: '4차시로 구성한 시 감상 수업. 낭독·필사·질문 만들기 활동지 포함.' },
    { id: 2, legacy: 3302, title: '문학 단원 활동지 묶음', type: '활동지', grade: '고1 · 고2', theme: '소설', reading: false, books: [4, 8, 17], main: true, library: true, pinned: true, order: 1, date: '2027-01-30', file: 'literature_worksheets.zip', size: '8.1 MB', desc: '고등 문학 교과서 단원별 활동지 24종.' },
    { id: 3, legacy: 3303, title: '「우리 반 기후 일기」 토론 카드', type: '활동지', grade: '중1 ~ 중3', theme: '환경', reading: true, books: [13, 18, 24], main: true, library: true, pinned: false, order: 0, date: '2027-02-10', file: 'climate_debate_cards.pdf', size: '5.6 MB', desc: '관찰 기록에서 토론 질문으로. 모둠 토론용 카드 36장.' },
    { id: 4, legacy: 3304, title: '중학 국어 1-1 평가 문항', type: '평가', grade: '중1', theme: '평가', reading: false, books: [1, 7], main: false, library: true, pinned: false, order: 0, date: '2027-02-05', file: 'mid_korean_1-1_test.hwp', size: '1.2 MB', desc: '단원별 형성평가와 서술형 채점 기준.' },
    { id: 5, legacy: 3305, title: '고등 독서 수업 슬라이드', type: '수업 슬라이드', grade: '고1 · 고2', theme: '독서', reading: false, books: [5, 9], main: false, library: true, pinned: false, order: 0, date: '2027-01-22', file: 'reading_class_slides.pptx', size: '14.0 MB', desc: '독서 영역 12차시 수업용 슬라이드.' },
    { id: 6, legacy: 3306, title: '「질문하는 교실」 교사 연수 자료', type: '지도안', grade: '교사', theme: '수업 설계', reading: true, books: [14, 15, 22], main: true, library: true, pinned: true, order: 2, date: '2027-01-15', file: 'question_classroom_training.pdf', size: '3.9 MB', desc: '질문 만들기 수업을 처음 여는 선생님을 위한 3시간 연수 자료.' },
    { id: 7, legacy: 3307, title: '그림책 함께 읽기 가이드', type: '가이드', grade: '초1 ~ 초4', theme: '그림책', reading: true, books: [11, 23, 10], main: true, library: true, pinned: false, order: 0, date: '2027-02-14', file: 'picturebook_guide.pdf', size: '6.2 MB', desc: '소리 내어 함께 읽고, 장면을 멈춰 이야기 나누는 방법.' },
    { id: 8, legacy: 3308, title: '「열다섯, 지도 밖으로」 독서 토론 질문지', type: '활동지', grade: '중2 ~ 고1', theme: '성장', reading: true, books: [12, 21], main: false, library: true, pinned: false, order: 0, date: '2027-02-02', file: 'fifteen_discussion.pdf', size: '0.9 MB', desc: '인물의 선택을 따라가는 질문 20개와 모둠 활동.' },
    { id: 9, legacy: 3309, title: '역사 그림책 연계 수업', type: '지도안', grade: '초3 ~ 초6', theme: '역사', reading: true, books: [20], main: false, library: true, pinned: false, order: 0, date: '2026-12-20', file: 'history_picturebook.pdf', size: '4.4 MB', desc: '그림 한 장으로 시작하는 역사 탐구 2차시.' },
    { id: 10, legacy: 3310, title: '화법과 언어 개념 영상 모음', type: '영상', grade: '고2', theme: '화법', reading: false, books: [6, 19], main: false, library: true, pinned: false, order: 0, date: '2027-01-08', file: 'speech_videos_links.pdf', size: '0.3 MB', desc: '단원별 5분 개념 영상 링크 모음.' },
    { id: 11, legacy: 3311, title: '중학 국어 1-2 맛보기 단원', type: '교과서 맛보기', grade: '중1', theme: '교과서', reading: false, books: [2], main: false, library: true, pinned: false, order: 0, date: '2026-12-02', file: 'mid_korean_1-2_preview.pdf', size: '11.5 MB', missing: true, desc: '1학년 2학기 교과서 첫 단원 미리보기.' },
    { id: 12, legacy: 3312, title: '글쓰기 수업 평가 기준표', type: '평가', grade: '중3 ~ 고2', theme: '글쓰기', reading: true, books: [22, 5], main: true, library: true, pinned: false, order: 0, date: '2027-02-19', file: 'writing_rubric.xlsx', size: '0.2 MB', desc: '과정 중심 쓰기 평가를 위한 4단계 기준표와 예시 답안.' }
  ],

  news: [
    { id: 1, legacy: ['textbook', 512], kind: '공지', title: '2027학년도 교과서 선정 자료 신청 안내', date: '2027-02-16', body: '학교별 교과서 선정을 위한 견본 자료와 수업 자료 묶음을 신청하실 수 있습니다.' },
    { id: 2, legacy: ['books', 88], kind: '행사', title: '「작은 섬의 도서관」 작가와 함께하는 온라인 북토크', date: '2027-02-12', body: '이하린 작가와 함께 섬마을 도서관 이야기를 나눕니다. 학급 단위 참여를 환영합니다.' },
    { id: 3, legacy: ['textbook', 509], kind: '공지', title: '교과서·참고서 사이트가 통합 사이트로 이전합니다', date: '2027-02-01', body: '3월부터 교과서·참고서 정보도 통합 사이트에서 만나실 수 있습니다. 인쇄물의 QR 코드는 그대로 사용하실 수 있습니다.' },
    { id: 4, legacy: ['books', 85], kind: '보도', title: '「우리 반 기후 일기」, 청소년 추천 도서 선정', date: '2027-01-20', body: '교실에서 시작한 기후 관찰 기록이 올해의 청소년 추천 도서로 선정되었습니다.' },
    { id: 5, legacy: ['books', 81], kind: '공지', title: '단행본 사이트가 새 주소로 이전했습니다', date: '2027-01-19', body: '단행본 정보가 통합 사이트로 옮겨졌습니다. 예전 주소와 QR로 들어오셔도 자동으로 새 주소로 안내합니다.' },
    { id: 6, legacy: ['textbook', 501], kind: '행사', title: '겨울방학 교사 연수 「질문하는 교실」 신청', date: '2026-12-28', body: '질문 만들기 수업 연수를 온라인으로 진행합니다.' }
  ],

  boards: [
    { code: 'notice', name: '공지사항', type: 'basic', perPage: 10, useCategory: false, allowAttach: false, posts: [
      { id: 1, title: '자료실 이용 안내 — 교사 인증 없이 내려받을 수 있는 자료', date: '2027-02-15', views: 412, body: '자료실에 공개된 지도안과 활동지, 교과서 맛보기 자료는 별도의 교사 인증 없이 이용할 수 있습니다. 도서 상세에서도 해당 책과 관련된 자료를 확인할 수 있습니다.\n\n자료는 수업 준비와 교육 활동에 활용해 주세요. 이용 범위와 출처 표시는 각 자료의 안내를 확인해 주시기 바랍니다.' },
      { id: 2, title: '설 연휴 기간 문의 응대 안내', date: '2027-02-03', views: 158, body: '설 연휴인 2월 8일부터 9일까지 문의 응대가 잠시 쉬어 갑니다. 연휴 기간에도 도서 검색과 공개 자료실은 이용할 수 있습니다.\n\n접수된 문의는 2월 10일부터 순서대로 확인하겠습니다. 편안한 연휴 보내시기 바랍니다.' },
      { id: 3, title: '2027 교과서 선정 일정 안내', date: '2027-01-26', views: 873, body: '새 학기 교과서 선정에 필요한 도서 정보와 단원별 맛보기 자료를 준비했습니다. 교과서·참고서 메뉴에서 과목별 도서를 찾아보세요.\n\n각 도서 상세 화면에서 집필진과 책 소개, 관련 수업 자료를 함께 확인할 수 있습니다.' }
    ] },
    { code: 'gallery', name: '수업 갤러리', type: 'gallery', perPage: 9, useCategory: true, allowAttach: true, posts: [
      { id: 1, title: '시 낭독 콘서트를 열었어요', date: '2027-02-17', tone: 3, body: '마음에 드는 시를 골라 읽고, 낭독할 때 강조하고 싶은 구절을 나누었습니다. 같은 시도 읽는 속도와 목소리에 따라 다르게 느껴지는 경험을 함께했습니다.\n\n독서 교육 제안의 시 수업 지도안에서 낭독과 질문 만들기 활동을 찾아보세요.' },
      { id: 2, title: '기후 일기 전시회', date: '2027-02-09', tone: 1, body: '날씨와 주변 환경을 꾸준히 관찰한 기록을 모아 작은 전시를 꾸몄습니다. 관찰 일기와 토론 질문을 함께 놓아 서로의 발견을 읽고 이야기를 나누었습니다.\n\n「우리 반 기후 일기」 토론 카드를 활용해 관찰 기록을 토론 주제로 연결할 수 있습니다.' },
      { id: 3, title: '그림책 함께 읽기 — 2학년 3반', date: '2027-01-28', tone: 5, body: '그림책의 한 장면에서 읽기를 멈추고 인물의 마음을 상상해 보았습니다. 친구들의 생각을 듣고 다음 장면을 다시 읽으니 이야기가 새롭게 보였습니다.\n\n그림책 함께 읽기 가이드에서 소리 내어 읽기와 장면 이야기 나누기 활동을 확인해 보세요.' },
      { id: 4, title: '토론 카드로 연 모둠 수업', date: '2027-01-14', tone: 2, body: '모둠별로 질문 카드를 고르고, 근거를 찾은 뒤 서로의 생각을 나누었습니다. 한 사람이 정답을 말하기보다 다양한 관점을 듣는 데 집중했습니다.\n\n활동지와 토론 질문지는 자료실에서 주제에 맞게 골라 활용할 수 있습니다.' },
      { id: 5, title: '섬마을 도서관 만들기 프로젝트', date: '2026-12-22', tone: 4, body: '「작은 섬의 도서관」을 읽고 우리에게 필요한 도서관을 상상했습니다. 함께 읽고 싶은 책을 고르고, 도서관에서 나눌 수 있는 활동을 제안했습니다.\n\n그림책 함께 읽기 가이드와 연결된 도서 목록을 참고해 여러 권의 책으로 활동을 이어 보세요.' },
      { id: 6, title: '질문 나무 게시판', date: '2026-12-10', tone: 0, body: '책을 읽으며 떠오른 질문을 카드에 적어 게시판에 모았습니다. 비슷한 질문끼리 묶고, 서로의 질문을 골라 답하면서 읽기를 이어 갔습니다.\n\n「질문하는 교실」 교사 연수 자료에서 질문 만들기 수업의 준비 과정을 확인할 수 있습니다.' }
    ] },
    { code: 'files', name: '교과서 자료실', type: 'file', perPage: 10, useCategory: true, allowAttach: true, posts: [
      { id: 1, title: '중학 국어 1-1 교수·학습 자료(전 단원)', date: '2027-02-11', file: 'mk1-1_all.zip', size: '42 MB' },
      { id: 2, title: '고등 문학 작품 해설집', date: '2027-02-04', file: 'lit_commentary.pdf', size: '9.8 MB' },
      { id: 3, title: '고등 화법과 언어 수행평가 예시', date: '2027-01-21', file: 'speech_assessment.hwp', size: '1.1 MB' }
    ] }
  ],

  /* 레거시 목록 필터(te1, ae) → 신규 카테고리 */
  legacyCats: { textbook: { te1: { '1': 'c1', '2': 'c2' } }, books: { ae: { '1': 'c20', '2': 'c21', '3': 'c22' } } },

  /* 예외 매핑표 — 규칙으로 연결되지 않는 옛 주소 */
  exceptions: [
    { host: 'books', path: '/home/bookdetail', key: 'bookid', value: '2011', to: '/books/17', note: '절판 후 개정판으로 통합', status: 301 },
    { host: 'textbook', path: '/home/boards_download_resource', key: 'resourceid', value: '3290', to: '', note: '저작권 만료로 폐기 승인', status: 410 }
  ],

  /* 기존 서버 접속 로그에서 추출한 주소 (전수 검증 대상에 포함) */
  logUrls: [
    'http://textbook.example.co.kr/Home/BookDetail?bookid=1203',
    'https://TEXTBOOK.example.co.kr/home/bookdetail?BookId=1201',
    'http://books.example.co.kr/Home/BookDetail?bookid=1203',
    'http://books.example.co.kr/Home/BookDetail?bookid=2011',
    'http://textbook.example.co.kr/Home/Boards_Download_Resource?resourceid=3302',
    'http://textbook.example.co.kr/Home/Boards_Download_Resource?resourceid=3290',
    'http://textbook.example.co.kr/Home/Boards_Download_Resource?resourceid=3277',
    'https://books.example.co.kr/Home/Books?ae=2',
    'https://textbook.example.co.kr/Home/Books?te1=1',
    'http://books.example.co.kr/Home/NewsDetail?newsid=85'
  ],

  /* 과업 B — 수업지원자료실 월 운영 */
  ops: {
    month: '2027-09', alloc: 8, carry: 1,
    items: [
      { id: 1, title: '자료실 검색 결과에 학년·유형 필터 추가', md: 2.5, status: '완료', prio: 1 },
      { id: 2, title: '신규 게시판 컴포넌트 — 갤러리형 카드', md: 2, status: '진행', prio: 2 },
      { id: 3, title: '자료 일괄 다운로드(zip) 개선', md: 1.5, status: '진행', prio: 3 },
      { id: 4, title: '새 학기 대비 자료실 메인 구조 개편 설계', md: 2, status: '대기', prio: 4 },
      { id: 5, title: '관리자 자료 등록 시 미리보기', md: 1, status: '대기', prio: 5 }
    ]
  },

  csvSample: '이름,출생연도,비고\n정민우,1978,청소년 소설\n이 하린,,동화\n홍서진,1985,그림책 작가\n최유나,1981,과학 교사'
};
