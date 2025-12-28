"use client";

import { PostCardResponse } from "@/api/generated/model";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import Link from "next/link";

export function SidebarPostItem({ post }: { post: PostCardResponse }) {
  return (
    <div className="group flex flex-col gap-2">
      {/* Author Byline */}
      <div className="flex items-center gap-2">
        <Avatar className="h-5 w-5 border border-border/50 shadow-sm">
          <AvatarImage src={post.author?.imageUrl} />
          <AvatarFallback className="text-[8px] font-black bg-primary/5 text-primary">
            {post.author?.firstName?.[0]}
          </AvatarFallback>
        </Avatar>
        <span className="text-[10px] font-black uppercase tracking-widest text-foreground/80">
          {post.author?.firstName} {post.author?.lastName}
        </span>
      </div>

      {/* Title */}
      <Link href={`/posts/${post.id}`} className="block">
        <h4 className="font-sans text-sm font-black leading-tight tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-2">
          {post.title}
        </h4>
      </Link>

      {/* Meta */}
      <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.15em] flex items-center">
        {post.createdAt && format(new Date(post.createdAt), "MMM d")}
        <span className="mx-2 text-border/60">|</span>
        {post.meta?.readingTimeMinutes ?? 1} min read
      </div>
    </div>
  );
}
