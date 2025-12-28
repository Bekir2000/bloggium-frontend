"use client";

import { UserResponse } from "@/api/generated/model";
import { BackButton } from "@/components/ui/back-button";
import { BrandLogo } from "@/components/ui/brand-logo";
import { Button } from "@/components/ui/button";
import { Loader2, Rocket } from "lucide-react";
import { BaseNavbar } from "../navbar/BaseNavbar";

interface EditorNavbarProps {
  currentUser: UserResponse | undefined;
  isPending: boolean;
  isEditing: boolean;
  onSaveDraft: () => void;
  onPublish: () => void;
}

export function EditorNavbar({
  currentUser,
  isPending,
  isEditing,
  onSaveDraft,
  onPublish,
}: EditorNavbarProps) {
  return (
    <BaseNavbar
      user={currentUser}
      left={
        <div className="flex items-center gap-4">
          <BackButton />
          <div className="flex items-center gap-4">
            <BrandLogo />
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">
                {isEditing ? "Editing Revision" : "New Story"}
              </span>
              <span className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest">
                {isPending ? "Syncing..." : "Saved locally"}
              </span>
            </div>
          </div>
        </div>
      }
      actions={
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            disabled={isPending}
            onClick={onSaveDraft}
            className="text-[10px] font-black uppercase tracking-widest hover:bg-accent rounded-full px-4"
          >
            Save Draft
          </Button>

          <Button
            size="sm"
            disabled={isPending}
            onClick={onPublish}
            className="rounded-full bg-green-600 hover:bg-green-700 text-white px-6 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-green-500/20"
          >
            {isPending ? (
              <Loader2 className="w-3 h-3 mr-2 animate-spin" />
            ) : (
              <Rocket className="w-3 h-3 mr-2" />
            )}
            Publish
          </Button>
        </div>
      }
    />
  );
}
