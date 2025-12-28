"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export function BackButton() {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => router.back()}
      className="group flex items-center gap-2 px-0 text-muted-foreground hover:text-foreground hover:bg-transparent transition-all"
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border/40 bg-background shadow-sm transition-all group-hover:border-primary group-hover:text-primary">
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
      </div>
      <span className="text-[10px] font-black uppercase tracking-widest opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0">
        Back
      </span>
    </Button>
  );
}
