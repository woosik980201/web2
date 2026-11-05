
import React, { useState } from "react";
import "./AttendanceBook.css";

const initialStudents = [
    { id: 1, name: "Inje", ready: true },
    { id: 2, name: "Steve", ready: true },
    { id: 3, name: "Bill", ready: true },
    { id: 4, name: "Jeff", ready: true },
];

function AttendanceBook() {
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
        <div className="lobby-page">
            <div className="lobby-container">
                <header className="lobby-header">
                    <div className="lobby-brand">
                        <div className="brand-symbol">L</div>
                        <div>
                            <h2>CLASS LOBBY</h2>
                            <span>MULTIPLAYER SESSION</span>
                        </div>
                    </div>
                    <span className="lobby-number">LOBBY 01</span>
                </header>

                <section className="lobby-intro">
                    <div>
                        <span className="section-label">
                            CURRENT SESSION
                        </span>
                        <h1>출석 대기실</h1>
                        <p>Waiting for all players...</p>
                    </div>
                    <div className="player-counter">
                        <strong>
                            {String(readyCount).padStart(2, "0")}
                            <span>/</span>
                            {String(students.length).padStart(2, "0")}
                        </strong>
                        <small>READY PLAYERS</small>
                    </div>
                </section>

                <div className="list-heading">
                    <span>PLAYER LIST</span>
                    <span>{students.length} SLOTS</span>
                </div>

                <ul className="lobby-player-list">
                    {students.map((student) => (
                        <li className="player-row" key={student.id}>
                            <span className="player-index">
                                {String(student.id).padStart(2, "0")}
                            </span>

                            <div className="player-avatar">
                                {student.name.charAt(0)}
                            </div>

                            <div className="player-details">
                                <strong>{student.name}</strong>
                                <span>
                                    PLAYER {String(student.id).padStart(3, "0")}
                                </span>
                            </div>

                            <button
                                type="button"
                                className={
                                    student.ready
                                        ? "ready-button is-ready"
                                        : "ready-button"
                                }
                                onClick={() => toggleReady(student.id)}
                            >
                                <span className="status-dot"></span>
                                {student.ready ? "READY" : "NOT READY"}
                            </button>
                        </li>
                    ))}
                </ul>

                <div className={
                    allReady
                        ? "lobby-status all-ready"
                        : "lobby-status waiting"
                }>
                    {allReady
                        ? "✓ ALL PLAYERS READY"
                        : "WAITING FOR PLAYERS"}
                </div>

                <footer className="lobby-footer">
                    SESSION STATUS
                    <span>● CONNECTED</span>
                </footer>
            </div>
        </div>
    );
}

export default AttendanceBook;
