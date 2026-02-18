"use client";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import Toggle from "../ui/Toggle";
import api from "@/app/lib/api";
import { useAuthStore } from "@/app/store/authStore";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  icon: z.any().optional(),
  active: z.boolean().default(true),
});

export default function HotelAmenityForm({
  mode,
  data,
  onClose,
  onSuccess,
}: any) {
  const hotelId = useAuthStore((state) => state.hotelId);
  const [preview, setPreview] = useState(data?.icon || null);
  const [submitting, setSubmitting] = useState(false); 

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
      active: data?.active ?? true,
    },
  });

  useEffect(() => {
    if (mode === "edit" && data?.id) {
      reset({
        name: data?.name ?? "",
        active: data?.active ?? true,
      });
      setPreview(data?.icon || null);
    } else {
      reset({ name: "", active: true });
      setPreview(null);
    }
  }, [mode, data?.id, reset]);

  const onSubmit = async (values: any) => {
    if (submitting) return;
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("hotel_id", hotelId ?? "");
      formData.append("name", values.name);
      formData.append("active", values.active ? "1" : "0");

      if (values.icon?.[0]) {
        formData.append("icon", values.icon[0]);
      }

      if (mode === "add") {
        await api.post("/api/hotel/admin/hotel-amenities", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post(
          `/api/hotel/admin/hotel-amenities/${data.id}?_method=PUT`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } },
        );
      }

      onSuccess?.();
      onClose();
    } catch (err) {
      console.log("UPLOAD ERROR:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pb-24">
      <div>
        <label>Name</label>
        <input
          {...register("name")}
          className="pl-2 py-2 w-full rounded-lg border border-gray-200 shadow-sm focus:outline-none focus:ring-1 focus:ring-[#b778e9] focus:border-[#b778e9] transition"
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="font-semibold">Icon</label>
        <Controller
          name="icon"
          control={control}
          render={({ field }) => (
            <>
              <input
                id="iconInput"
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

      {/* Active Toggle */}
      <div className="flex justify-between items-center">
        <label className="font-semibold">Active</label>
        <Controller
          name="active"
          control={control}
          render={({ field }) => (
            <Toggle checked={field.value} onChange={field.onChange} />
          )}
        />
      </div>

      <div className="p-4 flex justify-end space-x-4 bg-white fixed bottom-0 left-0 right-0 ">
        <button
          type="button"
          onClick={onClose}
          disabled={submitting}
          className="border px-4 py-2 rounded-md"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg flex items-center gap-2"
        >
          {submitting && (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          )}

          {mode === "add" ? "Add Hotel Amenity" : "Update Hotel Amenity"}
        </button>
      </div>
    </form>
  );
}
