"use client";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react'; 
export default function LogoutPage() {
  // Clear authentication token from local storage
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }

  const router = useRouter();

  useEffect(() => {
    // This runs once after the first render
    console.log('Component has rendered!');

    // You can also do things like DOM manipulation here
    const element = document.getElementById('my-div');
    console.log(element);
    router.push('/'); // Redirect to login page after logout

  }, []); // empty array = run once

  return <p >Logging out...</p>;
}