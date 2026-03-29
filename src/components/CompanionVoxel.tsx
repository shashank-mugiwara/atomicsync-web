"use client";

import { cn } from "@/lib/utils";

type CompanionVoxelPresetId =
  | "beginner"
  | "active-stage"
  | "athlete"
  | "champion"
  | "energized"
  | "active-mood"
  | "calm"
  | "rested"
  | "tired";

type AtmosphereDot = {
  size: number;
  x: string;
  y: string;
  color: string;
  opacity?: number;
  delay?: string;
  duration?: string;
};

type VoxelPreset = {
  grid: string[];
  colors: Record<string, string>;
  aura: string;
  floorGlow: string;
  blockGlow: string;
  atmosphere: AtmosphereDot[];
};

const PRESETS: Record<CompanionVoxelPresetId, VoxelPreset> = {
  beginner: {
    grid: [
      "___II___",
      "___WI___",
      "__IBI__",
      "___I____",
      "__BBBB__",
      "__BIB___",
      "__BBB___",
      "___II___",
      "___I_I__",
      "___I_I__",
      "__I___I_",
      "__B___B_",
    ],
    colors: {
      I: "#6b7280",
      W: "#f5f5f5",
      B: "#171717",
    },
    aura: "radial-gradient(circle, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 72%)",
    floorGlow: "radial-gradient(ellipse at center, rgba(10,10,10,0.24) 0%, transparent 72%)",
    blockGlow: "rgba(255,255,255,0.1)",
    atmosphere: [
      { size: 4, x: "18%", y: "20%", color: "#d4d4d4", opacity: 0.45, delay: "0.2s" },
      { size: 5, x: "78%", y: "28%", color: "#a3a3a3", opacity: 0.35, delay: "1s" },
    ],
  },
  "active-stage": {
    grid: [
      "___III___",
      "___INI___",
      "__IIIII__",
      "___ITI___",
      "__TBBBT__",
      "__IBNBI__",
      "__IBBBI__",
      "__TIII T_".replace(" ", ""),
      "___I_I___",
      "__II_II__",
      "__I___I__",
      "_BB___BB_",
    ],
    colors: {
      I: "#6366f1",
      N: "#fafafa",
      B: "#171717",
      T: "#14b8a6",
    },
    aura: "radial-gradient(circle, rgba(20,184,166,0.18) 0%, rgba(99,102,241,0.06) 48%, rgba(20,184,166,0) 74%)",
    floorGlow: "radial-gradient(ellipse at center, rgba(20,184,166,0.2) 0%, transparent 72%)",
    blockGlow: "rgba(20,184,166,0.2)",
    atmosphere: [
      { size: 4, x: "14%", y: "32%", color: "#14b8a6", opacity: 0.5, delay: "0.3s" },
      { size: 5, x: "82%", y: "22%", color: "#6366f1", opacity: 0.45, delay: "1.4s" },
      { size: 3, x: "72%", y: "62%", color: "#f97316", opacity: 0.4, delay: "0.9s" },
    ],
  },
  athlete: {
    grid: [
      "___III___",
      "___INI___",
      "__IINII__",
      "___III___",
      "__NBBBN__",
      "_IBNBNBI_",
      "_IBBBBBI_",
      "__NIIIN__",
      "___I_I___",
      "__II_II__",
      "__I___I__",
      "_BB___BB_",
    ],
    colors: {
      I: "#6366f1",
      N: "#00ff88",
      B: "#0a0a0a",
    },
    aura: "radial-gradient(circle, rgba(0,255,136,0.22) 0%, rgba(99,102,241,0.08) 46%, rgba(0,255,136,0) 72%)",
    floorGlow: "radial-gradient(ellipse at center, rgba(0,255,136,0.18) 0%, transparent 72%)",
    blockGlow: "rgba(0,255,136,0.22)",
    atmosphere: [
      { size: 5, x: "16%", y: "18%", color: "#00ff88", opacity: 0.5, delay: "0.2s" },
      { size: 4, x: "84%", y: "26%", color: "#66ffbb", opacity: 0.45, delay: "1.3s" },
      { size: 3, x: "76%", y: "58%", color: "#6366f1", opacity: 0.4, delay: "0.9s" },
    ],
  },
  champion: {
    grid: [
      "____G____",
      "___III___",
      "___INI___",
      "__IWWWI__",
      "__NBBBN__",
      "_IBNBNBI_",
      "_IBBBBBI_",
      "__NIIIN__",
      "__II_II__",
      "__I___I__",
      "_II___II_",
      "_BB___BB_",
    ],
    colors: {
      I: "#6366f1",
      N: "#00ff88",
      B: "#0a0a0a",
      W: "#fafafa",
      G: "#fbbf24",
    },
    aura: "radial-gradient(circle, rgba(251,191,36,0.16) 0%, rgba(0,255,136,0.12) 34%, rgba(99,102,241,0.06) 58%, rgba(251,191,36,0) 76%)",
    floorGlow: "radial-gradient(ellipse at center, rgba(251,191,36,0.2) 0%, transparent 72%)",
    blockGlow: "rgba(251,191,36,0.24)",
    atmosphere: [
      { size: 5, x: "18%", y: "16%", color: "#fbbf24", opacity: 0.6, delay: "0.2s" },
      { size: 4, x: "80%", y: "18%", color: "#00ff88", opacity: 0.55, delay: "1.2s" },
      { size: 3, x: "84%", y: "52%", color: "#fafafa", opacity: 0.45, delay: "0.9s" },
      { size: 4, x: "22%", y: "64%", color: "#6366f1", opacity: 0.4, delay: "1.6s" },
    ],
  },
  energized: {
    grid: [
      "______HHHHH______",
      "_____HHJJJHH_____",
      "____HHJJJJJHH____",
      "____HJSSSSSJH____",
      "___HJSSWEWSSJH___",
      "___HJSSSSSSSJH___",
      "____JSSSSSSSJ____",
      "_____SCDDDCS_____",
      "____SCDNANDCS____",
      "___SCDDDDDDDCS___",
      "___SCDDDDDDDCS___",
      "____CCDDDDDCC____",
      "____CLL___LLC____",
      "___CLLL___LLLC___",
      "___CLL_____LLC___",
      "____LL_____LL____",
      "___BBB___BBB_____",
    ],
    colors: {
      H: "#7c3aed",
      J: "#a78bfa",
      S: "#fde68a",
      W: "#fafafa",
      E: "#0a0a0a",
      C: "#facc15",
      D: "#14b8a6",
      N: "#00ff88",
      A: "#fef08a",
      L: "#6366f1",
      B: "#0a0a0a",
    },
    aura: "radial-gradient(circle, rgba(255,215,0,0.18) 0%, rgba(0,255,136,0.16) 34%, rgba(255,215,0,0) 74%)",
    floorGlow: "radial-gradient(ellipse at center, rgba(255,215,0,0.2) 0%, transparent 72%)",
    blockGlow: "rgba(255,215,0,0.26)",
    atmosphere: [
      { size: 5, x: "14%", y: "20%", color: "#ffd700", opacity: 0.65, delay: "0.1s" },
      { size: 6, x: "80%", y: "22%", color: "#00ff88", opacity: 0.6, delay: "1.1s" },
      { size: 4, x: "72%", y: "52%", color: "#ffe066", opacity: 0.45, delay: "0.7s" },
      { size: 3, x: "24%", y: "62%", color: "#66ffbb", opacity: 0.45, delay: "1.5s" },
    ],
  },
  "active-mood": {
    grid: [
      "______HHHHH______",
      "_____HHJJJHH_____",
      "____HHJJJJJHH____",
      "____HJSSSSSJH____",
      "___HJSSWEWSSJH___",
      "___HJSSSSSSSJH___",
      "____JSSSSSSSJ____",
      "_____SCTTTCS_____",
      "____SCTNANTCS____",
      "___SCTTTTTTTCS___",
      "___SCTTTTTTTCS___",
      "____CCTTTTTCC____",
      "____CLL___LLC____",
      "___CLLL___LLLC___",
      "___CLL_____LLC___",
      "____LL_____LL____",
      "___BBB___BBB_____",
    ],
    colors: {
      H: "#0f172a",
      J: "#334155",
      S: "#fed7aa",
      W: "#fafafa",
      E: "#0a0a0a",
      C: "#f97316",
      T: "#22c55e",
      N: "#14b8a6",
      A: "#67e8f9",
      L: "#0ea5e9",
      B: "#0a0a0a",
    },
    aura: "radial-gradient(circle, rgba(20,184,166,0.18) 0%, rgba(249,115,22,0.18) 38%, rgba(20,184,166,0) 74%)",
    floorGlow: "radial-gradient(ellipse at center, rgba(249,115,22,0.18) 0%, transparent 72%)",
    blockGlow: "rgba(249,115,22,0.22)",
    atmosphere: [
      { size: 5, x: "16%", y: "22%", color: "#14b8a6", opacity: 0.55, delay: "0.4s" },
      { size: 4, x: "84%", y: "30%", color: "#f97316", opacity: 0.55, delay: "1.1s" },
      { size: 3, x: "74%", y: "58%", color: "#fb923c", opacity: 0.4, delay: "0.8s" },
    ],
  },
  calm: {
    grid: [
      "______HHHHH______",
      "_____HHJJJHH_____",
      "____HHJJJJJHH____",
      "____HJSSSSSJH____",
      "___HJSSWEWSSJH___",
      "___HJSSSSSSSJH___",
      "____JSSSSSSSJ____",
      "_____SCPPPCS_____",
      "____SCPWAPPCS____",
      "___SCPPPPPPPCS___",
      "___SCPPPPPPPCS___",
      "____CCPPPPPCC____",
      "____CLL___LLC____",
      "___CLLL___LLLC___",
      "___CLL_____LLC___",
      "____LL_____LL____",
      "___BBB___BBB_____",
    ],
    colors: {
      H: "#7c2d12",
      J: "#c2410c",
      S: "#fde68a",
      E: "#0a0a0a",
      P: "#f9a8d4",
      W: "#fafafa",
      C: "#fbcfe8",
      A: "#ffffff",
      L: "#f9a8d4",
      B: "#171717",
    },
    aura: "radial-gradient(circle, rgba(249,168,212,0.16) 0%, rgba(255,255,255,0.14) 38%, rgba(249,168,212,0) 76%)",
    floorGlow: "radial-gradient(ellipse at center, rgba(249,168,212,0.16) 0%, transparent 72%)",
    blockGlow: "rgba(249,168,212,0.2)",
    atmosphere: [
      { size: 4, x: "18%", y: "18%", color: "#f9a8d4", opacity: 0.5, delay: "0.3s" },
      { size: 5, x: "78%", y: "24%", color: "#ffffff", opacity: 0.45, delay: "1.5s" },
      { size: 3, x: "72%", y: "62%", color: "#fbcfe8", opacity: 0.4, delay: "0.8s" },
    ],
  },
  rested: {
    grid: [
      "______HHHHH______",
      "_____HHJJJHH_____",
      "____HHJJJJJHH____",
      "____HJSSSSSJH____",
      "___HJSSWEWSSJH___",
      "___HJSSSSSSSJH___",
      "____JSSSSSSSJ____",
      "_____SCLLLCS_____",
      "____SCLNANLCS____",
      "___SCLLLLLLLCS___",
      "___SCLLLLLLLCS___",
      "____CCLLLLLCC____",
      "____CSS___SSC____",
      "___CSSS___SSSC___",
      "___CSS_____SSC___",
      "____SS_____SS____",
      "___BBB___BBB_____",
    ],
    colors: {
      H: "#1d4ed8",
      J: "#60a5fa",
      S: "#fde68a",
      W: "#fafafa",
      E: "#0a0a0a",
      L: "#c4b5fd",
      C: "#93c5fd",
      N: "#fafafa",
      A: "#e0f2fe",
      B: "#0a0a0a",
    },
    aura: "radial-gradient(circle, rgba(196,181,253,0.18) 0%, rgba(147,197,253,0.14) 40%, rgba(196,181,253,0) 76%)",
    floorGlow: "radial-gradient(ellipse at center, rgba(147,197,253,0.16) 0%, transparent 72%)",
    blockGlow: "rgba(147,197,253,0.22)",
    atmosphere: [
      { size: 4, x: "16%", y: "18%", color: "#c4b5fd", opacity: 0.55, delay: "0.4s" },
      { size: 5, x: "82%", y: "24%", color: "#93c5fd", opacity: 0.5, delay: "1.4s" },
      { size: 3, x: "72%", y: "60%", color: "#ffffff", opacity: 0.45, delay: "0.7s" },
    ],
  },
  tired: {
    grid: [
      "______HHHHH______",
      "_____HHJJJHH_____",
      "____HHJJJJJHH____",
      "____HJSSSSSJH____",
      "___HJSSWWSSSJH___",
      "___HJSSSSSSSJH___",
      "____JSSSSSSSJ____",
      "_____SCVVVCS_____",
      "____SCVWWVCS_____",
      "___SCVVVVVVVCS___",
      "___SCVVVVVVVCS___",
      "____CCVVVVVCC____",
      "____CLL___LLC____",
      "____CLL___LLC____",
      "___CLL_____LLC___",
      "____LL_____LL____",
      "___BBB___BBB_____",
    ],
    colors: {
      H: "#312e81",
      J: "#6366f1",
      S: "#fcd34d",
      E: "#0a0a0a",
      V: "#6366f1",
      W: "#8b5cf6",
      C: "#a5b4fc",
      L: "#64748b",
      B: "#171717",
    },
    aura: "radial-gradient(circle, rgba(99,102,241,0.16) 0%, rgba(139,92,246,0.14) 42%, rgba(99,102,241,0) 78%)",
    floorGlow: "radial-gradient(ellipse at center, rgba(99,102,241,0.16) 0%, transparent 72%)",
    blockGlow: "rgba(139,92,246,0.18)",
    atmosphere: [
      { size: 5, x: "18%", y: "24%", color: "#6366f1", opacity: 0.42, delay: "0.7s" },
      { size: 4, x: "80%", y: "32%", color: "#8b5cf6", opacity: 0.38, delay: "1.6s" },
      { size: 3, x: "70%", y: "60%", color: "#a5b4fc", opacity: 0.32, delay: "1s" },
    ],
  },
};

const CELL_SIZE_MAP = {
  sm: "w-[10px] h-[10px] md:w-[12px] md:h-[12px]",
  md: "w-[14px] h-[14px] md:w-[18px] md:h-[18px] lg:w-[20px] lg:h-[20px]",
  lg: "w-[18px] h-[18px] md:w-[22px] md:h-[22px] lg:w-[28px] lg:h-[28px]",
} as const;

function getGlow(color: string, baseGlow: string): string {
  const isDark = color === "#0a0a0a" || color === "#171717";
  if (isDark) {
    return "inset -2px -2px 0 rgba(0,0,0,0.2), inset 2px 2px 0 rgba(255,255,255,0.06)";
  }
  return `0 0 18px ${baseGlow}, inset -2px -2px 0 rgba(0,0,0,0.12), inset 2px 2px 0 rgba(255,255,255,0.14)`;
}

export function CompanionVoxel({
  preset,
  size = "md",
  className,
}: {
  preset: CompanionVoxelPresetId;
  size?: keyof typeof CELL_SIZE_MAP;
  className?: string;
}) {
  const config = PRESETS[preset];
  const rows = config.grid;
  const cols = Math.max(...rows.map((row) => row.length));
  const cellClass = CELL_SIZE_MAP[size];

  return (
    <div className={cn("relative flex flex-col items-center", className)}>
      <div
        className="absolute inset-x-[12%] top-[8%] bottom-[18%] rounded-full blur-2xl"
        style={{ background: config.aura }}
      />

      {config.atmosphere.map((dot, index) => (
        <span
          key={`${preset}-${index}`}
          className="absolute rounded-full animate-float"
          style={{
            width: dot.size,
            height: dot.size,
            left: dot.x,
            top: dot.y,
            backgroundColor: dot.color,
            opacity: dot.opacity ?? 0.5,
            animationDelay: dot.delay,
            animationDuration: dot.duration ?? "6s",
            boxShadow: `0 0 14px ${dot.color}`,
          }}
        />
      ))}

      <div
        className="relative z-10 grid gap-[2px] md:gap-[3px] voxel-avatar"
        style={{
          gridTemplateColumns: `repeat(${cols}, auto)`,
          gridTemplateRows: `repeat(${rows.length}, auto)`,
        }}
      >
        {rows.flatMap((row, rowIndex) =>
          Array.from({ length: cols }).map((_, colIndex) => {
            const token = row[colIndex] ?? "_";
            const color = token === "_" ? undefined : config.colors[token];
            return (
              <div
                key={`${preset}-${rowIndex}-${colIndex}`}
                className={cn(cellClass, "rounded-[3px] transition-transform duration-500")}
                style={{
                  backgroundColor: color ?? "transparent",
                  boxShadow: color ? getGlow(color, config.blockGlow) : undefined,
                }}
              />
            );
          })
        )}
      </div>

      <div
        className="relative z-10 mt-4 h-3 w-28 rounded-full opacity-30"
        style={{ background: config.floorGlow }}
      />
    </div>
  );
}

export type { CompanionVoxelPresetId };
