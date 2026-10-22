"use client";

import MediaBrowser from "@/components/admin/media/MediaBrowser";

export default function AdminMediaPage() {
  return (
    <section className="py-8">
      <div className="px-4 sm:px-6">
        <p className="text-xs font-bold uppercase tracking-widest text-brand-500">Blog</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">Media</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Images for articles. Each one has alt text, a caption and a photo credit, filled in automatically when you insert it.
        </p>
        <div className="mt-6">
          <MediaBrowser mode="manage" />
        </div>
      </div>
    </section>
  );
}
