/* eslint-disable @typescript-eslint/no-explicit-any */
export const redirectByRole = (role: string, router: any) => {
  const normalizedRole = role?.toLowerCase().trim();

  switch (normalizedRole) {
    
    case "admin":
      router.replace("/Admin/dashboard");
      break;

    case "manager":
      router.replace("/manager/dashboard");
      break;

    case "client":
      router.replace("/client/campaigns");
      break;

    case "influencer":
      router.replace("/influencer/dashboard");
      break;

    default:
      router.replace("/login");
  }
};