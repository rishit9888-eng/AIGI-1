import Header from "@/components/public/Header";
import ServicesSection from "@/components/public/ServicesSection";
import Footer from "@/components/public/Footer";
import ThemeToggle from "@/components/ThemeToggle";

export default function Services() {
  return (
    <div className="min-h-screen" data-testid="page-services">
      <Header />
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <main className="pt-20">
        <ServicesSection />
      </main>
      <Footer />
    </div>
  );
}
