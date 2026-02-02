// "use client";

// import Sidebar from "../components/admin/Sidebar";
// import Navbar from "../components/admin/Navbar";

// export default function AdminLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <div className="flex">
//       <Sidebar />

//       <div className="flex-1 ml-0">
//         <Navbar />
//         <main className="p-6 mt-16">{children}</main>
//       </div>
//     </div>
//   );
// }
"use client";

import Sidebar from "../components/admin/Sidebar";
import Navbar from "../components/admin/Navbar";
import { useSidebar } from "@/app/hooks/useSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOpen } = useSidebar();

  return (
    <div className="flex">
      <Sidebar />

      {/* Main wrapper shifts based on sidebar width */}
      <div
        className={`
          flex-1 transition-all duration-300
          ${isOpen ? "md:ml-52" : "md:ml-20"}
        `}
      >
        <Navbar />

        {/* Page content */}
        <main className="p-6 mt-16">
          {children}
        </main>
      </div>
    </div>
  );
}

