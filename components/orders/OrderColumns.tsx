"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export const columns: ColumnDef<OrderColumnType>[] = [
  {
    accessorKey: "_id",
    header: "Order",
    cell: ({ row }) => (
      <Link href={`/orders/${row.original._id}`} className="hover:text-red-1">
        {row.original._id}
      </Link>
    ),
  },
  {
    accessorKey: "customer",
    header: "Customer",
  },
  {
    accessorKey: "products",
    header: "Products",
  },
  {
    accessorKey: "totalAmount",
    header: "Total Amount",
    cell: ({ row }) => (
      <span>R$ {(row.original.totalAmount ?? 0).toFixed(2)}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status || "pago";
      return (
        <span
          className={
            status === "pago"
              ? "text-green-500 font-medium"
              : "text-red-500 font-medium"
          }
        >
          {status === "pago" ? "Pago" : "Pendente"}
        </span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
  },
];
