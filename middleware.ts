import { createServerClient } from "@supabase/ssr"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { isPublicRoute } from "@/lib/navigation"

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          request.cookies.delete({
            name,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.delete({
            name,
            ...options,
          })
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  // List of protected routes that require authentication
  const protectedRoutes = ["/dashboard", "/faktura", "/innstillinger"]
  // Note: /om-oss is intentionally not protected as it's accessible in both logged-in and logged-out states

  // List of admin routes that require admin role
  const adminRoutes = ["/admin", "/admin/users"]

  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))
  const isAdminRoute = adminRoutes.some((route) => request.nextUrl.pathname.startsWith(route))
  const isPublic = isPublicRoute(request.nextUrl.pathname)

  // Check for test session in cookies
  const hasTestSession = request.cookies.get("hasTestSession")?.value === "true"

  // Check for session cookie
  const hasSessionCookie = request.cookies.get("session")?.value === "authenticated"

  console.log("Middleware check:", {
    path: request.nextUrl.pathname,
    isProtectedRoute,
    isAdminRoute,
    isPublic,
    hasSession: !!session,
    hasTestSession,
    hasSessionCookie,
  })

  // Handle admin routes
  if (isAdminRoute) {
    // In development with test session, allow access
    if (process.env.NODE_ENV === "development" && (hasTestSession || hasSessionCookie)) {
      return response
    }

    // Check if user is authenticated
    if (!session && !hasSessionCookie) {
      console.log("Redirecting to home - no valid session for admin route")
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = "/"
      return NextResponse.redirect(redirectUrl)
    }

    // Check if user has admin role by fetching from Supabase
    try {
      if (!session) {
        console.log("Redirecting to home - no session for admin route")
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = "/"
        return NextResponse.redirect(redirectUrl)
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single()

      if (error || !profile || profile.role !== "admin") {
        console.log("Redirecting to dashboard - user is not an admin")
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = "/dashboard"
        return NextResponse.redirect(redirectUrl)
      }
    } catch (error) {
      console.error("Error checking admin role:", error)
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = "/dashboard"
      return NextResponse.redirect(redirectUrl)
    }
  }

  // Handle protected routes
  if (isProtectedRoute && !isPublic && !session && !hasTestSession && !hasSessionCookie) {
    console.log("Redirecting to home - no valid session for protected route")
    // Redirect to login if accessing protected route without auth
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = "/"
    return NextResponse.redirect(redirectUrl)
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}

