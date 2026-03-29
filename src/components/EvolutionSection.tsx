"use client";

import { cn } from "@/lib/utils";
import { CompanionVoxel } from "@/components/CompanionVoxel";

interface EvolutionStage {
  name: string;
  levelRange: string;
  description: string;
  dotColor: string;
  nameColor: string;
  avatar: React.ReactNode;
}

const stages: EvolutionStage[] = [
  {
    name: "BEGINNER",
    levelRange: "LEVELS 1-5",
    description:
      "Your journey begins. Your avatar wakes up with you, learning your rhythm. Every small step counts.",
    dotColor: "#525252",
    nameColor: "#666",
    avatar: <CompanionVoxel preset="beginner" size="sm" className="min-h-[150px] justify-center" />,
  },
  {
    name: "ACTIVE",
    levelRange: "LEVELS 6-15",
    description:
      "Your companion starts to shine. Consistent health choices unlock new looks and expressions.",
    dotColor: "#6366f1",
    nameColor: "#6366f1",
    avatar: <CompanionVoxel preset="active-stage" size="sm" className="min-h-[150px] justify-center" />,
  },
  {
    name: "ATHLETE",
    levelRange: "LEVELS 16-30",
    description:
      "Your avatar radiates confidence. It reflects the dedication you\u2019ve built \u2014 and everyone can see it.",
    dotColor: "#00ff88",
    nameColor: "#00ff88",
    avatar: <CompanionVoxel preset="athlete" size="sm" className="min-h-[150px] justify-center" />,
  },
  {
    name: "CHAMPION",
    levelRange: "LEVELS 31+",
    description:
      "Legendary. Your avatar is a masterpiece \u2014 a living reflection of your commitment to health.",
    dotColor: "#fafafa",
    nameColor: "#fafafa",
    avatar: <CompanionVoxel preset="champion" size="sm" className="min-h-[150px] justify-center" />,
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
                  className="card-hover-glow group w-full max-w-[280px] rounded-xl border text-center"
                  style={{
                    backgroundColor: "#141414",
                    borderColor: "#262626",
                    padding: "32px 24px",
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
