import { type Row } from "@tanstack/react-table";
import { IconDotsVertical, IconEye } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type User } from "../data/schema";
import { useUsers } from "./users-provider";

interface DataTableRowActionsProps {
  row: Row<User>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { setViewingUser } = useUsers();

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
        <DropdownMenuItem onClick={() => setViewingUser(row.original)}>
          <IconEye className="text-muted-foreground mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
