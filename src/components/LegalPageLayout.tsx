import Link from "next/link";

interface LegalPageLayoutProps {
  title: string;
  updatedAt: string;
  children: React.ReactNode;
}

export function LegalPageLayout({
  title,
  updatedAt,
  children,
}: LegalPageLayoutProps) {
  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-[#e5e5e5] bg-white/90 shadow-[0_1px_3px_rgba(0,0,0,0.05)] backdrop-blur-md">
        <nav className="flex w-full max-w-full items-center justify-between px-5 py-4 md:px-10">
          <Link
            href="/"
            className="font-mono text-[13px] font-bold uppercase tracking-[0.15em] text-[#0a0a0a]"
          >
            ATOMICSYNC
          </Link>
          <Link
            href="/"
            className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#737373] transition-colors duration-200 ease-in-out hover:text-[#0a0a0a]"
          >
            &larr; Back to Home
          </Link>
        </nav>
      </header>

      <main className="bg-[#fafafa] px-5 py-16 md:py-24">
        <article className="mx-auto max-w-[800px]">
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#737373]">
            [ LEGAL ]
          </p>

          <h1 className="mt-4 font-sans text-[clamp(32px,5vw,48px)] font-bold leading-[1.1] tracking-[-0.02em] text-[#0a0a0a]">
            {title}
          </h1>

          <div className="mt-6 h-px w-[80px] bg-[#0a0a0a]" />

          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.08em] text-[#737373]">
            Last Updated: {updatedAt}
          </p>

          {children}
        </article>
      </main>
    </>
  );
}
