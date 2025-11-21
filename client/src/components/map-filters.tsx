import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePropertyStore } from "@/lib/store";
import { Input } from "@/components/ui/input";

import { useState } from "react";

export function MapFilters() {
  const { filters, setFilter, resetFilters } = usePropertyStore();
  const [searchTerm, setSearchTerm] = useState(filters.location || "");

  const handleSearch = () => {
    setFilter("location", searchTerm);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="p-4 border-b space-y-4 bg-background z-10">
      <div className="flex gap-2">
        <Input
          placeholder="Search location..."
          className="flex-1"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button variant="outline" onClick={handleSearch}>
          Search
        </Button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        <Select
          value={filters.type || "any"}
          onValueChange={(value) => setFilter("type", value)}
        >
          <SelectTrigger className="min-w-[100px]">
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
          <SelectTrigger className="min-w-[130px]">
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
          <SelectTrigger className="min-w-[90px]">
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

        <Button
          variant="ghost"
          size="sm"
          onClick={resetFilters}
          className="text-muted-foreground"
        >
          Reset
        </Button>
      </div>
    </div>
  );
}
