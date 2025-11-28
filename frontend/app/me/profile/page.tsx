"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuth } from "../isAuth";
import { Sidebar } from "../components/sidebar";
import Link from "next/link";

//import data from backend

const user = "John Doe";
const createdAt = new Date().toLocaleDateString();

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

      <div className="flex-1 p-12 space-y-10">
        <h1 className="text-4xl font-bold">Hi, {user}</h1>

        <p className="text-xl text-slate-300">
          Your account was created on: <span className="font-semibold text-white">{createdAt}</span>
        </p>

        <div className="mt-10 space-y-4">
          <Link href="/me/todos" className="m-3">
            <button className="px-8 py-4 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/20 transition text-lg shadow-lg">
              Go to My Todos
            </button>
          </Link>
          <Link href="/me/account" className="m-3">
            <button className="px-8 py-4 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/20 transition text-lg shadow-lg">
              Account Settings
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}