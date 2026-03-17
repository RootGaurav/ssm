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

  if (path.startsWith("/dashboard")) {
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
    "/login",
    "/admin/login"
  ]
}

// import { NextResponse } from "next/server"
// import type { NextRequest } from "next/server"
// import { jwtVerify } from "jose" // <-- Must use jose, not jsonwebtoken

// export async function middleware(request: NextRequest) {
//   const token = request.cookies.get("token")?.value
//   const path = request.nextUrl.pathname

//   let role: string | null = null

//   // decode token if present using jose
//   if (token) {
//     try {
//       const secretString = process.env.JWT_SECRET
      
//       // Safety check to prevent the Zero-length key error
//       if (!secretString) {
//         throw new Error("JWT_SECRET is missing from environment variables.")
//       }

//       const secret = new TextEncoder().encode(secretString)
//       const { payload } = await jwtVerify(token, secret)
//       role = payload.role as string
//     } catch (err) {
//       console.error("Middleware JWT Error:", err)
//       role = null
//     }
//   }

//   // -------- Redirect logged-in users away from login pages --------

//   if (token && path === "/login") {
//     if (role === "admin") {
//       return NextResponse.redirect(new URL("/admin/dashboard", request.url))
//     }
//     return NextResponse.redirect(new URL("/dashboard", request.url))
//   }

//   if (token && path === "/admin/login") {
//     if (role === "admin") {
//       return NextResponse.redirect(new URL("/admin/dashboard", request.url))
//     }
//     return NextResponse.redirect(new URL("/dashboard", request.url))
//   }

//   // -------- Protect admin routes --------

//   if (path.startsWith("/admin") && path !== "/admin/login") {
//     if (!token) {
//       return NextResponse.redirect(new URL("/admin/login", request.url))
//     }

//     // allow only admin role
//     if (role !== "admin") {
//       return NextResponse.redirect(new URL("/dashboard", request.url))
//     }
//   }

//   // -------- Protect resident routes --------

//   if (path.startsWith("/dashboard")) {
//     if (!token) {
//       return NextResponse.redirect(new URL("/login", request.url))
//     }
//   }

//   return NextResponse.next()
// }

// export const config = {
//   matcher: [
//     "/admin/:path*",
//     "/dashboard/:path*",
//     "/login",
//     "/admin/login"
//   ]
// }
// import { NextResponse } from "next/server"
// import type { NextRequest } from "next/server"
// import jwt from "jsonwebtoken"

// export function middleware(request: NextRequest) {

//   const token = request.cookies.get("token")?.value
//   const path = request.nextUrl.pathname

//   let role: string | null = null

//   // decode token if present
//   if (token) {
//     try {
//       const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string)
//       role = decoded.role
//     } catch (err) {
//       role = null
//     }
//   }

//   // -------- Redirect logged-in users away from login pages --------

//   if (token && path === "/login") {
//     return NextResponse.redirect(new URL("/dashboard", request.url))
//   }

//   if (token && role === "admin" && path === "/admin/login") {
//   return NextResponse.redirect(new URL("/admin/dashboard", request.url))
// }

//   // -------- Protect admin routes --------

//   if (path.startsWith("/admin") && path !== "/admin/login") {

//     if (!token) {
//       return NextResponse.redirect(
//         new URL("/admin/login", request.url)
//       )
//     }

//     // allow only admin role
//     if (role !== "admin") {
//       return NextResponse.redirect(
//         new URL("/dashboard", request.url)
//       )
//     }

//   }

//   // -------- Protect resident routes --------

//   if (path.startsWith("/dashboard")) {

//     if (!token) {
//       return NextResponse.redirect(
//         new URL("/login", request.url)
//       )
//     }

//   }

//   return NextResponse.next()
// }

// export const config = {
//   matcher: [
//     "/admin/:path*",
//     "/dashboard/:path*",
//     "/login",
//     "/admin/login"
//   ]
// }