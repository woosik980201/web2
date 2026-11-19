
import React from "react";

function BoilingVerdict(props) {
    if (props.celsius >= 100) {
        return (
            <div className="result boiling">
                <span className="result-icon">🔥</span>
                <p>물이 끓습니다!</p>
            </div>
        );
    }

    return (
        <div className="result normal">
            <span className="result-icon">❄️</span>
            <p>물이 끓지 않습니다.</p>
        </div>
    );
}

export default BoilingVerdict;
