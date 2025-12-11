"use client";

import { type Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { DataTablePagination as BasePagination } from "@/components/table/data-table-pagination";
import { DataTableFacetedFilter } from "@/components/table/data-table-faceted-filter";
import { DataTableViewOptions } from "@/components/table/data-table-view-options";
import { cn } from "@/lib/utils";
import type { Option } from "@/types/data-table";
import { Cross2Icon } from "@radix-ui/react-icons";
import * as React from "react";

export type FacetFilter = {
  columnId: string;
  title: string;
  options: Option[];
};

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  searchPlaceholder?: string;
  filters?: FacetFilter[];
  className?: string;
}

export function DataTableToolbar<TData>({
  table,
  searchPlaceholder = "Search...",
  filters = [],
  className
}: DataTableToolbarProps<TData>) {
  const isFiltered =
    table.getState().columnFilters.length > 0 ||
    !!table.getState().globalFilter;

  const reset = React.useCallback(() => {
    table.resetColumnFilters();
    table.setGlobalFilter("");
  }, [table]);

  return (
    <div
      role="toolbar"
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <div className="flex flex-1 flex-wrap items-center gap-2">
        <Input
          value={(table.getState().globalFilter as string) ?? ""}
          onChange={(e) => table.setGlobalFilter(e.target.value)}
          placeholder={searchPlaceholder}
          className="h-9 w-full sm:w-64"
        />
        {filters.map((filter) => {
          const column = table.getColumn(filter.columnId);
          if (!column) return null;
          return (
            <DataTableFacetedFilter
              key={filter.columnId}
              column={column}
              title={filter.title}
              options={filter.options}
              multiple
            />
          );
        })}
        {isFiltered && (
          <Button
            variant="outline"
            size="sm"
            className="border-dashed"
            onClick={reset}
          >
            <Cross2Icon className="mr-1" />
            重置
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2 self-end sm:self-auto">
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}

export function DataTablePagination<TData>({
  table,
  className
}: {
  table: Table<TData>;
  className?: string;
}) {
  return <BasePagination table={table} className={className} />;
}

interface DataTableBulkActionsProps<TData> {
  table: Table<TData>;
  entityName?: string;
  children: React.ReactNode;
  className?: string;
}

export function DataTableBulkActions<TData>({
  table,
  entityName,
  children,
  className
}: DataTableBulkActionsProps<TData>) {
  const selectedCount = table.getFilteredSelectedRowModel().rows.length;
  if (selectedCount === 0) return null;

  return (
    <div
      className={cn(
        "border-border bg-muted/80 text-foreground flex flex-wrap items-center gap-2 rounded-lg border p-3",
        className
      )}
    >
      <span className="text-muted-foreground text-sm">
        已选择 {selectedCount} {entityName ?? "items"}
      </span>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}

export { DataTable } from "@/components/table/data-table";
export { DataTableColumnHeader };
