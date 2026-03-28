import Link from "next/link";
import { LegalPageLayout } from "@/components/LegalPageLayout";

export default function TermsPage() {
  return (
    <LegalPageLayout title="Terms of Service" updatedAt="April 1, 2026">
          {/* Intro */}
          <p className="mt-8 font-serif text-[15px] leading-[1.8] text-[#525252]">
            Please read these Terms of Service carefully before using the
            AtomicSync mobile application. By downloading, installing, or using
            the App, you agree to be bound by these Terms.
          </p>

          {/* Section: Description of Service */}
          <section className="mt-14">
            <h2 className="font-sans text-[24px] font-semibold text-[#0a0a0a]">
              Description of Service
            </h2>
            <div className="mt-3 h-px w-[40px] bg-[#e5e5e5]" />

            <p className="mt-6 font-serif text-[15px] leading-[1.8] text-[#525252]">
              AtomicSync is a gamified health-tracking iOS application that:
            </p>
            <ul className="mt-4 flex flex-col gap-2 font-serif text-[15px] leading-[1.8] text-[#525252]">
              <li className="flex items-start gap-2">
                <span className="mt-[10px] block h-[5px] w-[5px] shrink-0 bg-[#00ff88]" />
                Reads health and fitness data from Apple HealthKit (with your
                permission)
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-[10px] block h-[5px] w-[5px] shrink-0 bg-[#00ff88]" />
                Calculates experience points (XP) based on your health
                activities
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-[10px] block h-[5px] w-[5px] shrink-0 bg-[#00ff88]" />
                Uses AI to generate a personalized anime-style avatar that
                evolves based on your health data
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-[10px] block h-[5px] w-[5px] shrink-0 bg-[#00ff88]" />
                Offers avatar evolution through four stages: Beginner, Active,
                Athlete, and Champion
              </li>
            </ul>
            <p className="mt-4 font-serif text-[15px] leading-[1.8] text-[#525252]">
              The App requires an iPhone running iOS 17 or later. An Apple Watch
              is recommended but not required.
            </p>
          </section>

          {/* Section: Subscription Terms */}
          <section className="mt-14">
            <h2 className="font-sans text-[24px] font-semibold text-[#0a0a0a]">
              Subscription Terms
            </h2>
            <div className="mt-3 h-px w-[40px] bg-[#e5e5e5]" />

            <div className="mt-6 overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-[#e5e5e5]">
                    <th className="py-3 pr-4 font-mono text-[10px] uppercase tracking-[0.1em] text-[#737373]">
                      Plan
                    </th>
                    <th className="py-3 pr-4 font-mono text-[10px] uppercase tracking-[0.1em] text-[#737373]">
                      Price
                    </th>
                    <th className="py-3 font-mono text-[10px] uppercase tracking-[0.1em] text-[#737373]">
                      Features
                    </th>
                  </tr>
                </thead>
                <tbody className="font-serif text-[14px] text-[#525252]">
                  <tr className="border-b border-[#f0f0f0]">
                    <td className="py-3 pr-4 font-sans font-semibold text-[#0a0a0a]">
                      Free
                    </td>
                    <td className="py-3 pr-4">$0</td>
                    <td className="py-3">
                      Basic health tracking, limited avatar evolution, manual
                      habit tracking
                    </td>
                  </tr>
                  <tr className="border-b border-[#f0f0f0]">
                    <td className="py-3 pr-4 font-sans font-semibold text-[#0a0a0a]">
                      Pro Monthly
                    </td>
                    <td className="py-3 pr-4">$7.99/mo</td>
                    <td className="py-3">
                      Full AI avatar generation, all health data types, unlimited
                      evolution, priority generation
                    </td>
                  </tr>
                  <tr className="border-b border-[#f0f0f0]">
                    <td className="py-3 pr-4 font-sans font-semibold text-[#0a0a0a]">
                      Pro Annual
                    </td>
                    <td className="py-3 pr-4">$49.99/yr</td>
                    <td className="py-3">
                      All Pro features at a discounted annual rate
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 rounded-xl border border-[#e5e5e5] bg-white p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#737373]">
                Auto-Renewal &amp; Cancellation
              </p>
              <ul className="mt-4 flex flex-col gap-2 font-serif text-[14px] leading-[1.8] text-[#525252]">
                <li className="flex items-start gap-2">
                  <span className="mt-[10px] block h-[5px] w-[5px] shrink-0 bg-[#0a0a0a]" />
                  Pro subscriptions auto-renew unless cancelled 24 hours before
                  the current period ends
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-[10px] block h-[5px] w-[5px] shrink-0 bg-[#0a0a0a]" />
                  Cancel anytime via iPhone Settings &gt; Apple ID &gt;
                  Subscriptions
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-[10px] block h-[5px] w-[5px] shrink-0 bg-[#0a0a0a]" />
                  Refund requests must be submitted to Apple at{" "}
                  <a
                    href="https://reportaproblem.apple.com"
                    className="text-[#6366f1] underline transition-colors duration-200 hover:text-[#0a0a0a]"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    reportaproblem.apple.com
                  </a>
                </li>
              </ul>
            </div>
          </section>

          {/* Section: Health Disclaimer */}
          <section className="mt-14">
            <h2 className="font-sans text-[24px] font-semibold text-[#0a0a0a]">
              Health Disclaimer
            </h2>
            <div className="mt-3 h-px w-[40px] bg-[#e5e5e5]" />

            <div className="mt-6 rounded-xl border border-[#0a0a0a] bg-[#0a0a0a] p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#00ff88]">
                Important Notice
              </p>
              <p className="mt-3 font-sans text-[16px] font-semibold leading-[1.5] text-[#fafafa]">
                AtomicSync is NOT a medical device, medical application, or
                diagnostic tool.
              </p>
            </div>

            <ul className="mt-6 flex flex-col gap-3 font-serif text-[15px] leading-[1.8] text-[#525252]">
              <li className="flex items-start gap-2">
                <span className="mt-[10px] block h-[5px] w-[5px] shrink-0 bg-[#0a0a0a]" />
                Health data, summaries, and visualizations are for{" "}
                <strong className="text-[#0a0a0a]">
                  informational and entertainment purposes only
                </strong>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-[10px] block h-[5px] w-[5px] shrink-0 bg-[#0a0a0a]" />
                The App does not diagnose, treat, cure, or prevent any disease
                or health condition
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-[10px] block h-[5px] w-[5px] shrink-0 bg-[#0a0a0a]" />
                Always consult a qualified healthcare provider before making
                health decisions
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-[10px] block h-[5px] w-[5px] shrink-0 bg-[#0a0a0a]" />
                Avatar appearance changes are for{" "}
                <strong className="text-[#0a0a0a]">
                  entertainment and motivation
                </strong>{" "}
                &mdash; they do not reflect medical assessments
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-[10px] block h-[5px] w-[5px] shrink-0 bg-[#0a0a0a]" />
                In a medical emergency, call 911 &mdash; do not rely on
                AtomicSync
              </li>
            </ul>
          </section>

          {/* Section: Your Rights */}
          <section className="mt-14">
            <h2 className="font-sans text-[24px] font-semibold text-[#0a0a0a]">
              Your Rights
            </h2>
            <div className="mt-3 h-px w-[40px] bg-[#e5e5e5]" />

            <h3 className="mt-8 font-sans text-[18px] font-semibold text-[#0a0a0a]">
              Your Health Data
            </h3>
            <p className="mt-3 font-serif text-[15px] leading-[1.8] text-[#525252]">
              <strong className="text-[#0a0a0a]">
                You own your health data.
              </strong>{" "}
              We process it to provide the service but do not claim ownership.
              You may request export or deletion at any time.
            </p>

            <h3 className="mt-8 font-sans text-[18px] font-semibold text-[#0a0a0a]">
              Your Generated Avatars
            </h3>
            <ul className="mt-3 flex flex-col gap-2 font-serif text-[15px] leading-[1.8] text-[#525252]">
              <li className="flex items-start gap-2">
                <span className="mt-[10px] block h-[5px] w-[5px] shrink-0 bg-[#00ff88]" />
                You receive a personal, non-exclusive, non-transferable license
                to use and share your avatars for personal, non-commercial
                purposes
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-[10px] block h-[5px] w-[5px] shrink-0 bg-[#00ff88]" />
                You may share avatars on social media with the AI-generated
                label intact
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-[10px] block h-[5px] w-[5px] shrink-0 bg-[#00ff88]" />
                Commercial use of generated avatars requires prior written
                consent
              </li>
            </ul>

            <h3 className="mt-8 font-sans text-[18px] font-semibold text-[#0a0a0a]">
              Account Termination
            </h3>
            <p className="mt-3 font-serif text-[15px] leading-[1.8] text-[#525252]">
              You may delete your account at any time via Settings &gt; Account
              &gt; Delete Account or by emailing{" "}
              <a
                href="mailto:support@breaksignal.com"
                className="text-[#6366f1] underline transition-colors duration-200 hover:text-[#0a0a0a]"
              >
                support@breaksignal.com
              </a>
              . Upon termination, your data will be deleted in accordance with
              our Privacy Policy retention schedule.
            </p>
          </section>

          {/* Section: Contact */}
          <section className="mt-14">
            <h2 className="font-sans text-[24px] font-semibold text-[#0a0a0a]">
              Contact Information
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
              <p className="mt-1 font-serif text-[13px] text-[#737373]">
                For legal inquiries, use the subject line &quot;Legal
                Inquiry&quot; for faster processing.
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
              href="/privacy"
              className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#737373] transition-colors duration-200 hover:text-[#0a0a0a]"
            >
              Privacy Policy &rarr;
            </Link>
          </div>
    </LegalPageLayout>
  );
}
