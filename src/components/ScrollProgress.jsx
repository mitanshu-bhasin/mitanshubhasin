import React, { useState, useEffect } from 'react';

export const ScrollProgress = () => {
    const [width, setWidth] = useState(0);
    useEffect(() => {
        const handleScroll = () => {
            const totalHeight = document.body.scrollHeight - window.innerHeight;
            const progress = (window.scrollY / totalHeight) * 100;
            setWidth(progress);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    return (
        <div className="scroll-progress-container">
            <div className="scroll-progress-bar" style={{ width: `${width}%` }}></div>
        </div>
    );
};
