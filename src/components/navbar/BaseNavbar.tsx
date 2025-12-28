import { UserResponse } from "@/api/generated/model";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ReactNode } from "react";
import { UserNav } from "./UserNav"; // Import your UserNav component

interface BaseNavbarProps {
  user: UserResponse | undefined;
  left: ReactNode;
  center?: ReactNode;
  actions?: ReactNode; // Renamed from 'right' to 'actions' for clarity
  className?: string;
}

export function BaseNavbar({
  user,
  left,
  center,
  actions,
  className,
}: BaseNavbarProps) {
  return (
    <nav
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md transition-all",
        className
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Left Section: Brand & Navigation */}
        <div className="flex items-center gap-4">{left}</div>

        {/* Center Section: Search (Hidden on mobile) */}
        <div className="hidden lg:flex flex-1 justify-center px-8 max-w-2xl">
          {center}
        </div>

        {/* Right Section: Actions & Profile */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">{actions}</div>

          {user ? (
            <UserNav user={user} />
          ) : (
            <Button
              asChild
              className="rounded-full bg-foreground text-background hover:bg-foreground/90 px-6 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-black/5"
              size="sm"
            >
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
