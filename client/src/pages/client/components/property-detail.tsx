import type { Property } from "@/services/propertyApi";
import { Badge } from "@/components/ui/badge";
import { PropertyCard } from "./property-card";
import { ContactForm } from "./contact-form";

interface PropertyDetailProps {
  property: Property;
  similarProperties: Property[];
}

export function PropertyDetail({
  property,
  similarProperties,
}: PropertyDetailProps) {
  const {
    photo_url,
    price,
    bedrooms_total,
    bathroom_total,
    street_address,
    city,
    province,
    type,
    postal_code,
    description,
    all_photos,
  } = property;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="relative aspect-w-16 aspect-h-9 rounded-lg overflow-hidden mb-4">
          <img
            src={photo_url}
            alt={street_address}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {all_photos &&
            Object.values(all_photos)
              .slice(0, 6)
              .map((photo, i) => (
                <div
                  key={i}
                  className="relative aspect-w-16 aspect-h-9 rounded-lg overflow-hidden"
                >
                  <img
                    src={photo}
                    alt={`Property photo ${i}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-bold">
            ${Number(price).toLocaleString()}
          </h2>
          <p className="text-lg">{street_address}</p>
          <p className="text-muted-foreground">
            {city}, {province} {postal_code}
          </p>
          <div className="flex gap-2 mt-4">
            <Badge variant="secondary">{bedrooms_total} bed</Badge>
            <Badge variant="secondary">{bathroom_total} bath</Badge>
            <Badge variant="secondary">{type}</Badge>
          </div>
          <div className="mt-8">
            <h3 className="font-semibold">Description</h3>
            <p className="text-muted-foreground">{description}</p>
          </div>
        </div>
      </div>
      <div>
        <div className="sticky top-24">
          <div className="border rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">Contact Agent</h3>
            <ContactForm />
          </div>
          <div className="mt-8">
            <h3 className="font-semibold">Similar Properties</h3>
            <div className="grid grid-cols-1 gap-4 mt-4">
              {similarProperties.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
