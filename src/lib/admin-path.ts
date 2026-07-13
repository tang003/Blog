const DEFAULT_ADMIN_PATH = "/studio";
const DEFAULT_ADMIN_API_PATH = "/studio-api";

function normalizePath(value: string | undefined, fallback: string) {
  const trimmed = value?.trim();

  if (!trimmed) {
    return fallback;
  }

  const withSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return withSlash.replace(/\/+$/, "") || fallback;
}

export function getAdminPath(path = "") {
  return `${normalizePath(process.env.ADMIN_PATH, DEFAULT_ADMIN_PATH)}${path}`;
}

export function getAdminApiPath(path = "") {
  return `${normalizePath(
    process.env.ADMIN_API_PATH ?? process.env.NEXT_PUBLIC_ADMIN_API_PATH,
    DEFAULT_ADMIN_API_PATH,
  )}${path}`;
}

export function getPublicAdminApiPath(path = "") {
  return `${normalizePath(process.env.NEXT_PUBLIC_ADMIN_API_PATH, DEFAULT_ADMIN_API_PATH)}${path}`;
}
