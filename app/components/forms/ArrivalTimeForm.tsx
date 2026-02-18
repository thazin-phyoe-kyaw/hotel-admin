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
  active: z.boolean().default(true),
});

export default function ArrivalTimeForm({
  mode,
  data,
  onClose,
  onSuccess,
}: any) {
  const hotelId = useAuthStore((state) => state.hotelId);
  const [submitting, setSubmitting] = useState(false);

  
  const {
    register,
    control,
    handleSubmit,
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
    } else {
      reset({ name: "", active: true });
    }
  }, [mode, data?.id, reset]);

  
  const onSubmit = async (values: any) => {
    if (submitting) return;
    setSubmitting(true);

    try {
      const payload = {
        hotel_id: hotelId,
        name: values.name,
        active: values.active ? 1 : 0,
      };

      if (mode === "add") {
        await api.post("/api/hotel/admin/arrival-times", payload);
      } else {
        await api.put(`/api/hotel/admin/arrival-times/${data.id}`, payload);
      }

      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("ERROR:", err);
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

      {/* ACTIVE TOGGLE */}
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

      <div className="p-4 flex justify-end space-x-4 bg-white fixed bottom-0 left-0 right-0">
        <button
          type="button"
          onClick={onClose}
          disabled={submitting}
          className="border px-4 py-2 rounded-md border-none shadow-sm hover:bg-gray-100 disabled:opacity-50 shadow-sm"
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

          {mode === "add" ? "Add Arrival Time" : "Update Arrival Time"}
        </button>
      </div>
    </form>
  );
}
