import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import TermsPage from "@/app/terms/page";

describe("TermsPage", () => {
  it("renders the terms heading and health disclaimer section", () => {
    render(<TermsPage />);

    expect(
      screen.getByRole("heading", { name: "Terms of Service", level: 1 }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Health Disclaimer", level: 2 }),
    ).toBeInTheDocument();
  });
});
