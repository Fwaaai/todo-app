"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuth } from "../../isAuth";
import { Sidebar } from "../../components/sidebar";
import { useState } from "react";
import { useToastStore } from "@/lib/zustand/store";
import axios from "axios";
//import data from backend

const user = "John Doe";

export default function ProfilePage() {
  const router = useRouter();
  const [ password, setPassword ] = useState("");
  const [ failedPassword, setFailedPassword ] = useState(false);
  const [ error, setError ] = useState("");
  

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const { status } = await axios.post("http://localhost:8000/api/users/me/delete", {
      enteredPassword: password.trim()
    }, { withCredentials: true });
      if (status === 204) {
        router.push("/");
      } else {
        setError("Something went wrong");
        router.push("/");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status;
        if (status === 400) {
          setError("Failed to delete account. Please check your inputs.");
        } else if (status === 401) {
          setError("Unauthorized. Please log in again.");
          router.push("/login");
        } else if (status === 403) {
          setError("Invalid credentials. Please try again.");
        }
      } else {
        setError("Something went wrong. Please try again later.");
      }
    }
    
  }

  return (
    <div className="flex min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <Sidebar />
      <form onSubmit={handleSubmit} className="flex-1 p-12" noValidate>
        <div className="flex-1 p-12 space-y-10">
          <h1 className="text-4xl font-bold">Delete Account for {user}</h1>
          <p className="text-lg">Are you sure you want to delete your account?</p>
          <p className="text-lg">We hate to see you go...but we hope we can see you back soon.</p>
          <p className="text-lg">Once you delete your account, there is no going back.</p>
          <p>{error}</p>
          <label className="flex flex-col gap-2 text-lg">
              Because this is a sensitive change, we require your password.
              <input
                type="password"
                placeholder="Password please..."
                className={`px-4 py-3 rounded-xl bg-white/20 placeholder-white/70 text-white focus:outline-none focus:ring-2 focus:ring-white/40 backdrop-blur-lg ${failedPassword ? " ring-2 ring-red-500 animate-pulse focus:ring-red-500 " : ""}` }
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
          <p style={{ display: failedPassword ? "block" : "none" }}>Wrong password, try again!</p>

          <div className="flex flex-col gap-6 mt-10 w-1/2">
            <button className="px-8 py-4 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/20 transition text-lg shadow-lg">
              Delete Account
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}