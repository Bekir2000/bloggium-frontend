"use client";

import { PostDetailResponse } from "@/api/generated/model";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";

// Import your new component
import clsx from "clsx";
import { PostShareMenu } from "./PostShareMenu";

interface PostAuthorMetaProps {
  author: PostDetailResponse["author"];
  createdAt?: string;
  readingTime?: number;
  isFollowing: boolean;
  isLoading: boolean;
  isOwnPost: boolean;
  onToggleFollow: () => void;
  postTitle?: string;
  postId?: string;
}

export function PostAuthorMeta({
  author,
  createdAt,
  readingTime,
  isFollowing,
  isLoading,
  isOwnPost,
  onToggleFollow,
  postId,
}: PostAuthorMetaProps) {
  return (
    <div className="mb-10 flex items-center justify-between border-b pb-8 border-border/50">
      <div className="flex items-center gap-4">
        <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
          <AvatarImage src={author?.imageUrl} alt={author?.firstName} />
          <AvatarFallback className="font-bold bg-primary/5 text-primary">
            {author?.firstName?.[0]}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <span className="text-xs font-black uppercase tracking-widest text-foreground">
              {author?.firstName} {author?.lastName}
            </span>

            {!isOwnPost && (
              <button
                type="button"
                onClick={onToggleFollow}
                disabled={isLoading}
                className={clsx(
                  "text-[10px] font-black uppercase tracking-widest transition-colors",
                  isFollowing
                    ? "text-muted-foreground"
                    : "text-green-600 hover:text-green-700"
                )}
              >
                {isFollowing ? "Following" : "Follow"}
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            <span>{readingTime || 1} min read</span>
            <span className="text-border">|</span>
            <span>
              {createdAt
                ? format(new Date(createdAt), "MMM d, yyyy")
                : "Just now"}
            </span>
          </div>
        </div>
      </div>

      <PostShareMenu postsId={postId} />
    </div>
  );
}
