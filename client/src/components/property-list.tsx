import { PropertyCard } from "./property-card";
import { usePropertyStore } from "@/lib/store";
import { Loader, ChevronLeft, ChevronRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import type { Property } from "@/services/propertyApi";

interface PropertyListProps {
  isLoading?: boolean;
  onCardClick?: (property: Property) => void;
  wishlistIds?: string[];
}

export function PropertyList({
  isLoading = false,
  onCardClick,
  wishlistIds = [],
}: PropertyListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const { visibleProperties, properties, totalVisibleCount, selectedProperty } =
    usePropertyStore();

  const displayProperties =
    visibleProperties.length > 0 ? visibleProperties : properties;
  const totalCount = totalVisibleCount || displayProperties.length;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const selectedCardRef = useRef<HTMLDivElement>(null);

  const currentItems = displayProperties.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  useEffect(() => {
    if (selectedProperty && scrollAreaRef.current) {
      const selectedIndex = displayProperties.findIndex(
        (p) => p.id === selectedProperty,
      );

      if (selectedIndex >= 0) {
        const propertyPage = Math.floor(selectedIndex / itemsPerPage) + 1;

        if (propertyPage !== currentPage) {
          setTimeout(() => setCurrentPage(propertyPage), 0);
        }

        setTimeout(() => {
          if (selectedCardRef.current) {
            selectedCardRef.current.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }
        }, 100);
      }
    }
  }, [selectedProperty, displayProperties, currentPage, itemsPerPage]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Loader className="h-8 w-8 animate-spin" />
          <p>Loading properties...</p>
        </div>
      </div>
    );
  }

  if (displayProperties.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center p-4">
          <h3 className="font-semibold text-lg">No properties found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search filters or moving the map
          </p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1" ref={scrollAreaRef}>
      <div className="p-4">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="font-semibold">{totalCount} Properties</h2>
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * itemsPerPage + 1} -{" "}
            {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {currentItems.map((property) => (
            <div
              key={property.id}
              ref={property.id === selectedProperty ? selectedCardRef : null}
            >
              <PropertyCard
                property={property}
                onCardClick={onCardClick}
                isInWishlist={wishlistIds.includes(property.id)}
              />
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center mt-8">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage <= 1}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNumber =
                    currentPage <= 3
                      ? i + 1
                      : currentPage >= totalPages - 2
                        ? totalPages - 4 + i
                        : currentPage - 2 + i;

                  if (pageNumber <= 0 || pageNumber > totalPages) return null;

                  return (
                    <Button
                      key={pageNumber}
                      variant={
                        currentPage === pageNumber ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setCurrentPage(pageNumber)}
                      className="w-9"
                    >
                      {pageNumber}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) =>
                    prev < totalPages ? prev + 1 : prev,
                  )
                }
                disabled={currentPage >= totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}
        <div className="lg:container lg:mx-auto mt-8 mx-0 px-2">
          <p className="text-xs mt-5 text-muted-foreground">
            Real Group Realty, Brokerage...
          </p>
        </div>
      </div>
    </ScrollArea>
  );
}
