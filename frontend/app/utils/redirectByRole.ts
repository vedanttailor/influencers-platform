/* eslint-disable @typescript-eslint/no-explicit-any */
export const redirectByRole = (role: string, router: any) => {
  switch (role) {
    case "admin":
      router.push("/Admin/admin/dashboard");
      break;

    case "manager":
      router.push("/manager/dashboard");
      break;

    case "client":
      router.push("/client/dashboard");
      break;

    case "influencer":
      router.push("/Influencer");
      break;

    default:
      router.push("/login");
  }
};
