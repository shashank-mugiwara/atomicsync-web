"use client";

import { useEffect, useRef, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  life: number;
  maxLife: number;
}

interface ParticleFieldProps {
  className?: string;
  particleCount?: number;
  color?: string;
  maxSize?: number;
  speed?: number;
  /** Whether particles cluster toward center or spread evenly */
  clustered?: boolean;
}

export function ParticleField({
  className,
  particleCount = 800,
  color = "255, 255, 255",
  maxSize = 2,
  speed = 0.3,
  clustered = true,
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  const createParticle = useCallback(
    (w: number, h: number, existing?: Partial<Particle>): Particle => {
      const cx = w / 2;
      const cy = h / 2;

      let x: number, y: number;
      if (clustered) {
        // Gaussian-ish distribution around center
        const angle = Math.random() * Math.PI * 2;
        const radius =
          (Math.random() * 0.35 + Math.random() * 0.35) *
          Math.min(w, h);
        x = cx + Math.cos(angle) * radius;
        y = cy + Math.sin(angle) * radius;
      } else {
        x = Math.random() * w;
        y = Math.random() * h;
      }

      const maxLife = 300 + Math.random() * 500;
      return {
        x: existing?.x ?? x,
        y: existing?.y ?? y,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        size: Math.random() * maxSize + 0.5,
        opacity: Math.random() * 0.6 + 0.1,
        life: existing?.life ?? Math.random() * maxLife,
        maxLife,
      };
    },
    [clustered, maxSize, speed]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let w = 0;
    let h = 0;

    function resize() {
      const rect = canvas!.parentElement!.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.scale(dpr, dpr);
    }

    resize();

    // Initialize particles
    particlesRef.current = Array.from({ length: particleCount }, () =>
      createParticle(w, h)
    );

    function handleMouseMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }

    function handleMouseLeave() {
      mouseRef.current = { x: -1000, y: -1000 };
    }

    canvas!.addEventListener("mousemove", handleMouseMove, { passive: true });
    canvas!.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", resize);

    function animate() {
      ctx!.clearRect(0, 0, w, h);
      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Update life
        p.life += 1;
        if (p.life > p.maxLife) {
          particles[i] = createParticle(w, h, { life: 0 });
          continue;
        }

        // Fade in/out based on life
        const lifeRatio = p.life / p.maxLife;
        let alpha = p.opacity;
        if (lifeRatio < 0.1) {
          alpha *= lifeRatio / 0.1;
        } else if (lifeRatio > 0.8) {
          alpha *= (1 - lifeRatio) / 0.2;
        }

        // Mouse repulsion
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) / 120;
          p.vx += (dx / dist) * force * 0.5;
          p.vy += (dy / dist) * force * 0.5;
        }

        // Damping
        p.vx *= 0.99;
        p.vy *= 0.99;

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Soft boundaries — wrap with margin
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;

        // Draw
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${color}, ${alpha})`;
        ctx!.fill();
      }

      // Draw subtle connection lines between nearby particles (only a subset for perf)
      ctx!.strokeStyle = `rgba(${color}, 0.03)`;
      ctx!.lineWidth = 0.5;
      for (let i = 0; i < Math.min(particles.length, 200); i++) {
        const a = particles[i];
        for (let j = i + 1; j < Math.min(i + 10, particles.length); j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = dx * dx + dy * dy;
          if (dist < 4000) {
            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(b.x, b.y);
            ctx!.stroke();
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    }

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationRef.current);
      canvas!.removeEventListener("mousemove", handleMouseMove);
      canvas!.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", resize);
    };
  }, [particleCount, color, createParticle]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "auto",
      }}
    />
  );
}
