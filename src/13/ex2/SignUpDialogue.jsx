import React, { useState } from "react";
import Dialog from "./Dialog";

export default function SignUpDialogue() {
    const [nickname, setNickname] = useState("");

    const handleChange = (event) => {
        setNickname(event.target.value);
    };

    const handleSignUp = () => {
        alert(`어서 오세요, ${nickname}님!`);
    };

    return (
        <Dialog
            title="화성 탐사 프로그램"
            message="닉네임을 입력해 주세요."
        >
            <input
                aria-label="닉네임"
                value={nickname}
                onChange={handleChange}
            />
            <button type="button" onClick={handleSignUp}>
                가입하기
            </button>
        </Dialog>
    );
}