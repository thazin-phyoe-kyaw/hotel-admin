"use client";

import React from "react";

export function Input({ error, ...props }: any) {
  return (
    <div className="w-full">
      <input
        {...props}
        className={`w-full border rounded-lg px-3 py-2 text-sm outline-none ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
