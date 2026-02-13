export function saveAuth(token: string, role: string) {
  localStorage.setItem("token", token);
  localStorage.setItem("role", role);
}

export function getAuth() {
  const token = localStorage.getItem("token");
  if (!token) return { token: null, role: null };

  const payload = JSON.parse(atob(token.split(".")[1]));
  return {
    token,
    role: payload.role
  };
}

export function logout() {
  localStorage.removeItem("token");
  window.location.href = "/login";
}
