"use client";

import { useState } from "react";
import {
  BETA_SIGNUP_STORAGE_KEY,
  submitBetaSignup,
  type BetaSignupResult,
} from "@/lib/beta-signup";

interface UseBetaSignupResult {
  email: string;
  submitted: boolean;
  setEmail: (value: string) => void;
  submitSignup: () => BetaSignupResult;
}

export function useBetaSignup(): UseBetaSignupResult {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    try {
      return Boolean(localStorage.getItem(BETA_SIGNUP_STORAGE_KEY));
    } catch {
      return false;
    }
  });

  function submitSignup() {
    const result = submitBetaSignup(email);

    if (result.ok) {
      setSubmitted(true);
    }

    return result;
  }

  return {
    email,
    submitted,
    setEmail,
    submitSignup,
  };
}
