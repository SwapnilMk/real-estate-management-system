import { useParams } from "react-router-dom";
import {
  useGetPropertyByIdQuery,
  useGetSimilarPropertiesQuery,
} from "@/services/propertyApi";
import { PropertyDetail } from "./components/property-detail";

export default function PropertyDetailPage() {
  const { id } = useParams();

  const { data: property, isLoading } = useGetPropertyByIdQuery(id!);
  const { data: similar } = useGetSimilarPropertiesQuery(id!, { skip: !id });

  if (isLoading)
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-20">Loading...</div>
      </div>
    );
  if (!property) return <div>Property not found</div>;

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto max-w-7xl py-8">
        <PropertyDetail property={property} similarProperties={similar || []} />
      </main>
    </div>
  );
}
