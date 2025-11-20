import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DataTableColumnHeader } from "@/components/data-table";
import { propertyTypes, transactionTypes } from "../data/data";
import { type Property } from "../data/schema";
import { DataTableRowActions } from "./data-table-row-actions";

export const propertiesColumns: ColumnDef<Property>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "properties.photo_url",
    header: "Image",
    cell: ({ row }) => (
      <Avatar className="h-10 w-10 rounded-md">
        <AvatarImage
          src={row.original.properties.photo_url}
          alt={row.original.properties.street_address}
          className="object-cover"
        />
        <AvatarFallback className="rounded-md">
          {row.original.properties.type.charAt(0)}
        </AvatarFallback>
      </Avatar>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "properties.street_address",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Address" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <span className="max-w-[200px] truncate font-medium sm:max-w-[300px] md:max-w-[400px]">
            {row.original.properties.street_address}
          </span>
          <span className="text-muted-foreground text-xs">
            {row.original.properties.city}, {row.original.properties.province}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "properties.price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ row }) => {
      const price = parseFloat(row.original.properties.price);
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
      }).format(price);

      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "properties.type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => {
      const propertyType = propertyTypes.find(
        (type) => type.value === row.original.properties.type,
      );

      if (!propertyType) {
        return <Badge variant="outline">{row.original.properties.type}</Badge>;
      }

      return (
        <Badge variant="outline" className="flex w-fit items-center gap-1">
          {propertyType.icon && <propertyType.icon className="size-3" />}
          <span>{propertyType.label}</span>
        </Badge>
      );
    },
    filterFn: (row, _id, value) => {
      return value.includes(row.original.properties.type);
    },
  },
  {
    accessorKey: "properties.transaction_type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Transaction" />
    ),
    cell: ({ row }) => {
      const transactionType = transactionTypes.find(
        (type) => type.value === row.original.properties.transaction_type,
      );

      if (!transactionType) {
        return <Badge>{row.original.properties.transaction_type}</Badge>;
      }

      return (
        <Badge className="flex w-fit items-center gap-1">
          {transactionType.icon && <transactionType.icon className="size-3" />}
          <span>{transactionType.label}</span>
        </Badge>
      );
    },
    filterFn: (row, _id, value) => {
      return value.includes(row.original.properties.transaction_type);
    },
  },
  {
    accessorKey: "properties.bedrooms_total",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Beds/Baths" />
    ),
    cell: ({ row }) => {
      const beds = row.original.properties.bedrooms_total || "N/A";
      const baths = row.original.properties.bathroom_total || "N/A";
      return (
        <div className="text-sm">
          {beds} / {baths}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
