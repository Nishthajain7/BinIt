import Hero from "@/components/Hero";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Benefits from "@/components/Benefits/Benefits";
import Container from "@/components/Container";
import Section from "@/components/Section";
import Stats from "@/components/Stats";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

const HomePage: React.FC = () => {
  return (
    <>
      <Header />
      <Hero />
      <Container>
        <Benefits />
        <Section
          id="testimonials"
          title="Our Inspirations"
          description="Hear from those who have share the thoughts with us."
        >
          <Testimonials />
        </Section>

        <FAQ />

        <Stats />
        <CTA />
      </Container>
      <Footer />
    </>
  );
};

export default HomePage;
