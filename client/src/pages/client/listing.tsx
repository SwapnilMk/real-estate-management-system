import { useState } from "react";
import { useGetPropertiesQuery } from "@/services/propertyApi";
import { PropertyGrid } from "./components/property-grid";
import { ListingsFilters } from "./components/listings-filters";
import { MobileFilters } from "./components/mobile-filters";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  Filter,
  Map,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppSelector } from "@/store/hooks";
import { useNavigate } from "react-router-dom";

export default function ListingsPage() {
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("recommended");
  const [showFilters, setShowFilters] = useState(false);
  const filters = useAppSelector((state) => state.properties.filters);
  const navigate = useNavigate();

  const { data, isLoading } = useGetPropertiesQuery({
    page,
    limit: 12,
    ...filters,
  });

  const properties = data?.properties || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / 12);

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Surrey Real Estate</h1>
          <p className="text-muted-foreground">
            Refine your Surrey real estate search by price, bedroom, or type.
          </p>
        </div>

        {/* Desktop Filters */}
        <div className="hidden md:flex items-center justify-between mb-6">
          <ListingsFilters />
          <div className="flex items-center gap-4">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <ArrowUpDown className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recommended">Recommended</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => navigate("/map-search")}>
              <Map className="mr-2 h-4 w-4" />
              Map Search
            </Button>
          </div>
        </div>

        {/* Mobile Filters */}
        <div className="md:hidden flex items-center justify-between mb-6 px-4">
          <Button
            variant="outline"
            className="flex items-center gap-2 "
            onClick={() => setShowFilters(true)}
          >
            <Filter className="h-4 w-4" />
            <span className="text-sm">Filters</span>
          </Button>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <ArrowUpDown className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recommended">Recommended</SelectItem>
              <SelectItem value="price-asc">Low to High</SelectItem>
              <SelectItem value="price-desc">High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <p className="text-sm text-muted-foreground mb-6">
          Showing {(page - 1) * 12 + 1} - {Math.min(page * 12, totalCount)} of{" "}
          {totalCount} homes
        </p>

        <PropertyGrid
          properties={properties}
          loading={isLoading}
          sortBy={sortBy}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-10 gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <Button
                  key={pageNum}
                  variant={page === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPage(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </main>

      <Sheet open={showFilters} onOpenChange={setShowFilters}>
        <SheetContent side="left" className="w-full sm:max-w-md">
          <MobileFilters onClose={() => setShowFilters(false)} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
