/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProtectedRoute({
  children,
  allowed,
}: {
  children: React.ReactNode;
  allowed: string[];
}) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    const normalizedRole = role?.toLowerCase().trim();

    const normalizedAllowed = allowed.map((r) =>
      r.toLowerCase().trim()
    );

    if (!token) {
      router.replace("/login");
      return;
    }

    if (!normalizedAllowed.includes(normalizedRole || "")) {
      router.replace("/login");
      return;
    }

    setAuthorized(true);
  }, [allowed, router]);

  if (!authorized) return null;

  return <>{children}</>;
   
}
