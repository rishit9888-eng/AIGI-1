import Header from "@/components/public/Header";
import EducationSection from "@/components/public/EducationSection";
import Footer from "@/components/public/Footer";
import ThemeToggle from "@/components/ThemeToggle";

export default function Education() {
  return (
    <div className="min-h-screen" data-testid="page-education">
      <Header />
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <main className="pt-20">
        <EducationSection />
      </main>
      <Footer />
    </div>
  );
}
