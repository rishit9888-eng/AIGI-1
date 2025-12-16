import Header from "@/components/public/Header";
import GallerySection from "@/components/public/GallerySection";
import Footer from "@/components/public/Footer";
import ThemeToggle from "@/components/ThemeToggle";

export default function Gallery() {
  return (
    <div className="min-h-screen" data-testid="page-gallery">
      <Header />
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <main className="pt-20">
        <GallerySection />
      </main>
      <Footer />
    </div>
  );
}
