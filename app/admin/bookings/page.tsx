"use client";

import { useCallback, useEffect, useState } from "react";
import api from "@/app/lib/api";
import DataTable from "@/app/components/ui/Table";

type HotelBooking = {
  id: number;
  hotel_id: number;
  status: string;
  check_in_check_out: string;
  image: string;
  name: string;
  room_type: string;
  room_count: number;
  address: string;
  amount: string;
};

export default function HotelBookingPage() {
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState<HotelBooking[]>([]);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/api/hotel/admin/bookings");

      console.log(data.data);

      setBookings(data?.data || []);
    } catch (error) {
      console.error("Failed to fetch hotel bookings", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return (
    <div>
      <DataTable
        loading={loading}
        name="Hotel Bookings"
        searchPlaceholder="Search bookings..."
        data={bookings}
        hideSearch={true}
        hideAdd={true}
        hideActions={true}
        columns={[
          {
            key: "image",
            label: "Image",
            sortable: false,
            render: (row) => (
              <img
                src={row.image}
                alt={row.name}
                className="w-8 h-8 rounded object-cover"
              />
            ),
          },
          {
            key: "name",
            label: "Hotel Name",
            sortable: true,
            render: undefined,
          },
          {
            key: "check_in_check_out",
            label: "Check-In / Check-Out",
            sortable: false,
            render: undefined,
          },
          {
            key: "room_count",
            label: "Rooms",
            sortable: true,
            render: undefined,
          },
          {
            key: "amount",
            label: "Amount",
            sortable: true,
            render: undefined,
          },
          {
            key: "status",
            label: "Status",
            sortable: true,
            render: (row: { status: string }) => (
              <span
                className={`
          px-3 py-1 rounded-full text-sm font-semibold
          ${
            row.status === "completed"
              ? "bg-green-200 text-green-700"
              : row.status === "cancelled"
                ? "bg-red-200 text-red-700"
                : "bg-yellow-200 text-yellow-700"
          }
        `}
              >
                {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
              </span>
            ),
          },
        ]}
      />
    </div>
  );
}
