import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "./lib/jwt";

export async function middleware(req: NextRequest) {
  if (req.method === "OPTIONS") {
    return NextResponse.next();
  }
  console.log(`Incoming request to ${req.nextUrl.pathname}`);
  let token: string | undefined;

  if (req.cookies.has("token")) {
    token = req.cookies.get("token")?.value;
    console.log("Token from cookies");
  } else if (req.headers.get("Authorization")?.startsWith("Bearer ")) {
    token = req.headers.get("Authorization")?.substring(7);
    console.log("Token from bearer");
  } else if (req.headers.get("Authorization")) {
    token = req.headers.get("Authorization") || undefined;
    console.log("Token from authorization");
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
      const sub = await verifyJWT(token);
      res.headers.set("X-USER-ID", sub);
      console.log(`User SUB: ${sub} authenticated`);
    } else {
      console.log("Unauthorized 2");
    }
  } catch (err) {
    console.log("Unauthorized 3");
    console.error(err);
    return NextResponse.json({ status: "error", message: "Unauthorized", data: null, err: err }, { status: 401 });
  }
  return res;
}

export const config = {
  matcher: ["/api/barang/:path*", "/api/perusahaan/:path*", "/api/self"],
};
