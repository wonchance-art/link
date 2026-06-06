# Open Chaence — 핸드오프 / 현재 상태

> 새 세션이나 나중의 나를 위한 인수인계. 이 문서만 읽으면 이어서 작업 가능.

## 한 줄 요약

한 사람의 **우주론**을 인터랙티브 웹아트로 만든 사이트. 검은 우주에 태양(이성)·지구(자기)·달(감성)이 돌고, 은하수는 "나의 세계(감사의 총체)", 별 하나하나가 감사하는 존재. 천체를 누르면 확대·자전 후 각 주제 페이지로. 별을 누르면 그 글이 뜬다. **완전 무텍스트.**

- **레포**: https://github.com/wonchance-art/link (계정 wonchance-art)
- **라이브**: https://link-fnup.vercel.app (Vercel, main 푸시 시 자동 배포)
- **로컬**: `~/projects/link` (옵시디언 vault가 아니라 여기! node_modules 충돌 방지)
- **스택**: SvelteKit 2 + Svelte 5 (runes) + TypeScript, adapter-vercel

## 정체성 결정 (중요)

**예술 경험이 우선.** 명함/포트폴리오(Wonnit)는 직접 링크로 공유하고, 그 경로로 들어와도 예술 경험으로 자연스럽게 전개되게.

## 디자인 컨셉

| 천체 | 상징 | 경로 |
|---|---|---|
| 태양 | 이성 (과학·진리) | `/sun` |
| 달 | 감성 (미학·예술) | `/moon` |
| 지구 | 자기(自己) → 땅/바다 | 확대 → 땅 `/land`, 바다 `/sea` |
| 은하수 | 나의 세계 = 삶의 아름다움·의미의 총체 | (배경) |
| 별 하나 | 감사하는 존재·순간 | 클릭 → 글 카드 |

- 땅 = 나의 밖(사회적 조화), 바다 = 나의 안(내면·심연, 단상)
- Wonnit(`/works`) = 그 생각·감정이 빚어낸 산물(포트폴리오). "Won + we won it"

## 라우트 구조

```
src/routes/
├── (dark)/                 # 다크 테마 그룹 (body.cosmic, 검정 #000)
│   ├── +layout.svelte      # body에 cosmic 클래스 (전환 깜빡임 방지)
│   ├── +layout.server는 없음
│   ├── +page.svelte        # / = 우주 (Cosmos)
│   ├── +page.server.ts     # 지구 land path를 서버에서 생성 (d3 클라 번들 제외)
│   ├── sun/+page.svelte     # /sun  (Realm)
│   ├── moon/+page.svelte    # /moon (Realm)
│   ├── land/+page.svelte    # /land (Realm)
│   └── sea/+page.svelte     # /sea  (Realm + 단상)
└── works/+page.svelte       # /works = Wonnit (라이트 Grove 테마)
```

## 핵심 파일

- `src/lib/components/Cosmos.svelte` — **우주 전체**(가장 큰 파일). 별·은하수·천체·확대·자전·감사의 별·글 카드 전부 여기.
- `src/lib/components/Realm.svelte` — 천체 페이지 공용 템플릿 (제목·테마·시 한 줄·Wonnit 링크)
- `src/lib/cosmos/stars.ts` — `makeStars`(균일), `makeBandStars`(은하 프레임 좌표, y=50 중심선 둘레)
- `src/lib/cosmos/gratitude.ts` — **감사의 별 데이터** (좌표·이름·글). ← 진짜 내용 교체 지점
- `src/lib/cosmos/earth.ts` — 서버용 지구 land path (d3-geo orthographic, 정적)
- `src/lib/cosmos/earthClient.ts` — 클라용 지구 자전(확대 시 동적 import만)
- `src/routes/works/+page.svelte` — Wonnit 페이지

## 기술 메모 (안 잊으려고)

- **은하수**: NASA Deep Star Maps `milkyway_2020_4k_gal_print`(은하좌표계=직선 띠) → `static/milkyway.jpg`. CSS에서 rotate(-40deg), sepia+hue-rotate로 남보라, opacity 0.22, mix-blend screen, blur 없음.
- **별 정렬**: 별이 은하수와 같은 각도로 정렬되려면 **같은 회전 프레임(.galaxy-frame, rotate -40deg)** 안에 넣어야 함(% 좌표는 화면비에 따라 시각각도 달라지므로). 감사의 별도 .galaxy-frame, 라벨은 +40도 역회전.
- **태양/달**: 실제 텍스처 `static/sun.jpg`, `static/moon.jpg`(Solar System Scope, CC BY, 1024px). `background-size: 200% 100%` + `@keyframes surf { to { background-position-x: -200% } }` 스크롤로 자전. 극지 약간 늘어남(원통투영 한계).
- **지구**: d3-geo orthographic 진짜 구. 확대 시 earthClient 동적 import, RAF throttle 80ms로 천천히 자전.
- **확대 닫기**: `.zoom-backdrop`(바깥 검정) 클릭 → 우주. `.zoom-obj`에 clip-path: circle(50%)로 코너 통과. (← 우주 버튼은 제거됨)
- **배경**: 순수 검정 `#000` (`.stage`, `body.cosmic`). 빛바램 방지.
- **무텍스트**: 천체·별 호버 시 텍스트 없음, 점만 scale. 글은 별 클릭 시 카드로.

## 자산 & 출처 (README Credits에도 있음)

- 은하수: NASA/Goddard SVS Deep Star Maps 2020 (퍼블릭 도메인)
- 태양·달 텍스처: Solar System Scope (CC BY 4.0) — 출처 표기 필요
- 폰트: Pretendard Variable, Fraunces, Noto Serif KR

## ⚠️ 전부 placeholder — 진짜 내용 교체 필요

1. **감사의 별** — `src/lib/cosmos/gratitude.ts`의 10개 (어머니/바다/너 등 샘플). x,y(%)·name·note만 바꾸면 됨. y는 은하 프레임 기준(중심선 50 둘레), x는 42~58 피하면 태양과 안 겹침.
2. **Wonnit 작업** — `src/lib/content/works.ts` (언어/영어 학습 웹, 둘 다 "준비 중", URL 없음). href 채우면 활성화.
3. **천체 페이지** — `(dark)/sun|moon|land/+page.svelte`는 제목+시 한 줄뿐. `sea`만 단상 있음.
4. **연락처** — `src/lib/content/links.ts` (Instagram @won_cy_, naver blog, won_cy_@naver.com — 실제값 들어가 있음)
5. **이름/프로필** — `src/lib/content/profile.ts` (원채연/Won Chaeyeon)

## 다음 작업 후보 (평가 기반 우선순위)

1. **진짜 콘텐츠 채우기** — 가장 큰 미완성. 그릇은 완성, 내용이 비어 있음.
2. **무언(無言) 진입 펄스** — 처음 1회 천체 셋이 천천히 숨쉬어 "만져봐" 유도 (글자 없이). 발견성 문제 해결.
3. **모바일 점검** — 천체 탭은 OK, 감사의 별(작고 라벨 없음) 발견·탭 어려움.
4. (사소) 태양·달 극지 늘어짐 — 진짜 구 매핑은 WebGL 필요(과함).
5. 우주/천체 페이지 한국어 전용 (Wonnit만 한/영) — 다국어 원하면.

## 운영

- 빌드: `cd ~/projects/link && npm run build`
- 로컬: `npm run dev` (5173)
- 배포: `git push` → Vercel 자동
- 커밋 끝에 `Co-Authored-By: Claude ...`

## 설계 문서들 (옵시디언 vault: `link/`)

- `01-설계.md`, `02-Framer-가이드.md`(폐기 방향), `03-우주론-구조.md`
- 프리뷰 HTML들(`preview-*.html`)은 초기 Grove 타이포 버전(현재 우주와 무관, 참고용)
