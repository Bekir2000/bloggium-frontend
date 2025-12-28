"use client";

import { PostCardResponse, UserResponse } from "@/api/generated/model";
import { DraftsFeed, PublishedFeed } from "@/components/stories/StoryFeeds";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BackButton } from "../ui/back-button";

interface UserStoriesTabsProps {
  currentUser: UserResponse | null;
  initialDrafts: PostCardResponse[];
  initialPublished: PostCardResponse[];
}

export function UserStoriesTabs({
  currentUser,
  initialDrafts,
  initialPublished,
}: UserStoriesTabsProps) {
  const router = useRouter();

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-4">
          <BackButton />
          <h1 className="font-sans text-4xl font-black leading-none tracking-tighter text-foreground md:text-5xl">
            Your Stories
          </h1>
        </div>
        <Button
          asChild
          className="rounded-full bg-foreground text-background hover:bg-foreground/90 px-6 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-black/5"
        >
          <Link href="/new-story">Write a story</Link>
        </Button>
      </div>

      <Tabs defaultValue="drafts" className="w-full">
        <TabsList className="mb-10 border-b border-border/50 w-full justify-start rounded-none h-auto p-0 bg-transparent gap-8">
          <TabsTrigger
            value="drafts"
            className="data-[state=active]:border-foreground data-[state=active]:text-foreground border-b-2 border-transparent rounded-none pb-4 px-0 bg-transparent text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground transition-all shadow-none"
          >
            Drafts{" "}
            {initialDrafts.length > 0 && (
              <span className="ml-1 opacity-50">({initialDrafts.length})</span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="published"
            className="data-[state=active]:border-foreground data-[state=active]:text-foreground border-b-2 border-transparent rounded-none pb-4 px-0 bg-transparent text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground transition-all shadow-none"
          >
            Published
          </TabsTrigger>
        </TabsList>

        <TabsContent value="drafts" className="mt-0 focus-visible:ring-0">
          <DraftsFeed initialPosts={initialDrafts} currentUser={currentUser} />
        </TabsContent>

        <TabsContent value="published" className="mt-0 focus-visible:ring-0">
          <PublishedFeed
            initialPosts={initialPublished}
            currentUser={currentUser}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
