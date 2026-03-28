"use client";

import { useState, useEffect, type FormEvent } from "react";
import { CheckCircle } from "lucide-react";

const STORAGE_KEY = "atomicsync-beta-signup";

// TODO: Connect to email service (Resend, Mailchimp, etc.)

export default function BetaSignup() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setSubmitted(true);
    }
  }, []);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    console.log("Beta signup:", email);
    localStorage.setItem(STORAGE_KEY, email);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex items-center gap-3">
        <CheckCircle size={20} color="#00ff88" strokeWidth={2.5} />
        <p
          className="font-mono text-[13px]"
          style={{ color: "#fafafa" }}
        >
          You&apos;re in! We&apos;ll notify you when AtomicSync launches.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-3 w-full max-w-[480px]"
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="flex-1 font-mono text-[13px] px-4 py-[14px] bg-transparent border border-[#e5e5e5] text-[#fafafa] placeholder-[#737373] outline-none transition-colors duration-200 focus:bg-[#1a1a1a] focus:border-[#00ff88]"
        style={{ borderRadius: "4px" }}
      />
      <button
        type="submit"
        className="font-mono text-[11px] font-bold uppercase tracking-[0.08em] px-8 py-[14px] cursor-pointer transition-[filter] duration-200 hover:brightness-110 shrink-0"
        style={{
          backgroundColor: "#00ff88",
          color: "#0a0a0a",
          borderRadius: "4px",
        }}
      >
        JOIN BETA
      </button>
    </form>
  );
}
