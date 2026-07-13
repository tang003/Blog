import type { Metadata } from "next";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { site } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.name,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: site.name,
    description: site.description,
    siteName: site.name,
    type: "website",
    url: site.url,
    images: [{ url: "/opengraph-image" }],
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.description,
    images: ["/opengraph-image"],
  },
  alternates: {
    canonical: site.url,
    types: {
      "application/rss+xml": `${site.url}/rss.xml`,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="h-full antialiased" lang="zh-CN">
      <body className="min-h-full bg-stone-50 text-zinc-950">
        <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-5 py-6 sm:px-8">
          <header className="flex flex-col gap-4 border-b border-zinc-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <Link className="text-lg font-semibold tracking-tight" href="/">
              Silas Blog
            </Link>
            <nav className="flex flex-wrap items-center gap-5 text-sm text-zinc-600">
              <Link className="transition hover:text-zinc-950" href="/">
                文章
              </Link>
              <Link className="transition hover:text-zinc-950" href="/search">
                搜索
              </Link>
              <Link className="transition hover:text-zinc-950" href="/archive">
                归档
              </Link>
              <Link className="transition hover:text-zinc-950" href="/ask">
                AI 检索
              </Link>
              <Link className="transition hover:text-zinc-950" href="/about">
                关于
              </Link>
              <a className="transition hover:text-zinc-950" href="https://github.com">
                GitHub
              </a>
              <ThemeToggle />
            </nav>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t border-zinc-200 py-6 text-sm text-zinc-500">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <span>Built with Next.js, PostgreSQL, Prisma, and Docker.</span>
              <a className="font-medium text-teal-700 hover:text-teal-900" href="/rss.xml">
                RSS
              </a>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
