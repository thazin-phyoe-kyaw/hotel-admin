
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

  // No token → only allow login page
  if (!token) {
    if (pathname !== "/login") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  // Has token → prevent visiting / or /login
  if (token && (pathname === "/" || pathname === "/login")) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/admin/:path*"],
};