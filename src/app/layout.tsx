import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Silas Blog",
  description: "A personal blog built with Next.js, PostgreSQL, Prisma, and Docker.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      lang="zh-CN"
    >
      <body className="min-h-full bg-stone-50 text-zinc-950">
        <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-5 py-6 sm:px-8">
          <header className="flex items-center justify-between border-b border-zinc-200 pb-5">
            <Link className="text-lg font-semibold tracking-tight" href="/">
              Silas Blog
            </Link>
            <nav className="flex items-center gap-5 text-sm text-zinc-600">
              <Link className="transition hover:text-zinc-950" href="/">
                文章
              </Link>
              <Link className="transition hover:text-zinc-950" href="/admin">
                后台
              </Link>
              <a className="transition hover:text-zinc-950" href="https://github.com">
                GitHub
              </a>
            </nav>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t border-zinc-200 py-6 text-sm text-zinc-500">
            Built with Next.js, PostgreSQL, Prisma, and Docker.
          </footer>
        </div>
      </body>
    </html>
  );
}
