
import React, { useState } from "react";
import WarningBanner from "./WarningBanner";
import "./MainPage.css";

function MainPage() {
    const [showWarning, setShowWarning] = useState(false);

    const btnListener = () => {
        setShowWarning(prevShowWarning => !prevShowWarning);
    };

    return (
        <div className="main-container">
            <div className="main-card">

                <div className={
                    showWarning ? "main-icon active" : "main-icon"
                }>
                    {showWarning ? "⚠️" : "🛡️"}
                </div>

                <h1 className="main-title">
                    {showWarning ? "WARNING ACTIVE" : "SYSTEM READY"}
                </h1>

                <p className="main-subtitle">
                    {showWarning
                        ? "경고 메시지가 활성화되었습니다."
                        : "현재 활성화된 경고가 없습니다."}
                </p>

                <WarningBanner warning={showWarning} />

                <button
                    className={
                        showWarning
                            ? "main-button warning-active"
                            : "main-button"
                    }
                    onClick={btnListener}
                >
                    {showWarning ? "경고 감추기" : "경고 보이기"}
                </button>

                <p className="main-footer">
                    REACT · CONDITIONAL RENDERING
                </p>

            </div>
        </div>
    );
}

export default MainPage;
