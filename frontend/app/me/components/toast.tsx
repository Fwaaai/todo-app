

import { useEffect, useState } from "react";
import { useToastStore } from "@/lib/zustand/store";
export default function Toast() {
  const { message, type, isOpen, hide } = useToastStore();

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        hide();
      }, 3000); // Hide after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [isOpen, hide]);
  const bg = type === "success" ? "bg-green-500" : type === "error" ? "bg-red-500" : "bg-gray-700";
  if (!isOpen) return null;
  return (
    <div
      className={`
        fixed top-0 left-1/2 -translate-x-1/2 mt-4
        px-6 py-3 rounded-xl text-white shadow-lg
        ${bg}
        z-50 flex items-center gap-4
        animate-slideDownAndFade
      `}
    >
      <span>{message}</span>

      <button
        onClick={hide}
        className="text-white/90 hover:text-white font-bold"
      >
        ✕
      </button>
    </div>
  );
}