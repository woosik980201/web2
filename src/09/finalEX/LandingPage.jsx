
import React, { useState } from "react";
import Toolbar from "./Toolbar";
import dogImage from "./강아지.jpg";
import "./LandingPage.css";

function LandingPage() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const loginClick = () => {
        setIsLoggedIn(true);
    };

    const logoutClick = () => {
        setIsLoggedIn(false);
    };

    return (
        <div className="landing-page">

            <Toolbar
                isLoggedIn={isLoggedIn}
                loginClick={loginClick}
                logoutClick={logoutClick}
            />

            <main className="landing-content">
                <div className="landing-text">
                    <span className="landing-label">
                        REACT CHAPTER 09
                    </span>

                    <h1 className="landing-title">
                        Conditional<br />
                        <span>Rendering.</span>
                    </h1>

                    <p className="landing-description">
                        9장 조건부 렌더링 실습 화면입니다.
                        <br />
                        로그인 상태에 따라 화면이 변경되는
                        React 컴포넌트를 구현했습니다.
                    </p>
                </div>

                <div className="landing-image-wrapper">
                    <div className="landing-image-card">
                        <img
                            className="landing-image"
                            src={dogImage}
                            alt="강아지"
                        />
                        <div className="landing-image-caption">
                            🐶 Welcome to React Practice
                        </div>
                    </div>
                </div>
            </main>

        </div>
    );
}

export default LandingPage;
