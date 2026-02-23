"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";

import api from "@/app/lib/api";
import DataTable from "@/app/components/ui/Table";
import Drawer from "@/app/components/ui/Drawer";
import DeleteModal from "@/app/components/ui/DeleteModal";
import HotelAmenityForm from "@/app/components/forms/HotelAmenity";

type HotelAmenity = {
  id: string | number;
  name: string;
  icon: string;
  is_active: boolean;
};

export default function HotelAmenities() {
  const [loading, setLoading] = useState(false);
  const [amenities, setAmenities] = useState<HotelAmenity[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"add" | "edit">("add");
  const [selectedAmenity, setSelectedAmenity] = useState<HotelAmenity | null>(
    null,
  );

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | number | null>(null);

  const fetchAmenities = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/api/hotel/admin/hotel-amenities");
      setAmenities(data?.data?.amenities || []);
    } catch (error) {
      console.error("Failed to fetch hotel amenities", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDelete = useCallback(async () => {
    if (!deleteId) return;

    try {
      await api.delete(`/api/hotel/admin/hotel-amenities/${deleteId}`);
      await fetchAmenities();
    } catch (error) {
      console.error("Failed to delete amenity", error);
    } finally {
      setDeleteModalOpen(false);
      setDeleteId(null);
    }
  }, [deleteId, fetchAmenities]);

  useEffect(() => {
    fetchAmenities();
  }, [fetchAmenities]);

  const handleAdd = () => {
    setSelectedAmenity(null);
    setDrawerMode("add");
    setDrawerOpen(true);
  };

  const handleEdit = (row: HotelAmenity) => {
    setSelectedAmenity(row);
    setDrawerMode("edit");
    setDrawerOpen(true);
  };

  const handleDeleteRequest = (id: string | number) => {
    setDeleteId(id);
    setDeleteModalOpen(true);
  };

  return (
    <div>
      <DataTable
        loading={loading}
        name="Hotel Amenities"
        searchPlaceholder="Search hotel amenities..."
        data={amenities}
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
            sortable: false,
            render: (row: HotelAmenity) => (
              <img
                src={row.icon}
                alt={row.name}
                className="h-10 w-10 object-cover rounded-md border"
              />
            ),
          },
          {
            key: "is_active",
            label: "Active",
            render: (row: any) => (
              <span
                className={`
      inline-flex justify-center items-center
      py-0.5 rounded-full font-medium
      ${
        row.is_active === true
          ? "bg-green-200 text-green-700"
          : "bg-red-200 text-red-700"
      }
    `}
                style={{ width: "70px" }}
              >
                {row.is_active ? "Active" : "Inactive"}
              </span>
            ),
          },
        ]}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDeleteRequest}
      />

      <Drawer
        open={drawerOpen}
        title={
          drawerMode === "add" ? "Add Hotel Amenity" : "Edit Hotel Amenity"
        }
        onClose={() => setDrawerOpen(false)}
        onSubmit={() => {}} // Provide a no-op or appropriate handler
      >
        <HotelAmenityForm
          mode={drawerMode}
          data={selectedAmenity}
          onClose={() => setDrawerOpen(false)}
          onSuccess={fetchAmenities}
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
