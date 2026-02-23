"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";

import api from "@/app/lib/api";
import DataTable from "@/app/components/ui/Table";
import Drawer from "@/app/components/ui/Drawer";
import DeleteModal from "@/app/components/ui/DeleteModal";
import ArrivalTimeForm from "@/app/components/forms/ArrivalTimeForm";

type ArrivalTime = {
  id: string | number;
  name: string;
  active?: boolean; 
};

export default function ArrivalTimes() {
  const [loading, setLoading] = useState(false);
  const [arrivalTimes, setArrivalTimes] = useState<ArrivalTime[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"add" | "edit">("add");
  const [selectedRow, setSelectedRow] = useState<ArrivalTime | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | number | null>(null);


  const fetchArrivalTimes = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/api/hotel/admin/arrival-times");
      setArrivalTimes(data?.data?.arrival_times || []);
    } catch (error) {
      console.error("Failed to fetch arrival times", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDelete = useCallback(async () => {
    if (!deleteId) return;

    try {
      await api.delete(`/api/hotel/admin/arrival-times/${deleteId}`);
      await fetchArrivalTimes();
    } catch (error) {
      console.error("Failed to delete arrival time", error);
    } finally {
      setDeleteModalOpen(false);
      setDeleteId(null);
    }
  }, [deleteId, fetchArrivalTimes]);

  useEffect(() => {
    fetchArrivalTimes();
  }, [fetchArrivalTimes]);

  const handleAdd = () => {
    setSelectedRow(null);
    setDrawerMode("add");
    setDrawerOpen(true);
  };

  const handleEdit = (row: ArrivalTime) => {
    setSelectedRow(row);
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
        name="Arrival Time"
        searchPlaceholder="Search arrival times..."
        data={arrivalTimes}
        columns={[
          {
            key: "name",
            label: "Name",
            sortable: true,
            render: undefined,
          },
        ]}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDeleteRequest}
      />

      <Drawer
        open={drawerOpen}
        title={drawerMode === "add" ? "Add Arrival Time" : "Edit Arrival Time"}
        onClose={() => setDrawerOpen(false)}
        onSubmit={() => {}} // not needed; form handles submit
      >
        <ArrivalTimeForm
          mode={drawerMode}
          data={selectedRow}
          onClose={() => setDrawerOpen(false)}
          onSuccess={fetchArrivalTimes}
        />
      </Drawer>

      <DeleteModal
        open={deleteModalOpen}
        onCancel={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
