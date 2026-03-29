"use client";

import { useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Brand colors
// ---------------------------------------------------------------------------
const INDIGO = { r: 99, g: 102, b: 241 }; // #6366f1
const NEON = { r: 0, g: 255, b: 136 };    // #00ff88

// ---------------------------------------------------------------------------
// SVG silhouette path — contrapposto human, 200x500 viewBox
// ---------------------------------------------------------------------------
const SILHOUETTE_PATH = [
  // Head
  "M 100,28",
  "C 84,28 74,40 74,56",
  "C 74,72 84,84 100,84",
  "C 116,84 126,72 126,56",
  "C 126,40 116,28 100,28",
  "Z",

  // Neck
  "M 92,84",
  "L 92,98",
  "L 108,98",
  "L 108,84",

  // Torso + shoulders
  "M 92,98",
  "C 72,100 52,108 48,118",  // left shoulder
  "L 44,120",
  // Left arm
  "C 38,140 36,164 40,188",
  "C 42,200 38,216 34,232",  // forearm bends outward
  "C 30,246 28,254 30,260",  // left hand
  "C 34,266 40,264 42,258",
  "C 46,244 48,228 50,212",
  "C 52,196 54,180 56,164",
  "C 58,148 60,136 62,128",
  // Left torso side
  "L 64,148",
  "C 66,172 68,196 70,220",
  // Waist (left hip higher — contrapposto)
  "C 70,240 68,260 66,280",
  // Left leg
  "C 64,310 62,340 60,370",
  "C 58,390 56,410 56,430",
  // Left foot
  "C 56,444 54,454 50,460",
  "C 46,468 42,470 40,470",
  "C 36,470 34,466 38,462",
  "C 42,458 48,454 52,448",
  "C 54,442 56,436 56,430",

  // Cross to right leg at bottom
  "L 56,430",
  "L 80,430",

  // Crotch / inner legs
  "L 80,280",
  "L 120,280",

  // Right leg
  "L 120,430",
  "C 120,436 122,442 126,448",
  "C 130,454 136,458 140,462",
  "C 144,466 142,470 138,470",
  "C 136,470 132,468 128,460",
  "C 124,454 122,444 122,430",
  "C 122,410 124,390 126,370",
  "C 128,340 130,310 132,280",

  // Right waist + torso
  "C 132,260 130,240 130,220",
  "C 132,196 134,172 136,148",
  "L 138,128",
  "C 140,136 142,148 144,164",
  "C 146,180 148,196 150,212",
  "C 152,228 154,244 158,258",
  "C 160,264 166,266 170,260",
  "C 172,254 170,246 166,232",
  "C 162,216 158,200 160,188",
  "C 164,164 162,140 156,120",
  "L 152,118",
  "C 148,108 128,100 108,98",
  "Z",
].join(" ");

const SILHOUETTE_VIEWBOX_W = 200;
const SILHOUETTE_VIEWBOX_H = 500;

// ---------------------------------------------------------------------------
// MorphParticle interface
// ---------------------------------------------------------------------------
export interface MorphParticle {
  scatteredX: number;   // normalized 0-1 random position
  scatteredY: number;
  targetX: number;      // normalized 0-1 position within silhouette
  targetY: number;
  size: number;         // 1-5 px, density-based
  baseOpacity: number;  // 0.4-1.0
  colorPhase: number;   // 0.0 (indigo) to 1.0 (neon)
  arrivalOrder: number; // 0 (core) to 1 (extremity)
  breathPhase: number;  // random offset for breathing animation
  driftVx: number;      // Brownian drift velocity
  driftVy: number;
}

// ---------------------------------------------------------------------------
// Poisson disk sampling (Bridson's algorithm)
// ---------------------------------------------------------------------------
function poissonDiskSample(
  path2D: Path2D,
  viewW: number,
  viewH: number,
  targetCount: number,
  ctx: CanvasRenderingContext2D,
): { x: number; y: number }[] {
  // Estimate min distance from target count & area
  const area = viewW * viewH;
  const baseMinDist = Math.sqrt(area / (targetCount * Math.PI)) * 1.2;
  const k = 30; // candidates per active point

  // Density weighting: returns multiplier for minDistance at a given y
  // Smaller multiplier = denser sampling
  function densityMultiplier(y: number): number {
    const t = y / viewH;
    if (t < 0.4) return 0.75;       // head + torso: denser
    if (t < 0.7) return 1.0;        // mid-body
    return 1.25;                     // legs/feet: sparser
  }

  // Grid for spatial lookup
  const cellSize = baseMinDist / Math.SQRT2;
  const gridW = Math.ceil(viewW / cellSize);
  const gridH = Math.ceil(viewH / cellSize);
  const grid: (number | null)[] = new Array(gridW * gridH).fill(null);

  const points: { x: number; y: number }[] = [];
  const active: number[] = [];

  function gridIndex(x: number, y: number): number {
    return Math.floor(y / cellSize) * gridW + Math.floor(x / cellSize);
  }

  function addPoint(x: number, y: number): number {
    const idx = points.length;
    points.push({ x, y });
    active.push(idx);
    grid[gridIndex(x, y)] = idx;
    return idx;
  }

  function isTooClose(x: number, y: number, minDist: number): boolean {
    const gx = Math.floor(x / cellSize);
    const gy = Math.floor(y / cellSize);
    const searchRadius = Math.ceil(minDist / cellSize);

    for (let dy = -searchRadius; dy <= searchRadius; dy++) {
      for (let dx = -searchRadius; dx <= searchRadius; dx++) {
        const nx = gx + dx;
        const ny = gy + dy;
        if (nx < 0 || ny < 0 || nx >= gridW || ny >= gridH) continue;
        const idx = grid[ny * gridW + nx];
        if (idx === null) continue;
        const p = points[idx];
        const ddx = p.x - x;
        const ddy = p.y - y;
        if (ddx * ddx + ddy * ddy < minDist * minDist) return true;
      }
    }
    return false;
  }

  // Seed from center of figure
  const seedX = viewW / 2;
  const seedY = viewH * 0.4;
  if (ctx.isPointInPath(path2D, seedX, seedY)) {
    addPoint(seedX, seedY);
  } else {
    // Find a valid seed nearby
    for (let r = 1; r < 50; r++) {
      let found = false;
      for (let a = 0; a < 8; a++) {
        const angle = (a / 8) * Math.PI * 2;
        const px = seedX + Math.cos(angle) * r;
        const py = seedY + Math.sin(angle) * r;
        if (ctx.isPointInPath(path2D, px, py)) {
          addPoint(px, py);
          found = true;
          break;
        }
      }
      if (found) break;
    }
  }

  // Main Bridson loop
  let safety = 0;
  const maxIterations = targetCount * 20;

  while (active.length > 0 && safety < maxIterations) {
    safety++;
    const randIdx = Math.floor(Math.random() * active.length);
    const pIdx = active[randIdx];
    const p = points[pIdx];
    const localMinDist = baseMinDist * densityMultiplier(p.y);
    let found = false;

    for (let i = 0; i < k; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = localMinDist + Math.random() * localMinDist;
      const nx = p.x + Math.cos(angle) * dist;
      const ny = p.y + Math.sin(angle) * dist;

      if (nx < 0 || ny < 0 || nx >= viewW || ny >= viewH) continue;
      if (!ctx.isPointInPath(path2D, nx, ny)) continue;

      const candidateMinDist = baseMinDist * densityMultiplier(ny);
      if (isTooClose(nx, ny, candidateMinDist)) continue;

      addPoint(nx, ny);
      found = true;
      break;
    }

    if (!found) {
      active.splice(randIdx, 1);
    }
  }

  return points;
}

// ---------------------------------------------------------------------------
// Gap filling
// ---------------------------------------------------------------------------
function fillGaps(
  points: { x: number; y: number }[],
  path2D: Path2D,
  viewW: number,
  viewH: number,
  ctx: CanvasRenderingContext2D,
): { x: number; y: number }[] {
  const cellSize = 12;
  const cols = Math.ceil(viewW / cellSize);
  const rows = Math.ceil(viewH / cellSize);

  // Mark cells that already have points
  const occupied = new Set<number>();
  for (const p of points) {
    const col = Math.floor(p.x / cellSize);
    const row = Math.floor(p.y / cellSize);
    occupied.add(row * cols + col);
  }

  const augmented = [...points];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (occupied.has(row * cols + col)) continue;
      const cx = (col + 0.5) * cellSize;
      const cy = (row + 0.5) * cellSize;
      if (ctx.isPointInPath(path2D, cx, cy)) {
        augmented.push({ x: cx, y: cy });
      }
    }
  }

  return augmented;
}

// ---------------------------------------------------------------------------
// Particle builder
// ---------------------------------------------------------------------------
function buildParticles(
  rawPoints: { x: number; y: number }[],
  viewW: number,
  viewH: number,
): MorphParticle[] {
  const heartX = viewW / 2;
  const heartY = viewH * 0.4;
  const maxDist = Math.sqrt(viewW * viewW + viewH * viewH) / 2;

  return rawPoints.map((p) => {
    const dx = p.x - heartX;
    const dy = p.y - heartY;
    const distFromHeart = Math.sqrt(dx * dx + dy * dy);
    const normalizedDist = Math.min(distFromHeart / maxDist, 1);

    // Density proxy: points in the upper 40% are denser -> smaller size
    const yRatio = p.y / viewH;
    const densityFactor = yRatio < 0.4 ? 0.3 : yRatio < 0.7 ? 0.6 : 1.0;
    const size = 1 + densityFactor * 4; // 1-5 range

    return {
      scatteredX: Math.random(),
      scatteredY: Math.random(),
      targetX: p.x / viewW,
      targetY: p.y / viewH,
      size,
      baseOpacity: 0.4 + Math.random() * 0.6,
      colorPhase: 1 - normalizedDist,        // core = neon (1.0), extremity = indigo (0.0)
      arrivalOrder: normalizedDist,           // core arrives first (0), extremity last (1)
      breathPhase: Math.random() * Math.PI * 2,
      driftVx: (Math.random() - 0.5) * 0.2,
      driftVy: (Math.random() - 0.5) * 0.2,
    };
  });
}

// ---------------------------------------------------------------------------
// DataToAvatarCanvas component
// ---------------------------------------------------------------------------
interface DataToAvatarCanvasProps {
  progress: number;
  className?: string;
}

export function DataToAvatarCanvas({ progress, className }: DataToAvatarCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<MorphParticle[]>([]);
  const animationRef = useRef<number>(0);
  const progressRef = useRef<number>(progress);
  const timeRef = useRef<number>(0);

  // Keep progressRef in sync without re-running the effect
  progressRef.current = progress;

  const initParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const path2D = new Path2D(SILHOUETTE_PATH);
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const targetCount = isMobile ? 1500 : 2500;

    const sampled = poissonDiskSample(
      path2D,
      SILHOUETTE_VIEWBOX_W,
      SILHOUETTE_VIEWBOX_H,
      targetCount,
      ctx,
    );

    const filled = fillGaps(
      sampled,
      path2D,
      SILHOUETTE_VIEWBOX_W,
      SILHOUETTE_VIEWBOX_H,
      ctx,
    );

    particlesRef.current = buildParticles(
      filled,
      SILHOUETTE_VIEWBOX_W,
      SILHOUETTE_VIEWBOX_H,
    );
  }, []);

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
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();
    initParticles();

    window.addEventListener("resize", resize);

    // Color interpolation between INDIGO and NEON
    function lerpColor(t: number): { r: number; g: number; b: number } {
      const clamped = Math.max(0, Math.min(1, t));
      return {
        r: Math.round(INDIGO.r + (NEON.r - INDIGO.r) * clamped),
        g: Math.round(INDIGO.g + (NEON.g - INDIGO.g) * clamped),
        b: Math.round(INDIGO.b + (NEON.b - INDIGO.b) * clamped),
      };
    }

    function easeOutCubic(t: number): number {
      return 1 - Math.pow(1 - t, 3);
    }

    function animate() {
      ctx!.clearRect(0, 0, w, h);
      timeRef.current += 1;
      const time = timeRef.current;

      const particles = particlesRef.current;
      if (particles.length === 0) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const currentProgress = progressRef.current;

      // --- Scale silhouette to fit canvas ---
      const aspect = SILHOUETTE_VIEWBOX_W / SILHOUETTE_VIEWBOX_H;
      const figureHeight = h * 0.6;
      const figureW = figureHeight * aspect;
      const offsetX = (w - figureW) / 2;
      const offsetY = (h - figureHeight) * 0.35;

      // --- Global morph progress: map scroll 0.1–0.7 to 0–1 ---
      const morphT = Math.max(0, Math.min(1, (currentProgress - 0.1) / 0.6));

      // --- Connection lines setup ---
      const showLines = currentProgress > 0.1 && currentProgress < 0.7;
      let lineAlpha = 0;
      if (showLines) {
        if (currentProgress < 0.3) {
          lineAlpha = (currentProgress - 0.1) / 0.2; // fade in
        } else if (currentProgress < 0.6) {
          lineAlpha = 1; // full
        } else {
          lineAlpha = (0.7 - currentProgress) / 0.1; // fade out
        }
      }

      // --- Render each particle ---
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Per-particle staggered morph
        const rawT = Math.max(0, Math.min(1, (morphT - p.arrivalOrder * 0.5) / (1 - p.arrivalOrder * 0.5)));
        const easedT = easeOutCubic(rawT);

        // Interpolate position
        let x = p.scatteredX * w + (p.targetX * figureW + offsetX - p.scatteredX * w) * easedT;
        let y = p.scatteredY * h + (p.targetY * figureHeight + offsetY - p.scatteredY * h) * easedT;

        // Brownian drift (scattered state)
        if (easedT < 1) {
          const driftScale = 1 - easedT;
          p.driftVx += (Math.random() - 0.5) * 0.1;
          p.driftVy += (Math.random() - 0.5) * 0.1;
          p.driftVx *= 0.98;
          p.driftVy *= 0.98;
          x += p.driftVx * driftScale * 3;
          y += p.driftVy * driftScale * 3;
        }

        // Breathing drift (formed state)
        if (easedT > 0.8) {
          const breathScale = (easedT - 0.8) / 0.2;
          x += Math.sin(time * 0.02 + p.breathPhase) * 1.5 * breathScale;
          y += Math.cos(time * 0.025 + p.breathPhase * 1.3) * 1.0 * breathScale;
        }

        // Color interpolation
        const colorT = easedT * p.colorPhase;
        const col = lerpColor(colorT);

        // Opacity: brighter when formed
        const opacity = p.baseOpacity * (0.5 + easedT * 0.5);
        const radius = p.size;

        // Trailing glow during morph
        if (morphT > 0 && morphT < 1) {
          ctx!.shadowBlur = 3;
          ctx!.shadowColor = `rgba(${col.r}, ${col.g}, ${col.b}, 0.3)`;
        } else {
          ctx!.shadowBlur = 0;
        }

        // Soft glow rendering with radial gradient
        const grad = ctx!.createRadialGradient(x, y, 0, x, y, radius * 2.5);
        grad.addColorStop(0, `rgba(${col.r}, ${col.g}, ${col.b}, ${opacity})`);
        grad.addColorStop(0.4, `rgba(${col.r}, ${col.g}, ${col.b}, ${opacity * 0.6})`);
        grad.addColorStop(1, `rgba(${col.r}, ${col.g}, ${col.b}, 0)`);

        ctx!.beginPath();
        ctx!.arc(x, y, radius * 2.5, 0, Math.PI * 2);
        ctx!.fillStyle = grad;
        ctx!.fill();
      }

      // Reset shadow after particles
      ctx!.shadowBlur = 0;

      // --- Connection lines ---
      if (showLines && lineAlpha > 0) {
        const step = Math.max(1, Math.floor(particles.length / 500));
        ctx!.lineWidth = 0.5;

        for (let i = 0; i < particles.length; i += step) {
          const pA = particles[i];
          const rawTA = Math.max(0, Math.min(1, (morphT - pA.arrivalOrder * 0.5) / (1 - pA.arrivalOrder * 0.5)));
          const easedTA = easeOutCubic(rawTA);
          const ax = pA.scatteredX * w + (pA.targetX * figureW + offsetX - pA.scatteredX * w) * easedTA;
          const ay = pA.scatteredY * h + (pA.targetY * figureHeight + offsetY - pA.scatteredY * h) * easedTA;

          for (let j = i + step; j < particles.length; j += step) {
            const pB = particles[j];
            const rawTB = Math.max(0, Math.min(1, (morphT - pB.arrivalOrder * 0.5) / (1 - pB.arrivalOrder * 0.5)));
            const easedTB = easeOutCubic(rawTB);
            const bx = pB.scatteredX * w + (pB.targetX * figureW + offsetX - pB.scatteredX * w) * easedTB;
            const by = pB.scatteredY * h + (pB.targetY * figureHeight + offsetY - pB.scatteredY * h) * easedTB;

            const dx = ax - bx;
            const dy = ay - by;
            if (dx * dx + dy * dy < 3000) {
              ctx!.strokeStyle = `rgba(99, 102, 241, ${0.06 * lineAlpha})`;
              ctx!.beginPath();
              ctx!.moveTo(ax, ay);
              ctx!.lineTo(bx, by);
              ctx!.stroke();
            }
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    }

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("absolute inset-0 pointer-events-none", className)}
      aria-hidden="true"
    />
  );
}

// Re-export constants for use by other tasks
export { INDIGO, NEON, SILHOUETTE_PATH, SILHOUETTE_VIEWBOX_W, SILHOUETTE_VIEWBOX_H };
