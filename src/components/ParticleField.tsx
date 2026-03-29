"use client";

import { useCallback, useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  depth: number;
  orbitRadius: number;
  orbitSpeed: number;
  phase: number;
}

interface ParticleFieldProps {
  className?: string;
  particleCount?: number;
  color?: string;
  maxSize?: number;
  speed?: number;
  clustered?: boolean;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function distanceToSegment(
  px: number,
  py: number,
  ax: number,
  ay: number,
  bx: number,
  by: number
) {
  const dx = bx - ax;
  const dy = by - ay;
  const lengthSquared = dx * dx + dy * dy;

  if (lengthSquared === 0) {
    return Math.hypot(px - ax, py - ay);
  }

  const t = clamp(
    ((px - ax) * dx + (py - ay) * dy) / lengthSquared,
    0,
    1
  );
  const cx = ax + dx * t;
  const cy = ay + dy * t;
  return Math.hypot(px - cx, py - cy);
}

function isInsideEllipse(
  x: number,
  y: number,
  cx: number,
  cy: number,
  rx: number,
  ry: number
) {
  const dx = (x - cx) / rx;
  const dy = (y - cy) / ry;
  return dx * dx + dy * dy <= 1;
}

function isInsideFigure(x: number, y: number) {
  const head = isInsideEllipse(x, y, 0.5, 0.18, 0.08, 0.1);
  const neck = isInsideEllipse(x, y, 0.5, 0.3, 0.03, 0.03);
  const torso = isInsideEllipse(x, y, 0.5, 0.5, 0.16, 0.21);
  const pelvis = isInsideEllipse(x, y, 0.5, 0.67, 0.11, 0.09);
  const leftArm = distanceToSegment(x, y, 0.36, 0.38, 0.31, 0.72) < 0.035;
  const rightArm = distanceToSegment(x, y, 0.64, 0.38, 0.69, 0.72) < 0.035;
  const leftLeg = distanceToSegment(x, y, 0.46, 0.72, 0.4, 0.98) < 0.032;
  const rightLeg = distanceToSegment(x, y, 0.54, 0.72, 0.6, 0.98) < 0.032;

  return head || neck || torso || pelvis || leftArm || rightArm || leftLeg || rightLeg;
}

function sampleFigurePoint() {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    const x = 0.22 + Math.random() * 0.56;
    const y = 0.06 + Math.random() * 0.92;
    if (isInsideFigure(x, y)) {
      return { x, y };
    }
  }

  return { x: 0.5, y: 0.5 };
}

function mixChannel(a: number, b: number, amount: number) {
  return Math.round(a + (b - a) * amount);
}

function getParticleColor(alpha: number, yRatio: number, monoColor?: string) {
  if (monoColor) {
    return `rgba(${monoColor}, ${alpha})`;
  }

  const top = { r: 104, g: 156, b: 255 };
  const middle = { r: 36, g: 255, b: 181 };
  const bottom = { r: 107, g: 99, b: 255 };
  const split = 0.58;

  if (yRatio < split) {
    const amount = yRatio / split;
    return `rgba(${mixChannel(top.r, middle.r, amount)}, ${mixChannel(
      top.g,
      middle.g,
      amount
    )}, ${mixChannel(top.b, middle.b, amount)}, ${alpha})`;
  }

  const amount = (yRatio - split) / (1 - split);
  return `rgba(${mixChannel(middle.r, bottom.r, amount)}, ${mixChannel(
    middle.g,
    bottom.g,
    amount
  )}, ${mixChannel(middle.b, bottom.b, amount)}, ${alpha})`;
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
    (w: number, h: number): Particle => {
      const useFigure = clustered && Math.random() < 0.9;
      const point = useFigure
        ? sampleFigurePoint()
        : { x: 0.15 + Math.random() * 0.7, y: 0.08 + Math.random() * 0.84 };

      const originX = point.x * w;
      const originY = point.y * h;
      const depth = Math.random();
      const spread = 4 + (1 - depth) * 10;

      return {
        x: originX + (Math.random() - 0.5) * spread,
        y: originY + (Math.random() - 0.5) * spread,
        originX,
        originY,
        vx: 0,
        vy: 0,
        size: 0.8 + Math.random() * maxSize,
        opacity: 0.2 + (1 - depth) * 0.55,
        depth,
        orbitRadius: 0.8 + (1 - depth) * 5,
        orbitSpeed: 0.6 + Math.random() * 0.9,
        phase: Math.random() * Math.PI * 2,
      };
    },
    [clustered, maxSize]
  );

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const activeCanvas: HTMLCanvasElement = canvasRef.current;

    const context = activeCanvas.getContext("2d", { alpha: true });
    if (!context) {
      return;
    }
    const ctx: CanvasRenderingContext2D = context;

    let w = 0;
    let h = 0;
    let monoColor: string | undefined;

    if (color.replace(/\s/g, "") !== "255,255,255") {
      monoColor = color;
    }

    function resize() {
      const rect = activeCanvas.parentElement?.getBoundingClientRect();
      if (!rect) {
        return;
      }

      w = rect.width;
      h = rect.height;

      const dpr = Math.min(window.devicePixelRatio, 2);
      activeCanvas.width = w * dpr;
      activeCanvas.height = h * dpr;
      activeCanvas.style.width = `${w}px`;
      activeCanvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      particlesRef.current = Array.from({ length: particleCount }, () =>
        createParticle(w, h)
      );
    }

    function handleMouseMove(event: MouseEvent) {
      const rect = activeCanvas.getBoundingClientRect();
      mouseRef.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    }

    function handleMouseLeave() {
      mouseRef.current = { x: -1000, y: -1000 };
    }

    function drawAmbientGlow() {
      const glow = ctx.createRadialGradient(w * 0.5, h * 0.46, 0, w * 0.5, h * 0.46, w * 0.3);
      glow.addColorStop(0, "rgba(36, 255, 181, 0.08)");
      glow.addColorStop(0.45, "rgba(72, 144, 255, 0.05)");
      glow.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);
    }

    function animate(time: number) {
      const seconds = time * 0.001;
      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      ctx.clearRect(0, 0, w, h);
      drawAmbientGlow();

      for (const particle of particles) {
        const driftX =
          Math.cos(seconds * particle.orbitSpeed + particle.phase) *
          particle.orbitRadius;
        const driftY =
          Math.sin(seconds * (particle.orbitSpeed * 0.9) + particle.phase) *
          particle.orbitRadius *
          0.65;
        const bodyWave =
          Math.sin(seconds * 1.25 + particle.originY * 0.015) *
          (1.4 - particle.depth);

        const targetX = particle.originX + driftX + bodyWave * 0.6;
        const targetY = particle.originY + driftY + bodyWave * 0.35;

        particle.vx += (targetX - particle.x) * (0.016 + speed * 0.018);
        particle.vy += (targetY - particle.y) * (0.016 + speed * 0.018);

        const dx = particle.x - mouse.x;
        const dy = particle.y - mouse.y;
        const distance = Math.hypot(dx, dy);

        if (distance < 120 && distance > 0.001) {
          const force = ((120 - distance) / 120) * (0.18 + particle.depth * 0.12);
          particle.vx += (dx / distance) * force * 1.4;
          particle.vy += (dy / distance) * force * 1.1;
        }

        particle.vx *= 0.88;
        particle.vy *= 0.88;
        particle.x += particle.vx;
        particle.y += particle.vy;

        const yRatio = clamp(particle.originY / Math.max(h, 1), 0, 1);
        const pulse =
          0.84 +
          Math.sin(seconds * (1.1 + particle.depth) + particle.phase) * 0.16;
        const alpha = particle.opacity * pulse;
        const fill = getParticleColor(alpha, yRatio, monoColor);

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = fill;
        ctx.shadowBlur = 8 + (1 - particle.depth) * 10;
        ctx.shadowColor = fill;
        ctx.fill();
      }

      ctx.shadowBlur = 0;

      const connectionLimit = Math.min(particles.length, 180);
      for (let i = 0; i < connectionLimit; i += 1) {
        const a = particles[i];

        for (let j = i + 1; j < Math.min(i + 8, connectionLimit); j += 1) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distance = Math.hypot(dx, dy);

          if (distance < 26) {
            const alpha = (1 - distance / 26) * 0.055;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = monoColor
              ? `rgba(${monoColor}, ${alpha})`
              : `rgba(185, 231, 255, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    }

    resize();

    activeCanvas.addEventListener("mousemove", handleMouseMove, { passive: true });
    activeCanvas.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", resize);
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationRef.current);
      activeCanvas.removeEventListener("mousemove", handleMouseMove);
      activeCanvas.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", resize);
    };
  }, [color, createParticle, particleCount, speed]);

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
