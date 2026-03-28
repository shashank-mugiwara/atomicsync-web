import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Evolution", href: "#evolution" },
  { label: "How It Works", href: "#how-it-works" },
] as const;

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
] as const;

const socialLinks = [
  { label: "GITHUB", href: "https://github.com" },
  { label: "APP STORE", href: "https://apps.apple.com" },
] as const;

export function Footer() {
  return (
    <footer
      className={cn(
        "relative px-5 pt-14 pb-6 md:px-10 md:pt-[72px] md:pb-[30px]",
        "bg-[#0a0a0a] text-[#fafafa]"
      )}
    >
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px section-divider-glow" />
      <div className="mx-auto max-w-[1200px]">
        {/* Top section — 3 columns */}
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          {/* Column 1 — Brand */}
          <div>
            <p className="font-mono font-bold text-[13px] tracking-[0.15em] text-[#fafafa]">
              ATOMICSYNC
            </p>
            <p className="mt-2 font-serif italic text-[14px] text-[#737373]">
              Gamified health tracking
            </p>
            <p className="mt-1 font-mono text-[10px] text-[#525252]">
              for iOS
            </p>
          </div>

          {/* Column 2 — Links */}
          <div>
            <p className="font-mono uppercase text-[10px] tracking-[0.1em] text-[#525252]">
              NAVIGATE
            </p>
            <nav className="mt-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="font-mono text-[12px] text-[#737373] transition-all duration-300 hover:text-[#00ff88] hover:tracking-[0.04em]"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Column 3 — Legal */}
          <div>
            <p className="font-mono uppercase text-[10px] tracking-[0.1em] text-[#525252]">
              LEGAL
            </p>
            <nav className="mt-4 flex flex-col gap-3">
              {legalLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="font-mono text-[12px] text-[#737373] transition-all duration-300 hover:text-[#00ff88] hover:tracking-[0.04em]"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <p className="mt-4 font-mono text-[10px] text-[#525252]">
              Made for iPhone + Apple Watch
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col gap-4 border-t border-[#262626] pt-6 md:flex-row md:items-center md:justify-between">
          <p className="font-mono text-[10px] text-[#525252]">
            &copy; 2026 ATOMICSYNC
          </p>
          <div className="flex gap-6">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono uppercase text-[10px] text-[#525252] transition-colors duration-200 hover:text-[#fafafa]"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
