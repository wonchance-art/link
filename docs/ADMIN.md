# 무대 뒤 (/admin) — 웹에서 글 쓰기

우주에 글을 심는 문. [Sveltia CMS](https://github.com/sveltia/sveltia-cms)(MIT) 기반 —
저장하면 GitHub `main`에 커밋되고, Vercel이 자동 배포한다.
**글이 우주에 도달하는 데는 1~2분의 빛의 시차가 있다.**

## 최초 1회 설정 (약 5분)

1. GitHub → Settings → Developer settings → **OAuth Apps** → New OAuth App
   - Application name: `Open Chaence Admin` (자유)
   - Homepage URL: `https://link-fnup.vercel.app`
   - **Authorization callback URL: `https://link-fnup.vercel.app/api/callback`**
2. 생성된 **Client ID** 확인, **Generate a new client secret**으로 시크릿 발급
3. Vercel → link 프로젝트 → Settings → **Environment Variables**에 추가 (Production·Preview 모두):
   - `GITHUB_CLIENT_ID` = (Client ID)
   - `GITHUB_CLIENT_SECRET` = (Client Secret)
4. 재배포(다음 커밋이면 자동) 후 `https://link-fnup.vercel.app/admin/` 접속 → **GitHub로 로그인**

## 쓰는 곳 — 우주의 자리

| 컬렉션 | 우주에서의 자리 | 형식 |
|---|---|---|
| 기록 — 토성의 서가 | /saturn 위성(흔적·샘·흐름·곁·품·심연·양면) | 마크다운 + 사진 |
| 원칙 — 목성의 법전 | /jupiter 위성(불·침묵·자립·견딤) | 마크다운 |
| 바다 — 흘러든 문장 | /sea | 문장 + 출처 |
| 은하 — 감사의 별 | 우주(/)의 별 | 이름 + 한 줄 + 좌표(%) |
| 풀숲 — Wonnit 작업 | /works | 제목·설명·링크 |

- 사진은 에디터에서 업로드 → `static/media/`에 커밋 → 글 안에 삽입됨
- 로컬에서 파일로 직접 써도 됨: `src/content/records/*.md` (frontmatter: `moon`, `date`, `title`)
- `/admin`은 어디에도 링크되지 않은 숨은 문이며, robots에서 제외됨

## 구조 (개발자 메모)

- 콘텐츠: `src/content/` — records·principles(.md 폴더), inflows·gratitude·works(.json)
- 사이트 로더: `src/lib/content/records.ts`(글롭+frontmatter+marked), 각 .ts는 JSON 재수출
- OAuth: `src/routes/api/auth`(인가 리다이렉트) + `api/callback`(토큰 교환, postMessage 규약)
