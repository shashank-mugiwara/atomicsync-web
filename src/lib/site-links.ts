export const mainNavLinks = [
  { label: "Features", href: "#features" },
  { label: "Evolution", href: "#evolution" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
] as const;

export const footerNavLinks = mainNavLinks.slice(0, 3);

export const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
] as const;

export const socialLinks = [
  { label: "GITHUB", href: "https://github.com" },
  { label: "APP STORE", href: "https://apps.apple.com" },
] as const;
