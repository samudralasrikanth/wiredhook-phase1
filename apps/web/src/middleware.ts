import { NextResponse, type NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // Placeholder: protect /dashboard and /task/* later when auth wired
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/task/:path*"],
};


