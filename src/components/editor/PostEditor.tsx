"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  ArrowLeft,
  ImagePlus,
  Loader2,
  MoreHorizontal,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

// Shadcn Imports
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// API & Models
import {
  getGetDraftByIdQueryKey,
  useCreateFirstDraft,
  usePublishPost,
  useSafeDraft,
} from "@/api/generated/client/post-controller/post-controller";
import type {
  DraftDetailResponse,
  PostDraftRequest,
  PostDraftRequestCategory,
} from "@/api/generated/model";

import { UnsplashModal } from "@/components/editor/UnsplashModal";
import { cn } from "@/lib/utils"; // Assuming you have a cn utility for classes
import { toast } from "sonner";

const CATEGORIES: PostDraftRequestCategory[] = [
  "TECHNOLOGY",
  "LIFESTYLE",
  "TUTORIAL",
  "NEWS",
  "PERSONAL",
  "CODING",
] as any;

interface PostEditorProps {
  draftToEdit?: DraftDetailResponse;
}

export const PostEditor: React.FC<PostEditorProps> = ({ draftToEdit }) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const titleRef = useRef<HTMLTextAreaElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  // --- STATE ---
  const [title, setTitle] = useState(draftToEdit?.title || "");
  const [content, setContent] = useState(draftToEdit?.content || "");
  const [imageUrl, setImageUrl] = useState(draftToEdit?.imageUrl || "");
  const [category, setCategory] = useState<
    PostDraftRequestCategory | undefined
  >(draftToEdit?.category as PostDraftRequestCategory | undefined);
  const [tags, setTags] = useState<string[]>(draftToEdit?.tags || []);
  const [tagInput, setTagInput] = useState("");

  const [isUnsplashOpen, setIsUnsplashOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [triedToPublish, setTriedToPublish] = useState(false);

  const [postId, setPostId] = useState<string | undefined>(draftToEdit?.postId);
  const [draftId, setDraftId] = useState<string | undefined>(draftToEdit?.id);

  // --- MUTATIONS ---
  const createFirstDraftMutation = useCreateFirstDraft();
  const saveDraftMutation = useSafeDraft();
  const publishMutation = usePublishPost();

  const isSaving =
    createFirstDraftMutation.isPending || saveDraftMutation.isPending;
  const isPublishing = publishMutation.isPending;

  // --- VALIDATION RULES ---
  const validatePost = () => {
    setTriedToPublish(true); // Triggers red borders/UI highlights

    if (!imageUrl) {
      toast.error("A cover image is required to publish");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return false;
    }
    if (title.trim().length < 5) {
      toast.error("Title is too short (min 5 characters)");
      titleRef.current?.focus();
      return false;
    }
    if (!category) {
      toast.error("Please select a category in settings");
      setShowSettings(true);
      return false;
    }
    if (content.trim().length < 50) {
      toast.error("Story is too short (min 50 characters)");
      contentRef.current?.focus();
      return false;
    }
    return true;
  };

  // --- HELPERS ---
  const autoResize = (elem: HTMLTextAreaElement | null) => {
    if (elem) {
      elem.style.height = "auto";
      elem.style.height = elem.scrollHeight + "px";
    }
  };

  useEffect(() => autoResize(titleRef.current), [title]);
  useEffect(() => autoResize(contentRef.current), [content]);

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmed = tagInput.trim();
      if (trimmed && !tags.includes(trimmed) && tags.length < 10) {
        setTags([...tags, trimmed]);
        setTagInput("");
      }
    }
  };

  // --- CORE LOGIC ---

  const handleSave = async (silent = false) => {
    if (title.length < 1) {
      if (!silent) toast.error("Title cannot be empty to save");
      return null;
    }

    const payload: PostDraftRequest = {
      title,
      content,
      imageUrl: imageUrl || undefined,
      category,
      tags,
    };

    try {
      let currentPostId = postId;
      let currentDraftId = draftId;

      if (!currentPostId) {
        const res = await createFirstDraftMutation.mutateAsync({
          data: payload,
        });
        currentPostId = res.data.postId;
        currentDraftId = res.data.draftId;
        setPostId(currentPostId);
        setDraftId(currentDraftId);
      } else if (currentPostId && currentDraftId) {
        await saveDraftMutation.mutateAsync({
          postId: currentPostId,
          draftId: currentDraftId,
          data: payload,
        });
      }

      if (currentPostId && currentDraftId) {
        await queryClient.invalidateQueries({
          queryKey: getGetDraftByIdQueryKey(currentPostId, currentDraftId),
        });
      }

      if (!silent) toast.success("Draft saved");
      return { postId: currentPostId, draftId: currentDraftId };
    } catch (error) {
      toast.error("Save failed");
      return null;
    }
  };

  const handlePublish = async () => {
    if (!validatePost()) return;

    const savedData = await handleSave(true);
    if (!savedData) return;

    try {
      await publishMutation.mutateAsync({
        postId: savedData.postId!,
        draftId: savedData.draftId!,
      });

      toast.success("Post live!");
      router.push(`/post-feed/${savedData.postId}`);
    } catch (error) {
      toast.error("Publishing failed");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-40">
      {/* HEADER */}
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-14 max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button onClick={() => router.back()} variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">
                {postId ? "Drafting" : "New Story"}
              </span>
              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                {isSaving && <Loader2 className="h-2 w-2 animate-spin" />}
                {isSaving ? "Syncing..." : "Saved"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSave(false)}
              disabled={isSaving || isPublishing}
            >
              Save
            </Button>

            <Button
              size="sm"
              onClick={handlePublish}
              disabled={isSaving || isPublishing}
              className="bg-green-600 hover:bg-green-700 text-white font-medium"
            >
              {isPublishing ? (
                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
              ) : null}
              Publish
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSettings(!showSettings)}
              className={
                triedToPublish && !category ? "text-red-500 animate-pulse" : ""
              }
            >
              {triedToPublish && !category ? (
                <AlertCircle className="h-4 w-4" />
              ) : (
                <MoreHorizontal className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </nav>

      <main className="container max-w-3xl mx-auto px-4 mt-12 animate-in fade-in duration-500">
        {/* Cover Image Section */}
        <div className="group relative mb-10">
          {!imageUrl ? (
            <Button
              variant="outline"
              className={cn(
                "h-48 w-full border-dashed border-2 flex flex-col gap-2 text-muted-foreground transition-all",
                triedToPublish &&
                  !imageUrl &&
                  "border-red-500 bg-red-50/10 text-red-500"
              )}
              onClick={() => setIsUnsplashOpen(true)}
            >
              <ImagePlus className="h-8 w-8" />
              <span className="font-medium">Add a cover image *</span>
              {triedToPublish && !imageUrl && (
                <span className="text-xs">Image is required to publish</span>
              )}
            </Button>
          ) : (
            <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg border border-border">
              <Image src={imageUrl} alt="Cover" fill className="object-cover" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 transition-all gap-3">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsUnsplashOpen(true)}
                >
                  Change
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setImageUrl("")}
                >
                  Remove
                </Button>
              </div>
            </div>
          )}
        </div>

        <textarea
          ref={titleRef}
          placeholder="Enter title..."
          className={cn(
            "w-full resize-none bg-transparent text-4xl md:text-5xl font-bold font-serif focus:outline-none mb-6 placeholder:text-muted-foreground/30",
            triedToPublish && title.length < 5 && "placeholder:text-red-300"
          )}
          rows={1}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          ref={contentRef}
          placeholder="Tell your story..."
          className="w-full resize-none bg-transparent text-lg md:text-xl font-serif leading-relaxed focus:outline-none min-h-[60vh] placeholder:text-muted-foreground/30"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </main>

      {/* SETTINGS DRAWER */}
      {showSettings && (
        <div className="fixed bottom-0 left-0 right-0 border-t bg-background p-6 z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] animate-in slide-in-from-bottom-full duration-300">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Post Settings</h3>
                <p className="text-xs text-muted-foreground">
                  Required to publish your post
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSettings(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-sm font-bold flex items-center gap-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <Select
                  value={category || ""}
                  onValueChange={(val) =>
                    setCategory(val as PostDraftRequestCategory)
                  }
                >
                  <SelectTrigger
                    className={cn(
                      triedToPublish &&
                        !category &&
                        "border-red-500 ring-red-500"
                    )}
                  >
                    <SelectValue placeholder="Select a topic..." />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold">Tags</label>
                <div className="min-h-[2.5rem] p-2 border rounded-md flex flex-wrap gap-2 focus-within:ring-1 focus-within:ring-primary">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1 pr-1">
                      {tag}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => setTags(tags.filter((t) => t !== tag))}
                      />
                    </Badge>
                  ))}
                  {tags.length < 10 && (
                    <input
                      className="flex-1 bg-transparent outline-none text-sm min-w-[80px]"
                      placeholder="Add tag..."
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleAddTag}
                    />
                  )}
                </div>
              </div>
            </div>

            <Button
              className="w-full md:w-auto"
              onClick={() => setShowSettings(false)}
            >
              Done
            </Button>
          </div>
        </div>
      )}

      <UnsplashModal
        open={isUnsplashOpen}
        onOpenChange={setIsUnsplashOpen}
        onSelect={(url) => {
          setImageUrl(url);
          setIsUnsplashOpen(false);
        }}
      />
    </div>
  );
};
