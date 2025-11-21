import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePropertyStore } from "@/lib/store";

export function ListingsFilters() {
  const { filters, setFilter, resetFilters } = usePropertyStore();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select
        value={filters.type || "any"}
        onValueChange={(value) => setFilter("type", value)}
      >
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="any">Any Type</SelectItem>
          <SelectItem value="House">House</SelectItem>
          <SelectItem value="Condo">Condo</SelectItem>
          <SelectItem value="Townhouse">Townhouse</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.priceRange || "any"}
        onValueChange={(value) => setFilter("priceRange", value)}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Price" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="any">Any Price</SelectItem>
          <SelectItem value="0-5000000">Under ₹50L</SelectItem>
          <SelectItem value="5000000-10000000">₹50L - ₹1Cr</SelectItem>
          <SelectItem value="10000000-20000000">₹1Cr - ₹2Cr</SelectItem>
          <SelectItem value="20000000-">₹2Cr+</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.beds || "any"}
        onValueChange={(value) => setFilter("beds", value)}
      >
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Beds" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="any">Any Beds</SelectItem>
          <SelectItem value="1">1+ Beds</SelectItem>
          <SelectItem value="2">2+ Beds</SelectItem>
          <SelectItem value="3">3+ Beds</SelectItem>
          <SelectItem value="4">4+ Beds</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.baths || "any"}
        onValueChange={(value) => setFilter("baths", value)}
      >
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Baths" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="any">Any Baths</SelectItem>
          <SelectItem value="1">1+ Baths</SelectItem>
          <SelectItem value="2">2+ Baths</SelectItem>
          <SelectItem value="3">3+ Baths</SelectItem>
        </SelectContent>
      </Select>

      <Button
        variant="ghost"
        onClick={resetFilters}
        className="text-muted-foreground"
      >
        Reset
      </Button>
    </div>
  );
}
