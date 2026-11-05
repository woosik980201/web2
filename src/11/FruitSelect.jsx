
import React, { useState } from "react";
import "./FruitSelect.css";

const fruits = {
    apple: { name: "APPLE", emoji: "🍎", color: "#ffc9b5" },
    banana: { name: "BANANA", emoji: "🍌", color: "#fff3bd" },
    grapes: { name: "GRAPE", emoji: "🍇", color: "#d7b8ef" },
    melon: { name: "MELON", emoji: "🍈", color: "#bce5a4" },
};

function FruitSelect() {
    const [value, setValue] = useState("apple");
    const [submitted, setSubmitted] = useState("");

    const handleChange = (event) => {
        setValue(event.target.value);
        setSubmitted("");
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setSubmitted(value);
    };

    return (
        <div className="fruity-page">
            <main className="fruity-shop">
                <header className="fruity-header">
                    <span>WELCOME TO THE FRUIT CLUB!</span>
                    <h1>FRUITY CLUB</h1>
                    <p>PICK YOUR FRUITY FRIEND</p>
                </header>

                <div className="fruity-characters">
                    {Object.entries(fruits).map(([key, fruit]) => (
                        <div
                            key={key}
                            className={`fruit-character ${value === key ? "selected" : ""}`}
                            style={{ backgroundColor: fruit.color }}
                            onClick={() => {
                                setValue(key);
                                setSubmitted("");
                            }}
                        >
                            <span>{fruit.emoji}</span>
                            <small>{fruit.name}</small>
                        </div>
                    ))}
                </div>

                <section className="fruity-form-card">
                    <div className="fruity-sticker">100% FUN!</div>

                    <h2>WHO'S YOUR FRUIT?</h2>
                    <p>오늘의 과일 친구를 골라봐!</p>

                    <form onSubmit={handleSubmit}>
                        <label htmlFor="fruit-select">
                            CHOOSE YOUR FRIEND
                        </label>

                        <select
                            id="fruit-select"
                            value={value}
                            onChange={handleChange}
                        >
                            <option value="apple">🍎 APPLE</option>
                            <option value="banana">🍌 BANANA</option>
                            <option value="grapes">🍇 GRAPE</option>
                            <option value="melon">🍈 MELON</option>
                        </select>

                        <button type="submit">
                            PICK MY FRUIT!
                        </button>
                    </form>

                    {submitted && (
                        <div className="fruity-result">
                            YOU PICKED {fruits[submitted].name}!
                            <span>{fruits[submitted].emoji}</span>
                        </div>
                    )}
                </section>

                <footer className="fruity-footer">
                    STAY FRESH. STAY FUN.
                    <span>© FRUITY CLUB</span>
                </footer>
            </main>
        </div>
    );
}

export default FruitSelect;
