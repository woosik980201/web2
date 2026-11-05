
import React, { useState } from "react";
import "./AttendanceCardBook.css";

const initialStudents = [
    {
        id: "PL-001",
        name: "Inje",
        grade: 1,
        major: "인공지능소프트웨어학과",
        image: "https://randomuser.me/api/portraits/women/50.jpg",
        ready: true,
    },
    {
        id: "PL-002",
        name: "Steve",
        grade: 2,
        major: "컴퓨터공학과",
        image: "https://randomuser.me/api/portraits/men/12.jpg",
        ready: false,
    },
    {
        id: "PL-003",
        name: "Bill",
        grade: 1,
        major: "정보보안학과",
        image: "https://randomuser.me/api/portraits/men/13.jpg",
        ready: true,
    },
    {
        id: "PL-004",
        name: "Jeff",
        grade: 3,
        major: "게임소프트웨어학과",
        image: "https://randomuser.me/api/portraits/men/14.jpg",
        ready: false,
    },
];

function AttendanceCardBook() {
    const [students, setStudents] = useState(initialStudents);

    const readyCount = students.filter(
        (student) => student.ready
    ).length;

    const allReady = readyCount === students.length;

    const toggleReady = (id) => {
        setStudents((prev) =>
            prev.map((student) =>
                student.id === id
                    ? { ...student, ready: !student.ready }
                    : student
            )
        );
    };

    return (
        <div className="card-lobby-page">
            <div className="card-lobby-container">

                <header className="card-lobby-header">
                    <div className="card-lobby-brand">
                        <div className="card-brand-symbol">L</div>
                        <div>
                            <h2>CLASS LOBBY</h2>
                            <span>MULTIPLAYER SESSION</span>
                        </div>
                    </div>
                    <span className="card-lobby-number">
                        LOBBY 01
                    </span>
                </header>

                <section className="card-lobby-intro">
                    <div>
                        <span className="card-section-label">
                            CURRENT SESSION
                        </span>
                        <h1>출석 대기실</h1>
                        <p>Waiting for all players...</p>
                    </div>

                    <div className="card-player-counter">
                        <strong>
                            {String(readyCount).padStart(2, "0")}
                            <span>/</span>
                            {String(students.length).padStart(2, "0")}
                        </strong>
                        <small>READY PLAYERS</small>
                    </div>
                </section>

                <div className="card-list-heading">
                    <span>PLAYER LIST</span>
                    <span>{students.length} SLOTS</span>
                </div>

                <ul className="card-player-list">
                    {students.map((student, index) => (
                        <li
                            className="card-player-row"
                            key={student.id}
                        >
                            <span className="card-player-index">
                                {String(index + 1).padStart(2, "0")}
                            </span>

                            <img
                                className="card-player-photo"
                                src={student.image}
                                alt={`${student.name} 프로필`}
                            />

                            <div className="card-player-details">
                                <strong>{student.name}</strong>
                                <span>{student.id}</span>
                                <p className="card-player-major">
                                    {student.grade}학년 · {student.major}
                                </p>
                            </div>

                            <button
                                type="button"
                                className={
                                    student.ready
                                        ? "card-ready-button is-ready"
                                        : "card-ready-button"
                                }
                                onClick={() => toggleReady(student.id)}
                            >
                                <span className="card-status-dot"></span>
                                {student.ready ? "READY" : "NOT READY"}
                            </button>
                        </li>
                    ))}
                </ul>

                <div className={
                    allReady
                        ? "card-lobby-status all-ready"
                        : "card-lobby-status waiting"
                }>
                    {allReady
                        ? "✓ ALL PLAYERS READY"
                        : "WAITING FOR PLAYERS"}
                </div>

                <footer className="card-lobby-footer">
                    SESSION STATUS
                    <span>● CONNECTED</span>
                </footer>

            </div>
        </div>
    );
}

export default AttendanceCardBook;
