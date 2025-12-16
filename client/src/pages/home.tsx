import Header from "@/components/public/Header";
import HeroSection from "@/components/public/HeroSection";
import AboutSection from "@/components/public/AboutSection";
import ServicesSection from "@/components/public/ServicesSection";
import CertificateVerification from "@/components/public/CertificateVerification";
import ClientSectors from "@/components/public/ClientSectors";
import GallerySection from "@/components/public/GallerySection";
import AnnouncementsSection from "@/components/public/AnnouncementsSection";
import EducationSection from "@/components/public/EducationSection";
import ContactSection from "@/components/public/ContactSection";
import Footer from "@/components/public/Footer";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  return (
    <div className="min-h-screen" data-testid="page-home">
      <Header />
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <main>
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <CertificateVerification />
        <ClientSectors />
        <GallerySection />
        <AnnouncementsSection />
        <EducationSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
