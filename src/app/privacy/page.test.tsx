import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PrivacyPage from "@/app/privacy/page";

describe("PrivacyPage", () => {
  it("renders the privacy policy heading and legal navigation", () => {
    render(<PrivacyPage />);

    expect(
      screen.getByRole("heading", { name: "Privacy Policy", level: 1 }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "ATOMICSYNC" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: /Back to Home/ })).toHaveAttribute("href", "/");
  });
});
