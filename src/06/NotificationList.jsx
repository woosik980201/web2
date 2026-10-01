import React from "react";
import Notification from "./Notification";
import "./Notification.css";

const reservedNotifications = [
    {
        id: 1,
        message: "안녕하세요, 여러분, 반갑습니다."
    },
    {
        id: 2,
        message: "오늘은 10월을 시작하는 날입니다."
    },
    {
        id: 3,
        message: "오늘 기분은 어떠신가요?"
    },
    {
        id: 4,
        message: "만약 우울하시다면 기분 전환될 생각을 해보세요."
    },
    {
        id: 5,
        message: "내일은 더 좋은 일이 생길겁니다."
    }
];

var timer;

class NotificationList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            notifications: []
        };
    }

    render() {
        return (
            <div className="notification-page">

                <div className="background-circle circle1"></div>
                <div className="background-circle circle2"></div>
                <div className="background-circle circle3"></div>

                <div className="notification-container">

                    <div className="notification-header">
                        <span className="date">OCT. 01 / NEW MONTH</span>
                        <h1>HEY!<br />OCTOBER</h1>
                        <p>5 little notes to kick off your month.</p>
                    </div>

                    <div className="notification-list">
                        {
                            this.state.notifications.map((notification) => {
                                return (
                                    <Notification
                                        key={notification.id}
                                        id={notification.id}
                                        message={notification.message}
                                    />
                                );
                            })
                        }
                    </div>

                    <div className="notification-footer">
                        <span>Have a beautiful day.</span>
                    </div>

                </div>
            </div>
        );
    }

    componentDidMount() {
        const { notifications } = this.state;

        timer = setInterval(() => {
            if (notifications.length < reservedNotifications.length) {
                const index = notifications.length;

                notifications.push(reservedNotifications[index]);

                this.setState({
                    notifications: notifications
                });
            } else {
                clearInterval(timer);
            }
        }, 3000);
    }

    componentWillUnmount() {
        if (timer) {
            clearInterval(timer);
        }
    }
}

export default NotificationList;