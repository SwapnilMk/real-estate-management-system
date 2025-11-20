import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface RecentSalesProps {
  properties?: any[];
}

export function RecentSales({ properties = [] }: RecentSalesProps) {
  return (
    <div className="space-y-8">
      {properties.length === 0 && (
        <p className="text-muted-foreground text-sm">No recent properties.</p>
      )}
      {properties.map((property: any) => (
        <div key={property._id} className="flex items-center gap-4">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/avatars/01.png" alt="Property" />
            <AvatarFallback>P</AvatarFallback>
          </Avatar>
          <div className="flex flex-1 flex-wrap items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm leading-none font-medium">
                {property.properties.street_address}, {property.properties.city}
              </p>
              <p className="text-muted-foreground text-sm">
                {property.properties.type}
              </p>
            </div>
            <div className="font-medium">${property.properties.price}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
