import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setFilter, resetFilters } from "@/features/properties/propertiesSlice";

interface MobileFiltersProps {
  onClose: () => void;
}

export function MobileFilters({ onClose }: MobileFiltersProps) {
  const dispatch = useAppDispatch();
  const { filters } = useAppSelector((state) => state.properties);

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000000]);
  const [expanded, setExpanded] = useState<string | null>("price");

  const handlePriceChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
    dispatch(
      setFilter({
        filterName: "priceRange",
        value: `${value[0]}-${value[1]}`,
      }),
    );
  };

  const handleFilterChange = (filterName: string, value: string) => {
    dispatch(setFilter({ filterName, value }));
  };

  const handleReset = () => {
    dispatch(resetFilters());
    setPriceRange([0, 2000000]);
    onClose();
  };

  const handleApply = () => {
    onClose();
  };

  return (
    <div className="h-full flex flex-col px-2 pt-2 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between py-3 px-2 border-b">
        <h2 className="text-xl font-semibold">Filters</h2>
      </div>

      {/* Scrollable Filter Content */}
      <div className="flex-1 overflow-y-auto px-2 pt-4 pb-6">
        <Accordion
          type="single"
          collapsible
          value={expanded || undefined}
          onValueChange={(value) => setExpanded(value)}
        >
          {/* PRICE */}
          <AccordionItem value="price" className="border-b">
            <AccordionTrigger className="py-4 text-base font-medium">
              Price
            </AccordionTrigger>
            <AccordionContent>
              <div className="pb-6 px-1">
                <Slider
                  defaultValue={[0, 2000000]}
                  min={0}
                  max={2000000}
                  step={10000}
                  value={[priceRange[0], priceRange[1]]}
                  onValueChange={handlePriceChange}
                />
                <div className="flex justify-between mt-3 text-sm text-muted-foreground">
                  <span>${priceRange[0].toLocaleString()}</span>
                  <span>${priceRange[1].toLocaleString()}</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* BEDROOMS */}
          <AccordionItem value="beds" className="border-b">
            <AccordionTrigger className="py-4 text-base font-medium">
              Bedrooms
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-5 gap-2 pb-6 px-1">
                {["Any", "1+", "2+", "3+", "4+"].map((option, index) => (
                  <Button
                    key={index}
                    variant={
                      filters.beds === (index === 0 ? "any" : index.toString())
                        ? "default"
                        : "outline"
                    }
                    className="w-full"
                    onClick={() =>
                      handleFilterChange(
                        "beds",
                        index === 0 ? "any" : index.toString(),
                      )
                    }
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* BATHROOMS */}
          <AccordionItem value="baths" className="border-b">
            <AccordionTrigger className="py-4 text-base font-medium">
              Bathrooms
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-5 gap-2 pb-6 px-1">
                {["Any", "1+", "2+", "3+", "4+"].map((option, index) => (
                  <Button
                    key={option}
                    variant={
                      filters.baths === (index === 0 ? "any" : index.toString())
                        ? "default"
                        : "outline"
                    }
                    className="w-full"
                    onClick={() =>
                      handleFilterChange(
                        "baths",
                        index === 0 ? "any" : index.toString(),
                      )
                    }
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* PROPERTY TYPE */}
          <AccordionItem value="type" className="border-b">
            <AccordionTrigger className="py-4 text-base font-medium">
              Home Type
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-2 gap-2 pb-6 px-1">
                {[
                  "House",
                  "Condo",
                  "Townhouse",
                  "Multi-family",
                  "Land",
                  "Other",
                ].map((option) => (
                  <Button
                    key={option}
                    variant={
                      filters.propertyType === option.toLowerCase()
                        ? "default"
                        : "outline"
                    }
                    className="w-full"
                    onClick={() =>
                      handleFilterChange("propertyType", option.toLowerCase())
                    }
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* MORE FILTERS */}
          <AccordionItem value="more" className="border-b">
            <AccordionTrigger className="py-4 text-base font-medium">
              More Filters
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-6 pb-6 px-1">
                {/* Square Footage */}
                <div>
                  <h4 className="font-medium mb-2">Square Footage</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {["Any", "1000+", "1500+", "2000+", "2500+", "3000+"].map(
                      (option) => (
                        <Button
                          key={option}
                          variant="outline"
                          className="w-full"
                        >
                          {option}
                        </Button>
                      ),
                    )}
                  </div>
                </div>

                {/* Year Built */}
                <div>
                  <h4 className="font-medium mb-2">Year Built</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {["2010+", "2000+", "1990+", "1980+"].map((option) => (
                      <Button key={option} variant="outline" className="w-full">
                        {option}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h4 className="font-medium mb-2">Features</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {["Garage", "Pool", "Waterfront", "Basement"].map((f) => (
                      <Button key={f} variant="outline" className="w-full">
                        {f}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Footer Buttons */}
      <div className="flex items-center justify-between py-4 px-2 border-t bg-white">
        <Button variant="outline" onClick={handleReset} className="flex-1 mr-2">
          Reset All
        </Button>
        <Button onClick={handleApply} className="flex-1 ml-2">
          Apply Filters
        </Button>
      </div>
    </div>
  );
}
