import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { usePropertyStore } from "@/lib/store";
import { X } from "lucide-react";

interface MobileFiltersProps {
  onClose: () => void;
}

export function MobileFilters({ onClose }: MobileFiltersProps) {
  const { filters, setFilter, resetFilters } = usePropertyStore();

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between py-4 border-b">
        <h2 className="text-lg font-semibold">Filters</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 py-6 space-y-6 overflow-y-auto">
        <div className="space-y-2">
          <Label>Property Type</Label>
          <Select
            value={filters.type || "any"}
            onValueChange={(value) => setFilter("type", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any Type</SelectItem>
              <SelectItem value="House">House</SelectItem>
              <SelectItem value="Condo">Condo</SelectItem>
              <SelectItem value="Townhouse">Townhouse</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Price Range</Label>
          <Select
            value={filters.priceRange || "any"}
            onValueChange={(value) => setFilter("priceRange", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select price range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any Price</SelectItem>
              <SelectItem value="0-5000000">Under ₹50L</SelectItem>
              <SelectItem value="5000000-10000000">₹50L - ₹1Cr</SelectItem>
              <SelectItem value="10000000-20000000">₹1Cr - ₹2Cr</SelectItem>
              <SelectItem value="20000000-">₹2Cr+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Bedrooms</Label>
          <Select
            value={filters.beds || "any"}
            onValueChange={(value) => setFilter("beds", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select bedrooms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any Beds</SelectItem>
              <SelectItem value="1">1+ Beds</SelectItem>
              <SelectItem value="2">2+ Beds</SelectItem>
              <SelectItem value="3">3+ Beds</SelectItem>
              <SelectItem value="4">4+ Beds</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Bathrooms</Label>
          <Select
            value={filters.baths || "any"}
            onValueChange={(value) => setFilter("baths", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select bathrooms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any Baths</SelectItem>
              <SelectItem value="1">1+ Baths</SelectItem>
              <SelectItem value="2">2+ Baths</SelectItem>
              <SelectItem value="3">3+ Baths</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="pt-4 border-t flex gap-4">
        <Button variant="outline" className="flex-1" onClick={resetFilters}>
          Reset
        </Button>
        <Button className="flex-1" onClick={onClose}>
          Show Results
        </Button>
      </div>
    </div>
  );
}
