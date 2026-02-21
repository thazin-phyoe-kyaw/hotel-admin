// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server"; // Type သတ်မှတ်ရန်

// export function proxy(req: NextRequest) {
//   const token = req.cookies.get("token")?.value;
//   const { pathname } = req.nextUrl;

//   if (!token) {
//     if (pathname !== "/login") {
//       return NextResponse.redirect(new URL("/login", req.url));
//     }
//     return NextResponse.next();
//   }

//   if (pathname === "/" || pathname === "/login") {
//     return NextResponse.redirect(new URL("/admin/dashboard", req.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/", "/login", "/admin/:path*"],
// };
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  // Block admin when not logged in
  if (!token && pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Redirect logged-in users away from login page
  if (token && pathname === "/login") {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};