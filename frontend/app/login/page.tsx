"use client";

import { useRouter } from 'next/navigation'; // app router for Next.js 13+
import Link from "next/link";
import axios from "axios";
import { useState } from "react";


export default function Login() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const { status } = await axios.post(
        "http://localhost:8000/api/users/login",
        {
          email: email.trim(),
          password,
        },
        { withCredentials: true }
      );
      if (status === 200) {
        router.push("/me/profile");
        return;
      } else {
        setError("Something went wrong. Please try again later.");
        return;
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const status = err.response.status;

        if (status === 400) {
          setError("Failed to log in. Please check your inputs.");
        } else if (status === 404) {
          setError("Wrong email or password. Please try again.");
        } else if (status === 401) {
          setError("Invalid credentials. Please try again.");
        }
      } else {
        setError("Network error. Is the backend running?");
      }
    }
  }

  
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-2xl p-20 max-w-xl w-full text-center">
        <h1 className="text-4xl font-bold text-white mb-6 drop-shadow">
          Log in to Your Account
        </h1>
        <p className="text-slate-200 leading-relaxed">{error}</p>
        <form className="flex flex-col gap-4 mb-6" noValidate onSubmit ={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="px-4 py-3 rounded-xl bg-white/20 placeholder-white/70 text-white focus:outline-none focus:ring-2 focus:ring-white/40 backdrop-blur-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="px-4 py-3 rounded-xl bg-white/20 placeholder-white/70 text-white focus:outline-none focus:ring-2 focus:ring-white/40 backdrop-blur-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="mt-4 px-6 py-3 rounded-xl bg-white/20 hover:bg-white/30 text-white font-semibold transition backdrop-blur-lg shadow-lg"
          >
            Login
          </button>
        </form>

        <p className="text-slate-200">
          Don’t have an account?{" "}
          <Link href="/new-account">
            <span className="text-white font-semibold hover:underline cursor-pointer">
              Sign Up
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
}
