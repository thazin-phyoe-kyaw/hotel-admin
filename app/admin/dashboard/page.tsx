"use client";

import { useEffect, useState } from "react";
import api from "@/app/lib/api";
import {
  CalendarCheck,
  Building2,
  DoorClosed,
  DoorOpen,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  LogIn,
  LogOut,
  Star,
  Wallet,
} from "lucide-react";

// Icon mapping
const ICONS: any = {
  "Total Bookings": CalendarCheck,
  "Total Rooms": Building2,
  "Room Occupied": DoorClosed,
  "Available Rooms": DoorOpen,
  "Total Guests": Users,
  "Pending Bookings": Clock,
  "Confirmed Bookings": CheckCircle,
  "Cancelled Bookings": XCircle,
  "Check-In Today": LogIn,
  "Check-Out Today": LogOut,
  "Total Reviews": Star,
  Revenue: Wallet,
};

// Colors
const COLORS = [
  "bg-purple-50 text-purple-700",
  "bg-blue-50 text-blue-700",
  "bg-green-50 text-green-700",
  "bg-yellow-50 text-yellow-700",
  "bg-pink-50 text-pink-700",
  "bg-orange-50 text-orange-700",
  "bg-teal-50 text-teal-700",
  "bg-rose-50 text-rose-700",
  "bg-indigo-50 text-indigo-700",
  "bg-emerald-50 text-emerald-700",
  "bg-fuchsia-50 text-fuchsia-700",
  "bg-sky-50 text-sky-700",
];

export default function HotelDashboard() {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>({});
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [quickFilter, setQuickFilter] = useState<string>("");

  // ----------------------------
  // FETCH DASHBOARD API
  // ----------------------------
  const fetchDashboard = async (params: any = {}) => {
    try {
      setLoading(true);

      const { data } = await api.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/hotel/dashboard-summary`,
        { params }
      );

      setStats(data.data || {});
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Load ALL data first
  useEffect(() => {
    fetchDashboard({ filter: "all" });
    setQuickFilter("all");
  }, []);

  // ----------------------------
  // QUICK FILTER HANDLER
  // ----------------------------
  const handleQuickFilter = (type: string) => {
    setQuickFilter(type);
    setFromDate("");
    setToDate("");

    if (type === "all") return fetchDashboard({ filter: "all" });
    if (type === "daily") return fetchDashboard({ filter: "daily" });
    if (type === "weekly") return fetchDashboard({ filter: "weekly" });
    if (type === "monthly") return fetchDashboard({ filter: "monthly" });
  };

  // ----------------------------
  // STATS
  // ----------------------------
  const statItems = {
    "Total Bookings": stats.total_booking,
    "Total Rooms": stats.total_room,
    "Room Occupied": stats.room_occupied,
    "Available Rooms": stats.available_room,
    "Total Guests": stats.total_guests,
    "Pending Bookings": stats.pending_booking,
    "Confirmed Bookings": stats.confirmed_booking,
    "Cancelled Bookings": stats.cancelled_booking,
    "Check-In Today": stats.check_in_today,
    "Check-Out Today": stats.check_out_today,
    "Total Reviews": stats.total_review,
    Revenue: "MMK " + stats.revenue,
  };

  return (
    <div className="p-4 space-y-8">

      {/* FILTERS */}
      <div className="flex flex-wrap gap-2">

        {/* ALL */}
        <button
          onClick={() => handleQuickFilter("all")}
          className={`px-4 py-2 rounded-xl text-sm font-medium shadow-sm transition
            flex items-center gap-2
            ${
              quickFilter === "all"
                ? "bg-purple-600 text-white shadow"
                : "bg-white text-gray-700 hover:bg-purple-50 border border-gray-200"
            }`}
        >
          🔄 All
        </button>

        {/* DAILY */}
        <button
          onClick={() => handleQuickFilter("daily")}
          className={`px-4 py-2 rounded-xl text-sm font-medium shadow-sm transition
            flex items-center gap-2
            ${
              quickFilter === "daily"
                ? "bg-purple-600 text-white shadow"
                : "bg-white text-gray-700 hover:bg-purple-50 border border-gray-200"
            }`}
        >
          🌅 Daily
        </button>

        {/* WEEKLY */}
        <button
          onClick={() => handleQuickFilter("weekly")}
          className={`px-4 py-2 rounded-xl text-sm font-medium shadow-sm transition
            flex items-center gap-2
            ${
              quickFilter === "weekly"
                ? "bg-purple-600 text-white shadow"
                : "bg-white text-gray-700 hover:bg-purple-50 border border-gray-200"
            }`}
        >
          📊 Weekly
        </button>

        {/* MONTHLY */}
        <button
          onClick={() => handleQuickFilter("monthly")}
          className={`px-4 py-2 rounded-xl text-sm font-medium shadow-sm transition
            flex items-center gap-2
            ${
              quickFilter === "monthly"
                ? "bg-purple-600 text-white shadow"
                : "bg-white text-gray-700 hover:bg-purple-50 border border-gray-200"
            }`}
        >
          📅 Monthly
        </button>

        {/* DATE RANGE */}
        <input
          type="date"
          className="
            p-2 rounded-xl shadow-sm
            appearance-none outline-none
            border border-transparent
            hover:border-purple-400
            focus:border-purple-500 
            transition
        "
          value={fromDate}
          onChange={(e) => {
            setQuickFilter("");
            setFromDate(e.target.value);
          }}
        />

        <input
          type="date"
          className="
            p-2 rounded-xl shadow-sm
            appearance-none outline-none
            border border-transparent
            hover:border-purple-400
            focus:border-purple-500 
            transition
        "
          value={toDate}
          onChange={(e) => {
            setQuickFilter("");
            setToDate(e.target.value);
          }}
        />

        {/* APPLY RANGE */}
        <button
          onClick={() =>
            fetchDashboard({
              filter: "range",
              from: fromDate,
              to: toDate,
            })
          }
          className="bg-purple-600 text-white px-5 py-2 rounded-xl shadow font-medium hover:bg-purple-700 transition"
        >
          Apply
        </button>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Object.entries(statItems).map(([title, value], i) => {
          const Icon = ICONS[title];
          const color = COLORS[i % COLORS.length];

          return (
            <div
              key={i}
              className={`p-4 rounded-xl shadow-sm hover:shadow-md transition ${color}`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white shadow text-gray-700">
                  <Icon size={22} />
                </div>

                <div>
                  <p className="text-sm opacity-70">{title}</p>
                  <p className="text-2xl font-bold mt-1">{value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}