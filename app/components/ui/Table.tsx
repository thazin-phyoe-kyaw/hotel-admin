"use client";

import { useState, useMemo } from "react";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  OctagonX,
  Pencil,
  PlusCircleIcon,
  Search,
  SquarePen,
  Trash2,
} from "lucide-react";
import { Column, TableProps } from "@/app/types/table";
import { getPaginationNumbers } from "@/app/lib/helpers/pagination";

export default function DataTable<T extends { id: string | number }>({
  columns,
  data,
  onEdit,
  onDelete,
  onAdd,
  searchPlaceholder = "Search...",
  name,
}: TableProps<T>) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);

  const ITEMS_PER_PAGE = 10;

  // SEARCH
  const filteredData = useMemo(() => {
    return data.filter((row) =>
      Object.values(row).join(" ").toLowerCase().includes(search.toLowerCase()),
    );
  }, [data, search]);

  // SORT
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;

    return [...filteredData].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];

      if (valA < valB) return sortDir === "asc" ? -1 : 1;
      if (valA > valB) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortKey, sortDir]);

  // PAGINATION
  const totalPages = Math.ceil(sortedData.length / ITEMS_PER_PAGE);
  const pagedData = sortedData.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  const emptyRows = ITEMS_PER_PAGE - pagedData.length;

  function toggleSort(key: keyof T) {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  return (
    <div className="bg-white shadow rounded-md p-2 flex flex-col h-[calc(100vh-170px)]">
      {/* Search */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">{name?.toUpperCase()} </h1>
        <div className="ml-auto flex items-center">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="shadow-sm border border-gray-400 pl-10 pr-3 py-2 rounded-lg focus:outline-none  focus:ring-1 focus:ring-[#b778e9] focus:border-[#b778e9] transition w-fullb"
            />
          </div>

          <button
            className="ml-3 flex items-center bg-[#b778e9]  text-white px-3 py-2 rounded-lg hover:bg-[#804ba8]"
            onClick={() => onAdd && onAdd()}
          >
            <PlusCircleIcon className="w-5 h-5 mr-2" />
            Add {name}
          </button>
        </div>
      </div>

      {/* table container */}
      <div className=" flex-1 overflow-y-auto rounded-xl shadow-sm border border-gray-200">
        <table className="w-full border-collapse h-full">
          <thead className="sticky top-0 bg-white z-10 shadow-sm">
            <tr className="text-gray-600">
              {columns.map((col) => (
                <th key={String(col.key)} className="px-4 py-3  text-left ">
                  <div
                    className={`flex items-center gap-1 ${
                      col.sortable ? "cursor-pointer" : ""
                    }`}
                    onClick={() => col.sortable && toggleSort(col.key)}
                  >
                    {col.label}
                    {/* {col.sortable && <ArrowUpDown size={14} />} */}
                  </div>
                </th>
              ))}
              <th className="px-4 py-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* REAL ROWS */}
            {pagedData.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-gray-50 transition-colors shadow-xs last:border-none"
              >
                {columns.map((col) => (
                  <td
                    key={String(col.key)}
                    className="px-4 py-2 text-gray-700 text-sm"
                  >
                    {col.render ? col.render(row) : String(row[col.key])}
                  </td>
                ))}

                <td className="px-4 py-4 flex gap-4">
                  <SquarePen
                    size={18}
                    className="text-[#b778e9] hover:text-[#804ba8] cursor-pointer"
                    onClick={() => onEdit && onEdit(row)}
                  />
                  <OctagonX
                    size={18}
                    className="text-red-600 hover:text-red-800 cursor-pointer"
                    onClick={() => onDelete && onDelete(row.id)}
                  />
                </td>
              </tr>
            ))}

            {/* FILLER ROWS */}
            {Array.from({ length: emptyRows }).map((_, index) => (
              <tr key={`empty-${index}`}>
                {columns.map((col) => (
                  <td
                    key={String(col.key)}
                    className="px-4 py-2 text-gray-200 select-none"
                  >
                    •
                  </td>
                ))}
                <td className="px-4 py-2 text-gray-200 select-none">•</td>
              </tr>
            ))}
          </tbody>

          {/* <tbody>
            {pagedData.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-gray-50 transition-colors shadow-xs last:border-none"
              >
                {columns.map((col) => (
                  <td
                    key={String(col.key)}
                    className="px-4 py-2 text-gray-700 text-sm"
                  >
                    {
                      col.render
                        ? col.render(row) 
                        : String(row[col.key]) 
                    }
                  </td>
                ))}

                <td className="px-4 py-3 flex gap-4">
                  <SquarePen
                    size={18}
                    className="text-[#b778e9] hover:text-[#804ba8] cursor-pointer"
                    onClick={() => onEdit && onEdit(row)}
                  />
                  <OctagonX
                    size={18}
                    className="text-red-600 hover:text-red-800 cursor-pointer"
                    onClick={() => onDelete && onDelete(row.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody> */}
        </table>
      </div>

      {/* pagination */}
      <div className="flex justify-end mt-8 fixed bottom-2 right-5 bg-white pt-2 pb-1 ">
        <div className="flex items-center bg-white px-6 py-2 rounded-full shadow-lg space-x-4">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="p-2 text-gray-600 hover:text-black disabled:opacity-40"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex space-x-3">
            {getPaginationNumbers(page, totalPages).map((num, i) => (
              <button
                key={i}
                onClick={() => typeof num === "number" && setPage(num)}
                disabled={num === "..."}
                className={`w-8 h-8 flex items-center justify-center rounded-full ${
                  num === page
                    ? "bg-[#b778e9] text-white"
                    : num === "..."
                      ? "cursor-default text-gray-400"
                      : "text-gray-600 hover:text-black"
                }`}
              >
                {num}
              </button>
            ))}
          </div>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="p-2 text-gray-600 hover:text-black disabled:opacity-40"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
