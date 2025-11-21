import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Share2,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Lock,
  Heart,
  User,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  useGetPropertyByIdQuery,
  useGetSimilarPropertiesQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useGetUserWishlistQuery,
} from "@/services/propertyApi";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { AgentContactDialog } from "./components/agent-contact-dialog";
import { SinglePropertyMap } from "@/components/single-property-map";

/**
 * NOTE: Developer provided asset path (local to environment).
 * We'll use this as a fallback gallery image so UI matches screenshot.
 * Path: /mnt/data/51ad5730-2aaa-465e-a823-acfaf402b57a.png
 */
const DEV_SAMPLE_IMAGE = "/mnt/data/51ad5730-2aaa-465e-a823-acfaf402b57a.png";
const DEFAULT_IMAGE = "/assets/call-image.jpg";

const ImageWithFallback = ({
  src,
  alt,
  ...props
}: {
  src?: string | null;
  alt: string;
  [key: string]: any;
}) => {
  const [error, setError] = useState(false);
  const finalSrc = !src || error ? DEV_SAMPLE_IMAGE || DEFAULT_IMAGE : src;
  return (
    <img src={finalSrc} alt={alt} onError={() => setError(true)} {...props} />
  );
};

interface PropertyDetailPageProps {
  propertyId?: string;
}

export default function PropertyDetailPage({
  propertyId,
}: PropertyDetailPageProps) {
  const params = useParams();
  const id = propertyId || params.id;
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { user } = useSelector((state: RootState) => state.auth);
  const isAuthenticated = !!user;

  const { data: property, isLoading } = useGetPropertyByIdQuery(id || "");
  const { data: similarProperties } = useGetSimilarPropertiesQuery(id || "", {
    skip: !id,
  });

  const { data: wishlistData } = useGetUserWishlistQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [addToWishlist] = useAddToWishlistMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();

  const wishlistIds = Array.isArray(wishlistData)
    ? wishlistData.map((p: any) => p._id || p.id)
    : (wishlistData as any)?.data?.map((p: any) => p._id || p.id) || [];
  const isCurrentPropertySaved = id ? wishlistIds.includes(id) : false;

  const handleToggleWishlist = async (
    e: React.MouseEvent,
    propertyId: string,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error("Please sign in to save properties");
      navigate("/sign-in");
      return;
    }

    const isInWishlist = wishlistIds.includes(propertyId);
    try {
      if (isInWishlist) {
        await removeFromWishlist(propertyId).unwrap();
        toast.success("Removed from wishlist");
      } else {
        await addToWishlist(propertyId).unwrap();
        toast.success("Added to wishlist");
      }
    } catch {
      toast.error("Failed to update wishlist");
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: street_address || "Property Details",
      text: `Check out this property at ${street_address}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success("Shared successfully!");
      } catch {
        // User cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      } catch {
        toast.error("Failed to copy link");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <main className="container max-w-7xl mx-auto py-8 flex-1 flex items-center justify-center px-4">
          <div className="animate-pulse text-muted-foreground">
            Loading property details...
          </div>
        </main>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <main className="container max-w-7xl mx-auto py-8 flex-1 px-4">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Property Not Found</h1>
          </div>
        </main>
      </div>
    );
  }

  // support both MLS style and simpler object shape
  const {
    _id,
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
    description,
    latitude,
    longitude,
    interiorFeatures,
    exteriorFeatures,
    all_photos,
    user: agent,
  } = (property as any).properties || property;

  const interiorFeaturesList: string[] = interiorFeatures || [
    `${bedrooms_total || "—"} Bedrooms`,
    `${bathroom_total || "—"} Bathrooms`,
    "Modern Kitchen",
    "Hardwood Floors",
  ];
  const exteriorFeaturesList: string[] = exteriorFeatures || [
    "Attached Garage",
    "Private Backyard",
    "Landscaped Garden",
  ];

  const square_feet = sizeInterior?.split(" ")[0] || null;

  // Build gallery images array: photo_url + all_photos (if present)
  // Use Set to remove duplicates
  const uniqueImages = new Set<string>();
  if (photo_url) uniqueImages.add(photo_url);
  if (all_photos) {
    Object.values(all_photos).forEach((url: any) => {
      if (url) uniqueImages.add(url);
    });
  }

  const galleryImages = Array.from(uniqueImages);

  // Fallback if no images
  if (galleryImages.length === 0) {
    galleryImages.push(DEV_SAMPLE_IMAGE);
  }

  const handleImageNavigation = (direction: "prev" | "next") => {
    // If user not auth, prevent navigating beyond index 0
    if (!isAuthenticated && currentImageIndex === 0 && direction === "next") {
      return;
    }

    setCurrentImageIndex((prev) =>
      direction === "prev"
        ? prev === 0
          ? galleryImages.length - 1
          : prev - 1
        : prev === galleryImages.length - 1
          ? 0
          : prev + 1,
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pb-12">
      <main className="container max-w-7xl mx-auto py-6 flex-1 px-4 sm:px-6">
        {/* MAIN LAYOUT: LEFT = Gallery & Tabs (3fr) | RIGHT = Price/Agent (2fr) */}
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-8 items-start">
          {/* LEFT: Gallery + Tabs */}
          <div className="space-y-6 lg:col-span-4">
            {/* Gallery Card */}
            <div className="rounded-xl overflow-hidden bg-muted border shadow-sm">
              <div className="relative aspect-video bg-black">
                {/* LOCK Overlay (screenshot style) */}
                {!isAuthenticated && (
                  <div className="absolute inset-0 z-20 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center text-white p-6">
                    <div className="flex items-center gap-4">
                      <Lock className="h-10 w-10 opacity-90" />
                    </div>
                    <h3 className="text-2xl font-bold mt-3">
                      Unlock All Photos
                    </h3>
                    <p className="text-center max-w-md mt-2 text-white/90">
                      Sign in to view all {galleryImages.length} photos of this
                      beautiful property.
                    </p>
                    <div className="mt-5">
                      <Button
                        asChild
                        size="lg"
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        <Link to="/sign-in">Sign In to View</Link>
                      </Button>
                    </div>
                  </div>
                )}

                {/* Main Image */}
                <ImageWithFallback
                  src={galleryImages[currentImageIndex]}
                  alt={street_address || "Property image"}
                  className="w-full h-full object-cover"
                />

                {/* Prev / Next arrows (visible for authenticated users) */}
                <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none">
                  <button
                    aria-label="Previous image"
                    onClick={() => handleImageNavigation("prev")}
                    className={`pointer-events-auto rounded-full bg-white/85 hover:bg-white shadow-md p-2 ${
                      !isAuthenticated ? "opacity-0" : "opacity-100"
                    }`}
                    style={{ transition: "opacity 150ms" }}
                  >
                    <ChevronLeft className="h-5 w-5 text-foreground" />
                  </button>
                  <button
                    aria-label="Next image"
                    onClick={() => handleImageNavigation("next")}
                    className={`pointer-events-auto rounded-full bg-white/85 hover:bg-white shadow-md p-2 ${
                      !isAuthenticated ? "opacity-0" : "opacity-100"
                    }`}
                    style={{ transition: "opacity 150ms" }}
                  >
                    <ChevronRight className="h-5 w-5 text-foreground" />
                  </button>
                </div>

                {/* Image counter for authenticated */}
                {isAuthenticated && (
                  <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm">
                    {currentImageIndex + 1} / {galleryImages.length}
                  </div>
                )}
              </div>

              {/* Thumbnails strip */}
              {isAuthenticated && galleryImages.length > 1 && (
                <div className="p-4 border-t">
                  <div className="flex gap-3 overflow-x-auto pb-1">
                    {galleryImages.slice(0, 8).map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`flex-shrink-0 rounded-md overflow-hidden border transition-transform duration-200 ${
                          idx === currentImageIndex
                            ? "ring-2 ring-primary ring-offset-2"
                            : "opacity-80 hover:opacity-100"
                        }`}
                        style={{
                          width: isMobile ? 90 : 120,
                          height: isMobile ? 70 : 90,
                        }}
                        aria-label={`Thumbnail ${idx + 1}`}
                      >
                        <ImageWithFallback
                          src={img}
                          alt={`Thumbnail ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Tabs (Details / Features / Map) */}
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6 h-auto p-1 bg-muted/50 rounded-xl">
                <TabsTrigger
                  value="details"
                  className="py-2.5 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  Details
                </TabsTrigger>
                <TabsTrigger
                  value="features"
                  className="py-2.5 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  Features
                </TabsTrigger>
                <TabsTrigger
                  value="map"
                  className="py-2.5 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  Map
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="details"
                className="space-y-6 animate-in fade-in-50 duration-300"
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 bg-card border rounded-xl shadow-sm">
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                      Bedrooms
                    </p>
                    <p className="text-xl font-semibold">
                      {bedrooms_total ?? "—"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                      Bathrooms
                    </p>
                    <p className="text-xl font-semibold">
                      {bathroom_total ?? "—"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                      Square Feet
                    </p>
                    <p className="text-xl font-semibold">
                      {square_feet || "N/A"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                      Year Built
                    </p>
                    <p className="text-xl font-semibold">
                      {year_built || "N/A"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                      Type
                    </p>
                    <p className="text-lg font-medium">{type || "N/A"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                      ID® Number
                    </p>
                    <p className="text-lg font-medium">{listing_id || "—"}</p>
                  </div>
                </div>

                <div className="p-6 bg-card border rounded-xl shadow-sm">
                  <h3 className="text-lg font-semibold mb-4">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {description ||
                      `Beautiful ${bedrooms_total ?? "—"} bedroom, ${
                        bathroom_total ?? "—"
                      } bathroom ${type?.toLowerCase() ?? ""} in ${city || ""}. This property offers modern amenities and a great location.`}
                  </p>
                </div>
              </TabsContent>

              <TabsContent
                value="features"
                className="animate-in fade-in-50 duration-300"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-card border rounded-xl shadow-sm">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      Interior Features
                    </h3>
                    <ul className="space-y-3">
                      {interiorFeaturesList.map(
                        (feature: any, index: number) => (
                          <li
                            key={index}
                            className="flex items-start gap-3 text-muted-foreground"
                          >
                            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary/40 shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      Exterior Features
                    </h3>
                    <ul className="space-y-3">
                      {exteriorFeaturesList.map(
                        (feature: any, index: number) => (
                          <li
                            key={index}
                            className="flex items-start gap-3 text-muted-foreground"
                          >
                            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary/40 shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                </div>
              </TabsContent>

              <TabsContent
                value="map"
                className="animate-in fade-in-50 duration-300"
              >
                <div className="p-1 bg-card border rounded-xl shadow-sm overflow-hidden">
                  {latitude && longitude ? (
                    <SinglePropertyMap
                      latitude={Number(latitude)}
                      longitude={Number(longitude)}
                    />
                  ) : (
                    <div className="aspect-video flex items-center justify-center bg-muted rounded-lg p-6">
                      <div className="text-center">
                        <MapPin className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-50" />
                        <p className="text-muted-foreground font-medium">
                          Map location not available
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* RIGHT: Price / Agent / Similar (sticky) */}
          <aside className="space-y-6 lg:col-span-2">
            <div className="p-6 bg-card border rounded-xl shadow-sm ">
              <div>
                <p className="text-sm text-muted-foreground mb-1 font-medium tracking-wide uppercase">
                  {city}, {province}
                </p>
                <h1 className="text-2xl font-bold leading-tight mb-2 truncate">
                  {street_address}
                </h1>
                <p className="text-3xl font-bold text-primary">
                  ₹{Number(price || 0).toLocaleString("en-IN")}
                </p>
              </div>

              <div className="pt-6 border-t mt-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-full bg-muted overflow-hidden border flex items-center justify-center">
                    {agent?.avatar ? (
                      <ImageWithFallback
                        src={agent.avatar}
                        alt={agent.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold">
                      {agent?.name || "Real Group Realtor®"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {agent?.email || "Licensed Realtor®"}
                    </p>
                    {agent?.phoneNumber && (
                      <p className="text-xs text-muted-foreground">
                        {agent.phoneNumber}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-3 my-4">
                  <AgentContactDialog
                    agent={agent}
                    propertyAddress={street_address || ""}
                    propertyId={_id || id || ""}
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleShare}
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                  <Button
                    variant={isCurrentPropertySaved ? "default" : "outline"}
                    className={`flex-1 ${
                      isCurrentPropertySaved
                        ? "bg-red-50 text-red-600 hover:bg-red-100 border-red-200"
                        : ""
                    }`}
                    onClick={(e) => handleToggleWishlist(e, _id || id || "")}
                  >
                    <Heart
                      className={`mr-2 h-4 w-4 ${
                        isCurrentPropertySaved ? "fill-current" : ""
                      }`}
                    />
                    {isCurrentPropertySaved ? "Saved" : "Save"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Similar Properties on the right column (matches screenshot) */}
            {similarProperties && similarProperties.length > 0 && (
              <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b bg-muted/30">
                  <h3 className="font-semibold">Similar Properties</h3>
                </div>

                <div className="divide-y">
                  {similarProperties.map((prop: any, i: number) => {
                    const actual = prop?.properties || prop;
                    const thumb =
                      actual?.photo_url || actual?.photo || DEV_SAMPLE_IMAGE;
                    const priceVal =
                      actual?.price || actual?.properties?.price || "—";
                    const beds =
                      actual?.bedrooms_total ||
                      actual?.properties?.bedrooms_total ||
                      "—";
                    const baths =
                      actual?.bathroom_total ||
                      actual?.properties?.bathroom_total ||
                      "—";
                    const addr =
                      actual?.street_address ||
                      actual?.properties?.street_address ||
                      "—";
                    const propId =
                      actual?._id || actual?.id || actual?.listing_id; // Fallback ID
                    const isSaved = propId
                      ? wishlistIds.includes(propId)
                      : false;

                    return (
                      <div
                        key={i}
                        className="flex gap-4 p-4 hover:bg-muted/50 transition-colors cursor-pointer group items-start"
                        onClick={() =>
                          // If actual object has listing id, navigate there
                          navigate(
                            `/listings/${actual?.listing_id || actual?.properties?.listing_id || ""}`,
                          )
                        }
                      >
                        <div className="relative h-20 w-24 overflow-hidden rounded-md bg-muted shrink-0">
                          <ImageWithFallback
                            src={thumb}
                            alt={`Similar ${i}`}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <div className="flex-1 min-w-0 py-1">
                          <p className="font-semibold truncate">
                            ₹{Number(priceVal || 0).toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1 truncate">
                            {addr}
                          </p>
                          <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                            <span>{beds} Beds</span>
                            <span>{baths} Baths</span>
                          </div>
                        </div>
                        {propId && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 shrink-0 text-muted-foreground hover:text-red-500"
                            onClick={(e) => handleToggleWishlist(e, propId)}
                          >
                            <Heart
                              className={`h-4 w-4 ${
                                isSaved ? "fill-current text-red-500" : ""
                              }`}
                            />
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}
