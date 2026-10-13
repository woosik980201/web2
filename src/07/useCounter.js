import { useState } from "react";

// Custom Hook(사용자 정의 훅)
function useCounter(initialValue) {
    const [count, setCount] = useState(initialValue);

    const increaseCount = () => {
        setCount((prev) => Math.min(prev + 1, 10));
    };

    const decreaseCount = () => {
        setCount((prev) => Math.max(prev - 1, 0));
    };

    return [count, increaseCount, decreaseCount];
}

export default useCounter;
