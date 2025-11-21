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
  const [isMobileListOpen, setIsMobileListOpen] = useState(false);

  // Fetch wishlist if user is logged in
  const { data: wishlistData } = useGetUserWishlistQuery(undefined, {
    skip: !user || !user.id,
  });

  const wishlistIds = wishlistData?.map((p) => p.id) || [];

  // Handle listing click - pan map to location
  const handleListingClick = useCallback(
    (property: Property) => {
      setSelectedProperty(property.id);
    },
    [setSelectedProperty],
  );

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-background w-full relative">
      <div className="flex-1 lg:grid lg:grid-cols-2 overflow-hidden">
        {/* Map Container */}
        <div className="absolute inset-0 lg:static lg:h-full w-full z-0">
          <PropertyMap onLoadingChange={setMapLoading} />
        </div>

        {/* Listings Container - Bottom sheet on mobile, right column on desktop */}
        <div
          className={`
            absolute bottom-0 left-0 right-0 bg-background z-10 flex flex-col 
            transition-all duration-300 ease-in-out shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]
            lg:static lg:h-full lg:border-l lg:shadow-none lg:translate-y-0
            ${isMobileListOpen ? "h-[80%]" : "h-[40%]"}
            rounded-t-3xl lg:rounded-none
          `}
        >
          {/* Mobile Drag Handle */}
          <div
            className="w-full flex items-center justify-center p-3 lg:hidden cursor-pointer hover:bg-muted/50 rounded-t-3xl"
            onClick={() => setIsMobileListOpen(!isMobileListOpen)}
          >
            <div className="w-12 h-1.5 bg-muted-foreground/20 rounded-full" />
          </div>

          <div className="flex-1 flex flex-col overflow-hidden">
            <MapFilters />

            {/* Properties Count Badge */}
            <div className="px-4 py-2 bg-muted/30 text-sm font-medium border-b flex justify-between items-center">
              <span>{totalVisibleCount} properties in view</span>
              <button
                className="lg:hidden text-xs text-primary font-semibold"
                onClick={() => setIsMobileListOpen(!isMobileListOpen)}
              >
                {isMobileListOpen ? "Hide List" : "Expand List"}
              </button>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col">
              <PropertyList
                isLoading={mapLoading}
                onCardClick={handleListingClick}
                wishlistIds={wishlistIds}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
