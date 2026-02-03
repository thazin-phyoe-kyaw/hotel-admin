"use client";

import CustomerForm from "@/app/components/forms/Customer";
import DeleteModal from "@/app/components/ui/DeleteModal";
import Drawer from "@/app/components/ui/Drawer";
import DataTable from "@/app/components/ui/Table";
import { useState } from "react";

export default function CustomerPage() {
  const customers = [
    {
      id: 1,
      name: "Aung Kyaw",
      email: "aung1@mail.com",
      phone: "09111111",
      address: "Yangon",
    },
    {
      id: 2,
      name: "Su Su",
      email: "su2@mail.com",
      phone: "09222222",
      address: "Mandalay",
    },
    {
      id: 3,
      name: "Kyaw Min",
      email: "kyaw3@mail.com",
      phone: "09333333",
      address: "Naypyidaw",
    },
    {
      id: 4,
      name: "Aye Chan",
      email: "aye4@mail.com",
      phone: "09444444",
      address: "Yangon",
    },
    {
      id: 5,
      name: "Thazin",
      email: "thazin5@mail.com",
      phone: "09555555",
      address: "Taunggyi",
    },
    {
      id: 6,
      name: "Wai Yan",
      email: "wai6@mail.com",
      phone: "09666666",
      address: "Monywa",
    },
    {
      id: 7,
      name: "Hnin Pwint",
      email: "hnin7@mail.com",
      phone: "09777777",
      address: "Pyay",
    },
    {
      id: 8,
      name: "Phone Myat",
      email: "phone8@mail.com",
      phone: "09888888",
      address: "Mandalay",
    },
    {
      id: 9,
      name: "Zaw Zaw",
      email: "zaw9@mail.com",
      phone: "09999999",
      address: "Yangon",
    },
    {
      id: 10,
      name: "Yu Mon",
      email: "yu10@mail.com",
      phone: "09101010",
      address: "Mawlamyine",
    },
    {
      id: 11,
      name: "Kaung Htet",
      email: "kaung11@mail.com",
      phone: "09111122",
      address: "Mandalay",
    },
    {
      id: 12,
      name: "Thura",
      email: "thura12@mail.com",
      phone: "09121212",
      address: "Bago",
    },
    {
      id: 13,
      name: "Sandi",
      email: "sandi13@mail.com",
      phone: "09131313",
      address: "Yangon",
    },
    {
      id: 14,
      name: "Shwe Yi",
      email: "shwe14@mail.com",
      phone: "09141414",
      address: "Monywa",
    },
    {
      id: 15,
      name: "Myo Myint",
      email: "myo15@mail.com",
      phone: "09151515",
      address: "Taunggyi",
    },
    {
      id: 16,
      name: "Ei Mon",
      email: "ei16@mail.com",
      phone: "09161616",
      address: "Mandalay",
    },
    {
      id: 17,
      name: "Lin Htet",
      email: "lin17@mail.com",
      phone: "09171717",
      address: "Yangon",
    },
    {
      id: 18,
      name: "Cherry",
      email: "cherry18@mail.com",
      phone: "09181818",
      address: "Naypyidaw",
    },
    {
      id: 19,
      name: "Paing",
      email: "paing19@mail.com",
      phone: "09191919",
      address: "Pyin Oo Lwin",
    },
    {
      id: 20,
      name: "Soe Moe",
      email: "soe20@mail.com",
      phone: "09202020",
      address: "Yangon",
    },
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
          { key: "name", label: "Name", sortable: true },
          { key: "email", label: "Email", sortable: true },
          { key: "phone", label: "Phone", sortable: true },
          { key: "address", label: "Address", sortable: true },
        ]}
        data={customers}
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
        searchPlaceholder="Search customers..."
        name="Customers"
      />

      <Drawer
        open={openDrawer}
        title={drawerMode === "add" ? "Add Customer" : "Edit Customer"}
        onClose={() => setOpenDrawer(false)}
        onSubmit={() => {}}
      >
        <CustomerForm
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
