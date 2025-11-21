import { GoogleMap, Marker } from "@react-google-maps/api";
import { useMemo } from "react";
import { MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const containerStyle = {
  width: "100%",
  height: "450px",
  borderRadius: "0.5rem",
};

interface SinglePropertyMapProps {
  latitude: number;
  longitude: number;
}

import { useGoogleMaps } from "@/components/google-maps-provider";

export function SinglePropertyMap({
  latitude,
  longitude,
}: SinglePropertyMapProps) {
  const { isLoaded } = useGoogleMaps();

  const center = useMemo(
    () => ({
      lat: latitude,
      lng: longitude,
    }),
    [latitude, longitude],
  );

  const handleOpenGoogleMaps = () => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
      "_blank",
    );
  };

  if (!isLoaded) {
    return (
      <div className="h-[450px] w-full bg-muted animate-pulse rounded-lg flex items-center justify-center">
        <MapPin className="h-10 w-10 text-muted-foreground opacity-20" />
      </div>
    );
  }

  return (
    <div className="relative group">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={15}
        options={{
          mapTypeControl: false,
          streetViewControl: true,
          fullscreenControl: true,
          zoomControl: true,
        }}
      >
        <Marker position={center} />
      </GoogleMap>

      <div className="absolute bottom-4 left-4 z-10">
        <Button
          variant="secondary"
          size="sm"
          className="shadow-md bg-white/90 hover:bg-white"
          onClick={handleOpenGoogleMaps}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          View on Google Maps
        </Button>
      </div>
    </div>
  );
}
