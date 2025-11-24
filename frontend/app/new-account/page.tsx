"use client";

import Link from "next/link";
import { useState } from "react";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [ failedName, setFailedName ] = useState(false);
  const [ failedEmail, setFailedEmail ] = useState(false);
  const [ failedPassword, setFailedPassword ] = useState(false);
  const [ failedConfirmPassword, setFailedConfirmPassword ] = useState(false);

  
  
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setFailedName(name.trim() === "");
    setFailedEmail(!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email));
    setFailedPassword(password.trim() === "");
    setFailedConfirmPassword(confirmPassword.trim() === "" || confirmPassword !== password);

    
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-2xl p-20 max-w-xl w-full text-center">
        <h1 className="text-4xl font-bold text-white mb-6 drop-shadow">
          Create Your Account
        </h1>

        <form className="flex flex-col gap-4 mb-6" onSubmit={handleSubmit}  noValidate>
          <input
            type="text"
            placeholder="Name"
            className={ `px-4 py-3 rounded-xl bg-white/20 placeholder-white/70 text-white focus:outline-none focus:ring-2 focus:ring-white/40 backdrop-blur-lg ${failedName ? " ring-2 ring-red-500 animate-pulse focus:ring-red-500 focus:animate-none" : ""}` }
            value={name}
            onChange={(e) => {setName(e.target.value); setFailedName(false)}}
            
          />
          <input
            type="email"
            placeholder="Email"
            className={ `px-4 py-3 rounded-xl bg-white/20 placeholder-white/70 text-white focus:outline-none focus:ring-2 focus:ring-white/40 backdrop-blur-lg ${failedEmail ? " ring-2 ring-red-500 animate-pulse focus:ring-red-500" : ""}` }
            value={email}
            onChange={(e) => {setEmail(e.target.value); setFailedEmail(false)}}
          />
          <input
            type="password"
            placeholder="Password"
            className={ `px-4 py-3 rounded-xl bg-white/20 placeholder-white/70 text-white focus:outline-none focus:ring-2 focus:ring-white/40 backdrop-blur-lg ${failedPassword ? " ring-2 ring-red-500 animate-pulse focus:ring-red-500 " : ""}` }
            value={password}
            onChange={(e) => {setPassword(e.target.value); setFailedPassword(false)}}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className={ `px-4 py-3 rounded-xl bg-white/20 placeholder-white/70 text-white focus:outline-none focus:ring-2 focus:ring-white/40 backdrop-blur-lg ${failedConfirmPassword ? "ring-2 ring-red-500 animate-pulse focus:ring-red-500 " : ""}` }
            value={confirmPassword}
            onChange={(e) => {setConfirmPassword(e.target.value); setFailedConfirmPassword(false)}}
          />

          <button
            type="submit"
            className="mt-4 px-6 py-3 rounded-xl bg-white/20 hover:bg-white/30 text-white font-semibold transition backdrop-blur-lg shadow-lg"
          >
            Sign Up
          </button>
        </form>

        <p className="text-slate-200">
          Already have an account?{" "}
          <Link href="/login">
            <span className="text-white font-semibold hover:underline cursor-pointer">
              Login
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
}