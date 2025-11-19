import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Heart } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setFilter } from "@/features/properties/propertiesSlice";

export function ListingsFilters() {
  const dispatch = useAppDispatch();
  const { filters } = useAppSelector((state) => state.properties);

  const handleFilterChange = (filterName: string, value: string) => {
    dispatch(setFilter({ filterName, value }));
  };

  return (
    <div className="flex items-center gap-2 px-4 md:px-0">
      {/* Listing Type */}
      <Select
        value={filters.type || "for-sale"}
        onValueChange={(value) => handleFilterChange("type", value)}
      >
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder="Listing Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="for-sale">For Sale</SelectItem>
          <SelectItem value="for-rent">For Rent</SelectItem>
          <SelectItem value="sold">Sold</SelectItem>
        </SelectContent>
      </Select>

      {/* Price Range */}
      <Select
        value={filters.priceRange || "any"}
        onValueChange={(value) => handleFilterChange("priceRange", value)}
      >
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder="Price" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="any">Any Price</SelectItem>
          <SelectItem value="0-300000">Under ₹300k</SelectItem>
          <SelectItem value="300000-500000">$300k-500k</SelectItem>
          <SelectItem value="500000-750000">$500k-750k</SelectItem>
          <SelectItem value="750000-1000000">$750k-1M</SelectItem>
          <SelectItem value="1000000+">$1M+</SelectItem>
        </SelectContent>
      </Select>

      {/* Bedrooms */}
      <Select
        value={filters.beds || "any"}
        onValueChange={(value) => handleFilterChange("beds", value)}
      >
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder="Beds" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="any">0+ Bed</SelectItem>
          <SelectItem value="1">1+ Bed</SelectItem>
          <SelectItem value="2">2+ Beds</SelectItem>
          <SelectItem value="3">3+ Beds</SelectItem>
          <SelectItem value="4">4+ Beds</SelectItem>
          <SelectItem value="5">5+ Beds</SelectItem>
        </SelectContent>
      </Select>

      {/* Property Type */}
      <Select
        value={filters.propertyType || "any"}
        onValueChange={(value) => handleFilterChange("propertyType", value)}
      >
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder="Home Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="any">Any Type</SelectItem>
          <SelectItem value="house">House</SelectItem>
          <SelectItem value="condo">Condo</SelectItem>
          <SelectItem value="townhouse">Townhouse</SelectItem>
          <SelectItem value="duplex">Duplex</SelectItem>
          <SelectItem value="land">Land</SelectItem>
        </SelectContent>
      </Select>

      {/* More Filters */}
      <Button variant="outline">More</Button>

      {/* Save */}
      <Button variant="outline" className="ml-2">
        <Heart className="mr-2 h-4 w-4" />
        Save Search
      </Button>
    </div>
  );
}
