import React from "react";

// 다크/라이트 테마를 앱 전체에 나눠 주는 Context (14장 Context 실습과 같은 방식)
// value 모양: { theme: "light" | "dark", toggleTheme: 함수 }
const ThemeContext = React.createContext({
    theme: "light",
    toggleTheme: () => {},
});

export default ThemeContext;
