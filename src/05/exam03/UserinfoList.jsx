import React from "react";
import Userinfo from "./Userinfo";
import "./Userinfo.css";

const users = [
    {
        name: "Jang Wonyoung",
        avatarUrl: "https://cdn.pixabay.com/photo/2016/08/20/05/38/avatar-1606916_1280.png",
        comment: "Positive mindset, lucky vibe~"
    },
    {
        name: "Ahn Yujin",
        avatarUrl: "https://cdn.pixabay.com/photo/2025/08/28/11/47/user-9801864_1280.png",
        comment: "I think likes me.^^"
    },
    {
        name: "Park Liz",
        avatarUrl: "https://cdn.pixabay.com/photo/2025/08/28/11/47/user-9801872_1280.png",
        comment: "Sleeping is the best~~~~~"
    }
    ];
function UserinfoList() {
    const currentDate = new Date();
    return(
        <div className="userList">
            {users.map((user, index) => {
                return (
                    <div className="userCard" key={index}>

                        <Userinfo user={user} />

                        <div className="comment">
                            {user.comment}
                        </div>

                        <div className="date">
                            {currentDate.toDateString()}
                        </div>

                    </div>
                );
            })}
        </div>
    )
}
export default UserinfoList;