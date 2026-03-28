"use client";

import { cn } from "@/lib/utils";
import { ParticleField } from "@/components/ParticleField";

interface EvolutionStage {
  name: string;
  levelRange: string;
  description: string;
  dotColor: string;
  nameColor: string;
  avatar: React.ReactNode;
}

function BeginnerAvatar() {
  const grid = [
    "___XX___",
    "___XX___",
    "__XXXX__",
    "___XX___",
    "___XX___",
    "__X__X__",
  ];
  return (
    <div className="flex flex-col items-center justify-end" style={{ width: 120, height: 140 }}>
      {grid.map((row, ri) => (
        <div key={ri} className="flex">
          {row.split("").map((cell, ci) => (
            <div
              key={ci}
              style={{
                width: 8,
                height: 8,
                backgroundColor: cell === "X" ? "#666" : "transparent",
                borderRadius: 1,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function ActiveAvatar() {
  const grid = [
    "___XXX___",
    "___XXX___",
    "__XXXXX__",
    "__XXXXX__",
    "____X____",
    "___XXX___",
    "___XXX___",
    "__XX_XX__",
    "__X___X__",
  ];
  const headRows = 2;
  return (
    <div className="flex flex-col items-center justify-end" style={{ width: 120, height: 140 }}>
      {grid.map((row, ri) => (
        <div key={ri} className="flex">
          {row.split("").map((cell, ci) => (
            <div
              key={ci}
              style={{
                width: 8,
                height: 8,
                backgroundColor:
                  cell === "X"
                    ? ri < headRows
                      ? "#6366f1"
                      : "#888"
                    : "transparent",
                borderRadius: 1,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function AthleteAvatar() {
  const grid = [
    "____XXX____",
    "___XXXXX___",
    "___XXXXX___",
    "__XXXXXXX__",
    "___XXXXX___",
    "____XXX____",
    "___XXXXX___",
    "__XXXXXXX__",
    "__XXXXXXX__",
    "___XXXXX___",
    "__XX___XX__",
    "__XX___XX__",
    "_XX_____XX_",
  ];
  const headRows = 3;
  const bodyStart = 5;
  return (
    <div className="flex flex-col items-center justify-end" style={{ width: 120, height: 140 }}>
      {grid.map((row, ri) => (
        <div key={ri} className="flex">
          {row.split("").map((cell, ci) => (
            <div
              key={ci}
              style={{
                width: 8,
                height: 8,
                backgroundColor:
                  cell === "X"
                    ? ri < headRows
                      ? "#00ff88"
                      : ri < bodyStart
                        ? "#6366f1"
                        : "#4f46e5"
                    : "transparent",
                borderRadius: 1,
                boxShadow:
                  cell === "X" && ri < headRows
                    ? "0 0 4px rgba(0,255,136,0.4)"
                    : "none",
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function ChampionAvatar() {
  const grid = [
    "_____X_____",
    "____XXX____",
    "___XXXXX___",
    "___XXXXX___",
    "____XXX____",
    "___XXXXX___",
    "__XXXXXXX__",
    "_XXXXXXXXX_",
    "__XXXXXXX__",
    "___XXXXX___",
    "___XXXXX___",
    "__XXX_XXX__",
    "__XX___XX__",
    "_XXX___XXX_",
  ];
  const crownRows = 1;
  const headRows = 4;
  const bodyStart = 6;
  return (
    <div className="flex flex-col items-center justify-end" style={{ width: 120, height: 140 }}>
      {grid.map((row, ri) => (
        <div key={ri} className="flex">
          {row.split("").map((cell, ci) => (
            <div
              key={ci}
              style={{
                width: 8,
                height: 8,
                backgroundColor:
                  cell === "X"
                    ? ri < crownRows
                      ? "#fbbf24"
                      : ri < headRows
                        ? "#fafafa"
                        : ri < bodyStart
                          ? "#00ff88"
                          : "#6366f1"
                    : "transparent",
                borderRadius: 1,
                boxShadow:
                  cell === "X"
                    ? ri < crownRows
                      ? "0 0 6px rgba(251,191,36,0.6)"
                      : ri < headRows
                        ? "0 0 4px rgba(250,250,250,0.3)"
                        : ri < bodyStart
                          ? "0 0 6px rgba(0,255,136,0.5)"
                          : "0 0 4px rgba(99,102,241,0.4)"
                    : "none",
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

const stages: EvolutionStage[] = [
  {
    name: "BEGINNER",
    levelRange: "LEVELS 1-5",
    description:
      "Your journey begins. Your avatar wakes up with you, learning your rhythm. Every small step counts.",
    dotColor: "#525252",
    nameColor: "#666",
    avatar: <BeginnerAvatar />,
  },
  {
    name: "ACTIVE",
    levelRange: "LEVELS 6-15",
    description:
      "Your companion starts to shine. Consistent health choices unlock new looks and expressions.",
    dotColor: "#6366f1",
    nameColor: "#6366f1",
    avatar: <ActiveAvatar />,
  },
  {
    name: "ATHLETE",
    levelRange: "LEVELS 16-30",
    description:
      "Your avatar radiates confidence. It reflects the dedication you\u2019ve built \u2014 and everyone can see it.",
    dotColor: "#00ff88",
    nameColor: "#00ff88",
    avatar: <AthleteAvatar />,
  },
  {
    name: "CHAMPION",
    levelRange: "LEVELS 31+",
    description:
      "Legendary. Your avatar is a masterpiece \u2014 a living reflection of your commitment to health.",
    dotColor: "#fafafa",
    nameColor: "#fafafa",
    avatar: <ChampionAvatar />,
  },
];

export function EvolutionSection() {
  return (
    <section
      id="evolution"
      className="relative overflow-hidden"
      style={{
        backgroundColor: "#0a0a0a",
        color: "#fafafa",
      }}
    >
      {/* Particle field background */}
      <ParticleField
        className="z-0"
        particleCount={600}
        color="255, 255, 255"
        maxSize={1.8}
        speed={0.2}
        clustered={true}
      />

      {/* Crosshair decoration top-right */}
      <div
        className="pointer-events-none absolute"
        style={{ top: 60, right: 80 }}
      >
        {/* Vertical bar */}
        <div
          style={{
            position: "absolute",
            width: 1,
            height: 120,
            backgroundColor: "#ffffff10",
            left: "50%",
            top: -60,
            transform: "translateX(-50%)",
          }}
        />
        {/* Horizontal bar */}
        <div
          style={{
            position: "absolute",
            width: 120,
            height: 1,
            backgroundColor: "#ffffff10",
            top: "50%",
            left: -60,
            transform: "translateY(-50%)",
          }}
        />
      </div>

      <div
        className={cn(
          "relative z-10 mx-auto max-w-[1280px]",
          "px-5 py-20",
          "lg:px-10 lg:py-[120px]"
        )}
      >
        {/* Section header */}
        <div className="text-center">
          <p
            className="font-mono uppercase"
            style={{
              fontSize: 10,
              letterSpacing: "0.15em",
              color: "#737373",
            }}
          >
            [ AVATAR EVOLUTION ]
          </p>
          <h2
            className="mt-4 font-sans font-bold"
            style={{
              fontSize: "clamp(32px, 5vw, 48px)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: "#fafafa",
            }}
          >
            From beginner to champion.
          </h2>
          <p
            className="mx-auto mt-4 italic"
            style={{
              fontFamily: "'Bitter', Georgia, serif",
              fontSize: 16,
              color: "#737373",
              maxWidth: 500,
            }}
          >
            Every healthy choice transforms your companion. The more you move,
            sleep, and recover — the more your avatar evolves.
          </p>
        </div>

        {/* Evolution timeline */}
        <div className="relative mt-20">
          {/* Desktop connecting line */}
          <div
            className="pointer-events-none absolute hidden lg:block"
            style={{
              top: 6,
              left: "12.5%",
              right: "12.5%",
              height: 1,
              backgroundColor: "#333",
            }}
          />

          {/* Mobile / tablet connecting line */}
          <div
            className="pointer-events-none absolute lg:hidden"
            style={{
              top: 0,
              bottom: 0,
              left: "50%",
              width: 1,
              backgroundColor: "#333",
              transform: "translateX(-50%)",
            }}
          />

          {/* Stage cards */}
          <div
            className={cn(
              "relative z-10",
              "flex flex-col items-center gap-10",
              "md:grid md:grid-cols-2 md:gap-10",
              "lg:flex lg:flex-row lg:items-start lg:justify-center lg:gap-0"
            )}
          >
            {stages.map((stage, i) => (
              <div
                key={stage.name}
                className={cn(
                  "flex flex-col items-center",
                  "lg:flex-1"
                )}
              >
                {/* Stage dot */}
                <div
                  className="relative z-20 mb-6 rounded-full"
                  style={{
                    width: 12,
                    height: 12,
                    backgroundColor: stage.dotColor,
                    boxShadow:
                      i >= 2
                        ? `0 0 8px ${stage.dotColor}66`
                        : "none",
                  }}
                />

                {/* Card */}
                <div
                  className="group w-full max-w-[280px] rounded-xl border text-center transition-all duration-300"
                  style={{
                    backgroundColor: "#141414",
                    borderColor: "#262626",
                    padding: "32px 24px",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget;
                    el.style.borderColor = "#00ff88";
                    el.style.boxShadow =
                      "0 0 30px rgba(0,255,136,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget;
                    el.style.borderColor = "#262626";
                    el.style.boxShadow = "none";
                  }}
                >
                  {/* Avatar */}
                  <div className="flex items-center justify-center">
                    {stage.avatar}
                  </div>

                  {/* Stage name */}
                  <p
                    className="mt-5 font-mono uppercase"
                    style={{
                      fontSize: 12,
                      letterSpacing: "0.1em",
                      color: stage.nameColor,
                    }}
                  >
                    {stage.name}
                  </p>

                  {/* Level range */}
                  <p
                    className="mt-1 font-mono uppercase"
                    style={{
                      fontSize: 10,
                      color: "#525252",
                    }}
                  >
                    {stage.levelRange}
                  </p>

                  {/* Description */}
                  <p
                    className="mt-3"
                    style={{
                      fontFamily: "'Bitter', Georgia, serif",
                      fontSize: 13,
                      lineHeight: 1.6,
                      color: "#737373",
                    }}
                  >
                    {stage.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* XP formula callout */}
        <div className="mt-12 flex justify-center">
          <code
            className="font-mono"
            style={{
              fontSize: 12,
              color: "#525252",
              backgroundColor: "#141414",
              border: "1px solid #262626",
              padding: "12px 24px",
              borderRadius: 8,
              display: "inline-block",
            }}
          >
            XP_THRESHOLD = BASE_XP * (1.5 ^ LEVEL)
          </code>
        </div>
      </div>
    </section>
  );
}
