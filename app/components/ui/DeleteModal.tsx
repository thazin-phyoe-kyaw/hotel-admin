"use client";

import { useState } from "react";
import { ConfirmModalProps } from "@/app/types/modal";
import { XCircle } from "lucide-react";

export default function DeleteModal({
  open,
  title = "Delete Item",
  message = "Are you sure you want to delete this item?",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleDelete = async () => {
    if (loading) return;
    setLoading(true);

    try {
      await onConfirm?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-xs flex items-center justify-center z-50">
      <div className="bg-white w-[380px] rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <XCircle className="text-red-600" size={32} />
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        </div>

        <p className="text-gray-600 mb-6">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
          >
            {loading && (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            )}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
