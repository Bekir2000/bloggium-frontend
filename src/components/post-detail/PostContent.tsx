import { PostDetailResponse } from "@/api/generated/model";
import Image from "next/image";

export function PostContent({ post }: { post: PostDetailResponse }) {
  return (
    <>
      {post.imageUrl && (
        <figure className="mb-12">
          <div className="relative aspect-[21/9] w-full overflow-hidden rounded-[2rem] border border-border/50 shadow-2xl">
            <Image
              src={post.imageUrl}
              alt={post.title || "Post cover"}
              fill
              className="object-cover"
              priority
            />
          </div>
        </figure>
      )}

      {/* Main Prose Styling */}
      <div
        className="prose prose-lg prose-slate dark:prose-invert max-w-none 
        font-serif leading-relaxed text-foreground/90
        prose-headings:font-sans prose-headings:font-black prose-headings:tracking-tighter
        prose-p:mb-6 prose-p:text-xl
        prose-a:text-green-600 prose-a:no-underline hover:prose-a:underline
        prose-strong:text-foreground prose-img:rounded-3xl"
      >
        {post.content ? (
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        ) : (
          <p className="text-muted-foreground italic">
            The story is yet to be told.
          </p>
        )}
      </div>
    </>
  );
}
