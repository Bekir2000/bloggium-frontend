"use client";

import { UserResponse } from "@/api/generated/model";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/lib/auth";
import { LogOut } from "lucide-react";

interface UserNavProps {
  user: UserResponse;
}

export function UserNav({ user }: UserNavProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full p-0 overflow-hidden ring-2 ring-background shadow-md hover:ring-primary/20 transition-all duration-300"
        >
          <Avatar className="h-full w-full">
            <AvatarImage
              src={user.profileImageUrl || "/avatar.jpg"}
              alt={user.firstName || "User"}
              className="object-cover"
            />
            <AvatarFallback className="font-black text-[10px] bg-primary/5 text-primary uppercase">
              {user.firstName?.charAt(0)}
              {user.lastName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-72 p-4 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-border/40 bg-background/95 backdrop-blur-xl"
        align="end"
        sideOffset={10}
      >
        <DropdownMenuLabel className="px-4 py-4 mb-2">
          <div className="flex flex-col space-y-2">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground leading-none">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest truncate">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="opacity-50 mb-2" />

        {/* <DropdownMenuGroup className="space-y-1">
          <DropdownMenuItem className="rounded-xl px-4 py-2.5 text-[10px] font-black uppercase tracking-widest cursor-pointer transition-colors focus:bg-accent focus:text-foreground">
            <User className="mr-3 h-3.5 w-3.5 text-muted-foreground" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem className="rounded-xl px-4 py-2.5 text-[10px] font-black uppercase tracking-widest cursor-pointer transition-colors focus:bg-accent focus:text-foreground">
            <Settings className="mr-3 h-3.5 w-3.5 text-muted-foreground" />
            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup> */}

        <DropdownMenuSeparator className="opacity-50 my-2" />

        <DropdownMenuItem
          className="rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest text-red-500 focus:text-red-600 focus:bg-red-50/50 cursor-pointer transition-colors"
          onClick={async () => await signOut()}
        >
          <LogOut className="mr-3 h-3.5 w-3.5" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
