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
  const [email, setEmail] = useState("");
  const [ failedEmail, setFailedEmail ] = useState(false);
  const [ password, setPassword ] = useState("");
  const [ failedPassword, setFailedPassword ] = useState(false);
  const show = useToastStore((state) => state.show);

  useEffect(() => {
    if (!isAuth()) {
      router.push("/login"); // redirect if not authneticated
    }
  }, [router]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const emailFail = !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
    setFailedEmail(emailFail);
    if (emailFail) return;
    
    //check password validity
    setFailedPassword(false);

    if (failedPassword) return;
    // submit new email to backend here

    const emailUpdated = true; // mock success

    if (!emailUpdated) {
      show("Email update failed!", "error");
    } else{
      show("Email updated!", "success");
    }

    router.push("/me/account"); // redirect after successful email change 
  }

  return (
    <div className="flex min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <Sidebar />
      <form onSubmit={handleSubmit} className="flex-1 p-12" noValidate>
        <div className="flex-1 p-12 space-y-10">
          <h1 className="text-4xl font-bold">Change Email for {user}</h1>
          <div className="flex flex-col gap-6 mt-10 w-1/2">
            <label className="flex flex-col gap-2 text-lg">
              New Email:
              <input
                type="email"
                placeholder="Enter your new email"
                className={`px-4 py-3 rounded-xl bg-white/20 placeholder-white/70 text-white focus:outline-none focus:ring-2 focus:ring-white/40 backdrop-blur-lg ${failedEmail ? " ring-2 ring-red-500 animate-pulse focus:ring-red-500 " : ""}` }
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
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
            <button className="px-8 py-4 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/20 transition text-lg shadow-lg">
              Update Email
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}