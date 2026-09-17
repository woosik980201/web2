import React from "react";
import Welcome from "./Welcome";

function WelcomeList() {
    return (
        <div>
            <Welcome name="김민공" color="red" />
            <Welcome name="박폴리" color="green" />
            <Welcome name="이정수" color="blue" />
        </div>
    );
}

export default WelcomeList;