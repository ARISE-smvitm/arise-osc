"use client";

import { useEffect, useRef } from "react";

interface Petal {
  x: number;
  y: number;
  z: number;
  size: number;
  speed: number;
  sway: number;
  phase: number;
  rotation: number;
  rotationSpeed: number;
  pink: boolean;
}

const PETAL_COUNT = 92;

function createPetal(index: number, width: number, height: number): Petal {
  const depth = ((index * 47) % 100) / 100;
  return {
    x: ((index * 83) % 120) / 100 * width - width * 0.1,
    y: ((index * 61) % 130) / 100 * height - height * 0.2,
    z: depth,
    size: 3 + depth * 8,
    speed: 18 + depth * 38,
    sway: 10 + depth * 24,
    phase: index * 1.73,
    rotation: (index * 0.91) % (Math.PI * 2),
    rotationSpeed: (index % 2 ? 1 : -1) * (0.25 + depth * 0.7),
    pink: index % 5 !== 0,
  };
}

function drawPetal(context: CanvasRenderingContext2D, petal: Petal) {
  context.save();
  context.translate(petal.x, petal.y);
  context.rotate(petal.rotation);
  context.globalAlpha = 0.18 + petal.z * 0.5;
  context.shadowBlur = petal.z > 0.65 ? 12 : 4;
  context.shadowColor = petal.pink ? "#ff2a6d" : "#b9bec8";
  context.fillStyle = petal.pink ? "#ff2a6d" : "#9ca3af";
  context.beginPath();
  context.moveTo(0, -petal.size);
  context.bezierCurveTo(petal.size * 0.8, -petal.size * 0.7, petal.size, 0, 0, petal.size);
  context.bezierCurveTo(-petal.size * 0.8, 0, -petal.size * 0.8, -petal.size * 0.7, 0, -petal.size);
  context.fill();
  context.restore();
}

export default function SakuraBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    let animationFrame = 0;
    let width = 0;
    let height = 0;
    let lastTime = performance.now();
    let wind = 0;
    const pointer = { x: 0, y: 0 };
    const pointerTarget = { x: 0, y: 0 };
    let petals: Petal[] = [];

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      if (petals.length === 0) petals = Array.from({ length: PETAL_COUNT }, (_, index) => createPetal(index, width, height));
    };

    const handlePointerMove = (event: PointerEvent) => {
      pointerTarget.x = event.clientX / width - 0.5;
      pointerTarget.y = event.clientY / height - 0.5;
    };

    const render = (time: number) => {
      const delta = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;
      wind += delta * 0.7;
      pointer.x += (pointerTarget.x - pointer.x) * Math.min(delta * 4, 1);
      pointer.y += (pointerTarget.y - pointer.y) * Math.min(delta * 4, 1);
      context.clearRect(0, 0, width, height);

      const atmosphere = context.createRadialGradient(width * 0.72, height * 0.2, 0, width * 0.72, height * 0.2, width * 0.7);
      atmosphere.addColorStop(0, "rgba(255, 42, 109, 0.08)");
      atmosphere.addColorStop(1, "rgba(255, 42, 109, 0)");
      context.fillStyle = atmosphere;
      context.fillRect(0, 0, width, height);

      for (const petal of petals) {
        petal.y += petal.speed * delta;
        petal.x += (Math.sin(wind + petal.phase) * petal.sway + 12) * delta;
        petal.rotation += petal.rotationSpeed * delta;
        const driftX = pointer.x * petal.z * 22;
        const driftY = pointer.y * petal.z * 10;
        const originalX = petal.x;
        petal.x += driftX * delta;
        petal.y += driftY * delta;
        drawPetal(context, petal);
        petal.x = originalX;
        if (petal.y > height + 30 || petal.x > width + 60) {
          petal.y = -30;
          petal.x = ((petal.phase * 31) % 120) / 100 * width - width * 0.1;
        }
      }

      animationFrame = requestAnimationFrame(render);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", handlePointerMove);
    animationFrame = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <canvas ref={canvasRef} aria-hidden="true" className="cinematic-sakura-canvas absolute inset-0 opacity-90" />
      <div className="cinematic-vignette absolute inset-0" />
      <div className="cinematic-scanlines absolute inset-0" />
    </div>
  );
}
