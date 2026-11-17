import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function proxy(request) {
    const role = request.nextauth.token?.role;
    const path = request.nextUrl.pathname;
    const isAdminOnly =
      path === "/equipment/new" || /^\/equipment\/[^/]+\/edit$/.test(path);

    if (isAdminOnly && role !== "admin") {
      return NextResponse.redirect(new URL("/equipment", request.url));
    }

    if (path === "/rentals/new" && role !== "member") {
      return NextResponse.redirect(new URL("/rentals", request.url));
    }

    return NextResponse.next();
  },
  {
    pages: { signIn: "/signin" },
  }
);

export const config = {
  matcher: ["/rentals/:path*", "/equipment/new", "/equipment/:id/edit"],
};
