import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function middleware(req: NextRequest) {
  // For Phase 1, we'll allow access but can add auth checks later
  // When auth is fully implemented, check session here
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  );

  // Check if user is authenticated (optional for Phase 1)
  // For now, allow all access but structure is ready for auth
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/task/:path*"],
};


