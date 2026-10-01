//import React from 'react';
//import ReactDOM from 'react-dom/client';
//import './index.css';
//import Library from './03/enhanced_css/Library';
import React from 'react';
import ReactDOM from 'react-dom/client';
//import './index.css';
//import Clock from './04/Clock';
//import ConfirmDialog from './04/ConfirmDialog/ConfirmDialog';
//import ConfirmDialogList from './04/ConfirmDialog/ConfirmDialogList';
//import WelcomeList from './05/WelcomeList'
//import Booklist from './05/exam02/Booklist';
//import './05/exam02/Booklist.css';
//import UserinfoList from "./05/exam03/UserinfoList";
//import TodoList from './01/TodoApp';
import NotificationList from './06/NotificationList';
const root = ReactDOM.createRoot(
    document.getElementById('root')
);

//setInterval(() => {
   root.render(
        <React.StrictMode>
            <NotificationList />
       </React.StrictMode>
    );
//}, 1000);