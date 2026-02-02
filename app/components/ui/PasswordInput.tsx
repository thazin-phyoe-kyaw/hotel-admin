"use client";

import { useState } from "react";

export function PasswordInput({ error, ...props }: any) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative w-full">
      <input
        {...props}
        type={show ? "text" : "password"}
        className={`w-full border rounded-lg px-3 py-2 text-sm outline-none ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />

      <button
        type="button"
        className="absolute right-3 top-2.5 text-gray-500 text-sm"
        onClick={() => setShow(!show)}
      >
        {show ? "🙈" : "👁️"}
      </button>

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
