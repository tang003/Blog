import { NextResponse, type NextRequest } from "next/server";

function normalizePath(value: string | undefined, fallback: string) {
  const trimmed = value?.trim();

  if (!trimmed) {
    return fallback;
  }

  const withSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return withSlash.replace(/\/+$/, "") || fallback;
}

function matches(pathname: string, base: string) {
  return pathname === base || pathname.startsWith(`${base}/`);
}

export function middleware(request: NextRequest) {
  const adminPath = normalizePath(process.env.ADMIN_PATH, "/tang");
  const adminApiPath = normalizePath(process.env.ADMIN_API_PATH, "/studio-api");
  const { pathname } = request.nextUrl;

  if (matches(pathname, adminPath)) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(adminPath, "/admin") || "/admin";
    const response = NextResponse.rewrite(url);
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    return response;
  }

  if (matches(pathname, adminApiPath)) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(adminApiPath, "/api/admin") || "/api/admin";
    const response = NextResponse.rewrite(url);
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    return response;
  }

  if (matches(pathname, "/admin") || matches(pathname, "/api/admin")) {
    return new NextResponse("Not found", {
      status: 404,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
