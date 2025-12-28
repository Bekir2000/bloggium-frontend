"use client";

import {
  useAddNewDraft,
  useDeleteDraft,
  useDeletePost,
} from "@/api/generated/client/post-controller/post-controller";
import {
  DraftCardResponse,
  PagedResponsePostCardResponse,
  PostCardResponse,
} from "@/api/generated/model";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InfiniteData, UseInfiniteQueryResult } from "@tanstack/react-query";
import { format } from "date-fns";
import { Edit2, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useInView } from "react-intersection-observer";
import { toast } from "sonner";

type ApiPageResponse = {
  data: PagedResponsePostCardResponse;
};

interface StoryListProps {
  initialPosts: PostCardResponse[];
  queryResult: UseInfiniteQueryResult<InfiniteData<ApiPageResponse>, unknown>;
  type: "DRAFT" | "PUBLISHED";
}

export function StoryList({ initialPosts, queryResult, type }: StoryListProps) {
  const router = useRouter();
  const { ref, inView } = useInView({ threshold: 0, rootMargin: "400px" });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    queryResult;

  // --- MUTATIONS ---

  const { mutate: deletePost } = useDeletePost({
    mutation: {
      onSuccess: () => {
        toast.success("Story deleted");
        refetch();
      },
      onError: () => toast.error("Could not delete story"),
    },
  });

  const { mutate: deleteDraft } = useDeleteDraft({
    mutation: {
      onSuccess: () => {
        toast.success("Draft discarded");
        refetch();
      },
      onError: () => toast.error("Could not delete draft"),
    },
  });

  const { mutate: addDraft, isPending: isAddingDraft } = useAddNewDraft({
    mutation: {
      onSuccess: (response) => {
        toast.success("Revision created");
        router.push(
          `/posts/${response.data.postId}/drafts/${response.data.draftId}/edit`
        );
      },
      onError: () => toast.error("Could not create revision draft"),
    },
  });

  // --- HANDLERS ---

  const handleDelete = (post: PostCardResponse | DraftCardResponse) => {
    if (
      !confirm(
        "Are you sure you want to delete this? This action is permanent."
      )
    )
      return;

    if (type === "PUBLISHED") {
      deletePost({ postId: post.id! });
    } else {
      const draft = post as DraftCardResponse;
      const parentId = draft.postId || draft.id!;
      deleteDraft({
        postId: parentId,
        draftId: draft.id!,
      });
    }
  };

  const handleEdit = (post: PostCardResponse) => {
    if (type === "DRAFT") {
      const parentId = post.postId || post.id!;
      router.push(`/posts/${parentId}/drafts/${post.id}/edit`);
    } else {
      addDraft({ postId: post.id! });
    }
  };

  // --- INFINITE SCROLL ---
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // --- DATA MERGING ---
  const allPosts = useMemo(() => {
    const fetchedPosts =
      data?.pages.flatMap((page) => page.data.content ?? []) || [];
    const combined = fetchedPosts.length > 0 ? fetchedPosts : initialPosts;

    const seen = new Set<string>();
    return combined.filter((post) => {
      if (!post.id || seen.has(post.id)) return false;
      seen.add(post.id);
      return true;
    });
  }, [data, initialPosts]);

  // --- EMPTY STATE ---
  if (allPosts.length === 0 && !isFetchingNextPage) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center animate-in fade-in duration-700">
        <p className="font-serif italic text-xl text-muted-foreground mb-4">
          {type === "DRAFT"
            ? "Your draft folder is currently empty."
            : "Your stories haven't reached the world yet."}
        </p>
        <Button
          variant="outline"
          asChild
          className="rounded-full text-[10px] font-black uppercase tracking-widest px-8 border-2"
        >
          <Link href="/new-story">Start Writing</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-24">
      {allPosts.map((post) => {
        const displayDate =
          type === "DRAFT" ? post.updatedAt ?? post.createdAt : post.createdAt;

        return (
          <div
            key={post.id}
            className="group border-b border-border/40 pb-10 transition-all last:border-0"
          >
            <div className="flex items-start justify-between gap-8">
              <div className="flex-1 space-y-4">
                {/* Content Link */}
                <div
                  onClick={() => handleEdit(post)}
                  className="cursor-pointer block group-hover:opacity-80 transition-opacity"
                >
                  <h3 className="font-sans font-black text-2xl md:text-3xl tracking-tighter text-foreground leading-[1.1] mb-2">
                    {post.title || "Untitled Masterpiece"}
                  </h3>
                  <p className="font-serif italic text-base md:text-lg leading-relaxed text-muted-foreground line-clamp-2">
                    {post.description ||
                      "The summary of this story is still being crafted..."}
                  </p>
                </div>

                {/* Metadata Row */}
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                    {type === "DRAFT" ? "Draft Revision" : "Published Piece"}
                  </span>
                  <span className="text-border/60 text-xs">|</span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
                    {displayDate
                      ? format(new Date(displayDate), "MMM d, yyyy")
                      : "Recently edited"}
                  </span>
                </div>
              </div>

              {/* Action Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-full hover:bg-accent -mr-2"
                  >
                    <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-60 p-3 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-border/40 bg-background/95 backdrop-blur-xl"
                >
                  {type === "PUBLISHED" && (
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/posts/${post.id}`}
                        className="rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 mr-3 text-muted-foreground" />
                        View Final Story
                      </Link>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem
                    onClick={() => handleEdit(post)}
                    disabled={isAddingDraft}
                    className="rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5 mr-3 text-muted-foreground" />
                    {type === "PUBLISHED"
                      ? "Refine Revision"
                      : "Resume Writing"}
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="opacity-40 my-2" />

                  <DropdownMenuItem
                    onClick={() => handleDelete(post)}
                    className="rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest text-red-500 focus:text-red-600 focus:bg-red-50/50 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-3" />
                    {type === "PUBLISHED" ? "Delete Forever" : "Discard Draft"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        );
      })}

      {/* Infinite Scroll & Skeleton */}
      {(isFetchingNextPage || hasNextPage) && (
        <div ref={ref} className="space-y-12 pt-10">
          {[1, 2].map((i) => (
            <div key={i} className="animate-pulse space-y-4">
              <div className="h-10 bg-muted rounded-xl w-3/4" />
              <div className="h-4 bg-muted/60 rounded-lg w-full" />
              <div className="h-4 bg-muted/60 rounded-lg w-1/2" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
