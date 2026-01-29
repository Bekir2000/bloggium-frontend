"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  ImagePlus,
  Loader2,
  MoreHorizontal,
  Rocket,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";

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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
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
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const CATEGORIES: PostDraftRequestCategory[] = [
  "TECHNOLOGY",
  "LIFESTYLE",
  "TUTORIAL",
  "NEWS",
  "PERSONAL",
  "CODING",
] as any;

interface BackendError {
  field: string;
  message: string;
}

export const PostEditor: React.FC<{ draftToEdit?: DraftDetailResponse }> = ({
  draftToEdit,
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Refs for navigation and nudges
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const imageSectionRef = useRef<HTMLDivElement>(null);

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
  const [backendErrors, setBackendErrors] = useState<BackendError[]>([]);

  // Nudge State (for visual feedback)
  const [activeNudge, setActiveNudge] = useState<string | null>(null);

  const [postId, setPostId] = useState<string | undefined>(draftToEdit?.postId);
  const [draftId, setDraftId] = useState<string | undefined>(draftToEdit?.id);

  // --- MUTATIONS ---
  const createFirstDraftMutation = useCreateFirstDraft();
  const saveDraftMutation = useSafeDraft();
  const publishMutation = usePublishPost();

  const isSaving =
    createFirstDraftMutation.isPending || saveDraftMutation.isPending;
  const isPublishing = publishMutation.isPending;

  // --- HELPERS ---
  const triggerNudge = (id: string) => {
    setActiveNudge(id);
    setTimeout(() => setActiveNudge(null), 3000); // Clear nudge after 3 seconds
  };

  // --- CHECKLIST ACTIONS ---
  const checklist = useMemo(
    () => [
      {
        id: "title",
        label: "Catchy title (min 5)",
        met: title.trim().length >= 5,
        action: () => {
          titleRef.current?.focus();
          triggerNudge("title");
        },
      },
      {
        id: "imageUrl",
        label: "Cover image",
        met: !!imageUrl,
        action: () => {
          imageSectionRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
          triggerNudge("imageUrl");
        },
      },
      {
        id: "category",
        label: "Category",
        met: !!category,
        action: () => {
          setShowSettings(true);
          triggerNudge("category");
        },
      },
      {
        id: "content",
        label: "Story (min 50 chars)",
        met: content.trim().length >= 50,
        action: () => {
          contentRef.current?.focus();
          contentRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
          triggerNudge("content");
        },
      },
    ],
    [title, imageUrl, category, content],
  );

  const progressCount = checklist.filter((c) => c.met).length;
  const isReady = progressCount === checklist.length;

  const getFieldError = (fieldName: string) =>
    backendErrors.find((e) => e.field === fieldName)?.message;

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

  const handleSave = async (silent = false) => {
    if (title.length < 1) {
      if (!silent) toast.error("Write a title first!");
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
      let cPostId = postId,
        cDraftId = draftId;
      if (!cPostId) {
        const res = await createFirstDraftMutation.mutateAsync({
          data: payload,
        });
        cPostId = res.data.postId;
        cDraftId = res.data.draftId;
        setPostId(cPostId);
        setDraftId(cDraftId);
      } else if (cPostId && cDraftId) {
        await saveDraftMutation.mutateAsync({
          postId: cPostId,
          draftId: cDraftId,
          data: payload,
        });
      }
      if (!silent) toast.success("Draft saved");
      router.push(`/me/stories`);
      return { postId: cPostId, draftId: cDraftId };
    } catch (error) {
      toast.error("Save failed");
      return null;
    }
  };

  const handlePublish = async () => {
    setTriedToPublish(true);
    if (!isReady) {
      const firstMissing = checklist.find((c) => !c.met);
      if (firstMissing) firstMissing.action();
      toast.info("A few things still need your attention.");
      return;
    }

    const savedData = await handleSave(true);
    if (!savedData) return;

    try {
      await publishMutation.mutateAsync({
        postId: savedData.postId!,
        draftId: savedData.draftId!,
      });
      toast.success("Boom! Your story is live.");
      router.push(`/post-feed/${savedData.postId}`);
    } catch (error: any) {
      const errorData = error.response?.data;
      if (errorData?.errors) setBackendErrors(errorData.errors);
    }
  };

  // Textarea Resizing
  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.height = "auto";
      titleRef.current.style.height = titleRef.current.scrollHeight + "px";
    }
  }, [title]);
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.height = "auto";
      contentRef.current.style.height = contentRef.current.scrollHeight + "px";
    }
  }, [content]);

  return (
    <div className="min-h-screen bg-background text-foreground pb-40 selection:bg-primary/20">
      {/* HEADER */}
      <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => router.back()}
              variant="ghost"
              size="icon"
              className="rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground hidden sm:block">
              {isReady ? "✨ Perfected" : "✍️ Drafting"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSave(false)}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save"}
            </Button>

            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    onClick={handlePublish}
                    disabled={isPublishing}
                    className={cn(
                      "transition-all duration-500 rounded-full px-6",
                      isReady
                        ? "bg-green-600 hover:bg-green-700 shadow-lg text-white"
                        : "bg-primary/5 text-primary hover:bg-primary/10",
                    )}
                  >
                    {isPublishing ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : isReady ? (
                      <Rocket className="mr-2 h-4 w-4" />
                    ) : null}
                    {isReady
                      ? "Publish Now"
                      : `${progressCount}/${checklist.length} Steps`}
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  align="end"
                  className="w-72 p-4 rounded-[2rem] shadow-2xl border-none bg-popover text-popover-foreground z-[100]"
                  sideOffset={12}
                >
                  <div className="space-y-4">
                    <div className="flex flex-col gap-1 border-b pb-3 border-border/50">
                      <p className="font-bold text-sm">Review Checklist</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                        Click a step to fix it
                      </p>
                    </div>
                    <div className="space-y-1">
                      {checklist.map((item) => (
                        <button
                          key={item.id}
                          onClick={item.action}
                          className="w-full flex items-center justify-between group p-2 rounded-xl hover:bg-accent/50 transition-all"
                        >
                          <div className="flex items-center gap-3">
                            {item.met ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            ) : (
                              <Circle className="h-4 w-4 text-muted-foreground" />
                            )}
                            <span
                              className={cn(
                                "text-xs font-medium",
                                item.met
                                  ? "text-muted-foreground line-through"
                                  : "text-foreground",
                              )}
                            >
                              {item.label}
                            </span>
                          </div>
                          {!item.met && (
                            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSettings(!showSettings)}
              className="rounded-full hover:bg-accent"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </nav>

      <main className="container max-w-3xl mx-auto px-4 mt-16">
        {/* IMAGE SECTION */}
        <div
          ref={imageSectionRef}
          className={cn(
            "group relative mb-12 transition-all duration-700",
            activeNudge === "imageUrl" &&
              "scale-[1.02] ring-4 ring-primary/20 rounded-3xl",
          )}
        >
          {!imageUrl ? (
            <div
              onClick={() => setIsUnsplashOpen(true)}
              className={cn(
                "h-64 w-full rounded-[2.5rem] border-2 border-dashed flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-accent/50 transition-all duration-300",
                (triedToPublish || activeNudge === "imageUrl") &&
                  !imageUrl &&
                  "border-red-500 bg-red-50/10",
              )}
            >
              <ImagePlus
                className={cn(
                  "h-8 w-8 text-muted-foreground",
                  activeNudge === "imageUrl" && "animate-bounce text-primary",
                )}
              />
              <p className="text-sm font-medium text-muted-foreground">
                Choose a cover image
              </p>
            </div>
          ) : (
            <div className="relative w-full aspect-[21/9] rounded-[2.5rem] overflow-hidden shadow-2xl group border border-border">
              <Image src={imageUrl} alt="Cover" fill className="object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <Button
                  variant="secondary"
                  size="sm"
                  className="rounded-full"
                  onClick={() => setIsUnsplashOpen(true)}
                >
                  Change
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="rounded-full"
                  onClick={() => setImageUrl("")}
                >
                  Remove
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* TITLE */}
        <div className="space-y-4 mb-8 relative">
          {activeNudge === "title" && (
            <Badge className="absolute -top-8 left-0 animate-in slide-in-from-bottom-2 bg-primary text-white">
              Title is too short!
            </Badge>
          )}
          <textarea
            ref={titleRef}
            placeholder="Your story title..."
            className={cn(
              "w-full resize-none bg-transparent text-5xl font-black tracking-tighter focus:outline-none placeholder:text-muted-foreground/20 transition-colors",
              (triedToPublish || activeNudge === "title") &&
                title.length < 5 &&
                "text-red-500",
            )}
            rows={1}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {getFieldError("title") && (
            <p className="text-xs text-red-500 font-bold uppercase tracking-widest">
              {getFieldError("title")}
            </p>
          )}
        </div>

        {/* CONTENT */}
        <div className="space-y-4 relative">
          {activeNudge === "content" && (
            <Badge className="absolute -top-8 left-0 animate-in slide-in-from-bottom-2 bg-primary text-white">
              Need at least 50 characters here!
            </Badge>
          )}
          <textarea
            ref={contentRef}
            placeholder="Once upon a time..."
            className={cn(
              "w-full resize-none bg-transparent text-xl leading-relaxed focus:outline-none min-h-[50vh] placeholder:text-muted-foreground/20 font-serif",
              activeNudge === "content" && "bg-primary/5 rounded-xl p-4 -ml-4",
            )}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          {getFieldError("content") && (
            <p className="text-xs text-red-500 font-bold uppercase tracking-widest">
              {getFieldError("content")}
            </p>
          )}
        </div>
      </main>

      {/* FINISHING TOUCHES DRAWER */}
      {showSettings && (
        <>
          <div
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-[60]"
            onClick={() => setShowSettings(false)}
          />
          <div
            className={cn(
              "fixed bottom-8 left-1/2 -translate-x-1/2 w-[95%] max-w-2xl bg-background border rounded-[3rem] p-10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] z-[70] animate-in slide-in-from-bottom-10 transition-all duration-500",
              activeNudge === "category" && "ring-4 ring-primary",
            )}
          >
            <div className="flex items-center justify-between mb-8">
              <div className="space-y-1">
                <h3 className="text-2xl font-black tracking-tight underline decoration-primary decoration-4 underline-offset-4">
                  Settings
                </h3>
                <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
                  Almost ready to go live
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSettings(false)}
                className="rounded-full hover:rotate-90 transition-transform"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-primary">
                  1. Category *
                </label>
                <Select
                  value={category || ""}
                  onValueChange={(val) =>
                    setCategory(val as PostDraftRequestCategory)
                  }
                >
                  <SelectTrigger
                    className={cn(
                      "h-16 rounded-[1.25rem] border-2 transition-all",
                      (triedToPublish || activeNudge === "category") &&
                        !category &&
                        "border-red-500 bg-red-50/5",
                    )}
                  >
                    <SelectValue placeholder="What's the topic?" />
                  </SelectTrigger>
                  <SelectContent className="z-[100] rounded-2xl">
                    {/* Adding z-[100] here forces the dropdown to sit on top of your fixed drawer */}
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {getFieldError("category") && (
                  <p className="text-[10px] text-red-500 font-bold mt-1 uppercase">
                    {getFieldError("category")}
                  </p>
                )}
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-primary">
                  2. Tags
                </label>
                <div className="flex flex-wrap gap-2 p-3 border-2 rounded-[1.25rem] min-h-[64px] focus-within:ring-2 ring-primary transition-all">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      className="bg-primary/10 text-primary border-none py-2 px-3 flex items-center gap-1 rounded-xl"
                    >
                      {tag}{" "}
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-red-500"
                        onClick={() => setTags(tags.filter((t) => t !== tag))}
                      />
                    </Badge>
                  ))}
                  <input
                    className="bg-transparent outline-none text-sm flex-1 min-w-[100px]"
                    placeholder="Add keywords..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                  />
                </div>
              </div>
            </div>
            <Button
              className="w-full mt-10 rounded-2xl h-16 text-lg font-black tracking-tight shadow-xl shadow-primary/20 transition-transform active:scale-[0.98]"
              onClick={() => setShowSettings(false)}
            >
              Finish Setup
            </Button>
          </div>
        </>
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
