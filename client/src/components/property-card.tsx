import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Link } from "react-router-dom";
import { usePropertyStore } from "@/lib/store";
import type { Property } from "@/services/propertyApi";
import {
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} from "@/services/propertyApi";
import { toast } from "sonner";

interface PropertyCardProps {
  property: Property;
  onCardClick?: (property: Property) => void;
  isInWishlist?: boolean;
}

export function PropertyCard({
  property,
  onCardClick,
  isInWishlist = false,
}: PropertyCardProps) {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const { setHoveredProperty, setSelectedProperty, selectedProperty } =
    usePropertyStore();

  const [addToWishlist, { isLoading: isAdding }] = useAddToWishlistMutation();
  const [removeFromWishlist, { isLoading: isRemoving }] =
    useRemoveFromWishlistMutation();

  const {
    id,
    photo_url,
    price,
    bedrooms_total,
    bathroom_total,
    street_address,
    city,
    province,
    type,
    listing_id,
    sizeInterior,
  } = property;

  const timeAgo = "New";
  const isSelected = selectedProperty === id;

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (isInWishlist) {
        await removeFromWishlist(id).unwrap();
        toast.success("Removed from wishlist");
      } else {
        await addToWishlist(id).unwrap();
        toast.success("Added to wishlist");
      }
    } catch (error: any) {
      console.error("Wishlist error:", error);
      if (error?.status === 401) {
        toast.error("Please sign in to save properties");
      } else {
        toast.error("Failed to update wishlist");
      }
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (onCardClick) {
      e.preventDefault();
      onCardClick(property);
    } else {
      setSelectedProperty(id);
    }
  };

  return (
    <div
      className={`group w-full relative bg-white rounded-lg overflow-hidden border transition-all duration-200 ${isSelected ? "ring-2 ring-primary md:shadow-lg" : "hover:shadow-md"}`}
      onMouseEnter={() => setHoveredProperty(id)}
      onMouseLeave={() => setHoveredProperty(null)}
      onClick={handleCardClick}
    >
      <div className="relative aspect-4/3 overflow-hidden">
        {isImageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <div className="h-8 w-8 animate-pulse rounded-full bg-muted-foreground/20"></div>
          </div>
        )}
        <img
          src={photo_url}
          alt={street_address}
          className={`h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 ${
            isImageLoading ? "opacity-0" : "opacity-100"
          }`}
          onLoad={() => setIsImageLoading(false)}
          onError={() => {
            setIsImageLoading(false);
          }}
        />
        <div className="absolute top-2 left-2 flex gap-2">
          <Badge className="bg-green-500 text-white hover:bg-green-600">
            For Sale
          </Badge>
          <Badge
            variant="secondary"
            className="bg-black/70 text-white hover:bg-black/80"
          >
            {timeAgo}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-white/90 hover:bg-white rounded-full h-8 w-8 transition-transform hover:scale-110"
          onClick={handleFavoriteClick}
          disabled={isAdding || isRemoving}
        >
          <Heart
            className={`h-4 w-4 transition-all duration-300 ${
              isInWishlist
                ? "fill-current text-red-500 scale-110"
                : "text-gray-600 hover:text-red-500"
            }`}
          />
        </Button>
      </div>
      <div className="p-4">
        <div className="flex items-baseline justify-between">
          <h3 className="text-xl font-bold">
            ₹{Number(price).toLocaleString("en-IN")}
          </h3>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {bedrooms_total} bed • {bathroom_total} bath •{" "}
          {sizeInterior ? `${sizeInterior} sqft` : type}
        </p>
        <p className="mt-1 text-sm font-medium truncate">{street_address}</p>
        <p className="text-sm text-muted-foreground truncate">
          {city}, {province}
        </p>
        <p className="text-xs text-muted-foreground mt-3 pt-3 border-t">
          ID® {listing_id}
        </p>
      </div>
      {!onCardClick && (
        <Link to={`/listings/${listing_id}`} className="absolute inset-0">
          <span className="sr-only">View property details</span>
        </Link>
      )}
    </div>
  );
}
