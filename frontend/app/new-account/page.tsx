"use client";

import { useRouter } from 'next/navigation'; // app router for Next.js 13+
import Link from "next/link";
import { useState } from "react";
import axios from "axios";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [ failedName, setFailedName ] = useState(false);
  const [ failedEmail, setFailedEmail ] = useState(false);
  const [ failedPassword, setFailedPassword ] = useState(false);
  const [ failedConfirmPassword, setFailedConfirmPassword ] = useState(false);

  const [ passwordRequirements, setPasswordRequirements ] = useState([false, false, false, false]);

  const [ serverError, setServerError ] = useState("");
  const router = useRouter();
  function validatePassword(value: string) {
    const requirements = [
      value.length >= 8,
      /[a-z]/.test(value) && /[A-Z]/.test(value),
      /\d/.test(value),
      /[!@#$%^&*]/.test(value),
    ];

    setPasswordRequirements(requirements);
    setFailedPassword(!requirements.every(Boolean));
  }
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

      const nameFail = name.trim() === "";
      const emailFail = !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
      const confirmFail = confirmPassword.trim() === "" || confirmPassword !== password;

      const requirements = [
        password.length >= 8,
        /[a-z]/.test(password) && /[A-Z]/.test(password),
        /\d/.test(password),
        /[!@#$%^&*]/.test(password),
      ];
      const passwordFail = !requirements.every(Boolean);

      setFailedName(nameFail);
      setFailedEmail(emailFail);
      setFailedConfirmPassword(confirmFail);
      setPasswordRequirements(requirements);
      setFailedPassword(passwordFail);

      if (nameFail || emailFail || confirmFail || passwordFail) return; 
    
      // pass for now add actual creation later.

      const mockToken = "mock-token";
      localStorage.setItem("token", mockToken);

      router.push("/me/profile");

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

          <p style={{ display: failedName ? "block" : "none" }}>Name is required.</p>
          <input
            type="email"
            placeholder="Email"
            className={ `px-4 py-3 rounded-xl bg-white/20 placeholder-white/70 text-white focus:outline-none focus:ring-2 focus:ring-white/40 backdrop-blur-lg ${failedEmail ? " ring-2 ring-red-500 animate-pulse focus:ring-red-500" : ""}` }
            value={email}
            onChange={(e) => {setEmail(e.target.value); setFailedEmail(false)}}
          />
          <p style={{ display: failedEmail ? "block" : "none" }}>Invalid email format.</p>
          <input
            type="password"
            placeholder="Password"
            className={ `px-4 py-3 rounded-xl bg-white/20 placeholder-white/70 text-white focus:outline-none focus:ring-2 focus:ring-white/40 backdrop-blur-lg ${failedPassword ? " ring-2 ring-red-500 animate-pulse focus:ring-red-500 " : ""}` }
            value={password}
            onChange={(e) => {setPassword(e.target.value); setFailedPassword(false); validatePassword(e.target.value);}}
          />
          <p style={{ display: failedPassword ? "block" : "none" }}>Password is required and must comply with the requirements.</p>
          <input
            type="password"
            placeholder="Confirm Password"
            className={ `px-4 py-3 rounded-xl bg-white/20 placeholder-white/70 text-white focus:outline-none focus:ring-2 focus:ring-white/40 backdrop-blur-lg ${failedConfirmPassword ? "ring-2 ring-red-500 animate-pulse focus:ring-red-500 " : ""}` }
            value={confirmPassword}
            onChange={(e) => {setConfirmPassword(e.target.value); setFailedConfirmPassword(false)}}
          />
          <p style={{ display: failedConfirmPassword ? "block" : "none" }}>Passwords do not match.</p>

          <p>
            Password requirements:
            
          </p>
          <ul className="list-disc list-inside text-left ml-4">
              <li className= {passwordRequirements[0] ? "text-green-500" : "text-red-500"}>At least 8 characters long</li>
              <li className= {passwordRequirements[1] ? "text-green-500" : "text-red-500"}>Contains both uppercase and lowercase letters</li>
              <li className= {passwordRequirements[2] ? "text-green-500" : "text-red-500"}>Includes at least one number</li>
              <li className= {passwordRequirements[3] ? "text-green-500" : "text-red-500"}>Has at least one special character (e.g., !@#$%^&*)</li>
          </ul>

          <button
            type="submit"
            className="mt-4 px-6 py-3 rounded-xl bg-white/20 hover:bg-white/30 text-white font-semibold transition backdrop-blur-lg shadow-lg"
          >
            Sign Up
          </button>
        </form>
        <p>{serverError}</p>

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