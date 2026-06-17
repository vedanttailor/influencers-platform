
"use client";


import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { api } from "@/lib/api";
import { useParams } from "next/navigation";

type ClientData = {
  client: {
    id: string;
    name: string;
    company_name: string | null;
    email: string;
    status: string;
    phone: string | null;
  };
  stats: {
    total_campaigns: number;
    active_campaigns: number;
    total_spend: number;
    avg_budget: number;
  };
  campaigns: Array<{
    id: string;
    campaign_name: string;
    platforms: string[];
    budget: number;
    status: string;
    start_date: string | null;
    end_date: string | null;
  }>;
  financial: {
    total_spend: number;
    failed_payments: number;
    last_payment: string | null;
  };
  risk: {
    cancellations: number;
    late_approvals: number;
    violations: number;
    risk_score: string;
  };
};

const ClientContext = createContext<ClientData | null>(null);

export function ClientProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<ClientData | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();

  const clientId = (params.id as string) || "";

  useEffect(() => {
    if (!clientId) return;

    const fetchClient = async () => {
      try {
        const response = await api.get(`/admin/client/${clientId}`);
        setData(response);
      } catch (error) {
        console.error("Failed to fetch client:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [clientId]);

  // ✅ IMPORTANT FIX
  if (loading || !data) {
    return <p className="p-6">Loading client...</p>;
  }

  return (
    <ClientContext.Provider value={data}>
      {children}
    </ClientContext.Provider>
  );
}

export const useClient = () => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error("useClient must be used within ClientProvider");
  }
  return context;
};

