import { useGetClientInterestsQuery } from "@/services/interestApi";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, MessageSquare, Calendar, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function InquiryList() {
  const { data: interests, isLoading, isError } = useGetClientInterestsQuery();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p>Loading your inquiries...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12 text-red-500">
        <p>Failed to load inquiries. Please try again later.</p>
      </div>
    );
  }

  if (!interests || interests.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <MessageSquare className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No inquiries yet</h3>
          <p className="text-muted-foreground max-w-sm mb-6">
            You haven't contacted any agents yet. Browse properties and send
            inquiries to see them here.
          </p>
          <Button asChild>
            <Link to="/map-search">Explore Properties</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {interests.map((interest) => (
        <Card key={interest._id} className="overflow-hidden">
          <div className="flex flex-col md:flex-row gap-4 p-4">
            {/* Property Image */}
            <div className="w-full md:w-48 h-32 bg-muted rounded-md overflow-hidden shrink-0">
              <img
                src={
                  interest.propertyId.properties.photo_url ||
                  "/assets/placeholder.jpg"
                }
                alt={interest.propertyId.properties.street_address}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold truncate">
                    {interest.propertyId.properties.street_address}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {interest.propertyId.properties.city} • ₹
                    {interest.propertyId.properties.price.toLocaleString()}
                  </p>
                </div>
                <Badge
                  variant={
                    interest.status === "closed"
                      ? "secondary"
                      : interest.status === "contacted"
                        ? "default"
                        : "outline"
                  }
                >
                  {interest.status.charAt(0).toUpperCase() +
                    interest.status.slice(1)}
                </Badge>
              </div>

              <div className="bg-muted/50 p-3 rounded-md text-sm">
                <p className="text-muted-foreground line-clamp-2">
                  "{interest.message}"
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center text-xs text-muted-foreground">
                  <Calendar className="mr-1 h-3 w-3" />
                  Sent on {format(new Date(interest.createdAt), "MMM d, yyyy")}
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link to={`/listings/${interest.propertyId._id}`}>
                    View Property <ExternalLink className="ml-2 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
