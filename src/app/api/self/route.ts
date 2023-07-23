import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const id = req.headers.get("X-USER-ID");

  if (!id) {
    return NextResponse.json({ status: "error", message: "Unauthorized", data: null }, { status: 401 });
  }

  const user = await prisma.admin.findUnique({
    where: {
      id: id,
    }
  });

  if (!user) {
    return NextResponse.json({ status: "error", message: "User not found", data: null }, { status: 401 });
  }

  return NextResponse.json({
    status: "success",
    message: "Self successfully fetched",
    data: {
      username: user.username,
      name: user.name,
    }
  });
}
