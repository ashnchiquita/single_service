import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "./lib/jwt";

interface AuthenticatedRequest extends NextRequest {
  user: {
    id: string;
  };
}

export async function middleware(req: NextRequest) {
  console.log(`Incoming request to ${req.nextUrl.pathname}`);
  let token: string | undefined;

  if (req.cookies.has("token")) {
    token = req.cookies.get("token")?.value;
  } else if (req.headers.get("Authorization")?.startsWith("Bearer ")) {
    token = req.headers.get("Authorization")?.substring(7);
  }

  if (
    !token &&
    (req.nextUrl.pathname.startsWith("/api/barang") ||
      req.nextUrl.pathname.startsWith("/api/perusahaan") ||
      req.nextUrl.pathname.startsWith("/api/self"))
  ) {
    return NextResponse.json({ status: "error", message: "Unauthorized", data: null }, { status: 401 });
  }

  const res = NextResponse.next();

  try {
    if (token) {
      const { sub } = await verifyJWT<{ sub: string }>(token);
      res.headers.set("X-USER-ID", sub);
      (req as AuthenticatedRequest).user = { id: sub };
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ status: "error", message: "Unauthorized", data: null }, { status: 401 });
  }

  const authUser = (req as AuthenticatedRequest).user;

  if (!authUser) {
    return NextResponse.json({ status: "error", message: "Unauthorized", data: null }, { status: 401 });
  }

  console.log(`User ${authUser.id} authenticated`);
  return res;
}

export const config = {
  matcher: ["/api/barang/:path*", "/api/perusahaan/:path*", "/api/self"],
};
