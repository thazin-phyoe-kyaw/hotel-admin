import api from "@/app/lib/api";
import { useAuthStore } from "@/app/store/authStore";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function ArrivalTimeForm({
  mode,
  data,
  onClose,
  onSuccess,
}: any) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
    },
  });

  const hotelId = useAuthStore((state) => state.hotelId);
  useEffect(() => {
    if (mode === "edit" && data) {
      reset({
        name: data.name || "",
      });
    } else {
      reset({
        name: "",
      });
    }
  }, [mode, data, reset]);

  const onSubmit = async (values: any) => {
    try {
      const payload = {
        name: values.name,
        active: values.active ? 1 : 0,
        hotel_id: hotelId,
      };

      let response;

      if (mode === "add") {
        response = await api.post("/api/hotel/admin/arrival-times", payload);
      } else {
        response = await api.put(
          `/api/hotel/admin/arrival-times/${data.id}`,
          payload,
        );
      }

      onSuccess?.();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div >
      {/* <h2 className="text-xl font-semibold mb-4">
        {mode === "edit" ? "Edit Arrival Time" : "Add Arrival Time"}
      </h2> */}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
       
        <div>
          <label className="block font-medium mb-1">Name</label>
          <input
            type="text"
            {...register("name", { required: "Name is required" })}
            placeholder="Enter arrival time name"
           className="pl-2 py-2 w-full rounded-lg shadow-sm border border-gray-200
          hover:border-[#b778e9] focus:ring-1 focus:ring-[#b778e9] focus:outline-none transition"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>
          <button
        type="submit"
        className="w-full bg-[#b778e9] text-white py-2 rounded-lg hover:bg-[#804ba8] transition"
      >
        {mode === "add" ? "Add Arrival Time" : "Update Arrival Time"}
      </button>

        {/* BUTTONS */}
       
      </form>
    </div>
  );
}
