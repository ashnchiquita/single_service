import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getResponse } from "@/lib/response";

export async function OPTIONS(req: NextRequest) {
  return NextResponse.json(null, { status: 200 });
}

export async function GET(req: NextRequest) {
  const id = req.headers.get("X-USER-ID");

  if (!id) {
    return NextResponse.json(getResponse(false, "Unauthorized", null), {
      status: 401,
    });
  }

  const user = await prisma.admin.findUnique({
    where: {
      id: id,
    },
  });

  if (!user) {
    return NextResponse.json(getResponse(false, "User not found", null), {
      status: 401,
    });
  }

  return NextResponse.json(
    getResponse(true, "User successfully fetched", {
      username: user.username,
      name: user.name,
    })
  );
}
