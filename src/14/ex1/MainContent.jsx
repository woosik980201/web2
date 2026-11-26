import React, { useState } from "react";
import ThemeContext from "./ThemeContext";
import DarkOrLight from "./DarkOrLight";

function MainContent() {
    const [theme, setTheme] = useState("light");

    const toggleTheme = () => {
        setTheme((currentTheme) =>
            currentTheme === "light" ? "dark" : "light"
        );
    };

    const pageStyle = {
        minHeight: "100vh",
        padding: "30px",
        backgroundColor: theme === "light" ? "#ffffff" : "#222222",
        color: theme === "light" ? "#222222" : "#ffffff",
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <main style={pageStyle}>
                <h1>테마 변경 실습</h1>
                <DarkOrLight />
            </main>
        </ThemeContext.Provider>
    );
}

export default MainContent;