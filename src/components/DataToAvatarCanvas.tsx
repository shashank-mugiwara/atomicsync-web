"use client";

import { useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Brand colors (normalized 0-1 for WebGL)
// ---------------------------------------------------------------------------
const INDIGO = { r: 99 / 255, g: 102 / 255, b: 241 / 255 };
const NEON = { r: 0 / 255, g: 255 / 255, b: 136 / 255 };

// ---------------------------------------------------------------------------
// WebGL Shaders
// ---------------------------------------------------------------------------
const VERTEX_SHADER = `
  attribute vec2 a_scattered;
  attribute vec2 a_target;
  attribute float a_size;
  attribute float a_opacity;
  attribute float a_colorPhase;
  attribute float a_arrivalOrder;
  attribute float a_breathPhase;

  uniform float u_morphT;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec2 u_figureOffset;
  uniform vec2 u_figureSize;

  varying float v_opacity;
  varying float v_colorT;

  float easeOutCubic(float t) {
    return 1.0 - pow(1.0 - t, 3.0);
  }

  void main() {
    // Per-particle staggered morph
    float delay = a_arrivalOrder * 0.5;
    float rawT = clamp((u_morphT - delay) / (1.0 - delay), 0.0, 1.0);
    float easedT = easeOutCubic(rawT);

    // Scattered position in pixel space
    vec2 scattered = a_scattered * u_resolution;
    // Target position in pixel space
    vec2 target = u_figureOffset + a_target * u_figureSize;

    // Interpolate
    vec2 pos = mix(scattered, target, easedT);

    // Breathing drift when formed
    if (easedT > 0.8) {
      float breathScale = (easedT - 0.8) / 0.2;
      pos.x += sin(u_time * 1.2 + a_breathPhase) * 1.5 * breathScale;
      pos.y += cos(u_time * 1.5 + a_breathPhase * 1.3) * 1.0 * breathScale;
    }

    // Convert to clip space (-1 to 1)
    vec2 clipPos = (pos / u_resolution) * 2.0 - 1.0;
    clipPos.y = -clipPos.y; // flip Y for WebGL

    gl_Position = vec4(clipPos, 0.0, 1.0);

    // Size: larger when more formed, scaled by DPR
    gl_PointSize = a_size * (1.0 + easedT * 1.5);

    // Pass to fragment shader
    v_opacity = a_opacity * (0.3 + easedT * 0.7);
    v_colorT = clamp(easedT * a_colorPhase, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision mediump float;

  uniform vec3 u_indigo;
  uniform vec3 u_neon;

  varying float v_opacity;
  varying float v_colorT;

  void main() {
    // Distance from center of point (0 at center, 1 at edge)
    float dist = length(gl_PointCoord - vec2(0.5)) * 2.0;

    // Soft circle with glow falloff
    float alpha = 1.0 - smoothstep(0.0, 1.0, dist);
    // Add extra glow halo
    alpha += 0.3 * (1.0 - smoothstep(0.3, 1.0, dist));
    alpha = clamp(alpha, 0.0, 1.0);

    // Color interpolation
    vec3 color = mix(u_indigo, u_neon, v_colorT);

    gl_FragColor = vec4(color, alpha * v_opacity);
  }
`;

// ---------------------------------------------------------------------------
// Connection lines shaders (separate program)
// ---------------------------------------------------------------------------
const LINE_VERTEX_SHADER = `
  attribute vec2 a_position;
  uniform vec2 u_resolution;

  void main() {
    vec2 clipPos = (a_position / u_resolution) * 2.0 - 1.0;
    clipPos.y = -clipPos.y;
    gl_Position = vec4(clipPos, 0.0, 1.0);
  }
`;

const LINE_FRAGMENT_SHADER = `
  precision mediump float;
  uniform float u_alpha;

  void main() {
    gl_FragColor = vec4(${INDIGO.r.toFixed(4)}, ${INDIGO.g.toFixed(4)}, ${INDIGO.b.toFixed(4)}, 0.08 * u_alpha);
  }
`;

// ---------------------------------------------------------------------------
// SVG silhouette path — contrapposto human, 200x500 viewBox
// ---------------------------------------------------------------------------
const SILHOUETTE_PATH = [
  "M 100,28",
  "C 84,28 74,40 74,56",
  "C 74,72 84,84 100,84",
  "C 116,84 126,72 126,56",
  "C 126,40 116,28 100,28",
  "Z",
  "M 92,84",
  "L 92,98",
  "C 72,100 52,108 48,118",
  "L 44,120",
  "C 38,140 36,164 40,188",
  "C 42,200 38,216 34,232",
  "C 30,246 28,254 30,260",
  "C 34,266 40,264 42,258",
  "C 46,244 48,228 50,212",
  "C 52,196 54,180 56,164",
  "C 58,148 60,136 62,128",
  "L 64,148",
  "C 66,172 68,196 70,220",
  "C 70,236 68,254 66,272",
  "C 64,296 62,320 60,350",
  "C 58,380 56,410 56,430",
  "C 56,444 54,454 50,460",
  "C 46,468 42,470 40,470",
  "C 36,470 34,466 38,462",
  "C 42,458 48,454 52,448",
  "C 54,442 56,436 56,430",
  "C 58,408 62,380 66,350",
  "C 70,320 76,296 82,280",
  "Q 92,264 100,264",
  "Q 108,264 118,280",
  "C 124,296 130,320 134,350",
  "C 138,380 142,408 144,430",
  "C 144,436 146,442 150,448",
  "C 154,454 160,458 164,462",
  "C 168,466 166,470 162,470",
  "C 160,470 156,468 152,460",
  "C 148,454 146,444 146,430",
  "C 146,410 144,380 140,350",
  "C 136,320 134,296 132,272",
  "C 132,254 130,236 130,220",
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
  "L 108,84",
  "Z",
].join(" ");

const SILHOUETTE_VIEWBOX_W = 200;
const SILHOUETTE_VIEWBOX_H = 500;

// ---------------------------------------------------------------------------
// Poisson disk sampling (Bridson's algorithm) — uses offscreen Canvas 2D
// ---------------------------------------------------------------------------
function poissonDiskSample(
  pathStr: string,
  viewW: number,
  viewH: number,
  targetCount: number,
): { x: number; y: number }[] {
  // Use an offscreen 2D canvas just for isPointInPath checks
  const offscreen = document.createElement("canvas");
  offscreen.width = viewW;
  offscreen.height = viewH;
  const ctx = offscreen.getContext("2d");
  if (!ctx) return [];

  const path2D = new Path2D(pathStr);

  const area = viewW * viewH;
  const baseMinDist = Math.sqrt(area / (targetCount * Math.PI)) * 1.2;
  const k = 30;

  function densityMultiplier(y: number): number {
    const t = y / viewH;
    if (t < 0.4) return 0.75;
    if (t < 0.7) return 1.0;
    return 1.25;
  }

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

  const seedX = viewW / 2;
  const seedY = viewH * 0.4;
  if (ctx.isPointInPath(path2D, seedX, seedY)) {
    addPoint(seedX, seedY);
  } else {
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

    if (!found) active.splice(randIdx, 1);
  }

  return points;
}

// ---------------------------------------------------------------------------
// Gap filling
// ---------------------------------------------------------------------------
function fillGaps(
  points: { x: number; y: number }[],
  pathStr: string,
  viewW: number,
  viewH: number,
): { x: number; y: number }[] {
  const offscreen = document.createElement("canvas");
  offscreen.width = viewW;
  offscreen.height = viewH;
  const ctx = offscreen.getContext("2d");
  if (!ctx) return points;

  const path2D = new Path2D(pathStr);
  const cellSize = 12;
  const cols = Math.ceil(viewW / cellSize);
  const rows = Math.ceil(viewH / cellSize);

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
// Particle data builder — returns typed arrays for WebGL buffers
// ---------------------------------------------------------------------------
interface ParticleBuffers {
  scattered: Float32Array;  // vec2 per particle
  target: Float32Array;     // vec2 per particle
  size: Float32Array;
  opacity: Float32Array;
  colorPhase: Float32Array;
  arrivalOrder: Float32Array;
  breathPhase: Float32Array;
  count: number;
}

function buildParticleBuffers(
  rawPoints: { x: number; y: number }[],
  viewW: number,
  viewH: number,
): ParticleBuffers {
  const n = rawPoints.length;
  const heartX = viewW / 2;
  const heartY = viewH * 0.4;
  const maxDist = Math.sqrt(viewW * viewW + viewH * viewH) / 2;

  const scattered = new Float32Array(n * 2);
  const target = new Float32Array(n * 2);
  const size = new Float32Array(n);
  const opacity = new Float32Array(n);
  const colorPhase = new Float32Array(n);
  const arrivalOrder = new Float32Array(n);
  const breathPhase = new Float32Array(n);

  for (let i = 0; i < n; i++) {
    const p = rawPoints[i];
    const dx = p.x - heartX;
    const dy = p.y - heartY;
    const distFromHeart = Math.sqrt(dx * dx + dy * dy);
    const normalizedDist = Math.min(distFromHeart / maxDist, 1);

    const yRatio = p.y / viewH;
    const densityFactor = yRatio < 0.4 ? 0.3 : yRatio < 0.7 ? 0.6 : 1.0;

    scattered[i * 2] = Math.random();
    scattered[i * 2 + 1] = Math.random();
    target[i * 2] = p.x / viewW;
    target[i * 2 + 1] = p.y / viewH;
    size[i] = (1 + densityFactor * 4) * Math.min(window.devicePixelRatio, 2);
    opacity[i] = 0.4 + Math.random() * 0.6;
    colorPhase[i] = 1 - normalizedDist;
    arrivalOrder[i] = normalizedDist;
    breathPhase[i] = Math.random() * Math.PI * 2;
  }

  return { scattered, target, size, opacity, colorPhase, arrivalOrder, breathPhase, count: n };
}

// ---------------------------------------------------------------------------
// WebGL helpers
// ---------------------------------------------------------------------------
function compileShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Shader compile error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl: WebGLRenderingContext, vsSource: string, fsSource: string): WebGLProgram | null {
  const vs = compileShader(gl, gl.VERTEX_SHADER, vsSource);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, fsSource);
  if (!vs || !fs) return null;

  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Program link error:", gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

function createBuffer(gl: WebGLRenderingContext, data: Float32Array): WebGLBuffer | null {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  return buffer;
}

function bindAttribute(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  name: string,
  buffer: WebGLBuffer,
  componentsPerVertex: number,
): void {
  const loc = gl.getAttribLocation(program, name);
  if (loc < 0) return;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, componentsPerVertex, gl.FLOAT, false, 0, 0);
}

// ---------------------------------------------------------------------------
// DataToAvatarCanvas component (WebGL)
// ---------------------------------------------------------------------------
interface DataToAvatarCanvasProps {
  progress: number;
  className?: string;
}

export function DataToAvatarCanvas({ progress, className }: DataToAvatarCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const progressRef = useRef<number>(progress);
  const glRef = useRef<{
    gl: WebGLRenderingContext;
    particleProgram: WebGLProgram;
    lineProgram: WebGLProgram;
    buffers: { scattered: WebGLBuffer; target: WebGLBuffer; size: WebGLBuffer; opacity: WebGLBuffer; colorPhase: WebGLBuffer; arrivalOrder: WebGLBuffer; breathPhase: WebGLBuffer };
    particleCount: number;
    // Line buffer — dynamic, updated each frame
    lineBuffer: WebGLBuffer;
    // Cached particle data for connection lines (CPU side)
    particleData: ParticleBuffers;
  } | null>(null);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  const init = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const rect = parent.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio, 2);
    const w = rect.width;
    const h = rect.height;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: false });
    if (!gl) return;

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // Compile programs
    const particleProgram = createProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER);
    const lineProgram = createProgram(gl, LINE_VERTEX_SHADER, LINE_FRAGMENT_SHADER);
    if (!particleProgram || !lineProgram) return;

    // Generate particles
    const isMobile = window.innerWidth < 768;
    const targetCount = isMobile ? 1500 : 2500;

    const rawPoints = poissonDiskSample(SILHOUETTE_PATH, SILHOUETTE_VIEWBOX_W, SILHOUETTE_VIEWBOX_H, targetCount);
    const filledPoints = fillGaps(rawPoints, SILHOUETTE_PATH, SILHOUETTE_VIEWBOX_W, SILHOUETTE_VIEWBOX_H);
    const particleData = buildParticleBuffers(filledPoints, SILHOUETTE_VIEWBOX_W, SILHOUETTE_VIEWBOX_H);

    // Upload buffers
    const scatteredBuf = createBuffer(gl, particleData.scattered);
    const targetBuf = createBuffer(gl, particleData.target);
    const sizeBuf = createBuffer(gl, particleData.size);
    const opacityBuf = createBuffer(gl, particleData.opacity);
    const colorPhaseBuf = createBuffer(gl, particleData.colorPhase);
    const arrivalOrderBuf = createBuffer(gl, particleData.arrivalOrder);
    const breathPhaseBuf = createBuffer(gl, particleData.breathPhase);
    const lineBuffer = gl.createBuffer();

    if (!scatteredBuf || !targetBuf || !sizeBuf || !opacityBuf || !colorPhaseBuf || !arrivalOrderBuf || !breathPhaseBuf || !lineBuffer) return;

    glRef.current = {
      gl,
      particleProgram,
      lineProgram,
      buffers: {
        scattered: scatteredBuf,
        target: targetBuf,
        size: sizeBuf,
        opacity: opacityBuf,
        colorPhase: colorPhaseBuf,
        arrivalOrder: arrivalOrderBuf,
        breathPhase: breathPhaseBuf,
      },
      particleCount: particleData.count,
      lineBuffer,
      particleData,
    };
  }, []);

  useEffect(() => {
    init();

    const canvas = canvasRef.current;
    if (!canvas) return;

    function handleResize() {
      // Re-initialize everything on resize
      if (glRef.current) {
        const { gl } = glRef.current;
        gl.getExtension("WEBGL_lose_context")?.loseContext();
      }
      glRef.current = null;
      init();
    }

    window.addEventListener("resize", handleResize);

    function animate() {
      const state = glRef.current;
      if (!state) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const { gl, particleProgram, lineProgram, buffers, particleCount, lineBuffer, particleData } = state;
      const time = performance.now() / 1000;
      const currentProgress = progressRef.current;

      const parent = canvas?.parentElement;
      if (!canvas || !parent) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      const w = parent.getBoundingClientRect().width;
      const h = parent.getBoundingClientRect().height;

      // Clear
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      // Figure dimensions
      const aspect = SILHOUETTE_VIEWBOX_W / SILHOUETTE_VIEWBOX_H;
      const figureHeight = h * 0.65;
      const figureW = figureHeight * aspect;
      const offsetX = (w - figureW) / 2;
      const offsetY = (h - figureHeight) * 0.35;

      // Morph progress
      const morphT = Math.max(0, Math.min(1, (currentProgress - 0.1) / 0.6));

      // --- Draw particles ---
      gl.useProgram(particleProgram);

      // Bind attributes
      bindAttribute(gl, particleProgram, "a_scattered", buffers.scattered, 2);
      bindAttribute(gl, particleProgram, "a_target", buffers.target, 2);
      bindAttribute(gl, particleProgram, "a_size", buffers.size, 1);
      bindAttribute(gl, particleProgram, "a_opacity", buffers.opacity, 1);
      bindAttribute(gl, particleProgram, "a_colorPhase", buffers.colorPhase, 1);
      bindAttribute(gl, particleProgram, "a_arrivalOrder", buffers.arrivalOrder, 1);
      bindAttribute(gl, particleProgram, "a_breathPhase", buffers.breathPhase, 1);

      // Set uniforms
      const uMorphT = gl.getUniformLocation(particleProgram, "u_morphT");
      const uTime = gl.getUniformLocation(particleProgram, "u_time");
      const uResolution = gl.getUniformLocation(particleProgram, "u_resolution");
      const uFigureOffset = gl.getUniformLocation(particleProgram, "u_figureOffset");
      const uFigureSize = gl.getUniformLocation(particleProgram, "u_figureSize");
      const uIndigo = gl.getUniformLocation(particleProgram, "u_indigo");
      const uNeon = gl.getUniformLocation(particleProgram, "u_neon");

      gl.uniform1f(uMorphT, morphT);
      gl.uniform1f(uTime, time);
      gl.uniform2f(uResolution, w, h);
      gl.uniform2f(uFigureOffset, offsetX, offsetY);
      gl.uniform2f(uFigureSize, figureW, figureHeight);
      gl.uniform3f(uIndigo, INDIGO.r, INDIGO.g, INDIGO.b);
      gl.uniform3f(uNeon, NEON.r, NEON.g, NEON.b);

      gl.drawArrays(gl.POINTS, 0, particleCount);

      // --- Draw connection lines ---
      const showLines = currentProgress > 0.1 && currentProgress < 0.7;
      if (showLines) {
        let lineAlpha = 0;
        if (currentProgress < 0.3) lineAlpha = (currentProgress - 0.1) / 0.2;
        else if (currentProgress < 0.6) lineAlpha = 1;
        else lineAlpha = (0.7 - currentProgress) / 0.1;

        if (lineAlpha > 0) {
          // Compute positions on CPU for a subset of particles
          const step = Math.max(1, Math.floor(particleCount / 300));
          const lineVerts: number[] = [];

          function easeOut(t: number): number {
            return 1 - Math.pow(1 - t, 3);
          }

          // Pre-compute subset positions
          const subsetCount = Math.ceil(particleCount / step);
          const positions = new Float32Array(subsetCount * 2);

          for (let si = 0; si < subsetCount; si++) {
            const i = si * step;
            if (i >= particleCount) break;
            const sx = particleData.scattered[i * 2];
            const sy = particleData.scattered[i * 2 + 1];
            const tx = particleData.target[i * 2];
            const ty = particleData.target[i * 2 + 1];
            const ao = particleData.arrivalOrder[i];

            const delay = ao * 0.5;
            const rawT = Math.max(0, Math.min(1, (morphT - delay) / (1 - delay)));
            const et = easeOut(rawT);

            positions[si * 2] = sx * w + (offsetX + tx * figureW - sx * w) * et;
            positions[si * 2 + 1] = sy * h + (offsetY + ty * figureHeight - sy * h) * et;
          }

          // Find nearby pairs
          for (let si = 0; si < subsetCount; si++) {
            const ax = positions[si * 2];
            const ay = positions[si * 2 + 1];

            for (let sj = si + 1; sj < Math.min(si + 15, subsetCount); sj++) {
              const bx = positions[sj * 2];
              const by = positions[sj * 2 + 1];
              const dx = ax - bx;
              const dy = ay - by;
              if (dx * dx + dy * dy < 4000) {
                lineVerts.push(ax, ay, bx, by);
              }
            }
          }

          if (lineVerts.length > 0) {
            gl.useProgram(lineProgram);
            const uLineRes = gl.getUniformLocation(lineProgram, "u_resolution");
            const uLineAlpha = gl.getUniformLocation(lineProgram, "u_alpha");
            gl.uniform2f(uLineRes, w, h);
            gl.uniform1f(uLineAlpha, lineAlpha);

            const lineData = new Float32Array(lineVerts);
            gl.bindBuffer(gl.ARRAY_BUFFER, lineBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, lineData, gl.DYNAMIC_DRAW);

            const aPos = gl.getAttribLocation(lineProgram, "a_position");
            gl.enableVertexAttribArray(aPos);
            gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

            gl.drawArrays(gl.LINES, 0, lineVerts.length / 2);
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    }

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [init]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("absolute inset-0 pointer-events-none", className)}
      aria-hidden="true"
    />
  );
}
