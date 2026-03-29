import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Home from "@/app/page";

vi.mock("@/components/Navbar", () => ({
  Navbar: () => <div>Navbar</div>,
}));

vi.mock("@/components/HeroSection", () => ({
  HeroSection: () => <section>Hero</section>,
}));

vi.mock("@/components/FeaturesSection", () => ({
  FeaturesSection: () => <section>Features</section>,
}));

vi.mock("@/components/StatsSection", () => ({
  StatsSection: () => <section>Stats</section>,
}));

vi.mock("@/components/EvolutionSection", () => ({
  EvolutionSection: () => <section>Evolution</section>,
}));

vi.mock("@/components/HowItWorksSection", () => ({
  HowItWorksSection: () => <section>How It Works</section>,
}));

vi.mock("@/components/PricingSection", () => ({
  PricingSection: () => <section>Pricing</section>,
}));

vi.mock("@/components/DataToAvatarSection", () => ({
  DataToAvatarSection: () => <section>DataToAvatar</section>,
}));

vi.mock("@/components/Footer", () => ({
  Footer: () => <footer>Footer</footer>,
}));

describe("Home page", () => {
  it("renders the landing page sections in order", () => {
    render(<Home />);

    expect(screen.getByText("Navbar")).toBeInTheDocument();
    expect(screen.getByText("Hero")).toBeInTheDocument();
    expect(screen.getByText("Features")).toBeInTheDocument();
    expect(screen.getByText("Stats")).toBeInTheDocument();
    expect(screen.getByText("Evolution")).toBeInTheDocument();
    expect(screen.getByText("How It Works")).toBeInTheDocument();
    expect(screen.getByText("Pricing")).toBeInTheDocument();
    expect(screen.getByText("Footer")).toBeInTheDocument();
  });
});
