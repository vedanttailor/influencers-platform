"use client";
import { useState } from "react";
import { useManagers } from "../admin/manager/ManagerContext";

export default function CreateManagerModal() {
  const { addManager } = useManagers();
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [crm, setCrm] = useState(false);
  const [campaigns, setCampaigns] = useState(false);

  const handleCreate = () => {
    addManager({
      name,
      email,
      permissions: { crm, campaigns },
    });

    setOpen(false);
    setName("");
    setEmail("");
    setPassword("");
    setCrm(false);
    setCampaigns(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        + Add Manager
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-96">
            <h3 className="font-bold mb-4">Create Manager</h3>

            <input
              className="border p-2 w-full mb-2"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="border p-2 w-full mb-2"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="border p-2 w-full mb-3"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="space-y-2 mb-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={crm}
                  onChange={() => setCrm(!crm)}
                />
                CRM Access
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={campaigns}
                  onChange={() => setCampaigns(!campaigns)}
                />
                Campaign Access
              </label>
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={() => setOpen(false)}>Cancel</button>
              <button
                onClick={handleCreate}
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
