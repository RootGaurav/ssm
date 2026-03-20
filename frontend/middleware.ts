import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose" 

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value
  const path = request.nextUrl.pathname

  let role: string | null = null

  // decode token if present using jose
  if (token) {
    try {
      const secretString = process.env.JWT_SECRET
      
      if (!secretString) {
        throw new Error("JWT_SECRET is missing from environment variables.")
      }

      const secret = new TextEncoder().encode(secretString)
      const { payload } = await jwtVerify(token, secret)
      role = payload.role as string
    } catch (err) {
      console.error("Middleware JWT Error:", err)
      role = null // If token is invalid, treat as logged out
    }
  }

  // -------- Redirect logged-in users away from login pages --------

  if (token && (path === "/login" || path === "/admin/login")) {
    if (role === "admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url))
    }
    // Assume any non-admin valid token belongs to a resident
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // -------- Protect admin routes --------

  if (path.startsWith("/admin") && path !== "/admin/login") {
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }

    // Boot non-admins back to resident dashboard
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  // -------- Protect resident routes --------

  if (path === "/dashboard" || path === "/pay-now" || path=== "/profile" || path==="/subscriptions") {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    // THE FIX: Boot admins out of the resident dashboard
    if (role === "admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/:path*",
    "/dashboard",
    "/pay-now",
    "/profile",
    "/subscriptions",
  ]
}
