"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { DataToAvatarCanvas } from "@/components/DataToAvatarCanvas";

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function DataToAvatarSection() {
  const containerRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // IntersectionObserver to gate canvas rendering
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Scroll progress calculation
  const computeProgress = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const containerHeight = el.offsetHeight;
    const viewportHeight = window.innerHeight;
    const scrollableDistance = containerHeight - viewportHeight;

    if (scrollableDistance <= 0) return;

    const scrolled = -rect.top;
    setProgress(clamp(scrolled / scrollableDistance, 0, 1));
  }, []);

  // Initial calculation + scroll listener
  useEffect(() => {
    computeProgress();

    window.addEventListener("scroll", computeProgress, { passive: true });
    return () => window.removeEventListener("scroll", computeProgress);
  }, [computeProgress]);

  const taglineVisible = progress >= 0.7;

  return (
    <section
      ref={containerRef}
      role="presentation"
      className="relative bg-[#0a0a0a]"
      style={{ height: "300vh" }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {isVisible && <DataToAvatarCanvas progress={progress} isActive={isVisible} />}

        <p
          className={cn(
            "absolute left-1/2 -translate-x-1/2 font-sans uppercase tracking-[0.2em] text-[#fafafa] transition-all duration-700",
            taglineVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2.5"
          )}
          style={{
            top: "72%",
            fontSize: "clamp(1.25rem, 2vw, 2rem)",
            textShadow: "0 0 20px rgba(0, 255, 136, 0.3)",
            transitionTimingFunction: "cubic-bezier(.16, 1, .3, 1)",
          }}
        >
          Your data, alive.
        </p>
      </div>
    </section>
  );
}
