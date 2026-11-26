// SENSORY ARCHIVE — Phase 0 시트(References 탭)에서 옮긴 기록.
// why / question 은 시트의 why_drawn / digging_question 칸에 내가 직접 쓴 문장 그대로다.
// x, y 는 콜라주 무대 안에서 조각 중심의 위치(%), w 는 조각 너비(%), rot 은 기울기(도).
import sa001a from "./images/SA-001_0136.jpg";
import sa001b from "./images/SA-001_0040.jpg";
import sa001c from "./images/SA-001_0704.jpg";
import sa002a from "./images/SA-002_01.jpg";
import sa003a from "./images/SA-003_01.jpg";
import sa003b from "./images/SA-003_02.jpg";
import sa003c from "./images/SA-003_03.jpg";
import sa004a from "./images/SA-004_0022.jpg";
import sa004b from "./images/SA-004_0007.jpg";
import sa005a from "./images/SA-005_01.jpg";
import sa005b from "./images/SA-005_02.jpg";
import sa005c from "./images/SA-005_03.jpg";
import sa006a from "./images/SA-006_06.jpg";
import sa006b from "./images/SA-006_03.jpg";
import sa006c from "./images/SA-006_07.jpg";
import sa007a from "./images/SA-007_01.jpg";
import sa007b from "./images/SA-007_02.jpg";
import sa007c from "./images/SA-007_03.jpg";
import sa007d from "./images/SA-007_04.jpg";
import sa007e from "./images/SA-007_05.jpg";
import sa007f from "./images/SA-007_06.jpg";
import sa007g from "./images/SA-007_0104.jpg";
import sa007h from "./images/SA-007_0148.jpg";
import sa008a from "./images/SA-008_03.jpg";
import sa008b from "./images/SA-008_02.jpg";
import sa008c from "./images/SA-008_05.jpg";
import sa008d from "./images/SA-008_07.jpg";
import sa008e from "./images/SA-008_01.jpg";
import sa008f from "./images/SA-008_04.jpg";
import sa008g from "./images/SA-008_06.jpg";
import sa008h from "./images/SA-008_08.jpg";
import sa008i from "./images/SA-008_09.jpg";
import sa009a from "./images/SA-009_01.jpg";

const archiveEntries = [
    {
        id: "SA-001", domain: "film", title: "American Look (Part I)", captured: "2026.11.12",
        credits: "Jam Handy Organization · 후원 Chevrolet", rights: "Public Domain (Prelinger)",
        url: "https://archive.org/details/American1958",
        why: "영상의 질감이 lofi한게 내 취향이고, 소리 없이 영상만 보는데 몽환적이다. 무슨 내용인지는 잘 모르겠지만 그냥 영상에 써도 느낌있는 영상이 만들어질 것 같다.",
        question: "",
        images: [
            { src: sa001a, caption: "01:36 — 카펫에 누워 책을 읽다 통화하는 장면" },
            { src: sa001b, caption: "00:40 — 타이틀 레터링" },
            { src: sa001c, caption: "07:04 — 선풍기 정면 클로즈업" },
        ],
        x: 17, y: 21, w: 25, rot: -4,
    },
    {
        id: "SA-002", domain: "music", title: "Daisy", captured: "2026.11.13",
        credits: "2hollis · 앨범 Pirouette · Interscope", rights: "권리 미확인",
        url: "https://www.youtube.com/watch?v=IxIrES0ML5s",
        why: "경쾌한 멜로디와 반복되는 코드·아르페지오가 좋았는데, 신나기만 한 게 아니라 어딘가 아련하고 벅차오르는 감정이 있었다.",
        question: "",
        images: [{ src: sa002a, caption: "앨범 Pirouette 커버" }],
        x: 89, y: 50, w: 14, rot: 5,
    },
    {
        id: "SA-003", domain: "fashion", title: "Gucci 2027 SS (The Store Show)", captured: "2026.11.14",
        credits: "Gucci · CD Demna · 사진 Launchmetrics Spotlight (FASHIONSNAP)", rights: "권리 미확인",
        url: "https://www.fashionsnap.com/collection/gucci/2027ss/",
        why: "크롭한 상의와 로우라이즈, 여유로운 팬츠의 조합이 멋있었다. 평소 즐겨 입는 스타일이기도 하다.",
        question: "",
        images: [
            { src: sa003a, caption: "사진 25 — 벨트를 골반에 낮게 건 룩" },
            { src: sa003b, caption: "사진 27–28 — 크롭 아우터와 낮은 벨트" },
            { src: sa003c, caption: "사진 29–32 — 31·32는 같은 비율, 벨트는 보이지 않음" },
        ],
        x: 78, y: 76, w: 12, rot: -5,
    },
    {
        id: "SA-004", domain: "art", title: "[가제] 오려 붙인 동화", captured: "2026.11.18",
        credits: "etre.valori (AI 아티스트)", rights: "권리 미확인",
        url: "https://www.instagram.com/reel/Dfm6-JGRZEY/",
        why: "움직이는 영상인데 종이를 오려 붙인 콜라주 같은 질감과 색감이 아름답다. 나무를 발레 바처럼 짚고 균형을 잡는 장면(폴댄스도 떠올랐다)과, 열기구와 그네를 합쳐 붕 떠서 타는 장면이 기발하다. 짧은 릴스인데 디테일이 엄청나다.",
        question: "",
        images: [
            { src: sa004a, caption: "00:22 — 열기구에 매달린 그네" },
            { src: sa004b, caption: "00:07 — 자작나무를 짚고 도는 장면" },
        ],
        x: 13, y: 67, w: 12, rot: -6,
    },
    {
        id: "SA-005", domain: "art", title: "Hamid Naderi Yeganeh — 수학 공식 회화", captured: "2026.11.19",
        credits: "Hamid Naderi Yeganeh · 큐레이션 음미 매거진", rights: "권리 미확인",
        url: "https://www.instagram.com/hamidnaderiyeganeh/",
        why: "수학 공식으로 예술작품을 만든다는 게 기발하고 참신하다. 단순한 도형이 수백, 수천 번 반복되면서 우주가 되기도 하고 해바라기 밭이 되기도 한다.",
        question: "예상치 못한 무엇을 예술과 결합하면 새로운 게 나올까?",
        images: [
            { src: sa005a, caption: "Interacting Black Holes" },
            { src: sa005b, caption: "Coronal Loops" },
            { src: sa005c, caption: "Sunflower Field" },
        ],
        x: 44, y: 25, w: 16, rot: 3,
    },
    {
        id: "SA-006", domain: "art", title: "THREAD — Threading Through Communities", captured: "2026.11.25",
        credits: "Seiko Kinoshita · 기록 필름 Daniella Sasaki", rights: "권리 미확인",
        url: "https://www.derwentvalleymills.org/discover/arts/major-arts-commission-thread-by-seiko-kinoshita/",
        why: "주민들이 워크숍에서 함께 만든 등불이 실제 설치의 일부가 됐다는 점이 가장 마음에 들었다. 참여하는 과정도 좋았고, 나무 사이의 길에서 돌계단을 거쳐 어두운 교회 내부까지 빛이 이어지는 모습이 너무 아름다웠다.",
        question: "사람마다 다르게 만든 작은 빛을 어떻게 배치하면 각자의 흔적과 하나의 공동 풍경이 함께 보일까?",
        images: [
            { src: sa006a, caption: "제단 앞에 모인 푸른빛과 따뜻한 등불" },
            { src: sa006b, caption: "교회 내부 전경" },
            { src: sa006c, caption: "좌석 사이의 등불" },
        ],
        x: 34, y: 72, w: 24, rot: 4,
    },
    {
        id: "SA-007", domain: "art", title: "Forever is Composed of Nows", captured: "2026.11.25",
        credits: "Sarah Sze · SFMOMA", rights: "권리 미확인 (SFMOMA 전시 페이지·인터뷰 영상 캡처)",
        url: "https://www.sfmoma.org/exhibition/sarah-sze/",
        why: "사라 제는 일상에서 보고 듣고 느낀 것을 매일 모아 작품의 재료로 삼는다. 서로 다른 이미지와 물성을 콜라주로 엮는 방식이 요즘 내가 관심 있는 음악 샘플링과 닮아 있어 끌렸다.",
        question: "카메라 높이만 바꿔 같은 이미지가 공간의 일부에서 화면의 중심이 되는 순간을 만들 수 있을까?",
        images: [
            { src: sa007f, caption: "6번째 캡처 — 수평선, 동물, 무지개색 조각 위를 가로지르는 청록색 선" },
            { src: sa007e, caption: "5번째 캡처 — 파란 나무 사진 사이의 주황색 풍경, 찢긴 종이 가장자리와 테이프로 고정된 붓" },
            { src: sa007a, caption: "1번째 캡처 — 패널의 이미지와 푸른빛이 옆 벽까지 이어짐 (설치 전경, photo: Matthew Millman)" },
            { src: sa007c, caption: "3번째 캡처 — 전시실의 대형 회화 (설치 전경, photo: Matthew Millman)" },
            { src: sa007b, caption: "2번째 캡처 — 나무 사진 조각 (photo: courtesy Sarah Sze Studio)" },
            { src: sa007d, caption: "4번째 캡처 — 인터뷰 영상 속 작업실" },
            { src: sa007g, caption: "인터뷰 자막 캡처 — 01:04 부근" },
            { src: sa007h, caption: "인터뷰 자막 캡처 — 01:48 부근" },
        ],
        x: 35, y: 47, w: 19, rot: -3,
    },
    {
        id: "SA-008", domain: "music", title: "Unending Pt. 1", captured: "2026.11.25",
        credits: "음악 Asta Hiroki · 영상 Joe Wretham (TouchDesigner)", rights: "권리 미확인",
        url: "https://www.awn.com/news/awn-exclusive-asta-hirokis-unending-pt-1-music-video-premiere",
        why: "도형이 점차 사람의 형태로 읽히고, 움직임이 더해지면서 살아 있는 사람처럼 느껴졌다. 가만히 보고 있으면 한 사람의 인생이 흘러가는 듯했다. 이 형태 변화와 움직임의 연결이 매력적이라 나도 직접 시도해 보고 싶다. ‘같은 재료가 시간에 따라 다른 형태를 취한다’는 문장이 기억에 남았다.",
        question: "얼굴을 흐려도 어깨선이나 몸의 기울기만으로 인물의 존재감이 남을까?",
        images: [
            { src: sa008a, caption: "도형이 사람으로 읽히기 시작하는 실루엣" },
            { src: sa008b, caption: "머리·어깨·팔의 배치가 또렷한 컷" },
            { src: sa008c, caption: "면이 비고 선만 겹친 전신" },
            { src: sa008d, caption: "빨강·초록·파랑 윤곽이 어긋난 잔상" },
            { src: sa008e, caption: "검은 배경에 놓인 흰 도형" },
            { src: sa008f, caption: "조각으로 흩어진 형상" },
            { src: sa008g, caption: "면이 비고 선만 남은 윤곽" },
            { src: sa008h, caption: "얼굴과 손의 근접 컷" },
            { src: sa008i, caption: "흰 면 안에 남은 검은 실루엣" },
        ],
        x: 72, y: 24, w: 23, rot: -2,
    },
    {
        id: "SA-009", domain: "art", title: "야마니시 모모 — 빛의 왕국", captured: "2026.11.25",
        credits: "Momo Yamanishi · 72Gallery, Tokyo Institute of Photography", rights: "권리 미확인",
        url: "https://tip.or.jp/2024/5718",
        why: "첨부 사진의 흐릿한 윤곽과 빛바랜 듯한 갈색·청색이 내가 남기고 싶었던 미감이다. 무스탕의 동굴과 화석에서 출발해 핀홀 사진으로 이어진 과정, 그리고 자신의 금속 주조 경험을 사진 작업에 연결했다는 점도 매력적이었다.",
        question: "어느 윤곽을 남기면 흐릿하고 빛바랜 이미지에서도 피사체의 존재감이 유지될까?",
        images: [{ src: sa009a, caption: "말의 옆모습 (장면 설명, 개별 작품명 미확인)" }],
        x: 56, y: 62, w: 19, rot: 2,
    },
];

export default archiveEntries;
