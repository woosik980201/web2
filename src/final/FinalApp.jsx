import React, { useState, useEffect, useMemo } from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import ThemeContext from "./context/ThemeContext";
import { baseEntries, toReference, nextId, stageSpotFor, domainsOf } from "./data/references";
import Layout from "./components/layout/Layout";
import ArchivePage from "./pages/ArchivePage";
import StagePage from "./pages/StagePage";
import "./styles/tokens.css";
import "./styles/final.css";

// ★ 기말과제: SSIKHIVE — SENSORY ARCHIVE 레퍼런스를 모아 보는 Archive와 걸어 들어가는 Stage
//
// 여러 페이지가 함께 쓰는 값은 가장 위(App)에 둔다.
//  - customEntries: 이 페이지에서 직접 추가한 기록 (SA-010…). 기본 9개와 합쳐 Archive·Stage가 함께 쓴다
//  - savedIds: Archive에서 Dive in으로 고르고, Stage에는 고른 기록만 올리며, 머리글에 개수를 보여 준다
//  - theme   : 모든 페이지의 색. Context로 나눠 준다

const SAVED_KEY = "ssikhive-saved";
const THEME_KEY = "ssikhive-theme";
const ENTRIES_KEY = "ssikhive-entries";
const HIDDEN_KEY = "ssikhive-hidden";
const EDITS_KEY = "ssikhive-edits";

// localStorage는 브라우저 설정에 따라 막혀 있을 수 있어서 실패해도 앱이 멈추지 않게 감싼다
function loadValue(key, fallback) {
    try {
        const stored = localStorage.getItem(key);
        return stored === null ? fallback : JSON.parse(stored);
    } catch (error) {
        return fallback;
    }
}

function saveValue(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        // 저장이 안 되어도 화면은 그대로 동작한다
    }
}

function NotFound() {
    return (
        <section className="page-intro">
            <h1>페이지를 찾을 수 없어요</h1>
            <Link to="/" className="stamp">Archive로 가기</Link>
        </section>
    );
}

function FinalApp() {
    // 새로고침해도 유지되도록 처음 값을 localStorage에서 읽어 온다 (1학기와 같은 동작)
    const [customEntries, setCustomEntries] = useState(() => loadValue(ENTRIES_KEY, []));

    // 기본 기록 + 직접 추가한 기록 = 지금 아카이브 전체. 화면용 모양(references)도 여기서 한 번만 만든다.
    // useMemo: 기록이 바뀔 때만 다시 계산 (Stage 무대가 매번 새 배열을 받지 않게)
    // 기본 9개 중 이 브라우저에서 지운(숨긴) 기록의 id. 14장 데이터 파일은 건드리지 않고 화면에서만 뺀다.
    const [hiddenIds, setHiddenIds] = useState(() => loadValue(HIDDEN_KEY, []));
    // 방금 지운 기록 (잠깐 뜨는 "되돌리기" 안내용). 새로고침하면 사라져도 되는 값이라 localStorage에 넣지 않는다.
    const [lastDeleted, setLastDeleted] = useState(null);

    // 기본 9개를 이 브라우저에서 고친 내용: { "SA-002": { title: "…", why: "…" } }
    // 지우기와 같은 원칙 — 14장 데이터 파일은 그대로 두고, 고친 부분만 따로 저장해 화면에서 덮어쓴다.
    const [edits, setEdits] = useState(() => loadValue(EDITS_KEY, {}));

    const entries = useMemo(
        () => [
            ...baseEntries
                .filter((entry) => !hiddenIds.includes(entry.id))
                .map((entry) => (edits[entry.id] ? { ...entry, ...edits[entry.id], edited: true } : entry)),
            ...customEntries,
        ],
        [customEntries, hiddenIds, edits]
    );
    const references = useMemo(() => entries.map(toReference), [entries]);
    // 분야 필터 목록도 기록에서 뽑는다 (새 분야를 적어 넣으면 자동으로 늘어난다)
    const domains = useMemo(() => domainsOf(entries), [entries]);

    // 예전에 저장했다가 데이터에서 빠진 id(예: 1학기 항목)는 걸러 낸다
    const [savedIds, setSavedIds] = useState(() =>
        loadValue(SAVED_KEY, []).filter((id) => entries.some((entry) => entry.id === id))
    );
    const [theme, setTheme] = useState(() => loadValue(THEME_KEY, "light"));

    useEffect(() => saveValue(SAVED_KEY, savedIds), [savedIds]);
    useEffect(() => saveValue(THEME_KEY, theme), [theme]);

    function toggleSave(id) {
        setSavedIds((previous) =>
            previous.includes(id) ? previous.filter((savedId) => savedId !== id) : [...previous, id]
        );
    }

    // 폼에서 받은 기록에 번호와 무대 위치를 붙여 저장한다.
    // 사진을 담으면 저장 공간(브라우저당 약 5MB)이 찰 수 있어서, 먼저 저장해 보고 실패하면 추가하지 않는다.
    function addEntry(draft) {
        // 번호는 숨긴 기록까지 포함해서 센다 (숨긴 SA-009를 되돌렸을 때 번호가 겹치지 않게)
        const entry = {
            ...draft,
            rights: "권리 미확인 (직접 추가)",
            custom: true,
            id: nextId([...baseEntries, ...customEntries]),
            ...stageSpotFor(customEntries.length),
        };
        const next = [...customEntries, entry];
        try {
            localStorage.setItem(ENTRIES_KEY, JSON.stringify(next));
        } catch (error) {
            return { error: "브라우저 저장 공간이 부족해요. 사진 수를 줄이거나 이미지 주소로 넣어 주세요." };
        }
        setCustomEntries(next);
        setLastDeleted(null);
        return { id: entry.id };
    }

    // 기록 고치기.
    //  - 직접 추가한 기록: 저장해 둔 목록에서 그 기록을 바꿔 넣는다 (번호·무대 위치는 그대로)
    //  - 기본 9개: 고친 칸들을 edits에 따로 저장한다. 이미지를 안 바꿨으면 이미지는 저장하지 않는다
    //    (기본 이미지는 프로젝트 안의 파일이라 주소가 빌드마다 달라질 수 있어서)
    function updateEntry(id, draft) {
        const isCustom = customEntries.some((entry) => entry.id === id);
        try {
            if (isCustom) {
                const next = customEntries.map((entry) => (entry.id === id ? { ...entry, ...draft } : entry));
                localStorage.setItem(ENTRIES_KEY, JSON.stringify(next));
                setCustomEntries(next);
            } else {
                const original = entries.find((entry) => entry.id === id);
                const sameImages = JSON.stringify(original.images) === JSON.stringify(draft.images);
                const { images, ...text } = draft;
                const kept = edits[id] && edits[id].images ? { images: edits[id].images } : {};
                const next = { ...edits, [id]: sameImages ? { ...kept, ...text } : draft };
                localStorage.setItem(EDITS_KEY, JSON.stringify(next));
                setEdits(next);
            }
        } catch (error) {
            return { error: "브라우저 저장 공간이 부족해요. 사진 수를 줄이거나 이미지 주소로 넣어 주세요." };
        }
        setLastDeleted(null);
        return { id };
    }

    // 고친 기본 기록 하나를 14장 데이터의 원래 내용으로 되돌린다
    function resetEntry(id) {
        const { [id]: removed, ...next } = edits;
        saveValue(EDITS_KEY, next);
        setEdits(next);
    }

    // 기록 지우기.
    //  - 직접 추가한 기록: 저장해 둔 목록에서 실제로 뺀다
    //  - 기본 9개: 데이터 파일은 그대로 두고 hiddenIds에 넣어 화면에서만 숨긴다
    // 지운 기록은 lastDeleted에 잠깐 들고 있다가, "되돌리기"를 누르면 그대로 되살린다.
    function deleteEntry(id) {
        const custom = customEntries.find((entry) => entry.id === id);
        const title = entries.find((entry) => entry.id === id).title;
        if (custom) {
            const next = customEntries.filter((entry) => entry.id !== id);
            saveValue(ENTRIES_KEY, next);
            setCustomEntries(next);
        } else {
            const next = [...hiddenIds, id];
            saveValue(HIDDEN_KEY, next);
            setHiddenIds(next);
        }
        setLastDeleted({ id, title, custom, wasSaved: savedIds.includes(id) });
        setSavedIds((previous) => previous.filter((savedId) => savedId !== id));
    }

    // 방금 지운 기록 하나를 되돌린다 (Dive in으로 골라 둔 상태였다면 그것도 함께)
    function undoDelete() {
        if (lastDeleted === null) return;
        if (lastDeleted.custom) {
            const next = [...customEntries, lastDeleted.custom];
            saveValue(ENTRIES_KEY, next);
            setCustomEntries(next);
        } else {
            const next = hiddenIds.filter((id) => id !== lastDeleted.id);
            saveValue(HIDDEN_KEY, next);
            setHiddenIds(next);
        }
        if (lastDeleted.wasSaved) setSavedIds((previous) => [...previous, lastDeleted.id]);
        setLastDeleted(null);
    }

    // 숨긴 기본 기록을 전부 되돌린다 (발표 전에 원래 상태로 돌려놓을 때)
    function restoreHidden() {
        saveValue(HIDDEN_KEY, []);
        setHiddenIds([]);
        setLastDeleted(null);
    }

    function toggleTheme() {
        setTheme((previous) => (previous === "light" ? "dark" : "light"));
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <BrowserRouter>
                <Routes>
                    {/* Layout(머리글·꼬리글) 안에 두 페이지가 번갈아 들어간다 */}
                    <Route element={<Layout savedCount={savedIds.length} />}>
                        <Route
                            index
                            element={
                                <ArchivePage
                                    references={references}
                                    domains={domains}
                                    savedIds={savedIds}
                                    onToggleSave={toggleSave}
                                    onAddEntry={addEntry}
                                    onUpdateEntry={updateEntry}
                                    onResetEntry={resetEntry}
                                    onDeleteEntry={deleteEntry}
                                    lastDeleted={lastDeleted}
                                    onUndoDelete={undoDelete}
                                    onDismissDeleted={() => setLastDeleted(null)}
                                    hiddenCount={hiddenIds.length}
                                    onRestoreHidden={restoreHidden}
                                />
                            }
                        />
                        <Route path="stage" element={<StagePage entries={entries} references={references} domains={domains} savedIds={savedIds} />} />
                        {/* 예전 주소로 들어와도 길을 잃지 않게 */}
                        <Route path="sensory" element={<Navigate to="/stage" replace />} />
                        <Route path="collage" element={<Navigate to="/" replace />} />
                        <Route path="*" element={<NotFound />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </ThemeContext.Provider>
    );
}

export default FinalApp;
