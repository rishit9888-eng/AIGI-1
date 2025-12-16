import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gem, Search, FlaskConical, FileCheck, GraduationCap, Microscope } from "lucide-react";

const services = [
  {
    icon: FileCheck,
    title: "Precious Stone Certification",
    description: "Comprehensive certification for diamonds, rubies, emeralds, sapphires, and other precious stones with detailed grading reports.",
  },
  {
    icon: Search,
    title: "Diamond Identification",
    description: "Advanced identification services distinguishing natural from lab-grown diamonds using state-of-the-art equipment.",
  },
  {
    icon: Gem,
    title: "Gemstone Grading",
    description: "Expert grading of colored gemstones based on international standards for color, clarity, cut, and carat weight.",
  },
  {
    icon: Microscope,
    title: "Laboratory Testing",
    description: "Spectroscopic analysis, fluorescence testing, and inclusion mapping using advanced gemological instruments.",
  },
  {
    icon: FlaskConical,
    title: "Research Services",
    description: "Custom research projects for mining companies, jewelers, and academic institutions seeking specialized analysis.",
  },
  {
    icon: GraduationCap,
    title: "Educational Seminars",
    description: "Industry seminars and workshops covering gemological topics, market trends, and certification standards.",
  },
];

export default function ServicesSection() {
  return (
    <section className="py-20 bg-muted/30" data-testid="section-services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold mb-4" data-testid="text-services-title">
            Our Services
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto" data-testid="text-services-description">
            Comprehensive gemological services backed by advanced technology and expert analysis.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Card key={index} className="hover-elevate transition-transform" data-testid={`card-service-${index}`}>
              <CardHeader>
                <div className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center mb-4">
                  <service.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
