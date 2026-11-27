import React, { useEffect } from "react";

// 이미지 크게 보기. 기록 폼에서 붙인 이미지를 눌렀을 때 화면 가득 띄운다.
// 어떤 이미지를 보고 있는지(index)는 부모가 state로 갖고, 여기서는 받아서 그리기만 한다.
//
// images          : [{ src, caption }]
// index           : 지금 보여 줄 이미지 번호
// onChange(index) : 다른 이미지로 넘길 때 부모에게 알린다
// onClose         : 닫기 (바탕을 누르거나 ESC)

function ImageViewer({ images, index, onChange, onClose }) {
    const many = images.length > 1;

    // 키보드: ESC로 닫고, ←/→로 넘긴다. 떠 있는 동안만 듣고, 사라질 때 cleanup에서 뗀다.
    // capture 단계에서 먼저 잡고 멈추기 때문에, 뒤에 있는 폼이나 페이지가 같은 키에 반응하지 않는다.
    useEffect(() => {
        function handleKey(event) {
            if (event.key === "Escape") onClose();
            else if (many && event.key === "ArrowRight") onChange((index + 1) % images.length);
            else if (many && event.key === "ArrowLeft") onChange((index - 1 + images.length) % images.length);
            else return;
            event.preventDefault();
            event.stopPropagation();
        }
        window.addEventListener("keydown", handleKey, true);
        return () => window.removeEventListener("keydown", handleKey, true);
    }, [images.length, index, many, onChange, onClose]);

    const image = images[index];
    if (!image) return null;

    // 화살표 버튼을 눌렀을 때 바탕의 "닫기"까지 같이 실행되지 않게 막는다
    function step(event, move) {
        event.stopPropagation();
        onChange((index + move + images.length) % images.length);
    }

    return (
        <div className="viewer" role="dialog" aria-modal="true" aria-label="이미지 크게 보기" onClick={onClose}>
            <button type="button" className="viewer-close" aria-label="닫기">×</button>
            {many && (
                <button type="button" className="viewer-step prev" onClick={(event) => step(event, -1)} aria-label="이전 이미지">←</button>
            )}
            <figure>
                <img src={image.src} alt={image.caption} />
                <figcaption>
                    {index + 1} / {images.length} — {image.caption}
                </figcaption>
            </figure>
            {many && (
                <button type="button" className="viewer-step next" onClick={(event) => step(event, 1)} aria-label="다음 이미지">→</button>
            )}
        </div>
    );
}

export default ImageViewer;
