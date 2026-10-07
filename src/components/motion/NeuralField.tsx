"use client";

import { useEffect, useRef } from "react";

type Node = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  c: number;
  phase: number;
};

const COLORS = [
  [79, 70, 229],
  [139, 92, 246],
  [34, 211, 238],
] as const;

/**
 * A living network of nodes behind the hero: it drifts, links nearby points,
 * reaches toward the cursor and sends small pulses of light along the links.
 * It sleeps when off screen or when the tab is hidden.
 */
export function NeuralField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let nodes: Node[] = [];
    let frame = 0;
    let visible = true;
    let pulses: { a: number; b: number; t: number; speed: number }[] = [];
    const pointer = { x: -9999, y: -9999, active: false };
    const linkDistance = 140;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(110, Math.max(28, Math.round((width * height) / 13000)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: 1 + Math.random() * 1.8,
        c: Math.floor(Math.random() * COLORS.length),
        phase: Math.random() * Math.PI * 2,
      }));
      pulses = [];
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      for (const n of nodes) {
        if (!reduce) {
          n.x += n.vx * 2;
          n.y += n.vy * 2;
          if (n.x < -20) n.x = width + 20;
          if (n.x > width + 20) n.x = -20;
          if (n.y < -20) n.y = height + 20;
          if (n.y > height + 20) n.y = -20;
          if (pointer.active) {
            const dx = pointer.x - n.x;
            const dy = pointer.y - n.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < 220 * 220 && d2 > 1) {
              const f = (1 - Math.sqrt(d2) / 220) * 1.2;
              n.x += (dx / Math.sqrt(d2)) * f;
              n.y += (dy / Math.sqrt(d2)) * f;
            }
          }
        }
      }

      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i += 1) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j += 1) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > linkDistance * linkDistance) continue;
          const alpha = (1 - Math.sqrt(d2) / linkDistance) * 0.32;
          const [r, g, bl] = COLORS[a.c];
          ctx.strokeStyle = `rgba(${r},${g},${bl},${alpha})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
          if (!reduce && pulses.length < 14 && Math.random() < 0.0009) {
            pulses.push({ a: i, b: j, t: 0, speed: 0.008 + Math.random() * 0.014 });
          }
        }
        if (pointer.active) {
          const dx = a.x - pointer.x;
          const dy = a.y - pointer.y;
          const d = Math.hypot(dx, dy);
          if (d < 190) {
            ctx.strokeStyle = `rgba(34,211,238,${(1 - d / 190) * 0.55})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(pointer.x, pointer.y);
            ctx.stroke();
          }
        }
      }

      for (const n of nodes) {
        const [r, g, b] = COLORS[n.c];
        const glow = 0.55 + Math.sin(time / 900 + n.phase) * 0.35;
        ctx.fillStyle = `rgba(${r},${g},${b},${glow})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }

      pulses = pulses.filter((p) => {
        p.t += p.speed * 2;
        const a = nodes[p.a];
        const b = nodes[p.b];
        if (!a || !b || p.t >= 1) return false;
        const x = a.x + (b.x - a.x) * p.t;
        const y = a.y + (b.y - a.y) * p.t;
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 9);
        gradient.addColorStop(0, "rgba(255,255,255,0.95)");
        gradient.addColorStop(0.35, "rgba(34,211,238,0.7)");
        gradient.addColorStop(1, "rgba(34,211,238,0)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, 9, 0, Math.PI * 2);
        ctx.fill();
        return true;
      });

      if (pointer.active) {
        const gradient = ctx.createRadialGradient(
          pointer.x,
          pointer.y,
          0,
          pointer.x,
          pointer.y,
          120,
        );
        gradient.addColorStop(0, "rgba(139,92,246,0.14)");
        gradient.addColorStop(1, "rgba(139,92,246,0)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(pointer.x, pointer.y, 120, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    // 30 fps is plenty for a slow drift and halves the work for the glass panels above it.
    let lastDraw = 0;
    const loop = (time: number) => {
      frame = 0;
      if (time - lastDraw >= 32) {
        lastDraw = time;
        draw(time);
      }
      if (visible && !document.hidden && !reduce) frame = requestAnimationFrame(loop);
    };
    const start = () => {
      if (!frame) frame = requestAnimationFrame(loop);
    };

    const host = canvas.parentElement ?? canvas;
    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = event.pointerType === "mouse";
    };
    const onLeave = () => {
      pointer.active = false;
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
    });
    const ro = new ResizeObserver(() => {
      resize();
      start();
    });
    const onVisibility = () => {
      if (!document.hidden) start();
    };

    resize();
    start();
    io.observe(canvas);
    ro.observe(canvas);
    host.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      ro.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}
