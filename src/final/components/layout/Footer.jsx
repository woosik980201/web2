import React from "react";
import { Link } from "react-router-dom";

// 두 페이지가 함께 쓰는 꼬리글. 참고 사이트처럼 가는 선 아래 칸을 나눠 정보를 둔다.
// (1학기의 Spotify·Pinterest·Youtube·Instagram 글자는 주소도 없이 자리만 차지해 뺐다 — 2026-11-26 결정: 본인)

function Footer() {
    return (
        <footer className="footer">
            <p>©2026 SSIKHIVE</p>
            <p>
                Curated by Woosik Park
                <br />
                <span className="footer-muted">Personal archive of visual and sound references</span>
            </p>
            <nav className="footer-nav" aria-label="페이지 이동">
                <Link to="/">Archive</Link>
                <Link to="/stage">Stage</Link>
            </nav>
        </footer>
    );
}

export default Footer;
