import React, { useContext } from "react";
import ShoppingThemeContext from "./ShoppingThemeContext";

function ThemeModeButton() {
    const { theme, toggleTheme } = useContext(ShoppingThemeContext);

    return (
        <button className="theme-button" onClick={toggleTheme}>
            {theme === "light" ? "다크 모드" : "라이트 모드"}
        </button>
    );
}

export default ThemeModeButton;