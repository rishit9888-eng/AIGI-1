import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { X, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { GalleryItem } from "@shared/schema";

const categories = ["All", "Labs", "Equipment", "Seminars", "Research"];

export default function GallerySection() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  const { data: galleryItems = [], isLoading } = useQuery<GalleryItem[]>({
    queryKey: ["/api/gallery/public"],
  });

  const filteredItems = activeCategory === "All" 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeCategory);

  if (isLoading) {
    return (
      <section className="py-20 bg-background" data-testid="section-gallery">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-background" data-testid="section-gallery">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold mb-4" data-testid="text-gallery-title">
            Gallery
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto" data-testid="text-gallery-description">
            Explore our state-of-the-art laboratories, equipment, and educational events.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(category)}
              data-testid={`button-filter-${category.toLowerCase()}`}
            >
              {category}
            </Button>
          ))}
        </div>

        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No gallery items available in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredItems.map((item) => (
              <Card
                key={item.id}
                className="aspect-square overflow-visible cursor-pointer hover-elevate"
                onClick={() => setSelectedImage(item)}
                data-testid={`card-gallery-${item.id}`}
              >
                {item.imagePath ? (
                  <img 
                    src={item.imagePath} 
                    alt={item.title}
                    className="w-full h-full object-cover rounded-md"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center rounded-md">
                    <div className="text-center p-4">
                      <p className="text-muted-foreground text-sm">{item.category}</p>
                      <p className="font-medium mt-1">{item.title}</p>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-4xl p-0">
            <DialogTitle className="sr-only">
              {selectedImage?.title || "Gallery Image"}
            </DialogTitle>
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 z-10"
                onClick={() => setSelectedImage(null)}
                data-testid="button-close-lightbox"
              >
                <X className="h-4 w-4" />
              </Button>
              {selectedImage?.imagePath ? (
                <img 
                  src={selectedImage.imagePath} 
                  alt={selectedImage.title}
                  className="w-full aspect-video object-contain"
                />
              ) : (
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-muted-foreground">{selectedImage?.category}</p>
                    <p className="text-xl font-medium mt-2">{selectedImage?.title}</p>
                  </div>
                </div>
              )}
              {selectedImage?.description && (
                <div className="p-4 border-t">
                  <h3 className="font-medium mb-1">{selectedImage.title}</h3>
                  <p className="text-sm text-muted-foreground">{selectedImage.description}</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
