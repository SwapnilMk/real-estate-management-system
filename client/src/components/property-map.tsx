import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import { useState, useCallback, useEffect, useRef } from "react";
import { usePropertyStore } from "@/lib/store";
import { useGetPropertiesQuery } from "@/services/propertyApi";
import { PropertyCard } from "./property-card";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const defaultCenter = {
  lat: 20.5937,
  lng: 78.9629,
};

interface PropertyMapProps {
  onLoadingChange?: (loading: boolean) => void;
}

import { useGoogleMaps } from "@/components/google-maps-provider";

export default function PropertyMap({ onLoadingChange }: PropertyMapProps) {
  const { isLoaded } = useGoogleMaps();

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [infoWindowOpen, setInfoWindowOpen] = useState<string | null>(null);
  const {
    filters,
    setVisibleProperties,
    setTotalVisibleCount,
    selectedProperty,
    setSelectedProperty,
    hoveredProperty,
  } = usePropertyStore();

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [bounds, setBounds] = useState<string | undefined>(undefined);

  const { data, isLoading } = useGetPropertiesQuery({
    ...filters,
    bounds,
    limit: 50,
  });

  useEffect(() => {
    if (onLoadingChange) {
      onLoadingChange(isLoading);
    }
  }, [isLoading, onLoadingChange]);

  useEffect(() => {
    if (data?.properties) {
      setVisibleProperties(data.properties);
      setTotalVisibleCount(data.totalCount);
    }
  }, [data, setVisibleProperties, setTotalVisibleCount]);

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback() {
    setMap(null);
  }, []);

  const onBoundsChanged = () => {
    if (map) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        const boundsObj = map.getBounds();
        if (boundsObj) {
          const ne = boundsObj.getNorthEast();
          const sw = boundsObj.getSouthWest();
          const boundsStr = `${sw.lng()},${sw.lat()},${ne.lng()},${ne.lat()}`;
          setBounds(boundsStr);
        }
      }, 500);
    }
  };

  useEffect(() => {
    if (selectedProperty && map && data?.properties) {
      const property = data.properties.find((p) => p.id === selectedProperty);
      if (property && property.latitude && property.longitude) {
        const boundsObj = map.getBounds();
        const position = new google.maps.LatLng(
          property.latitude,
          property.longitude,
        );

        if (boundsObj && !boundsObj.contains(position)) {
          map.panTo(position);
        }
        setTimeout(() => setInfoWindowOpen(selectedProperty), 0);
      }
    }
  }, [selectedProperty, map, data]);

  if (!isLoaded) {
    return <div className="h-full w-full bg-muted animate-pulse" />;
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={defaultCenter}
      zoom={6}
      onLoad={onLoad}
      onUnmount={onUnmount}
      onBoundsChanged={onBoundsChanged}
      options={{
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ],
      }}
    >
      {data?.properties.map((property) => (
        <Marker
          key={property.id}
          position={{
            lat: property.latitude || 0,
            lng: property.longitude || 0,
          }}
          onClick={() => {
            setSelectedProperty(property.id);
            setInfoWindowOpen(property.id);
          }}
          animation={
            hoveredProperty === property.id
              ? google.maps.Animation.BOUNCE
              : undefined
          }
          icon={{
            url:
              selectedProperty === property.id
                ? "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                : "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
          }}
        >
          {infoWindowOpen === property.id && (
            <InfoWindow
              onCloseClick={() => {
                setInfoWindowOpen(null);
                setSelectedProperty(null);
              }}
            >
              <div className="w-[200px] p-0 overflow-hidden">
                <PropertyCard property={property} />
              </div>
            </InfoWindow>
          )}
        </Marker>
      ))}
    </GoogleMap>
  );
}
