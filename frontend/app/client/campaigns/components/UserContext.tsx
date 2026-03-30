"use client";

import { createContext, useContext, useState, useEffect } from "react";

type User = {
  name: string;
  email: string;
  avatar: string;
};

type UserContextType = {
  user: User;
  updateUser: (data: Partial<User>) => void;
};

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>({
    name: "",
    email: "",
    avatar: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        // ✅ FIX: If no token, don't call API
        if (!token) {
          console.warn("No token found, skipping fetchUser");
          return;
        }

        const res = await fetch("http://127.0.0.1:8000/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.warn("Unauthorized or failed request");
          return;
        }

        const data = await res.json();

        setUser({
          name: data.full_name || "",
          email: data.email || "",
          avatar: data.profile_img
            ? `http://127.0.0.1:8000${data.profile_img}`
            : "/avatar.png",
        });
      } catch (err) {
        console.error("UserContext fetch error:", err);
      }
    };

    fetchUser();
  }, []);

  const updateUser = (data: Partial<User>) => {
    setUser((prev) => ({ ...prev, ...data }));
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used inside UserProvider");
  }
  return context;
}