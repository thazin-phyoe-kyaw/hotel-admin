"use client";

import api from "@/app/lib/api";
import { useAuthStore } from "@/app/store/authStore";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function RoomTypeForm({ mode, data, onClose, onSuccess }: any) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const [iconFile, setIconFile] = useState<File | null>(null);
  const hotelId = useAuthStore((state) => state.hotelId);

  // Load old data when editing
  useEffect(() => {
    if (mode === "edit" && data) {
      reset({
        name: data.name || "",
        description: data.description || "",
      });
    } else {
      reset({
        name: "",
        description: "",
      });
    }
  }, [mode, data, reset]);

  const onSubmit = async (values: any) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("hotel_id", hotelId ? String(hotelId) : "");

      if (iconFile) {
        formData.append("icon", iconFile);
      }

      let response;

      if (mode === "add") {
        response = await api.post("/api/hotel/admin/room-types", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        response = await api.put(
          `/api/hotel/admin/room-types/${data.id}?_method=PUT`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      }

      onSuccess?.();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pb-24">
        {/* NAME */}
        <div>
          <label className="block font-medium mb-1">Room Type Name</label>
          <input
            type="text"
            {...register("name", { required: "Name is required" })}
            placeholder="Enter room type name"
            className="pl-2 py-2 w-full rounded-lg shadow-sm border border-gray-200
          hover:border-[#b778e9] focus:ring-1 focus:ring-[#b778e9] focus:outline-none transition"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block font-medium mb-1">Description</label>
          <input
            type="text"
            {...register("description", {
              required: "Description is required",
            })}
            placeholder="Enter room type description"
            className="pl-2 py-2 w-full rounded-lg shadow-sm border border-gray-200
          hover:border-[#b778e9] focus:ring-1 focus:ring-[#b778e9] focus:outline-none transition"
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}
        </div>

        {/* ICON FILE UPLOAD */}
        <div>
          <label className="block font-medium mb-1">Icon</label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setIconFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0 file:text-sm file:font-semibold
              file:bg-[#b778e9] file:text-white hover:file:bg-[#804ba8]"
          />

          {mode === "edit" && data?.icon && (
            <div className="mt-2">
              <p className="text-sm text-gray-600">Current Icon:</p>
              <img
                src={data.icon}
                alt="Current icon"
                className="w-12 h-12 rounded-md border mt-1"
              />
            </div>
          )}
        </div>

        {/* ACTION BUTTONS */}
        <div className="p-4 flex space-x-4 justify-end fixed bottom-0 left-0 right-0 bg-white border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-4 bg-[#b778e9] text-white py-2 rounded-lg hover:bg-[#804ba8] transition"
          >
            {mode === "add" ? "Add Room Type" : "Update Room Type"}
          </button>
        </div>
      </form>
    </div>
  );
}
