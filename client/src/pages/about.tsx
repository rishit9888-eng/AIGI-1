import Header from "@/components/public/Header";
import AboutSection from "@/components/public/AboutSection";
import Footer from "@/components/public/Footer";
import ThemeToggle from "@/components/ThemeToggle";

export default function About() {
  return (
    <div className="min-h-screen" data-testid="page-about">
      <Header />
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <main className="pt-20">
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
}
