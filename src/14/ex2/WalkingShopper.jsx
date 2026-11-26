import React, { useState } from "react";

// 페이지 위를 걸어다니는 쇼핑객. 누르면 멈춰서 행사 하나를 추천한다.
function WalkingShopper({ events, onPick }) {
    const [isStopped, setIsStopped] = useState(false);
    const [pickedEvent, setPickedEvent] = useState(null);
    const [bubbleSide, setBubbleSide] = useState("right");

    const handleWalkerClick = (e) => {
        if (isStopped) {
            setIsStopped(false);
            setPickedEvent(null);
            return;
        }
        // 화면 오른쪽 절반에서 멈추면 말풍선을 왼쪽에 띄워 잘리지 않게 한다
        const walkwayBox = e.currentTarget.closest(".walkway").getBoundingClientRect();
        const walkerBox = e.currentTarget.getBoundingClientRect();
        setBubbleSide(walkerBox.left - walkwayBox.left > walkwayBox.width / 2 ? "left" : "right");

        const randomIndex = Math.floor(Math.random() * events.length);
        setPickedEvent(events[randomIndex]);
        setIsStopped(true);
    };

    const handleGoClick = () => {
        onPick(pickedEvent.id);
        setIsStopped(false);
        setPickedEvent(null);
    };

    return (
        <section className="walkway" aria-label="걸어다니는 쇼핑 가이드">
            <p className="walkway-hint">{isStopped ? "다시 누르면 계속 걸어요" : "걸어가는 사람을 눌러보세요"}</p>
            <div className={isStopped ? "walker stopped" : "walker"}>
                {pickedEvent && (
                    <div className={"walker-bubble " + bubbleSide}>
                        <p className="bubble-label">이번 주의 B-side</p>
                        <p className="bubble-title">{pickedEvent.title}</p>
                        <button className="bubble-button" onClick={handleGoClick}>보러 가기 →</button>
                    </div>
                )}
                <button
                    className="walker-figure"
                    onClick={handleWalkerClick}
                    aria-pressed={isStopped}
                    aria-label={isStopped ? "다시 걷게 하기" : "쇼핑객을 멈추고 행사 추천 받기"}
                >
                    <svg viewBox="0 0 40 80" width="40" height="80" aria-hidden="true">
                        <g className="limb arm-back"><line x1="20" y1="22" x2="20" y2="40" /></g>
                        <g className="limb leg-back"><line x1="20" y1="46" x2="20" y2="74" /></g>
                        <circle className="head" cx="20" cy="10" r="7" />
                        <line x1="20" y1="17" x2="20" y2="46" />
                        <g className="limb leg-front"><line x1="20" y1="46" x2="20" y2="74" /></g>
                        <g className="limb arm-front">
                            <line x1="20" y1="22" x2="20" y2="40" />
                            <rect className="bag" x="15" y="38" width="10" height="11" rx="1" />
                        </g>
                    </svg>
                </button>
            </div>
        </section>
    );
}

export default WalkingShopper;
