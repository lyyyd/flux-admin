import type React from "react";
import type { ReactNode, ComponentType } from "react";
import type { RowData, TableOptions, Table } from "@tanstack/table-core";
import type { Option } from "@/types/data-table";

// Fallback declaration to ensure bundler resolution exposes expected exports
// from @tanstack/react-table when TS can't find them through package exports.
declare module "@tanstack/react-table" {
  export * from "@tanstack/table-core";

  export type Renderable<TProps> = ReactNode | ComponentType<TProps>;

  export function flexRender<TProps extends object>(
    Comp: Renderable<TProps>,
    props: TProps
  ): ReactNode;

  export function useReactTable<TData extends RowData>(
    options: TableOptions<TData>
  ): Table<TData>;
}

declare module "@tanstack/table-core" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    className?: string;
    thClassName?: string;
    tdClassName?: string;
    label?: string;
    placeholder?: string;
    variant?: string;
    options?: Option[];
    range?: [number, number];
    unit?: string;
    icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  }
}
