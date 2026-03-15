import React, { useRef } from 'react';

export const TiltCard = ({ children, className }) => {
    const cardRef = useRef(null);
    const handleMove = (e) => {
        if (window.innerWidth < 768) return; 
        const card = cardRef.current;
        const { left, top, width, height } = card.getBoundingClientRect();
        const x = (e.clientX - left) / width;
        const y = (e.clientY - top) / height;
        const tiltX = (0.5 - y) * 15;
        const tiltY = (x - 0.5) * 15;
        card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
    };
    const handleLeave = () => { cardRef.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)'; };
    return (
        <div ref={cardRef} onMouseMove={handleMove} onMouseLeave={handleLeave} className={`tilt-card ${className}`}>
            {children}
        </div>
    );
};
