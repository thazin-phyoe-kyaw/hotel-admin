"use client";

import HotelAmenityForm from "@/app/components/forms/HotelAmenity";
import DeleteModal from "@/app/components/ui/DeleteModal";
import Drawer from "@/app/components/ui/Drawer";
import Loading from "@/app/components/ui/Loading";
import DataTable from "@/app/components/ui/Table";
import api from "@/app/lib/api";
import { CheckCircle, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

type HotelAmenity = {
  id: string | number;
  name: string;
  icon: string;
  is_active: boolean;
};

export default function HotelAmenities() {
  const [loading, setLoading] = useState(false);
  const [hotelAmenities, setHotelAmenities] = useState([]);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"add" | "edit">("add");
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | number | null>(null);
  
  const getHotelsAmenities = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/api/hotel/admin/hotel-amenities");
      setHotelAmenities(data?.data?.amenities || []);
    } catch (err) {
      console.error("Failed to fetch hotel amenities", err);
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await api.delete(`/api/hotel/admin/hotel-amenities/${deleteId}`);

      await getHotelsAmenities();
      setOpenDeleteModal(false);
      setDeleteId(null);
    } catch (error) {
      console.error("Failed to delete amenity", error);
    }
  };

  useEffect(() => {
    getHotelsAmenities();
  }, []);

  return (
    <div>
      {/* {loading && <Loading />} */}
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
            render: (row: HotelAmenity) => (
              <img
                src={`${row.icon}`}
                alt={row.name}
                className="h-10 w-10 object-cover rounded-md border"
              />
            ),
          },
          {
            key: "is_active",
            label: "Active",
            sortable: true,
            render: (row: HotelAmenity) =>
              row.is_active ? (
                <CheckCircle className="text-green-500 w-5 h-5" />
              ) : (
                <XCircle className="text-red-500 w-5 h-5" />
              ),
          },
        ]}
        data={hotelAmenities as HotelAmenity[]}
        onEdit={(row: HotelAmenity) => {
          setSelectedRow(row);
          setDrawerMode("edit");
          setOpenDrawer(true);
        }}
        onDelete={(id: string | number) => {
          setDeleteId(id);
          setOpenDeleteModal(true);
        }}
        onAdd={() => {
          setSelectedRow(null);
          setDrawerMode("add");
          setOpenDrawer(true);
        }}
        searchPlaceholder="Search hotel amenities..."
        name="Hotel Amenities"
      />

      <Drawer
        open={openDrawer}
        title={
          drawerMode === "add" ? "Add Hotel Amenity" : "Edit Hotel Amenity"
        }
        onClose={() => setOpenDrawer(false)}
        onSubmit={() => {}}
      >
        <HotelAmenityForm
          mode={drawerMode}
          data={selectedRow as HotelAmenity | null}
          onClose={() => setOpenDrawer(false)}
          onSuccess={getHotelsAmenities}
        />
      </Drawer>

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
