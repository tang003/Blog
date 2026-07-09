import type { ReactNode } from "react";

export type TocItem = {
  id: string;
  level: 2 | 3;
  text: string;
};

export function slugifyHeading(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function textFromReactNode(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(textFromReactNode).join("");
  }

  if (node && typeof node === "object" && "props" in node) {
    const maybeProps = node as { props?: { children?: ReactNode } };
    return textFromReactNode(maybeProps.props?.children);
  }

  return "";
}

export function extractToc(content: string): TocItem[] {
  const used = new Map<string, number>();

  return content
    .split(/\r?\n/)
    .map((line) => {
      const match = /^(##|###)\s+(.+)$/.exec(line.trim());

      if (!match) {
        return null;
      }

      const text = match[2].replace(/[#*_`[\]()]/g, "").trim();
      const baseId = slugifyHeading(text);
      const count = used.get(baseId) ?? 0;
      used.set(baseId, count + 1);

      return {
        id: count === 0 ? baseId : `${baseId}-${count + 1}`,
        level: match[1] === "##" ? 2 : 3,
        text,
      } satisfies TocItem;
    })
    .filter((item): item is TocItem => Boolean(item));
}
