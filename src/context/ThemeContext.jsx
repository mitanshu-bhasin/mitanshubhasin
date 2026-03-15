import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        try {
            return localStorage.getItem('portfolio-theme') || 'light';
        } catch {
            return 'light';
        }
    });

    useEffect(() => {
        document.body.className = `theme-${theme}`;
        try {
            localStorage.setItem('portfolio-theme', theme);
        } catch {
            // localStorage unavailable
        }
    }, [theme]);

    const toggleTheme = useCallback(() => {
        setTheme(prev => prev === 'light' ? 'cyber' : 'light');
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
