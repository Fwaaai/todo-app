"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "../../components/sidebar";
import { useState } from "react";
import { useToastStore } from "@/lib/zustand/store";
import axios from "axios";
//import data from backend


export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState("");
  const [name, setName] = useState("");
  const [ failedName, setFailedName ] = useState(false);
  const [error, setError] = useState("");
  const show = useToastStore((state) => state.show);

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await axios.get("http://localhost:8000/api/users/me", {
          withCredentials: true,
        });
        if (response.status === 200) {
          const data = response.data;
          setUser(data.name);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        router.push("/login");
      }

    }
    loadProfile();
  }, [router]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nameFail = name.trim() === "";
    setFailedName(nameFail);
    if (nameFail) return;
    let nameUpdated = false;
    try {
      const { status } = await axios.patch(
        "http://localhost:8000/api/users/me/name",
        {
          name: name.trim(),
        },
        { withCredentials: true }
      );
      if (status !== 200) {
        setError("Something went wrong");
      } else{
        setError("");
        nameUpdated = true;
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status;
        if (status === 400) {
          setError("Invalid name. Please check your input.");
        } else if (status === 401) {
          setError("Unauthorized. Please log in again.");
          router.push("/login");
        }
      }
    }

    if (!nameUpdated) {
      show("Name update failed!", "error");
    } else{
      show("Name updated!", "success");
    }

    router.push("/me/account"); 
  }

  return (
    <div className="flex min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <Sidebar />
      <form onSubmit={handleSubmit} className="flex-1 p-12" noValidate>
        <div className="flex-1 p-12 space-y-10">
          <p>{error}</p>
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