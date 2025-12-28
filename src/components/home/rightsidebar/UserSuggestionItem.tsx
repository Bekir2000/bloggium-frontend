"use client";

import { AuthorSummary, UserResponse } from "@/api/generated/model";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { usePostFollow } from "@/hooks/usePostFollow";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export function UserSuggestionItem({
  author,
  currentUser,
}: {
  author: AuthorSummary;
  currentUser?: UserResponse | null;
}) {
  const { isFollowing, toggleFollow, isLoading } = usePostFollow({
    author: author,
    currentUser,
    // @ts-ignore
    initialIsFollowing: author.isFollowed ?? false,
  });

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
          <AvatarImage src={author.imageUrl} />
          <AvatarFallback className="font-bold">
            {author.firstName?.[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col min-w-0">
          <p className="text-[10px] font-black uppercase tracking-widest text-foreground truncate">
            {author.firstName} {author.lastName}
          </p>
          <p className="text-[10px] text-muted-foreground font-serif italic leading-none mt-0.5">
            Contributor
          </p>
        </div>
      </div>
      <Button
        variant={isFollowing ? "secondary" : "outline"}
        size="sm"
        onClick={toggleFollow}
        disabled={isLoading}
        className={cn(
          "rounded-full h-8 px-4 text-[10px] font-black uppercase tracking-widest transition-all duration-300",
          isFollowing
            ? "bg-foreground text-background hover:bg-foreground/90 border-transparent shadow-md"
            : "border-2 border-foreground hover:bg-foreground hover:text-background"
        )}
      >
        {isLoading ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : isFollowing ? (
          "Unfollow"
        ) : (
          "Follow"
        )}
      </Button>
    </div>
  );
}
