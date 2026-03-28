"use client";

import { useState, useEffect, useCallback, type FormEvent } from "react";
import { X, CheckCircle } from "lucide-react";

const STORAGE_KEY = "atomicsync-beta-signup";

// TODO: Connect to email service (Resend, Mailchimp, etc.)

interface BetaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BetaModal({ isOpen, onClose }: BetaModalProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setSubmitted(true);
    }
  }, []);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  // Close on Escape key
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
    }
    if (isOpen) {
      document.addEventListener("keydown", onKeyDown);
      return () => document.removeEventListener("keydown", onKeyDown);
    }
  }, [isOpen, handleClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isOpen]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    console.log("Beta signup:", email);
    localStorage.setItem(STORAGE_KEY, email);
    setSubmitted(true);
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ animation: "modal-fade-in 200ms ease-out" }}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal card */}
      <div
        className="relative z-10 w-full max-w-[480px] p-8 md:p-10"
        style={{
          backgroundColor: "#0a0a0a",
          borderRadius: "16px",
          border: "1px solid #262626",
          animation: "modal-slide-up 300ms ease-out",
        }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 cursor-pointer transition-colors duration-200 hover:text-[#fafafa]"
          style={{ color: "#737373" }}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {submitted ? (
          <div className="flex flex-col items-center text-center py-6">
            <CheckCircle size={40} color="#00ff88" strokeWidth={2} />
            <p
              className="font-sans font-bold mt-4"
              style={{ fontSize: "20px", color: "#fafafa" }}
            >
              You&apos;re in!
            </p>
            <p
              className="font-mono text-[13px] mt-2"
              style={{ color: "#737373" }}
            >
              We&apos;ll notify you when AtomicSync launches.
            </p>
          </div>
        ) : (
          <>
            {/* Heading */}
            <h3
              className="font-sans font-bold"
              style={{ fontSize: "24px", color: "#fafafa", lineHeight: 1.2 }}
            >
              Join the AtomicSync Beta
            </h3>

            {/* Subtext */}
            <p
              className="font-serif italic mt-3"
              style={{
                fontSize: "15px",
                color: "#737373",
                lineHeight: 1.6,
              }}
            >
              Be among the first to meet your AI health companion. We&apos;ll
              send you a TestFlight invite.
            </p>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 mt-8"
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

            {/* Privacy note */}
            <p
              className="font-mono mt-4"
              style={{
                fontSize: "10px",
                color: "#525252",
                lineHeight: 1.5,
              }}
            >
              We&apos;ll only email you about AtomicSync. No spam.
            </p>
          </>
        )}
      </div>

      {/* Keyframe styles */}
      <style jsx>{`
        @keyframes modal-fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes modal-slide-up {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
