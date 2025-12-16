import Header from "@/components/public/Header";
import CertificateVerification from "@/components/public/CertificateVerification";
import Footer from "@/components/public/Footer";
import ThemeToggle from "@/components/ThemeToggle";

export default function Verify() {
  return (
    <div className="min-h-screen" data-testid="page-verify">
      <Header />
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <main className="pt-20">
        <CertificateVerification />
      </main>
      <Footer />
    </div>
  );
}
