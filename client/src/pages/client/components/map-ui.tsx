import { useState, useCallback } from "react";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import { useGetPropertiesQuery } from "@/services/propertyApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setSelectedProperty,
  setHoveredProperty,
} from "@/features/properties/propertiesSlice";
import type { Property } from "@/services/propertyApi";
import { PropertyListUi } from "./property-list-ui";
import { Button } from "@/components/ui/button";
import { List, Map } from "lucide-react";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const center = {
  lat: 49.1913,
  lng: -122.849,
};

import { useGoogleMaps } from "@/components/google-maps-provider";

export function MapUI() {
  const dispatch = useAppDispatch();
  const { selectedProperty, filters } = useAppSelector(
    (state) => state.properties,
  );

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [bounds, setBounds] = useState<string | undefined>(undefined);
  const [showList, setShowList] = useState(false);

  const { isLoaded } = useGoogleMaps();

  const { data } = useGetPropertiesQuery({ ...filters, bounds });

  const properties = data?.properties || [];

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback() {
    setMap(null);
  }, []);

  const onBoundsChanged = () => {
    if (map) {
      const newBounds = map.getBounds();
      if (newBounds) {
        setBounds(newBounds.toUrlValue());
      }
    }
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="relative w-full h-screen">
      <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-background/90 backdrop-blur-sm flex justify-between items-center border-b">
        {showList ? (
          <Button variant="ghost" onClick={() => setShowList(false)}>
            <Map className="h-4 w-4" />
            Back to Map
          </Button>
        ) : (
          <Button variant="outline" size="sm" onClick={() => setShowList(true)}>
            <List className="h-4 w-4 mr-2" />
            List
          </Button>
        )}
      </div>
      <div className="w-full h-full">
        {showList ? (
          <PropertyListUi properties={properties} />
        ) : (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={11}
            onLoad={onLoad}
            onUnmount={onUnmount}
            onBoundsChanged={onBoundsChanged}
          >
            {properties.map((property: Property) => (
              <Marker
                key={property.id}
                position={{
                  lat: property.latitude!,
                  lng: property.longitude!,
                }}
                onClick={() => dispatch(setSelectedProperty(property.id))}
                onMouseOver={() => dispatch(setHoveredProperty(property.id))}
                onMouseOut={() => dispatch(setHoveredProperty(null))}
              />
            ))}
            {selectedProperty &&
              properties
                .filter((p) => p.id === selectedProperty)
                .map((property) => (
                  <InfoWindow
                    key={property.id}
                    position={{
                      lat: property.latitude!,
                      lng: property.longitude!,
                    }}
                    onCloseClick={() => dispatch(setSelectedProperty(null))}
                  >
                    <div>
                      <h2>{property.street_address}</h2>
                      <p>{property.price}</p>
                    </div>
                  </InfoWindow>
                ))}
          </GoogleMap>
        )}
      </div>
    </div>
  );
}
