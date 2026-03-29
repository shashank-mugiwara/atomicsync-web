# Data-to-Avatar Particle Morph Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a scroll-driven particle animation section where scattered dots morph into a human silhouette, placed between Hero and Features sections.

**Architecture:** Two new components — `DataToAvatarSection.tsx` (scroll tracking, layout, tagline) and `DataToAvatarCanvas.tsx` (Canvas 2D particle engine driven by a `progress` prop). The canvas component uses Poisson disk sampling to generate a gap-free point cloud from an SVG silhouette path, then morphs particles between scattered and target positions based on scroll progress.

**Tech Stack:** React 19, Canvas 2D API, TypeScript strict, Tailwind CSS v4, IntersectionObserver, passive scroll listeners. No new dependencies.

**Spec:** `docs/superpowers/specs/2026-03-29-data-to-avatar-particle-morph-design.md`

---

## File Structure

| File | Action | Responsibility |
|---|---|---|
| `src/components/DataToAvatarCanvas.tsx` | Create | Canvas 2D particle engine. Poisson disk sampling, particle rendering (glow, color interpolation), morph animation, connection lines. Receives `progress: number` prop. |
| `src/components/DataToAvatarSection.tsx` | Create | Section layout (300vh container, sticky inner), scroll progress calculation, tagline with progress-driven visibility. Mounts DataToAvatarCanvas. |
| `src/app/page.tsx` | Modify | Add `<DataToAvatarSection />` between section-divider and FeaturesSection. |
| `src/components/__tests__/DataToAvatarSection.test.tsx` | Create | Tests for section rendering, tagline visibility, scroll progress. |

---

### Task 1: SVG Silhouette Path & Poisson Disk Sampling

**Files:**
- Create: `src/components/DataToAvatarCanvas.tsx`

This task builds the core point cloud generation — the SVG path, Poisson disk sampling algorithm, gap filling, and point attribute computation. No rendering yet.

- [ ] **Step 1: Create DataToAvatarCanvas.tsx with the SVG silhouette path constant and particle types**

```tsx
"use client";

import { useEffect, useRef, useCallback } from "react";

// --- Brand colors ---
const INDIGO = { r: 99, g: 102, b: 241 };   // #6366f1
const NEON   = { r: 0,  g: 255, b: 136 };   // #00ff88

// --- Human silhouette SVG path (contrapposto pose) ---
// Normalized to a 200x500 viewBox. Will be scaled to canvas at render time.
const SILHOUETTE_PATH = `
M 100 10
C 80 10, 65 25, 65 45
C 65 65, 80 80, 100 80
C 120 80, 135 65, 135 45
C 135 25, 120 10, 100 10
Z
M 75 85
L 60 90
L 40 140
L 50 145
L 70 105
L 80 170
L 55 280
L 50 370
L 45 460
L 55 465
L 70 375
L 80 285
L 95 200
L 100 200
L 105 200
L 120 285
L 130 375
L 145 465
L 155 460
L 150 370
L 145 280
L 120 170
L 130 105
L 150 145
L 160 140
L 140 90
L 125 85
L 100 95
L 75 85
Z
`;

const SILHOUETTE_VIEWBOX = { width: 200, height: 500 };

interface MorphParticle {
  // Scattered position (normalized 0-1)
  scatteredX: number;
  scatteredY: number;
  // Target position inside silhouette (normalized 0-1)
  targetX: number;
  targetY: number;
  // Visual attributes
  size: number;
  baseOpacity: number;
  colorPhase: number;     // 0 = indigo, 1 = neon
  arrivalOrder: number;   // 0 = arrives first (core), 1 = arrives last (extremity)
  // Animation state
  breathPhase: number;    // random offset for breathing drift
  driftVx: number;        // Brownian drift velocity
  driftVy: number;
}

interface DataToAvatarCanvasProps {
  progress: number;
  className?: string;
}

/**
 * Poisson disk sampling within an SVG path silhouette.
 * Returns evenly-spaced points with no gaps or clumps.
 */
function poissonDiskSample(
  path2D: Path2D,
  viewBox: { width: number; height: number },
  targetCount: number,
  ctx: CanvasRenderingContext2D
): { x: number; y: number }[] {
  const { width, height } = viewBox;
  const area = width * height;

  // Estimate minDistance from target count (approximate packing density)
  // For Poisson disk, density ≈ 1 / (2 * sqrt(3) * r^2)
  // Simplified: r ≈ sqrt(area / (targetCount * 2))
  const baseMinDist = Math.sqrt(area / (targetCount * 2.5));

  const points: { x: number; y: number }[] = [];
  const cellSize = baseMinDist / Math.SQRT2;
  const gridW = Math.ceil(width / cellSize);
  const gridH = Math.ceil(height / cellSize);
  const grid: (number | null)[] = new Array(gridW * gridH).fill(null);

  function gridIndex(x: number, y: number): number {
    return Math.floor(y / cellSize) * gridW + Math.floor(x / cellSize);
  }

  function isTooClose(x: number, y: number, minDist: number): boolean {
    const gx = Math.floor(x / cellSize);
    const gy = Math.floor(y / cellSize);
    const searchRadius = 2;
    for (let dy = -searchRadius; dy <= searchRadius; dy++) {
      for (let dx = -searchRadius; dx <= searchRadius; dx++) {
        const nx = gx + dx;
        const ny = gy + dy;
        if (nx < 0 || nx >= gridW || ny < 0 || ny >= gridH) continue;
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

  // Density weighting: denser at top (head/torso), sparser at bottom (legs)
  function getMinDist(y: number): number {
    const normalizedY = y / height;
    if (normalizedY < 0.4) return baseMinDist * 0.7;  // Head/torso: dense
    if (normalizedY > 0.7) return baseMinDist * 1.3;  // Legs/feet: sparse
    return baseMinDist;                                 // Mid-body: normal
  }

  // Seed with a point near the center
  const seedX = width / 2;
  const seedY = height * 0.4;
  if (ctx.isPointInPath(path2D, seedX, seedY)) {
    points.push({ x: seedX, y: seedY });
    grid[gridIndex(seedX, seedY)] = 0;
  }

  // Active list for dart throwing
  const active: number[] = [0];
  const maxAttempts = 30;

  while (active.length > 0) {
    const randIdx = Math.floor(Math.random() * active.length);
    const parent = points[active[randIdx]];
    let found = false;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const minDist = getMinDist(parent.y);
      const angle = Math.random() * Math.PI * 2;
      const radius = minDist + Math.random() * minDist;
      const nx = parent.x + Math.cos(angle) * radius;
      const ny = parent.y + Math.sin(angle) * radius;

      if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
      if (!ctx.isPointInPath(path2D, nx, ny)) continue;

      const localMinDist = getMinDist(ny);
      if (isTooClose(nx, ny, localMinDist)) continue;

      const newIdx = points.length;
      points.push({ x: nx, y: ny });
      grid[gridIndex(nx, ny)] = newIdx;
      active.push(newIdx);
      found = true;
      break;
    }

    if (!found) {
      active.splice(randIdx, 1);
    }
  }

  return points;
}

/**
 * Adaptive gap filling: ensures no empty cells inside the silhouette.
 */
function fillGaps(
  points: { x: number; y: number }[],
  path2D: Path2D,
  viewBox: { width: number; height: number },
  ctx: CanvasRenderingContext2D
): { x: number; y: number }[] {
  const cellSize = 12; // Check grid at 12px resolution
  const { width, height } = viewBox;
  const filled = [...points];

  for (let cy = 0; cy < height; cy += cellSize) {
    for (let cx = 0; cx < width; cx += cellSize) {
      const centerX = cx + cellSize / 2;
      const centerY = cy + cellSize / 2;

      if (!ctx.isPointInPath(path2D, centerX, centerY)) continue;

      // Check if any existing point is in this cell
      const hasPoint = filled.some(
        (p) =>
          p.x >= cx &&
          p.x < cx + cellSize &&
          p.y >= cy &&
          p.y < cy + cellSize
      );

      if (!hasPoint) {
        // Inject a point with slight random offset
        filled.push({
          x: centerX + (Math.random() - 0.5) * cellSize * 0.5,
          y: centerY + (Math.random() - 0.5) * cellSize * 0.5,
        });
      }
    }
  }

  return filled;
}

/**
 * Convert raw sampled points into full MorphParticle objects with all attributes.
 */
function buildParticles(
  sampledPoints: { x: number; y: number }[],
  viewBox: { width: number; height: number }
): MorphParticle[] {
  const { width, height } = viewBox;
  // "Heart" center for colorPhase and arrivalOrder
  const heartX = width / 2;
  const heartY = height * 0.4;
  const maxDist = Math.sqrt(width * width + height * height);

  return sampledPoints.map((p) => {
    const normalizedX = p.x / width;
    const normalizedY = p.y / height;
    const distFromHeart = Math.sqrt(
      (p.x - heartX) ** 2 + (p.y - heartY) ** 2
    );
    const normalizedDist = distFromHeart / maxDist;

    // Density-based size: denser regions (top) get smaller dots
    const densityFactor = normalizedY < 0.4 ? 0.6 : normalizedY > 0.7 ? 1.0 : 0.8;
    const size = 1 + Math.random() * 4 * densityFactor;

    return {
      scatteredX: Math.random(),
      scatteredY: Math.random(),
      targetX: normalizedX,
      targetY: normalizedY,
      size,
      baseOpacity: 0.4 + Math.random() * 0.6,
      colorPhase: 1 - normalizedDist, // 1 = near heart (neon), 0 = far (indigo)
      arrivalOrder: normalizedDist,     // 0 = core first, 1 = extremity last
      breathPhase: Math.random() * Math.PI * 2,
      driftVx: (Math.random() - 0.5) * 0.3,
      driftVy: (Math.random() - 0.5) * 0.3,
    };
  });
}

export function DataToAvatarCanvas({ progress, className }: DataToAvatarCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<MorphParticle[]>([]);
  const animationRef = useRef<number>(0);
  const timeRef = useRef<number>(0);

  // Generate point cloud on mount
  const initParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const path2D = new Path2D(SILHOUETTE_PATH);
    const isMobile = window.innerWidth < 768;
    const targetCount = isMobile ? 1500 : 2500;

    const rawPoints = poissonDiskSample(path2D, SILHOUETTE_VIEWBOX, targetCount, ctx);
    const filledPoints = fillGaps(rawPoints, path2D, SILHOUETTE_VIEWBOX, ctx);
    particlesRef.current = buildParticles(filledPoints, SILHOUETTE_VIEWBOX);
  }, []);

  useEffect(() => {
    initParticles();
  }, [initParticles]);

  // Rendering — Task 2 will implement this
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    function resize() {
      const rect = canvas!.parentElement!.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    />
  );
}
```

- [ ] **Step 2: Verify it compiles**

Run: `cd /Users/shashank.j/Desktop/CentralProject/atomicsync-web && npx tsc --noEmit --pretty 2>&1 | head -30`

Expected: No errors in `DataToAvatarCanvas.tsx`. If the SVG path causes issues with `Path2D`, that's fine — it runs in the browser, not during type checking.

- [ ] **Step 3: Commit**

```bash
cd /Users/shashank.j/Desktop/CentralProject/atomicsync-web
git add src/components/DataToAvatarCanvas.tsx
git commit -m "feat: add DataToAvatarCanvas with Poisson disk sampling and silhouette path"
```

---

### Task 2: Particle Rendering Engine

**Files:**
- Modify: `src/components/DataToAvatarCanvas.tsx`

This task adds the full rendering loop: particle drawing with soft glow, color interpolation (indigo→neon), morph animation driven by `progress`, staggered arrival, breathing drift, connection lines, and trailing glow.

- [ ] **Step 1: Add the render loop to DataToAvatarCanvas**

Replace the rendering `useEffect` (the one with the `resize` function and the comment "Rendering — Task 2 will implement this") with the full animation loop:

```tsx
  // --- Rendering ---
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
    window.addEventListener("resize", resize);

    function lerpColor(t: number): { r: number; g: number; b: number } {
      return {
        r: INDIGO.r + (NEON.r - INDIGO.r) * t,
        g: INDIGO.g + (NEON.g - INDIGO.g) * t,
        b: INDIGO.b + (NEON.b - INDIGO.b) * t,
      };
    }

    // Cubic ease-out: accelerate off start, settle gently
    function easeOutCubic(t: number): number {
      return 1 - Math.pow(1 - t, 3);
    }

    function animate() {
      ctx!.clearRect(0, 0, w, h);
      const particles = particlesRef.current;
      if (particles.length === 0) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      timeRef.current += 1;
      const time = timeRef.current;

      // Scale silhouette to fit in canvas (centered, ~60% height)
      const figureHeight = h * 0.6;
      const figureWidth = figureHeight * (SILHOUETTE_VIEWBOX.width / SILHOUETTE_VIEWBOX.height);
      const offsetX = (w - figureWidth) / 2;
      const offsetY = (h - figureHeight) * 0.35; // slightly above center

      // Global morph progress mapped from scroll progress
      // Morph happens between progress 0.1 and 0.7
      const morphT = Math.max(0, Math.min(1, (progress - 0.1) / 0.6));

      // Connection lines phase: visible between 0.3 and 0.7 progress
      const lineAlpha =
        progress < 0.3
          ? (progress - 0.1) / 0.2  // fade in 0.1-0.3
          : progress > 0.6
            ? Math.max(0, (0.7 - progress) / 0.1) // fade out 0.6-0.7
            : 1;                                    // full 0.3-0.6
      const showLines = progress > 0.1 && progress < 0.7;

      // Shadow blur for trailing glow during morph
      const glowAmount = morphT > 0 && morphT < 1 ? 3 : 0;

      // Collect rendered positions for connection lines
      const rendered: { x: number; y: number }[] = [];

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Per-particle morph progress (staggered by arrivalOrder)
        // arrivalOrder 0 (core) starts morphing immediately
        // arrivalOrder 1 (extremity) starts morphing later
        const particleStart = p.arrivalOrder * 0.5; // 0..0.5 delay
        const particleT = Math.max(0, Math.min(1, (morphT - particleStart) / (1 - particleStart)));
        const easedT = easeOutCubic(particleT);

        // Compute current position
        const scX = p.scatteredX * w;
        const scY = p.scatteredY * h;
        const tgX = offsetX + p.targetX * figureWidth;
        const tgY = offsetY + p.targetY * figureHeight;

        let x = scX + (tgX - scX) * easedT;
        let y = scY + (tgY - scY) * easedT;

        // Brownian drift in scattered state (fades as morph progresses)
        if (easedT < 1) {
          const driftScale = 1 - easedT;
          p.driftVx += (Math.random() - 0.5) * 0.1;
          p.driftVy += (Math.random() - 0.5) * 0.1;
          p.driftVx *= 0.98;
          p.driftVy *= 0.98;
          x += p.driftVx * driftScale * 3;
          y += p.driftVy * driftScale * 3;
        }

        // Breathing drift when formed
        if (easedT > 0.8) {
          const breathScale = (easedT - 0.8) / 0.2;
          x += Math.sin(time * 0.02 + p.breathPhase) * 1.5 * breathScale;
          y += Math.cos(time * 0.025 + p.breathPhase * 1.3) * 1.0 * breathScale;
        }

        // Color: interpolate based on morph progress and particle's colorPhase
        const colorT = easedT * p.colorPhase;
        const color = lerpColor(colorT);

        // Opacity: base opacity, faded by morph state
        const opacity = p.baseOpacity * (0.5 + easedT * 0.5);

        // Draw particle with soft glow (radial gradient)
        const radius = p.size;
        const gradient = ctx!.createRadialGradient(x, y, 0, x, y, radius * 2.5);
        gradient.addColorStop(0, `rgba(${color.r|0}, ${color.g|0}, ${color.b|0}, ${opacity})`);
        gradient.addColorStop(0.4, `rgba(${color.r|0}, ${color.g|0}, ${color.b|0}, ${opacity * 0.6})`);
        gradient.addColorStop(1, `rgba(${color.r|0}, ${color.g|0}, ${color.b|0}, 0)`);

        if (glowAmount > 0) {
          ctx!.shadowBlur = glowAmount;
          ctx!.shadowColor = `rgba(${color.r|0}, ${color.g|0}, ${color.b|0}, 0.3)`;
        } else {
          ctx!.shadowBlur = 0;
        }

        ctx!.beginPath();
        ctx!.arc(x, y, radius * 2.5, 0, Math.PI * 2);
        ctx!.fillStyle = gradient;
        ctx!.fill();

        rendered.push({ x, y });
      }

      // Connection lines between nearby particles (mid-morph only)
      if (showLines && lineAlpha > 0) {
        ctx!.shadowBlur = 0;
        ctx!.strokeStyle = `rgba(99, 102, 241, ${0.06 * Math.max(0, lineAlpha)})`;
        ctx!.lineWidth = 0.5;
        const step = Math.max(1, Math.floor(rendered.length / 500));
        for (let i = 0; i < rendered.length; i += step) {
          const a = rendered[i];
          for (let j = i + step; j < Math.min(i + step * 8, rendered.length); j += step) {
            const b = rendered[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const dist = dx * dx + dy * dy;
            if (dist < 3000) {
              ctx!.beginPath();
              ctx!.moveTo(a.x, a.y);
              ctx!.lineTo(b.x, b.y);
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
  }, [progress]);
```

- [ ] **Step 2: Verify it compiles**

Run: `cd /Users/shashank.j/Desktop/CentralProject/atomicsync-web && npx tsc --noEmit --pretty 2>&1 | head -20`

Expected: No type errors.

- [ ] **Step 3: Commit**

```bash
cd /Users/shashank.j/Desktop/CentralProject/atomicsync-web
git add src/components/DataToAvatarCanvas.tsx
git commit -m "feat: add particle rendering engine with morph, glow, color interpolation, and connection lines"
```

---

### Task 3: DataToAvatarSection with Scroll Tracking & Tagline

**Files:**
- Create: `src/components/DataToAvatarSection.tsx`

This task creates the section wrapper that handles the 300vh container, sticky pinning, scroll progress computation, and the tagline element.

- [ ] **Step 1: Create DataToAvatarSection.tsx**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { DataToAvatarCanvas } from "@/components/DataToAvatarCanvas";

export function DataToAvatarSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // IntersectionObserver to gate scroll listening
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0 }
    );
    observer.observe(container);

    function handleScroll() {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const containerHeight = container.offsetHeight;
      const viewportHeight = window.innerHeight;

      // Progress: 0 when top of container hits top of viewport,
      // 1 when bottom of container minus one viewport reaches top.
      const scrollableDistance = containerHeight - viewportHeight;
      const scrolled = -rect.top;
      const t = Math.max(0, Math.min(1, scrolled / scrollableDistance));
      setProgress(t);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // initial calculation

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Tagline appears at progress >= 0.7
  const taglineVisible = progress >= 0.7;

  return (
    <section
      ref={containerRef}
      role="presentation"
      style={{ height: "300vh", position: "relative", background: "#0a0a0a" }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          width: "100%",
          overflow: "hidden",
        }}
      >
        {isVisible && <DataToAvatarCanvas progress={progress} />}

        {/* Tagline */}
        <p
          className="absolute left-1/2 -translate-x-1/2 font-sans text-[#fafafa] uppercase tracking-[0.2em] transition-all duration-700"
          style={{
            top: "72%",
            fontSize: "clamp(1.25rem, 2vw, 2rem)",
            opacity: taglineVisible ? 1 : 0,
            transform: `translateX(-50%) translateY(${taglineVisible ? 0 : 10}px)`,
            textShadow: "0 0 20px rgba(0, 255, 136, 0.3)",
            transitionTimingFunction: "cubic-bezier(.16, 1, .3, 1)",
          }}
        >
          Your data, alive.
        </p>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify it compiles**

Run: `cd /Users/shashank.j/Desktop/CentralProject/atomicsync-web && npx tsc --noEmit --pretty 2>&1 | head -20`

Expected: No type errors.

- [ ] **Step 3: Commit**

```bash
cd /Users/shashank.j/Desktop/CentralProject/atomicsync-web
git add src/components/DataToAvatarSection.tsx
git commit -m "feat: add DataToAvatarSection with scroll tracking, sticky pinning, and tagline"
```

---

### Task 4: Integrate into Page

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Add DataToAvatarSection to the page**

In `src/app/page.tsx`, add the import at the top and place the component between the section-divider and FeaturesSection:

Add import:
```tsx
import { DataToAvatarSection } from "@/components/DataToAvatarSection";
```

Change the JSX — replace:
```tsx
        <div className="section-divider" />
        <FeaturesSection />
```

With:
```tsx
        <div className="section-divider" />
        <DataToAvatarSection />
        <FeaturesSection />
```

- [ ] **Step 2: Run dev server and verify visually**

Run: `cd /Users/shashank.j/Desktop/CentralProject/atomicsync-web && npm run dev`

Open `http://localhost:3000` in browser. Scroll past the Hero section. You should see:
- Dark background section appears
- Scattered indigo dots with gentle drift
- As you scroll, dots converge into a human silhouette shape
- Colors shift from indigo to neon green (core first, extremities last)
- Faint connection lines appear mid-morph then fade
- Tagline "YOUR DATA, ALIVE." fades in once figure is formed
- Section scrolls away naturally after

- [ ] **Step 3: Run build to verify no SSR issues**

Run: `cd /Users/shashank.j/Desktop/CentralProject/atomicsync-web && npm run build 2>&1 | tail -20`

Expected: Build succeeds. Both components use `"use client"` so no SSR issues with Canvas/window.

- [ ] **Step 4: Commit**

```bash
cd /Users/shashank.j/Desktop/CentralProject/atomicsync-web
git add src/app/page.tsx
git commit -m "feat: integrate DataToAvatarSection between Hero and Features"
```

---

### Task 5: Visual Tuning & SVG Path Refinement

**Files:**
- Modify: `src/components/DataToAvatarCanvas.tsx`

This task is for visual polish after seeing the first render. The hardcoded SVG path from Task 1 is a rough starting shape — it will likely need refinement for a natural-looking human silhouette. This task also tunes particle count, glow intensity, color balance, and morph timing.

- [ ] **Step 1: Refine the SVG silhouette path**

After seeing the initial render, adjust `SILHOUETTE_PATH` for a more natural contrapposto pose. Key areas to check:
- Head should be proportionally sized (not too large)
- Shoulders should have natural width
- Arms should have slight bend, not stick-straight
- Torso should taper at waist
- Legs should have slight stance variation (one leg slightly forward)
- Feet should be visible at the bottom

Test by refreshing the page and scrolling to full morph. The silhouette should read clearly as a human at arm's length from the screen.

- [ ] **Step 2: Tune visual parameters**

Adjust these values in the render loop based on visual inspection:
- `figureHeight` ratio (currently `h * 0.6`) — may need `0.65` or `0.55`
- `offsetY` multiplier (currently `0.35`) — adjust vertical centering
- Glow `shadowBlur` value (currently `3`) — increase to `4` if too subtle
- Radial gradient stops — adjust the `0.4` midpoint if glow is too harsh or too soft
- Connection line distance threshold (currently `3000`) — adjust for density
- Breathing drift amplitude (currently `1.5` and `1.0`) — adjust if too jittery or too subtle

- [ ] **Step 3: Test on mobile viewport**

In browser DevTools, toggle device toolbar to a mobile viewport (375×812 iPhone). Verify:
- Particle count is reduced (~1,500)
- Figure scales to fit without clipping
- Tagline font size reduces via `clamp()`
- Scroll pinning still works smoothly
- Performance is acceptable (no frame drops)

- [ ] **Step 4: Commit**

```bash
cd /Users/shashank.j/Desktop/CentralProject/atomicsync-web
git add src/components/DataToAvatarCanvas.tsx
git commit -m "polish: refine silhouette path and tune particle visual parameters"
```

---

### Task 6: Tests

**Files:**
- Create: `src/components/__tests__/DataToAvatarSection.test.tsx`

- [ ] **Step 1: Write tests for DataToAvatarSection**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { DataToAvatarSection } from "@/components/DataToAvatarSection";

// Mock IntersectionObserver
beforeEach(() => {
  const mockObserver = vi.fn().mockImplementation((callback: IntersectionObserverCallback) => {
    // Simulate being visible immediately
    callback(
      [{ isIntersecting: true }] as IntersectionObserverEntry[],
      {} as IntersectionObserver
    );
    return {
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    };
  });
  vi.stubGlobal("IntersectionObserver", mockObserver);
});

// Mock canvas getContext since jsdom doesn't support Canvas
HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
  clearRect: vi.fn(),
  beginPath: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
  stroke: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  createRadialGradient: vi.fn().mockReturnValue({
    addColorStop: vi.fn(),
  }),
  setTransform: vi.fn(),
  isPointInPath: vi.fn().mockReturnValue(true),
  scale: vi.fn(),
}) as unknown as typeof HTMLCanvasElement.prototype.getContext;

describe("DataToAvatarSection", () => {
  it("renders the section with presentation role", () => {
    const { container } = render(<DataToAvatarSection />);
    const section = container.querySelector("section[role='presentation']");
    expect(section).not.toBeNull();
  });

  it("renders a sticky container inside the section", () => {
    const { container } = render(<DataToAvatarSection />);
    const sticky = container.querySelector("[style*='sticky']");
    expect(sticky).not.toBeNull();
  });

  it("renders the tagline text", () => {
    render(<DataToAvatarSection />);
    expect(screen.getByText("Your data, alive.")).toBeDefined();
  });

  it("renders an aria-hidden canvas", () => {
    const { container } = render(<DataToAvatarSection />);
    const canvas = container.querySelector("canvas[aria-hidden='true']");
    expect(canvas).not.toBeNull();
  });

  it("section has dark background", () => {
    const { container } = render(<DataToAvatarSection />);
    const section = container.querySelector("section");
    expect(section?.style.background).toBe("#0a0a0a");
  });

  it("section has 300vh height for scroll pinning", () => {
    const { container } = render(<DataToAvatarSection />);
    const section = container.querySelector("section");
    expect(section?.style.height).toBe("300vh");
  });
});
```

- [ ] **Step 2: Run the tests**

Run: `cd /Users/shashank.j/Desktop/CentralProject/atomicsync-web && npx vitest run src/components/__tests__/DataToAvatarSection.test.tsx 2>&1`

Expected: All 6 tests pass.

- [ ] **Step 3: Run the full test suite to ensure nothing is broken**

Run: `cd /Users/shashank.j/Desktop/CentralProject/atomicsync-web && npm run test 2>&1`

Expected: All existing tests still pass.

- [ ] **Step 4: Commit**

```bash
cd /Users/shashank.j/Desktop/CentralProject/atomicsync-web
git add src/components/__tests__/DataToAvatarSection.test.tsx
git commit -m "test: add DataToAvatarSection tests"
```

---

### Task 7: Build Verification & Lint

**Files:** None (verification only)

- [ ] **Step 1: Run linter**

Run: `cd /Users/shashank.j/Desktop/CentralProject/atomicsync-web && npm run lint 2>&1`

Expected: No lint errors. Fix any that appear.

- [ ] **Step 2: Run production build**

Run: `cd /Users/shashank.j/Desktop/CentralProject/atomicsync-web && npm run build 2>&1`

Expected: Build succeeds with no errors or warnings.

- [ ] **Step 3: Run all tests one final time**

Run: `cd /Users/shashank.j/Desktop/CentralProject/atomicsync-web && npm run test 2>&1`

Expected: All tests pass.
