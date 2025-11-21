import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
  const token = request.cookies.get("auth")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  //TODO: Remove this check
  if (request.nextUrl.pathname === "/h") {
    return new NextResponse("Forbidden", { status: 403 });
  }

  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!login|signup|_next/static|_next/image).*)"], // Exclude login and signup routes
};
