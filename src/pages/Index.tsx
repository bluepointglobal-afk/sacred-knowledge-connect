import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/landing/HeroSection";
import { ValuePropsSection } from "@/components/landing/ValuePropsSection";
import { SubjectsSection } from "@/components/landing/SubjectsSection";
import { FeaturedTeachersSection } from "@/components/landing/FeaturedTeachersSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { CTASection } from "@/components/landing/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <ValuePropsSection />
        <SubjectsSection />
        <FeaturedTeachersSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
