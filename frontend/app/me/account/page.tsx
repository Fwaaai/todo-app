"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuth } from "../isAuth";
import { Sidebar } from "../components/sidebar";
import Link from "next/link";
import Toast from "../components/toast";
//import data from backend

const user = "John Doe";

export default function ProfilePage() {
  const router = useRouter();
  

  useEffect(() => {
    if (!isAuth()) {
      router.push("/login"); // redirect if not authenticated
    }
  }, [router]);

  return (
    <div className="flex min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <Sidebar />
      <Toast />

      <div className="flex-1 p-12 space-y-10 flex flex-col w-3/5">
        <h1 className="text-4xl font-bold">What would you like to change, {user}?</h1>
        <div className="grid grid-cols-1 gap-6 mt-10 w-full ">
          <Link href="/me/account/name">
            <button className="px-8 py-4 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/20 transition text-lg shadow-lg w-full">
              Change my Name
            </button>
          </Link>
          <Link href="/me/account/email">
            <button className="px-8 py-4 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/20 transition text-lg shadow-lg w-full">
              Change my Email
            </button>
          </Link>
          <Link href="/me/account/password">
            <button className="px-8 py-4 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/20 transition text-lg shadow-lg w-full">
              Change my Password
            </button>
          </Link>
          <Link href="/me/account/delete">
            <button className="px-8 py-4 rounded-xl bg-red-600/10 backdrop-blur-lg border border-red-500/20 hover:bg-red-600/20 transition text-lg shadow-lg w-full">
              Delete my Account
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}