# Data-to-Avatar Particle Morph Section

> Scroll-driven particle animation where scattered dots morph into a human silhouette, placed between Hero and Features sections.

## Inspiration

The [Atelier "Economic Opportunities for Our Avatars"](https://atelier.net/social-mobility/economic-opportunities-for-our-avatars/) page features a WebGL particle morph where thousands of dots converge into a human figure on scroll. We recreate this concept using Canvas 2D to match our existing codebase patterns.

## Concept

AtomicSync transforms health data points into AI-generated avatars. This section is the visual thesis of that concept: scattered particles (representing health metrics) assemble into a human figure as the user scrolls. It's the "aha moment" between the Hero hook and the Features deep-dive.

## Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Placement | New section between Hero and Features | Dedicated visual moment without disrupting existing sections |
| Target shape | Generic human silhouette (brand colors) | Abstract, no photo dependency, matches clean aesthetic |
| Color scheme | Indigo (#6366f1) → Neon green (#00ff88) gradient | Brand identity; cold data → alive avatar metaphor |
| Scroll behavior | Pin-and-morph (300vh container, ~3 viewport heights of scroll) | Proven pattern (Atelier), gives morph enough scroll distance |
| Tagline | "Your data, alive." fades in at end | Punctuates the visual without competing |
| Background | Dark (#0a0a0a) | Particles pop, creates dramatic section break |
| Implementation | Canvas 2D (no new deps) | Matches existing ParticleField pattern |

## Visual Quality Requirements

### Particle Rendering
- **Variable sizes**: 1px–5px. Smaller at extremities, larger at torso/head core.
- **Soft glow**: Each particle drawn with radial gradient fill (bright center → transparent edge), not flat circles.
- **Color interpolation**: Scattered state = indigo with varying opacity. Morphing = color shifts through gradient to neon green. The `colorPhase` per particle is based on distance from the "heart" center (~40% from top, horizontally centered).
- **Opacity variation**: Random jitter per particle (0.4–1.0) to prevent flat uniform appearance.

### Ambient Motion
- **Breathing drift**: Fully formed particles have subtle sinusoidal offset (±1-2px, per-particle phase), so the figure never looks frozen.
- **Scattered state motion**: Gentle Brownian drift with slight velocity, not static positions.
- **Morph easing**: Cubic ease-out interpolation. Particles accelerate off scattered positions and gently settle into the figure.

### Staggered Morph
- Particles don't arrive simultaneously. Each particle has an `arrivalOrder` based on distance from the silhouette's center.
- Core/torso particles complete morph early (~30% scroll), extremities complete last (~70% scroll, end of morph phase).
- Creates a "materialization from center outward" effect.

### Connection Lines
- During mid-morph (30–70% scroll progress), faint lines connect nearby particles (similar to existing ParticleField).
- Reinforces "data connecting" metaphor.
- Lines fade as the figure solidifies.

### Trailing Glow
- During morph phase, canvas `shadowBlur` (2-4px) on each particle creates subtle motion trail.

## Algorithmic Point Cloud Generation

### Step 1: SVG Silhouette Source
- A single SVG `<path>` string of a human silhouette in contrapposto pose (relaxed, one hip shifted).
- Stored as a constant in the canvas component. This is the only manually authored asset.

### Step 2: Poisson Disk Sampling
- Compute bounding box of the SVG path.
- Generate candidate points using Poisson disk sampling within the bounding box.
- Guarantees even spacing with no gaps and no clumps — every point is at least `minDistance` apart, but placement is organic.
- Test each candidate with `Path2D` + `ctx.isPointInPath()` to keep only interior points.
- **Density weighting**: `minDistance` varies vertically — smaller (denser) in head/torso (top 40%), larger (sparser) at legs/feet (bottom 30%).

### Step 3: Adaptive Gap Filling
- After initial sampling, divide the silhouette bounding box into small grid cells.
- Any cell inside the silhouette with zero points gets additional points injected.
- Guarantees no visible holes regardless of randomization.

### Step 4: Point Attributes
Each sampled point stores:
- `targetX, targetY` — normalized (0–1) position within the silhouette
- `size` — derived from local density (denser = smaller dots, sparser = larger, so visual weight stays even)
- `colorPhase` — 0.0 (indigo) to 1.0 (neon), mapped by distance from "heart" center
- `arrivalOrder` — distance from center, used for staggered morph timing

### Step 5: Caching
- Sampling runs once on component mount. Stored in a `useRef` typed array.
- On resize, normalized coordinates remap to new canvas dimensions. No re-sampling.

### Target Counts
- Desktop: ~2,500 particles
- Mobile (<768px): ~1,500 particles, figure scales to ~70%

## Scroll Mechanics

### Container Structure
- Outer container: `height: 300vh` (3x viewport height of scroll distance).
- Inner element: `position: sticky; top: 0; height: 100vh` — the canvas and tagline live here.
- Pure CSS sticky, no scroll-jacking.

### Progress Calculation
- Scroll progress `t` (0.0–1.0) = how far the sticky container has been scrolled through.
- Computed via scroll event listener (`passive: true`) + `getBoundingClientRect()` on the outer container.
- `IntersectionObserver` gates animation: rendering pauses when section is off-screen.

### Scroll-to-Animation Mapping

| Progress | State |
|---|---|
| 0.0 – 0.1 | Particles scattered, gentle Brownian drift. Section enters viewport. |
| 0.1 – 0.7 | **Morph phase.** Particles lerp scattered → target. Core first, extremities last. Connection lines appear/fade. Color shifts indigo → neon. |
| 0.7 – 0.85 | Figure fully formed. Breathing drift. Tagline fades in. |
| 0.85 – 1.0 | Section scrolls out. Figure holds. |

## Tagline

- **Text**: "Your data, alive."
- **Font**: Space Grotesk (site heading font), uppercase, wide tracking.
- **Size**: ~2rem desktop, ~1.25rem mobile.
- **Color**: White (#fafafa) with subtle neon green text-shadow glow (`0 0 20px rgba(0, 255, 136, 0.3)`).
- **Position**: Centered horizontally, ~65% from top of viewport, below the figure.
- **Animation**: Hidden (opacity 0, translateY +10px) until progress 0.7. Fades in over progress 0.7–0.8 via class toggle. No exit animation.
- **Implementation**: Absolutely positioned `<p>` element in the sticky container (not on canvas). Keeps text crisp, accessible, selectable.

## Component Architecture

### New Files
1. **`src/components/DataToAvatarSection.tsx`** — Section component. Owns:
   - Outer `300vh` container + inner sticky viewport
   - Scroll progress tracking (scroll listener + IntersectionObserver)
   - Tagline element with progress-driven visibility
   - Mounts DataToAvatarCanvas

2. **`src/components/DataToAvatarCanvas.tsx`** — Canvas 2D particle engine. Owns:
   - Poisson disk sampling on mount
   - All rendering: particle positions, colors, glow, connection lines
   - Receives `progress` (0–1) as sole prop

### Integration

In `src/app/page.tsx`:
```tsx
<HeroSection />
<div className="section-divider" />
<DataToAvatarSection />
<FeaturesSection />
```

### Props
- `DataToAvatarSection` — no props. Self-contained.
- `DataToAvatarCanvas` — `progress: number`, `className?: string`

## Performance

- Scroll listener: `passive: true`.
- Rendering pauses when off-screen (IntersectionObserver).
- Particle count adapts: ~2,500 desktop, ~1,500 mobile (checked on mount via `window.innerWidth`).
- Canvas `devicePixelRatio` capped at 2 (matching existing ParticleField).
- Point sampling runs once, cached in `useRef`.
- No re-sampling on resize — just coordinate remapping.

## Accessibility

- Canvas: `aria-hidden="true"` (decorative).
- Tagline: visible, accessible `<p>` element (not rendered on canvas).
- Outer section: `role="presentation"` — visual interlude, not content.

## Background & Styling

- Section background: `#0a0a0a` (dark).
- Creates strong visual break between light Hero (above) and light Features (below).
- No additional decorative elements — the particles are the entire visual.
