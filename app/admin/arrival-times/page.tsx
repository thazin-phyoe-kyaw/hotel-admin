'use client'
import ArrivalTimeForm from "@/app/components/forms/ArrivalTimeForm";
import DeleteModal from "@/app/components/ui/DeleteModal";
import Drawer from "@/app/components/ui/Drawer";
import DataTable from "@/app/components/ui/Table";
import api from "@/app/lib/api";
import { useEffect, useState } from "react";


type ArrivalTime = {
  id: string | number;
  name: string;
};

export default function ArrivalTimes() {
  const [loading, setLoading] = useState(false);
  const [arrivalTimes, setArrivalTimes] = useState([]);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"add" | "edit">("add");
  const [selectedRow, setSelectedRow] = useState<any>(null);

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | number | null>(null); 
  (null);

  const getArrivalTimes = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/api/hotel/admin/arrival-times");
      setArrivalTimes(data?.data?.arrival_times || []);
      // Fetch arrival times from API and update state
    } catch (err) {
      console.error("Failed to fetch arrival times", err);
    } finally {
      setLoading(false);
    }
  };

   const handleDelete = async () => {
    if (!deleteId) return;

    try {
        await api.delete(`/api/hotel/admin/arrival-times/${deleteId}`);
      // Call API to delete arrival time by deleteId

      await getArrivalTimes();
      setOpenDeleteModal(false);
      setDeleteId(null);
    } catch (error) {
      console.error("Failed to delete arrival time", error);
    }
  };

    useEffect(() => {
      getArrivalTimes();
    }, []);
  return (
    <div>
      <DataTable
        columns={[
          {
            key: "id",
            label: "ID",
            render: undefined,
          },
          {
            key: "name",
            label: "Name",
            render: undefined,
          },
        ]}
        data={arrivalTimes as ArrivalTime[]}
        onEdit={(row: ArrivalTime) => {
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
        searchPlaceholder="Search arrival times..."
        name="Arrival Time"
      />
      <Drawer
        open={openDrawer}
        title={
          drawerMode === "add" ? "Add Arrival Time" : "Edit Arrival Time  "
        }
        onClose={() => setOpenDrawer(false)}
        onSubmit={() => {}}
      >
        <ArrivalTimeForm
          mode={drawerMode}
          data={selectedRow as ArrivalTime | null}
          onClose={() => setOpenDrawer(false)}
          onSuccess={getArrivalTimes}
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
