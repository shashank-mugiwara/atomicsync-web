"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { PARTICLES } from "@/data/silhouette-particles";

// ---------------------------------------------------------------------------
// Brand colors (normalized 0-1 for WebGL)
// ---------------------------------------------------------------------------
const INDIGO_R = 99 / 255, INDIGO_G = 102 / 255, INDIGO_B = 241 / 255;
const NEON_R = 0, NEON_G = 1, NEON_B = 136 / 255;

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
    float delay = a_arrivalOrder * 0.5;
    float rawT = clamp((u_morphT - delay) / (1.0 - delay), 0.0, 1.0);
    float easedT = easeOutCubic(rawT);

    vec2 scattered = a_scattered * u_resolution;
    vec2 target = u_figureOffset + a_target * u_figureSize;
    vec2 pos = mix(scattered, target, easedT);

    // Breathing drift when formed
    if (easedT > 0.8) {
      float breathScale = (easedT - 0.8) / 0.2;
      pos.x += sin(u_time * 1.2 + a_breathPhase) * 1.5 * breathScale;
      pos.y += cos(u_time * 1.5 + a_breathPhase * 1.3) * 1.0 * breathScale;
    }

    vec2 clipPos = (pos / u_resolution) * 2.0 - 1.0;
    clipPos.y = -clipPos.y;
    gl_Position = vec4(clipPos, 0.0, 1.0);

    // Crisp dots: moderate size, slightly larger when formed
    gl_PointSize = a_size * (1.0 + easedT * 0.5);

    // Good visibility in both states
    v_opacity = a_opacity * (0.5 + easedT * 0.5);
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
    // Distance from center (0 at center, 1 at edge)
    float dist = length(gl_PointCoord - vec2(0.5)) * 2.0;

    // Crisp circle with sharp edge and thin soft fringe
    // Core: solid up to 0.6 radius, then quick falloff
    float alpha = 1.0 - smoothstep(0.5, 0.9, dist);

    // Discard fully transparent pixels (performance + avoids blending artifacts)
    if (alpha < 0.01) discard;

    vec3 color = mix(u_indigo, u_neon, v_colorT);
    gl_FragColor = vec4(color * alpha * v_opacity, alpha * v_opacity);
  }
`;

// ---------------------------------------------------------------------------
// WebGL helpers
// ---------------------------------------------------------------------------
function compileShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const s = gl.createShader(type);
  if (!s) return null;
  gl.shaderSource(s, source);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    gl.deleteShader(s);
    return null;
  }
  return s;
}

function createProgram(gl: WebGLRenderingContext, vs: string, fs: string): WebGLProgram | null {
  const v = compileShader(gl, gl.VERTEX_SHADER, vs);
  const f = compileShader(gl, gl.FRAGMENT_SHADER, fs);
  if (!v || !f) return null;
  const p = gl.createProgram();
  if (!p) return null;
  gl.attachShader(p, v);
  gl.attachShader(p, f);
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    gl.deleteProgram(p);
    return null;
  }
  return p;
}

// ---------------------------------------------------------------------------
// Build GPU buffers from static particle data
// ---------------------------------------------------------------------------
function buildBuffers(gl: WebGLRenderingContext, dpr: number) {
  const n = PARTICLES.length;
  const scattered = new Float32Array(n * 2);
  const target = new Float32Array(n * 2);
  const size = new Float32Array(n);
  const opacity = new Float32Array(n);
  const colorPhase = new Float32Array(n);
  const arrivalOrder = new Float32Array(n);
  const breathPhase = new Float32Array(n);

  for (let i = 0; i < n; i++) {
    const p = PARTICLES[i];
    scattered[i * 2] = Math.random();
    scattered[i * 2 + 1] = Math.random();
    target[i * 2] = p[0];
    target[i * 2 + 1] = p[1];
    size[i] = p[2] * dpr;
    opacity[i] = p[3];
    colorPhase[i] = p[4];
    arrivalOrder[i] = p[5];
    breathPhase[i] = p[6];
  }

  function upload(data: Float32Array): WebGLBuffer | null {
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    return buf;
  }

  return {
    scattered: upload(scattered),
    target: upload(target),
    size: upload(size),
    opacity: upload(opacity),
    colorPhase: upload(colorPhase),
    arrivalOrder: upload(arrivalOrder),
    breathPhase: upload(breathPhase),
    count: n,
  };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
interface DataToAvatarCanvasProps {
  progress: number;
  isActive: boolean;
  className?: string;
}

export function DataToAvatarCanvas({ progress, isActive, className }: DataToAvatarCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const progressRef = useRef(progress);
  const isActiveRef = useRef(isActive);

  useEffect(() => { progressRef.current = progress; }, [progress]);
  useEffect(() => { isActiveRef.current = isActive; }, [isActive]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;

    const rect = parent.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio, 2);
    const w = rect.width;
    const h = rect.height;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const glCtx = canvas.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      powerPreference: "high-performance",
    });
    if (!glCtx) return;
    const gl = glCtx;

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.enable(gl.BLEND);
    // Premultiplied alpha additive blending — bright, crisp particle overlaps
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    const program = createProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER);
    if (!program) return;

    const bufs = buildBuffers(gl, dpr);
    if (!bufs.scattered || !bufs.target) return;

    // Cache locations
    const aScattered = gl.getAttribLocation(program, "a_scattered");
    const aTarget = gl.getAttribLocation(program, "a_target");
    const aSize = gl.getAttribLocation(program, "a_size");
    const aOpacity = gl.getAttribLocation(program, "a_opacity");
    const aColorPhase = gl.getAttribLocation(program, "a_colorPhase");
    const aArrivalOrder = gl.getAttribLocation(program, "a_arrivalOrder");
    const aBreathPhase = gl.getAttribLocation(program, "a_breathPhase");

    const uMorphT = gl.getUniformLocation(program, "u_morphT");
    const uTime = gl.getUniformLocation(program, "u_time");
    const uResolution = gl.getUniformLocation(program, "u_resolution");
    const uFigureOffset = gl.getUniformLocation(program, "u_figureOffset");
    const uFigureSize = gl.getUniformLocation(program, "u_figureSize");
    const uIndigo = gl.getUniformLocation(program, "u_indigo");
    const uNeon = gl.getUniformLocation(program, "u_neon");

    gl.useProgram(program);

    gl.uniform3f(uIndigo, INDIGO_R, INDIGO_G, INDIGO_B);
    gl.uniform3f(uNeon, NEON_R, NEON_G, NEON_B);

    const bindAttr = (loc: number, buf: WebGLBuffer | null, components: number) => {
      if (loc < 0 || !buf) return;
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, components, gl.FLOAT, false, 0, 0);
    };

    bindAttr(aScattered, bufs.scattered, 2);
    bindAttr(aTarget, bufs.target, 2);
    bindAttr(aSize, bufs.size, 1);
    bindAttr(aOpacity, bufs.opacity, 1);
    bindAttr(aColorPhase, bufs.colorPhase, 1);
    bindAttr(aArrivalOrder, bufs.arrivalOrder, 1);
    bindAttr(aBreathPhase, bufs.breathPhase, 1);

    const aspect = 200 / 500;
    const figH = h * 0.65;
    const figW = figH * aspect;
    const offX = (w - figW) / 2;
    const offY = (h - figH) * 0.35;

    gl.uniform2f(uResolution, w, h);
    gl.uniform2f(uFigureOffset, offX, offY);
    gl.uniform2f(uFigureSize, figW, figH);

    function animate() {
      if (!isActiveRef.current) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const morphT = Math.max(0, Math.min(1, (progressRef.current - 0.1) / 0.6));
      const time = performance.now() / 1000;

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.uniform1f(uMorphT, morphT);
      gl.uniform1f(uTime, time);

      gl.drawArrays(gl.POINTS, 0, bufs.count);

      animationRef.current = requestAnimationFrame(animate);
    }

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={cn("absolute inset-0 pointer-events-none", className)}
      aria-hidden="true"
    />
  );
}
