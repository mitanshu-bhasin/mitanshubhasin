import React, { useRef, useCallback, useMemo } from 'react';
import { useFrameLoop } from '../hooks/useFrameLoop';

/**
 * NeuralNetwork canvas animation (optimized).
 * - Frame-rate capped at 30fps via useFrameLoop
 * - Pauses when tab is hidden (Page Visibility API)
 * - Particle count adapts to screen size
 * - Connection distance check uses squared distances to avoid Math.hypot
 */
export const NeuralNetwork = () => {
    const canvasRef = useRef(null);
    const stateRef = useRef(null);

    const initParticles = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const width = canvas.width = window.innerWidth;
        const height = canvas.height = window.innerHeight;
        const particleCount = window.innerWidth < 768 ? 25 : 50;
        const particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5
            });
        }
        stateRef.current = { particles, width, height };
    }, []);

    // Initialize on mount
    useMemo(() => {
        // Defer to first render when canvasRef is available
    }, []);

    useFrameLoop(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        if (!stateRef.current) {
            initParticles();
            return;
        }

        const ctx = canvas.getContext('2d');
        const { particles } = stateRef.current;
        let { width, height } = stateRef.current;

        // Handle resize
        if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            stateRef.current.width = width;
            stateRef.current.height = height;
        }

        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = '#94a3b8';
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.15)';

        const connectionDistSq = 120 * 120; // Squared distance avoids Math.hypot

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
            ctx.fill();

            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const distSq = dx * dx + dy * dy;
                if (distSq < connectionDistSq) {
                    const dist = Math.sqrt(distSq);
                    ctx.lineWidth = 1 - dist / 120;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        }
    }, 30); // Capped at 30fps

    return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10 opacity-60 pointer-events-none" />;
};
