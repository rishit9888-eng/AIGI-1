import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Calendar, Clock, MapPin, ArrowRight, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { Seminar } from "@shared/schema";

export default function EducationSection() {
  const { data: seminars = [], isLoading } = useQuery<Seminar[]>({
    queryKey: ["/api/seminars/public"],
  });

  if (isLoading) {
    return (
      <section className="py-20 bg-background" data-testid="section-education">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-background" data-testid="section-education">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <GraduationCap className="h-8 w-8 text-primary" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold mb-4" data-testid="text-education-title">
            Education & Training
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto" data-testid="text-education-description">
            Advance your gemological knowledge with our expert-led seminars and workshops.
          </p>
        </div>

        {seminars.length === 0 ? (
          <div className="text-center py-12 mb-12">
            <p className="text-muted-foreground">No upcoming seminars at this time. Check back soon!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {seminars.slice(0, 3).map((seminar) => (
              <Card key={seminar.id} className="hover-elevate" data-testid={`card-seminar-${seminar.id}`}>
                <CardHeader>
                  <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                    <Badge variant={seminar.status === "Open" ? "default" : "secondary"}>
                      {seminar.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{seminar.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{seminar.description}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {seminar.date}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {seminar.duration}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {seminar.location}
                    </div>
                  </div>
                  <Button className="w-full" variant={seminar.status === "Open" ? "default" : "secondary"}>
                    {seminar.status === "Open" ? "Register Now" : "Notify Me"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
