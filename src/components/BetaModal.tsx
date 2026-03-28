"use client";

import { useEffect } from "react";
import { X, CheckCircle } from "lucide-react";
import { BetaSignup } from "@/components/BetaSignup";

interface BetaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BetaModal({ isOpen, onClose }: BetaModalProps) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", onKeyDown);
      return () => document.removeEventListener("keydown", onKeyDown);
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ animation: "modal-fade-in 200ms ease-out" }}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
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
          onClick={onClose}
          className="absolute top-4 right-4 cursor-pointer transition-colors duration-200 hover:text-[#fafafa]"
          style={{ color: "#737373" }}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <h3
          className="font-sans font-bold"
          style={{ fontSize: "24px", color: "#fafafa", lineHeight: 1.2 }}
        >
          Join the AtomicSync Beta
        </h3>

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

        <BetaSignup
          className="mt-8"
          renderSuccess={() => (
            <div className="flex flex-col items-center py-6 text-center">
              <CheckCircle size={40} color="#00ff88" strokeWidth={2} />
              <p
                className="mt-4 font-sans font-bold"
                style={{ fontSize: "20px", color: "#fafafa" }}
              >
                You&apos;re in!
              </p>
              <p
                className="mt-2 font-mono text-[13px]"
                style={{ color: "#737373" }}
              >
                We&apos;ll notify you when AtomicSync launches.
              </p>
            </div>
          )}
          footer={
            <p
              className="font-mono"
              style={{
                fontSize: "10px",
                color: "#525252",
                lineHeight: 1.5,
              }}
            >
              We&apos;ll only email you about AtomicSync. No spam.
            </p>
          }
        />
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
