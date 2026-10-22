import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebaseAdmin";

// Article view counts: one document per post, "postStats/{postId}", holding the
// all-time total and a count per day ("days.2026-10-21"). No visitor data is kept.

const STATS = () => getAdminDb().collection("postStats");

export type PostStats = { views: number; last7: number; last30: number; lastViewedAt: string | null };

const dayKey = (d: Date) => d.toISOString().slice(0, 10);

export async function recordView(postId: string) {
  const now = new Date();
  await STATS()
    .doc(postId)
    .set(
      { views: FieldValue.increment(1), days: { [dayKey(now)]: FieldValue.increment(1) }, lastViewedAt: now.toISOString() },
      { merge: true }
    );
}

function summarise(d: FirebaseFirestore.DocumentData | undefined, now = Date.now()): PostStats {
  const days = (d?.days ?? {}) as Record<string, number>;
  const since = (n: number) => dayKey(new Date(now - (n - 1) * 86_400_000));
  const sum = (from: string) => Object.entries(days).reduce((t, [k, v]) => (k >= from ? t + (Number(v) || 0) : t), 0);
  return { views: Number(d?.views) || 0, last7: sum(since(7)), last30: sum(since(30)), lastViewedAt: d?.lastViewedAt ?? null };
}

/** Stats for every post, keyed by post id (posts never viewed are simply missing). */
export async function allPostStats(): Promise<Record<string, PostStats>> {
  const snap = await STATS().get();
  return Object.fromEntries(snap.docs.map((d) => [d.id, summarise(d.data())]));
}

export async function postStats(postId: string): Promise<PostStats> {
  return summarise((await STATS().doc(postId).get()).data());
}

export async function deletePostStats(postId: string) {
  await STATS().doc(postId).delete();
}
