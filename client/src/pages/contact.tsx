import Header from "@/components/public/Header";
import ContactSection from "@/components/public/ContactSection";
import Footer from "@/components/public/Footer";
import ThemeToggle from "@/components/ThemeToggle";

export default function Contact() {
  return (
    <div className="min-h-screen" data-testid="page-contact">
      <Header />
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <main className="pt-20">
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
