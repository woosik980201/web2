import React from "react";
import ReferenceCard from "../common/ReferenceCard";

// 섹션 하나(제목 + 카드 목록). 지금은 Digging Log 하나
// 섹션을 이 컴포넌트 하나로 그린다. (13장 TravelPage의 StaySection과 같은 방식)
// 머리 부분은 참고 사이트의 목록 한 줄처럼: 왼쪽 라벨 | 가운데 큰 제목 | 오른쪽 개수
//
// section     : sections 데이터 한 건 (key, title, description)
// index       : 섹션 번호 (01, 02 …)
// items       : 이 섹션에 보일 레퍼런스들 (이미 필터를 거친 것)
// savedIds    : 저장한 레퍼런스 id 목록
// onToggleSave, onOpen : 카드에 그대로 넘겨 줄 함수
// flash       : 방금 추가하거나 고친 기록 { id, label } (그 카드에 new / edited 표시)
function ReferenceSection({ section, index, items, savedIds, onToggleSave, onOpen, flash }) {
    return (
        <section id={section.key} className={"section section-" + section.key}>
            <div className="section-head">
                <p className="section-num">Index {String(index).padStart(2, "0")}</p>
                <div>
                    <h2>{section.title}</h2>
                    <p className="section-desc">{section.description}</p>
                </div>
                <p className="section-count">{items.length} {items.length === 1 ? "entry" : "entries"}</p>
            </div>

            <div className="card-grid">
                {items.map((item) => (
                    <ReferenceCard
                        key={item.id}
                        item={item}
                        isActive={savedIds.includes(item.id)}
                        activeLabel="● Dive in"
                        inactiveLabel="＋ Dive in"
                        onAction={onToggleSave}
                        onOpen={onOpen}
                        flag={flash && flash.id === item.id ? flash.label : undefined}
                    />
                ))}
            </div>
        </section>
    );
}

export default ReferenceSection;
