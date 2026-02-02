"use server";

import { signAccessToken } from "@/app/lib/auth/token";
import { loginSchema } from "@/app/lib/validators/auth";

export async function loginAction(formData: FormData) {
  const raw = {
    username: formData.get("username"),
    password: formData.get("password"),
    remember: formData.get("remember") === "on",
  };

  const parsed = loginSchema.safeParse(raw);

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0].message };
  }

  const { username, password } = parsed.data;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    return { success: false, message: "Invalid credentials" };
  }

  const data = await res.json();
  signAccessToken(data.token, parsed.data.remember);

  return { success: true };
}
