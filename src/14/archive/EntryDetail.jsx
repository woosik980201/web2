import React from "react";

// Enter로 들어온 기록 한 건의 페이지
function EntryDetail({ entry, onBack }) {
    return (
        <div className="sa-detail" role="dialog" aria-modal="true" aria-label={entry.title}>
            <div className="sa-detail-inner">
                <button className="sa-back" onClick={onBack}>← 콜라주로 돌아가기 (ESC)</button>
                <p className="sa-detail-meta">{entry.id} · {entry.domain} · {entry.captured}</p>
                <h2>{entry.title}</h2>
                <p className="sa-detail-credits">{entry.credits}</p>

                <div className="sa-detail-body">
                    <div className="sa-detail-text">
                        <h3>왜 끌렸나</h3>
                        <p>{entry.why}</p>
                        {entry.question && (
                            <>
                                <h3>디깅 질문</h3>
                                <p className="sa-question">{entry.question}</p>
                            </>
                        )}
                        <a href={entry.url} target="_blank" rel="noreferrer">원본 보러 가기 ↗</a>
                        <p className="sa-rights">이미지 권리: {entry.rights}</p>
                    </div>

                    <div className="sa-detail-images">
                        {entry.images.length === 0 && (
                            <p className="sa-empty">아직 모아 둔 이미지가 없는 기록이에요.</p>
                        )}
                        {entry.images.map((image, index) => (
                            <figure key={image.caption} className={index % 2 === 0 ? "tilt-left" : "tilt-right"}>
                                <img src={image.src} alt={image.caption} />
                                <figcaption>{image.caption}</figcaption>
                            </figure>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EntryDetail;
