import { cn } from "@/lib/utils";

interface Feature {
  number: string;
  title: string;
  description: string;
  progress: number;
  icon: React.ReactNode;
}

function HeartIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <rect x="8" y="12" width="10" height="10" fill="#00ff88" />
      <rect x="22" y="12" width="10" height="10" fill="#00ff88" />
      <rect x="5" y="15" width="30" height="10" rx="2" fill="#0a0a0a" />
      <rect x="12" y="22" width="16" height="8" fill="#0a0a0a" />
      <rect x="16" y="28" width="8" height="6" fill="#0a0a0a" />
    </svg>
  );
}

function AvatarIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="14" r="8" fill="#0a0a0a" />
      <circle cx="20" cy="14" r="4" fill="#00ff88" />
      <path d="M8 36 C8 26 32 26 32 36" fill="#0a0a0a" />
    </svg>
  );
}

function ChecklistIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <rect x="6" y="6" width="28" height="28" rx="4" stroke="#0a0a0a" strokeWidth="2" fill="none" />
      <rect x="12" y="12" width="6" height="6" fill="#00ff88" />
      <rect x="12" y="22" width="6" height="6" fill="#00ff88" />
      <line x1="22" y1="15" x2="30" y2="15" stroke="#0a0a0a" strokeWidth="2" />
      <line x1="22" y1="25" x2="30" y2="25" stroke="#0a0a0a" strokeWidth="2" />
    </svg>
  );
}

function DropletIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <path d="M20 4 L30 22 A10 10 0 1 1 10 22 Z" fill="#00ff88" />
      <circle cx="20" cy="24" r="4" fill="#0a0a0a" />
    </svg>
  );
}

function BalanceIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <rect x="18" y="8" width="4" height="24" fill="#0a0a0a" />
      <rect x="6" y="8" width="28" height="4" rx="2" fill="#0a0a0a" />
      <circle cx="10" cy="20" r="5" fill="#00ff88" />
      <circle cx="30" cy="20" r="5" stroke="#0a0a0a" strokeWidth="2" fill="none" />
    </svg>
  );
}

function CloudIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <rect x="6" y="16" width="28" height="12" rx="6" fill="#0a0a0a" />
      <circle cx="14" cy="16" r="6" fill="#0a0a0a" />
      <circle cx="24" cy="12" r="8" fill="#0a0a0a" />
      <rect x="14" y="22" width="4" height="6" fill="#00ff88" />
      <rect x="22" y="22" width="4" height="6" fill="#00ff88" />
    </svg>
  );
}

const features: Feature[] = [
  {
    number: "01.",
    title: "APPLE HEALTHKIT",
    description:
      "Seamless integration with 20+ health metrics. Steps, heart rate, blood oxygen, sleep, workouts \u2014 all synced automatically.",
    progress: 95,
    icon: <HeartIcon />,
  },
  {
    number: "02.",
    title: "AVATAR EVOLUTION",
    description:
      "Your AI companion changes with your health. Sleep well and it glows with energy. Push through a workout and it stands taller. Skip rest and it shows fatigue. Real health, visible.",
    progress: 80,
    icon: <AvatarIcon />,
  },
  {
    number: "03.",
    title: "DAILY HABITS",
    description:
      "Track hygiene routines, meals, activities, and custom weekly habits. Build streaks that fuel your avatar\u2019s growth.",
    progress: 70,
    icon: <ChecklistIcon />,
  },
  {
    number: "04.",
    title: "WATER TRACKING",
    description:
      "Intelligent hydration reminders with configurable time windows. Never miss your daily water goals.",
    progress: 60,
    icon: <DropletIcon />,
  },
  {
    number: "05.",
    title: "WORK-LIFE BALANCE",
    description:
      "Log work sessions with login/logout tracking. Balance productivity with wellness for optimal health scores.",
    progress: 85,
    icon: <BalanceIcon />,
  },
  {
    number: "06.",
    title: "ALWAYS WITH YOU",
    description:
      "Works without internet. Your data is safe on your device and syncs automatically when you\u2019re back online. No data lost, ever.",
    progress: 100,
    icon: <CloudIcon />,
  },
];

function FeatureCard({ feature }: { feature: Feature }) {
  return (
    <div className={cn("flex flex-col card-hover p-6 -m-6 rounded-xl", "max-md:items-center max-md:text-center")}>
      {/* Number */}
      <span
        className="font-mono text-[10px] text-[#a3a3a3]"
      >
        {feature.number}
      </span>

      {/* Progress bar */}
      <div className="mt-2 mb-5 h-[2px] w-full bg-[#f0f0f0]">
        <div
          className="h-full bg-[#0a0a0a]"
          style={{ width: `${feature.progress}%` }}
        />
      </div>

      {/* Icon */}
      <div className="flex h-10 w-10 items-center justify-center max-md:mx-auto">
        {feature.icon}
      </div>

      {/* Title */}
      <h3
        className={cn(
          "mt-4 font-sans text-lg font-semibold uppercase text-[#0a0a0a]",
          "tracking-normal"
        )}
      >
        {feature.title}
      </h3>

      {/* Description */}
      <p
        className={cn(
          "mt-2 max-w-[320px] font-serif text-sm font-normal leading-[1.7] text-[#737373]",
          "max-md:mx-auto"
        )}
        style={{ fontFamily: "'Bitter', serif" }}
      >
        {feature.description}
      </p>
    </div>
  );
}

export function FeaturesSection() {
  return (
    <section
      id="features"
      className={cn(
        "bg-[#fafafa]",
        "px-10 py-[120px]",
        "max-md:px-5 max-md:py-20"
      )}
    >
      <div className="mx-auto max-w-[1200px]">
        {/* Eyebrow */}
        <span
          className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#737373]"
        >
          [ CORE FEATURES ]
        </span>

        {/* Heading */}
        <h2
          className={cn(
            "mt-4 font-sans text-5xl font-bold leading-[1.1] tracking-[-0.02em] text-[#0a0a0a]",
            "max-md:text-[32px]"
          )}
        >
          Your health data, brought to life.
        </h2>

        {/* Divider */}
        <div className="mt-6 h-px max-w-[80px] bg-[#0a0a0a]" />

        {/* Features grid */}
        <div
          className={cn(
            "mt-16 grid gap-12",
            "grid-cols-3",
            "max-lg:grid-cols-2 max-lg:gap-8",
            "max-md:grid-cols-1 max-md:gap-10"
          )}
        >
          {features.map((feature) => (
            <FeatureCard key={feature.number} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
