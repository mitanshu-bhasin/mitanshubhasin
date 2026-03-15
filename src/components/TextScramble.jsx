import React, { useState, useEffect } from 'react';

export const TextScramble = ({ text, className }) => {
    const [display, setDisplay] = useState(text);
    const chars = '!<>-_\\/[]{}—=+*^?#________';
    useEffect(() => {
        let iteration = 0;
        const interval = setInterval(() => {
            setDisplay(text.split('').map((letter, index) => {
                if (index < iteration) return text[index];
                return chars[Math.floor(Math.random() * chars.length)];
            }).join(''));
            if (iteration >= text.length) clearInterval(interval);
            iteration += 1/3;
        }, 30);
        return () => clearInterval(interval);
    }, [text]);
    return <span className={className}>{display}</span>;
};
