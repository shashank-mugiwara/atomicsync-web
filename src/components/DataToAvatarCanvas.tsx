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

  // Suppress unused variable lint — progress will be consumed by Task 2
  void progress;

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

    // Placeholder render loop — Task 2 will implement actual rendering
    function animate() {
      ctx!.clearRect(0, 0, w, h);
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
