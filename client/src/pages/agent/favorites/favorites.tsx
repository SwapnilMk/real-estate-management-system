import { useGetAgentFavoritesQuery } from "@/services/agentApi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, MapPin, BedDouble, Bath, Ruler } from "lucide-react";

export default function FavoritesPage() {
  const { data: favorites, isLoading } = useGetAgentFavoritesQuery();

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!favorites || favorites.length === 0) {
    return (
      <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Favorites</h1>
            <p className="text-muted-foreground">
              See which clients have favorited your properties.
            </p>
          </div>
        </div>
        <div className="flex h-[400px] items-center justify-center rounded-lg border border-dashed">
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-lg font-semibold">No favorites yet</h3>
            <p className="text-muted-foreground text-sm">
              None of your properties have been favorited by clients yet.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Favorites</h1>
          <p className="text-muted-foreground">
            See which clients have favorited your properties.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {favorites.map(({ property, users }) => (
          <Card key={property._id} className="overflow-hidden">
            <div className="aspect-video w-full overflow-hidden">
              <img
                src={property.photo_url || "/placeholder.svg"}
                alt={property.street_address}
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <CardTitle className="line-clamp-1 text-lg">
                    {property.street_address}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {property.city}, {property.province}
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="shrink-0">
                  ${property.price.toLocaleString()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <BedDouble className="h-4 w-4" />
                  {property.bedrooms_total} Beds
                </div>
                <div className="flex items-center gap-1">
                  <Bath className="h-4 w-4" />
                  {property.bathroom_total} Baths
                </div>
                <div className="flex items-center gap-1">
                  <Ruler className="h-4 w-4" />
                  {property.sizeInterior}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-medium leading-none">
                  Favorited by {users.length} client{users.length !== 1 && "s"}
                </h4>
                <ScrollArea className="h-[120px] w-full rounded-md border p-2">
                  <div className="space-y-3">
                    {users.map((user) => (
                      <div
                        key={user._id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                            />
                            <AvatarFallback>
                              {user.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="grid gap-0.5">
                            <p className="text-sm font-medium leading-none">
                              {user.name}
                            </p>
                            <p className="text-muted-foreground text-xs">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
