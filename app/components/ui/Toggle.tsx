"use client";

export default function Toggle({ checked, onChange }: any) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`
        w-12 h-6 rounded-full flex items-center transition
        ${checked ? "bg-[#b778e9]" : "bg-gray-300"}
      `}
    >
      <div
        className={`
          h-5 w-5 bg-white rounded-full shadow transform transition
          ${checked ? "translate-x-6" : "translate-x-1"}
        `}
      />
    </button>
  );
}
