import React from "react";

// 파라미터 창: 지금 화면의 상태를 "이름 값" 한 줄씩 보여 준다.
// TouchDesigner 파라미터 창에서 착안. 페이지마다 rows만 다르게 넘겨 같은 컴포넌트를 쓴다.
// rows: [{ key: "layout", value: "scatter", live: true }]  — live면 값을 강조색으로
function ParamsPanel({ title, rows }) {
    return (
        <dl className="params" aria-label={title}>
            <dt className="params-title">{title}</dt>
            <dd className="params-title" aria-hidden="true" />
            {rows.map((row) => (
                <React.Fragment key={row.key}>
                    <dt>{row.key}</dt>
                    <dd className={row.live ? "live" : ""}>{row.value}</dd>
                </React.Fragment>
            ))}
        </dl>
    );
}

export default ParamsPanel;
