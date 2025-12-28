"use client";

import { CommentResponse, UserResponse } from "@/api/generated/model";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, MessageSquare } from "lucide-react";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

// Hooks & Logic
import { Button } from "@/components/ui/button";
import { usePostComments } from "@/hooks/usePostComments";
import { CommentForm } from "./CommentForm";
import { CommentItem } from "./CommentItem";

interface PostCommentsProps {
  postId: string;
  currentUser?: UserResponse | null;
  initialCount?: number;
  onCountChange?: (count: number) => void;
}

export interface CommentWithChildren extends CommentResponse {
  replies?: CommentWithChildren[];
}

export function PostComments({
  postId,
  currentUser,
  initialCount = 0,
  onCountChange,
}: PostCommentsProps) {
  const {
    comments,
    totalCount,
    isLoading,
    isCreating,
    addComment,
    handleDelete,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePostComments({
    postId,
  });

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "100px",
  });

  // Pagination Trigger
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Sync Count to Parent (PostDetail)
  useEffect(() => {
    if (typeof totalCount === "number" && onCountChange) {
      onCountChange(totalCount);
    }
  }, [totalCount, onCountChange]);

  const displayCount = totalCount !== undefined ? totalCount : initialCount;

  return (
    <section className="mt-24 space-y-12" id="comments">
      {/* Editorial Header Section */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-primary" />
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/60">
            Responses ({displayCount})
          </h3>
        </div>
        <div className="h-px flex-1 bg-border/40" />
      </div>

      {/* Comment Input Area */}
      <div className="bg-gray-50/50 dark:bg-zinc-900/50 p-6 sm:p-8 rounded-[2rem] border border-border/40">
        <CommentForm
          currentUser={currentUser}
          onSubmit={(content) => addComment(content)}
          isSubmitting={isCreating}
        />
      </div>

      {/* Discussion Thread */}
      <div className="space-y-10">
        {isLoading ? (
          // Loading Skeletons
          <div className="space-y-8 px-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                <div className="space-y-3 flex-1">
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-16 w-full rounded-2xl" />
                </div>
              </div>
            ))}
          </div>
        ) : comments.length > 0 ? (
          <>
            <div className="divide-y divide-border/30">
              {comments.map((comment) => (
                <div key={comment.id} className="py-8 first:pt-0 last:pb-0">
                  <CommentItem
                    postId={postId}
                    comment={comment as CommentWithChildren}
                    currentUserId={currentUser?.id}
                    onReplySubmit={(content, parentId) =>
                      addComment(content, parentId)
                    }
                    onDelete={handleDelete}
                  />
                </div>
              ))}
            </div>

            {/* Infinite Scroll Trigger */}
            <div ref={ref} className="flex justify-center py-10 min-h-[80px]">
              {isFetchingNextPage ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Loading older comments
                  </span>
                </div>
              ) : hasNextPage ? (
                <Button
                  variant="ghost"
                  onClick={() => fetchNextPage()}
                  className="text-[10px] font-black uppercase tracking-widest"
                >
                  Load More
                </Button>
              ) : (
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
                  End of discussion
                </p>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-20 px-4 rounded-[2.5rem] bg-gray-50/30 dark:bg-zinc-900/20 border border-dashed border-border/60">
            <p className="font-serif italic text-muted-foreground text-lg">
              The conversation hasn't started yet.
              <br />
              <span className="text-sm font-sans not-italic font-medium text-primary mt-2 block uppercase tracking-widest">
                Be the first to share your thoughts
              </span>
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
