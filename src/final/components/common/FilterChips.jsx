import React from "react";

// 여러 선택지 중 하나를 고르는 칩 묶음.
// Discover의 분류 필터, Collage의 분류 필터와 배치 방식, Sensory의 분야 필터에서 모두 이 컴포넌트를 쓴다.
// options: [{ value, label }]  /  value: 지금 선택된 값  /  onChange: 새 값을 받는 함수
function FilterChips({ options, value, onChange, label }) {
    return (
        <div className="chips" role="group" aria-label={label}>
            {options.map((option) => (
                <button
                    key={option.value}
                    type="button"
                    className={option.value === value ? "chip active" : "chip"}
                    aria-pressed={option.value === value}
                    onClick={() => onChange(option.value)}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
}

export default FilterChips;
