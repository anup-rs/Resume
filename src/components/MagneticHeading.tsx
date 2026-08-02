import { useRef, useState } from 'react';

function Letter({ char, mouseX }: { char: string; mouseX: number | null }) {
    const ref = useRef<HTMLSpanElement>(null);

    let scale = 1;
    let color = '#ffffff';

    if (mouseX !== null && ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const center = rect.left + rect.width / 2;
        const distance = Math.abs(mouseX - center);
        const maxDistance = 90;
        const maxScale = 1.3;

        if (distance < maxDistance) {
            const ratio = 1 - distance / maxDistance;
            scale = 1 + ratio * (maxScale - 1);

            const from = [255, 255, 255];
            const to = [11, 11, 15];
            const mixed = from.map((c, i) => Math.round(c + (to[i] - c) * ratio));
            color = `rgb(${mixed[0]}, ${mixed[1]}, ${mixed[2]})`;
        }
    }

    return (
        <span
            ref={ref}
            style={{
                display: 'inline-block',
                transform: `scale(${scale})`,
                color,
                transition: 'none',
                transformOrigin: 'bottom center',
                willChange: 'transform',
            }}
        >
            {char === ' ' ? '\u00A0' : char}
        </span>
    );
}

export function MagneticHeading({ text, className = '' }: { text: string; className?: string }) {
    const [mouseX, setMouseX] = useState<number | null>(null);

    return (
        <span
            className={className}
            onMouseMove={(e) => setMouseX(e.clientX)}
            onMouseLeave={() => setMouseX(null)}
            style={{ display: 'inline-block', pointerEvents: 'auto' }}
        >
            {text.split('').map((char, i) => (
                <Letter key={i} char={char} mouseX={mouseX} />
            ))}
        </span>
    );
}