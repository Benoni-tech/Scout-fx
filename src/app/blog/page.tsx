import BlogIndex from "@/components/blog/BlogIndex";
import { getLivePosts } from "@/lib/posts";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Blog",
  description: "Plain-English lessons on forex, gold, charts and risk from Coach Emma, written for traders in Ghana.",
  path: "/blog",
});

export default async function BlogPage() {
  const posts = await getLivePosts();
  return (
    <BlogIndex
      posts={posts}
      all={posts}
      heading="Learn the market properly"
      subheading="Plain-English lessons on forex, gold, charts and risk, written for traders in Ghana."
    />
  );
}
