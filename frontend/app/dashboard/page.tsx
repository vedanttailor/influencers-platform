"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuth, logout } from "@/lib/auth";

export default function Dashboard() {
  const router = useRouter();

  useEffect(()=>{
    const { token } = getAuth();
    if (!token) router.push("/login");
  },[router]);

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
