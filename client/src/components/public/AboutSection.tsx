import { Card, CardContent } from "@/components/ui/card";
import { Building2, FlaskConical, GraduationCap, MapPin } from "lucide-react";

const stats = [
  { icon: Building2, value: "2004", label: "Established" },
  { icon: MapPin, value: "5+", label: "Locations" },
  { icon: FlaskConical, value: "2006", label: "Research Dept." },
  { icon: GraduationCap, value: "1000+", label: "Alumni" },
];

const milestones = [
  { year: "2004", title: "Foundation", description: "AIGI was established as India's independent gemological laboratory" },
  { year: "2006", title: "Research Department", description: "Advanced research division launched for gemological studies" },
  { year: "2010", title: "Network Expansion", description: "Extended operations to Punjab, Haryana, and Uttar Pradesh" },
  { year: "2018", title: "Kerala Branch", description: "Opened our southernmost laboratory in Kerala" },
];

export default function AboutSection() {
  return (
    <section className="py-20 bg-background" data-testid="section-about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold mb-4" data-testid="text-about-title">
            About AIGI
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto" data-testid="text-about-description">
            One of India's largest independent gemological laboratories, dedicated to excellence in precious stone certification and research.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center" data-testid={`card-stat-${index}`}>
              <CardContent className="pt-6">
                <stat.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                <p className="text-2xl font-semibold mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <h3 className="font-serif text-2xl font-semibold mb-4">Our Journey</h3>
            <div className="space-y-6">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex gap-4" data-testid={`milestone-${index}`}>
                  <div className="flex-shrink-0 w-16 text-sm font-semibold text-primary">
                    {milestone.year}
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">{milestone.title}</h4>
                    <p className="text-sm text-muted-foreground">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-serif text-2xl font-semibold mb-4">Why Choose AIGI</h3>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Founded in 2004, AIGI has grown to become one of India's most trusted gemological institutions. Our network spans New Delhi, Punjab, Haryana, Uttar Pradesh, and Kerala.
              </p>
              <p className="text-muted-foreground">
                Every certificate issued includes unique security codes to ensure authenticity. Our Research Department, established in 2006, is among the few worldwide conducting advanced gemological research.
              </p>
              <p className="text-muted-foreground">
                AIGI alumni are recognized globally, frequently speaking at international conferences and contributing to the advancement of gemological science.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
