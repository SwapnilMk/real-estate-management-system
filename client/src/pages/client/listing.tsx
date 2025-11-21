import { useState } from "react";
import { PropertyGrid } from "@/components/property-grid";
import { ListingsFilters } from "@/components/listings-filters";
import { Button } from "@/components/ui/button";
import {
  Map,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePropertyStore } from "@/lib/store";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { MobileFilters } from "@/components/mobile-filters";
import { useGetPropertiesQuery } from "@/services/propertyApi";

export default function ListingsPage() {
  const [sortBy, setSortBy] = useState("recommended");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [showFilters, setShowFilters] = useState(false);
  const { filters } = usePropertyStore();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const queryParams = {
    page: currentPage,
    limit: itemsPerPage,
    type: filters.type !== "any" ? filters.type : undefined,
    minPrice:
      filters.priceRange !== "any"
        ? filters.priceRange?.split("-")[0]
        : undefined,
    maxPrice:
      filters.priceRange !== "any"
        ? filters.priceRange?.split("-")[1]
        : undefined,
    beds: filters.beds !== "any" ? filters.beds : undefined,
    propertyType:
      filters.propertyType !== "any" ? filters.propertyType : undefined,
  };

  const { data, isLoading } = useGetPropertiesQuery(queryParams);

  const properties = data?.properties || [];
  const totalResults = data?.totalCount || 0;
  const totalPages = Math.ceil(totalResults / itemsPerPage);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="container mx-auto max-w-7xl px-4 py-4 md:py-8 flex-1">
        <div className="mb-4 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Surrey Real Estate
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Refine your real estate search by price, bedroom, or type listings.
          </p>
        </div>

        {isMobile ? (
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(true)}
            >
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px]">
                <ArrowUpDown className="mr-2 h-3 w-3" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recommended">Recommended</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ) : (
          <div className="flex items-center justify-between mb-6">
            <ListingsFilters />

            <div className="flex items-center gap-4">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <ArrowUpDown className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recommended">Recommended</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" asChild>
                <Link to="/map-search">
                  <Map className="mr-2 h-4 w-4" />
                  Map Search
                </Link>
              </Button>
            </div>
          </div>
        )}

        <div className="flex items-center justify-end mb-4">
          <p className="text-xs md:text-sm font-medium">
            Showing{" "}
            {totalResults > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} -{" "}
            {Math.min(currentPage * itemsPerPage, totalResults)} of{" "}
            {totalResults} homes for sale
          </p>
        </div>

        <PropertyGrid
          properties={properties}
          loading={isLoading}
          sortBy={sortBy}
        />

        {totalPages > 1 && (
          <div className="flex items-center justify-center mt-8">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage <= 1 || isLoading}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNumber =
                    currentPage <= 3
                      ? i + 1
                      : currentPage >= totalPages - 2
                        ? totalPages - 4 + i
                        : currentPage - 2 + i;

                  if (pageNumber <= 0 || pageNumber > totalPages) return null;

                  return (
                    <Button
                      key={pageNumber}
                      variant={
                        currentPage === pageNumber ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setCurrentPage(pageNumber)}
                      disabled={isLoading}
                      className="w-9"
                    >
                      {pageNumber}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) =>
                    prev < totalPages ? prev + 1 : prev,
                  )
                }
                disabled={currentPage >= totalPages || isLoading}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* Mobile Filters Sheet */}
      <Sheet open={showFilters} onOpenChange={setShowFilters}>
        <SheetContent side="left" className="w-[85vw] sm:w-[400px]">
          <MobileFilters onClose={() => setShowFilters(false)} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
