"use client";
import LoginForm from "@/app/components/forms/Loginform";

export default function LoginPage() {
  return (
    <div className="grid grid-cols-2 h-screen text-center">
      {/* LEFT SECTION */}
      <div className="bg-blue-100 flex items-end py-20 justify-center">
        <div>
          <h1 className="text-2xl font-bold text-blue-700">
            Welcome to Enterprise Self Care
          </h1>
          <p className="text-gray-600 mt-2">
            For any support, please contact 8080 for ATOM number or
            +959780008080 for others.
          </p>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center justify-center">
        <LoginForm />
      </div>
    </div>
  );
}
