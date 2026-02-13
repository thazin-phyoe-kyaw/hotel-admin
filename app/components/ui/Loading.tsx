import React from "react";

const Loading = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm z-50">
      <div className="flex flex-col items-center gap-3">
        {/* Spinner */}
        <div className="h-10 w-10 border-4 border-[#b778e9] border-t-transparent rounded-full animate-spin"></div>

        {/* Text */}
        <p className="text-[#b778e9] font-medium tracking-wide">
          Loading, please wait...
        </p>
      </div>
    </div>
  );
};

export default Loading;
