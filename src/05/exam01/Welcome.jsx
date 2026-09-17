import React from "react"
import "./Welcome.css";
function Welcome(props) {
    return(
        <div className={`welcome ${props.color}`}>
            안녕하세요~ {props.name}님
        </div>
    );
}

export default Welcome;