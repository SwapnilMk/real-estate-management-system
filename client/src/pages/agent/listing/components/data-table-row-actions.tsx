import { type Row } from "@tanstack/react-table";
import { IconDotsVertical, IconEdit, IconTrash } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type Property } from "../data/schema";
import { useProperties } from "./properties-provider.tsx";

interface DataTableRowActionsProps {
  row: Row<Property>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { setEditingProperty, setDeletingProperty } = useProperties();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="data-[state=open]:bg-muted flex h-8 w-8 p-0"
        >
          <IconDotsVertical className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem onClick={() => setEditingProperty(row.original)}>
          <IconEdit className="text-muted-foreground mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => setDeletingProperty(row.original)}
          className="text-destructive focus:text-destructive"
        >
          <IconTrash className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
