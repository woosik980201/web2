
import React from "react";

function Toolbar(props) {
    const { isLoggedIn, loginClick, logoutClick } = props;

    return (
        <header className="landing-toolbar">
            <div className="landing-logo">
                REACT LAB.
            </div>

            <div className="landing-toolbar-right">
                <span className={
                    isLoggedIn
                        ? "landing-status active"
                        : "landing-status"
                }>
                    {isLoggedIn ? "ONLINE" : "GUEST"}
                </span>

                {isLoggedIn && (
                    <span className="landing-welcome">
                        환영합니다.
                    </span>
                )}

                {isLoggedIn ? (
                    <button
                        className="landing-button logout"
                        onClick={logoutClick}
                    >
                        로그아웃
                    </button>
                ) : (
                    <button
                        className="landing-button"
                        onClick={loginClick}
                    >
                        로그인
                    </button>
                )}
            </div>
        </header>
    );
}

export default Toolbar;
