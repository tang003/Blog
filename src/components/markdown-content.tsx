"use client";

import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import { slugifyHeading, textFromReactNode } from "@/lib/markdown";

type MarkdownContentProps = {
  content: string;
};

function CodeBlock({
  children,
  ...props
}: ComponentPropsWithoutRef<"pre"> & { children?: ReactNode }) {
  const [copied, setCopied] = useState(false);
  const code = textFromReactNode(children);

  async function copyCode() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="code-block">
      <pre {...props}>{children}</pre>
      <button className="code-copy-button" onClick={copyCode} type="button">
        {copied ? "已复制" : "复制"}
      </button>
    </div>
  );
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <div className="markdown-body">
      <ReactMarkdown
        components={{
          pre(props) {
            return <CodeBlock {...props} />;
          },
          h2({ children }) {
            const text = textFromReactNode(children);
            return <h2 id={slugifyHeading(text)}>{children}</h2>;
          },
          h3({ children }) {
            const text = textFromReactNode(children);
            return <h3 id={slugifyHeading(text)}>{children}</h3>;
          },
        }}
        rehypePlugins={[rehypeHighlight]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
