"use client";

import { usePathname } from "next/navigation";
import {
  Home,
  BedDouble,
  Users,
  CalendarCheck,
  Settings,
  LogOut,
  X,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";
import { useSidebar } from "@/app/hooks/useSidebar";

const menuGroups = [
  {
    title: "User Information",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: Home },
      { name: "Rooms", href: "/rooms", icon: BedDouble },
      { name: "Customers", href: "/customers", icon: Users },

      { name: "Bookings", href: "/bookings", icon: CalendarCheck },
    ],
  },
  {
    title: "Room Information",
    items: [
      { name: "Delxue", href: "/del", icon: BedDouble },
      { name: "Settings", href: "/settings", icon: Settings },
      { name: "Bookings", href: "/bookings", icon: CalendarCheck },
    ],
  },

  {
    title: "Settings",
    items: [
      { name: "Settings", href: "/settings", icon: Settings },
      { name: "Help and support", href: "/help", icon: HelpCircle },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isOpen, isMobileOpen, closeMobile } = useSidebar();

  return (
    <>
      {/* MOBILE BACKDROP */}
      {/* {isMobileOpen && (
        <div className="fixed inset-0  z-40 md:hidden" onClick={closeMobile} />
      )} */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={closeMobile}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-50 bg-white  shadow-sm
          transition-all duration-300
          flex flex-col
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          ${isOpen ? "w-52" : "w-20"}
        `}
      >
        {/* MOBILE CLOSE BUTTON */}
        <button
          onClick={closeMobile}
          className="md:hidden absolute top-4 right-4"
        >
          <X size={22} />
        </button>

        {/* LOGO */}
        <div className="px-3 py-5 ">
          {/* <h1
            className={`font-bold text-xl transition-opacity duration-200 ${!isOpen && "opacity-0"}`}
          >
            Hotel Admin
          </h1> */}
          <h1 className={`font-bold transition-opacity duration-200 `}>
            ADMIN
          </h1>
        </div>

        {/* NAV */}
        <nav className="flex flex-col gap-1 flex-1">
          {menuGroups.map((group) => (
            <div key={group.title} className=" shadow-sm ">
              {/* section title */}
              {!isOpen ? (
                <div />
              ) : (
                <p
                  className={`
          text-xs font-semibold tracking-wide px-2 my-4
          transition-opacity duration-200
          ${!isOpen && "opacity-0"}
        `}
                >
                  {group.title.toUpperCase()}
                </p>
              )}

              {/* menu items */}
              <div className="flex flex-col gap-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = pathname.startsWith(item.href);

                  return (
                    <Link href={item.href} key={item.name}>
                      <div
                        className={`
                  flex items-center gap-3  px-4 py-2 rounded-md cursor-pointer
                  transition
                  ${active ? "bg-blue-200 text-blue-500 font-bold" : "hover:bg-gray-100"}
                `}
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

        {/* LOGOUT */}
        <button className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 mb-4">
          <LogOut size={20} />
          {isOpen && "Logout"}
        </button>
      </aside>
    </>
  );
}
