"use client";
import { createContext, useContext, useState } from "react";

type Manager = {
  id: number;
  name: string;
  email: string;
  permissions: {
    crm: boolean;
    campaigns: boolean;
  };
  status: "active" | "suspended";
};

type ManagerContextType = {
  managers: Manager[];
  addManager: (m: Omit<Manager, "id" | "status">) => void;
  toggleStatus: (id: number) => void;
};

const ManagerContext = createContext<ManagerContextType | null>(null);

export function ManagerProvider({ children }: { children: React.ReactNode }) {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [counter, setCounter] = useState(1);

  const addManager = (m: Omit<Manager, "id" | "status">) => {
    setManagers((prev) => [
      ...prev,
      { id: counter, status: "active", ...m },
    ]);
    setCounter((c) => c + 1);
  };

  const toggleStatus = (id: number) => {
    setManagers((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, status: m.status === "active" ? "suspended" : "active" }
          : m
      )
    );
  };

  return (
    <ManagerContext.Provider value={{ managers, addManager, toggleStatus }}>
      {children}
    </ManagerContext.Provider>
  );
}

export const useManagers = () => {
  const ctx = useContext(ManagerContext);
  if (!ctx) throw new Error("useManagers must be inside ManagerProvider");
  return ctx;
};
