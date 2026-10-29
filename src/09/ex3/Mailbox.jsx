import React, { useState } from "react";
import "./Mailbox.css";

function Mailbox(props) {
    const [unreadMessages, setUnreadMessages] = useState(
        props.unreadMessages || []
    );

    const addMessage = () => {
        setUnreadMessages(prev => [...prev, "새 메시지"]);
    };

    const readAllMessages = () => {
        setUnreadMessages([]);
    };

    return (
        <div className="mailbox-container">
            <div className="mailbox-card">

                <div className="mailbox-icon">✉️</div>

                <p className="mailbox-label">
                    REACT / MAILBOX
                </p>

                <h1>Your Inbox.</h1>
                <p className="mailbox-subtitle">
                    안녕하세요! 새로운 메시지를 확인하세요.
                </p>

                {unreadMessages.length > 0 && (
                    <div className="mailbox-alert">
                        <span className="mailbox-alert-title">
                            🔔 새로운 알림
                        </span>
                        <p>
                            현재 {unreadMessages.length}개의
                            읽지 않은 메시지가 있습니다.
                        </p>
                    </div>
                )}

                {unreadMessages.length === 0 && (
                    <div className="mailbox-empty">
                        ✓ 모든 메시지를 확인했습니다.
                    </div>
                )}

                <div className="mailbox-actions">
                    <button onClick={addMessage}>
                        + 새 메일
                    </button>
                    <button onClick={readAllMessages}>
                        모두 읽음
                    </button>
                </div>

                <p className="mailbox-footer">
                    CONDITIONAL RENDERING · REACT
                </p>

            </div>
        </div>
    );
}

export default Mailbox;
