import { Card, CardContent } from "@/components/ui/card";
import { Factory, Store, Gem, Mountain, Building, Users } from "lucide-react";

const sectors = [
  {
    icon: Factory,
    title: "Diamond Manufacturers",
    description: "Large-scale diamond processing and manufacturing facilities",
  },
  {
    icon: Gem,
    title: "Diamond Dealers",
    description: "Wholesale and retail diamond trading businesses",
  },
  {
    icon: Store,
    title: "Independent Jewelers",
    description: "Small and medium-sized jewelry retail stores",
  },
  {
    icon: Mountain,
    title: "Mining Companies",
    description: "Gemstone extraction and mining operations",
  },
  {
    icon: Building,
    title: "Chain Retailers",
    description: "National and international jewelry retail chains",
  },
  {
    icon: Users,
    title: "The Public",
    description: "Individual consumers seeking certification services",
  },
];

export default function ClientSectors() {
  return (
    <section className="py-20 bg-muted/30" data-testid="section-clients">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold mb-4" data-testid="text-clients-title">
            Who We Serve
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto" data-testid="text-clients-description">
            AIGI provides trusted gemological services to a diverse range of industry professionals and consumers.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {sectors.map((sector, index) => (
            <Card key={index} className="text-center hover-elevate" data-testid={`card-sector-${index}`}>
              <CardContent className="pt-6 pb-6">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <sector.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium text-sm mb-2">{sector.title}</h3>
                <p className="text-xs text-muted-foreground">{sector.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
