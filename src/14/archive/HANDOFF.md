# SENSORY ARCHIVE 콜라주 페이지 — 인수인계

작성: 2026-11-26 · 「AI Software」 프로젝트 대화에서 만든 것을 「SENSORY ARCHIVE | Visual & Sound」 프로젝트로 넘기기 위한 문서

## 1. 한 줄 요약

SENSORY ARCHIVE 시트의 기록 9개를 콜라주 무대에 올리고, 방향키로 점 구름 인물을 움직여 조각 위에서 Enter를 누르면 그 기록의 페이지로 들어가는 React 페이지. **다음 작업은 "인물이 움직이면 배경 공간이 바뀌게 하기"** (4번 참고).

## 2. 어디에 있나

- 프로젝트: `D:\web2project\web2` (Create React App, React 19, react-scripts 5)
- 실행: `npm start` → `src/index.js`가 `ArchivePage`를 띄움
- 폴더: `src/14/archive/`

| 파일 | 역할 |
|---|---|
| `ArchivePage.jsx` | 페이지 전체. 테마, 분야 필터, 콜라주/목록 전환, 열린 기록(openId) 상태를 가짐 |
| `CollageStage.jsx` | 무대. 방향키 입력, 인물 위치, 올라선 조각 감지, 와이어·파라미터 창 |
| `Walker.jsx` | 점 구름 인물 (canvas). 뼈대를 계산하고 그 위에 점을 뿌림 |
| `FieldCanvas.jsx` | 바닥 그래픽 (canvas). 입자 선, 점 원, 궤도, 추적 상자, 파형 |
| `EntryDetail.jsx` | Enter로 들어간 기록 페이지. ESC로 나옴 |
| `archiveData.js` | 기록 9개의 데이터와 조각 위치(x, y, w, rot) |
| `ArchivePage.css` | 스타일 전부. 색은 맨 위 CSS 변수(`--paper`, `--stage`, `--ink` 등)에 모여 있음 |
| `images/` | 내가 모은 캡처를 줄인 jpg |

- `src/14/ex2/`의 `ShoppingThemeContext.jsx`, `ThemeModeButton.jsx`를 가져다 씀 (다크 모드). 이 폴더의 쇼핑 정보 페이지(B-SIDE)는 그대로 남아 있고 `index.js`에서 주석 처리됨.
- 아직 커밋하지 않았음.

## 3. 지금 되는 것 / 확인 상태

되는 것
- 방향키 이동(대각선 포함), 조각 감지, Enter 진입, ESC 복귀, 조각 클릭
- 분야 필터, 콜라주/목록 보기, 다크 모드
- 터치디자이너에서 가져온 요소: 점 격자, 노드 단자와 TOP/CHOP 이름표, 같은 분야를 잇는 선, 인물–조각 와이어, 파라미터 창, 추적 상자, 입자 선, 궤도, 파형

확인 상태
- Claude가 같은 코드를 따로 묶어 헤드리스 브라우저(1280×860)로 띄워 봄: 콘솔 오류 없음, 걷기·감지·Enter·다크 모드 동작 확인.
- **내 PC의 `npm start` 화면에서는 아직 전부 확인하지 못함.** 좁은 화면(모바일)도 확인하지 않음.
- IntelliJ의 "생성 파일" 경고는 원인을 찾지 못했음 (`web2.iml`, `.idea` 설정에는 근거 없음).

## 4. 다음 작업: 움직이면 공간이 바뀌는 배경

내가 느낀 문제: 지금 배경은 무드보드에 중점을 둬서 **보드 색이 강하다.** 인물이 움직이면서 공간이 바뀌었으면 좋겠다.

현재 구조에서 건드릴 곳
- 배경색은 `ArchivePage.css`의 `--stage`(무대)와 `--paper`(페이지) 두 변수뿐. 무대에는 점 격자(`.sa-stage`의 `background-image`)가 깔려 있음.
- 인물 위치는 `CollageStage.jsx`의 `pos` state(무대 안 % 좌표)와 `posRef`에 있음. 올라선 기록은 `activeId`.
- `FieldCanvas.jsx`는 이미 `posRef`를 매 프레임 읽고 있어서, 위치에 따라 그림을 바꾸기 가장 쉬운 자리.

아직 정하지 않은 것 (내가 정해야 함)
- "공간이 바뀐다"가 무엇인지: 위치에 따라 색이 서서히 변하는 것인지, 구역마다 다른 공간(예: 분야별)이 되는 것인지, 올라선 기록의 색을 무대가 받아들이는 것인지.
- 조각(폴라로이드)의 흰 테두리와 마스킹 테이프를 유지할지. 무드보드 느낌의 큰 원인임.

아래는 Claude가 낸 구현 방향 후보일 뿐이고, 내가 고른 것이 아님
- A. `pos.x`, `pos.y`를 CSS 변수로 무대에 넘겨 `--stage` 색을 위치에 따라 섞기 (가장 간단)
- B. 올라선 기록의 대표 이미지를 크게 흐려 무대 배경으로 깔기
- C. `FieldCanvas`에서 구역별로 입자 모양·밀도·색을 바꾸기

## 5. 기록과 이미지

- 원본: Google Sheets 「SENSORY ARCHIVE — Phase 0」 References 탭. **시트는 읽기 전용. 수정하지 말 것.**
- 페이지의 글은 시트의 `why_drawn`, `digging_question` 칸에 **내가 직접 쓴 문장만** 그대로 씀. 캡션은 `memo` 칸의 관찰에서 가져옴.
- `connection_note`, `ai_summary` 칸은 쓰지 않음. 특히 SA-009의 "VMD·마르지엘라 POP" 연결은 내가 말한 것으로 확인되지 않았으니 내 감상이나 확정된 방향으로 다루지 말 것.

| 기록 | 이미지 | 출처 |
|---|---|---|
| SA-001 American Look | 3장 | Drive `SA-001_*.png` (Public Domain, Prelinger) |
| SA-002 Daisy | 1장 | 내가 대화에 올린 앨범 커버 (앨범이 맞는지는 Claude가 확인하지 않음) |
| SA-003 Gucci 2027 SS | 3장 | 내가 올린 FASHIONSNAP 캡처 (사진 25, 27–28, 29–32) |
| SA-004 오려 붙인 동화 | 2장 | Drive `SA-004_*.png` |
| SA-005 수학 공식 회화 | 3장 | Drive `SA-005_*.png` |
| SA-006 THREAD | 3장 | Drive `SA-006_03, 06, 07` (04는 크레딧 자막이라 제외) |
| SA-007 Sarah Sze | 8장 | 내가 올린 캡처 6장(`SA-007_01~06`) + 인터뷰 자막 2장(`0104`, `0148`) |
| SA-008 Unending Pt. 1 | 9장 | Drive `SA-008_01~09.png` |
| SA-009 빛의 왕국 | 1장 | Drive `SA-009_01.png` |

주의
- `images/`에 쓰지 않는 파일이 남아 있음: `SA-007_0004, 0013, 0036, 0239, 0315.jpg`. 지워도 됨.
- **SA-001만 퍼블릭 도메인이고 나머지는 시트 기준 "권리 미확인".** 내 PC에서 보는 건 괜찮지만, GitHub 공개 저장소나 포트폴리오에 올릴 때는 이미지를 빼거나 확인이 필요함.
- Drive `from_PC/2026-11-25` 폴더의 오후 9:03·9:04 캡처는 Seiko Kinoshita 《Distant》 화면. 넣을지 정하지 않아 넣지 않았음.

## 6. 알려진 한계

- 조각 위치는 `archiveData.js`의 숫자로 잡은 것. 겹침이 어색하면 `x, y, w, rot`만 고치면 됨.
- 입자 선은 조각 사이 빈틈에서만 보임. 조각이 무대를 많이 덮고 있기 때문.
- 서 있을 때 인물은 옆모습이라 폭이 좁음. 걸을 때 사람 형태가 더 잘 읽힘.
- 방향키는 콜라주 화면에서 페이지 스크롤 대신 인물 이동에 쓰임. 모바일은 조각 터치만 됨.
- 수업 제출용이라면: `useRef`, `useCallback`, `requestAnimationFrame`, canvas를 씀. 수업 범위인지 확인 필요.
- `src/14`는 수업 실습 폴더. SENSORY ARCHIVE를 독립 저장소(`sensory-archive`)로 옮길지는 정하지 않았음.

## 7. 지켜 온 원칙

- 레퍼런스는 내가 직접 발견하고 고른다. Claude는 웹에서 이미지를 찾아 넣지 않는다.
- 내 감상과 AI 제안을 섞지 않는다. 구현되지 않은 것을 구현된 것처럼 말하지 않는다.
- 미감에 관한 선택(색, 겹침, 무엇을 넣고 뺄지)은 내가 정한다.
