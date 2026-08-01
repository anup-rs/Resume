import { useEffect, useRef, useState } from 'react';

interface RevealLayerProps {
  image: string;
  cursorX: number;
  cursorY: number;
}

const SPOTLIGHT_R = 260;

export const RevealLayer = ({ image, cursorX, cursorY }: RevealLayerProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const revealDivRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1920,
    height: typeof window !== 'undefined' ? window.innerHeight : 1080,
  });

  // Handle window resizing
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update canvas & mask on cursor position or dimensions change
  useEffect(() => {
    const canvas = canvasRef.current;
    const revealDiv = revealDivRef.current;
    if (!canvas || !revealDiv) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, dimensions.width, dimensions.height);

    // Create radial gradient centered at (cursorX, cursorY)
    const grad = ctx.createRadialGradient(
      cursorX,
      cursorY,
      0,
      cursorX,
      cursorY,
      SPOTLIGHT_R
    );

    // Stop mapping:
    // 0 → rgba(255,255,255,1)
    // 0.4 → 1
    // 0.6 → 0.75
    // 0.75 → 0.4
    // 0.88 → 0.12
    // 1 → 0
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.4, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.6, 'rgba(255, 255, 255, 0.75)');
    grad.addColorStop(0.75, 'rgba(255, 255, 255, 0.4)');
    grad.addColorStop(0.88, 'rgba(255, 255, 255, 0.12)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

    // Fill arc of SPOTLIGHT_R
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cursorX, cursorY, SPOTLIGHT_R, 0, Math.PI * 2);
    ctx.fill();

    // Apply maskImage to reveal div
    try {
      const dataUrl = canvas.toDataURL();
      const maskStr = `url(${dataUrl})`;
      revealDiv.style.maskImage = maskStr;
      revealDiv.style.webkitMaskImage = maskStr;
      revealDiv.style.maskSize = '100% 100%';
      revealDiv.style.webkitMaskSize = '100% 100%';
      revealDiv.style.maskRepeat = 'no-repeat';
      revealDiv.style.webkitMaskRepeat = 'no-repeat';
    } catch (e) {
      console.error("Mask canvas paint error:", e);
    }
  }, [cursorX, cursorY, dimensions]);

  return (
    <>
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="absolute inset-0 pointer-events-none"
        style={{ display: 'none' }}
      />
      <div
        ref={revealDivRef}
        className="absolute inset-0 bg-center bg-cover bg-no-repeat z-30 pointer-events-none"
        style={{
          backgroundImage: `url(${image})`,
        }}
      />
    </>
  );
};
