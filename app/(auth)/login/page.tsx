"use client";
import LoginForm from "@/app/components/forms/Loginform";

export default function LoginPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen text-center">
     
      <div className="hidden md:flex bg-purple-100 items-end justify-center py-20">
        <div>
          <h1 className="text-2xl font-bold text-[#b778e9]">
            One Click Hotel Admin Dashboard
          </h1>
        </div>
      </div>

  
      <div className="flex items-center justify-center px-6 py-10">
        <LoginForm />
      </div>
    </div>
  );
}
