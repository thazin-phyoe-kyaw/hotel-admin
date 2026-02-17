"use client";

import RoomForm from "@/app/components/forms/RoomForm";
import DeleteModal from "@/app/components/ui/DeleteModal";
import Drawer from "@/app/components/ui/Drawer";
import DataTable from "@/app/components/ui/Table";
import api from "@/app/lib/api";
import { useEffect, useState } from "react";

export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"add" | "edit">("add");
  const [selectedRow, setSelectedRow] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [openFeaturesModal, setOpenFeaturesModal] = useState(false);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  const getRooms = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/api/hotel/admin/rooms");
      setRooms(data?.data?.rooms || []);
    } catch (err) {
      console.error("Failed to fetch rooms", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/api/hotel/admin/rooms/${deleteId}`);
      await getRooms();
      setOpenDeleteModal(false);
      setDeleteId(null);
    } catch (error) {
      console.error("Failed to delete room", error);
    }
  };

  useEffect(() => {
    getRooms();
  }, []);

  const tableRooms = rooms.map((room: any) => ({
    id: room.id,
    name: room.name,
    room_no: room.room_no,
    type: room.hotel_room_type?.name || "N/A",
    featuresPreview:
      room.features.slice(0, 2).join(", ") +
      (room.features.length > 2 ? "" : ""),
    price: room.price,
    status: room.is_active ? "Active" : "Inactive",
    raw: room,
  }));

  return (
    <div>
      <DataTable
        columns={[
          {
            key: "name",
            label: "Room Name",
            sortable: true,
            render: undefined,
          },
          {
            key: "room_no",
            label: "Room No",
            sortable: true,
            render: undefined,
          },
          {
            key: "type",
            label: "Type",
            sortable: true,
            render: undefined,
          },
          {
            key: "featuresPreview",
            label: "Features",
            render: (row: any) => (
              <div className="flex flex-wrap gap-1">
                {row.raw.features.map((f: string, i: number) => (
                  <span
                    key={i}
                    className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-700"
                  >
                    {f}
                  </span>
                ))}

                {/* {row.raw.features.length > 3 && (
                  <button
                    className="text-blue-600 text-xs underline"
                    onClick={() => {
                      setSelectedFeatures(row.raw.features);
                      setOpenFeaturesModal(true);
                    }}
                  >
                    +{row.raw.features.length - 3} more
                  </button>
                )} */}
              </div>
            ),
          },
          // {
          //   key: "featuresPreview",
          //   label: "Features",
          //   render: (row: any) => (
          //     <div className="flex items-center gap-2">
          //       <span>{row.featuresPreview}</span>
          //       <button
          //         className="text-blue-600 bg-[#E0E7FF] px-2 py-1 rounded text-sm"
          //         onClick={() => {
          //           setSelectedFeatures(row.raw.features);
          //           setOpenFeaturesModal(true);
          //         }}
          //       >
          //         View All
          //       </button>
          //     </div>
          //   ),
          // },

          {
            key: "price",
            label: "Price",
            sortable: true,
            render: undefined,
          },

          {
            key: "status",
            label: "Status",
            render: (row: any) => (
              <span
                className={
                  row.status === "Active"
                    ? "px-2 py-1 bg-green-200 text-green-700 rounded-md"
                    : "px-2 py-1 bg-red-200 text-red-700 rounded-md"
                }
              >
                {row.status}
              </span>
            ),
          },
        ]}
        data={tableRooms}
        name="Rooms"
        searchPlaceholder="Search rooms..."
        onAdd={() => {
          setSelectedRow(null);
          setDrawerMode("add");
          setOpenDrawer(true);
        }}
        onEdit={(row: any) => {
          setSelectedRow(row.raw);
          setDrawerMode("edit");
          setOpenDrawer(true);
        }}
        onDelete={(id: string | number) => {
          setDeleteId(typeof id === "number" ? id : parseInt(id));
          setOpenDeleteModal(true);
        }}
      />

      <Drawer
        open={openDrawer}
        title={drawerMode === "add" ? "Add Room" : "Edit Room"}
        onClose={() => setOpenDrawer(false)}
        onSubmit={function (): void {
          throw new Error("Function not implemented.");
        }}
      >
        <RoomForm
          mode={drawerMode}
          data={selectedRow}
          onClose={() => setOpenDrawer(false)}
          onSuccess={getRooms}
        />
      </Drawer>

      <DeleteModal
        open={openDeleteModal}
        onCancel={() => setOpenDeleteModal(false)}
        onConfirm={handleDelete}
      />

      {/* {openFeaturesModal && (
        <div className="fixed inset-0 bg-black/30 flex items-end">
          <div className="bg-white w-full rounded-t-2xl p-6 shadow-xl animate-slideUp">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">All Features</h2>
              <button onClick={() => setOpenFeaturesModal(false)}>✖</button>
            </div>

            <div className="flex flex-wrap gap-2">
              {selectedFeatures.map((f, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
}
