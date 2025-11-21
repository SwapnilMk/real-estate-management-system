import { useState } from "react";
import { Button } from "@/components/ui/button";
import { List, Map as MapIcon } from "lucide-react";
import PropertyMap from "./property-map";
import { PropertyList } from "./property-list";
import { MapFilters } from "./map-filters";

export function MapUI() {
  const [view, setView] = useState<"map" | "list">("map");

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col relative">
      <div className="absolute top-0 left-0 right-0 z-10">
        <MapFilters />
      </div>

      <div className="flex-1 relative mt-[140px]">
        {view === "map" ? <PropertyMap /> : <PropertyList />}
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
        <Button
          className="rounded-full shadow-lg"
          onClick={() => setView(view === "map" ? "list" : "map")}
        >
          {view === "map" ? (
            <>
              <List className="mr-2 h-4 w-4" />
              List View
            </>
          ) : (
            <>
              <MapIcon className="mr-2 h-4 w-4" />
              Map View
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
