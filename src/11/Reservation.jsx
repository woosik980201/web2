
import React, { useState } from "react";
import "./Reservation.css";

function Reservation() {
    const [haveBreakfast, setHaveBreakfast] = useState(true);
    const [numberOfGuest, setNumberOfGuest] = useState(1);
    const [submitted, setSubmitted] = useState(false);

    const guestCount = Math.min(
        8,
        Math.max(0, Number(numberOfGuest) || 0)
    );

    const handleSubmit = (event) => {
        event.preventDefault();

        if (
            !Number.isInteger(Number(numberOfGuest)) ||
            Number(numberOfGuest) < 1
        ) {
            alert("방문객 수는 1명 이상 입력해주세요.");
            return;
        }

        setSubmitted(true);
    };

    return (
        <div className="zero-page">
            <header className="zero-header">
                <div className="zero-logo">BREAKFAST / LAB</div>
                <div className="zero-header-right">
                    EXPERIMENT 001 — ZERO GRAVITY
                </div>
            </header>

            <section className="zero-hero">
                <div className="zero-hero-title">
                    <span>AN EXPERIMENTAL BREAKFAST EXPERIENCE</span>
                    <h1>
                        ZERO
                        <br />
                        GRAVITY
                        <br />
                        <em>BREAKFAST.</em>
                    </h1>
                </div>

                <div className="zero-stage">
                    <div className="zero-stage-glow"></div>

                    <div className="zero-plate">
                        <div className="zero-plate-inner"></div>
                    </div>

                    <div
                        className={
                            haveBreakfast
                                ? "zero-foods"
                                : "zero-foods zero-foods-hidden"
                        }
                    >
                        <div className="zero-food zero-egg">
                            <div className="egg-white">
                                <div className="egg-yolk"></div>
                            </div>
                        </div>

                        <div className="zero-food zero-toast">
                            <div className="toast-surface"></div>
                        </div>

                        <div className="zero-food zero-cup">
                            <div className="cup-coffee"></div>
                            <div className="cup-handle"></div>
                        </div>

                        <div className="zero-food zero-sphere"></div>
                    </div>

                    <div className="zero-stage-label label-left">
                        FIG. 01
                        <br />
                        FLOATING MEAL
                    </div>

                    <div className="zero-stage-label label-right">
                        {haveBreakfast
                            ? "BREAKFAST ACTIVE"
                            : "BREAKFAST INACTIVE"}
                    </div>
                </div>

                <div className="zero-hero-bottom">
                    <span>YOUR CHOICE CHANGES THE SCENE.</span>
                    <span>SCROLL TO PARTICIPATE ↓</span>
                </div>
            </section>

            <section className="zero-control">
                <div className="zero-control-heading">
                    <span>01 / CONFIGURATION</span>
                    <h2>
                        DESIGN YOUR
                        <br />
                        MORNING.
                    </h2>
                    <p>
                        조식 여부와 방문 인원을 선택하면
                        위의 공간이 변화합니다.
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="zero-field">
                        <div>
                            <span className="zero-field-number">01 / MEAL</span>
                            <h3>BREAKFAST</h3>
                            <p>조식 서비스를 이용하시겠습니까?</p>
                        </div>

                        <label className="zero-toggle">
                            <input
                                type="checkbox"
                                checked={haveBreakfast}
                                onChange={(event) => {
                                    setHaveBreakfast(event.target.checked);
                                    setSubmitted(false);
                                }}
                            />
                            <span className="zero-toggle-track"></span>
                            <span className="zero-toggle-text">
                                {haveBreakfast ? "ON" : "OFF"}
                            </span>
                        </label>
                    </div>

                    <div className="zero-field">
                        <div>
                            <span className="zero-field-number">
                                02 / PEOPLE
                            </span>
                            <h3>PARTICIPANTS</h3>
                            <p>방문 인원을 입력해주세요.</p>
                        </div>

                        <input
                            className="zero-number-input"
                            type="number"
                            min="1"
                            step="1"
                            value={numberOfGuest}
                            onChange={(event) => {
                                setNumberOfGuest(event.target.value);
                                setSubmitted(false);
                            }}
                        />
                    </div>

                    <div className="zero-preview">
                        <span>TABLE CONFIGURATION</span>

                        <div className="zero-mini-plates">
                            {Array.from(
                                { length: guestCount },
                                (_, index) => (
                                    <div
                                        key={index}
                                        className="zero-mini-plate"
                                    >
                                        {haveBreakfast ? "●" : "○"}
                                    </div>
                                )
                            )}
                        </div>

                        <p>
                            {numberOfGuest} PARTICIPANT(S) /
                            {haveBreakfast
                                ? " BREAKFAST INCLUDED"
                                : " NO BREAKFAST"}
                        </p>
                        {Number(numberOfGuest) > 8 && (
                            <small>
                                미리보기는 최대 8명까지 표시됩니다.
                            </small>
                        )}
                    </div>

                    <button className="zero-submit" type="submit">
                        <span>CONFIRM EXPERIENCE</span>
                        <span>↗</span>
                    </button>
                </form>

                {submitted && (
                    <div className="zero-result">
                        <span>EXPERIMENT CONFIRMED</span>
                        <h3>YOUR MORNING IS READY.</h3>
                        <p>
                            BREAKFAST —
                            {haveBreakfast ? " INCLUDED" : " NOT INCLUDED"}
                        </p>
                        <p>PARTICIPANTS — {numberOfGuest}</p>
                    </div>
                )}
            </section>

            <footer className="zero-footer">
                <span>BREAKFAST / LAB</span>
                <span>AN EXPERIMENT IN THE ORDINARY.</span>
                <span>2026</span>
            </footer>
        </div>
    );
}

export default Reservation;
