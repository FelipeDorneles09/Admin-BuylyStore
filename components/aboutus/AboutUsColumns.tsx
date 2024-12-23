"use client";

import { ColumnDef } from "@tanstack/react-table";
import Delete from "../custom ui/Delete";
import Link from "next/link";

export const columns: ColumnDef<AboutUsType>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <Link
        href={`/aboutus/${row.original._id}`} // Usando _id em vez de title
        className="hover:text-red-1"
      >
        {row.original.title}
      </Link>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const maxLength = 100; // Define o número máximo de caracteres para exibir
      const description = row.original.description;
      return (
        <p>
          {description.length > maxLength
            ? description.slice(0, maxLength) + "..."
            : description}
        </p>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <Delete item="aboutus" id={row.original._id} />, // Usando _id em vez de title
  },
];
