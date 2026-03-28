"use client";

import { useState } from "react";
import { BetaModal } from "@/components/BetaModal";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Voxel Avatar — CSS-only blocky humanoid (meebits-inspired)        */
/* ------------------------------------------------------------------ */

const INDIGO = "#6366f1";
const NEON = "#00ff88";
const BLACK = "#0a0a0a";
const WHITE = "#fafafa";

type Block = {
  row: number;
  col: number;
  color: string;
  span?: number; // colSpan, default 1
};

/**
 * A 7-column, 12-row pixel grid that draws a blocky humanoid avatar.
 * Each Block occupies one cell (or `span` cells) in the grid.
 */
const AVATAR_BLOCKS: Block[] = [
  // ---- head (rows 0-2) ----
  { row: 0, col: 2, color: INDIGO },
  { row: 0, col: 3, color: INDIGO },
  { row: 0, col: 4, color: INDIGO },
  { row: 1, col: 2, color: INDIGO },
  { row: 1, col: 3, color: WHITE },
  { row: 1, col: 4, color: INDIGO },
  { row: 2, col: 2, color: INDIGO },
  { row: 2, col: 3, color: NEON },
  { row: 2, col: 4, color: INDIGO },

  // ---- neck (row 3) ----
  { row: 3, col: 3, color: INDIGO },

  // ---- shoulders + torso (rows 4-6) ----
  { row: 4, col: 1, color: NEON },
  { row: 4, col: 2, color: BLACK },
  { row: 4, col: 3, color: BLACK },
  { row: 4, col: 4, color: BLACK },
  { row: 4, col: 5, color: NEON },

  { row: 5, col: 2, color: BLACK },
  { row: 5, col: 3, color: NEON },
  { row: 5, col: 4, color: BLACK },

  { row: 6, col: 2, color: BLACK },
  { row: 6, col: 3, color: BLACK },
  { row: 6, col: 4, color: BLACK },

  // ---- waist (row 7) ----
  { row: 7, col: 2, color: INDIGO },
  { row: 7, col: 3, color: INDIGO },
  { row: 7, col: 4, color: INDIGO },

  // ---- legs (rows 8-10) ----
  { row: 8, col: 2, color: INDIGO },
  { row: 8, col: 4, color: INDIGO },

  { row: 9, col: 2, color: INDIGO },
  { row: 9, col: 4, color: INDIGO },

  { row: 10, col: 2, color: INDIGO },
  { row: 10, col: 4, color: INDIGO },

  // ---- feet (row 11) ----
  { row: 11, col: 1, color: BLACK },
  { row: 11, col: 2, color: BLACK },
  { row: 11, col: 4, color: BLACK },
  { row: 11, col: 5, color: BLACK },

  // ---- arms (hanging) ----
  { row: 5, col: 1, color: INDIGO },
  { row: 5, col: 5, color: INDIGO },
  { row: 6, col: 1, color: INDIGO },
  { row: 6, col: 5, color: INDIGO },
  { row: 7, col: 1, color: NEON },
  { row: 7, col: 5, color: NEON },
];

const GRID_COLS = 7;
const GRID_ROWS = 12;
const CELL_SIZE_CLASS = "w-[18px] h-[18px] md:w-[22px] md:h-[22px] lg:w-[28px] lg:h-[28px]";

function VoxelAvatar() {
  // Build a 2D lookup for fast rendering
  const lookup = new Map<string, string>();
  for (const b of AVATAR_BLOCKS) {
    lookup.set(`${b.row}-${b.col}`, b.color);
  }

  return (
    <div
      className="grid gap-[2px] md:gap-[3px]"
      style={{
        gridTemplateColumns: `repeat(${GRID_COLS}, auto)`,
        gridTemplateRows: `repeat(${GRID_ROWS}, auto)`,
      }}
    >
      {Array.from({ length: GRID_ROWS * GRID_COLS }).map((_, i) => {
        const row = Math.floor(i / GRID_COLS);
        const col = i % GRID_COLS;
        const color = lookup.get(`${row}-${col}`);
        return (
          <div
            key={i}
            className={cn(CELL_SIZE_CLASS, "rounded-[2px]")}
            style={{
              backgroundColor: color ?? "transparent",
              boxShadow: color
                ? `inset -2px -2px 0 rgba(0,0,0,0.15), inset 2px 2px 0 rgba(255,255,255,0.1)`
                : undefined,
            }}
          />
        );
      })}
    </div>
  );
}

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

/* ------------------------------------------------------------------ */
/*  HeroSection                                                       */
/* ------------------------------------------------------------------ */

export function HeroSection() {
  const [showBetaModal, setShowBetaModal] = useState(false);

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
        style={{ background: "radial-gradient(circle, #00ff88 0%, transparent 70%)" }}
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
              <VoxelAvatar />
              {/* Ground shadow */}
              <div
                className="mt-4 w-24 h-3 rounded-full opacity-20"
                style={{
                  background:
                    "radial-gradient(ellipse at center, #0a0a0a 0%, transparent 70%)",
                }}
              />
            </div>

            {/* Annotation lines */}
            <div className="absolute top-[12%] right-[-4%] hidden md:block">
              <AnnotationLine label="XP: 2,450" lineWidth={50} />
            </div>
            <div className="absolute top-[46%] right-[-8%] hidden md:block">
              <AnnotationLine label="LVL 12 — ATHLETE" lineWidth={40} />
            </div>
            <div className="absolute bottom-[22%] right-[-2%] hidden md:block">
              <AnnotationLine label="MOOD: ENERGIZED" lineWidth={55} />
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
