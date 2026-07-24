"use client";

import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  codeBlockPlugin,
  codeMirrorPlugin,
  CreateLink,
  DiffSourceToggleWrapper,
  headingsPlugin,
  imagePlugin,
  InsertCodeBlock,
  InsertImage,
  InsertTable,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  ListsToggle,
  markdownShortcutPlugin,
  MDXEditor,
  type MDXEditorMethods,
  quotePlugin,
  Separator,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  UndoRedo,
} from "@mdxeditor/editor";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

export type MarkdownEditorHandle = {
  focus: () => void;
  getMarkdown: () => string;
  insertMarkdown: (markdown: string) => void;
  setMarkdown: (markdown: string) => void;
};

type MarkdownEditorProps = {
  onChange: (value: string) => void;
  onImageUpload: (file: File) => Promise<string>;
  value: string;
};

export const MarkdownEditor = forwardRef<MarkdownEditorHandle, MarkdownEditorProps>(
  function MarkdownEditor({ onChange, onImageUpload, value }, ref) {
    const editorRef = useRef<MDXEditorMethods>(null);

    useImperativeHandle(ref, () => ({
      focus() {
        editorRef.current?.focus();
      },
      getMarkdown() {
        return editorRef.current?.getMarkdown() ?? "";
      },
      insertMarkdown(markdown: string) {
        editorRef.current?.insertMarkdown(markdown);
      },
      setMarkdown(markdown: string) {
        editorRef.current?.setMarkdown(markdown);
      },
    }));

    useEffect(() => {
      const current = editorRef.current?.getMarkdown();

      if (current !== undefined && current !== value) {
        editorRef.current?.setMarkdown(value);
      }
    }, [value]);

    return (
      <MDXEditor
        className="min-h-[560px] rounded-md bg-white"
        contentEditableClassName="min-h-[500px] max-w-none px-4 py-3 text-base leading-7"
        markdown={value}
        onChange={(markdown, initialMarkdownNormalize) => {
          if (!initialMarkdownNormalize) {
            onChange(markdown);
          }
        }}
        plugins={[
          headingsPlugin(),
          listsPlugin(),
          quotePlugin(),
          thematicBreakPlugin(),
          linkPlugin(),
          linkDialogPlugin(),
          tablePlugin(),
          codeBlockPlugin({ defaultCodeBlockLanguage: "ts" }),
          codeMirrorPlugin({
            codeBlockLanguages: {
              bash: "Bash",
              css: "CSS",
              html: "HTML",
              js: "JavaScript",
              json: "JSON",
              md: "Markdown",
              sql: "SQL",
              ts: "TypeScript",
              tsx: "TSX",
            },
          }),
          imagePlugin({
            imageUploadHandler: onImageUpload,
          }),
          markdownShortcutPlugin(),
          toolbarPlugin({
            toolbarContents: () => (
              <DiffSourceToggleWrapper>
                <UndoRedo />
                <Separator />
                <BlockTypeSelect />
                <BoldItalicUnderlineToggles />
                <ListsToggle />
                <Separator />
                <CreateLink />
                <InsertImage />
                <InsertTable />
                <InsertCodeBlock />
              </DiffSourceToggleWrapper>
            ),
          }),
        ]}
      />
    );
  },
);
