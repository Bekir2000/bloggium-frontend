import { PostDetailResponseCategory } from "@/api/generated/model";
import { BackButton } from "@/components/ui/back-button";

interface PostHeaderProps {
  title?: string;
  description?: string;
  category?: PostDetailResponseCategory | string;
}

export function PostHeader({ title, description, category }: PostHeaderProps) {
  const formattedCategory = category ? category.toString().toUpperCase() : "";

  return (
    <header className="mb-12 space-y-8">
      {/* Top Navigation Row */}
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <BackButton />
        </div>

        {category && (
          <div className="flex-shrink-0">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
              {formattedCategory}
            </span>
          </div>
        )}
      </div>

      {/* Title Area */}
      <div className="space-y-6">
        <h1 className="font-sans text-4xl font-black leading-[1.1] tracking-tighter text-foreground md:text-6xl">
          {title}
        </h1>

        {description && (
          <h2 className="font-serif text-xl italic leading-relaxed text-muted-foreground">
            {description}
          </h2>
        )}
      </div>
    </header>
  );
}
