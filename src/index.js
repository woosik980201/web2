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
import WelcomeList from './05/WelcomeList'
const root = ReactDOM.createRoot(
    document.getElementById('root')
);

setInterval(() => {
    root.render(
        <React.StrictMode>
            <WelcomeList />
        </React.StrictMode>
    );
}, 1000);