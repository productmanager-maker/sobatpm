import { defaultProps } from "@blocknote/core";
import { createReactBlockSpec } from "@blocknote/react";
import { PdfBlockRenderer } from "./blocks/PdfBlockRenderer";
import { AudioBlockRenderer } from "./blocks/AudioBlockRenderer";
import { DrawingBlockRenderer } from "./blocks/DrawingBlockRenderer";
import { BookmarkBlockRenderer } from "./blocks/BookmarkBlockRenderer";

const BG_MAP: Record<string, string> = {
  blue: "border-blue-500 bg-blue-500/10",
  yellow: "border-yellow-500 bg-yellow-500/10",
  red: "border-red-500 bg-red-500/10",
  green: "border-green-500 bg-green-500/10",
  gray: "border-zinc-500 bg-zinc-500/10",
};

export const Callout = createReactBlockSpec(
  {
    type: "callout",
    propSchema: {
      ...defaultProps,
      emoji: { default: "💡" },
      backgroundColor: {
        default: "blue",
        values: ["blue", "yellow", "red", "green", "gray"],
      },
    },
    content: "inline",
  },
  {
    render: ({ block, contentRef }) => {
      const color = BG_MAP[block.props.backgroundColor as string] ?? BG_MAP.blue;
      return (
        <div className={`my-2 flex gap-3 rounded-md border-l-4 p-3 ${color}`}>
          <span className="select-none text-xl leading-none">{block.props.emoji}</span>
          <div ref={contentRef} className="flex-1" />
        </div>
      );
    },
  }
);

export const Toggle = createReactBlockSpec(
  {
    type: "toggle",
    propSchema: {
      ...defaultProps,
      summary: { default: "Toggle" },
    },
    content: "inline",
  },
  {
    render: ({ block, contentRef }) => (
      <details className="my-1 rounded-md py-1">
        <summary className="cursor-pointer select-none text-sm font-medium">
          {block.props.summary || "Toggle"}
        </summary>
        <div ref={contentRef} className="mt-2 pl-5" />
      </details>
    ),
  }
);

export const Pdf = createReactBlockSpec(
  {
    type: "pdf",
    propSchema: {
      url: { default: "" },
      fileName: { default: "" },
    },
    content: "none",
  },
  {
    render: ({ block, editor }) => (
      <PdfBlockRenderer
        url={block.props.url as string}
        fileName={block.props.fileName as string}
        pageId={(editor as unknown as { _pageId?: string })._pageId ?? "misc"}
        editable={editor.isEditable}
        onChange={(props) => editor.updateBlock(block, { type: "pdf", props })}
      />
    ),
  }
);

export const Audio = createReactBlockSpec(
  {
    type: "audio",
    propSchema: {
      url: { default: "" },
      duration: { default: 0 },
      fileName: { default: "" },
    },
    content: "none",
  },
  {
    render: ({ block, editor }) => (
      <AudioBlockRenderer
        url={block.props.url as string}
        duration={Number(block.props.duration) || 0}
        fileName={block.props.fileName as string}
        pageId={(editor as unknown as { _pageId?: string })._pageId ?? "misc"}
        editable={editor.isEditable}
        onChange={(props) => editor.updateBlock(block, { type: "audio", props })}
      />
    ),
  }
);

export const Drawing = createReactBlockSpec(
  {
    type: "drawing",
    propSchema: {
      storageKey: { default: "" },
      previewUrl: { default: "" },
    },
    content: "none",
  },
  {
    render: ({ block, editor }) => (
      <DrawingBlockRenderer
        storageKey={block.props.storageKey as string}
        previewUrl={block.props.previewUrl as string}
        pageId={(editor as unknown as { _pageId?: string })._pageId ?? "misc"}
        editable={editor.isEditable}
        onChange={(props) => editor.updateBlock(block, { type: "drawing", props })}
      />
    ),
  }
);

export const Bookmark = createReactBlockSpec(
  {
    type: "bookmark",
    propSchema: {
      url: { default: "" },
      title: { default: "" },
      description: { default: "" },
      favicon: { default: "" },
      coverImage: { default: "" },
    },
    content: "none",
  },
  {
    render: ({ block, editor }) => (
      <BookmarkBlockRenderer
        url={block.props.url as string}
        title={block.props.title as string}
        description={block.props.description as string}
        favicon={block.props.favicon as string}
        coverImage={block.props.coverImage as string}
        editable={editor.isEditable}
        onChange={(props) => editor.updateBlock(block, { type: "bookmark", props })}
      />
    ),
  }
);
