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

export default function HotelAmenityForm({ mode, data, onClose, onSuccess }: any) {
  const hotelId = useAuthStore((state) => state.hotelId);
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
      active: data?.active ?? true,
      // ❗ NO icon in defaultValues, fixes your issue!
    },
  });

  // Handle Add / Edit modes
  useEffect(() => {
    if (mode === "edit" && data?.id) {
      reset({
        name: data.name ?? "",
        active: data.active ?? true,
      });
      setPreview(data.icon || null);
    } else {
      reset({
        name: "",
        active: true,
      });
      setPreview(null);
    }
  }, [mode, data?.id, reset]);



const onSubmit = async (values:any) => {
  try {
    const formData = new FormData();

    formData.append("hotel_id", hotelId ?? "");
    formData.append("name", values.name);
    formData.append("active", values.active ? "1" : "0");

    // Must send real FILE for backend
    if (values.icon?.[0]) {
      formData.append("icon", values.icon[0]);  // REAL FILE
    }

    let response;

    if (mode === "add") {
      response = await api.post("/api/hotel/admin/hotel-amenities", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } else {
      response = await api.put(
        `/api/hotel/admin/hotel-amenities/${data.id}?_method=PUT`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
    }

    onSuccess?.();
    onClose();
  } catch (err) {
    console.log("UPLOAD ERROR:", err);
  }
};



  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

      {/* Name */}
      <div>
        <label>Name</label>
        <input
          {...register("name")}
          className="pl-2 py-2 w-full rounded-lg border border-gray-200 shadow-sm"
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </div>

      {/* Icon Upload */}
      <div>
        <label className="font-semibold">Icon</label>

        <Controller
          name="icon"
          control={control}
          render={({ field }) => (
            <>
              <div
                className="mt-1 w-full px-3 py-2 border rounded-lg shadow-sm cursor-pointer"
                onClick={() => document.getElementById("iconInput")?.click()}
              >
                Drag & drop or <span className="text-purple-500 underline">browse</span>
              </div>

              <input
                id="iconInput"
                type="file"
                accept="image/*"
                className="hidden"
                value={undefined} // MUST be undefined for file input to work
                onChange={(e) => {
                  field.onChange(e.target.files); // store in RHF
                  const file = e.target.files?.[0];
                  if (file) {
                    setPreview(URL.createObjectURL(file));
                  }
                }}
              />

              {preview && (
                <img
                  src={preview}
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

      {/* Buttons */}
      <div className="p-4 flex justify-end space-x-4 bg-white fixed bottom-0 left-0 right-0">
        <button
          type="button"
          onClick={onClose}
          className="border px-4 py-2 rounded-md"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="px-4 py-2 bg-purple-500 text-white rounded-lg"
        >
          {mode === "add" ? "Add Hotel Amenity" : "Update Hotel Amenity"}
        </button>
      </div>

    </form>
  );
}
