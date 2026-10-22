"use client";

import { useEffect, useRef, useState } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { ArticleImage } from "@/components/admin/blog/ImageNode";
import type { PickedImage } from "@/components/admin/media/MediaBrowser";
import { MEDIA_LIMITS } from "@/lib/mediaTypes";
import Youtube from "@tiptap/extension-youtube";
import { TableKit } from "@tiptap/extension-table";
import { Placeholder, CharacterCount } from "@tiptap/extensions";
import {
  Bold, Italic, Underline, Strikethrough, Heading2, Heading3, List, ListOrdered, Quote, Link2,
  ImagePlus, Youtube as YoutubeIcon, Table as TableIcon, Minus, Undo2, Redo2,
  Rows3, Columns3, Trash2,
} from "lucide-react";
import type { ContentNode } from "@/lib/blog";

export type EditorStats = { words: number };

function Btn({
  onClick, active, disabled, title, children,
}: { onClick: () => void; active?: boolean; disabled?: boolean; title: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      disabled={disabled}
      className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors disabled:opacity-30 ${
        active ? "bg-brand-500 text-black" : "text-zinc-300 hover:bg-white/10 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

const Sep = () => <span className="mx-1 h-5 w-px bg-white/10" />;

function Toolbar({ editor, onImage }: { editor: Editor; onImage: () => void }) {
  const c = () => editor.chain().focus();
  const inTable = editor.isActive("table");

  function setLink() {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL (https://… or /blog/…). Leave empty to remove the link.", prev ?? "https://");
    if (url === null) return;
    if (!url.trim() || url.trim() === "https://") return c().extendMarkRange("link").unsetLink().run();
    c().extendMarkRange("link").setLink({ href: url.trim() }).run();
  }

  function addYoutube() {
    const url = window.prompt("Paste a YouTube link");
    if (url) c().setYoutubeVideo({ src: url.trim() }).run();
  }

  return (
    // Pinned just below the editor's save bar while scrolling; --editor-bar is that bar's
    // measured height (set by PostEditor), so the toolbar never covers the text.
    <div className="sticky top-[var(--editor-bar,0px)] z-20 flex flex-wrap items-center gap-0.5 rounded-t-2xl border-b border-white/10 bg-zinc-950 px-2 py-2">
      <Btn title="Undo" onClick={() => c().undo().run()} disabled={!editor.can().undo()}><Undo2 className="h-4 w-4" /></Btn>
      <Btn title="Redo" onClick={() => c().redo().run()} disabled={!editor.can().redo()}><Redo2 className="h-4 w-4" /></Btn>
      <Sep />
      <Btn title="Heading" active={editor.isActive("heading", { level: 2 })} onClick={() => c().toggleHeading({ level: 2 }).run()}><Heading2 className="h-4 w-4" /></Btn>
      <Btn title="Subheading" active={editor.isActive("heading", { level: 3 })} onClick={() => c().toggleHeading({ level: 3 }).run()}><Heading3 className="h-4 w-4" /></Btn>
      <Sep />
      <Btn title="Bold" active={editor.isActive("bold")} onClick={() => c().toggleBold().run()}><Bold className="h-4 w-4" /></Btn>
      <Btn title="Italic" active={editor.isActive("italic")} onClick={() => c().toggleItalic().run()}><Italic className="h-4 w-4" /></Btn>
      <Btn title="Underline" active={editor.isActive("underline")} onClick={() => c().toggleUnderline().run()}><Underline className="h-4 w-4" /></Btn>
      <Btn title="Strikethrough" active={editor.isActive("strike")} onClick={() => c().toggleStrike().run()}><Strikethrough className="h-4 w-4" /></Btn>
      <Sep />
      <Btn title="Bullet list" active={editor.isActive("bulletList")} onClick={() => c().toggleBulletList().run()}><List className="h-4 w-4" /></Btn>
      <Btn title="Numbered list" active={editor.isActive("orderedList")} onClick={() => c().toggleOrderedList().run()}><ListOrdered className="h-4 w-4" /></Btn>
      <Btn title="Quote" active={editor.isActive("blockquote")} onClick={() => c().toggleBlockquote().run()}><Quote className="h-4 w-4" /></Btn>
      <Btn title="Divider" onClick={() => c().setHorizontalRule().run()}><Minus className="h-4 w-4" /></Btn>
      <Sep />
      <Btn title="Link" active={editor.isActive("link")} onClick={setLink}><Link2 className="h-4 w-4" /></Btn>
      <Btn title={editor.isActive("image") ? "Edit image" : "Insert image"} active={editor.isActive("image")} onClick={onImage}>
        <ImagePlus className="h-4 w-4" />
      </Btn>
      <Btn title="YouTube video" onClick={addYoutube}><YoutubeIcon className="h-4 w-4" /></Btn>
      <Btn title="Insert table" onClick={() => c().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}><TableIcon className="h-4 w-4" /></Btn>
      {inTable && (
        <>
          <Sep />
          <Btn title="Add row" onClick={() => c().addRowAfter().run()}><Rows3 className="h-4 w-4" /></Btn>
          <Btn title="Add column" onClick={() => c().addColumnAfter().run()}><Columns3 className="h-4 w-4" /></Btn>
          <Btn title="Delete table" onClick={() => c().deleteTable().run()}><Trash2 className="h-4 w-4" /></Btn>
        </>
      )}
    </div>
  );
}

/**
 * The article body editor. Content goes in and out as Tiptap JSON; the server
 * cleans it again before saving, so nothing pasted here can reach the site raw.
 */
export default function RichEditor({
  initial,
  onChange,
  pickImage,
}: {
  initial: ContentNode;
  onChange: (doc: ContentNode, stats: EditorStats) => void;
  /** Opens the media library; resolves with the chosen image (or null if closed). */
  pickImage: () => Promise<PickedImage | null>;
}) {
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
        link: { openOnClick: false, autolink: true, defaultProtocol: "https", HTMLAttributes: { rel: "noopener noreferrer" } },
      }),
      ArticleImage,
      Youtube.configure({ nocookie: true, controls: true, width: 640, height: 360 }),
      TableKit.configure({ table: { resizable: false } }),
      Placeholder.configure({ placeholder: "Start writing… Use the toolbar for headings, lists, links and images." }),
      CharacterCount,
    ],
    content: initial,
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none min-h-[420px] px-6 py-5 focus:outline-none prose-headings:text-white prose-a:text-brand-500 prose-blockquote:border-l-brand-500 prose-li:marker:text-brand-500",
      },
    },
    onUpdate: ({ editor }) =>
      onChangeRef.current(editor.getJSON() as ContentNode, { words: editor.storage.characterCount.words() }),
  });

  // report the starting word count once the editor is ready
  useEffect(() => {
    if (editor) onChangeRef.current(editor.getJSON() as ContentNode, { words: editor.storage.characterCount.words() });
  }, [editor]);

  const [editing, setEditing] = useState<{ alt: string; caption: string; credit: string } | null>(null);

  async function onImage() {
    if (!editor) return;
    if (editor.isActive("image")) {
      const a = editor.getAttributes("image");
      return setEditing({ alt: a.alt ?? "", caption: a.caption ?? "", credit: a.credit ?? "" });
    }
    const img = await pickImage();
    if (!img) return;
    editor
      .chain()
      .focus()
      .insertContent({ type: "image", attrs: { src: img.url, alt: img.alt, caption: img.caption || null, credit: img.credit || null } })
      .run();
  }

  async function replaceImage() {
    const img = await pickImage();
    if (!img || !editor) return;
    editor.chain().focus().updateAttributes("image", { src: img.url, alt: img.alt, caption: img.caption || null, credit: img.credit || null }).run();
    setEditing(null);
  }

  if (!editor) return <div className="min-h-[460px] animate-pulse rounded-2xl border border-white/10 bg-white/[0.02]" />;

  return (
    // No overflow-hidden here: it would make the sticky toolbar stick inside this box.
    <div className="rounded-2xl border border-white/10 bg-black/40">
      <Toolbar editor={editor} onImage={onImage} />
      <EditorContent editor={editor} />
      {editing && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 p-4" role="dialog" aria-modal="true" aria-label="Edit image">
          <div className="w-full max-w-md space-y-3 rounded-2xl border border-white/10 bg-zinc-950 p-5">
            <p className="text-sm font-bold text-white">Edit image</p>
            {(["alt", "caption", "credit"] as const).map((k) => (
              <label key={k} className="block">
                <span className="mb-1 block text-xs font-semibold text-zinc-300">
                  {k === "alt" ? "Alt text (describe the image)" : k === "caption" ? "Caption" : "Photo credit"}
                </span>
                <input
                  value={editing[k]}
                  maxLength={MEDIA_LIMITS[k]}
                  onChange={(e) => setEditing({ ...editing, [k]: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none"
                />
              </label>
            ))}
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().updateAttributes("image", {
                    alt: editing.alt.trim(),
                    caption: editing.caption.trim() || null,
                    credit: editing.credit.trim() || null,
                  }).run();
                  setEditing(null);
                }}
                className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-black"
              >
                Save
              </button>
              <button type="button" onClick={replaceImage} className="rounded-full border border-white/15 px-4 py-2 text-sm text-white hover:bg-white/5">
                Replace image
              </button>
              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().deleteSelection().run();
                  setEditing(null);
                }}
                className="rounded-full px-3 py-2 text-sm text-zinc-400 hover:text-danger"
              >
                Remove
              </button>
              <button type="button" onClick={() => setEditing(null)} className="ml-auto rounded-full px-3 py-2 text-sm text-zinc-400 hover:text-white">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
