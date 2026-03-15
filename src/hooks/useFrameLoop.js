import { useEffect, useRef } from 'react';

/**
 * Custom hook for frame-rate capped animation loops.
 * Automatically pauses when the page is hidden (Page Visibility API)
 * to save CPU on mobile and background tabs.
 *
 * @param {Function} callback - The draw/update function called each frame.
 * @param {number} targetFps - Target frames per second (default: 30).
 * @param {Array} deps - Dependency array for re-creating the loop.
 */
export const useFrameLoop = (callback, targetFps = 30, deps = []) => {
    const callbackRef = useRef(callback);
    callbackRef.current = callback;

    useEffect(() => {
        let animationId;
        let lastFrameTime = 0;
        const frameDuration = 1000 / targetFps;
        let isVisible = !document.hidden;

        const loop = (timestamp) => {
            animationId = requestAnimationFrame(loop);
            if (!isVisible) return;

            const elapsed = timestamp - lastFrameTime;
            if (elapsed < frameDuration) return;

            lastFrameTime = timestamp - (elapsed % frameDuration);
            callbackRef.current(timestamp);
        };

        const handleVisibilityChange = () => {
            isVisible = !document.hidden;
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        animationId = requestAnimationFrame(loop);

        return () => {
            cancelAnimationFrame(animationId);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [targetFps, ...deps]);
};
