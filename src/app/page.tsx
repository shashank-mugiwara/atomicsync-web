import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { StatsSection } from "@/components/StatsSection";
import { EvolutionSection } from "@/components/EvolutionSection";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { PricingSection } from "@/components/PricingSection";
import { DataToAvatarSection } from "@/components/DataToAvatarSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <div className="section-divider" />
        <DataToAvatarSection />
        <FeaturesSection />
        <StatsSection />
        <EvolutionSection />
        <HowItWorksSection />
        <PricingSection />
      </main>
      <Footer />
    </>
  );
}
