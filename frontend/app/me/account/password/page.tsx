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
  const [ newPassword, setNewPassword] = useState("");
  const [ failedNewPassword, setFailedNewPassword ] = useState(false);
  const [ password, setPassword ] = useState("");
  const [ failedPassword, setFailedPassword ] = useState(false);
  const [ passwordRequirements, setPasswordRequirements ] = useState([false, false, false, false]);
  const [ user, setUser ] = useState("");
  const [ error, setError ] = useState("");

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

  function validatePassword(value: string) {
    const requirements = [
      value.length >= 8,
      /[a-z]/.test(value) && /[A-Z]/.test(value),
      /\d/.test(value),
      /[!@#$%^&*]/.test(value),
    ];

    setPasswordRequirements(requirements);
    setFailedNewPassword(!requirements.every(Boolean));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const requirements = [
        newPassword.length >= 8,
        /[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword),
        /\d/.test(newPassword),
        /[!@#$%^&*]/.test(newPassword),
      ];
      
    const newPasswordFail = !requirements.every(Boolean);;
    setFailedNewPassword(newPasswordFail);
    if (newPasswordFail) return;
    
    let passwordUpdated = false;
    try {
      const { status } = await axios.patch(
        "http://localhost:8000/api/users/me/password",
        {
          newPassword: newPassword.trim(),
          enteredPassword: password.trim(),
        },
        {
          withCredentials: true,
        }
      );
      if (status === 200) {
        passwordUpdated = true;
      } else {
        setError("Something went wrong");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status;
        if (status === 400) {
          setError("Failed to update password. Please check your inputs.");
        } else if (status === 401) {
          setError("Unauthorized. Please log in again.");
          router.push("/login");
        } else if (status === 403) {
          setError("Wrong password. Please try again.");
          setFailedPassword(true);
        }
        else {
          setError("Something went wrong. Please try again later.");
        }
      }

      
    } // redirect after successful email change
    if (!passwordUpdated) {
        show("Email update failed!", "error");
      } else {
        show("Email updated!", "success");
    }


    if (!passwordUpdated) {
      show("Password update failed!", "error");
    } else{
      show("Password updated!", "success");
    }

    router.push("/me/account"); // redirect after successful Password change 
  }

  return (
    <div className="flex min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <Sidebar />
      <form onSubmit={handleSubmit} className="flex-1 p-12" noValidate>
        <div className="flex-1 p-12 space-y-10">
          <h1 className="text-4xl font-bold">Change Password for {user}</h1>
          <p>{error}</p>
          <div className="flex flex-col gap-6 mt-10 w-1/2">
            <label className="flex flex-col gap-2 text-lg">
              New Password:
              <input
                type="password"
                placeholder="Enter your new password"
                className={`px-4 py-3 rounded-xl bg-white/20 placeholder-white/70 text-white focus:outline-none focus:ring-2 focus:ring-white/40 backdrop-blur-lg ${failedNewPassword ? " ring-2 ring-red-500 animate-pulse focus:ring-red-500 " : ""}` }
                value={newPassword}
                onChange={(e) => {setNewPassword(e.target.value); setFailedNewPassword(false); validatePassword(e.target.value)}}
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

            <p>
            Password requirements:
            
            </p>
            <ul className="list-disc list-inside text-left ml-4">
                <li className= {passwordRequirements[0] ? "text-green-500" : "text-red-500"}>At least 8 characters long</li>
                <li className= {passwordRequirements[1] ? "text-green-500" : "text-red-500"}>Contains both uppercase and lowercase letters</li>
                <li className= {passwordRequirements[2] ? "text-green-500" : "text-red-500"}>Includes at least one number</li>
                <li className= {passwordRequirements[3] ? "text-green-500" : "text-red-500"}>Has at least one special character (e.g., !@#$%^&*)</li>
            </ul>
            <button className="px-8 py-4 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/20 transition text-lg shadow-lg">
              Update Password
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}