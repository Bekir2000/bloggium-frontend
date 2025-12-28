import { PostCardResponse, UserResponse } from "@/api/generated/model";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, MessageCircle, ThumbsUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PostActions } from "./PostActions";

export function PostCard({
  postCard,
  currentUser,
}: {
  postCard: PostCardResponse;
  currentUser: UserResponse | undefined;
}) {
  if (!postCard) {
    return null;
  }

  const isBookmarked = postCard.meta?.isBookmarked ?? false;
  const postUrl = `/post-feed/${postCard.id}`;

  const formattedDate = postCard.createdAt
    ? new Date(postCard.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <Card className="group w-full border-none bg-background shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-[2rem] overflow-hidden">
      <CardHeader className="p-6 sm:p-8">
        {/* User Info / Byline */}
        <div className="mb-6 flex flex-row items-center gap-3">
          <Avatar className="h-8 w-8 ring-2 ring-background shadow-sm">
            <AvatarImage
              src={postCard.author?.imageUrl ?? undefined}
              alt={postCard.author?.firstName}
            />
            <AvatarFallback className="bg-primary/5 text-primary text-[10px] font-bold">
              {postCard.author?.firstName?.[0] ?? "?"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/80">
              {postCard.author?.firstName} {postCard.author?.lastName}
            </span>
            <span className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest">
              Author
            </span>
          </div>
        </div>

        {/* Main Content Area */}
        <Link
          href={postUrl}
          className="flex flex-col-reverse md:flex-row items-start justify-between gap-6 cursor-pointer"
        >
          <div className="flex-1 space-y-3">
            <CardTitle className="font-sans text-xl font-black leading-tight tracking-tighter transition-colors group-hover:text-primary sm:text-2xl lg:text-3xl">
              {postCard.title}
            </CardTitle>
            <CardDescription className="font-serif text-base leading-relaxed text-muted-foreground line-clamp-2 italic">
              {postCard.description}
            </CardDescription>
          </div>

          {postCard.imageUrl && (
            <div className="relative aspect-[16/10] w-full md:w-[220px] shrink-0 overflow-hidden rounded-2xl border border-border/50 shadow-sm transition-transform duration-500 group-hover:scale-[1.02]">
              <Image
                src={postCard.imageUrl}
                alt={postCard.title ?? ""}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 220px"
              />
            </div>
          )}
        </Link>
      </CardHeader>

      {/* Footer / Stats Bar */}
      <CardFooter className="px-6 sm:px-8 pb-8 flex items-center justify-between">
        <div className="flex items-center gap-5">
          {/* Date */}
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              {formattedDate}
            </span>
          </div>

          {/* Engagement Stats */}
          <div className="flex items-center gap-4 border-l border-border/50 pl-5">
            <span className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground transition-colors hover:text-primary">
              <ThumbsUp className="h-3.5 w-3.5" />
              {postCard.meta?.likeCount || 0}
            </span>
            <span className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground transition-colors hover:text-primary">
              <MessageCircle className="h-3.5 w-3.5" />
              {postCard.meta?.commentCount || 0}
            </span>
          </div>
        </div>

        {postCard.id && (
          <div className="scale-90 opacity-80 transition-all hover:opacity-100 hover:scale-100">
            <PostActions
              postId={postCard.id}
              currentUser={currentUser}
              isBookmarked={isBookmarked}
            />
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
