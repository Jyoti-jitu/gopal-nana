import Hero from "@/components/home/Hero";
import TrustStrip from "@/components/home/TrustStrip";
import ProductRange from "@/components/home/ProductRange";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import EarthingIntro from "@/components/home/EarthingIntro";
import InstallationPreview from "@/components/home/InstallationPreview";
import ContactCTA from "@/components/home/ContactCTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <ProductRange />
      <WhyChooseUs />
      <EarthingIntro />
      <InstallationPreview />
      <ContactCTA />
    </>
  );
}
