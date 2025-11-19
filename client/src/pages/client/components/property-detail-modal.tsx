import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Share2, Lock } from "lucide-react";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import type { Property } from "@/services/propertyApi";
import { openAuthModal } from "@/features/auth/authSlice";

interface PropertyDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property;
}

export function PropertyDetailModal({
  isOpen,
  onClose,
  property,
}: PropertyDetailModalProps) {
  const dispatch = useAppDispatch();
  const [isFavorite, setIsFavorite] = useState(false);
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const { user } = useAppSelector((state) => state.auth);

  const {
    photo_url,
    price,
    bedrooms_total,
    bathroom_total,
    street_address,
    city,
    province,
    type,
    listing_id,
    postal_code,
    id,
  } = property;

  const fetchAdditionalImages = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/properties/${id}/images`,
      );
      if (response.ok) {
        const data = await response.json();
        setAdditionalImages(data.images);
        setImagesLoaded(true);
      }
    } catch (error) {
      console.error("Error fetching additional images:", error);
    }
  };

  useEffect(() => {
    if (user && isOpen && id) {
      fetchAdditionalImages();
    }
  }, [user, isOpen, id]);

  const getGalleryImages = () => {
    if (user && imagesLoaded && additionalImages.length > 0) {
      return [photo_url, ...additionalImages];
    }
    return [
      photo_url || "/placeholder.svg?height=600&width=800&text=No%20Image",
    ];
  };

  const galleryImages = getGalleryImages();

  const handleImageChange = (index: number) => {
    if (!user && index > 0) {
      dispatch(openAuthModal());
      return;
    }
    setCurrentImageIndex(index);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="relative aspect-4/3 overflow-hidden rounded-lg">
              {!user && (
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/70 to-transparent flex flex-col items-center justify-end text-white p-6">
                  <Lock className="h-8 w-8 mb-2" />
                  <p className="text-center mb-2 font-medium">
                    Sign in to view all property photos
                  </p>
                  <Button className="bg-primary hover:bg-primary/90 text-white">
                    Unlock All Photos
                  </Button>
                </div>
              )}
              <img
                src={galleryImages[currentImageIndex] || "/placeholder.svg"}
                alt={street_address}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {galleryImages.slice(0, 6).map((img, i) => (
                <div
                  key={i}
                  className={`relative aspect-4/3 overflow-hidden rounded-lg bg-muted cursor-pointer ${
                    i === currentImageIndex ? "ring-2 ring-primary" : ""
                  } ${!user && i > 0 ? "opacity-50" : ""}`}
                  onClick={() => handleImageChange(i)}
                >
                  {!user && i > 0 && (
                    <div className="absolute inset-0 z-10 bg-black/30 flex items-center justify-center">
                      <Lock className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <img
                    src={img || "/placeholder.svg"}
                    alt={`Property photo ${i}`}
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  ${Number(price).toLocaleString()}
                </h2>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsFavorite(!isFavorite)}
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        isFavorite ? "fill-red-500 text-red-500" : ""
                      }`}
                    />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-lg">{street_address}</p>
              <p className="text-muted-foreground">
                {city}, {province} {postal_code}
              </p>
            </div>

            <div className="flex gap-2">
              <Badge variant="secondary">{bedrooms_total} bed</Badge>
              <Badge variant="secondary">{bathroom_total} bath</Badge>
              <Badge variant="secondary">{type}</Badge>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Property Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Property Type</p>
                  <p>{type}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">MLS® Number</p>
                  <p>{listing_id}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Bedrooms</p>
                  <p>{bedrooms_total}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Bathrooms</p>
                  <p>{bathroom_total}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Description</h3>
              <p className="text-sm text-muted-foreground">
                Beautiful {bedrooms_total} bedroom, {bathroom_total} bathroom{" "}
                {type.toLowerCase()} in {city}. This property offers modern
                amenities and a great location.
              </p>
            </div>

            <Button className="w-full">Contact Agent</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
