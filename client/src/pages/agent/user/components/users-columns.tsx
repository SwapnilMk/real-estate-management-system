import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/data-table";
import { userRoles } from "../data/data";
import { type User } from "../data/schema";
import { DataTableRowActions } from "./data-table-row-actions";

export const usersColumns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <span className="max-w-[200px] truncate font-medium sm:max-w-[300px] md:max-w-[400px]">
            {row.original.name}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => {
      return (
        <div className="max-w-[200px] truncate sm:max-w-[300px] md:max-w-[400px]">
          {row.original.email}
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => {
      const role = userRoles.find((r) => r.value === row.original.role);

      if (!role) {
        return <Badge variant="outline">{row.original.role}</Badge>;
      }

      return (
        <Badge variant="outline" className="flex w-fit items-center gap-1">
          {role.icon && <role.icon className="size-3" />}
          <span>{role.label}</span>
        </Badge>
      );
    },
    filterFn: (row, _id, value) => {
      return value.includes(row.original.role);
    },
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone Number",
    cell: ({ row }) => {
      return <div className="text-sm">{row.original.phoneNumber || "N/A"}</div>;
    },
    enableSorting: false,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
