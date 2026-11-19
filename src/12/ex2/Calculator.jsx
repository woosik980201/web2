
import React, { useState } from "react";
import BoilingVerdict from "./BoilingVerdict";
import "./Calculator.css";

function Calculator(props) {
    const [temperature, setTemperature] = useState('');

    const handleChange = (event) => {
        setTemperature(event.target.value);
    };

    return (
        <div className="calculator-container">
            <div className="calculator-card">
                <h1>🌡️ 온도 계산기</h1>
                <p className="subtitle">
                    Temperature Calculator
                </p>

                <fieldset>
                    <legend>섭씨 온도를 입력하세요 (°C)</legend>
                    <input
                        type="number"
                        value={temperature}
                        onChange={handleChange}
                        placeholder="온도를 입력하세요"
                    />
                </fieldset>

                <BoilingVerdict
                    celsius={parseFloat(temperature)}
                />
            </div>
        </div>
    );
}

export default Calculator;
