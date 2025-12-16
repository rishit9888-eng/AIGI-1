import Header from "@/components/public/Header";
import AnnouncementsSection from "@/components/public/AnnouncementsSection";
import Footer from "@/components/public/Footer";
import ThemeToggle from "@/components/ThemeToggle";

export default function Research() {
  return (
    <div className="min-h-screen" data-testid="page-research">
      <Header />
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <main className="pt-20">
        <AnnouncementsSection />
      </main>
      <Footer />
    </div>
  );
}
