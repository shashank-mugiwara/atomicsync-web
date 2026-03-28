"use client";

import type { FormEvent, ReactNode } from "react";
import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBetaSignup } from "@/hooks/useBetaSignup";

interface BetaSignupProps {
  className?: string;
  footer?: ReactNode;
  renderSuccess?: () => ReactNode;
}

function DefaultSuccessMessage() {
  return (
    <div className="flex items-center gap-3">
      <CheckCircle size={20} color="#00ff88" strokeWidth={2.5} />
      <p className="font-mono text-[13px] text-[#fafafa]">
        You&apos;re in! We&apos;ll notify you when AtomicSync launches.
      </p>
    </div>
  );
}

export function BetaSignup({
  className,
  footer,
  renderSuccess,
}: BetaSignupProps) {
  const { email, submitted, setEmail, submitSignup } = useBetaSignup();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submitSignup();
  }

  if (submitted) {
    return renderSuccess ? renderSuccess() : <DefaultSuccessMessage />;
  }

  return (
    <div className={className}>
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-[480px] flex-col gap-3 sm:flex-row"
      >
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Enter your email"
          className="flex-1 rounded-[4px] border border-[#e5e5e5] bg-transparent px-4 py-[14px] font-mono text-[13px] text-[#fafafa] placeholder-[#737373] outline-none transition-colors duration-200 focus:border-[#00ff88] focus:bg-[#1a1a1a]"
        />
        <button
          type="submit"
          className="shrink-0 rounded-[4px] bg-[#00ff88] px-8 py-[14px] font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-[#0a0a0a] transition-[filter] duration-200 hover:brightness-110"
        >
          JOIN BETA
        </button>
      </form>
      {footer ? <div className={cn("mt-4", className && "w-full")}>{footer}</div> : null}
    </div>
  );
}
