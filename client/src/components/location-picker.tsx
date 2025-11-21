import { useCallback, useEffect, useRef, useState } from "react";
import { GoogleMap, Marker, Autocomplete } from "@react-google-maps/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Search } from "lucide-react";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = {
  lat: 20.5937, // Center of India
  lng: 78.9629,
};

interface LocationPickerProps {
  latitude?: string;
  longitude?: string;
  onLocationChange: (lat: number, lng: number, address?: string) => void;
}

import { useGoogleMaps } from "@/components/google-maps-provider";

export function LocationPicker({
  latitude,
  longitude,
  onLocationChange,
}: LocationPickerProps) {
  const { isLoaded } = useGoogleMaps();

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markerPosition, setMarkerPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [searchBox, setSearchBox] =
    useState<google.maps.places.Autocomplete | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (latitude && longitude) {
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        setMarkerPosition((prev) => {
          if (prev && prev.lat === lat && prev.lng === lng) return prev;
          return { lat, lng };
        });
      }
    }
  }, [latitude, longitude]);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const onMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        setMarkerPosition({ lat, lng });
        onLocationChange(lat, lng);

        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          if (status === "OK" && results && results[0]) {
            onLocationChange(lat, lng, results[0].formatted_address);
          }
        });
      }
    },
    [onLocationChange],
  );

  const onPlaceChanged = () => {
    if (searchBox) {
      const place = searchBox.getPlace();
      if (place.geometry?.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        setMarkerPosition({ lat, lng });
        onLocationChange(lat, lng, place.formatted_address);

        if (map) {
          map.panTo({ lat, lng });
          map.setZoom(15);
        }
      }
    }
  };

  const onAutocompleteLoad = (
    autocomplete: google.maps.places.Autocomplete,
  ) => {
    setSearchBox(autocomplete);
  };

  if (!isLoaded) {
    return (
      <div className="w-full h-[400px] bg-muted animate-pulse rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Location
        </Label>
        <p className="text-sm text-muted-foreground">
          Search for a location or click on the map to set coordinates
        </p>
      </div>

      {/* Search Box */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Autocomplete
          onLoad={onAutocompleteLoad}
          onPlaceChanged={onPlaceChanged}
          options={{
            componentRestrictions: { country: "in" }, // Restrict to India
          }}
        >
          <Input
            ref={searchInputRef}
            type="text"
            placeholder="Search for an address or location..."
            className="pl-10"
          />
        </Autocomplete>
      </div>

      {/* Map */}
      <div className="border rounded-lg overflow-hidden">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={markerPosition || defaultCenter}
          zoom={markerPosition ? 15 : 5}
          onLoad={onLoad}
          onUnmount={onUnmount}
          onClick={onMapClick}
          options={{
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true,
            styles: [
              {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }],
              },
            ],
          }}
        >
          {markerPosition && (
            <Marker
              position={markerPosition}
              draggable={true}
              onDragEnd={(e) => {
                if (e.latLng) {
                  const lat = e.latLng.lat();
                  const lng = e.latLng.lng();
                  setMarkerPosition({ lat, lng });
                  onLocationChange(lat, lng);

                  const geocoder = new google.maps.Geocoder();
                  geocoder.geocode(
                    { location: { lat, lng } },
                    (results, status) => {
                      if (status === "OK" && results && results[0]) {
                        onLocationChange(
                          lat,
                          lng,
                          results[0].formatted_address,
                        );
                      }
                    },
                  );
                }
              }}
            />
          )}
        </GoogleMap>
      </div>

      {/* Coordinates Display */}
      {markerPosition && (
        <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
          <div>
            <Label className="text-xs text-muted-foreground">Latitude</Label>
            <p className="font-mono text-sm">{markerPosition.lat.toFixed(6)}</p>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Longitude</Label>
            <p className="font-mono text-sm">{markerPosition.lng.toFixed(6)}</p>
          </div>
        </div>
      )}
    </div>
  );
}
