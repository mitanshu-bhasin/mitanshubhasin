import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from './context/ThemeContext';
import App from './components/App';
import './styles/index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ThemeProvider>
        <App />
    </ThemeProvider>
);
