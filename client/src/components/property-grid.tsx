import { Loader } from "lucide-react";
import { PropertyCard } from "./property-card";
import type { Property } from "@/services/propertyApi";

interface PropertyGridProps {
  properties: Property[];
  loading: boolean;
  sortBy: string;
}

export function PropertyGrid({
  properties,
  loading,
  sortBy,
}: PropertyGridProps) {
  const sortedProperties = [...properties].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return Number(a.price) - Number(b.price);
      case "price-desc":
        return Number(b.price) - Number(a.price);
      case "newest":
        return (b.listing_id || "").localeCompare(a.listing_id || "");
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Loader className="h-8 w-8 animate-spin" />
          <p>Loading properties...</p>
        </div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <h3 className="text-lg font-medium mb-2">No properties found</h3>
        <p className="text-muted-foreground">
          Try adjusting your search filters
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
      {sortedProperties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}
