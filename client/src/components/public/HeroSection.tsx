import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Shield, ArrowRight } from "lucide-react";
import heroImage from "@assets/generated_images/diamond_laboratory_microscope_examination.png";

export default function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center" data-testid="section-hero">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-white/80 text-sm uppercase tracking-widest mb-4" data-testid="text-hero-subtitle">
          Since 2004
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-white mb-6 leading-tight" data-testid="text-hero-title">
          All India Gemological Institute
        </h1>
        <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed" data-testid="text-hero-description">
          One of India's largest independent gemological laboratories, specializing in precious stone certification, advanced research, and gemological education.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/verify">
            <Button size="lg" className="min-w-[200px]" data-testid="button-hero-verify">
              <Shield className="h-5 w-5 mr-2" />
              Verify Certificate
            </Button>
          </Link>
          <Link href="/about">
            <Button
              size="lg"
              variant="outline"
              className="min-w-[200px] bg-white/10 backdrop-blur-md border-white/30 text-white"
              data-testid="button-hero-learn"
            >
              Learn More
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
