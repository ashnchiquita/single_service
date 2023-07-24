import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "./lib/jwt";

interface AuthenticatedRequest extends NextRequest {
  user: {
    id: string;
  };
}

export async function middleware(req: NextRequest) {
  if (req.method === "OPTIONS") {
    return NextResponse.next();
  }
  console.log(`Incoming request to ${req.nextUrl.pathname}`);
  let token: string | undefined;

  if (req.cookies.has("token")) {
    token = req.cookies.get("token")?.value;
    console.log("sini cookies");
  } else if (req.headers.get("Authorization")?.startsWith("Bearer ")) {
    token = req.headers.get("Authorization")?.substring(7);
    console.log("sini bearer");
  } else if (req.headers.get("Authorization")) {
    token = req.headers.get("Authorization") || undefined;
    console.log("sini authorization");
  }

  if (
    !token &&
    (req.nextUrl.pathname.startsWith("/api/barang") ||
      req.nextUrl.pathname.startsWith("/api/perusahaan") ||
      req.nextUrl.pathname.startsWith("/api/self"))
  ) {
    console.log("Unauthorized 1");
    return NextResponse.json({ status: "error", message: "Unauthorized", data: null }, { status: 401 });
  }

  const res = NextResponse.next();

  try {
    if (token) {
      const { sub } = await verifyJWT<{ sub: string }>(token);
      res.headers.set("X-USER-ID", sub);
      (req as AuthenticatedRequest).user = { id: sub };
    } else {
      console.log("Unauthorized 2");
    }
  } catch (err) {
    console.log("Unauthorized 3");
    console.error(err);
    return NextResponse.json({ status: "error", message: "Unauthorized", data: null, err: err }, { status: 401 });
  }

  const authUser = (req as AuthenticatedRequest).user;

  if (!authUser) {
    console.log("Unauthorized 4");
    return NextResponse.json({ status: "error", message: "Unauthorized", data: null }, { status: 401 });
  }

  console.log(`User ${authUser.id} authenticated`);
  return res;
}

export const config = {
  matcher: ["/api/barang/:path*", "/api/perusahaan/:path*", "/api/self"],
};
