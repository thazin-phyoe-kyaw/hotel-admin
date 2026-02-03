"use client";

import { DrawerProps } from "@/app/types/drawer";
import { X } from "lucide-react";

export default function Drawer({
  open,
  title,
  children,
  onClose,
  onSubmit,
  submitLabel = "Save",
  isSubmitting = false,
}: DrawerProps) {
  return (
    <div
      className={`
        fixed inset-0 z-50 transition-all 
        ${open ? "visible" : "invisible"}
      `}
    >
      {/* overlay */}
      <div
        onClick={onClose}
        className={`
          absolute inset-0 bg-black/30 transition-opacity
          ${open ? "opacity-100" : "opacity-0"}
        `}
      />

      {/* drawer panel */}
      <div
        className={`
          absolute right-0 top-0 h-full w-[400px] bg-white shadow-xl 
          flex flex-col rounded-l-md 
          transition-transform duration-300 
          ${open ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* header */}
        <div className="flex justify-between items-center p-4.5 shadow-sm">
          <h2 className="text-lg font-semibold text-blue-600">{title}</h2>
          <X
            size={22}
            onClick={onClose}
            className="cursor-pointer hover:text-gray-500"
          />
        </div>

       
        <div className="p-4 overflow-y-auto flex-1">{children}</div>

        {/* footer */}
        <div className="p-4 flex space-x-4 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
