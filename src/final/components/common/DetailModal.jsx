import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import NodeTag from "./NodeTag";

// 레퍼런스 상세 보기. Archive에서 카드를 눌렀을 때도, Stage에서 Enter로 들어갔을 때도 이 컴포넌트 하나를 쓴다.
// 1학기에는 jQuery로 카드 안의 글자를 읽어 모달에 옮겨 담았지만, 여기서는 데이터(item)를 props로 받아 그린다.
//
// item          : 레퍼런스 한 건
// onClose       : 닫기 (×, 바깥 클릭, ESC)
// showStageLink : true면 "무대에서 보기" 버튼을 보여 준다 (Stage 안에서는 필요 없음)
// onEdit        : (선택) 넘겨주면 "수정" 버튼이 생긴다
// onDelete      : (선택) 넘겨주면 "기록 지우기" 버튼이 생긴다. 누르면 한 번 더 묻고 지운다
function DetailModal({ item, onClose, showStageLink, onEdit, onDelete }) {
    const closeRef = useRef(null);
    const [confirming, setConfirming] = useState(false); // "정말 지울까요?"를 보여 주는 중인지

    // 열릴 때: 키보드 포커스를 창 안(닫기 버튼)으로 옮기고, 뒤 페이지가 같이 스크롤되지 않게 막는다.
    // 닫힐 때(cleanup): 스크롤을 풀고, 창을 열기 전에 포커스가 있던 곳(누른 카드)으로 돌려준다.
    useEffect(() => {
        const before = document.activeElement;
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        if (closeRef.current) closeRef.current.focus();
        return () => {
            document.body.style.overflow = prevOverflow;
            if (before && before.focus) before.focus();
        };
    }, []);

    // ESC 키로 닫기. 창이 사라질 때(cleanup) 이벤트를 꼭 떼어 낸다.
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    return (
        <div className="modal" onClick={onClose}>
            <div
                className="paper modal-sheet"
                role="dialog"
                aria-modal="true"
                aria-label={item.title}
                onClick={(event) => event.stopPropagation()}
            >
                <button type="button" className="modal-close" aria-label="닫기 (ESC)" onClick={onClose} ref={closeRef}>
                    ×
                </button>

                <div className="modal-text">
                    <NodeTag domain={item.domain} id={item.id} />
                    <h3>{item.title}</h3>
                    <p className="modal-desc">{item.description}</p>

                    <div className="archive-note">
                        <p className="meta">why · {item.archive.captured}</p>
                        <p>{item.archive.why}</p>
                        {item.archive.question && (
                            <>
                                <p className="meta">digging question</p>
                                <p className="question">{item.archive.question}</p>
                            </>
                        )}
                    </div>

                    {/* 권리 상태(item.rights)는 데이터와 CREDITS.md에 남겨 두고, 화면에서는 꼬리글 한 줄로 한 번만 말한다 */}
                    <div className="actions">
                        {item.link && (
                            <a className="stamp" href={item.link} target="_blank" rel="noreferrer">
                                원본 보기 ↗
                            </a>
                        )}
                        {showStageLink && (
                            <Link className="tab" to="/stage">무대에서 보기 →</Link>
                        )}
                        {onEdit && !confirming && (
                            <button type="button" className="tab" onClick={() => onEdit(item)}>수정</button>
                        )}
                        {onDelete && !confirming && (
                            <button type="button" className="tab danger" onClick={() => setConfirming(true)}>
                                기록 지우기
                            </button>
                        )}
                        {onDelete && confirming && (
                            <span className="confirm-delete" role="group" aria-label="지우기 확인">
                                <span>정말 지울까요?</span>
                                <button type="button" className="stamp" onClick={() => onDelete(item.id)}>지우기</button>
                                <button type="button" className="tab" onClick={() => setConfirming(false)}>취소</button>
                            </span>
                        )}
                    </div>
                </div>

                {/* 기록에 모아 둔 장면 이미지 전부 */}
                <div className="modal-gallery">
                    {item.images.map((image, index) => (
                        <figure key={index} className={"paper " + (index % 2 === 0 ? "tilt-left" : "tilt-right")}>
                            <img src={image.src} alt={image.caption} />
                            <figcaption className="meta">{image.caption}</figcaption>
                        </figure>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default DetailModal;
