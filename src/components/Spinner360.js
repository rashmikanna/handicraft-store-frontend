import React, { useRef, useState, useEffect } from 'react';


export default function Spinner360({ frames, width = 400, height = 400 }) {
    const container = useRef(null);
    const [index, setIndex] = useState(0);
    const dragging = useRef(false);
    const startX = useRef(0);
    const count = frames.length;

    const norm = i => ((i % count) + count) % count;

    const onDown = e => {
        dragging.current = true;
        startX.current = e.touches ? e.touches[0].pageX : e.pageX;
        e.preventDefault();
    };
    const onMove = e => {
        if (!dragging.current) return;
        const x = e.touches ? e.touches[0].pageX : e.pageX;
        const dx = x - startX.current;
        const deltaFrame = Math.floor(dx / 5);
        if (deltaFrame !== 0) {
            setIndex(i => norm(i - deltaFrame));
            startX.current = x;
        }
    };
    const onUp = () => (dragging.current = false);

    useEffect(() => {
        const el = container.current;
        el.addEventListener('mousedown', onDown);
        el.addEventListener('touchstart', onDown);
        window.addEventListener('mousemove', onMove);
        window.addEventListener('touchmove', onMove);
        window.addEventListener('mouseup', onUp);
        window.addEventListener('touchend', onUp);
        return () => {
            el.removeEventListener('mousedown', onDown);
            el.removeEventListener('touchstart', onDown);
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('touchmove', onMove);
            window.removeEventListener('mouseup', onUp);
            window.removeEventListener('touchend', onUp);
        };
    }, []);

    return (
        <div
            ref={container}
            style={{
                width,
                height,
                overflow: 'hidden',
                userSelect: 'none',
                touchAction: 'none',
                cursor: 'grab',
            }}
            onMouseDown={e => e.preventDefault()}
        >
            <img
                src={frames[index]}
                alt={`frame ${index}`}
                draggable={false}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
        </div>
    );
}
