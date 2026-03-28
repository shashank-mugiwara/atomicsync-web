import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { BetaSignup } from "@/components/BetaSignup";
import { BETA_SIGNUP_STORAGE_KEY } from "@/lib/beta-signup";

describe("BetaSignup", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("submits a valid email and persists signup state", async () => {
    const user = userEvent.setup();

    render(<BetaSignup />);

    await user.type(screen.getByPlaceholderText("Enter your email"), "hi@example.com");
    await user.click(screen.getByRole("button", { name: "JOIN BETA" }));

    expect(localStorage.getItem(BETA_SIGNUP_STORAGE_KEY)).toBe("hi@example.com");
    expect(
      screen.getByText("You're in! We'll notify you when AtomicSync launches."),
    ).toBeInTheDocument();
  });

  it("restores the submitted state from local storage", () => {
    localStorage.setItem(BETA_SIGNUP_STORAGE_KEY, "restored@example.com");

    render(<BetaSignup />);

    expect(
      screen.getByText("You're in! We'll notify you when AtomicSync launches."),
    ).toBeInTheDocument();
    expect(screen.queryByPlaceholderText("Enter your email")).not.toBeInTheDocument();
  });

  it("does not persist an invalid email", async () => {
    const user = userEvent.setup();

    render(<BetaSignup />);

    await user.type(screen.getByPlaceholderText("Enter your email"), "invalid-email");
    await user.click(screen.getByRole("button", { name: "JOIN BETA" }));

    expect(localStorage.getItem(BETA_SIGNUP_STORAGE_KEY)).toBeNull();
    expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
  });

  it("keeps the form visible when storage is unavailable", async () => {
    const user = userEvent.setup();
    const setItem = vi.spyOn(localStorage, "setItem").mockImplementation(() => {
      throw new Error("storage unavailable");
    });

    render(<BetaSignup />);

    await user.type(screen.getByPlaceholderText("Enter your email"), "hi@example.com");
    await user.click(screen.getByRole("button", { name: "JOIN BETA" }));

    expect(setItem).toHaveBeenCalled();
    expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
    expect(
      screen.queryByText("You're in! We'll notify you when AtomicSync launches."),
    ).not.toBeInTheDocument();
  });
});
