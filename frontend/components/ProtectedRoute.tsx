"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({
  children,
  allowed,
}: {
  children: React.ReactNode;
  allowed: string[];
}) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      router.push("/login");
      return;
    }

    if (!allowed.includes(role || "")) {
      router.push("/login");
    }
  }, [allowed, router]);

  return <>{children}</>;
}