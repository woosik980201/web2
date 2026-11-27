// SSIKHIVE 레퍼런스 데이터 — Archive와 Stage가 모두 같은 목록을 쓴다.
//
// 레퍼런스는 SENSORY ARCHIVE에서 직접 디깅해 기록한 SA-001…이다.
// 글·이미지·링크는 여기 복사하지 않고 14장의 archiveData.js를 그대로 가져와 쓴다.
// 그래서 SA 기록을 고치면 Archive 목록, Stage 무대, 상세 보기가 한꺼번에 바뀐다.
import archiveEntries from "../../14/archive/archiveData";

// 이미지 권리 상태. 화면에는 label을 그대로 보여 준다.
export const rights = {
    "public-domain": { label: "Public domain", note: "시트 기재 기준" },
    unverified: { label: "출처 확인 필요", note: "권리 상태를 확인하지 않았음" },
};

// 섹션: 지금은 하나뿐이다. 모든 기록이 직접 디깅해 모은 레퍼런스이기 때문.
// (1학기의 Currently Into "요즘 듣고, 입고, 보러 가는 것"은 수집 기록과 성격이 달라 뺐다 — 2026-11-26 결정: 본인)
// 나중에 성격이 다른 묶음이 생기면 여기에 한 줄 추가하고, 아래 references의 section 값만 나누면 된다.
export const sections = [
    {
        key: "digging",
        title: "Digging Log",
        description: "References I dug up, and why they stayed.",
    },
];

// 처음부터 있는 분야 (SENSORY ARCHIVE의 분야 그대로). 필터에 늘 이 순서로 먼저 나온다.
const baseDomains = ["film", "music", "fashion", "art"];

// 분야 이름을 저장용 값으로 다듬는다: 앞뒤 공백을 떼고 소문자로 ("  Design " → "design")
// 같은 분야가 "Design"과 "design" 두 개로 갈라지지 않게 하기 위해서다.
export function normalizeDomain(text) {
    return text.trim().toLowerCase();
}

// 지금 기록들에서 분야 필터 목록을 만든다: All + 기본 4개 + 기록에 쓰인 새 분야(쓰인 순서대로).
// 분야를 따로 저장하지 않고 기록에서 뽑아내므로, 새 분야로 기록을 추가하면 필터에 자동으로 생기고
// 그 분야의 기록이 모두 지워지면 필터에서도 자동으로 사라진다.
export function domainsOf(entries) {
    const names = [...baseDomains];
    entries.forEach((entry) => {
        if (!names.includes(entry.domain)) names.push(entry.domain);
    });
    return [
        { value: "all", label: "All" },
        ...names.map((name) => ({ value: name, label: name.charAt(0).toUpperCase() + name.slice(1) })),
    ];
}

// SA 기록(archiveData 모양) 하나를 화면에서 쓰는 레퍼런스 모양으로 바꾼다.
// 14장 기록이든, 이 페이지에서 직접 추가한 기록이든 같은 함수를 거친다.
export function toReference(entry) {
    return {
        id: entry.id,
        section: "digging",
        domain: entry.domain,
        title: entry.title,
        description: entry.credits, // 카드 한 줄: 누가 만들었나 (시트의 credits)
        images: entry.images, // [{ src, caption }] — 첫 장이 대표 이미지
        link: entry.url,
        rights: entry.rights.includes("Public Domain") ? "public-domain" : "unverified",
        rightsNote: entry.rights, // 시트에 적힌 원래 문구
        custom: entry.custom === true, // 이 페이지에서 직접 추가한 기록인지
        edited: entry.edited === true, // 기본 기록을 이 브라우저에서 고쳤는지
        // 내가 직접 쓴 문장만 (시트의 why_drawn · digging_question)
        archive: { why: entry.why, question: entry.question, captured: entry.captured },
    };
}

// 14장에서 옮겨 온 기본 기록 9개 (SA-001 ~ SA-009)
export const baseEntries = archiveEntries;

// 다음 기록 번호: 지금까지 쓴 가장 큰 번호 + 1 → "SA-010"
export function nextId(entries) {
    const max = entries.reduce((biggest, entry) => Math.max(biggest, Number(entry.id.replace("SA-", "")) || 0), 0);
    return "SA-" + String(max + 1).padStart(3, "0");
}

// 새 기록을 Stage 무대 어디에 놓을지. 기존 9개 조각과 걸어 다니는 인물의 출발점(가운데 아래)을 피한 빈자리들.
const stageSpots = [
    { x: 89, y: 21 },
    { x: 9, y: 42 },
    { x: 60, y: 42 },
    { x: 91, y: 84 },
    { x: 20, y: 88 },
    { x: 70, y: 88 },
];
export function stageSpotFor(index) {
    const spot = stageSpots[index % stageSpots.length];
    const round = Math.floor(index / stageSpots.length); // 빈자리를 한 바퀴 다 쓰면 조금씩 비켜 놓는다
    return { x: spot.x - round * 3, y: spot.y - round * 4, w: 12, rot: index % 2 === 0 ? -4 : 3 };
}

export default archiveEntries.map(toReference);
