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
  const [preview, setPreview] = useState(data?.icon || null);
  const hotelId = useAuthStore((state) => state.hotelId);

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
      icon: null,
    },
  });

  useEffect(() => {
  if (mode === "edit" && data) {
    reset({
      name: data.name ?? "",
      icon: null,
      active: data.active ?? true,
    });
    setPreview(data.icon || null);
  } else {
    reset({
      name: "",
      icon: null,
      active: true,
    });
    setPreview(null);
  }
}, [mode, data, reset]);


  const onSubmit = async (values: any) => {
    try {
      let iconString: string = data?.icon || "";
      const file = values.icon?.[0];
      if (file) {
        iconString = file.name;
      }

      const amenityData = {
        name: values.name,
        icon: iconString,
        active: values.active ? 1 : 0,
        hotel_id: hotelId,
      };

      let response;

      if (mode === "add") {
        response = await api.post(
          "/api/hotel/admin/hotel-amenities",
          amenityData,
        );
      } else {
        response = await api.put(
          `/api/hotel/admin/hotel-amenities/${data.id}`,
          amenityData,
        );
      }

      onSuccess?.();

      onClose();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* --- Name --- */}
      <div>
        <label>Name</label>
        <input
          {...register("name")}
          className="pl-2 py-2 w-full rounded-lg shadow-sm border border-gray-200
          hover:border-[#b778e9] focus:ring-1 focus:ring-[#b778e9] focus:outline-none transition"
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      {/* --- Icon Upload --- */}
      <div>
        <label className="font-semibold">Icon</label>

        <Controller
          name="icon"
          control={control}
          render={({ field }) => (
            <>
              <div
                className="mt-1 w-full px-3 py-2 rounded-lg border shadow-sm border-gray-200
                hover:border-[#b778e9] focus-within:ring-1 focus-within:ring-[#b778e9]
                cursor-pointer transition text-gray-500"
                onClick={() => document.getElementById("iconInput")?.click()}
              >
                Drag & drop your file or{" "}
                <span className="text-[#b778e9] underline">browse</span>
              </div>

              <input
                id="iconInput"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  field.onChange(e.target.files);
                  const file = e.target.files?.[0];
                  if (file) {
                    const url = URL.createObjectURL(file);
                    setPreview(url);
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

      {/* --- Active Toggle --- */}
      <div className="flex items-center justify-between">
        <label className="font-semibold">Active</label>

        <Controller
          name="active"
          control={control}
          render={({ field }) => (
            <Toggle checked={field.value} onChange={field.onChange} />
          )}
        />
      </div>

      {/* --- Submit --- */}
      <button
        type="submit"
        className="w-full bg-[#b778e9] text-white py-2 rounded-lg hover:bg-[#804ba8] transition"
      >
        {mode === "add" ? "Add Amenity" : "Update Amenity"}
      </button>
    </form>
  );
}
