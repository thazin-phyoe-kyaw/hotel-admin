"use client";

import { useCallback, useEffect, useState } from "react";
import api from "@/app/lib/api";
import DataTable from "@/app/components/ui/Table";
import Drawer from "@/app/components/ui/Drawer";
import DeleteModal from "@/app/components/ui/DeleteModal";
import BankAccountForm from "@/app/components/forms/BankAccountForm";
// import BankAccountForm from "@/app/components/forms/BankAccountForm";

type BankAccount = {
  id: number;
  user_id: number;
  bank_branch: string;
  account_name: string;
  account_number: string;
  is_default: boolean;
};

export default function BankAccounts() {
  const [loading, setLoading] = useState(false);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"add" | "edit">("add");
  const [selectedRow, setSelectedRow] = useState<BankAccount | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchBankAccounts = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/api/hotel/bank-accounts");
      setBankAccounts(data?.data || []);
    } catch (error) {
      console.error("Failed to fetch bank accounts", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDelete = useCallback(async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/api/hotel/bank-accounts/${deleteId}`);
      await fetchBankAccounts();
    } catch (error) {
      console.error("Failed to delete bank account", error);
    } finally {
      setDeleteModalOpen(false);
      setDeleteId(null);
    }
  }, [deleteId, fetchBankAccounts]);

  useEffect(() => {
    fetchBankAccounts();
  }, [fetchBankAccounts]);

  const handleAdd = () => {
    setSelectedRow(null);
    setDrawerMode("add");
    setDrawerOpen(true);
  };

  const handleEdit = (row: BankAccount) => {
    setSelectedRow(row);
    setDrawerMode("edit");
    setDrawerOpen(true);
  };

  const handleDeleteRequest = (id: string | number) => {
    setDeleteId(typeof id === "string" ? Number(id) : id);
    setDeleteModalOpen(true);
  };

  return (
    <div>
      <DataTable
        loading={loading}
        name="Bank Accounts"
        searchPlaceholder="Search bank accounts..."
        data={bankAccounts}
        columns={[
          {
            key: "bank_branch",
            label: "Branch",
            sortable: true,
            render: undefined,
          },
          {
            key: "account_name",
            label: "Account Name",
            sortable: true,
            render: undefined,
          },
          {
            key: "account_number",
            label: "Account Number",
            sortable: true,
            render: undefined,
          },
          {
            key: "is_default",
            label: "Default",
            render: (row: BankAccount) => (
              <span
                className={`px-3 py-1 rounded-full text-white text-xs ${
                  row.is_default ? "bg-green-500" : "bg-gray-400"
                }`}
              >
                {row.is_default ? "Default" : "Not Default"}
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
        title={drawerMode === "add" ? "Add Bank Account" : "Edit Bank Account"}
        onClose={() => setDrawerOpen(false)}
        onSubmit={() => {}}
      >
        <BankAccountForm
          mode={drawerMode}
          data={selectedRow}
          onClose={() => setDrawerOpen(false)}
          onSuccess={fetchBankAccounts}
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
