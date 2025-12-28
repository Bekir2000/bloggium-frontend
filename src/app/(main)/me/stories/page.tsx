import {
  getAllPostCards,
  getMyDrafts,
} from "@/api/generated/server/post-controller/post-controller";
import { UserStoriesTabs } from "@/components/stories/UserStoriesTabs";
import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function StoriesPage() {
  const currentUser = await getUser();

  if (!currentUser) {
    redirect("/login?next=/me/stories");
  }

  const [draftsRes, publishedRes] = await Promise.all([
    getMyDrafts({ page: 0, size: 5 }),
    getAllPostCards({
      page: 0,
      size: 5,
      authorName: `${currentUser.firstName} ${currentUser.lastName}`,
    }),
  ]);

  return (
    <div className="mx-auto max-w-[680px] px-6 py-10 md:py-20 animate-in fade-in duration-700">
      <UserStoriesTabs
        currentUser={currentUser}
        initialDrafts={draftsRes.content ?? []}
        initialPublished={publishedRes.content ?? []}
      />
    </div>
  );
}
