"use client";

import { loginAction } from "@/app/(auth)/login/actions";
import { useActionState } from "react";
import { useState } from "react";
import { User, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginForm() {
  const [state, formAction] = useActionState(loginAction, {
    success: false,
    message: "",
  });

  const [show, setShow] = useState(false);

  return (
    <form action={formAction} className="w-80 space-y-4">

      <h2 className="text-xl  font-semibold text-left mb-2">
        Log In to your Account
      </h2>

      <p className="text-gray-500 text-sm text-left mb-6">
        Welcome back! Please enter your details.
      </p>

      {state.message && (
        <p className="text-red-600 text-sm">{state.message}</p>
      )}

      {/* Username Input */}
      <div className="relative w-full">
        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />

        <input
          type="text"
          name="username"
          placeholder="Atom Business"
          className="
            pl-10 pr-3 py-2 w-full rounded-lg shadow-sm
            border border-gray-200
            hover:outline-blue-300 focus:outline-blue-300
            placeholder:text-gray-400
          "
        />
      </div>

      {/* Password Input */}
      <div className="relative w-full">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />

        {/* Eye Toggle Button */}
        <button
          type="button"
          onClick={() => setShow((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          tabIndex={-1}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>

        <input
          type={show ? "text" : "password"}
          name="password"
          placeholder="••••••••"
          className="
            pl-10 pr-10 py-2 w-full rounded-lg shadow-sm
            border border-gray-200
            hover:outline-blue-300 focus:outline-blue-300
            placeholder:text-gray-400
          "
        />
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="remember" />
          Remember me
        </label>

        <a href="/forgot-password" className="text-sm text-blue-600">
          Forgot Password?
        </a>
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
