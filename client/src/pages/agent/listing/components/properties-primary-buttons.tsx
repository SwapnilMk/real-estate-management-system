import { IconPlus } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { useProperties } from "./properties-provider.tsx";

export function PropertiesPrimaryButtons() {
  const { setIsAddingProperty } = useProperties();

  return (
    <Button onClick={() => setIsAddingProperty(true)}>
      <IconPlus className="mr-2 h-4 w-4" />
      Add Property
    </Button>
  );
}
