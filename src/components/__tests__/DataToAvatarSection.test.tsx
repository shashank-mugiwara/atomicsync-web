import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DataToAvatarSection } from "@/components/DataToAvatarSection";

// Mock Path2D
vi.stubGlobal("Path2D", class Path2D {
  constructor(_path?: string) {}
});

// Mock requestAnimationFrame
vi.stubGlobal("requestAnimationFrame", vi.fn().mockReturnValue(1));
vi.stubGlobal("cancelAnimationFrame", vi.fn());

// Mock canvas getContext
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
  set fillStyle(_v: string) {},
  set strokeStyle(_v: string) {},
  set lineWidth(_v: number) {},
  set shadowBlur(_v: number) {},
  set shadowColor(_v: string) {},
}) as unknown as typeof HTMLCanvasElement.prototype.getContext;

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
