export const BETA_SIGNUP_STORAGE_KEY = "atomicsync-beta-signup";

export type BetaSignupResult =
  | { ok: true }
  | { ok: false; reason: "invalid_email" | "storage_unavailable" };

export function isValidBetaEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function submitBetaSignup(email: string): BetaSignupResult {
  if (!isValidBetaEmail(email)) {
    return { ok: false, reason: "invalid_email" };
  }

  try {
    localStorage.setItem(BETA_SIGNUP_STORAGE_KEY, email);
  } catch {
    return { ok: false, reason: "storage_unavailable" };
  }

  return { ok: true };
}
