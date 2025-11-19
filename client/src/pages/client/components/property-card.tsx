import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setHoveredProperty,
  setSelectedProperty,
} from "@/features/properties/propertiesSlice";
import type { Property } from "@/services/propertyApi";

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const dispatch = useAppDispatch();
  const { selectedProperty } = useAppSelector((state) => state.properties);

  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [hasError, setHasError] = useState(false);

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
    year_built,
  } = property;

  useEffect(() => {
    setHasError(false);
  }, [photo_url]);

  const timeAgo = year_built
    ? formatDistanceToNow(new Date(year_built), { addSuffix: false })
    : ["1 day", "22 hours", "2 days", "3 days", "New", "1 week"][
        Math.floor(Math.random() * 6)
      ];

  const isSelected = selectedProperty === id;

  return (
    <div
      className={`group w-full px-5 relative bg-white rounded-lg overflow-hidden border transition-all duration-200 ${
        isSelected ? "ring-2 ring-primary md:shadow-lg" : "hover:shadow-md"
      }`}
      onMouseEnter={() => dispatch(setHoveredProperty(id))}
      onMouseLeave={() => dispatch(setHoveredProperty(null))}
      onClick={() => dispatch(setSelectedProperty(id))}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {isImageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <div className="h-8 w-8 animate-pulse rounded-full bg-muted-foreground/20"></div>
          </div>
        )}
        <img
          src={hasError || !photo_url ? "/assets/call-image.jpg" : photo_url}
          alt={street_address}
          className={`object-cover w-full h-full transition-transform ${
            isImageLoading ? "opacity-0" : "opacity-100"
          }`}
          onLoad={() => setIsImageLoading(false)}
          onError={() => {
            setIsImageLoading(false);
            setHasError(true);
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
          className="absolute top-2 right-2 bg-white/90 hover:bg-white"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsFavorite(!isFavorite);
          }}
        >
          <Heart
            className={`h-4 w-4 ${
              isFavorite ? "fill-red-500 text-red-500" : ""
            }`}
          />
        </Button>
      </div>
      <div className="p-3">
        <div className="flex items-baseline justify-between">
          <h3 className="text-xl font-bold">
            ${Number(price).toLocaleString()}
          </h3>
        </div>
        <p className="text-sm text-muted-foreground">
          {bedrooms_total} bed • {bathroom_total} bath •{" "}
          {sizeInterior ? `${sizeInterior} sqft` : type}
        </p>
        <p className="mt-1 text-sm truncate">{street_address}</p>
        <p className="text-sm text-muted-foreground truncate">
          {city}, {province}
        </p>
        <p className="text-xs text-muted-foreground mt-2">MLS® {listing_id}</p>
      </div>
      <Link to={`/listings/${listing_id}`} className="absolute inset-0">
        <span className="sr-only">View property details</span>
      </Link>
    </div>
  );
}
