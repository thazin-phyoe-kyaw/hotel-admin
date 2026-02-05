"use client";

import { useState } from "react";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    setError("");

    try {
      const res = await fetch(`/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
console.log(res)
      const data = await res.json();
      console.log(data);

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }
console.log(data)
      localStorage.setItem("token", data.token);

      if (data.role === "admin") router.push("/admin/dashboard");
      else router.push("/");
    } catch (err) {
      console.error(err);
      setError("Network error");
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
        className="bg-blue-600 text-white w-full py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Log In
      </button>
    </form>
  );
}
