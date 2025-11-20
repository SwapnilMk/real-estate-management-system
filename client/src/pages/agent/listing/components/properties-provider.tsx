import { createContext, useContext, useState, type ReactNode } from "react";
import { type Property } from "../data/schema";

interface PropertiesContextType {
  editingProperty: Property | null;
  setEditingProperty: (property: Property | null) => void;
  deletingProperty: Property | null;
  setDeletingProperty: (property: Property | null) => void;
  bulkDeletingProperties: Property[];
  setBulkDeletingProperties: (properties: Property[]) => void;
  isAddingProperty: boolean;
  setIsAddingProperty: (isAdding: boolean) => void;
}

const PropertiesContext = createContext<PropertiesContextType | undefined>(
  undefined,
);

export function PropertiesProvider({ children }: { children: ReactNode }) {
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [deletingProperty, setDeletingProperty] = useState<Property | null>(
    null,
  );
  const [bulkDeletingProperties, setBulkDeletingProperties] = useState<
    Property[]
  >([]);
  const [isAddingProperty, setIsAddingProperty] = useState(false);

  return (
    <PropertiesContext.Provider
      value={{
        editingProperty,
        setEditingProperty,
        deletingProperty,
        setDeletingProperty,
        bulkDeletingProperties,
        setBulkDeletingProperties,
        isAddingProperty,
        setIsAddingProperty,
      }}
    >
      {children}
    </PropertiesContext.Provider>
  );
}

export function useProperties() {
  const context = useContext(PropertiesContext);
  if (!context) {
    throw new Error("useProperties must be used within PropertiesProvider");
  }
  return context;
}
