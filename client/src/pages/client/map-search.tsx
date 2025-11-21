import { MapFilters } from "@/components/map-filters";
import { PropertyList } from "@/components/property-list";
import { usePropertyStore } from "@/lib/store";
import { useState, useCallback } from "react";
import PropertyMap from "@/components/property-map";
import type { Property } from "@/services/propertyApi";
import { useGetUserWishlistQuery } from "@/services/propertyApi";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

export default function MapSearchPage() {
  const [mapLoading, setMapLoading] = useState(false);
  const { totalVisibleCount, setSelectedProperty } = usePropertyStore();
  const { user } = useSelector((state: RootState) => state.auth);

  // Fetch wishlist if user is logged in
  const { data: wishlistData } = useGetUserWishlistQuery(undefined, {
    skip: !user || !user.id,
  });

  const wishlistIds = wishlistData?.map((p) => p.id) || [];

  // Handle listing click - pan map to location
  const handleListingClick = useCallback(
    (property: Property) => {
      // Set as selected to highlight on map
      setSelectedProperty(property.id);

      // The PropertyMap component will handle panning to the selected property
      // through the selectedProperty state in the store
    },
    [setSelectedProperty],
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 relative overflow-hidden">
        {/* Map Container - 50vh on mobile, full height on desktop */}
        <div className="h-[50vh] lg:h-full relative">
          <PropertyMap onLoadingChange={setMapLoading} />
        </div>

        {/* Listings Container - Scrollable */}
        <div className="h-[50vh] lg:h-full flex flex-col border-l">
          <MapFilters />

          {/* Properties Count Badge */}
          <div className="px-4 py-2 bg-muted/30 text-sm font-medium border-b">
            <span>{totalVisibleCount} properties in view</span>
          </div>

          <PropertyList
            isLoading={mapLoading}
            onCardClick={handleListingClick}
            wishlistIds={wishlistIds}
          />
        </div>
      </div>
    </div>
  );
}
