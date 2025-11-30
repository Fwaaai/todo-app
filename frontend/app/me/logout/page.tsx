"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await axios.post(
          "http://localhost:8000/api/users/logout",
          {},
          { withCredentials: true }
        );
      } catch (error) {
        console.error("Error clearing auth cookie:", error);
      } finally {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
        }
        router.push("/login");
      }
    };

    performLogout();
  }, [router]);

  return <p>Logging out...</p>;
}
