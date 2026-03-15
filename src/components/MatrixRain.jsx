import React, { useRef, useCallback } from 'react';
import { useFrameLoop } from '../hooks/useFrameLoop';

/**
 * MatrixRain canvas animation (optimized).
 * - Frame-rate capped at 20fps via useFrameLoop (was 50ms setInterval ≈ 20fps)
 * - Pauses when tab is hidden (Page Visibility API)
 * - Column count adapts to screen size
 */
export const MatrixRain = ({ color }) => {
    const canvasRef = useRef(null);
    const dropsRef = useRef(null);

    const initDrops = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const columns = Math.floor(canvas.width / 20);
        dropsRef.current = Array(columns).fill(1);
    }, []);

    useFrameLoop(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        if (!dropsRef.current) {
            initDrops();
            return;
        }

        // Handle resize
        if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
            initDrops();
        }

        const ctx = canvas.getContext('2d');
        const drops = dropsRef.current;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = color;
        ctx.font = '14px monospace';

        for (let i = 0; i < drops.length; i++) {
            const text = String.fromCharCode(0x30A0 + Math.random() * 96);
            ctx.fillText(text, i * 20, drops[i] * 20);
            if (drops[i] * 20 > canvas.height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        }
    }, 20, [color]); // Capped at 20fps (matching original ~50ms interval)

    return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10 opacity-30 pointer-events-none" />;
};
