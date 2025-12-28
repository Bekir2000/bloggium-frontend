"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function CategoryList() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");

  const categories = [
    "TECHNOLOGY",
    "LIFESTYLE",
    "TUTORIAL",
    "NEWS",
    "PERSONAL",
    "CODING",
  ];

  const handleCategoryClick = (category: string) => {
    const params = new URLSearchParams(searchParams);
    if (currentCategory === category) params.delete("category");
    else params.set("category", category);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <Badge
          key={category}
          variant={currentCategory === category ? "default" : "secondary"}
          onClick={() => handleCategoryClick(category)}
          className={cn(
            "rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest cursor-pointer transition-all border-none",
            currentCategory === category
              ? "bg-primary text-white shadow-lg shadow-primary/20"
              : "bg-white text-foreground hover:bg-primary/10 hover:text-primary"
          )}
        >
          {category}
        </Badge>
      ))}
    </div>
  );
}
