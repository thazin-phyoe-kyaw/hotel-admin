import { NextResponse } from "next/server";

export function middleware(req: {
  cookies: { get: (arg0: string) => { (): any; new (): any; value: any } };
  url: string | URL | undefined;
}) {
  const token = req.cookies.get("token")?.value;
  const urlObj = typeof req.url === "string" ? new URL(req.url) : req.url;
  const pathname = urlObj ? urlObj.pathname : "/";

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  if (token && pathname === "/") {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  // If logged in and tries to access /login → send to dashboard
  if (token && pathname === "/login") {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/admin/:path*"],
};
