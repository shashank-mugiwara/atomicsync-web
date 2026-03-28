"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Evolution", href: "#evolution" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 50);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 ease-in-out",
        scrolled
          ? "border-b border-[#e5e5e5] bg-white/90 shadow-[0_1px_3px_rgba(0,0,0,0.05)] backdrop-blur-md"
          : "bg-transparent"
      )}
    >
      <nav className="flex w-full max-w-full items-center justify-between px-5 py-4 md:px-10">
        {/* Logo */}
        <a
          href="/"
          className="font-mono text-[13px] font-bold uppercase tracking-[0.15em] text-[#0a0a0a]"
        >
          ATOMICSYNC
        </a>

        {/* Desktop navigation links */}
        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#737373] transition-colors duration-200 ease-in-out hover:text-[#0a0a0a]"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Right side: CTA + mobile hamburger */}
        <div className="flex items-center gap-4">
          {/* CTA button (always visible) */}
          <a
            href="#download"
            className="hidden font-mono text-[11px] uppercase border border-[#0a0a0a] px-5 py-2 text-[#0a0a0a] transition-all duration-200 ease-in-out hover:bg-[#0a0a0a] hover:text-[#fafafa] md:inline-block"
          >
            DOWNLOAD
          </a>

          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            className="flex flex-col items-center justify-center gap-[5px] md:hidden"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            <span
              className={cn(
                "block h-[1.5px] w-5 bg-[#0a0a0a] transition-all duration-200",
                mobileMenuOpen && "translate-y-[6.5px] rotate-45"
              )}
            />
            <span
              className={cn(
                "block h-[1.5px] w-5 bg-[#0a0a0a] transition-all duration-200",
                mobileMenuOpen && "opacity-0"
              )}
            />
            <span
              className={cn(
                "block h-[1.5px] w-5 bg-[#0a0a0a] transition-all duration-200",
                mobileMenuOpen && "-translate-y-[6.5px] -rotate-45"
              )}
            />
          </button>
        </div>
      </nav>

      {/* Mobile menu panel */}
      <div
        className={cn(
          "overflow-hidden border-b border-[#e5e5e5] bg-white transition-all duration-300 ease-in-out md:hidden",
          mobileMenuOpen ? "max-h-64 opacity-100" : "max-h-0 border-b-0 opacity-0"
        )}
      >
        <div className="flex flex-col gap-4 px-5 py-5">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#737373] transition-colors duration-200 ease-in-out hover:text-[#0a0a0a]"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#download"
            className="inline-block self-start font-mono text-[11px] uppercase border border-[#0a0a0a] px-5 py-2 text-[#0a0a0a] transition-all duration-200 ease-in-out hover:bg-[#0a0a0a] hover:text-[#fafafa]"
            onClick={() => setMobileMenuOpen(false)}
          >
            DOWNLOAD
          </a>
        </div>
      </div>
    </header>
  );
}
