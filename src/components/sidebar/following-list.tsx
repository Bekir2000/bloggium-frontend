"use client";

import { UserResponse } from "@/api/generated/model";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function FollowingList({
  initialItems,
}: {
  initialItems: UserResponse[];
}) {
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
    }, 10000);
    return () => clearInterval(interval);
  }, [router]);

  return (
    <SidebarGroup className="p-0">
      <SidebarGroupLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/50 mb-6 px-2">
        Following
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu className="gap-3">
          {initialItems.map((user) => (
            <SidebarMenuItem key={user.id} className="px-2">
              <div className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-8 w-8 border-2 border-background shadow-sm group-hover:ring-2 ring-primary/20 transition-all">
                      <AvatarImage
                        src={user.profileImageUrl || ""}
                        className="object-cover"
                      />
                      <AvatarFallback className="text-[10px] font-bold bg-primary/5 text-primary">
                        {user.firstName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    {user.isOnline && (
                      <span className="absolute bottom-0 right-0 block w-2.5 h-2.5 rounded-full border-2 border-background bg-green-500 shadow-sm" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-foreground/80 group-hover:text-foreground transition-colors">
                      {user.firstName} {user.lastName}
                    </span>
                    <span className="text-[8px] font-medium text-muted-foreground uppercase tracking-widest">
                      {user.isOnline ? "Online" : "Offline"}
                    </span>
                  </div>
                </div>
              </div>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
