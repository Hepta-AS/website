import { createServerClient } from "@supabase/ssr"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { isPublicRoute } from "@/lib/navigation"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  console.log(`[Middleware] Received request for: ${pathname}`)

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
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          request.cookies.delete({ name, ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.delete({ name, ...options })
        },
      },
    }
  )

  console.log("[Middleware] Checking for Supabase session...")
  const { data: { session } } = await supabase.auth.getSession()
  
  const isPublic = isPublicRoute(pathname)
  const protectedRoutes = ["/dashboard", "/faktura", "/innstillinger"]
  const adminRoutes = ["/admin", "/admin/users"]
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route))

  console.log("[Middleware] Route analysis:", {
    path: pathname,
    isPublic,
    isProtectedRoute,
    isAdminRoute,
    hasSession: !!session,
  })

  if (isAdminRoute) {
    console.log(`[Middleware] Path ${pathname} is an admin route. Checking permissions...`)
    if (!session) {
      console.log("[Middleware] No session found. Redirecting unauthenticated user to '/' from admin route.")
      return NextResponse.redirect(new URL("/", request.url))
    }

    console.log("[Middleware] Session found. Checking user role from 'profiles' table for user:", session.user.id)
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", session.user.id)
      .single()

    if (error) {
      console.error("[Middleware] Error fetching profile for admin check:", error)
      console.log("[Middleware] Redirecting to '/dashboard' due to profile fetch error.")
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
    
    if (profile?.role !== "admin") {
      console.log(`[Middleware] User is not an admin (role: ${profile?.role}). Redirecting to '/dashboard'.`)
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    console.log("[Middleware] User is an admin. Allowing access to admin route.")
  }

  if (isProtectedRoute && !session) {
    console.log(`[Middleware] Path ${pathname} is protected and user is not authenticated. Redirecting to '/'.`)
    return NextResponse.redirect(new URL("/", request.url))
  }

  console.log(`[Middleware] Allowing access to: ${pathname}`)
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

