"use client";

import { useEffect, useRef } from "react";
import { usePerson } from "./PersonProvider";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
};

export function Field() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { person } = usePerson();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame = 0;
    let width = 0;
    let height = 0;
    const pointer = { x: 0.72, y: 0.28 };
    const particles: Particle[] = [];

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const seed = () => {
      particles.length = 0;
      const count = Math.min(90, Math.floor((width * height) / 18000));
      for (let i = 0; i < count; i += 1) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          r: Math.random() * 1.6 + 0.4,
        });
      }
    };

    const onMove = (event: PointerEvent) => {
      pointer.x = event.clientX / width;
      pointer.y = event.clientY / height;
    };

    const color = () =>
      getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() ||
      "#e29a68";

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const accent = color();
      ctx.fillStyle = accent;
      const px = pointer.x * width;
      const py = pointer.y * height;
      for (const p of particles) {
        if (!reduce) {
          const dx = px - p.x;
          const dy = py - p.y;
          const dist = Math.max(40, Math.hypot(dx, dy));
          p.vx += (dx / dist) * 0.01;
          p.vy += (dy / dist) * 0.01;
          p.vx *= 0.96;
          p.vy *= 0.96;
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;
        }
        ctx.globalAlpha = 0.22;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      frame = window.requestAnimationFrame(draw);
    };

    resize();
    seed();
    if (reduce) {
      draw();
    } else {
      frame = window.requestAnimationFrame(draw);
    }
    const onResize = () => {
      resize();
      seed();
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onMove);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
    };
  }, [person]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 opacity-70"
    />
  );
}
