---
title: Framer 가이드 — Open Chaence
created: 2026-06-05
---

# 1. 콘텐츠 (Framer에 복붙)

## Hero

**Name**
- ko: `원채연`
- en: `Won Chaeyeon`

**Subtitle (사이트 우산, 양 언어 공통)**
- `Open Chaence`

**Tag**
- ko: 글을 쓰고 읽으며 언어를 공부합니다. 사람과 자연, 그리고 사람과 사람 사이의 **깊은 연대**에 마음이 머뭅니다.
- en: I write and read; I study language. My heart lingers in **the quiet bonds** between people and nature, between people and people.

**Meta column (우측 잡지 정보)**
- Place: `부산, 대한민국` / `Busan, KR`
- Field: `글 · 언어` / `Writing · Language`
- Updated: `2026.06`

---

## About

- ko: 천천히 읽고 천천히 씁니다. 풀잎 위에 비친 하늘처럼, 글도 여러 결이 어우러지기를 바랍니다. 한국어와 영어, 그 사이의 옅은 그늘을 들여다보며 매일 한두 문장을 옮겨 적습니다.
- en: Slowly I read, slowly I write — I hope the words gather many layers, like a sky reflected on grass. Between Korean and English, and the soft shade between, I copy a sentence or two each day.

라벨: `소개 About` / `About 소개`

---

## Now

**Updated label**: `6월 5일` / `June 5`

**Body**
- ko: 부산살이중. 저녁 산책길에 마주친 노을이 오래도록 따라옵니다.
- en: Living in Busan. The sunset I met on an evening walk stays with me for a long while.

라벨: `지금 Now` / `Now 지금`

---

## Works (본인 사이트들, 외부 링크 + featured 첫 카드)

**1. (Featured)**
- ko: `언어 학습 웹` — *여러 언어를 천천히 익히는 방식을 모은 작은 노트.*
- en: `Language learning` — *A small notebook of slow ways to learn languages.*
- date: `준비 중` / `coming soon`
- URL: (진행 중, 비워둠)

**2.**
- ko: `영어 학습 웹` — *영어 문장을 글쓰기로 익혀 가는 일지.*
- en: `English learning` — *A journal of learning English through writing.*
- date: `준비 중` / `coming soon`
- URL: (진행 중)

라벨: `작업 Works` / `Works 작업`

---

## Elsewhere

| label | meta | href | icon |
|---|---|---|---|
| Instagram | `@won_cy_` | https://instagram.com/won_cy_ | camera (line) |
| Blog | `naver blog` | https://blog.naver.com/won_cy_ | pen (line) |
| Email | `won_cy_@naver.com` | mailto:won_cy_@naver.com | envelope (line) |

라벨: `그 외 Elsewhere` / `Elsewhere 그 외`

---

## Footer

- Brand: `Open Chaence` (Fraunces italic 28px)
- Copy: `© 2026 · chaeyeon`
- Lang toggle: 한국어 · EN
- 3색 점: 그린(`#4E6B4A` 75%) · 블루(`#4A6B7A` 65%) · 그레이(`#98A19B` 50%)

---

## SEO/OG

- Title: `{name} — Open Chaence`
- Description: tag 본문 (마크다운 제거)
- OG image: 1200×630, eyebrow `OPEN CHAENCE` + 거대 name + tag + `풀숲 · 하늘 · 연못` + 3색 점
- Theme color: `#E5EDDF` (light) / `#1F2A2A` (dark)

---

---

# 2. 디자인 가이드 — Grove 톤 + 시각 자산 추가

## 컬러 시스템 (Framer Color Tokens에 등록)

### 액센트
- `#4E6B4A` — 메인 모스 그린
- `#2F4A3B` — 깊은 풀잎 (강조)
- `#4A6B7A` — 연못 (보조 블루)
- `rgba(78, 107, 74, 0.20)` — 옅은 그린 (호버 그림자)

### 배경 워시 (그라데이션 4축 부유)
- `#E5EDDF` — 풀밭 (메인)
- `#DCE6EC` — 하늘
- `#E3E8EC` — 옅은 연못
- `rgba(122, 153, 110, 0.30)` — 부유 spot 1 (그린)
- `rgba(106, 137, 158, 0.30)` — 부유 spot 2 (블루)

### 잉크
- `#1F2A2A` — 본문 (순검정 아닌 그린-블루 끼)
- `#586863` — 보조
- `#98A19B` — 메타

### Surface
- `#FBFAF6` — 카드 (또는 `rgba(251, 250, 246, 0.55)` + backdrop-blur)

### 라인
- `rgba(31, 42, 36, 0.08)`

---

## 폰트 (Framer에 추가)

| 용도 | 폰트 | 비고 |
|---|---|---|
| 한글 본문/이름 | **Pretendard Variable** | weight 380~720 가변 |
| 영문 italic, brand | **Fraunces Variable** | opsz 14~144, ital + wght |
| 한글 serif fallback | **Noto Serif KR** | 400~700 |

**더 distinctive 가고 싶으면** (유료/무료 distinctive):
- Editorial New (잡지 무드)
- GT Sectra Fine (무료 weight)
- Migra (대안 serif variable)

---

## 레이아웃 청사진 (잡지 표지 비대칭)

### Hero
```
┌─────────────────────────┬──────────┐
│                           │ Open Chaence │
│   원채연                  │ ─        │
│   (clamp 56-116px)        │ 부산, 대한민국 │
│                           │ 글 · 언어  │
│   글을 쓰고 읽으며…        │ 2026.06  │
│   (16px, max 460px)       │ ─        │
│                           │ ● ● ●    │
└─────────────────────────┴──────────┘
        1fr (좌)              140px (우)
```

**Section rhythm** — Hero 후 큰 호흡 → About → Now → Works (96px ↑) → Elsewhere (48px ↑) → Footer (128px ↑)

### Cards
- **Works**: padding 22px24px, radius 14px, 좌측 그린 strip 1px (호버 2px) / **첫 카드** featured — padding 30px32px, title 22px
- **Elsewhere**: padding 12px16px, radius 12px, 좌측 블루 strip (절제)
- 글래스모피즘: `rgba(251, 250, 246, 0.55)` + `backdrop-filter: blur(12-18px) saturate(140-160%)`

---

## 시각 자산 추가 가이드 — *여기가 핵심*

우리 SvelteKit 사이트와 차이가 나는 결정적 부분.

### 1. Hero에 시각 자산
**위치 옵션**:
- 우측 메타 column 위에 작은 일러스트
- 좌측 name 옆 큰 추상 이미지
- 좌상단 모서리 작은 마크/사인
- 배경에 큰 일러스트 (Hero 뒤에 배치, opacity 낮춤)

**무드**: 자연 모티프
- 풀잎 / 수면 반사 / 새 / 책 펼친 모양 / 손글씨

### 2. 시그니처 그래픽
- **Open Chaence 로고/마크** — 현재 그린 점 favicon보다 distinctive
- **본인 사인** — 손글씨 SVG (이름 또는 'oc' 모노그램)
- **풀잎/물결 SVG 모티프** — Hero 옆 또는 sect 사이 ornament

### 3. 사진
- **본인 사진** (작게, 모노톤 또는 그린 cast) — Hero 우측 또는 Footer
- **풍경 사진** — 부산 바다, 숲, 책상, 노트 (자연 톤)
- **Now 영역** — 매주/매일 작은 사진 한 장

### 4. 패턴/텍스처
- **noise/grain** — 현재 우리 사이트도 있음 (강화)
- **paper texture** — 종이 질감, opacity 낮게
- **워터컬러 wash** — 모네 식 부드러운 색 번짐

### 5. 모션 (Framer 강점)
- Hero name 글자별 stagger entrance (이미 우리도)
- 스크롤 시 배경 색 시프트
- 카드 호버 spring/3D tilt
- 페이지 전환 cross-fade
- **Lottie 애니메이션** — 작은 일러스트 motion (자연 모티프)

---

## 시각 자산 출처 (무료 + 유료)

### 일러스트 (무료)
- [blush.design](https://blush.design) — 자유로운 일러스트 mixer
- [undraw.co](https://undraw.co) — 컬러 변경 가능, 그린 톤 추출 가능
- [openpeeps.com](https://www.openpeeps.com) — 사람 일러스트
- [illustrations.co](https://illustrations.co)

### 사진 (무료)
- [unsplash.com](https://unsplash.com) — 검색: `Korean nature`, `Busan`, `water lily`, `forest`, `quiet`, `journal`
- [pexels.com](https://pexels.com)

### 아이콘
- [lucide.dev](https://lucide.dev) — 우리 코드의 line icon 출처 비슷
- [tabler-icons.io](https://tabler-icons.io)

### 패턴/텍스처
- [heropatterns.com](https://heropatterns.com)
- [svgbackgrounds.com](https://svgbackgrounds.com)
- [transparenttextures.com](https://www.transparenttextures.com) — paper, grain

### Distinctive 폰트
- Editorial New (Pangram Pangram, 유료/체험판 무료)
- GT Sectra Fine (Grilli Type, 무료 1 weight)
- Migra (PP, 유료/체험판 무료)
- Bagoss Standard

### 본인이 그리기 (가장 좋음)
- iPad Procreate
- Figma 단순 SVG
- 종이 → 스캔 → SVG 변환

---

## Framer 작업 순서

1. **새 site** → Blank canvas
2. **Color Tokens** 등록 (위 컬러 코드)
3. **Fonts** 추가 (Pretendard + Fraunces + Noto Serif KR)
4. **Hero**: 좌 거대 name + 우 메타 + 시각 자산
5. **5개 Section** (About / Now / Works / Elsewhere / Footer)
6. **Motion**: Framer transitions + scroll effects + (선택) Lottie
7. **Breakpoints**: Desktop / Tablet / Phone — 모바일은 stack
8. **Locales** 한국어/영어 (Framer i18n)
9. **SEO/OG** Framer Site Settings
10. **Publish** → `xxx.framer.website` 받음

---

## 우선순위 (시간 적을 때 이것만)

가장 임팩트 큰 3가지:

1. **Hero에 일러스트 한 장** — 자연 모티프 (풀잎/수면/책)
2. **Distinctive 폰트 1개 교체** — Fraunces → Editorial New 또는 GT Sectra
3. **시그니처 그래픽** — Open Chaence 로고/마크 (현재 점보다 풍부)

이 3가지만으로 디자이너 어필 측면이 한 단계 위.

---

## 우리 사이트는?

- 그대로 둠 — https://link-fnup.vercel.app 살아있음
- Framer 만족 시 도메인 이전 결정 (도메인 살 때)
- GitHub 레포는 archive 또는 그대로 (백업 가치)
