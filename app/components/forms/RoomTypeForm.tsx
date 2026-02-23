"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import api from "@/app/lib/api";
import { useAuthStore } from "@/app/store/authStore";

const schema = z.object({
  name: z.string().min(1, "Room type name is required"),
  description: z.string().min(1, "Description is required"),
  icon: z.any().optional(),
});

export default function RoomTypeForm({ mode, data, onClose, onSuccess }: any) {
  const hotelId = useAuthStore((state) => state.hotelId);
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState(data?.icon || null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: data?.name || "",
      description: data?.description || "",
    },
  });

  useEffect(() => {
    if (mode === "edit" && data?.id) {
      reset({
        name: data.name ?? "",
        description: data.description ?? "",
      });
      setPreview(data?.icon || null);
    } else {
      reset({ name: "", description: "" });
      setPreview(null);
    }
  }, [mode, data, reset]);

  const onSubmit = async (values: any) => {
    if (submitting) return;
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("hotel_id", hotelId ?? "");
      formData.append("name", values.name);
      formData.append("description", values.description);

      if (values.icon?.[0]) {
        formData.append("icon", values.icon[0]);
      }

      if (mode === "add") {
        await api.post("/api/hotel/admin/room-types", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post(
          `/api/hotel/admin/room-types/${data.id}?_method=PUT`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } },
        );
      }

      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("Room type submit error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pb-24">
      {/* NAME */}
      <div>
        <label className="block font-medium mb-1">Room Type Name</label>
        <input
          {...register("name")}
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
          {...register("description")}
          placeholder="Enter description"
          className="pl-2 py-2 w-full rounded-lg shadow-sm border border-gray-200
            hover:border-[#b778e9] focus:ring-1 focus:ring-[#b778e9] focus:outline-none transition"
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description.message}</p>
        )}
      </div>

      {/* ICON UPLOAD */}
      <div>
        <label className="block font-medium mb-1">Icon</label>

        <Controller
          name="icon"
          control={control}
          render={({ field }) => (
            <>
              <input
                type="file"
                accept="image/*"
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0 file:text-sm file:font-semibold
                  file:bg-[#b778e9] file:text-white hover:file:bg-[#804ba8]"
                onChange={(e) => {
                  field.onChange(e.target.files ?? null);
                  const file = e.target.files?.[0];
                  if (file) {
                    setPreview(URL.createObjectURL(file));
                  }
                }}
              />

              {preview && (
                <img
                  src={preview}
                  alt="preview"
                  className="mt-2 h-16 w-16 rounded-md object-cover border"
                />
              )}
            </>
          )}
        />
      </div>

      <div className="p-4 flex justify-end space-x-4 bg-white fixed bottom-0 left-0 right-0 ">
        <button
          type="button"
          onClick={onClose}
          disabled={submitting}
          className="px-4 py-2 rounded-md border border-none shadow-sm hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={submitting}
          className={`
    px-4 py-2 bg-purple-500 text-white rounded-lg flex items-center gap-2 
    transition ${submitting ? "opacity-60" : "hover:bg-purple-600"}
  `}
        >
          {submitting && (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          )}

          Submit
        </button>
      </div>
    </form>
  );
}
