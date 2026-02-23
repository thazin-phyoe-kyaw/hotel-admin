"use client";

import api from "@/app/lib/api";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import Toggle from "../ui/Toggle";

const schema = z.object({
  hotel_room_type_id: z.string().min(1, "Room type is required"),
  name: z.string().min(1, "Room name is required"),
  room_no: z.string().min(1, "Room number is required"),
  features: z.array(z.string()).optional(),
  price: z
    .string()
    .min(1, "Price is required")
    .refine((val) => Number(val) > 0, "Price must be greater than 0"),
  is_active: z.boolean().default(true),
});

export default function RoomForm({ mode, data, onClose, onSuccess }: any) {
  const [roomTypes, setRoomTypes] = useState([]);
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
      hotel_room_type_id: "",
      name: "",
      room_no: "",
      features: [],
      price: "",
      is_active: true,
    },
  });

  const fetchRoomTypes = async () => {
    const res = await api.get("/api/hotel/admin/room-types");
    setRoomTypes(res.data.data.room_types);
  };

  useEffect(() => {
    fetchRoomTypes();

    if (mode === "edit" && data) {
      reset({
        hotel_room_type_id: String(data.hotel_room_type_id),
        name: data.name,
        room_no: data.room_no,
        features: data.features || [],
        price: String(data.price),
        is_active: data.is_active === 1,
      });
    } else {
      reset({
        hotel_room_type_id: "",
        name: "",
        room_no: "",
        features: [],
        price: "",
        is_active: true,
      });
    }
  }, [mode, data, reset]);

  const onSubmit = async (formData: any) => {
    if (submitting) return;
    setSubmitting(true);

    try {
      const payload = {
        ...formData,
        is_active: formData.is_active ? 1 : 0,
      };

      if (mode === "add") {
        await api.post("/api/hotel/admin/rooms", payload);
      } else {
        await api.put(`/api/hotel/admin/rooms/${data.id}`, payload);
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Room save failed", error);
    } finally {
      setSubmitting(false);
    }
  };

  const FEATURES_OPTIONS = [
    "Wifi/Lighting/Lift 24 hours",
    "Hot/Cold Water",
    "Air-Con/Heater",
    "Rooftop Access",
    "Lift Access",
    "Breakfast",
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pb-24">
      <div>
        <label className="font-semibold">Room Type</label>
        <select
          {...register("hotel_room_type_id")}
          className="pl-2 py-2 w-full rounded-lg border border-gray-200 shadow-sm 
          focus:outline-none focus:ring-1 focus:ring-[#b778e9] focus:border-[#b778e9] transition"
        >
          <option value="">Select Room Type</option>
          {roomTypes.map((rt: any) => (
            <option key={rt.id} value={rt.id}>
              {rt.name}
            </option>
          ))}
        </select>

        {errors.hotel_room_type_id && (
          <p className="text-red-500 text-sm">
            {errors.hotel_room_type_id.message}
          </p>
        )}
      </div>

      <div>
        <label className="font-semibold">Room Name</label>
        <input
          {...register("name")}
          className="pl-2 py-2 w-full rounded-lg border border-gray-200 shadow-sm 
          focus:outline-none focus:ring-1 focus:ring-[#b778e9] focus:border-[#b778e9] transition"
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="font-semibold">Room Number</label>
        <input
          {...register("room_no")}
          className="pl-2 py-2 w-full rounded-lg border border-gray-200 shadow-sm 
          focus:outline-none focus:ring-1 focus:ring-[#b778e9] focus:border-[#b778e9] transition"
        />
        {errors.room_no && (
          <p className="text-red-500 text-sm">{errors.room_no.message}</p>
        )}
      </div>

      <div>
        <label className="font-semibold">Features</label>
        <div className="grid grid-cols-1 gap-2">
          {FEATURES_OPTIONS.map((feature) => (
            <label key={feature} className="flex items-center gap-2">
              <input
                type="checkbox"
                value={feature}
                {...register("features")}
              />
              {feature}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="font-semibold">Price</label>
        <input
          type="number"
          {...register("price")}
          className="pl-2 py-2 w-full rounded-lg border border-gray-200 shadow-sm 
          focus:outline-none focus:ring-1 focus:ring-[#b778e9] focus:border-[#b778e9] transition"
        />
        {errors.price && (
          <p className="text-red-500 text-sm">{errors.price.message}</p>
        )}
      </div>

      <div className="flex justify-between items-center">
        <label className="font-semibold">Active</label>

        <Controller
          name="is_active"
          control={control}
          render={({ field }) => (
            <Toggle checked={field.value} onChange={field.onChange} />
          )}
        />
      </div>

      <div className="p-4 flex justify-end space-x-4 bg-white fixed bottom-0 left-0 right-0">
        <button
          type="button"
          onClick={onClose}
          className="border px-4 py-2 rounded-md"
          disabled={submitting}
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
