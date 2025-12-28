// src/components/sidebar/MenuSidebar.tsx
import { UserResponse } from "@/api/generated/model";
import { getMyFollowing } from "@/api/generated/server/me-controller/me-controller";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { getUser } from "@/lib/auth";
import { Bookmark, FileText, Home } from "lucide-react";
import Link from "next/link";
import { FollowingList } from "./following-list";

const menuItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Library", url: "/bookmarks", icon: Bookmark },
  { title: "Stories", url: "/me/stories", icon: FileText },
];

export async function MenuSidebar() {
  const user = await getUser();
  let followingItems: UserResponse[] = [];

  // Wrap data fetching in a try/catch to prevent "White Screen" on API failure
  if (user) {
    try {
      followingItems = await getMyFollowing();
    } catch (error) {
      console.error("Sidebar following fetch failed:", error);
    }
  }

  return (
    <Sidebar
      variant="sidebar"
      collapsible="offcanvas"
      className="border-r border-border/40"
    >
      <SidebarContent className="flex flex-col p-6 space-y-10 bg-background">
        {/* SECTION: Application Menu */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/50 mb-6 px-2">
            Application
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="h-10 rounded-xl hover:bg-accent transition-all group"
                  >
                    <Link
                      href={item.url}
                      className="flex items-center gap-4 px-3"
                    >
                      <item.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span className="text-[11px] font-black uppercase tracking-widest text-foreground/80 group-hover:text-foreground">
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* SECTION: Following */}
        {user && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <FollowingList initialItems={followingItems} />
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
