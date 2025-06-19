export function isPublicRoute(pathname: string): boolean {
  // Public pages that do not require authentication
  const publicPages = ["/", "/om-oss", "/tjenester", "/privacy", "/terms", "/contact"];
  if (publicPages.includes(pathname)) {
    return true;
  }

  // Assets and API routes that should be ignored by authentication checks
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|css|js|webmanifest)$/i)
  ) {
    return true;
  }

  return false;
}

