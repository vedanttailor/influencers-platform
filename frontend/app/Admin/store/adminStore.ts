/* eslint-disable @typescript-eslint/no-explicit-any */
export const getAdmin = () => {
  if (typeof window === "undefined") return {
    name: "Admin",
    email: "admin@mail.com",
    image: "/avatar.png",
  };

  const data = localStorage.getItem("admin");

  if (!data) {
    const def = {
      name: "Admin",
      email: "admin@mail.com",
      image: "/avatar.png",
    };
    localStorage.setItem("admin", JSON.stringify(def));
    return def;
  }

  const parsed = JSON.parse(data);

  if (parsed.image?.startsWith("blob:")) {
    parsed.image = "/avatar.png";
    localStorage.setItem("admin", JSON.stringify(parsed));
  }

  return parsed;
};

export const saveAdmin = (admin: any) => {
  localStorage.setItem("admin", JSON.stringify(admin));
};
