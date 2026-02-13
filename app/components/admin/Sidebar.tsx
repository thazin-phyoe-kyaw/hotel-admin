"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import {
  Home,
  BedDouble,
  Users,
  CalendarCheck,
  Settings,
  LogOut,
  X,
  HelpCircle,
  Loader2,
  Building2,
  HeartHandshake,
  Heart,
  Clock,
  GalleryVertical,
  GalleryVerticalEnd,
  MessageSquareHeart,
  Grid2X2,
  SquaresExclude,
} from "lucide-react";

import { useSidebar } from "@/app/hooks/useSidebar";
import { useAuthStore } from "@/app/store/authStore";
import api from "@/app/lib/api";
import { deleteCookie } from "cookies-next";

const menuGroups = [
  {
    title: "User Information",
    items: [
      { name: "Dashboard", href: "/admin/dashboard", icon: Home },
      {
        name: "Hotel Amenities",
        href: "/admin/hotel-amenities",
        icon: Heart,
      },
      { name: "Arrival Times", href: "/admin/arrival-times", icon: Clock },
      { name: "Hotel Booking", href: "/admin/bookings", icon: GalleryVerticalEnd },
      {
        name: "Hotel Reviews",
        href: "/admin/hotel-reviews",
        icon: MessageSquareHeart,
      },
      { name: "Room Type", href: "/admin/room-types", icon: Grid2X2 },
      { name: "Room", href: "/admin/rooms", icon: SquaresExclude },
    ],
  },
  {
    title: "Settings",
    items: [
      { name: "Switch Hotel", href: "/select-hotel", icon: Building2 },
      { name: "Help and support", href: "/help", icon: HelpCircle },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isOpen, isMobileOpen, closeMobile } = useSidebar();

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const clearAuth = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    try {
      await api.post("/admin/logout");
    } catch (error) {
      console.warn("Backend session already cleared or unauthorized.");
    } finally {
      clearAuth();
      deleteCookie("token", { path: "/" });

      setIsLoggingOut(false);
      window.location.href = "/login";
      // router.push("/login");
    }
  };

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={closeMobile}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full z-50 bg-white shadow-sm transition-all duration-300 flex flex-col ${isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"} ${isOpen ? "w-52" : "w-20"}`}
      >
        <button
          onClick={closeMobile}
          className="md:hidden absolute top-4 right-4"
        >
          <X size={22} />
        </button>

        <div className="px-3 py-5">
          <h1 className="font-bold uppercase tracking-wider">Admin</h1>
        </div>

        <nav className="flex flex-col gap-1 flex-1 overflow-y-auto">
          {menuGroups.map((group) => (
            <div key={group.title} className="mb-4">
              {isOpen && (
                <p className="text-xs font-semibold tracking-wide px-4 my-2 text-gray-400">
                  {group.title.toUpperCase()}
                </p>
              )}
              <div className="flex flex-col gap-1 px-2">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = pathname.startsWith(item.href);
                  return (
                    <Link href={item.href} key={item.name}>
                      <div
                        className={`flex items-center gap-3 px-3 py-2 mb-1 rounded-md transition ${active ? "bg-blue-100 text-[#9c5ecc] font-semibold" : "hover:bg-gray-100"}`}
                      >
                        <Icon size={20} />
                        {isOpen && <span className="text-sm">{item.name}</span>}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center gap-3 px-4 py-2.5 
             text-red-600 font-medium bg-red-50/50 
             hover:bg-red-500 hover:text-white 
             rounded-lg border border-red-100 
             shadow-sm hover:shadow-md hover:shadow-red-200
             transition-all duration-300"
        >
          {isLoggingOut ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <LogOut size={20} />
          )}
          {isOpen && (isLoggingOut ? "Logging out..." : "Logout")}
        </button>
      </aside>
    </>
  );
}
