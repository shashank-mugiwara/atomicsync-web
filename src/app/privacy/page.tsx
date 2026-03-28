import Link from "next/link";

export default function PrivacyPage() {
  return (
    <>
      {/* Navbar */}
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
          {/* Eyebrow */}
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#737373]">
            [ LEGAL ]
          </p>

          {/* Title */}
          <h1 className="mt-4 font-sans text-[clamp(32px,5vw,48px)] font-bold leading-[1.1] tracking-[-0.02em] text-[#0a0a0a]">
            Privacy Policy
          </h1>

          {/* Divider */}
          <div className="mt-6 h-px w-[80px] bg-[#0a0a0a]" />

          {/* Last updated */}
          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.08em] text-[#737373]">
            Last Updated: April 1, 2026
          </p>

          {/* Intro */}
          <p className="mt-8 font-serif text-[15px] leading-[1.8] text-[#525252]">
            AtomicSync (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;)
            operates the AtomicSync mobile application. This Privacy Policy
            explains how we collect, use, store, and protect your information
            when you use the App.
          </p>

          {/* Section: What Data We Collect */}
          <section className="mt-14">
            <h2 className="font-sans text-[24px] font-semibold text-[#0a0a0a]">
              What Data We Collect
            </h2>
            <div className="mt-3 h-px w-[40px] bg-[#e5e5e5]" />

            <h3 className="mt-8 font-sans text-[18px] font-semibold text-[#0a0a0a]">
              Personal Information
            </h3>
            <ul className="mt-4 flex flex-col gap-2 font-serif text-[15px] leading-[1.8] text-[#525252]">
              <li className="flex items-start gap-2">
                <span className="mt-[10px] block h-[5px] w-[5px] shrink-0 bg-[#00ff88]" />
                Email address &mdash; account creation and communication
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-[10px] block h-[5px] w-[5px] shrink-0 bg-[#00ff88]" />
                Display name &mdash; in-app personalization
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-[10px] block h-[5px] w-[5px] shrink-0 bg-[#00ff88]" />
                Profile photo (optional) &mdash; uploaded by you
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-[10px] block h-[5px] w-[5px] shrink-0 bg-[#00ff88]" />
                Authentication credentials &mdash; managed via Firebase
              </li>
            </ul>

            <h3 className="mt-10 font-sans text-[18px] font-semibold text-[#0a0a0a]">
              Health Data (Apple HealthKit)
            </h3>
            <p className="mt-3 font-serif text-[15px] leading-[1.8] text-[#525252]">
              We collect health data through Apple HealthKit with your explicit
              permission. All HealthKit data usage complies with Apple App Store
              Review Guidelines Section 5.1.3.
            </p>

            {/* HealthKit table — iPhone */}
            <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.1em] text-[#737373]">
              From iPhone (no Apple Watch required)
            </p>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-[#e5e5e5]">
                    <th className="py-3 pr-4 font-mono text-[10px] uppercase tracking-[0.1em] text-[#737373]">
                      Data Type
                    </th>
                    <th className="py-3 pr-4 font-mono text-[10px] uppercase tracking-[0.1em] text-[#737373]">
                      Purpose
                    </th>
                  </tr>
                </thead>
                <tbody className="font-serif text-[14px] text-[#525252]">
                  <tr className="border-b border-[#f0f0f0]">
                    <td className="py-3 pr-4">Step Count</td>
                    <td className="py-3">
                      Avatar posture, energy level, XP calculation
                    </td>
                  </tr>
                  <tr className="border-b border-[#f0f0f0]">
                    <td className="py-3 pr-4">Walking + Running Distance</td>
                    <td className="py-3">Avatar environment, exploration XP</td>
                  </tr>
                  <tr className="border-b border-[#f0f0f0]">
                    <td className="py-3 pr-4">Flights Climbed</td>
                    <td className="py-3">
                      Avatar strength attributes, XP bonus
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* HealthKit table — Apple Watch */}
            <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.1em] text-[#737373]">
              From Apple Watch (optional, enhanced experience)
            </p>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-[#e5e5e5]">
                    <th className="py-3 pr-4 font-mono text-[10px] uppercase tracking-[0.1em] text-[#737373]">
                      Data Type
                    </th>
                    <th className="py-3 pr-4 font-mono text-[10px] uppercase tracking-[0.1em] text-[#737373]">
                      Purpose
                    </th>
                  </tr>
                </thead>
                <tbody className="font-serif text-[14px] text-[#525252]">
                  <tr className="border-b border-[#f0f0f0]">
                    <td className="py-3 pr-4">Heart Rate (avg/min/max)</td>
                    <td className="py-3">Avatar glow intensity, aura color</td>
                  </tr>
                  <tr className="border-b border-[#f0f0f0]">
                    <td className="py-3 pr-4">Resting Heart Rate</td>
                    <td className="py-3">
                      Avatar calmness traits, baseline health
                    </td>
                  </tr>
                  <tr className="border-b border-[#f0f0f0]">
                    <td className="py-3 pr-4">
                      Heart Rate Variability (HRV)
                    </td>
                    <td className="py-3">Avatar resilience attributes</td>
                  </tr>
                  <tr className="border-b border-[#f0f0f0]">
                    <td className="py-3 pr-4">Blood Oxygen (SpO2)</td>
                    <td className="py-3">
                      Avatar vitality, skin tone vibrancy
                    </td>
                  </tr>
                  <tr className="border-b border-[#f0f0f0]">
                    <td className="py-3 pr-4">Sleep Analysis</td>
                    <td className="py-3">
                      Avatar rest state, eye appearance
                    </td>
                  </tr>
                  <tr className="border-b border-[#f0f0f0]">
                    <td className="py-3 pr-4">Active Energy Burned</td>
                    <td className="py-3">
                      Avatar flame/energy effects, XP
                    </td>
                  </tr>
                  <tr className="border-b border-[#f0f0f0]">
                    <td className="py-3 pr-4">Exercise Minutes</td>
                    <td className="py-3">
                      Avatar fitness evolution stage
                    </td>
                  </tr>
                  <tr className="border-b border-[#f0f0f0]">
                    <td className="py-3 pr-4">Workout Types &amp; Duration</td>
                    <td className="py-3">
                      Avatar outfit and pose variations
                    </td>
                  </tr>
                  <tr className="border-b border-[#f0f0f0]">
                    <td className="py-3 pr-4">Mindful Minutes</td>
                    <td className="py-3">
                      Avatar serenity attributes, aura
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section: How We Use Your Information */}
          <section className="mt-14">
            <h2 className="font-sans text-[24px] font-semibold text-[#0a0a0a]">
              How We Use Your Information
            </h2>
            <div className="mt-3 h-px w-[40px] bg-[#e5e5e5]" />

            <div className="mt-6 overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-[#e5e5e5]">
                    <th className="py-3 pr-4 font-mono text-[10px] uppercase tracking-[0.1em] text-[#737373]">
                      Purpose
                    </th>
                    <th className="py-3 pr-4 font-mono text-[10px] uppercase tracking-[0.1em] text-[#737373]">
                      Data Used
                    </th>
                  </tr>
                </thead>
                <tbody className="font-serif text-[14px] text-[#525252]">
                  <tr className="border-b border-[#f0f0f0]">
                    <td className="py-3 pr-4">
                      Generate &amp; update your avatar
                    </td>
                    <td className="py-3">Health data, AI preferences</td>
                  </tr>
                  <tr className="border-b border-[#f0f0f0]">
                    <td className="py-3 pr-4">Calculate XP &amp; progression</td>
                    <td className="py-3">Health data, usage data</td>
                  </tr>
                  <tr className="border-b border-[#f0f0f0]">
                    <td className="py-3 pr-4">Process subscription payments</td>
                    <td className="py-3">
                      Subscription status (via Apple)
                    </td>
                  </tr>
                  <tr className="border-b border-[#f0f0f0]">
                    <td className="py-3 pr-4">
                      Diagnose crashes &amp; bugs
                    </td>
                    <td className="py-3">Device data, crash logs</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="mt-6 font-serif text-[15px] font-semibold leading-[1.8] text-[#0a0a0a]">
              We do NOT use your information for:
            </p>
            <ul className="mt-3 flex flex-col gap-2 font-serif text-[15px] leading-[1.8] text-[#525252]">
              <li className="flex items-start gap-2">
                <span className="mt-[10px] block h-[5px] w-[5px] shrink-0 bg-[#0a0a0a]" />
                Targeted advertising
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-[10px] block h-[5px] w-[5px] shrink-0 bg-[#0a0a0a]" />
                Selling to third parties
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-[10px] block h-[5px] w-[5px] shrink-0 bg-[#0a0a0a]" />
                Building marketing profiles
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-[10px] block h-[5px] w-[5px] shrink-0 bg-[#0a0a0a]" />
                Cross-app tracking
              </li>
            </ul>
          </section>

          {/* Section: AI-Generated Content */}
          <section className="mt-14">
            <h2 className="font-sans text-[24px] font-semibold text-[#0a0a0a]">
              AI-Generated Content
            </h2>
            <div className="mt-3 h-px w-[40px] bg-[#e5e5e5]" />

            <p className="mt-6 font-serif text-[15px] leading-[1.8] text-[#525252]">
              AtomicSync uses Stable Diffusion (self-hosted on AWS) to generate
              your avatar. Your health metrics are mapped to visual parameters
              &mdash; colors, poses, energy levels, outfits &mdash; then fed to
              the AI model to create a unique anime-style image.
            </p>

            <div className="mt-6 rounded-xl border border-[#e5e5e5] bg-white p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#737373]">
                Important
              </p>
              <ul className="mt-4 flex flex-col gap-3 font-serif text-[14px] leading-[1.8] text-[#525252]">
                <li className="flex items-start gap-2">
                  <span className="mt-[10px] block h-[5px] w-[5px] shrink-0 bg-[#00ff88]" />
                  Your health data is used for inference only, NOT for training
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-[10px] block h-[5px] w-[5px] shrink-0 bg-[#00ff88]" />
                  All AI-generated images are labeled with an
                  &quot;AI-generated&quot; indicator (SB 942 compliance)
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-[10px] block h-[5px] w-[5px] shrink-0 bg-[#00ff88]" />
                  AI-generated data is treated as your personal information (AB
                  1008 compliance)
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-[10px] block h-[5px] w-[5px] shrink-0 bg-[#00ff88]" />
                  You can opt out at any time &mdash; a static placeholder
                  avatar will be shown instead
                </li>
              </ul>
            </div>
          </section>

          {/* Section: Your Rights (CCPA) */}
          <section className="mt-14">
            <h2 className="font-sans text-[24px] font-semibold text-[#0a0a0a]">
              Your Rights
            </h2>
            <div className="mt-3 h-px w-[40px] bg-[#e5e5e5]" />

            <p className="mt-6 font-serif text-[15px] leading-[1.8] text-[#525252]">
              Regardless of where you live, you have the following rights:
            </p>

            <ul className="mt-4 flex flex-col gap-2 font-serif text-[15px] leading-[1.8] text-[#525252]">
              <li className="flex items-start gap-2">
                <span className="mt-[10px] block h-[5px] w-[5px] shrink-0 bg-[#00ff88]" />
                <span>
                  <strong className="text-[#0a0a0a]">Access</strong> &mdash;
                  request a copy of all personal data we hold
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-[10px] block h-[5px] w-[5px] shrink-0 bg-[#00ff88]" />
                <span>
                  <strong className="text-[#0a0a0a]">Correction</strong> &mdash;
                  request correction of inaccurate data
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-[10px] block h-[5px] w-[5px] shrink-0 bg-[#00ff88]" />
                <span>
                  <strong className="text-[#0a0a0a]">Deletion</strong> &mdash;
                  request deletion of your personal data
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-[10px] block h-[5px] w-[5px] shrink-0 bg-[#00ff88]" />
                <span>
                  <strong className="text-[#0a0a0a]">Portability</strong>{" "}
                  &mdash; export your data in JSON format (in-app)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-[10px] block h-[5px] w-[5px] shrink-0 bg-[#00ff88]" />
                <span>
                  <strong className="text-[#0a0a0a]">Withdraw Consent</strong>{" "}
                  &mdash; revoke HealthKit or AI processing at any time
                </span>
              </li>
            </ul>

            <h3 className="mt-10 font-sans text-[18px] font-semibold text-[#0a0a0a]">
              California Residents (CCPA)
            </h3>
            <p className="mt-3 font-serif text-[15px] leading-[1.8] text-[#525252]">
              If you are a California resident, you have additional rights under
              the California Consumer Privacy Act, including the right to know
              what personal information we collect, the right to delete it, and
              the right to opt out of its sale.{" "}
              <strong className="text-[#0a0a0a]">
                We do not sell your personal information.
              </strong>
            </p>
            <p className="mt-3 font-serif text-[15px] leading-[1.8] text-[#525252]">
              Health data and AI-generated avatar data are classified as
              sensitive personal information under CCPA. All CCPA rights apply
              equally to AI-generated data (AB 1008).
            </p>
          </section>

          {/* Section: Contact */}
          <section className="mt-14">
            <h2 className="font-sans text-[24px] font-semibold text-[#0a0a0a]">
              Contact Us
            </h2>
            <div className="mt-3 h-px w-[40px] bg-[#e5e5e5]" />

            <div className="mt-6 rounded-xl border border-[#e5e5e5] bg-white p-6">
              <p className="font-sans text-[16px] font-semibold text-[#0a0a0a]">
                AtomicSync
              </p>
              <p className="mt-2 font-serif text-[15px] text-[#525252]">
                Email:{" "}
                <a
                  href="mailto:support@breaksignal.com"
                  className="text-[#6366f1] underline transition-colors duration-200 hover:text-[#0a0a0a]"
                >
                  support@breaksignal.com
                </a>
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  "Privacy Rights Request",
                  "CCPA Request",
                  "Health Data Deletion",
                  "Data Breach Inquiry",
                ].map((subject) => (
                  <span
                    key={subject}
                    className="inline-block rounded border border-[#e5e5e5] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-[#737373]"
                  >
                    {subject}
                  </span>
                ))}
              </div>
              <p className="mt-4 font-serif text-[13px] text-[#737373]">
                We respond to all inquiries within 5 business days and fulfill
                data requests within 30 calendar days.
              </p>
            </div>
          </section>

          {/* Bottom nav */}
          <div className="mt-16 flex items-center justify-between border-t border-[#e5e5e5] pt-6">
            <Link
              href="/"
              className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#737373] transition-colors duration-200 hover:text-[#0a0a0a]"
            >
              &larr; Home
            </Link>
            <Link
              href="/terms"
              className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#737373] transition-colors duration-200 hover:text-[#0a0a0a]"
            >
              Terms of Service &rarr;
            </Link>
          </div>
        </article>
      </main>
    </>
  );
}
