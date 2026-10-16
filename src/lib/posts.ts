import { unstable_cache, revalidateTag } from "next/cache";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { EMPTY_DOC, isLive, type Post } from "@/lib/blog";

// Blog posts live in Firestore ("posts"). Each slug a post has ever used is reserved
// in "postSlugs/{slug}" -> { postId }, so slugs stay unique and an old URL keeps
// working (it redirects to the post's current slug) after a rename.

const POSTS = () => getAdminDb().collection("posts");
const SLUGS = () => getAdminDb().collection("postSlugs");
const TAG = "posts";

export function revalidatePosts() {
  revalidateTag(TAG);
}

function toPost(id: string, d: FirebaseFirestore.DocumentData): Post {
  const data = d as Omit<Post, "id">;
  // Older posts may predate a field; fill the defaults.
  return { ...data, highlights: data.highlights ?? [], id };
}

// ---------- public (cached; refreshed on every save, and every 5 minutes for scheduled posts)

const readPublished = unstable_cache(
  async (): Promise<Post[]> => {
    try {
      const snap = await POSTS().where("status", "==", "published").get();
      return snap.docs.map((d) => toPost(d.id, d.data()));
    } catch (err) {
      console.error("Couldn't read posts:", err);
      return [];
    }
  },
  ["blog-published"],
  { tags: [TAG], revalidate: 300 }
);

/** Live posts (published, publish time reached), newest first. */
export async function getLivePosts() {
  const now = Date.now();
  return (await readPublished())
    .filter((p) => isLive(p, now))
    .sort((a, b) => String(b.publishedAt).localeCompare(String(a.publishedAt)));
}

/** A live post by slug. An older slug of a post returns { redirect } to its current one. */
export async function getLivePostBySlug(slug: string): Promise<{ post?: Post; redirect?: string }> {
  const posts = await getLivePosts();
  const post = posts.find((p) => p.slug === slug);
  if (post) return { post };
  const old = await readSlugOwner(slug);
  const moved = old ? posts.find((p) => p.id === old) : undefined;
  return moved ? { redirect: moved.slug } : {};
}

const readSlugOwner = unstable_cache(
  async (slug: string): Promise<string | null> => {
    try {
      return ((await SLUGS().doc(slug).get()).data()?.postId as string) ?? null;
    } catch {
      return null;
    }
  },
  ["blog-slug-owner"],
  { tags: [TAG], revalidate: 300 }
);

// ---------- admin (always live)

export async function listAllPosts() {
  const snap = await POSTS().get();
  return snap.docs
    .map((d) => toPost(d.id, d.data()))
    .sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)));
}

export async function getPost(id: string) {
  const d = await POSTS().doc(id).get();
  return d.exists ? toPost(d.id, d.data()!) : null;
}

/** Reserves a free slug based on `base` ("my-post", "my-post-2", ...) inside a transaction. */
async function freeSlug(tx: FirebaseFirestore.Transaction, base: string, postId: string) {
  for (let i = 1; i < 50; i++) {
    const slug = i === 1 ? base : `${base}-${i}`;
    const doc = await tx.get(SLUGS().doc(slug));
    if (!doc.exists || doc.data()?.postId === postId) return slug;
  }
  throw new Error("No free slug");
}

export async function createPost(input: { title: string; slug: string; category: Post["category"] }, by: string) {
  const db = getAdminDb();
  const ref = POSTS().doc();
  const now = new Date().toISOString();
  const slug = await db.runTransaction(async (tx) => {
    const slug = await freeSlug(tx, input.slug || "untitled", ref.id);
    const post: Omit<Post, "id"> = {
      title: input.title,
      slug,
      status: "draft",
      publishedAt: null,
      createdAt: now,
      updatedAt: now,
      updatedBy: by,
      category: input.category,
      excerpt: "",
      highlights: [],
      cover: null,
      content: EMPTY_DOC,
      seo: { title: "", description: "", focusKeyword: "", keywords: [], canonical: "", noindex: false },
      faqs: [],
      author: "coach-emma",
      wordCount: 0,
      readingMinutes: 1,
    };
    tx.set(SLUGS().doc(slug), { postId: ref.id });
    tx.create(ref, post);
    return slug;
  });
  revalidatePosts();
  return { id: ref.id, slug };
}

/**
 * Saves a post. If the slug changed, the new one is reserved (or the save fails if
 * another post holds it). A published post keeps its old slug reserved so old links
 * redirect; a draft just releases it.
 */
export async function savePost(id: string, data: Omit<Post, "id" | "createdAt" | "author">) {
  const db = getAdminDb();
  const ref = POSTS().doc(id);
  const result = await db.runTransaction(async (tx) => {
    const current = await tx.get(ref);
    if (!current.exists) return { error: "Post not found." };
    const prev = current.data() as Post;
    if (data.slug !== prev.slug) {
      const holder = await tx.get(SLUGS().doc(data.slug));
      if (holder.exists && holder.data()?.postId !== id) return { error: "Another post already uses this URL. Choose a different slug." };
      tx.set(SLUGS().doc(data.slug), { postId: id });
      if (prev.status === "draft") tx.delete(SLUGS().doc(prev.slug));
    }
    tx.update(ref, data);
    return { ok: true as const };
  });
  revalidatePosts();
  return result;
}

export async function deletePost(id: string) {
  const db = getAdminDb();
  const slugs = await SLUGS().where("postId", "==", id).get();
  const batch = db.batch();
  slugs.docs.forEach((d) => batch.delete(d.ref));
  batch.delete(POSTS().doc(id));
  await batch.commit();
  revalidatePosts();
}
