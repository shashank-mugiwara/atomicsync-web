"use client";

import { useEffect, useRef, useState } from "react";

interface Stat {
  value: string;
  label: string;
  suffix?: string;
}

const stats: Stat[] = [
  { value: "20", suffix: "+", label: "HEALTH METRICS" },
  { value: "4", label: "EVOLUTION STAGES" },
  { value: "AI", label: "GENERATED AVATARS" },
  { value: "FREE", label: "TO GET STARTED" },
];

function AnimatedNumber({ value, suffix }: { value: string; suffix?: string }) {
  const isNumeric = !isNaN(parseFloat(value));
  const [displayed, setDisplayed] = useState(isNumeric ? "0" : value);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !isNumeric) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const target = parseFloat(value);
          const isFloat = value.includes(".");
          const duration = 1200;
          const startTime = performance.now();

          function animate(now: number) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = target * eased;
            setDisplayed(isFloat ? current.toFixed(1) : Math.floor(current).toString());
            if (progress < 1) requestAnimationFrame(animate);
          }
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value, isNumeric]);

  return (
    <div ref={ref} className="font-sans text-[56px] font-bold leading-none tracking-[-0.03em] text-[#0a0a0a] md:text-[72px]">
      {displayed}
      {suffix && <span className="text-[#00ff88]">{suffix}</span>}
    </div>
  );
}

export function StatsSection() {
  return (
    <section className="border-y border-[#e5e5e5] bg-[#fafafa] px-5 py-16 md:px-10 md:py-24">
      <div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-10 md:grid-cols-4 md:gap-8">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <AnimatedNumber value={stat.value} suffix={stat.suffix} />
            <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.12em] text-[#737373]">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
