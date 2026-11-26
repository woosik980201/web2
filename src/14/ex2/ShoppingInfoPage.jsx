import React, { useState, useEffect } from "react";
import ShoppingThemeContext from "./ShoppingThemeContext";
import ThemeModeButton from "./ThemeModeButton";
import WalkingShopper from "./WalkingShopper";
import "./ShoppingInfoPage.css";

const shoppingEvents = [
    { id: 1, category: "세일", brand: "SEASON OFF", title: "시즌 오프", date: "26.11.12(목) - 26.11.29(일)", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=85" },
    { id: 2, category: "세일", brand: "SPECIAL PRICE", title: "겨울 시즌 세일", date: "26.11.20(금) - 26.12.06(일)", image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=85" },
    { id: 3, category: "이벤트/팝업", brand: "OPEN STAGE", title: "윈터 스타일 팝업", date: "26.11.20(금) - 26.12.10(목)", image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=85" },
    { id: 4, category: "브랜드", brand: "NEW COLLECTION", title: "겨울 컬렉션", date: "26.11.18(수) - 26.12.15(화)", image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=85" },
    { id: 5, category: "이벤트/팝업", brand: "BEAUTY WEEK", title: "뷰티 위크 스페셜", date: "26.11.21(토) - 26.11.30(월)", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=85" },
    { id: 6, category: "브랜드", brand: "OBJECTS FOR WINTER", title: "겨울을 위한 오브제", date: "26.11.15(일) - 26.12.20(일)", image: "https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?auto=format&fit=crop&w=900&q=85" },
];

function ShoppingInfoPage() {
    const [theme, setTheme] = useState("light");
    const [selectedCategory, setSelectedCategory] = useState("전체");
    const [viewType, setViewType] = useState("grid");
    const [highlightedId, setHighlightedId] = useState(null);

    const toggleTheme = () => {
        setTheme((currentTheme) => currentTheme === "light" ? "dark" : "light");
    };

    // 걷는 사람이 추천한 행사로 이동: 필터를 풀고 해당 카드를 강조
    const handlePick = (eventId) => {
        setSelectedCategory("전체");
        setHighlightedId(eventId);
    };

    useEffect(() => {
        if (highlightedId === null) return;
        const card = document.getElementById("event-" + highlightedId);
        if (card) card.scrollIntoView({ behavior: "smooth", block: "center" });
        const timer = setTimeout(() => setHighlightedId(null), 2500);
        return () => clearTimeout(timer);
    }, [highlightedId]);

    const filteredEvents = selectedCategory === "전체"
        ? shoppingEvents
        : shoppingEvents.filter((event) => event.category === selectedCategory);

    return (
        <ShoppingThemeContext.Provider value={{ theme, toggleTheme }}>
            <div className={"shopping-page " + theme}>
                <header className="site-header">
                    <a className="logo" href="#top">B-SIDE</a>
                    <nav className="main-nav" aria-label="주요 메뉴">
                        <a href="#guide">정보 안내</a>
                        <a className="active" href="#shopping">쇼핑 정보</a>
                        <a href="#brands">B-SIDE 셀렉션</a>
                        <a href="#culture">아트&컬처</a>
                        <a href="#store">매장 안내</a>
                        <a href="#service">고객 서비스</a>
                    </nav>
                    <div className="header-tools">
                        <ThemeModeButton />
                        <button className="search-button" aria-label="검색">⌕</button>
                    </div>
                </header>

                <main className="content" id="shopping">
                    <div className="breadcrumb">HOME / 쇼핑 정보</div>
                    <h1>쇼핑 정보</h1>
                    <p className="intro">B-SIDE에서 이번 주 새롭게 발견할 쇼핑 소식을 만나보세요.</p>

                    <section className="curation" aria-label="이번 주의 발견">
                        <article className="curation-main">
                            <img src={shoppingEvents[2].image} alt="윈터 스타일 팝업" />
                            <div className="curation-copy">
                                <p className="eyebrow">A WEEKLY EDIT · 01</p>
                                <h2>이번 주의 발견</h2>
                                <p>새로운 계절을 만나는 세 가지 장면</p>
                            </div>
                        </article>
                        <div className="curation-side">
                            <article className="curation-tile">
                                <img src={shoppingEvents[0].image} alt="시즌 오프 패션 행사" />
                                <div className="curation-copy">
                                    <p className="eyebrow">THE SEASON</p>
                                    <h2>시즌을 바꾸는 옷</h2>
                                </div>
                            </article>
                            <article className="curation-tile">
                                <img src={shoppingEvents[5].image} alt="겨울 오브제 행사" />
                                <div className="curation-copy">
                                    <p className="eyebrow">SMALL DETAILS</p>
                                    <h2>겨울의 작은 발견</h2>
                                </div>
                            </article>
                        </div>
                    </section>

                    <WalkingShopper events={shoppingEvents} onPick={handlePick} />

                    <div className="shopping-layout">
                        <aside className="filters">
                            <p className="filter-title">구분</p>
                            {["전체", "세일", "브랜드", "이벤트/팝업"].map((category) => (
                                <button
                                    key={category}
                                    className={selectedCategory === category ? "filter-option selected" : "filter-option"}
                                    onClick={() => setSelectedCategory(category)}
                                >
                                    {category}
                                </button>
                            ))}
                        </aside>

                        <section className="event-section">
                            <div className="list-toolbar">
                                <span>총 <strong>{filteredEvents.length}</strong>개의 쇼핑 정보</span>
                                <div className="view-buttons">
                                    <button className={viewType === "grid" ? "chosen" : ""} onClick={() => setViewType("grid")} aria-label="그리드 보기">▦</button>
                                    <button className={viewType === "list" ? "chosen" : ""} onClick={() => setViewType("list")} aria-label="목록 보기">☰</button>
                                </div>
                            </div>

                            <div className={"event-grid " + viewType}>
                                {filteredEvents.map((event) => (
                                    <article id={"event-" + event.id} className={event.id === highlightedId ? "event-card highlighted" : "event-card"} key={event.id}>
                                        <div className="event-image">
                                            <img src={event.image} alt={event.title} />
                                        </div>
                                        <div className="event-info">
                                            <p className="event-category">{event.category} | 성수점</p>
                                            <p className="event-brand">{event.brand}</p>
                                            <h2>{event.title}</h2>
                                            <p className="event-date">{event.date}</p>
                                            <p className="event-location">각 층 본매장</p>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </section>
                    </div>
                </main>
            </div>
        </ShoppingThemeContext.Provider>
    );
}

export default ShoppingInfoPage;
