import React from "react";

export default function TravelCard({ stay, onToggleLike }) {
    return (
        <article className="travel-card">
            <h3>{stay.title}</h3>

            {stay.image && (
                <img
                    className="travel-card-image"
                    src={stay.image}
                    alt={stay.imageAlt || stay.title}
                />
            )}

            <p>{stay.description}</p>
            <p>1박 {stay.price.toLocaleString("ko-KR")}원</p>

            <button
                type="button"
                aria-pressed={stay.liked}
                onClick={() => onToggleLike(stay.id)}
            >
                {stay.liked ? "♥ 찜 취소" : "♡ 찜하기"}
            </button>

            {stay.imageCredit && (
                <p className="travel-card-credit">
                    사진 <a href={stay.imageCredit.source}>{stay.imageCredit.author}</a>
                    {" · "}
                    <a href={stay.imageCredit.license}>CC BY-SA 4.0</a>
                </p>
            )}
        </article>
    );
}