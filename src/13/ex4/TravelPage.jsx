import React, { useState } from "react";
import TravelCard from "./TravelCard";
import "./TravelPage.css";

const initialStays = [
    {
        id: 1,
        region: "제주",
        title: "바다 앞 작은 집",
        image: "/stays/jeju.jpg",
        description: "독채 · 최대 2인",
        price: 120000,
        liked: false,
    },
    {
        id: 2,
        region: "제주",
        title: "귤밭 옆 스테이",
        description: "정원 · 최대 4인",
        price: 150000,
        liked: false,
    },
    {
        id: 3,
        region: "부산",
        title: "광안리 테라스",
        description: "테라스 · 최대 2인",
        price: 95000,
        liked: false,
    },
    {
        id: 4,
        region: "부산",
        title: "영도 골목 숙소",
        description: "독채 · 최대 3인",
        price: 110000,
        liked: false,
    },
];

function StaySection({ title, stays, onToggleLike }) {
    return (
        <section className="travel-section">
            <h2>{title}</h2>
            <div className="travel-grid">
                {stays.map((stay) => (
                    <TravelCard
                        key={stay.id}
                        stay={stay}
                        onToggleLike={onToggleLike}
                    />
                ))}
            </div>
        </section>
    );
}

export default function TravelPage() {
    const [stays, setStays] = useState(initialStays);

    function toggleLike(id) {
        setStays((previousStays) =>
            previousStays.map((stay) =>
                stay.id === id ? { ...stay, liked: !stay.liked } : stay
            )
        );
    }

    return (
        <main className="travel-page">
            <h1>주말에 머물 곳</h1>

            <StaySection

                title="제주에서 쉬어가기"
                stays={stays.filter((stay) => stay.region === "제주")}
                onToggleLike={toggleLike}
            />
            <StaySection
                title="부산에서 쉬어가기"
                stays={stays.filter((stay) => stay.region === "부산")}
                onToggleLike={toggleLike}
            />
        </main>
    );
}