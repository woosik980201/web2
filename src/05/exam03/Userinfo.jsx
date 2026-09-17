import React from "react";
import Avatar from "./Avatar";

function Userinfo(props) {
    return(
            <div className="userInfo">
            <Avatar user={props.user}/>

            <div className="userName">
                {props.user.name}
            </div>
        </div>
    );
}
export default Userinfo;