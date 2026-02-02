"use client";

export function Checkbox({ label, ...props }: any) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input type="checkbox" {...props} className="h-4 w-4" />
      {label}
    </label>
  );
}
