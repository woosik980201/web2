import React from 'react';
import './Clock.css';

function Clock() {
    const now = new Date();

    const time = now.toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });

    const seconds = now.toLocaleTimeString('ko-KR', {
        second: '2-digit'
    });

    const date = now.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric'
    });

    return (
        <div className="archive-page">

            <header className="top-bar">
                <div className="brand">
                    SSIK / ARCHIVE
                </div>

                <div className="top-info">
                    <span>SEOUL</span>
                    <span>{date}</span>
                    <span>LIVE SYSTEM</span>
                </div>
            </header>

            <aside className="left-panel">
                <span>01</span>
                <span>FASHION</span>
                <span>MUSIC</span>
                <span>DESIGN</span>
                <span>CODE</span>
            </aside>

            <main className="main-content">

                <div className="section-label">
                    LOCAL TIME / SEOUL
                </div>

                <div className="clock-frame">

                    <div className="clock-number">
                        {time}
                    </div>

                    <div className="clock-second">
                        {seconds}
                    </div>

                    <div className="live-indicator">
                        <span className="live-dot"></span>
                        LIVE
                    </div>

                </div>

                <div className="meta-row">
                    <span>CURATED DIGITAL SPACE</span>
                    <span>AI SOFTWARE</span>
                    <span>2026</span>
                </div>

            </main>

            <footer className="bottom-bar">
                <span>CURATING CULTURE THROUGH CODE</span>
                <span>SSIK SYSTEM / 001</span>
            </footer>

        </div>
    );
}

export default Clock;