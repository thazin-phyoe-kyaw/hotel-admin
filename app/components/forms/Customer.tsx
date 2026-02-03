"use client";

import { useState } from "react";

export default function CustomerForm({ mode, data, onClose }: any) {
  const [name, setName] = useState(data?.name || "");
  const [email, setEmail] = useState(data?.email || "");
  const [phone, setPhone] = useState(data?.phone || "");
  const [address, setAddress] = useState(data?.address || "");

  function handleSubmit() {
    if (mode === "add") {
      console.log("ADD CUSTOMER:", { name, email, phone, address });
    } else {
      console.log("UPDATE CUSTOMER:", data.id, {
        name,
        email,
        phone,
        address,
      });
    }
    onClose(); // close drawer
  }

  return (
    <div className="space-y-4">
      {/* Name */}
      <div>
        <label className="font-semibold">Customer Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="
            pl-2 py-2 w-full rounded-lg shadow-sm
            border border-gray-200
            hover:outline-blue-300 focus:outline-blue-300
          "
        />
      </div>

      {/* Email */}
      <div>
        <label className="font-semibold">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="
            pl-2 py-2 w-full rounded-lg shadow-sm
            border border-gray-200
            hover:outline-blue-300 focus:outline-blue-300
          "
        />
      </div>

      {/* Phone */}
      <div>
        <label className="font-semibold">Phone</label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="
            pl-2 py-2 w-full rounded-lg shadow-sm
            border border-gray-200
            hover:outline-blue-300 focus:outline-blue-300
          "
        />
      </div>

      {/* Address */}
      <div>
        <label className="font-semibold">Address</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="
            pl-2 py-2 w-full rounded-lg shadow-sm
            border border-gray-200
            hover:outline-blue-300 focus:outline-blue-300
          "
        />
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
      >
        {mode === "add" ? "Add Customer" : "Update Customer"}
      </button>
    </div>
  );
}
