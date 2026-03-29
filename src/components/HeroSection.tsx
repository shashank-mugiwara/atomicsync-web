"use client";

import { useEffect, useState } from "react";
import { BetaModal } from "@/components/BetaModal";
import { CompanionVoxel, type CompanionVoxelPresetId } from "@/components/CompanionVoxel";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Annotation line + label                                           */
/* ------------------------------------------------------------------ */

function AnnotationLine({
  label,
  className,
  lineWidth = 60,
  direction = "right",
}: {
  label: string;
  className?: string;
  lineWidth?: number;
  direction?: "right" | "left";
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 pointer-events-none select-none",
        direction === "left" && "flex-row-reverse",
        className,
      )}
    >
      {/* dot */}
      <div className="w-[5px] h-[5px] rounded-full bg-[#e5e5e5] shrink-0" />
      {/* line */}
      <div
        className="h-px bg-[#e5e5e5] shrink-0"
        style={{ width: lineWidth }}
      />
      {/* label */}
      <span className="font-mono text-[9px] uppercase tracking-[0.08em] text-[#737373] whitespace-nowrap">
        {label}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tags                                                              */
/* ------------------------------------------------------------------ */

const TAGS = ["APPLE HEALTHKIT", "20+ METRICS", "AI AVATARS", "EMOTIONAL COMPANION"];

const HERO_STATES: Array<{
  preset: CompanionVoxelPresetId;
  xp: string;
  level: string;
  mood: string;
  thought: string;
  accent: string;
}> = [
  {
    preset: "energized",
    xp: "XP: 2,450",
    level: "LVL 12 — ATHLETE",
    mood: "MOOD: ENERGIZED",
    thought: "What a day. I can feel the light in both of us.",
    accent: "radial-gradient(circle, rgba(255,215,0,0.12) 0%, rgba(0,255,136,0.08) 40%, transparent 72%)",
  },
  {
    preset: "active-mood",
    xp: "XP: 2,180",
    level: "LVL 11 — ATHLETE",
    mood: "MOOD: ACTIVE",
    thought: "We’re in motion now. Keep the rhythm going.",
    accent: "radial-gradient(circle, rgba(20,184,166,0.12) 0%, rgba(249,115,22,0.08) 42%, transparent 74%)",
  },
  {
    preset: "calm",
    xp: "XP: 1,620",
    level: "LVL 8 — ACTIVE",
    mood: "MOOD: CALM",
    thought: "Gentle day. Quiet progress still changes us.",
    accent: "radial-gradient(circle, rgba(249,168,212,0.12) 0%, rgba(255,255,255,0.08) 40%, transparent 72%)",
  },
  {
    preset: "rested",
    xp: "XP: 3,040",
    level: "LVL 16 — CHAMPION",
    mood: "MOOD: RESTED",
    thought: "Deep rest changes everything. We’re glowing again.",
    accent: "radial-gradient(circle, rgba(196,181,253,0.12) 0%, rgba(147,197,253,0.08) 44%, transparent 74%)",
  },
  {
    preset: "tired",
    xp: "XP: 420",
    level: "LVL 3 — BEGINNER",
    mood: "MOOD: TIRED",
    thought: "Rough night. Let’s take it easy and recover together.",
    accent: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.08) 42%, transparent 74%)",
  },
];

/* ------------------------------------------------------------------ */
/*  HeroSection                                                       */
/* ------------------------------------------------------------------ */

export function HeroSection() {
  const [showBetaModal, setShowBetaModal] = useState(false);
  const [stateIndex, setStateIndex] = useState(0);
  const currentState = HERO_STATES[stateIndex];

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setStateIndex((current) => (current + 1) % HERO_STATES.length);
    }, 3200);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <section
      className="relative min-h-screen overflow-hidden grain-overlay"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(0,0,0,0.025) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(0,0,0,0.025) 1px, transparent 1px)
        `,
        backgroundSize: "80px 80px",
      }}
    >
      {/* Subtle gradient accent behind content */}
      <div
        className="absolute top-[10%] right-[10%] w-[500px] h-[500px] rounded-full opacity-[0.04] pointer-events-none"
        style={{ background: currentState.accent }}
      />

      {/* Content wrapper */}
      <div className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-10 pt-[140px] pb-24 flex flex-col lg:flex-row items-start lg:items-center gap-12 lg:gap-8 min-h-screen">
        {/* ============== LEFT COLUMN — TYPOGRAPHY ============== */}
        <div className="w-full lg:w-[60%] flex flex-col justify-center">
          {/* Eyebrow */}
          <span
            className="inline-block self-start font-mono text-[10px] uppercase tracking-[0.15em] text-[#0a0a0a] border border-[#0a0a0a] px-3 py-1 mb-8"
          >
            [ YOUR HEALTH, ALIVE ]
          </span>

          {/* Main heading — dramatic scale inspired by Apple/Stripe */}
          <h1
            className="font-sans font-bold heading-display text-[#0a0a0a] text-[42px] md:text-[56px] lg:text-[84px] xl:text-[96px]"
          >
            YOUR HEALTH,
            <br />
            <span className="gradient-text-neon">EVOLVED</span>
            <span className="text-[#00ff88]">.</span>
          </h1>

          {/* Subheading */}
          <p
            className="font-serif italic font-normal text-[16px] md:text-[18px] lg:text-[20px] leading-[1.6] text-[#525252] max-w-[500px] mt-8 text-balance"
          >
            Meet a companion that reflects your real health. Sleep well, and it
            glows. Skip a workout, and it shows. Your body tells a story — now
            you can see it.
          </p>

          {/* Annotation tags */}
          <div className="flex flex-wrap gap-2 mt-8">
            {TAGS.map((tag) => (
              <span
                key={tag}
                className="font-mono text-[9px] uppercase tracking-[0.06em] text-[#737373] border border-[#e5e5e5] px-2 py-[3px]"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* CTA buttons — premium hover with glow */}
          <div className="flex flex-wrap gap-4 mt-14">
            <button
              onClick={() => setShowBetaModal(true)}
              className={cn(
                "font-mono text-[11px] uppercase tracking-[0.08em]",
                "bg-[#0a0a0a] text-white px-8 py-[14px]",
                "transition-all duration-300 hover:bg-[#1a1a1a] hover:shadow-[0_8px_30px_rgba(0,0,0,0.15)]",
                "hover:-translate-y-[2px] active:translate-y-0 active:scale-[0.98]",
                "cursor-pointer",
              )}
            >
              Join Beta
            </button>
            <a
              href="#features"
              className={cn(
                "font-mono text-[11px] uppercase tracking-[0.08em]",
                "border border-[#0a0a0a] text-[#0a0a0a] bg-transparent px-8 py-[14px]",
                "btn-bordered cursor-pointer",
              )}
            >
              Learn More
            </a>
          </div>
        </div>

        {/* ============== RIGHT COLUMN — AVATAR SHOWCASE ============== */}
        <div className="w-full lg:w-[40%] flex items-center justify-center">
          <div className="relative w-full max-w-[420px] aspect-square flex items-center justify-center">
            {/* Outer rotating ring */}
            <div
              className="absolute inset-[5%] rounded-full border border-dashed border-[#e5e5e5]"
              style={{ animation: "rotate-slow 20s linear infinite" }}
            />

            {/* Inner counter-rotating ring */}
            <div
              className="absolute inset-[15%] rounded-full border border-[#f0f0f0]"
              style={{ animation: "rotate-slow 20s linear infinite reverse" }}
            />

            {/* Floating avatar + shadow */}
            <div
              className="relative z-10 flex flex-col items-center"
              style={{ animation: "float 6s ease-in-out infinite" }}
            >
              <CompanionVoxel
                preset={currentState.preset}
                size="md"
                className="min-h-[420px] justify-center"
              />
              <div className="mt-2 max-w-[260px] text-center">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#737373]">
                  current companion state
                </p>
                <p className="mt-2 font-serif text-[15px] italic leading-[1.5] text-[#525252]">
                  {currentState.thought}
                </p>
              </div>
            </div>

            {/* Annotation lines */}
            <div className="absolute top-[12%] right-[-4%] hidden md:block">
              <AnnotationLine label={currentState.xp} lineWidth={50} />
            </div>
            <div className="absolute top-[46%] right-[-8%] hidden md:block">
              <AnnotationLine label={currentState.level} lineWidth={40} />
            </div>
            <div className="absolute bottom-[22%] right-[-2%] hidden md:block">
              <AnnotationLine label={currentState.mood} lineWidth={55} />
            </div>
          </div>
        </div>
      </div>

      {/* ============== SCROLL INDICATOR ============== */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
        <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#a3a3a3]">
          Scroll
        </span>
        <div
          className="w-px h-[30px] bg-[#a3a3a3]"
          style={{ animation: "pulse-line 2s ease-in-out infinite" }}
        />
      </div>

      <BetaModal isOpen={showBetaModal} onClose={() => setShowBetaModal(false)} />
    </section>
  );
}
