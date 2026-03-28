import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/font/google", () => ({
  Space_Grotesk: () => ({ variable: "font-sans-var" }),
  JetBrains_Mono: () => ({ variable: "font-mono-var" }),
  Bitter: () => ({ variable: "font-serif-var" }),
}));

import RootLayout, { metadata } from "@/app/layout";

describe("RootLayout", () => {
  it("renders children inside the document body", () => {
    render(
      <RootLayout>
        <div>Child content</div>
      </RootLayout>,
    );

    expect(screen.getByText("Child content")).toBeInTheDocument();
    expect(document.body.className).toContain("bg-background");
  });

  it("exposes the expected metadata", () => {
    expect(metadata.title).toBe("AtomicSync — Your Health, Evolved");
    expect(metadata.description).toContain("gamified health-tracking app");
  });
});
