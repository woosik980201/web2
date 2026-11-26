import React, { useState, useEffect, useMemo } from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import ThemeContext from "./context/ThemeContext";
import { baseEntries, toReference, nextId, stageSpotFor } from "./data/references";
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
    const entries = useMemo(() => [...baseEntries, ...customEntries], [customEntries]);
    const references = useMemo(() => entries.map(toReference), [entries]);

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
        const entry = { ...draft, id: nextId(entries), ...stageSpotFor(customEntries.length) };
        const next = [...customEntries, entry];
        try {
            localStorage.setItem(ENTRIES_KEY, JSON.stringify(next));
        } catch (error) {
            return { error: "브라우저 저장 공간이 부족해요. 사진 수를 줄이거나 이미지 주소로 넣어 주세요." };
        }
        setCustomEntries(next);
        return { id: entry.id };
    }

    // 직접 추가한 기록만 지울 수 있다 (기본 9개는 14장 데이터라 지우지 않음)
    function deleteEntry(id) {
        const next = customEntries.filter((entry) => entry.id !== id);
        saveValue(ENTRIES_KEY, next);
        setCustomEntries(next);
        setSavedIds((previous) => previous.filter((savedId) => savedId !== id));
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
                                    savedIds={savedIds}
                                    onToggleSave={toggleSave}
                                    onAddEntry={addEntry}
                                    onDeleteEntry={deleteEntry}
                                />
                            }
                        />
                        <Route path="stage" element={<StagePage entries={entries} references={references} savedIds={savedIds} />} />
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
