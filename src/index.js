//import React from 'react';
//import ReactDOM from 'react-dom/client';
//import './index.css';
//import Library from './03/enhanced_css/Library';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Clock from './04/Clock';

const root = ReactDOM.createRoot(
    document.getElementById('root')
);

setInterval(() => {
    root.render(
        <React.StrictMode>
            <Clock />
        </React.StrictMode>
    );
}, 1000);