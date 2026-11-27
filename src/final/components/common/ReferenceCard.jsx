import React from "react";
import NodeTag from "./NodeTag";
import { tiltOf, offsetOf } from "../../utils/tilt";

// 레퍼런스 한 개 = 종이에 붙인 조각 하나.
// 카드는 자기가 어디에 쓰이는지 모른다. 버튼의 글자와 눌렀을 때 할 일을 props로 받기 때문에
// 지금은 Archive에서 "Dive in"(더 파고들 것 고르기) 카드로 쓴다. 다른 화면에서 다른 동작이 필요하면 props만 바꿔 넘기면 된다.
//
// item        : 레퍼런스 데이터 한 건
// isActive    : 버튼이 켜진 상태인지 (Dive in으로 골랐는지)
// activeLabel, inactiveLabel : 상태에 따른 버튼 글자
// onAction    : 버튼을 누르면 item.id를 넘겨 부른다
// onOpen      : (선택) 카드를 누르면 상세 보기를 연다. 없으면 카드 본문은 눌리지 않는다
// flag        : (선택) 방금 추가하거나 고친 기록에 붙일 표시 글자 ("new", "edited"). 잠깐 강조도 된다
function ReferenceCard({ item, isActive, activeLabel, inactiveLabel, onAction, onOpen, flag }) {
    // 콜라주 느낌: 카드마다 조금씩 다른 기울기와 높이 (id로 정해서 새로고침해도 같음)
    const style = {
        "--tilt": tiltOf(item.id, 3) + "deg",
        "--offset": offsetOf(item.id, 10) + "px",
    };

    // 대표 이미지 = images의 첫 장 (없으면 쪽지로)
    const cover = item.images[0];

    const body = (
        <>
            {cover ? (
                <div className="card-photo">
                    <img src={cover.src} alt={cover.caption || item.title} />
                </div>
            ) : (
                // 이미지가 아직 없는 기록은 찢은 종이 쪽지로 (새 SA 기록을 이미지 없이 먼저 넣었을 때)
                <div className="card-photo slip" aria-hidden="true">
                    <span>{item.title}</span>
                </div>
            )}
            <h3 className="card-title">{item.title}</h3>
            <p className="card-desc">{item.description}</p>
            {item.images.length > 1 && <p className="meta card-count">{item.images.length} frames</p>}
            <NodeTag domain={item.domain} id={item.id} />
        </>
    );

    return (
        <article
            className={"paper ref-card" + (isActive ? " is-active" : "") + (flag ? " is-new" : "")}
            style={style}
        >
            {flag && <span className="new-flag">{flag}</span>}
            <span className="port in" aria-hidden="true" />
            <span className="port out" aria-hidden="true" />

            {onOpen ? (
                <button type="button" className="card-body" onClick={() => onOpen(item)}>
                    {body}
                </button>
            ) : (
                <div className="card-body">{body}</div>
            )}

            <button
                type="button"
                className="card-action"
                aria-pressed={isActive}
                aria-label={(isActive ? activeLabel : inactiveLabel) + " — " + item.title}
                onClick={() => onAction(item.id)}
            >
                {isActive ? activeLabel : inactiveLabel}
            </button>
        </article>
    );
}

export default ReferenceCard;
