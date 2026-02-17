"use client";
import RoomForm from "@/app/components/forms/RoomForm";
import RoomTypeForm from "@/app/components/forms/RoomTypeForm";
import DeleteModal from "@/app/components/ui/DeleteModal";
import Drawer from "@/app/components/ui/Drawer";
import DataTable from "@/app/components/ui/Table";
import api from "@/app/lib/api";
import { RoomType } from "@/app/types/roomtype";
import { useEffect, useState } from "react";

export default function RoomTypePage() {
  const [loading, setLoading] = useState(false);
  const [roomTypes, setRoomTypes] = useState([]);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"add" | "edit">("add");
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | number | null>(null);

  const getRoomTypes = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/api/hotel/admin/room-types");
      setRoomTypes(data?.data?.room_types || []);
    } catch (err) {
      console.error("Failed to fetch room types", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/api/hotel/admin/room-types/${deleteId}`);
      await getRoomTypes();
      setOpenDeleteModal(false);
      setDeleteId(null);
    } catch (error) {
      console.error("Failed to delete room type", error);
    }
  };

  useEffect(() => {
    getRoomTypes();
  }, []);
  return (
    <div>
      <DataTable
        columns={[
          {
            key: "name",
            label: "Name",
            sortable: true,
            render: undefined,
          },
          {
            key: "icon",
            label: "Icon",
            sortable: true,
            render: (row: RoomType) => (
              <img
                src={`${row.icon}`}
                alt={row.name}
                className="h-10 w-10 object-cover rounded-md border"
              />
            ),
          },
          {
            key: "description",
            label: "Description",
            sortable: true,
            render: undefined,
          },
        ]}
        data={roomTypes as RoomType[]}
        onEdit={(row: RoomType) => {
          setSelectedRow(row);
          setDrawerMode("edit");
          setOpenDrawer(true);
        }}
        onDelete={(id) => {
          setDeleteId(id);
          setOpenDeleteModal(true);
        }}
        onAdd={() => {
          setSelectedRow(null);
          setDrawerMode("add");
          setOpenDrawer(true);
        }}
        // onDelete={(id) => console.log("DELETE ROOM:", id)}
        searchPlaceholder="Search room types..."
        name="Room Types"
      />
      <Drawer
        open={openDrawer}
        title={drawerMode === "add" ? "Add Room Type" : "Edit Room Type"}
        onClose={() => setOpenDrawer(false)}
        onSubmit={() => console.log("Hi")}
      >
        <input type="HI" />
        <RoomTypeForm
          mode={drawerMode}
          data={selectedRow}
          onClose={() => setOpenDrawer(false)}
          onSuccess={getRoomTypes}
        />
      </Drawer>

      {/* Delete Modal */}
      <DeleteModal
        open={openDeleteModal}
        onCancel={() => setOpenDeleteModal(false)}
        onConfirm={() => {
          handleDelete();
          setOpenDeleteModal(false);
        }}
      />
    </div>
  );
}
