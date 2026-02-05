import HeroSection from "../components/HeroSection";
import LiveNow from "../components/LiveNow";
import NewsPreview from "../components/NewsPreview";
import Testimonials from "../components/Testimonials";
import HomeCTA from "../components/HomeCTA";

export default async function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50/30 via-white to-accent-50/20">
      <HeroSection />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-20 py-16">
          <LiveNow />
          <NewsPreview />
          <Testimonials />
        </div>
      </div>
      <HomeCTA />
    </div>
  );
}
