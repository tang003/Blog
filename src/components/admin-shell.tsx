import Link from "next/link";
import type { ReactNode } from "react";
import { getAdminPath } from "@/lib/admin-path";

type AdminShellProps = {
  actions?: ReactNode;
  children: ReactNode;
  description?: string;
  eyebrow?: string;
  title: string;
};

const navItems = [
  { href: getAdminPath(), label: "文章" },
  { href: getAdminPath("/new"), label: "新建" },
  { href: getAdminPath("/comments"), label: "评论" },
  { href: getAdminPath("/stats"), label: "统计" },
  { href: "/", label: "前台" },
];

export function AdminShell({
  actions,
  children,
  description,
  eyebrow = "Studio",
  title,
}: AdminShellProps) {
  return (
    <div className="py-10">
      <div className="mb-8 rounded-lg border border-zinc-200 bg-white p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase text-teal-700">{eyebrow}</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              {title}
            </h1>
            {description ? (
              <p className="mt-3 max-w-2xl leading-7 text-zinc-600">{description}</p>
            ) : null}
          </div>
          {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
        </div>
        <nav className="mt-6 flex flex-wrap gap-2 border-t border-zinc-200 pt-4 text-sm">
          {navItems.map((item) => (
            <Link
              className="rounded-md border border-zinc-200 px-3 py-2 font-medium text-zinc-700 transition hover:border-teal-300 hover:bg-teal-50 hover:text-teal-800"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      {children}
    </div>
  );
}
