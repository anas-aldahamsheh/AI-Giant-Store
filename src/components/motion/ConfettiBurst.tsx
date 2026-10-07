"use client";

import { useEffect, useRef } from "react";

const COLORS = ["#4f46e5", "#8b5cf6", "#22d3ee", "#f59e0b", "#16a34a", "#ffffff"];

type Piece = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  rot: number;
  vr: number;
  color: string;
  life: number;
};

/** One celebratory burst of confetti from two corners, drawn on a canvas that removes itself. */
export function ConfettiBurst() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const pieces: Piece[] = [];
    const spawn = (originX: number, direction: number) => {
      for (let i = 0; i < 90; i += 1) {
        const angle = -Math.PI / 2 + direction * (0.25 + Math.random() * 0.55);
        const speed = 9 + Math.random() * 11;
        pieces.push({
          x: originX,
          y: height + 10,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          w: 6 + Math.random() * 6,
          h: 8 + Math.random() * 10,
          rot: Math.random() * Math.PI,
          vr: (Math.random() - 0.5) * 0.35,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          life: 1,
        });
      }
    };
    spawn(width * 0.08, 1);
    spawn(width * 0.92, -1);

    let frame = 0;
    const tick = () => {
      ctx.clearRect(0, 0, width, height);
      let alive = 0;
      for (const p of pieces) {
        if (p.life <= 0) continue;
        p.vy += 0.28;
        p.vx *= 0.985;
        p.vy *= 0.985;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        if (p.vy > 0) p.life -= 0.006;
        if (p.y > height + 40) p.life = 0;
        if (p.life <= 0) continue;
        alive += 1;
        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, p.life * 1.4));
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.scale(1, Math.cos(p.rot * 2));
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
      if (alive > 0) frame = requestAnimationFrame(tick);
      else canvas.remove();
    };
    const start = window.setTimeout(() => {
      frame = requestAnimationFrame(tick);
    }, 350);

    return () => {
      window.clearTimeout(start);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[90] h-full w-full"
    />
  );
}
