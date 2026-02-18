"use client";

import { useCallback, useEffect, useState } from "react";
import api from "@/app/lib/api";

import DataTable from "@/app/components/ui/Table";
import Drawer from "@/app/components/ui/Drawer";
import DeleteModal from "@/app/components/ui/DeleteModal";
import RoomForm from "@/app/components/forms/RoomForm";

export default function RoomsPage() {
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState([]);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"add" | "edit">("add");
  const [selectedRoom, setSelectedRoom] = useState<any>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // =========================
  // ✅ Fetch Rooms
  // =========================
  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/api/hotel/admin/rooms");
      setRooms(data?.data?.rooms || []);
    } catch (error) {
      console.error("Failed to fetch rooms", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  // =========================
  // ✅ Delete Room
  // =========================
  const handleDelete = useCallback(async () => {
    if (!deleteId) return;

    try {
      await api.delete(`/api/hotel/admin/rooms/${deleteId}`);
      await fetchRooms();
    } catch (error) {
      console.error("Failed to delete room", error);
    } finally {
      setDeleteModalOpen(false);
      setDeleteId(null);
    }
  }, [deleteId, fetchRooms]);

  // =========================
  // Add/Edit Handlers
  // =========================
  const handleAdd = () => {
    setSelectedRoom(null);
    setDrawerMode("add");
    setDrawerOpen(true);
  };

  const handleEdit = (row: any) => {
    setSelectedRoom(row.raw);
    setDrawerMode("edit");
    setDrawerOpen(true);
  };

  const handleDeleteRequest = (id: number | string) => {
    setDeleteId(typeof id === "number" ? id : parseInt(id));
    setDeleteModalOpen(true);
  };

  // =========================
  // Table Format (same UI)
  // =========================

  const tableRooms = rooms.map((room: any) => ({
    id: room.id,
    name: room.name,
    room_no: room.room_no,
    type: room.hotel_room_type?.name || "N/A",
    features: room.features,
    price: room.price,
    status: room.is_active ? "Active" : "Inactive",
    raw: room,
  }));

  return (
    <div>
      <DataTable
        loading={loading}
        name="Rooms"
        searchPlaceholder="Search rooms..."
        data={tableRooms}
        columns={[
          {
            key: "name",
            label: "Room Name",
            sortable: true,
            render: (row: any) => <span>{row.name}</span>,
          },
          {
            key: "room_no",
            label: "Room No",
            sortable: true,
            render: (row: any) => <span>{row.room_no}</span>,
          },
          {
            key: "type",
            label: "Type",
            sortable: true,
            render: (row: any) => <span>{row.type}</span>,
          },

          {
            key: "features",
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
              </div>
            ),
          },

          {
            key: "price",
            label: "Price",
            sortable: true,
            render: (row: any) => <span>{row.price}</span>,
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
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDeleteRequest}
      />

      {/* Drawer */}
      <Drawer
        open={drawerOpen}
        title={drawerMode === "add" ? "Add Room" : "Edit Room"}
        onClose={() => setDrawerOpen(false)}
        onSubmit={() => {}}
      >
        <RoomForm
          mode={drawerMode}
          data={selectedRoom}
          onClose={() => setDrawerOpen(false)}
          onSuccess={fetchRooms}
        />
      </Drawer>

      {/* Delete Modal */}
      <DeleteModal
        open={deleteModalOpen}
        onCancel={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
