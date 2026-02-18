"use client";

import { useCallback, useEffect, useState } from "react";

import RoomTypeForm from "@/app/components/forms/RoomTypeForm";
import DeleteModal from "@/app/components/ui/DeleteModal";
import Drawer from "@/app/components/ui/Drawer";
import DataTable from "@/app/components/ui/Table";
import api from "@/app/lib/api";
import { RoomType } from "@/app/types/roomtype";

export default function RoomTypePage() {
  const [loading, setLoading] = useState(false);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"add" | "edit">("add");
  const [selectedRow, setSelectedRow] = useState<RoomType | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | number | null>(null);

  // FETCH ROOM TYPES
  const fetchRoomTypes = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/api/hotel/admin/room-types");
      setRoomTypes(data?.data?.room_types || []);
    } catch (error) {
      console.error("Failed to fetch room types", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // DELETE ROOM TYPE
  const handleDelete = useCallback(async () => {
    if (!deleteId) return;

    try {
      await api.delete(`/api/hotel/admin/room-types/${deleteId}`);
      await fetchRoomTypes();
    } catch (error) {
      console.error("Failed to delete room type", error);
    } finally {
      setDeleteModalOpen(false);
      setDeleteId(null);
    }
  }, [deleteId, fetchRoomTypes]);

  useEffect(() => {
    fetchRoomTypes();
  }, [fetchRoomTypes]);

  // ADD HANDLER
  const handleAdd = () => {
    setSelectedRow(null);
    setDrawerMode("add");
    setDrawerOpen(true);
  };

  // EDIT HANDLER
  const handleEdit = (row: RoomType) => {
    setSelectedRow(row);
    setDrawerMode("edit");
    setDrawerOpen(true);
  };

  // DELETE REQUEST
  const handleDeleteRequest = (id: string | number) => {
    setDeleteId(id);
    setDeleteModalOpen(true);
  };

  return (
    <div>
      {/* TABLE */}
      <DataTable
        loading={loading}
        name="Room Types"
        searchPlaceholder="Search room types..."
        data={roomTypes}
        columns={[
          {
            key: "name",
            label: "Name",
            sortable: true,
            render: (row: RoomType) => row.name,
          },
          {
            key: "icon",
            label: "Icon",
            sortable: false,
            render: (row: RoomType) => (
              <img
                src={row.icon}
                alt={row.name}
                className="h-10 w-10 object-cover rounded-md border"
              />
            ),
          },
          {
            key: "description",
            label: "Description",
            sortable: true,
            render: (row: RoomType) => row.description,
          },
        ]}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDeleteRequest}
      />

      {/* DRAWER */}
      <Drawer
        open={drawerOpen}
        title={drawerMode === "add" ? "Add Room Type" : "Edit Room Type"}
        onClose={() => setDrawerOpen(false)}
        onSubmit={() => {}}
      >
        <RoomTypeForm
          mode={drawerMode}
          data={selectedRow}
          onClose={() => setDrawerOpen(false)}
          onSuccess={fetchRoomTypes}
        />
      </Drawer>

      {/* DELETE MODAL */}
      <DeleteModal
        open={deleteModalOpen}
        onCancel={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
