import { type Table } from "@tanstack/react-table";
import { IconTrash, IconX } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { type Property } from "../data/schema";
import { useProperties } from "./properties-provider.tsx";

interface DataTableBulkActionsProps {
  table: Table<Property>;
}

export function DataTableBulkActions({ table }: DataTableBulkActionsProps) {
  const { setBulkDeletingProperties } = useProperties();
  const selectedRows = table.getFilteredSelectedRowModel().rows;

  if (selectedRows.length === 0) {
    return null;
  }

  return (
    <div className="bg-background/95 supports-[backdrop-filter]:bg-background/60 fixed inset-x-0 bottom-0 z-50 mx-auto flex w-fit items-center gap-2 rounded-t-lg border p-4 shadow-2xl backdrop-blur max-sm:left-0 max-sm:w-full max-sm:rounded-none sm:bottom-4">
      <div className="flex items-center gap-2">
        <p className="text-sm font-medium">
          {selectedRows.length}{" "}
          {selectedRows.length === 1 ? "property" : "properties"} selected
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.toggleAllPageRowsSelected(false)}
        >
          <IconX className="mr-2 h-4 w-4" />
          Clear
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => {
            const properties = selectedRows.map((row) => row.original);
            setBulkDeletingProperties(properties);
          }}
        >
          <IconTrash className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </div>
    </div>
  );
}
