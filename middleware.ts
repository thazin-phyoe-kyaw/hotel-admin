import { NextResponse } from "next/server";
import { verifyRefreshToken } from "./app/lib/auth/token";


export function middleware(req: Request) {
  // const refreshToken = req.headers.get("cookie")?.match(/refresh_token=([^;]+)/)?.[1];

  // if (!refreshToken) return NextResponse.redirect(new URL("/login", req.url));

  // const valid = verifyRefreshToken(refreshToken);
  // if (!valid) return NextResponse.redirect(new URL("/login", req.url));

  // return NextResponse.next();
}

export const config = {
  // matcher: ["/dashboard/:path*", "/rooms/:path*", "/bookings/:path*"],
};
