"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Hotel, Building2, Loader2, ArrowRight } from "lucide-react";
import api from "../lib/api";
import { useAuthStore } from "../store/authStore";

export default function SelectHotelPage() {
  // const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const setHotel = useAuthStore((state) => state.setHotel);
const hotels =[
  { id: "1", name: "Hotel Sunshine", location: "Miami, FL" },
  { id: "2", name: "Mountain View Inn", location: "Denver, CO" },
  { id: "3", name: "City Lights Hotel", location: "New York, NY" },
  { id: "4", name: "Lakeside Resort", location: "Chicago, IL" },
  { id: "5", name: "Beachfront Paradise", location: "Los Angeles, CA" },
]
  useEffect(() => {
    const getHotels = async () => {
      try {
        const { data } = await api.get("/api/admin/hotels");
        // setHotels(data.data);
      } catch (err) {
        console.error("Failed to fetch hotels", err);
      } finally {
        setLoading(false);
      }
    };
    getHotels();
  }, []);

  const handleSelection = (id: string, name: string) => {
    setHotel(id, name);
    router.push("/admin/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-10">
          <Building2 className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome back, Admin
          </h1>
          <p className="text-slate-500 mt-2">
            Select a property to manage today
          </p>
        </div>

        <div className="grid gap-4">
          {hotels.map((hotel: any) => (
            <button
              key={hotel.id}
              onClick={() => handleSelection(hotel.id, hotel.name)}
              className="group flex items-center justify-between p-5 bg-white border border-slate-200 rounded-xl hover:border-blue-500 hover:shadow-md transition-all text-left"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Hotel size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">{hotel.name}</h3>
                  <p className="text-sm text-slate-500">{hotel.location}</p>
                </div>
              </div>
              <ArrowRight className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
