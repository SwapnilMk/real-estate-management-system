import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  type SortingState,
  type VisibilityState,
  type ColumnFiltersState,
  type PaginationState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination, DataTableToolbar } from "@/components/data-table";
import { userRoles } from "../data/data";
import { type User } from "../data/schema";
import { usersColumns as columns } from "./users-columns";

type UsersTableProps = {
  data: User[];
};

export function UsersTable({ data }: UsersTableProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  // Local UI-only states
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  // URL-synced states
  const [globalFilter, setGlobalFilter] = useState(
    searchParams.get("filter") || "",
  );
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(() => {
    const filters: ColumnFiltersState = [];
    const roleFilter = searchParams.get("role");

    if (roleFilter) {
      filters.push({ id: "role", value: roleFilter.split(",") });
    }

    return filters;
  });

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: parseInt(searchParams.get("page") || "1") - 1,
    pageSize: parseInt(searchParams.get("pageSize") || "10"),
  });

  // Update URL when filters change
  const handleGlobalFilterChange = (value: string) => {
    setGlobalFilter(value);
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("filter", value);
    } else {
      params.delete("filter");
    }
    setSearchParams(params);
  };

  const handleColumnFiltersChange = (
    updater:
      | ColumnFiltersState
      | ((old: ColumnFiltersState) => ColumnFiltersState),
  ) => {
    const newFilters =
      typeof updater === "function" ? updater(columnFilters) : updater;
    setColumnFilters(newFilters);
    const params = new URLSearchParams(searchParams);

    newFilters.forEach((filter) => {
      if (filter.id === "role" && Array.isArray(filter.value)) {
        params.set("role", filter.value.join(","));
      }
    });

    // Remove params if no filter
    if (!newFilters.find((f) => f.id === "role")) {
      params.delete("role");
    }

    setSearchParams(params);
  };

  const handlePaginationChange = (updater: any) => {
    const newPagination =
      typeof updater === "function" ? updater(pagination) : updater;
    setPagination(newPagination);

    const params = new URLSearchParams(searchParams);
    params.set("page", String(newPagination.pageIndex + 1));
    params.set("pageSize", String(newPagination.pageSize));
    setSearchParams(params);
  };

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      columnFilters,
      globalFilter,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    globalFilterFn: (row, _columnId, filterValue) => {
      const name = String(row.original.name).toLowerCase();
      const email = String(row.original.email).toLowerCase();
      const searchValue = String(filterValue).toLowerCase();

      return name.includes(searchValue) || email.includes(searchValue);
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onPaginationChange: handlePaginationChange,
    onGlobalFilterChange: handleGlobalFilterChange,
    onColumnFiltersChange: handleColumnFiltersChange,
  });

  return (
    <div
      className={cn(
        'max-sm:has-[div[role="toolbar"]]:mb-16',
        "flex flex-1 flex-col gap-4",
      )}
    >
      <DataTableToolbar
        table={table}
        searchPlaceholder="Filter by name or email..."
        filters={[
          {
            columnId: "role",
            title: "Role",
            options: userRoles,
          },
        ]}
      />
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} className="mt-auto" />
    </div>
  );
}
