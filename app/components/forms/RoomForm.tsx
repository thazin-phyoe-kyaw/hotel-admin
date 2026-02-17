"use client";

import api from "@/app/lib/api";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

export default function RoomForm({ mode, data, onClose, onSuccess }: any) {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      hotel_room_type_id: "",
      name: "",
      room_no: "",
      features: [],
      price: "",
      is_active: true,
    },
  });

  const [roomTypes, setRoomTypes] = useState([]);

  const fetchRoomTypes = async () => {
    const res = await api.get("/api/hotel/admin/room-types");
    setRoomTypes(res.data.data.room_types);
  };

  useEffect(() => {
    fetchRoomTypes();

    if (mode === "edit" && data) {
      reset({
        hotel_room_type_id: data.hotel_room_type_id,
        name: data.name,
        room_no: data.room_no,
        features: data.features || [],
        price: data.price,
        is_active: data.is_active === 1,
      });
    }
  }, [mode, data, reset]);

  const onSubmit = async (formData: any) => {
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
      reset();
    } catch (error) {
      console.error("Room save failed", error);
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Room Type */}
      <div>
        <label className="block mb-1 font-semibold">Room Type</label>
        <select
          className="w-full border rounded p-2"
          {...register("hotel_room_type_id")}
        >
          {roomTypes.map((rt: any) => (
            <option key={rt.id} value={rt.id}>
              {rt.name}
            </option>
          ))}
        </select>
      </div>

      {/* Name */}
      <div>
        <label className="block mb-1 font-semibold">Room Name</label>
        <input
          type="text"
          className="w-full border rounded p-2"
          {...register("name")}
        />
      </div>

      {/* Room No */}
      <div>
        <label className="block mb-1 font-semibold">Room No</label>
        <input
          type="text"
          className="w-full border rounded p-2"
          {...register("room_no")}
        />
      </div>

      {/* Features */}
      <div>
        <label className="block mb-1 font-semibold">Features</label>
        <div className="grid grid-cols-1 gap-2">
          {FEATURES_OPTIONS.map((feature) => (
            <label key={feature} className="flex items-center gap-2">
              <input type="checkbox" value={feature} {...register("features")} />
              {feature}
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <label className="block mb-1 font-semibold">Price</label>
        <input
          type="number"
          className="w-full border rounded p-2"
          {...register("price")}
        />
      </div>

      {/* Is Active */}
      <div className="flex items-center gap-2">
        <input type="checkbox" {...register("is_active")} />
        <span>Active</span>
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {mode === "add" ? "Create Room" : "Update Room"}
      </button>
    </form>
  );
}
