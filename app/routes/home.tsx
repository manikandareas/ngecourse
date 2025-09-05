import FeaturesSection from '~/features/home/components/features-section';
import HeroSection from '~/features/home/components/hero-section';
import IntegrationsSection from '~/features/home/components/integration-section';
import { StatsSection } from '~/features/home/components/stats-section';
import { TextRevealSection } from '~/features/home/components/text-reveal-section';

export function meta() {
  return [
    { title: 'Genii' },
    { name: 'description', content: 'Welcome to Genii!' },
  ];
}

export default function Home() {
  return (
    <main className="w-full">
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <TextRevealSection />
      {/* <HowItWorks /> */}
      {/* <PricingSection /> */}
      <IntegrationsSection />
    </main>
  );
}
