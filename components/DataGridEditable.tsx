"use client";
import { useMemo } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useStore } from "@/lib/store";
import Input from "./ui/Input";

export default function DataGridEditable({
  title,
  kind,
  data,
}: {
  title: string;
  kind: "clients" | "workers" | "tasks";
  data: any[];
}) {
  const { updateCell, validations } = useStore();

  const columns = useMemo<ColumnDef<any>[]>(() => {
    if (!data?.length) return [];
    return Object.keys(data[0]).map((key) => ({
      header: key,
      accessorKey: key,
      cell: ({ getValue, row }) => {
        const value = getValue() as any;
        const id =
          row.original?.ClientID ||
          row.original?.WorkerID ||
          row.original?.TaskID;
        const err = validations.errors.find(
          (e) => e.kind === kind && e.rowId === id && e.field === key
        );
        return (
          <Input
            defaultValue={String(value ?? "")}
            onBlur={(e) => updateCell(kind, id, key, e.target.value)}
            className={err ? "border-red-500" : ""}
          />
        );
      },
    }));
  }, [data, kind, updateCell, validations.errors]);

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (!data?.length)
    return <div className="opacity-60">Upload {title} to begin.</div>;

  return (
    <div>
      <h3 className="font-medium mb-2">
        {title} ({data.length})
      </h3>
      <div className="table-wrap rounded-xl border">
        <table className="min-w-[720px] w-full text-sm">
          <thead className="sticky-header">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => (
                  <th key={h.id} className="text-left p-2 border-b">
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((r) => (
              <tr
                key={r.id}
                className="odd:bg-black/[0.02] dark:odd:bg-white/[0.05]"
              >
                {r.getVisibleCells().map((c) => (
                  <td key={c.id} className="p-2 border-b align-top">
                    {flexRender(c.column.columnDef.cell, c.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
