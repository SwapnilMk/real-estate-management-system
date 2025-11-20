import { PropertiesDialogs } from "./components/properties-dialogs";
import { PropertiesPrimaryButtons } from "./components/properties-primary-buttons";
import { PropertiesProvider } from "./components/properties-provider";
import { PropertiesTable } from "./components/properties-table";
import { PropertiesMutateDrawer } from "./components/properties-mutate-drawer";
import { useGetAgentPropertiesQuery } from "@/services/agentApi";

export default function Listing() {
  const {
    data: properties = [],
    isLoading,
    error,
  } = useGetAgentPropertiesQuery();

  return (
    <PropertiesProvider>
      <div className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">My Properties</h2>
            <p className="text-muted-foreground">
              Manage your property listings and track performance
            </p>
          </div>
          <PropertiesPrimaryButtons />
        </div>

        {isLoading ? (
          <div className="flex h-[400px] items-center justify-center">
            <p className="text-muted-foreground">Loading properties...</p>
          </div>
        ) : error ? (
          <div className="flex h-[400px] items-center justify-center">
            <p className="text-destructive">
              Error loading properties. Please try again.
            </p>
          </div>
        ) : (
          <PropertiesTable data={properties} />
        )}
      </div>

      <PropertiesDialogs />
      <PropertiesMutateDrawer />
    </PropertiesProvider>
  );
}
