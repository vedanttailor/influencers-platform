import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = (await cookies()).get("admin_token")?.value;

  if (!token) {
    redirect("/admin/login");
  }

  return <>{children}</>;
}
