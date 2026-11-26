import React, { useState, useEffect, useCallback } from "react";
import ShoppingThemeContext from "../ex2/ShoppingThemeContext";
import ThemeModeButton from "../ex2/ThemeModeButton";
import archiveEntries from "./archiveData";
import CollageStage from "./CollageStage";
import EntryDetail from "./EntryDetail";
import "./ArchivePage.css";

const DOMAINS = ["전체", "film", "music", "fashion", "art"];

function ArchivePage() {
    const [theme, setTheme] = useState("light");
    const [selectedDomain, setSelectedDomain] = useState("전체");
    const [viewType, setViewType] = useState("collage");
    const [openId, setOpenId] = useState(null);

    const toggleTheme = () => {
        setTheme((currentTheme) => currentTheme === "light" ? "dark" : "light");
    };

    // CollageStage의 useEffect가 매 렌더마다 다시 걸리지 않도록 함수를 고정한다
    const handleEnter = useCallback((entryId) => setOpenId(entryId), []);

    // 들어간 페이지에서는 ESC로 나온다
    useEffect(() => {
        if (openId === null) return;
        const handleKeyDown = (e) => {
            if (e.key === "Escape") setOpenId(null);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [openId]);

    const openEntry = archiveEntries.find((entry) => entry.id === openId);
    const listedEntries = selectedDomain === "전체"
        ? archiveEntries
        : archiveEntries.filter((entry) => entry.domain === selectedDomain);

    return (
        <ShoppingThemeContext.Provider value={{ theme, toggleTheme }}>
            <div className={"archive-page " + theme}>
                <header className="sa-header">
                    <a className="sa-logo" href="#top">SENSORY ARCHIVE</a>
                    <span className="sa-sub">Visual &amp; Sound · Phase 0</span>
                    <ThemeModeButton />
                </header>

                <main className="sa-main">
                    <div className="sa-toolbar">
                        <div className="sa-filters" aria-label="분야">
                            {DOMAINS.map((domain) => (
                                <button
                                    key={domain}
                                    className={selectedDomain === domain ? "selected" : ""}
                                    onClick={() => setSelectedDomain(domain)}
                                >
                                    {domain}
                                </button>
                            ))}
                        </div>
                        <span className="sa-count">기록 <strong>{listedEntries.length}</strong>개</span>
                        <div className="sa-views">
                            <button className={viewType === "collage" ? "selected" : ""} onClick={() => setViewType("collage")}>콜라주</button>
                            <button className={viewType === "list" ? "selected" : ""} onClick={() => setViewType("list")}>목록</button>
                        </div>
                    </div>

                    {viewType === "collage" ? (
                        <CollageStage
                            entries={archiveEntries}
                            selectedDomain={selectedDomain}
                            paused={openId !== null}
                            onEnter={handleEnter}
                        />
                    ) : (
                        <ul className="sa-list">
                            {listedEntries.map((entry) => (
                                <li key={entry.id}>
                                    <button onClick={() => setOpenId(entry.id)}>
                                        <span>{entry.id}</span>
                                        <strong>{entry.title}</strong>
                                        <span>{entry.domain} · {entry.captured}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </main>

                {openEntry && <EntryDetail entry={openEntry} onBack={() => setOpenId(null)} />}
            </div>
        </ShoppingThemeContext.Provider>
    );
}

export default ArchivePage;
