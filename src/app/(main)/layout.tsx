import { MainNavbar } from "@/components/navbar/MainNavbar";
import { MenuSidebar } from "@/components/sidebar/MenuSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <div className="flex min-h-screen w-full bg-background">
        <MenuSidebar />
        <SidebarInset className="flex flex-col flex-1">
          <MainNavbar />
          <main className="flex-1 px-4 md:px-8 py-6">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
