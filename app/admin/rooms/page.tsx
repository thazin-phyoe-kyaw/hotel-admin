"use client";
import RoomForm from "@/app/components/forms/RoomForm";
import DeleteModal from "@/app/components/ui/DeleteModal";
import Drawer from "@/app/components/ui/Drawer";
import DataTable from "@/app/components/ui/Table";
import { useState } from "react";

export default function RoomsPage() {
  const rooms = [
    { id: 1, name: "Room 101", type: "Deluxe", price: 120 },
    { id: 2, name: "Room 102", type: "Single", price: 80 },
    { id: 1, name: "Room 101", type: "Deluxe", price: 120 },
    { id: 2, name: "Room 102", type: "Single", price: 80 },
    { id: 1, name: "Room 101", type: "Deluxe", price: 120 },
    { id: 2, name: "Room 102", type: "Single", price: 80 },
    { id: 1, name: "Room 101", type: "Deluxe", price: 120 },
    { id: 2, name: "Room 102", type: "Single", price: 80 },
    { id: 1, name: "Room 101", type: "Deluxe", price: 120 },
    { id: 2, name: "Room 102", type: "Single", price: 80 },
    { id: 1, name: "Room 101", type: "Deluxe", price: 120 },
    { id: 2, name: "Room 102", type: "Single", price: 80 },
    { id: 1, name: "Room 101", type: "Deluxe", price: 120 },
    { id: 2, name: "Room 102", type: "Single", price: 80 },
    { id: 1, name: "Room 101", type: "Deluxe", price: 120 },
    { id: 2, name: "Room 102", type: "Single", price: 80 },
    { id: 1, name: "Room 101", type: "Deluxe", price: 120 },
    { id: 2, name: "Room 102", type: "Single", price: 80 },
  ];
  const [openDrawer, setOpenDrawer] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"add" | "edit">("add");
  const [selectedRow, setSelectedRow] = useState<any>(null);

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | number | null>(null);
  return (
    <div>
      <DataTable
        columns={[
          { key: "name", label: "Room Name", sortable: true },
          { key: "type", label: "Type", sortable: true },
          { key: "price", label: "Price", sortable: true },
        ]}
        data={rooms}
        // onEdit={(row) => console.log("EDIT ROOM:", row)}
        onEdit={(row) => {
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
        searchPlaceholder="Search rooms..."
        name="Rooms"
      />
      <Drawer
        open={openDrawer}
        title={drawerMode === "add" ? "Add Room" : "Edit Room"}
        onClose={() => setOpenDrawer(false)}
        onSubmit={() => console.log("Hi")}
      >
        <input type="HI" />
        <RoomForm
          mode={drawerMode}
          data={selectedRow}
          onClose={() => setOpenDrawer(false)}
        />
      </Drawer>

      {/* Delete Modal */}
      <DeleteModal
        open={openDeleteModal}
        onCancel={() => setOpenDeleteModal(false)}
        onConfirm={() => {
          console.log("Delete:", deleteId);
          setOpenDeleteModal(false);
        }}
      />
    </div>
  );
}
