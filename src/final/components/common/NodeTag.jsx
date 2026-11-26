import React from "react";

// 분류 이름표. TouchDesigner 노드 화면의 오퍼레이터 종류 표시에서 착안했다.
// 소리(music)는 CHOP, 시각 자료(fashion·film·art·culture)는 TOP — SENSORY ARCHIVE와 같은 규칙.
export function operatorOf(domain) {
    return domain === "music" ? "CHOP" : "TOP";
}

function NodeTag({ domain, id }) {
    const op = operatorOf(domain);
    return (
        <span className="node-tag">
            <b className={"op op-" + op.toLowerCase()}>{op}</b>
            <span>{id}</span>
            <span>{domain}</span>
        </span>
    );
}

export default NodeTag;
