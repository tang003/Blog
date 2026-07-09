import type { TocItem } from "@/lib/markdown";

type TableOfContentsProps = {
  items: TocItem[];
};

export function TableOfContents({ items }: TableOfContentsProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="文章目录"
      className="rounded-lg border border-zinc-200 bg-white p-5 text-sm"
    >
      <h2 className="font-semibold tracking-tight text-zinc-950">文章目录</h2>
      <ol className="mt-4 grid gap-2">
        {items.map((item) => (
          <li className={item.level === 3 ? "pl-4" : undefined} key={item.id}>
            <a className="text-zinc-600 transition hover:text-teal-700" href={`#${item.id}`}>
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
