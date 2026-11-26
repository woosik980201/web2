import React, { useContext } from "react";
import ThemeContext from "./ThemeContext";

function DarkOrLight() {
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <section>
            <p>현재 테마: {theme === "light" ? "라이트 모드" : "다크 모드"}</p>

            <button onClick={toggleTheme}>
                테마 바꾸기
            </button>
        </section>
    );
}

export default DarkOrLight;