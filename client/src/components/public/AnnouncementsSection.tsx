import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calendar, FileText, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { Announcement } from "@shared/schema";

export default function AnnouncementsSection() {
  const { data: announcements = [], isLoading } = useQuery<Announcement[]>({
    queryKey: ["/api/announcements/public"],
  });

  const formatDate = (date: string | Date | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <section className="py-20 bg-muted/30" data-testid="section-announcements">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </div>
      </section>
    );
  }

  if (announcements.length === 0) {
    return (
      <section className="py-20 bg-muted/30" data-testid="section-announcements">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12">
            <div>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold mb-2" data-testid="text-announcements-title">
                Latest Updates
              </h2>
              <p className="text-muted-foreground" data-testid="text-announcements-description">
                Research publications, announcements, and industry news
              </p>
            </div>
          </div>
          <div className="text-center py-12">
            <p className="text-muted-foreground">No announcements at this time. Check back soon!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-muted/30" data-testid="section-announcements">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold mb-2" data-testid="text-announcements-title">
              Latest Updates
            </h2>
            <p className="text-muted-foreground" data-testid="text-announcements-description">
              Research publications, announcements, and industry news
            </p>
          </div>
          <Link href="/research">
            <Button variant="outline" data-testid="button-view-all-updates">
              View All
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {announcements.slice(0, 4).map((item) => (
            <Card key={item.id} className="hover-elevate" data-testid={`card-announcement-${item.id}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-4 mb-2 flex-wrap">
                  <Badge variant="secondary" className="text-xs">
                    {item.type}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {formatDate(item.publishedDate)}
                  </div>
                </div>
                <CardTitle className="text-lg leading-snug">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{item.excerpt}</p>
                <Button variant="ghost" size="sm" className="p-0 h-auto">
                  <FileText className="h-4 w-4 mr-2" />
                  Read More
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
