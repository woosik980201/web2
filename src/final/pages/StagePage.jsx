import React, { useState, useCallback, useContext, useMemo } from "react";
import ThemeContext from "../context/ThemeContext";
import FilterChips from "../components/common/FilterChips";
import DetailModal from "../components/common/DetailModal";
// 14장에서 만든 SENSORY ARCHIVE 무대를 고치지 않고 그대로 가져와 쓴다
import CollageStage from "../../14/archive/CollageStage";
import "../../14/archive/ArchivePage.css";

// 페이지 2: Stage — 레퍼런스가 놓인 무대.
// Archive에서 Dive in으로 고른 기록만 무대에 올린다: "고르고(Archive) → 걸어 들어가 본다(Stage)".
// 아직 고른 게 없으면 무대가 비지 않게 전체를 보여 주고 안내 문장을 띄운다.
// 방향키로 인물을 움직여 기록 위에서 Enter를 누르면, Archive와 같은 상세 보기(DetailModal)가 열린다.
const views = [
    { value: "saved", label: "Dive in" },
    { value: "all", label: "전체" },
];

// entries   : 무대용 기록 전체 (기본 9개 + 직접 추가한 기록, x·y 위치 포함)
// references: 상세 보기용 같은 기록들
// domains   : 분야 필터 목록 (기록에서 뽑은 것)
function StagePage({ entries, references, domains, savedIds }) {
    const { theme } = useContext(ThemeContext);
    const hasSaved = savedIds.length > 0;
    const [view, setView] = useState(hasSaved ? "saved" : "all");
    const [pickedDomain, setDomain] = useState("all");
    const domain = domains.some((option) => option.value === pickedDomain) ? pickedDomain : "all";
    const [openId, setOpenId] = useState(null);

    // 고른 게 하나도 없으면 "Dive in" 보기여도 전체를 쓴다
    const showSaved = view === "saved" && hasSaved;

    // 무대는 entries가 바뀔 때마다 장면을 다시 계산한다.
    // 그릴 때마다 새 배열이 되지 않게, 보기나 저장 목록이 바뀔 때만 다시 거른다(useMemo).
    const stageEntries = useMemo(
        () => (showSaved ? entries.filter((entry) => savedIds.includes(entry.id)) : entries),
        [showSaved, savedIds, entries]
    );

    // CollageStage는 onEnter가 바뀌면 키보드 이벤트를 다시 건다. 매번 새 함수가 되지 않게 고정한다.
    const handleEnter = useCallback((entryId) => setOpenId(entryId), []);
    const handleClose = useCallback(() => setOpenId(null), []);

    const openItem = references.find((item) => item.id === openId);

    return (
        <>
            <section className="page-intro">
                <p className="meta">Stage · {stageEntries.length} / {references.length} entries on stage</p>
                <h1>걸어 들어가는 아카이브</h1>
                <p className="lead">
                    Archive에서 Dive in으로 고른 기록이 이 무대에 올라와요.
                    <br />
                    ← ↑ ↓ → 로 걷고, 기록 위에서 Enter를 누르면 들어가요. 조각을 눌러도 열려요.
                </p>
                {!hasSaved && (
                    <p className="stage-hint">아직 고른 기록이 없어서 전체를 보여 주고 있어요 — Archive에서 ＋ Dive in을 눌러 무대에 올릴 기록을 골라 보세요.</p>
                )}
                <div className="stage-filters">
                    {hasSaved && <FilterChips label="보기" options={views} value={view} onChange={setView} />}
                    <FilterChips label="분야" options={domains} value={domain} onChange={setDomain} />
                </div>
            </section>

            {/* 14장 무대의 CSS 변수(색)는 .archive-page 안에서만 적용된다.
                key: 무대에 올릴 기록이 바뀌면 무대를 새로 세운다(인물 위치·들른 경로 초기화) */}
            <div className={"archive-page sensory-embed " + theme}>
                <CollageStage
                    key={showSaved ? "saved-" + savedIds.join(",") : "all-" + entries.length}
                    entries={stageEntries}
                    selectedDomain={domain === "all" ? "전체" : domain}
                    paused={openId !== null}
                    onEnter={handleEnter}
                />
            </div>

            {openItem && <DetailModal item={openItem} onClose={handleClose} />}
        </>
    );
}

export default StagePage;
