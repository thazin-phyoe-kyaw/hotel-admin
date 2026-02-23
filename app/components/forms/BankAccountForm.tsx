"use client";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import Toggle from "../ui/Toggle";
import api from "@/app/lib/api";
import { useAuthStore } from "@/app/store/authStore";

const schema = z.object({
  bank_branch: z.string().min(1, "Bank branch is required"),
  account_name: z.string().min(1, "Account name is required"),
  account_number: z.string().min(1, "Account number is required"),
  is_default: z.boolean().default(false),
});

export default function BankAccountForm({
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
      bank_branch: data?.bank_branch || "",
      account_name: data?.account_name || "",
      account_number: data?.account_number || "",
      is_default: data?.is_default ?? false,
    },
  });

  useEffect(() => {
    if (mode === "edit" && data) {
      reset({
        bank_branch: data.bank_branch,
        account_name: data.account_name,
        account_number: data.account_number,
        is_default: data.is_default,
      });
    } else {
      reset({
        bank_branch: "",
        account_name: "",
        account_number: "",
        is_default: false,
      });
    }
  }, [mode, data, reset]);

  const onSubmit = async (values: any) => {
    if (submitting) return;
    setSubmitting(true);

    try {
      const payload = {
        hotel_id: hotelId,
        bank_branch: values.bank_branch,
        account_name: values.account_name,
        account_number: values.account_number,
        is_default: values.is_default ? 1 : 0,
      };

      if (mode === "add") {
        await api.post("/api/hotel/bank-accounts", payload);
      } else {
        await api.put(`/api/hotel/bank-accounts/${data.id}`, payload);
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
        <label>Bank Branch</label>
        <input
          {...register("bank_branch")}
          className="pl-2 py-2 w-full rounded-lg border border-gray-200 shadow-sm focus:ring-1 focus:ring-purple-400"
        />
        {errors.bank_branch && (
          <p className="text-red-500 text-sm">{errors.bank_branch.message}</p>
        )}
      </div>

      <div>
        <label>Account Name</label>
        <input
          {...register("account_name")}
          className="pl-2 py-2 w-full rounded-lg border border-gray-200 shadow-sm focus:ring-1 focus:ring-purple-400"
        />
        {errors.account_name && (
          <p className="text-red-500 text-sm">{errors.account_name.message}</p>
        )}
      </div>

      <div>
        <label>Account Number</label>
        <input
          {...register("account_number")}
          className="pl-2 py-2 w-full rounded-lg border border-gray-200 shadow-sm focus:ring-1 focus:ring-purple-400"
        />
        {errors.account_number && (
          <p className="text-red-500 text-sm">
            {errors.account_number.message}
          </p>
        )}
      </div>

      {/* DEFAULT TOGGLE */}
      <div className="flex justify-between items-center">
        <label className="font-semibold">Default Account</label>

        <Controller
          name="is_default"
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
          className="px-4 py-2 border rounded-md hover:bg-gray-100 disabled:opacity-50"
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
          {/* {mode === "add" ? "Add Bank Account" : "Update Bank Account"} */}
        </button>
      </div>
    </form>
  );
}
