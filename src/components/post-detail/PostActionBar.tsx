import clsx from "clsx";
import { Bookmark, MessageCircle, ThumbsUp } from "lucide-react";

interface PostActionBarProps {
  likes: number;
  comments: number;
  isBookmarked: boolean;
  isLiked: boolean;
  isLoading: boolean;
  onToggleBookmark: () => void;
  onToggleLike: () => void;
  onCommentClick?: () => void; // <--- ADD THIS
}

export function PostActionBar({
  likes,
  comments,
  isBookmarked,
  isLiked,
  isLoading,
  onToggleBookmark,
  onToggleLike,
  onCommentClick,
}: PostActionBarProps) {
  return (
    <div className="sticky top-20 z-10 flex items-center justify-between border-y border-border/50 bg-white/80 py-3 backdrop-blur-md dark:bg-zinc-950/80 mb-12">
      <div className="flex items-center gap-8">
        <button
          onClick={onToggleLike}
          disabled={isLoading}
          className={clsx(
            "flex items-center gap-2 transition-colors",
            isLiked
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <ThumbsUp className={clsx("w-5 h-5", isLiked && "fill-current")} />
          <span className="text-[11px] font-black tracking-widest uppercase">
            {likes}
          </span>
        </button>

        <button
          onClick={onCommentClick}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-[11px] font-black tracking-widest uppercase">
            {comments}
          </span>
        </button>
      </div>

      <button
        onClick={onToggleBookmark}
        disabled={isLoading}
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        <Bookmark
          className={clsx(
            "w-5 h-5",
            isBookmarked && "fill-current text-foreground"
          )}
        />
      </button>
    </div>
  );
}
