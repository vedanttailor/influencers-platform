/* eslint-disable @typescript-eslint/no-explicit-any */

const BASE_URL = "http://127.0.0.1:8000";

const handleError = async (res: Response) => {
  try {
    const err = await res.json();
    console.error("API Error:", err);
    throw new Error(err.detail || "Request failed");
  } catch {
    throw new Error("Server error");
  }
};

export const api = {
  get: async (url: string) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${BASE_URL}${url}`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!res.ok) await handleError(res);

    return res.json();
  },

  post: async (url: string, body: any) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${BASE_URL}${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) await handleError(res);

    return res.json();
  },

  patch: async (url: string, body: any) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${BASE_URL}${url}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) await handleError(res);

    return res.json();
  },

  delete: async (url: string) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${BASE_URL}${url}`, {
      method: "DELETE",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!res.ok) await handleError(res);

    return res.json();
  },

  put: async (url: string, body: any) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}${url}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body,
  });

  return res.json();
},
};