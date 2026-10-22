"use client";

import Image from "@tiptap/extension-image";
import { NodeViewWrapper, ReactNodeViewRenderer, type NodeViewProps } from "@tiptap/react";
import { captionLine } from "@/lib/mediaTypes";

/** How an article image looks in the editor: the picture with its caption line underneath. */
function ImageView({ node, selected }: NodeViewProps) {
  const line = captionLine(node.attrs.caption, node.attrs.credit);
  return (
    <NodeViewWrapper as="figure" className="my-6" data-drag-handle>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={node.attrs.src}
        alt={node.attrs.alt ?? ""}
        className={`w-full rounded-xl border ${selected ? "border-brand-500 ring-2 ring-brand-500/40" : "border-white/10"}`}
      />
      {line ? (
        <figcaption className="mt-2 text-sm text-zinc-500">{line}</figcaption>
      ) : (
        <figcaption className="mt-2 text-xs italic text-zinc-600">No caption. Select the image and use "Edit image" to add one.</figcaption>
      )}
    </NodeViewWrapper>
  );
}

/** Tiptap image with caption and photo-credit attributes. */
export const ArticleImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      caption: { default: null },
      credit: { default: null },
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer(ImageView);
  },
});
