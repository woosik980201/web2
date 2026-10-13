import React, { useEffect, useState } from "react";
import useCounter from "./useCounter";
import "./cc.css";

const MAX_CAPACITY = 10;

function Accommodate() {
    const [count, increaseCount, decreaseCount] = useCounter(0);
    const [isFull, setIsFull] = useState(false);

    useEffect(() => {
        console.log("=== useEffect 확인용 ===");
        console.log("=== useEffect 실행됨: 컴포넌트가 마운트될때, 업데이트될때");
        console.log(`isFull: ${isFull}`);
    });

    useEffect(() => {
        setIsFull(count >= MAX_CAPACITY);
        console.log(`Current count value: ${count}`);
    }, [count]);

    return (
        <div className={isFull ? "accommodate accommodate--full" : "accommodate"}>
            <p className="accommodate__label">CAPACITY</p>
            <p className="accommodate__count">
                {count}<span className="accommodate__max"> / {MAX_CAPACITY}</span>
            </p>
            <p className="accommodate__text">{`현재 총 ${count}명 수용중입니다.`}</p>

            <div className="accommodate__gauge">
                <div
                    className="accommodate__gauge-fill"
                    style={{ width: `${(count / MAX_CAPACITY) * 100}%` }}
                />
            </div>

            <div className="accommodate__buttons">
                <button
                    className="accommodate__btn accommodate__btn--in"
                    onClick={increaseCount}
                    disabled={isFull}
                >
                    수용시설에 입장
                </button>
                <button
                    className="accommodate__btn"
                    onClick={decreaseCount}
                    disabled={count === 0}
                >
                    수용시설에서 퇴장
                </button>
            </div>

            {isFull && <p className="accommodate__notice">수용시설에 정원이 가득 찼습니다.</p>}
        </div>
    );
}

export default Accommodate;
