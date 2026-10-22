import { unstable_cache } from "next/cache";
import { allPostStats, type PostStats } from "@/lib/postStats";

/** Article stats for public pages ("Most read"): refreshed every 10 minutes, never breaks the page. */
export const cachedPostStats = unstable_cache(
  async (): Promise<Record<string, PostStats>> => {
    try {
      return await allPostStats();
    } catch (err) {
      console.error("Couldn't read article stats:", err);
      return {};
    }
  },
  ["post-stats"],
  { revalidate: 600 }
);
