
import React, { useState } from "react";
import LogInButton from "./LogInButton";
import LogOutButton from "./LogOutButton";
import Greeting from "../ex1/Greeting";
import "./LogInControl.css";

function LogInControl() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const logInClickListener = () => {
        setIsLoggedIn(true);
    };

    const logOutClickListener = () => {
        setIsLoggedIn(false);
    };

    let button;

    if (isLoggedIn) {
        button = <LogOutButton onClick={logOutClickListener} />;
    } else {
        button = <LogInButton onClick={logInClickListener} />;
    }

    return (
        <div className="login-container">
            <div className="login-card">

                <div className="login-icon">
                    {isLoggedIn ? "✨" : "🔐"}
                </div>

                <div
                    className="login-content"
                    key={String(isLoggedIn)}
                >
                    <Greeting isLoggedIn={isLoggedIn} />
                </div>

                {button}

            </div>
        </div>
    );
}

export default LogInControl;
