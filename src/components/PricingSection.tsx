"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const freeFeatures = [
  "Basic avatar (Stage 1)",
  "5 health metrics",
  "3 daily habits",
  "Water tracking",
] as const;

const proFeatures = [
  "All 4 evolution stages",
  "20+ health metrics",
  "Unlimited habits + custom",
  "Work time tracking",
  "Seasonal themes",
  "Daily AI avatar generation",
] as const;

export default function PricingSection() {
  const [annual, setAnnual] = useState(true);

  return (
    <section
      id="pricing"
      className={cn(
        "bg-[#fafafa]",
        "px-5 py-20",
        "md:px-10 md:py-[120px]"
      )}
    >
      <div className="mx-auto max-w-[1200px]">
        {/* Section header */}
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#737373]">
            [ PRICING ]
          </p>
          <h2
            className={cn(
              "mt-4 font-sans font-bold leading-[1.1] tracking-[-0.02em] text-[#0a0a0a]",
              "text-[clamp(32px,5vw,48px)]"
            )}
          >
            Start free. Evolve further.
          </h2>
          <div className="mt-6 h-px w-[80px] bg-[#0a0a0a]" />
        </div>

        {/* Billing toggle */}
        <div className="mt-12 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => setAnnual(false)}
            className={cn(
              "font-mono text-[11px] uppercase tracking-[0.08em] transition-colors duration-200",
              !annual ? "text-[#0a0a0a]" : "text-[#a3a3a3]"
            )}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setAnnual((prev) => !prev)}
            className="relative flex h-[26px] w-[48px] items-center rounded-full border border-[#e5e5e5] bg-white p-[2px] transition-colors duration-200"
            aria-label="Toggle billing period"
          >
            <span
              className={cn(
                "block h-[20px] w-[20px] rounded-full transition-all duration-200",
                annual
                  ? "translate-x-[22px] bg-[#00ff88]"
                  : "translate-x-0 bg-[#a3a3a3]"
              )}
            />
          </button>
          <button
            type="button"
            onClick={() => setAnnual(true)}
            className={cn(
              "font-mono text-[11px] uppercase tracking-[0.08em] transition-colors duration-200",
              annual ? "text-[#0a0a0a]" : "text-[#a3a3a3]"
            )}
          >
            Annual
          </button>
          {annual && (
            <span className="inline-block rounded bg-[#00ff88] px-2 py-[2px] font-mono text-[9px] font-bold uppercase tracking-[0.08em] text-[#0a0a0a]">
              SAVE 48%
            </span>
          )}
        </div>

        {/* Pricing cards */}
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
          {/* Free card */}
          <div
            className="flex flex-col rounded-xl border border-[#e5e5e5] bg-white p-8 transition-all duration-300 hover:border-[#0a0a0a] hover:shadow-[0_4px_24px_rgba(0,0,0,0.06)] md:p-10"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#737373]">
              FREE
            </p>
            <p className="mt-4 font-sans text-[48px] font-bold leading-none text-[#0a0a0a]">
              $0
            </p>
            <p className="mt-1 font-mono text-[11px] text-[#a3a3a3]">
              forever
            </p>

            <div className="mt-8 h-px bg-[#f0f0f0]" />

            <ul className="mt-8 flex flex-1 flex-col gap-4">
              {freeFeatures.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-3 font-serif text-[15px] leading-[1.6] text-[#525252]"
                >
                  <span className="mt-[8px] block h-[6px] w-[6px] shrink-0 border border-[#a3a3a3]" />
                  {feature}
                </li>
              ))}
            </ul>

            <a
              href="#download"
              className="mt-10 block w-full border border-[#0a0a0a] py-3 text-center font-mono text-[11px] uppercase tracking-[0.08em] text-[#0a0a0a] transition-all duration-200 hover:bg-[#0a0a0a] hover:text-[#fafafa]"
            >
              Get Started
            </a>
          </div>

          {/* Pro card */}
          <div
            className="relative flex flex-col rounded-xl border border-[#0a0a0a] bg-[#0a0a0a] p-8 transition-all duration-300 hover:shadow-[0_0_40px_rgba(0,255,136,0.12)] md:p-10"
          >
            <div className="flex items-center gap-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#737373]">
                PRO
              </p>
              {annual && (
                <span className="inline-block rounded bg-[#00ff88] px-2 py-[2px] font-mono text-[9px] font-bold uppercase tracking-[0.08em] text-[#0a0a0a]">
                  BEST VALUE
                </span>
              )}
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <p className="font-sans text-[48px] font-bold leading-none text-[#fafafa]">
                {annual ? "$49.99" : "$7.99"}
              </p>
              <p className="font-mono text-[11px] text-[#525252]">
                {annual ? "/year" : "/month"}
              </p>
            </div>
            {annual && (
              <p className="mt-1 font-mono text-[11px] text-[#00ff88]">
                ~$4.17/mo billed annually
              </p>
            )}

            <div className="mt-8 h-px bg-[#262626]" />

            <ul className="mt-8 flex flex-1 flex-col gap-4">
              {proFeatures.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-3 font-serif text-[15px] leading-[1.6] text-[#a3a3a3]"
                >
                  <span className="mt-[8px] block h-[6px] w-[6px] shrink-0 bg-[#00ff88]" />
                  {feature}
                </li>
              ))}
            </ul>

            <a
              href="#download"
              className="mt-10 block w-full py-3 text-center font-mono text-[11px] uppercase tracking-[0.08em] text-[#0a0a0a] transition-[filter] duration-200 hover:brightness-110"
              style={{
                backgroundColor: "#00ff88",
                borderRadius: "4px",
              }}
            >
              Join Beta
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
