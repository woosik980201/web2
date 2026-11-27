# ★ 기말과제 — SSIKHIVE React 코드 해설

SENSORY ARCHIVE(직접 디깅해 기록한 시각·소리 레퍼런스)를 React 함수형 컴포넌트로 보여 주는 사이트다.
레퍼런스를 **모아 보는 Archive**와, 같은 레퍼런스 위를 **걸어 다니는 Stage** 두 페이지로 되어 있다.

> 이 폴더의 코드는 Claude가 초안 전체를 작성했다(2026-11-26). 아래 "직접 설명할 수 있어야 하는 부분"을 먼저 공부하고,
> 바꾼 부분은 맨 아래 AI 활용 기록에 적어 둘 것.

## 0. 1학기 SSIKHIVE와의 관계 (2026-11-26 결정: 본인)

교수님이 "이어서 해도 되고 새로 만들어도 된다"고 하셨다. 그래서 **이름(SSIKHIVE)만 잇고 구성은 새로** 짰다.

| 1학기 것 | 처리 | 이유 |
|---|---|---|
| 디자인(흰 둥근 카드, 검정 버튼, 분홍 하트) | 버림 | 지금 취향과 맞지 않음. SENSORY ARCHIVE의 시각 언어로 통일 |
| Selected Platforms · Curated Reads · Youtube Picks (7개 출처) | 뺌 | 찾아보는 "곳"의 목록이라, 찾아낸 "것"을 기록하는 SENSORY ARCHIVE와 성격이 달라 어울리지 않음 |
| Currently Into | 뺌 | "요즘 듣고, 입고, 보러 가는 것"은 디깅해 모은 레퍼런스와 성격이 달라서. 모든 기록을 Digging Log 하나로 모음 |
| 기능: 분야 필터 · 검색 · ♡ 저장(새로고침 유지) · 상세 보기 · 다크 모드 | 유지 | React로 다시 구현. ♡ 저장은 **Dive in**(더 파고들 것 고르기)으로 이름과 쓰임을 바꿈 |
| Hero 이미지(생성형) | 교체 | Higgsfield(Nano Banana 2)로 새로 만든 재료 정물 이미지. SA 콜라주는 카드와 시각적으로 겹쳐서 제외 (2026-11-26 결정: 본인) |

중간에 만들었던 Collage 페이지(저장한 것으로 콜라주 만들기)도 뺐다. 왜 있어야 하는지 설명이 약했고, 콜라주 느낌은 Stage 무대가 이미 보여 준다.

## 1. 실행

```bash
npm install react-router-dom@6   # 처음 한 번
npm start                        # http://localhost:3000
```

`src/index.js`가 `FinalApp`을 그린다. 다른 주차 실습을 보려면 `index.js`의 import만 바꾸면 된다.

## 2. 페이지 2개

| 주소 | 페이지 | 하는 일 |
|---|---|---|
| `/` | Archive | 레퍼런스 9개를 Digging Log 목록으로 보기, 분야 필터·검색, ＋ Dive in으로 고르기, "Dive in"만 보기, 상세 보기 |
| `/stage` | Stage | **Archive에서 Dive in으로 고른 기록만** 올라오는 무대(고른 게 없으면 전체 + 안내). "전체"로 바꿔 볼 수도 있음. 방향키로 걷고 Enter(또는 클릭)로 상세 보기 — 14장 무대를 고치지 않고 가져옴 |

- 머리글의 `dive in NN`을 누르면 Archive가 "Dive in" 보기로 열린다 (`<Link to="/" state={{ view: "saved" }}>`).
- 상세 보기는 두 페이지 모두 같은 `DetailModal` 하나. Archive에서 열면 "무대에서 보기 →"가 붙고, Stage 안에서는 붙지 않는다.
- 예전 주소 `/sensory`는 `/stage`로, `/collage`는 `/`로 넘어간다(`Navigate`). 없는 주소는 404 안내.

## 3. 폴더 구조

```
src/final/
├─ FinalApp.jsx            라우터, 저장 목록(savedIds)과 테마(theme) state
├─ styles/tokens.css       디자인 토큰 (색·글꼴·크기·간격·그림자·기울기) — 값은 여기만
├─ styles/final.css        컴포넌트 스타일 (색 값 없이 var(--...)만 사용)
├─ utils/tilt.js           id로 늘 같은 기울기·어긋남 계산
├─ context/ThemeContext.jsx
├─ data/references.js      SA 레퍼런스(14장 archiveData를 import해 변환), 섹션 1개, 분야 5개, 권리 상태
├─ components/
│  ├─ layout/   Layout(틀) · Header · Footer(세 칸) · Intro(첫 방문 인트로)   ← 두 페이지 공통
│  ├─ common/   FilterChips · ReferenceCard · DetailModal · NodeTag · ParamsPanel · UndoToast   ← 여러 곳에서 공통
│  └─ archive/  Hero · ReferenceSection · AddEntryForm(새 기록 폼)
├─ pages/  ArchivePage · StagePage
└─ assets/ hero.jpg — Higgsfield 생성형 이미지(2026-11-26, 1600px로 줄임) · intro.mp4 — Higgsfield 생성형 영상. SA 이미지는 src/14/archive/images를 그대로 씀
```

## 4. 레퍼런스 데이터

모든 기록(SA-001 ~ SA-009)이 **Digging Log** 한 섹션에 들어간다. 이 사이트는 직접 디깅해 모은 레퍼런스를 수집하는 곳이라 성격이 다른 묶음이 없다.

한 항목의 모양:
```js
{ id, section, domain, title, description,
  images: [{ src, caption }],   // 첫 장이 대표 이미지, 상세 보기에서는 전부
  link,
  rights,                       // "public-domain" | "unverified"(출처 확인 필요)
  rightsNote,                   // 시트에 적힌 원래 문구
  archive: { why, question, captured } }  // 내가 직접 쓴 문장만
```

- `src/14/archive/archiveData.js`를 **import**해서 위 모양으로 바꾼다. 복사하지 않으므로 SA 기록을 고치면 Archive·Stage·상세 보기가 함께 바뀐다.
- SA-010을 archiveData.js에 추가하면 references.js는 고치지 않아도 Archive·Stage에 함께 나온다.
- 섹션 구조(`sections` 배열 + `ReferenceSection`)는 남겨 뒀다. 나중에 성격이 다른 묶음이 생기면 배열에 한 줄만 추가하면 된다.
- 시트의 memo·connection_note는 넣지 않았다(본인 문장과 AI 정리가 섞여 있어서).
- 권리: SA-001만 Public domain(시트 기재). 나머지는 "출처 확인 필요". 2026-11-27부터 상세 보기에는 권리 문구를 띄우지 않고(데이터의 `rights`·`rightsNote`와 `CREDITS.md`에는 그대로 있음), 꼬리글 한 줄로 대신한다. `hero.jpg`는 Higgsfield로 만든 생성형 이미지(프롬프트·후보 8장은 Drive `학교작업_원본/_from_Claude/2026-11-26/SSIKHIVE_hero_drafts`).
- 예전에 저장한 id(1학기 jente, drake …)는 앱이 처음 열릴 때 걸러 낸다.

### 페이지에서 바로 기록 추가하기 (2026-11-26 결정: 본인)

원래는 구글 시트에 레퍼런스를 적고, 그걸 코드(archiveData.js)로 옮겨야 사이트에 보였다. 이제 Archive의 **＋ New entry** 폼에 적으면 Digging Log에 바로 카드가 생기고 Stage 무대에도 올라간다. "보고 끌린 것을 그 자리에서 기록한다"는 이 프로젝트의 출발점을 사이트 안에서 보여 주기 위한 기능.

- 폼의 칸 = 시트의 칸 (domain, title, credits, url, captured, why_drawn, digging_question, 이미지)
- 이미지: 파일 올리기(브라우저에서 긴 변 900px JPG로 줄여 저장) 또는 이미지 주소. 기록당 3장까지
- 저장 위치: 이 브라우저의 `localStorage`(`ssikhive-entries`). **구글 시트는 읽지도 쓰지도 않는다**(시트 읽기 전용 원칙 유지)
- 번호는 자동(`nextId`: 가장 큰 번호 + 1 → SA-010), 무대 위치도 자동(`stageSpotFor`: 기존 조각을 피한 빈자리 6곳)
- 분야(Domain)를 직접 적어 늘리기 (2026-11-27 요청: 본인 — "보기에 없는 도메인을 직접 입력하면 자동으로 추가되게"):
  - 폼의 Domain 칸을 고르기 전용(`select`)에서 **고르거나 직접 적는 칸**으로 바꿨다. 처음엔 브라우저 기본 목록(`datalist`)을 썼는데 흰 둥근 상자라 사이트와 어울리지 않고 CSS로 바꿀 수도 없어서, 목록을 직접 그렸다(`domainOpen` state, 적는 글자로 거르기, `onMouseDown`의 `preventDefault`로 포커스 유지)
  - 분야 목록을 따로 저장하지 않는다. `domainsOf(entries)`가 기록에서 분야를 뽑아 필터 목록을 만든다(파생 데이터). 그래서 새 분야로 기록을 저장하면 Archive·Stage 필터와 Hero의 Domains에 자동으로 생기고, 그 분야의 기록이 다 지워지면 자동으로 사라진다
  - `normalizeDomain`: 앞뒤 공백을 떼고 소문자로 맞춘다 → "Design"과 "design"이 두 분야로 갈라지지 않는다. "all"은 전체 보기 자리라 분야 이름으로 못 쓴다
  - 한계: 새 분야의 NodeTag는 모두 TOP으로 나온다(CHOP은 music만). 소리 계열 분야를 더 만들면 `operatorOf`에 추가해야 한다
- 고치기 (2026-11-27 요청: 본인 — "수정 기능도 넣어줘"):
  - 상세 보기의 "수정" → 그 기록 내용이 채워진 폼이 열린다. **새 기록 폼과 같은 컴포넌트**(`AddEntryForm`)에 `initial` props만 넘긴 것
  - 직접 추가한 기록은 저장 목록에서 바꿔 넣는다. 기본 9개는 고친 칸만 `edits`(`ssikhive-edits`)에 따로 저장해 화면에서 덮어쓴다 (14장 데이터 파일은 그대로)
  - 고친 기본 기록은 수정 폼의 "원래대로"로 처음 내용으로 돌아간다
  - 고친 내용은 Stage의 상세 보기에도 그대로 나온다 (같은 entries를 쓰므로)
  - 저장하면 그 카드로 스크롤하고 `edited` 표시가 잠깐 붙는다 (추가할 때의 `new` 표시와 같은 장치: `flag` props)
- Enter로 저장되지 않게 (2026-11-27, 본인이 발견한 문제: 줄바꿈하려고 Shift+Enter를 눌렀더니 그대로 저장됨): 브라우저는 한 줄 입력칸(`input`)에서 Enter를 누르면 폼을 제출한다. `form`의 `onKeyDown`에서 input의 Enter를 `preventDefault`로 막고, 저장은 버튼으로만 하게 했다. Next question 칸은 여러 줄(`textarea`)로 바꿨고, 적은 줄바꿈은 상세 보기에 그대로 보인다(`white-space: pre-line`). 여러 줄 칸의 높이는 내용에 맞춰 자동으로 늘고 줄어든다(`useRef` + `scrollHeight`) — 고정 높이일 때 글 아래에 지울 수 없는 빈 줄처럼 보이던 공간을 없앰(본인 지적)
- 지우기 (2026-11-27 결정: 본인 — "삭제 기능도 있으면 좋겠다", 기본 9개도 지울 수 있게, 확인과 되돌리기 둘 다):
  - 상세 보기의 "기록 지우기" → "정말 지울까요? 지우기 / 취소"로 한 번 더 묻는다 (`DetailModal`의 `confirming` state)
  - 지운 직후 화면 아래에 7초 동안 "되돌리기"가 뜬다 (`UndoToast`, `setTimeout` + cleanup)
  - 직접 추가한 기록은 저장 목록에서 실제로 빠진다. 기본 9개는 14장 데이터 파일을 건드리지 않고 `hiddenIds`(`ssikhive-hidden`)에 넣어 이 브라우저 화면에서만 숨긴다
  - 숨긴 기본 기록은 필터 아래 "지운 기록 N개 되돌리기"로 언제든 전부 복구된다 → 발표 중 실수해도 원래대로
  - 지운 기록은 Stage 무대와 Dive in 목록에서도 함께 빠지고, 되돌리면 Dive in 상태까지 돌아온다
- 자동으로 채우기 (2026-11-27 결정: 본인 — 후보 A·B를 "바로 적용"):
  - 링크 자동 채움: Link 칸에 YouTube·Vimeo 주소를 넣으면 0.6초 뒤 그 사이트의 공개 정보 주소(oEmbed)에 `fetch`로 물어 제목·제작자를 받아 온다. **빈 칸에만** 채우고, 이미 적은 내용은 덮어쓰지 않는다. 썸네일은 "썸네일을 이미지로 쓰기"를 눌러야 들어간다(주소로 저장, 권리 미확인)
  - `useEffect([form.url])` + `setTimeout`(입력 멈춤 기다리기) + cleanup의 `clearTimeout`·`cancelled`(늦게 온 옛 응답 무시). 수정 폼을 열 때는 다시 불러오지 않는다(`checkedUrl` ref)
  - 불러오지 못해도 폼은 그대로 쓸 수 있고, 안내 한 줄만 뜬다. 분야는 YouTube Music 주소일 때만 `music`으로 짐작한다(그냥 YouTube는 영상인지 음악인지 알 수 없음)
  - 이미지 넣는 길 세 가지가 `addFiles` 함수 하나로 모인다: 파일 고르기 / Ctrl+V 붙여넣기(`onPaste`, 글자 붙여넣기는 건드리지 않음) / 끌어다 놓기(`onDragOver`·`onDrop`)
  - "왜 끌렸나"는 자동으로 채우지 않는다 — 사람이 쓰는 칸
  - 붙인 이미지 크게 보기 (2026-11-27, 본인 제안: "이미지를 클릭하면 크게 볼 수 있으면 좋겠다"): 폼의 작은 이미지를 누르면 화면 가득 뜬다(`common/ImageViewer`). 어떤 이미지를 보는지(`viewing`)는 폼이 state로 갖고 뷰어는 props로 받아 그린다. ESC·바탕 클릭으로 닫고 ←/→로 넘긴다(`useEffect`에서 키 이벤트 등록, cleanup에서 해제). 뷰어를 폼 바깥에 그려서 ESC가 폼까지 닫지 않는다
  - 확인 필요: `fetch`로 외부 데이터를 불러오는 패턴이 수업에서 다룬 범위인지. 2026-11-27에 학교 PC `localhost:3000`에서 YouTube·Vimeo oEmbed가 키 없이 호출되는 것은 확인함
- 아직 만들지 않은 것 (2026-11-27, 본인 판단):
  - 구글 시트 읽어 오기 — 하지 않기로. 시트는 손으로 정리하면서 불편한 점과 실제로 쓰는 기능·안 쓰는 기능을 가려내려고 쓰는 것이라, 페이지와 연결할 이유가 없음
  - 기록 내보내기·가져오기 — 나중에 배포할 때 로그인해서 각자 기록을 남기는 방향으로 (구현 안 됨)
  - AI 정리 도우미 — 날것의 감상은 유지하되 정돈해 주고, 해석·기법을 물으면 설명해 주는 기능이 어느 정도 필요하다고 봄. 기록이 숙제처럼 느껴지지 않게 하려는 것 (구현 안 됨, 서버 필요)
- 한계: 다른 컴퓨터·브라우저에서는 안 보인다. 저장 공간이 약 5MB라 사진이 많으면 가득 찬다(가득 차면 안내하고 추가하지 않음). 진짜로 어디서나 보이게 하려면 서버·DB가 필요하다 — 이번 과제 범위 밖

## 5. 데이터와 state가 흐르는 길

```
FinalApp ─ 기본 9개(− hiddenIds로 숨긴 것, + edits로 고친 것) + customEntries(직접 추가한 기록) = entries → references
         ─ addEntry / updateEntry / resetEntry / deleteEntry / undoDelete / restoreHidden → ArchivePage → AddEntryForm · DetailModal(지우기 확인) · UndoToast(되돌리기)
         ─ savedIds, toggleSave ─┬─ Layout → Header (dive in 개수, 누르면 "Dive in" 보기)
         ─ theme (Context) ──────┤
                                 ├─ ArchivePage → ReferenceSection → ReferenceCard (＋ Dive in = toggleSave)
                                 │             └→ DetailModal
                                 └─ StagePage(savedIds) → 고른 기록만 거름 → CollageStage(14장) ─ Enter → DetailModal
```

- **기록 목록(customEntries)도 FinalApp에 둔 이유:** Archive(목록·추가)와 Stage(무대)가 같은 기록을 써야 한다. 추가하면 두 페이지에 함께 나타난다.
- **AddEntryForm의 state:** 입력칸 값은 폼 안에만 있다(제어 컴포넌트: `value` + `onChange`). 제출할 때만 `onAdd`로 부모에게 넘긴다. 입력 함수 하나(`handleChange`)가 `name` 속성으로 모든 칸을 처리한다.
- **savedIds를 FinalApp에 둔 이유:** Archive(고르기·Dive in 보기), Stage(무대에 올릴 기록), Header(개수) 세 곳이 같은 값을 쓴다. 공통 부모에 두고 props로 내려 준다(state 끌어올리기).
- **view·domain·query·openItem은 ArchivePage 안에:** Archive만 쓰는 값이라서.
- **분야 목록도 state가 아님:** 기록(entries)에서 계산한다(`useMemo`). 기록과 분야 목록을 따로 저장하면 둘이 어긋날 수 있다.
- **filtered는 state가 아님:** 보기·분야·검색어에서 그릴 때마다 계산한다. 따로 저장하면 원본과 어긋날 수 있다.
- **theme는 Context:** 14장 무대까지 거의 모든 곳이 색을 알아야 해서 props 대신 Context로 나눠 준다.
- **localStorage:** 저장 목록과 테마는 새로고침해도 남는다. `useState(() => ...)`로 처음 한 번만 읽고 `useEffect`로 바뀔 때마다 쓴다.
- **Dive in (2026-11-26 결정: 본인):** 원래는 ♥ 저장이었지만, 여기 모인 기록은 이미 모두 좋아서 모은 것이라 "저장"은 같은 말을 한 번 더 하는 셈이었다. 그래서 "이 중에서 더 파고들 것을 골라 무대에 올린다"는 실제 쓰임대로 **Dive in**이라 부른다. 고른 기록 → Stage에 올라감 ("Archive에서 고르고, Stage에서 걸어 들어가 본다"). 0개면 빈 무대가 되지 않게 전체를 보여 준다.
- **화면 글자는 바꾸고 코드 이름(savedIds, ssikhive-saved)은 그대로 둔 이유:** 하는 일(목록에 넣고 빼기)은 같고, localStorage 키를 바꾸면 이미 고른 기록이 사라진다. 사용자에게 보이는 말과 코드 안의 이름은 따로 관리할 수 있다.
- **Stage의 useMemo와 key:** 무대는 `entries`가 바뀔 때마다 장면을 다시 계산하므로, 거른 배열을 `useMemo`로 고정했다. 올릴 기록이 바뀌면 `key`를 바꿔 무대를 새로 세운다(인물 위치·들른 경로 초기화).
- **Stage의 paused:** 상세 보기가 열려 있는 동안 무대의 방향키를 멈춘다(`paused={openId !== null}`). 안 그러면 창 뒤에서 인물이 걷는다.

## 6. 재사용을 보여 주는 코드 (발표·보고서용)

| 컴포넌트 | 쓰이는 곳 | 바뀌는 것 (props) |
|---|---|---|
| `DetailModal` | Archive 카드 클릭, Stage의 Enter·클릭 | `item`, `onClose`, `showStageLink`, `onEdit`, `onDelete` (Stage에서는 수정·지우기 없음) |
| `AddEntryForm` | 새 기록 추가, 있는 기록 수정 | `initial`, `onSubmit`, `onReset` |
| `FilterChips` | Archive 보기(전체/Dive in)·분야, Stage 보기(Dive in/전체)·분야 (4곳) | `options`, `value`, `onChange` |
| `ReferenceSection` | Archive의 섹션 (지금은 Digging Log 하나) | `section`, `items` |
| `ReferenceCard` | 모든 섹션의 카드 | `activeLabel`/`inactiveLabel`, `onAction`, `onOpen`, `compact` |
| `NodeTag` | 카드, 상세 보기 | `domain`, `id` |
| `ParamsPanel` | Archive (view·domain·query·results·dive in), 인트로 (in·op·out·t) | `title`, `rows` |
| `Layout`·`Header`·`Footer` | 두 페이지 | `savedCount` |
| `CollageStage` | 14장 → 기말과제 Stage | 고치지 않고 import |
| `domainsOf(entries)`로 만든 분야 목록 | Archive 필터, Stage 필터, 폼의 Domain 목록, Hero의 Domains | 같은 배열 (FinalApp에서 한 번 계산해 내려 줌) |

비교 사례:
- 1학기 `index.html`은 카드 HTML을 하나씩 손으로 반복해 적었다 → 지금은 `references` 배열 + `map`.
- 1학기 상세 모달은 jQuery로 카드 안의 글자를 읽어 옮겼다 → 지금은 데이터(item)를 props로 받아 그린다.
- 14장 무대는 자체 상세 화면(EntryDetail)이 있었다 → 기말과제에서는 Archive와 같은 `DetailModal`로 통일. 같은 기록이 어디서 열리든 같은 모양.

## 7. 디자인 시스템 — 종이 · 조각 · 노드

**2026-11-26 수정 (결정: 본인):** 참고 사이트 Future Bless Studio(fbs-workshop.pages.dev)의 **뼈대만** 가져왔다. 종이 바탕과 사진 조각은 그대로 둔다.
- 가져온 것: Helvetica 계열 글꼴, 화면 폭을 채우는 큰 이름(wordmark) + 색 있는 부제, 가는 선(1px), "라벨: 값" 격자(Hero의 facts), 목록 한 줄 같은 섹션 머리(`Section 1 | 큰 제목 | 개수`), 네 칸 꼬리글, 첫 방문 인트로(검은 화면 타이핑 + SKIP)
- 안 가져온 것: 검은 배경, 분홍 강조색, 이미지 없는 구성
- 바꾼 것: 버튼·칩·메뉴의 기울기를 없앰(글자와 구조는 반듯하게, 기울기는 사진 조각에만). 메타 글자는 모노 → 산세리프. 모노는 노드 층(NodeTag·파라미터 창·무대)에만 남김
- 인트로는 사이트를 새로 열 때마다(새 탭·새 창) 한 번 나온다. 본 적을 `sessionStorage`에 적어서, 같은 탭의 새로고침·페이지 이동에서는 다시 안 나온다. 처음엔 `localStorage`라 한 번 본 뒤로 영영 안 나왔다(2026-11-27 본인 지적으로 변경). 주소 끝에 `?intro`를 붙이면 언제든 다시 볼 수 있다(발표용)
- `localStorage` vs `sessionStorage`: 둘 다 브라우저 저장소. localStorage는 지울 때까지 남고(Dive in 목록·직접 추가한 기록·테마), sessionStorage는 탭을 닫으면 사라진다(인트로를 봤는지)
- 인트로 영상(최종, `assets/intro.mp4`): Hero 이미지를 첫 장면으로 Higgsfield(Seedance 2.5)로 만든 6초 무음 영상. 실물 재료가 제자리에서 선·와이어프레임으로 바뀌고 바탕이 어두워진다. "The same material, a different shape"를 그대로 보여 주고, 아날로그 Hero와 노드 화면인 Stage를 잇는다. 가장자리 흰 여백은 잘라 냈다
- 만든 과정: ① 재료가 살짝 움직이는 영상 → ② GPT와 쓴 프롬프트로 "콜라주가 모이는" 영상 + 코드로 얹은 와이어 → ③ 본인이 "인트로와 Stage 효과가 안 어울린다"고 지적 → 재료가 와이어프레임으로 바뀌는 지금 영상. 시안 6개는 `다운로드\SSIKHIVE_hero_drafts`
- 영상 위에는 Stage와 같은 점 격자와 파라미터 창(`ParamsPanel` 재사용)을 코드로 얹었다
- 인트로가 떠 있는 동안 ESC = 건너뛰기, 방향키·Enter는 뒤의 Stage 무대로 전달되지 않게 막는다(`addEventListener(..., true)` capture + `stopImmediatePropagation`)

시각 언어는 SENSORY ARCHIVE(`src/14/archive/ArchivePage.css`)에서 가져왔다.

| 층 | 역할 | 코드 |
|---|---|---|
| 종이 | 모든 페이지의 바탕 | `--paper`, `--stage`, 점 격자 |
| 조각 | 레퍼런스 하나 = 사진 조각 | `.paper`(테두리 종이·테이프·그림자), 낮은 채도 `--photo-filter` |
| 노드 | 상태·분류·수치 | 모노 글꼴, `NodeTag`(TOP/CHOP), 단자, `ParamsPanel` |

결정한 것 (본인): 사이트 이름 SSIKHIVE(SENSORY ARCHIVE는 그 안의 아카이빙 프로젝트), 종이(라이트)로 시작, 콜라주 느낌에 무게(카드 기울기 ±3°, 높이 어긋남).
글꼴: 본문 Pretendard, 메타 정보 IBM Plex Mono (Claude 추천, 본인 채택).

강조색 규칙 — 색마다 의미 하나:
- `--tape` 청색: 내가 고른 것 (Dive in, 선택된 필터·메뉴)
- `--live` 연두: 지금 활성인 것 (Dive in으로 고른 카드의 단자, 바뀌는 값). 화면당 한두 곳
- `--op-top` 보라 / `--op-chop` 초록: 시각 자료 / 소리

일관성을 코드로 지키는 방법:
1. `tokens.css`에만 값이 있다. `final.css`에는 색 값이 없다 → `grep -c "#" final.css`로 확인 가능(0).
2. 14장 무대는 고치지 않고, `.ssik-app .archive-page.archive-page { --paper: inherit; … }`로 무대 변수가 공통 토큰을 따르게 했다.
3. 카드·히어로 사진·상세 보기·꼬리글 메모가 모두 `.paper` 클래스 하나를 공유한다.
4. 버튼은 두 종류뿐: `.stamp`(주요 동작, 화면당 하나) · `.tab`(나머지).

## 8. 직접 설명할 수 있어야 하는 부분 (우선순위)

1. `FinalApp.jsx`: `Routes`/`Route`의 중첩, `Layout`의 `<Outlet />`, `index` 라우트, `Navigate`, `path="*"`
2. `AddEntryForm.jsx`: 제어 컴포넌트(`value`/`onChange`), `event.preventDefault()`, 빈 값 검사, 부모로 값 올려 보내기(`onSubmit`), `initial` props 하나로 추가·수정 두 가지 일을 하는 방법, `key`로 폼 새로 만들기
2-1. `ArchivePage.jsx`: 조건 세 개를 합친 `filter`, 비어 있는 섹션을 거르는 `map` → `filter`, `useLocation`으로 받은 state
3. `DetailModal.jsx`: `useEffect` cleanup, `stopPropagation`, `showStageLink`로 같은 컴포넌트를 두 곳에서 다르게 쓰기, `useRef`로 열릴 때 포커스를 창 안으로 옮기고 닫힐 때 누른 카드로 돌려주기, 뒤 페이지 스크롤 막기
4. `ReferenceCard.jsx`: 데이터 하나로 카드 하나를 그리는 방법, `aria-pressed`
5. `Header.jsx`: `NavLink`의 `active`와 `end`, `Link`의 `state`
6. `StagePage.jsx`: 고른 기록만 거르기, `useMemo`, `key`로 무대 다시 세우기, `paused`, 분야 이름 맞추기(`"all"` ↔ `"전체"`)

수업 범위 밖이라 "가져다 쓴 것"으로 설명해도 되는 부분:
- `AddEntryForm.jsx`의 `shrinkImage`(FileReader·canvas로 사진 줄이기, Promise·async/await)
- `utils/tilt.js`의 해시 계산(id 글자로 숫자 만들기), CSS 변수에 값을 넣는 `style={{ "--tilt": ... }}`
- Stage 무대 전체(`src/14/archive`: `useRef`, canvas, `requestAnimationFrame`)
- `StagePage.jsx`의 `useCallback`(무대의 키보드 이벤트가 매번 다시 걸리지 않게 함수 고정)

## 9. 알려진 한계

- `hero.jpg`, `intro.mp4`는 생성형(Higgsfield). 화면 캡션에는 적지 않았으니 보고서 AI 활용 항목에 꼭 밝힐 것.
- `src/14/archive/images/SA-006_03.jpg`: 양옆·아래에 검은 띠가 들어간 채 저장돼 있어 잘라 냈다(2026-11-27, 본인 지적). 같은 날 SA-006 사진 두 장을 본인이 준 사진으로 바꾸면서 `SA-006_08.jpg`·`SA-006_09.jpg`를 넣고 `archiveData.js`의 SA-006 이미지·캡션 줄과 `CREDITS.md`를 고쳤다. 14장 폴더에서 손댄 건 이것뿐이고 무대 코드(`CollageStage.jsx`)는 그대로다.
- 레퍼런스 이미지(SA-002~009)는 권리 미확인. `src/14/archive/CREDITS.md` 참고. 공개 배포·보고서 캡처 전에 확인.
- Stage 무대는 키보드(방향키) 중심이라 휴대폰에서는 조각을 눌러서만 열 수 있다.
- `BrowserRouter`라 GitHub Pages에 올리면 새로고침 시 404가 날 수 있다(배포한다면 `HashRouter` 검토).
- 링크 자동 채움은 YouTube·Vimeo만 된다. 그 사이트가 응답 방식을 바꾸면 안내 문구만 뜨고 손으로 적어야 한다.
- 외부 링크, 글꼴(Pretendard·IBM Plex Mono CDN)은 인터넷 연결이 필요하다.

## 10. AI 활용 기록 (보고서용 — 사실만, 이후 계속 채울 것)

| 날짜 | 도구 | 요청한 것 | AI가 낸 것 | 채택 / 수정 / 제외 | 내가 정하거나 바꾼 부분 |
|---|---|---|---|---|---|
| 2026-11-26 | Claude | 과제 지침·두 저장소를 근거로 한 기획 검토 | 페이지 구성, 재사용 구조, 범위·위험 정리 | (기록할 것) | 무대 포함 결정, react-router 사용 결정 |
| 2026-11-26 | Claude | 기말과제 코드 초안 전체 | `src/final` 전체 코드·CSS, 이 해설 문서 | (기록할 것) | 초안 전체를 AI가 쓰도록 선택 |
| 2026-11-26 | Claude | 1학기 원본 화면 캡처 | 캡처 10장 | (기록할 것) | — |
| 2026-11-26 | Claude | SENSORY ARCHIVE와 통일된 디자인 시스템 | 기존 CSS 분석, 토큰 파일, 공통 컴포넌트 재디자인 | (기록할 것) | 1학기 디자인 폐기, 사이트 이름·종이 테마·콜라주 무게 결정 |
| 2026-11-26 | Claude | 레퍼런스·링크·이미지 최신화 | archiveData 확인, 데이터 구조 | (기록할 것) | hero는 생성형 이미지라고 알려 줌 |
| 2026-11-26 | Claude | 내 브라우저로 화면 점검, Hero 교체 | 좁은 화면 Hero·무대 패널·탭 제목 지적과 수정, SA 이미지 콜라주 Hero | (기록할 것) | 고칠 것 승인, SA 콜라주는 중복돼 보인다고 판단 → Higgsfield·Midjourney 후보 8장 중 Higgsfield 1번 선택 |
| 2026-11-27 | Claude | 폼에서 이미지 크게 보기 | ImageViewer 컴포넌트, 키보드(ESC·←/→)·바탕 클릭 닫기 구현 | (기록할 것) | 직접 기록을 쓰다가 필요를 발견하고 기능 제안 |
| 2026-11-27 | Claude | 링크 자동 채움 · 이미지 붙여넣기/끌어다 놓기 | 자동화 후보 5개 비교와 추천, oEmbed 호출·빈 칸에만 채우기·실패 처리 구현, 붙여넣기·끌어다 놓기 구현, 실제 호출 확인 | (기록할 것) | "자동화 기능을 추가한다면?" 질문, A·B 바로 적용 결정, 시트 연동은 필요 없다고 판단(이유 직접 설명), AI 정리 기능의 방향 제시 |
| 2026-11-27 | Claude | 상세 보기의 image rights 문구 빼기 | 화면에서는 빼고 기록(데이터 rights·CREDITS.md)은 남기자고 제안, 꼬리글 한 줄("Images are references for study. Rights belong to their owners.") 작성 | (기록할 것) | "image rights 문구 없애도 되지 않아?" 제안, 1·2·3안 모두 진행 결정 |
| 2026-11-27 | Claude | SA-006 사진 두 장 교체 | 올려 준 5장 중 2장 선택(나무 사이 길·돌계단), 검은 띠 자르기·크기 맞추기, 캡션 2줄 작성, 14장 archiveData.js의 SA-006 줄과 CREDITS.md 수정 | (기록할 것) | "사진이 다 비슷하다"고 지적, 대체할 사진 5장 직접 제공 |
| 2026-11-27 | Claude | 분야 목록 디자인·SA-006 이미지 | 직접 그린 목록(combobox), 검은 띠 자르기 | (기록할 것) | 목록이 사이트와 안 어울린다·이미지가 잘못 들어갔다고 지적 |
| 2026-11-27 | Claude | 분야 직접 추가 | select → input+datalist, 기록에서 분야 목록을 뽑는 구조, 대소문자 정리 | (기록할 것) | 기능 제안("다른 카테고리일 수도 있다") |
| 2026-11-27 | Claude | Digging Log 설명 문장 | 후보 5개와 이유 제안 | (기록할 것) | "아카이빙 성격과 안 맞는다" 지적, E안("References I dug up, and why they stayed.") 선택 |
| 2026-11-27 | Claude | Enter로 저장되는 문제 수정 | 원인 설명(input의 Enter = 폼 제출), 막는 코드, 줄바꿈 표시 | (기록할 것) | 직접 써 보다가 문제 발견·보고 |
| 2026-11-27 | Claude | 기록 수정 | 추가 폼을 수정에도 쓰도록 확장, 기본 기록은 덮어쓰기(edits)·원래대로 구현 | (기록할 것) | 수정 기능 요청 |
| 2026-11-27 | Claude | 기록 삭제 넓히기 | 범위·확인 방식 선택지 제안, 숨기기(hiddenIds)·확인·되돌리기·전체 복구 구현 | (기록할 것) | 삭제 기능 요청, 기본 9개도 삭제 가능·확인과 되돌리기 둘 다 넣기로 결정 |
| 2026-11-26 | Claude | 페이지에서 바로 기록 추가 | 방식 3가지 비교, 추가 폼·저장·번호·무대 위치·지우기 구현 | (기록할 것) | 아이디어 제안("시트 작업을 페이지에서 바로, 디깅 로그에 실시간 추가"), 페이지 안 저장·이미지 파일+주소 둘 다 선택 |
| 2026-11-26 | Claude | 전체 점검과 수정 | 화면·코드·과제 요건 점검표, 다크 모드 대비, 남은 코드 정리(compact·label·generated), 상세 보기 포커스·스크롤, 인트로 ESC·키 막기, 섹션 라벨 Index | (기록할 것) | 점검 요청, "고칠 것 다 고치고 추가하면 좋은 것도 추가" 결정 |
| 2026-11-26 | Claude | 인트로 영상 | Higgsfield(Seedance 2.5)로 6초 영상 시안 6개 생성·여백 자르기·압축·연결, GPT에 넘길 진행 상황 정리, 와이어프레임 전환 프롬프트 작성 | (기록할 것) | 인트로를 영상으로 만들자고 제안, 2차 프롬프트는 GPT와 직접 작성, "Stage와 안 어울린다" 지적 후 와이어프레임 버전 선택 |
| 2026-11-26 | Claude | ♥ 저장 → Dive in 이름 바꾸기 | 후보(Deep dive·On stage·Pin)와 이유 제안, 화면 글자 교체 | (기록할 것) | "모은 자료가 이미 좋아서 모은 거라 '저장한 것'이 안 어울린다" 지적, Dive in 직접 제안·결정 |
| 2026-11-26 | Claude | ♥ 저장한 기록만 Stage에 올리기 | 구현, 저장 0개일 때 대비(전체+안내), 전체 보기 전환 | (기록할 것) | 아이디어 제안: "하트 누른 레퍼런스들만 stage에 뜨게" |
| 2026-11-26 | Claude | Currently Into 제거 | 데이터·문서 정리 | (기록할 것) | "모두 디깅·수집 자료라 듣고 입고 보러 가는 것과 거리가 멀다"고 판단해 제거 결정 |
| 2026-11-26 | Claude | 참고 사이트(Future Bless Studio) 느낌 적용 | 사이트 구조·글꼴·색 분석, 뼈대만 옮긴 레이아웃, 인트로 컴포넌트 | (기록할 것) | 참고 사이트 지정, 뼈대만 가져오기·인트로 넣기 선택 |
| 2026-11-26 | Claude | SENSORY ARCHIVE 중심으로 재구성 | Archive + Stage 두 페이지, "저장한 것" 보기, 상세 보기 통일 | (기록할 것) | 1학기 출처 섹션이 어울리지 않는다고 지적, Collage의 필요성에 의문 → Collage·출처 7개 빼기 결정 |

이전 작업: `src/14/archive`(Stage 무대)의 코드는 대부분 Claude가 작성했고, 레퍼런스 기록(글·이미지 선정)은 직접 했다.
TouchDesigner 프로그램은 쓰지 않았다. 점 격자·와이어·파라미터 창은 TouchDesigner의 노드 화면에서 **착안한** CSS·SVG 표현이다.
