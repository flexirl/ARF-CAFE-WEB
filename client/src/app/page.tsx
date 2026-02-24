import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { BestSellersSection } from "@/components/landing/best-sellers-section";
import { OffersSection } from "@/components/landing/offers-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { CtaSection } from "@/components/landing/cta-section";
import {AboutUs} from "@/components/landing/about";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <BestSellersSection />
      <OffersSection />
      <TestimonialsSection />
      <AboutUs/>
      <CtaSection />
    </>
  );
}
