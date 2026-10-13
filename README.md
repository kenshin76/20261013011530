# 교과서·참고서·단행본 사이트 통합 리뉴얼 및 수업지원자료실 유지보수·고도화 — 제안 자료 (위시켓 158957)

발주처 전달용 정적 웹 자료입니다.

| 주소 | 자료 |
| --- | --- |
| `/` | **웹 제안서** — 1페이지 제안 요약과 프로토타입 안내 |
| `/prototype/` | **프로토타입** — 교과서·참고서·단행본 통합 사이트 (가상 데이터 · 관리자는 체험 계정으로 로그인) |

배포 주소: `https://kenshin76.github.io/20261013011530/`

- 프로토타입: `https://kenshin76.github.io/20261013011530/prototype/`
- 메인의 「프로토타입 열기」는 `prototype/index.html` 을, 프로토타입 첫 화면의 「메인으로」는 `../index.html` 을 직접 가리키므로 폴더 목록 화면이 나오지 않습니다.

## 배포

`main` 브랜치에 push 하면 GitHub Actions(`.github/workflows/pages.yml`)가 저장소 전체를 GitHub Pages 로 올립니다. 빌드 단계는 없습니다.
첫 push 이후 **Settings → Pages → Source 가 "GitHub Actions"** 인지 한 번 확인해 주십시오.

웹 폰트(Pretendard)만 `cdn.jsdelivr.net` 에서 불러옵니다. 차단된 망에서도 시스템 글꼴로 표시됩니다.

## 저장소에 올라가지 않는 것

`.gitignore` 로 제외합니다.

- 저장소 루트의 `.md` (이 README 만 예외) — `제안서.md`, `요약본.md`
- 프로토타입 내부 기록 `prototype/REVIEW.md`, `prototype/IMAGE_PROMPTS.md`, 내부 시험 `prototype/tests/`
- 화면에서 쓰지 않는 PNG 원본 `prototype/assets/images/*.png`
- `.docx` · `.pptx` · `.xlsx` · `.pdf` · `design/`, macOS·편집기 생성 파일

## 공개 범위 주의

검색 엔진 색인 거부(`noindex`)를 설정했지만, 주소를 아는 사람은 누구나 열 수 있습니다. 제안 금액이 화면에 있으므로 **발주처 내부 관계자에게만** 공유해 주십시오. 프로토타입의 모든 브랜드·도서·인물·자료는 가상 데이터입니다.
