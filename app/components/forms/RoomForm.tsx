"use client";

import { useState } from "react";

export default function RoomForm({ mode, data, onClose }: any) {
  const [roomNo, setRoomNo] = useState(data?.roomNo || "");
  const [type, setType] = useState(data?.type || "");
  const [price, setPrice] = useState(data?.price || "");

  function handleSubmit() {
    if (mode === "add") {
      console.log("ADD:", { roomNo, type, price });
    } else {
      console.log("UPDATE:", data.id, { roomNo, type, price });
    }
    onClose();
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="font-semibold">Room Number</label>
        <input
          type="text"
          value={roomNo}
          name="roomNo"
          //   placeholder="Room Number"
          onChange={(e) => setRoomNo(e.target.value)}
          className="
            pl-2 py-2 w-full rounded-lg shadow-sm
            border border-gray-200
            hover:outline-blue-300 focus:outline-blue-300
            placeholder:text-gray-400
          "
        />
      </div>

      <div>
        <label className="font-semibold">Type</label>
        <input
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="
            pl-2 py-2 w-full rounded-lg shadow-sm
            border border-gray-200
            hover:outline-blue-300 focus:outline-blue-300
            placeholder:text-gray-400
          "
        />
      </div>

      <div>
        <label className="font-semibold">Price</label>
        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="
            pl-2 py-2 w-full rounded-lg shadow-sm
            border border-gray-200
            hover:outline-blue-300 focus:outline-blue-300
            placeholder:text-gray-400
          "
        />
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
      >
        {mode === "add" ? "Add Room" : "Update Room"}
      </button>
    </div>
  );
}
