"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

// Shadcn UI Imports
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SEARCH_SCOPES = [
  { value: "title", label: "Title" },
  { value: "authorName", label: "Author" },
  { value: "tag", label: "Tag" },
];

const CATEGORIES = [
  "TECHNOLOGY",
  "LIFESTYLE",
  "TUTORIAL",
  "NEWS",
  "PERSONAL",
  "CODING",
];

export function SearchInput() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const getInitialScope = () => {
    if (searchParams.get("authorName")) return "authorName";
    if (searchParams.get("tag")) return "tag";
    return "title";
  };

  const [scope, setScope] = useState(getInitialScope());

  const executeSearch = useDebouncedCallback(
    (term: string, currentScope: string) => {
      const params = new URLSearchParams(searchParams);
      SEARCH_SCOPES.forEach((s) => params.delete(s.value));
      params.delete("query");

      if (term) {
        params.set(currentScope, term);
      }
      replace(`${pathname}?${params.toString()}`);
    },
    300
  );

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams);
    if (category && category !== "ALL") {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const handleScopeChange = (newScope: string) => {
    setScope(newScope);
    const currentInput =
      document.querySelector<HTMLInputElement>("#shadcn-search-input")?.value ||
      "";
    if (currentInput) {
      executeSearch(currentInput, newScope);
    }
  };

  const currentCategory = searchParams.get("category") || "ALL";

  return (
    <div className="flex w-full items-center rounded-full border-2 border-border/40 bg-gray-50/50 p-1 transition-all focus-within:border-primary/40 focus-within:bg-background focus-within:ring-4 focus-within:ring-primary/5">
      {/* Category Dropdown */}
      <Select value={currentCategory} onValueChange={handleCategoryChange}>
        <SelectTrigger className="h-9 rounded-full border-0 bg-transparent px-4 text-[10px] font-black uppercase tracking-widest focus:ring-0">
          <SelectValue placeholder="Topics" />
        </SelectTrigger>
        <SelectContent className="rounded-[1.5rem]">
          <SelectItem value="ALL">All Topics</SelectItem>
          {CATEGORIES.map((cat) => (
            <SelectItem
              key={cat}
              value={cat}
              className="text-[10px] font-bold uppercase tracking-widest"
            >
              {cat}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="h-4 w-px bg-border/60 mx-1" />

      {/* Scope Dropdown */}
      <Select value={scope} onValueChange={handleScopeChange}>
        <SelectTrigger className="h-9 w-fit rounded-full border-0 bg-transparent px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground focus:ring-0">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="rounded-[1.5rem]">
          {SEARCH_SCOPES.map((s) => (
            <SelectItem
              key={s.value}
              value={s.value}
              className="text-[10px] font-bold uppercase tracking-widest"
            >
              {s.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="h-4 w-px bg-border/60 mx-1" />

      {/* Input Section */}
      <div className="flex flex-1 items-center px-4">
        <Search className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          id="shadcn-search-input"
          placeholder="Search stories..."
          defaultValue={searchParams.get(scope) ?? ""}
          onChange={(e) => executeSearch(e.target.value, scope)}
          className="h-9 border-0 bg-transparent p-0 text-sm font-medium focus-visible:ring-0 placeholder:text-muted-foreground/50"
        />
      </div>
    </div>
  );
}
