import React from "react";
import { Link } from "react-router-dom";
import heroImage from "../../assets/hero.jpg";

// Archive 맨 위 소개 영역.
// 구성은 참고 사이트(Future Bless Studio)의 뼈대를 따른다: 큰 이름 → 색 있는 부제 → 가는 선 → "라벨: 값" 격자.
// 이미지: Higgsfield(Nano Banana 2)로 만든 생성형 이미지, 2026-11-26.
// 카드에 쓰는 SA 이미지와 겹치지 않게, 특정 작품 대신 아카이브의 "재료"(필름·원단·테이프·파형·종이)를 놓은 정물로 만들었다.

function Hero({ references }) {
    const total = references.length;
    // 가장 최근에 기록한 날짜 ("2026.11.25" 꼴이라 글자 순서로 비교해도 된다). 새 기록을 추가하면 같이 바뀐다.
    const lastCaptured = references.map((item) => item.archive.captured).sort().pop();

    const facts = [
        { label: "Format", value: "Personal archive" },
        { label: "References", value: total + " entries" },
        { label: "Domains", value: "Film · Music · Fashion · Art" },
        { label: "Last captured", value: lastCaptured },
        { label: "Curated by", value: "Woosik Park" },
        { label: "Each entry keeps", value: "Why it caught me · Next question" },
    ];

    return (
        <section className="hero">
            <h1 className="wordmark">SSIKHIVE</h1>
            <p className="hero-sub">Sensory Archive — Visual &amp; Sound</p>

            <div className="hero-grid">
                <div className="hero-info">
                    <dl className="facts">
                        {facts.map((fact) => (
                            <div key={fact.label} className="fact">
                                <dt>{fact.label}:</dt>
                                <dd>{fact.value}</dd>
                            </div>
                        ))}
                    </dl>
                    <div className="actions">
                        <a href="#index" className="stamp">Explore archive ↓</a>
                        <Link to="/stage" className="tab">Walk the stage →</Link>
                    </div>
                </div>

                <figure className="paper hero-photo">
                    <img src={heroImage} alt="필름, 원단, 카세트테이프, 소리 파형, 말린 꽃을 종이 위에 테이프로 붙여 둔 작업대" />
                    <figcaption className="meta">fig. 00 — materials</figcaption>
                </figure>
            </div>
        </section>
    );
}

export default Hero;
