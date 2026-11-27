import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { sections, domains } from "../data/references";
import Hero from "../components/archive/Hero";
import FilterChips from "../components/common/FilterChips";
import ParamsPanel from "../components/common/ParamsPanel";
import ReferenceSection from "../components/archive/ReferenceSection";
import DetailModal from "../components/common/DetailModal";
import AddEntryForm from "../components/archive/AddEntryForm";
import UndoToast from "../components/common/UndoToast";

// 페이지 1: Archive — 디깅한 레퍼런스를 모아 보고, 더 파고들 것을 Dive in으로 고르고, 열어서 기록을 읽는다
// (모든 기록이 이미 "좋아서 모은 것"이라 ♥ 저장 대신 Dive in이라 부른다. 코드 안의 이름 savedIds는 그대로 둔다)
// savedIds와 onToggleSave는 App이 가지고 있다. 머리글의 저장 개수도 같은 값을 쓰기 때문이다.
// references(기본 9개 + 직접 추가한 기록)도 App이 가지고 있다. Stage도 같은 목록을 써야 하기 때문이다.
// "+ New entry"로 여기서 바로 기록을 추가하면 Digging Log에 곧바로 나타난다 — 구글 시트에 적던 일을 페이지 안으로 옮긴 것.
const views = [
    { value: "all", label: "전체" },
    { value: "saved", label: "Dive in" },
];

// 기록은 상세 보기에서 지운다(한 번 더 묻고 → 지운 뒤 잠깐 "되돌리기"). 지운 기본 기록은 "지운 기록 되돌리기"로 전부 복구할 수 있다.
function ArchivePage({
    references,
    savedIds,
    onToggleSave,
    onAddEntry,
    onUpdateEntry,
    onResetEntry,
    onDeleteEntry,
    lastDeleted,
    onUndoDelete,
    onDismissDeleted,
    hiddenCount,
    onRestoreHidden,
}) {
    // 머리글의 dive in 숫자를 누르고 들어오면 "Dive in" 보기로 시작한다 (Link의 state로 전달됨)
    const location = useLocation();
    const [view, setView] = useState(location.state && location.state.view === "saved" ? "saved" : "all");
    const [domain, setDomain] = useState("all");
    const [query, setQuery] = useState("");
    const [openItem, setOpenItem] = useState(null);
    const [adding, setAdding] = useState(false); // 새 기록 폼이 열려 있는지
    const [editing, setEditing] = useState(null); // 고치는 중인 기록 (없으면 null)
    const [flash, setFlash] = useState(null); // 방금 추가하거나 고친 기록 { id, label } — 카드에 잠깐 표시

    // 폼에서 기록을 넘겨받아 App에 저장을 맡긴다. 성공하면 필터를 풀어 그 카드가 바로 보이게 한다.
    function handleSubmit(fields) {
        const result = editing ? onUpdateEntry(editing.id, fields) : onAddEntry(fields);
        if (result.id) {
            setFlash({ id: result.id, label: editing ? "edited" : "new" });
            setView("all");
            setDomain("all");
            setQuery("");
        }
        return result;
    }

    function closeForm() {
        setAdding(false);
        setEditing(null);
    }

    // 상세 보기의 "수정"을 누르면: 창을 닫고 그 기록 내용으로 채운 폼을 연다
    function handleEdit(item) {
        setOpenItem(null);
        setAdding(false);
        setEditing(item);
    }

    function handleReset() {
        onResetEntry(editing.id);
        setFlash({ id: editing.id, label: "reset" });
        closeForm();
    }

    // 폼이 열리면 폼이 보이는 곳으로 스크롤한다
    useEffect(() => {
        if (!adding && editing === null) return;
        const form = document.querySelector(".add-form");
        if (form) form.scrollIntoView({ block: "start", behavior: "smooth" });
    }, [adding, editing]);

    // 기록을 추가하거나 고치면(화면에 그려진 뒤) 그 카드가 보이는 곳으로 스크롤한다
    useEffect(() => {
        if (flash === null) return;
        const card = document.querySelector(".ref-card.is-new");
        if (card) card.scrollIntoView({ block: "center", behavior: "smooth" });
    }, [flash]);

    function handleDelete(id) {
        onDeleteEntry(id);
        setOpenItem(null);
    }

    // 보기·분야·검색어를 함께 적용한 결과. state로 따로 저장하지 않고 그릴 때마다 계산한다.
    // 검색은 제목·만든 사람·내가 쓴 "왜 끌렸나"·디깅 질문까지 본다.
    const keyword = query.trim().toLowerCase();
    const filtered = references.filter((item) => {
        const matchView = view === "all" || savedIds.includes(item.id);
        const matchDomain = domain === "all" || item.domain === domain;
        const text = [item.title, item.description, item.archive.why, item.archive.question].join(" ").toLowerCase();
        return matchView && matchDomain && (keyword === "" || text.includes(keyword));
    });

    // 화면에 보이는 섹션만 번호를 매기기 위해, 비어 있는 섹션을 먼저 걸러 둔다
    const visibleSections = sections
        .map((section) => ({ section, items: filtered.filter((item) => item.section === section.key) }))
        .filter((group) => group.items.length > 0);

    return (
        <>
            <Hero references={references} />

            <div id="index" className="archive-controls">
                <div className="controls-left">
                    <FilterChips label="보기" options={views} value={view} onChange={setView} />
                    <FilterChips label="분야" options={domains} value={domain} onChange={setDomain} />
                    <input
                        type="search"
                        className="search-input"
                        placeholder="search archive"
                        aria-label="레퍼런스 검색"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                    />
                    {!adding && editing === null && (
                        <button type="button" className="stamp add-open" onClick={() => setAdding(true)}>
                            ＋ New entry
                        </button>
                    )}
                    {hiddenCount > 0 && (
                        <button type="button" className="restore-link" onClick={onRestoreHidden}>
                            지운 기록 {hiddenCount}개 되돌리기
                        </button>
                    )}
                </div>
                <ParamsPanel
                    title="index"
                    rows={[
                        { key: "view", value: view },
                        { key: "domain", value: domain },
                        { key: "query", value: keyword || "—" },
                        { key: "results", value: filtered.length + " / " + references.length, live: true },
                        { key: "dive in", value: savedIds.length },
                    ]}
                />
            </div>

            {filtered.length === 0 && (
                <p className="empty meta">
                    {view === "saved" && savedIds.length === 0
                        ? "아직 고른 기록이 없어요 — 더 파고들 카드에서 ＋ Dive in을 눌러 보세요."
                        : "no results — 다른 검색어나 분야를 골라 보세요."}
                </p>
            )}

            {(adding || editing) && (
                // key: 다른 기록을 고치러 가면 폼을 새로 만들어 칸을 그 기록 내용으로 다시 채운다
                <AddEntryForm
                    key={editing ? editing.id : "new"}
                    initial={
                        editing && {
                            id: editing.id,
                            domain: editing.domain,
                            title: editing.title,
                            credits: editing.description,
                            url: editing.link || "",
                            captured: editing.archive.captured,
                            why: editing.archive.why,
                            question: editing.archive.question || "",
                            images: editing.images,
                        }
                    }
                    onSubmit={handleSubmit}
                    onReset={editing && editing.edited ? handleReset : undefined}
                    onClose={closeForm}
                />
            )}

            {visibleSections.map((group, index) => (
                <ReferenceSection
                    key={group.section.key}
                    section={group.section}
                    index={index + 1}
                    items={group.items}
                    savedIds={savedIds}
                    onToggleSave={onToggleSave}
                    onOpen={setOpenItem}
                    flash={flash}
                />
            ))}

            {openItem && (
                <DetailModal
                    item={openItem}
                    onClose={() => setOpenItem(null)}
                    showStageLink
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}
            {lastDeleted && (
                <UndoToast
                    message={lastDeleted.id + " " + lastDeleted.title + " — 지웠어요"}
                    onUndo={onUndoDelete}
                    onDismiss={onDismissDeleted}
                />
            )}
        </>
    );
}

export default ArchivePage;
