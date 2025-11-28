"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuth } from "../../isAuth";
import { Sidebar } from "../../components/sidebar";
import { useState } from "react";
import { useToastStore } from "@/lib/zustand/store";
//import data from backend

const user = "John Doe";

export default function ProfilePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [ failedName, setFailedName ] = useState(false);
  const show = useToastStore((state) => state.show);

  useEffect(() => {
    if (!isAuth()) {
      router.push("/login"); // redirect if not authneticated
    }
  }, [router]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nameFail = name.trim() === "";
    setFailedName(nameFail);
    if (nameFail) return;
    

    const nameUpdated = true; // mock success

    if (!nameUpdated) {
      show("Name update failed!", "error");
    } else{
      show("Name updated!", "success");
    }

    router.push("/me/account"); // redirect after successful name change 
  }

  return (
    <div className="flex min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <Sidebar />
      <form onSubmit={handleSubmit} className="flex-1 p-12" noValidate>
        <div className="flex-1 p-12 space-y-10">
          <h1 className="text-4xl font-bold">Change Name for {user}</h1>
          <div className="flex flex-col gap-6 mt-10 w-1/2">
            <label className="flex flex-col gap-2 text-lg">
              New Name:
              <input
                type="name"
                placeholder="Enter your new name"
                className={`px-4 py-3 rounded-xl bg-white/20 placeholder-white/70 text-white focus:outline-none focus:ring-2 focus:ring-white/40 backdrop-blur-lg ${failedName ? " ring-2 ring-red-500 animate-pulse focus:ring-red-500 " : ""}` }
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
      
            <button className="px-8 py-4 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/20 transition text-lg shadow-lg">
              Update Name
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}