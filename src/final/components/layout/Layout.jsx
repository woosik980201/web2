import React, { useContext, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import ThemeContext from "../../context/ThemeContext";
import Header from "./Header";
import Footer from "./Footer";
import Intro from "./Intro";

// 두 페이지의 틀: 머리글 + (페이지마다 바뀌는 부분) + 꼬리글
// <Outlet />자리에 지금 주소에 맞는 페이지가 들어간다.
function Layout({ savedCount }) {
    const { theme } = useContext(ThemeContext);
    const { pathname } = useLocation();

    // 페이지를 옮기면 맨 위에서 시작한다
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        <div className={"ssik-app " + theme}>
            <Intro />
            <div className="page">
                <Header savedCount={savedCount} />
                <main>
                    <Outlet />
                </main>
                <Footer />
            </div>
        </div>
    );
}

export default Layout;
