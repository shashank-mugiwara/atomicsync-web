import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DataToAvatarSection } from "@/components/DataToAvatarSection";

// Mock Path2D
vi.stubGlobal("Path2D", class Path2D {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(path?: string) {}
});

// Mock requestAnimationFrame
vi.stubGlobal("requestAnimationFrame", vi.fn().mockReturnValue(1));
vi.stubGlobal("cancelAnimationFrame", vi.fn());

// WebGL mock — all methods return valid stubs
const mockWebGLContext = {
  viewport: vi.fn(),
  enable: vi.fn(),
  blendFunc: vi.fn(),
  clearColor: vi.fn(),
  clear: vi.fn(),
  createShader: vi.fn().mockReturnValue({}),
  shaderSource: vi.fn(),
  compileShader: vi.fn(),
  getShaderParameter: vi.fn().mockReturnValue(true),
  getShaderInfoLog: vi.fn().mockReturnValue(""),
  createProgram: vi.fn().mockReturnValue({}),
  attachShader: vi.fn(),
  linkProgram: vi.fn(),
  getProgramParameter: vi.fn().mockReturnValue(true),
  getProgramInfoLog: vi.fn().mockReturnValue(""),
  useProgram: vi.fn(),
  createBuffer: vi.fn().mockReturnValue({}),
  bindBuffer: vi.fn(),
  bufferData: vi.fn(),
  getAttribLocation: vi.fn().mockReturnValue(0),
  enableVertexAttribArray: vi.fn(),
  vertexAttribPointer: vi.fn(),
  getUniformLocation: vi.fn().mockReturnValue({}),
  uniform1f: vi.fn(),
  uniform2f: vi.fn(),
  uniform3f: vi.fn(),
  drawArrays: vi.fn(),
  getExtension: vi.fn().mockReturnValue(null),
  deleteShader: vi.fn(),
  deleteProgram: vi.fn(),
  VERTEX_SHADER: 0x8B31,
  FRAGMENT_SHADER: 0x8B30,
  COMPILE_STATUS: 0x8B81,
  LINK_STATUS: 0x8B82,
  ARRAY_BUFFER: 0x8892,
  STATIC_DRAW: 0x88E4,
  DYNAMIC_DRAW: 0x88E8,
  FLOAT: 0x1406,
  POINTS: 0x0000,
  LINES: 0x0001,
  BLEND: 0x0BE2,
  SRC_ALPHA: 0x0302,
  ONE_MINUS_SRC_ALPHA: 0x0303,
  COLOR_BUFFER_BIT: 0x4000,
};

// Canvas 2D mock for Poisson disk sampling offscreen canvas
const mock2DContext = {
  isPointInPath: vi.fn().mockReturnValue(true),
  clearRect: vi.fn(),
  beginPath: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
  stroke: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  setTransform: vi.fn(),
  scale: vi.fn(),
  createRadialGradient: vi.fn().mockReturnValue({ addColorStop: vi.fn() }),
  set fillStyle(_v: string) {},
  fillRect: vi.fn(),
};

// Return appropriate context based on contextId
HTMLCanvasElement.prototype.getContext = vi.fn().mockImplementation(
  function (this: HTMLCanvasElement, contextId: string) {
    if (contextId === "webgl") return mockWebGLContext;
    if (contextId === "2d") return mock2DContext;
    return null;
  }
) as unknown as typeof HTMLCanvasElement.prototype.getContext;

describe("DataToAvatarSection", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(callback: IntersectionObserverCallback) {
          callback(
            [{ isIntersecting: true }] as unknown as IntersectionObserverEntry[],
            {} as IntersectionObserver
          );
        }
        observe = vi.fn();
        unobserve = vi.fn();
        disconnect = vi.fn();
      }
    );
  });

  it("renders section with presentation role", () => {
    render(<DataToAvatarSection />);
    expect(screen.getByRole("presentation")).toBeInTheDocument();
  });

  it("renders a sticky container", () => {
    const { container } = render(<DataToAvatarSection />);
    const sticky = container.querySelector(".sticky");
    expect(sticky).not.toBeNull();
  });

  it("renders the tagline text", () => {
    render(<DataToAvatarSection />);
    expect(screen.getByText("Your data, alive.")).toBeInTheDocument();
  });

  it("renders an aria-hidden canvas", () => {
    const { container } = render(<DataToAvatarSection />);
    const canvas = container.querySelector('canvas[aria-hidden="true"]');
    expect(canvas).not.toBeNull();
  });

  it("section has dark background", () => {
    const { container } = render(<DataToAvatarSection />);
    const section = container.querySelector("section");
    expect(section?.className).toContain("bg-[#0a0a0a]");
  });

  it("section has 300vh height", () => {
    const { container } = render(<DataToAvatarSection />);
    const section = container.querySelector("section");
    expect(section?.style.height).toBe("300vh");
  });
});
