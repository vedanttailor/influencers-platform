
export type Manager = {
  id: string;
  name: string;
  email: string;
  status: "active" | "suspended" | "banned";
  permissions: {
    crm: boolean;
    campaigns: boolean;
  };
};

export const managers: Manager[] = [];
