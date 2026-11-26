import React, { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import ThemeContext from "../../context/ThemeContext";

// 두 페이지가 함께 쓰는 머리글. 페이지가 바뀌어도 Layout 안에서 한 번만 그려진다.
const menus = [
    { to: "/", label: "Archive" },
    { to: "/stage", label: "Stage" },
];

function Header({ savedCount }) {
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <header className="header">
            <Link to="/" className="logo">SSIKHIVE</Link>

            {/* NavLink는 지금 주소와 같으면 active 클래스를 붙여 준다. end: "/"가 모든 주소에 걸리지 않게 */}
            <nav className="nav" aria-label="주요 메뉴">
                {menus.map((menu) => (
                    <NavLink key={menu.to} to={menu.to} end={menu.to === "/"}>
                        {menu.label}
                    </NavLink>
                ))}
            </nav>

            <div className="header-meta">
                {/* 1학기에는 저장 개수만 알려 줬다. 이제 누르면 Archive를 "Dive in" 보기로 연다 */}
                <Link to="/" state={{ view: "saved" }} className="meta-link" aria-label={"Dive in으로 고른 기록 " + savedCount + "개 보기"}>
                    dive in <b>{String(savedCount).padStart(2, "0")}</b>
                </Link>
                <button
                    type="button"
                    className="meta-link"
                    aria-label={theme === "light" ? "어두운 화면으로 바꾸기" : "종이 화면으로 바꾸기"}
                    onClick={toggleTheme}
                >
                    ◐ {theme === "light" ? "dark" : "paper"}
                </button>
            </div>
        </header>
    );
}

export default Header;
