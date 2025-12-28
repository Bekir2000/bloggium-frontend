import { SidebarTrigger } from "@/components/ui/sidebar";
import { getUser } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { SquarePenIcon } from "lucide-react";
import Link from "next/link";
import { BrandLogo } from "../ui/brand-logo";
import { BaseNavbar } from "./BaseNavbar";
import { NavbarSearch } from "./NavBarSearch";

export async function MainNavbar() {
  const user = await getUser();

  return (
    <BaseNavbar
      user={user}
      left={
        <div className="flex items-center gap-4">
          <SidebarTrigger className="hover:bg-accent rounded-full h-9 w-9" />
          <BrandLogo />
        </div>
      }
      center={<NavbarSearch />}
      actions={
        <div className="flex items-center gap-4">
          <Link
            href="/new-story"
            className={cn(
              "hidden sm:flex items-center gap-2 px-4 py-2 rounded-full transition-all",
              "text-[10px] font-black uppercase tracking-[0.15em] text-foreground/60 hover:text-foreground hover:bg-accent"
            )}
          >
            <SquarePenIcon className="w-4 h-4" />
            Write
          </Link>
        </div>
      }
    />
  );
}
