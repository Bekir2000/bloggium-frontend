"use client";

import {
  AuthorSummary,
  PostCardResponse,
  UserResponse,
} from "@/api/generated/model";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { CategoryList } from "./CategoryList";
import { SidebarPostItem } from "./SidebarPostItem";
import { UserSuggestionItem } from "./UserSuggestionItem";

interface RightSidebarProps {
  suggestions: AuthorSummary[];
  currentUser?: UserResponse | null;
  bookmarks: PostCardResponse[];
}

export default function RightSidebar({
  suggestions,
  currentUser,
  bookmarks,
}: RightSidebarProps) {
  return (
    <aside className="hidden lg:block w-[350px] sticky top-24 h-fit space-y-12 pb-10 mr-6">
      {/* Topics - Recommended */}
      <section className="space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/50 px-2">
          Recommended Topics
        </h3>
        <Card className="border-none shadow-none bg-gray-50/50 rounded-[2rem] overflow-hidden">
          <CardContent className="p-6 pt-6">
            <Suspense
              fallback={
                <div className="h-20 bg-gray-100/50 animate-pulse rounded-2xl" />
              }
            >
              <CategoryList />
            </Suspense>
          </CardContent>
        </Card>
      </section>

      {/* Who to follow */}
      {currentUser && (
        <section className="space-y-6">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/50 px-2">
            Who to follow
          </h3>
          <div className="space-y-6 px-2">
            {suggestions.length > 0 ? (
              suggestions.map((author) => (
                <UserSuggestionItem
                  key={author.id}
                  author={author}
                  currentUser={currentUser}
                />
              ))
            ) : (
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest italic">
                No new writers found.
              </p>
            )}
          </div>
        </section>
      )}

      {/* Reading List */}
      {currentUser && (
        <section className="space-y-6">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/50 px-2">
            Reading list
          </h3>
          <div className="space-y-6 px-2 text-foreground">
            {bookmarks.length > 0 ? (
              <div className="flex flex-col gap-6">
                {bookmarks.map((post) => (
                  <SidebarPostItem key={post.id} post={post} />
                ))}
                <Link
                  href="/bookmarks"
                  className="text-[10px] font-black uppercase tracking-[0.15em] text-green-600 hover:text-green-700 transition-colors"
                >
                  See all bookmarks →
                </Link>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground font-serif italic">
                Click the <Plus className="w-3 h-3 inline align-middle" /> on
                any story to add it here.
              </p>
            )}
          </div>
        </section>
      )}
    </aside>
  );
}
