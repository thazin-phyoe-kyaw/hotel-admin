"use client";

import { useSidebar } from "@/app/hooks/useSidebar";
import { useAuthStore } from "@/app/store/authStore";
import { Menu } from "lucide-react";

export default function Navbar() {
  const { toggle, openMobile, isOpen } = useSidebar();
  const user = useAuthStore((state) => state.user);
  const hotelName = useAuthStore((state) => state.selectedHotelName);

  return (
    <nav
      className={`
        fixed top-0 right-0 left-0 h-16 bg-white shadow-sm z-30
        flex items-center justify-between px-4 md:px-6
        transition-all duration-300
        ${isOpen ? "md:ml-52" : "md:ml-20"}
      `}
    >
      {/* Desktop toggle */}
      <button
        onClick={toggle}
        className="hidden md:flex p-2 rounded-md hover:bg-gray-100"
      >
        <Menu size={22} />
      </button>

      {/* Mobile toggle */}
      <button
        onClick={openMobile}
        className="md:hidden p-2 rounded-md hover:bg-gray-100"
      >
        <Menu size={22} />
      </button>
      <p className=" font-semibold text-slate-700">{hotelName?.toUpperCase()}</p>

      {/* Profile */}
      <p className="font-semibold  text-[#b778e9]">{user?.name}</p>
      {/* <div className="font-semibold px-5 py-1 rounded-full bg-[#b778e9] text-white flex items-center justify-center">
        {user?.name}
      </div> */}
    </nav>
  );
}
