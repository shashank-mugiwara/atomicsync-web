import { BetaSignup } from "@/components/BetaSignup";
import { cn } from "@/lib/utils";

function ConnectIcon({ className }: { className?: string }) {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="16" cy="24" r="8" stroke="#0a0a0a" strokeWidth="2.5" />
      <circle cx="32" cy="24" r="8" stroke="#0a0a0a" strokeWidth="2.5" />
      <path
        d="M22 20L26 28"
        stroke="#00ff88"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M22 28L26 20"
        stroke="#00ff88"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TrackIcon({ className }: { className?: string }) {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <polyline
        points="4,32 12,28 18,34 24,18 30,24 36,12 44,20"
        stroke="#0a0a0a"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="36" cy="12" r="4" fill="#00ff88" />
    </svg>
  );
}

function EvolveIcon({ className }: { className?: string }) {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M24 40V12"
        stroke="#0a0a0a"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M16 20L24 12L32 20"
        stroke="#0a0a0a"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 8L20 4L22 8"
        stroke="#00ff88"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M28 10L30 6L32 10"
        stroke="#00ff88"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const steps = [
  {
    number: "01",
    title: "CONNECT",
    description:
      "Link Apple Health in seconds. AtomicSync reads your steps, sleep, heart rate, and workouts automatically. No manual entry needed.",
    Icon: ConnectIcon,
  },
  {
    number: "02",
    title: "TRACK",
    description:
      "Log daily habits and water intake. Every healthy action earns XP and shapes how your avatar looks and feels.",
    Icon: TrackIcon,
  },
  {
    number: "03",
    title: "EVOLVE",
    description:
      "Watch your avatar transform. Well-rested? It glows. Active day? It stands tall. Your health journey, visible and alive.",
    Icon: EvolveIcon,
  },
] as const;

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="py-20 px-5 md:py-[120px] md:px-10"
      style={{ backgroundColor: "#fafafa" }}
    >
      <div className="mx-auto max-w-[1200px]">
        {/* Section header */}
        <div>
          <p
            className="font-mono uppercase"
            style={{
              fontSize: "10px",
              letterSpacing: "0.15em",
              color: "#737373",
            }}
          >
            [ HOW IT WORKS ]
          </p>
          <h2
            className="font-sans font-bold mt-4"
            style={{
              fontSize: "clamp(32px, 5vw, 48px)",
              lineHeight: 1.1,
              color: "#0a0a0a",
            }}
          >
            Three steps to evolution.
          </h2>
          <div
            className="mt-6"
            style={{
              width: "80px",
              height: "1px",
              backgroundColor: "#0a0a0a",
            }}
          />
        </div>

        {/* Steps grid */}
        <div className="mt-20 grid grid-cols-1 gap-16 md:grid-cols-3 md:gap-16 relative">
          {/* Connecting lines (desktop only) */}
          <div
            className="hidden md:block absolute top-[60px] left-[calc(33.333%-32px)] h-px"
            style={{
              width: "64px",
              backgroundColor: "#e5e5e5",
            }}
          />
          <div
            className="hidden md:block absolute top-[60px] left-[calc(66.666%-32px)] h-px"
            style={{
              width: "64px",
              backgroundColor: "#e5e5e5",
            }}
          />

          {steps.map((step) => (
            <div key={step.number} className="relative">
              {/* Large decorative number */}
              <span
                className="font-sans font-bold select-none"
                style={{
                  fontSize: "120px",
                  lineHeight: 1,
                  color: "#f0f0f0",
                }}
              >
                {step.number}
              </span>

              {/* Icon overlapping number */}
              <div className="relative -mt-16 ml-4">
                <step.Icon />
              </div>

              {/* Title */}
              <h3
                className="font-sans font-semibold uppercase mt-6"
                style={{
                  fontSize: "24px",
                  color: "#0a0a0a",
                }}
              >
                {step.title}
              </h3>

              {/* Description */}
              <p
                className="mt-3 font-serif"
                style={{
                  fontSize: "15px",
                  fontWeight: 400,
                  color: "#737373",
                  lineHeight: 1.7,
                  maxWidth: "320px",
                }}
              >
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA banner */}
        <div
          className={cn(
            "mt-20 flex flex-col items-start gap-8 p-10 md:p-[60px_48px]",
            "md:flex-row md:items-center md:justify-between"
          )}
          style={{
            backgroundColor: "#0a0a0a",
            borderRadius: "16px",
          }}
        >
          {/* Left side */}
          <div>
            <p
              className="font-sans font-bold"
              style={{ fontSize: "32px", color: "#fafafa" }}
            >
              Ready to meet your avatar?
            </p>
            <p
              className="font-mono uppercase mt-2"
              style={{
                fontSize: "11px",
                color: "#737373",
              }}
            >
              Available on iOS 17+
            </p>
          </div>

          {/* Right side */}
          <div className="flex flex-col items-start md:items-center">
            <BetaSignup />
            <p
              className="font-mono uppercase mt-3 md:text-center"
              style={{
                fontSize: "9px",
                color: "#525252",
              }}
            >
              COMING SOON
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
