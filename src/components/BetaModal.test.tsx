import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BetaModal } from "@/components/BetaModal";
import { BETA_SIGNUP_STORAGE_KEY } from "@/lib/beta-signup";

describe("BetaModal", () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.style.overflow = "";
  });

  afterEach(() => {
    document.body.style.overflow = "";
  });

  it("locks body scroll while open and restores it on close", () => {
    const { rerender } = render(<BetaModal isOpen onClose={() => {}} />);

    expect(document.body.style.overflow).toBe("hidden");

    rerender(<BetaModal isOpen={false} onClose={() => {}} />);

    expect(document.body.style.overflow).toBe("");
  });

  it("closes when the overlay is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const { container } = render(<BetaModal isOpen onClose={onClose} />);

    const overlay = container.querySelector(".absolute.inset-0.bg-black\\/60");
    expect(overlay).not.toBeNull();

    await user.click(overlay!);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("closes on Escape", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(<BetaModal isOpen onClose={onClose} />);
    await user.keyboard("{Escape}");

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("renders the success state when signup already exists", () => {
    localStorage.setItem(BETA_SIGNUP_STORAGE_KEY, "saved@example.com");

    render(<BetaModal isOpen onClose={() => {}} />);

    expect(screen.getByText("You're in!")).toBeInTheDocument();
  });
});
