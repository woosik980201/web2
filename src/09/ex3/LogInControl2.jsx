import React, { useState } from "react";
import LogInButton from "../ex2/LogInButton";
import LogOutButton from "../ex2/LogOutButton";
import Greeting from "../ex1/Greeting";
import "../ex2/LogInControl.css";

function LogInControl2() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const logInClickListener = () => {
        setIsLoggedIn(true);
    };

    const logOutClickListener = () => {
        setIsLoggedIn(false);
    };

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

                {isLoggedIn ? (
                    <LogOutButton onClick={logOutClickListener} />
                ) : (
                    <LogInButton onClick={logInClickListener} />
                )}

            </div>
        </div>
    );
}

export default LogInControl2;
