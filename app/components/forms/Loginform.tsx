"use client";

import { useState } from "react";
import { User, Lock, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuthStore } from "@/app/store/authStore";
import api from "@/app/lib/api";
import { setCookie } from "cookies-next";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const setAuth = useAuthStore((state) => state.setAuth);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
  
    setLoading(true);

    try {
      const res = await api.post("/api/hotel/admin/login", { email, password });

      const { token, role, user } = res.data.data;

      setAuth({ token, role, user });

      setCookie("token", token, { maxAge: 60 * 60 * 24, path: "/" });
      router.push("/select-hotel");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    }
  };
  return (
    <form onSubmit={handleLogin} className="w-80 space-y-4">
      <h2 className="text-xl font-semibold mb-2">Log In to your Account</h2>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      {/* Email */}
      <div className="relative w-full">
        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          name="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="pl-10 pr-3 py-2 w-full rounded-lg border shadow-sm"
        />
      </div>

      {/* Password */}
      <div className="relative w-full">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />

        <button
          type="button"
          onClick={() => setShow((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          tabIndex={-1}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>

        <input
          type={show ? "text" : "password"}
          name="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="pl-10 pr-10 py-2 w-full rounded-lg border shadow-sm"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className={`
          group relative w-full py-2.5 px-4 rounded-xl font-semibold text-sm
          flex items-center justify-center gap-2
          transition-all duration-300 ease-in-out
          ${
            loading
              ? "bg-blue-400 cursor-not-allowed text-blue-50"
              : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 active:scale-[0.98]"
          }
        `}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Authenticating...</span>
          </>
        ) : (
          <>
            <span>Log in</span>
           
          </>
        )}
      </button>

      {/* <button
        type="submit"
        className="bg-blue-600 text-white w-full py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Log In
      </button> */}
    </form>
  );
}
