import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signJWT } from "@/lib/jwt";
import { compare } from "bcryptjs";
import { LoginReq, LoginReqInput } from "@/lib/validation";
import { getResponse } from "@/lib/response";
import { ZodError } from "zod";

export async function POST(req: NextRequest) {
  try {
    const data = LoginReq.parse((await req.json()) as LoginReqInput);
    const user = await prisma.admin.findUnique({
      where: {
        username: data.username,
      },
    });

    if (!user || !(await compare(data.password, user.password))) {
      return NextResponse.json(
        getResponse(false, "Invalid credentials", null),
        { status: 401 }
      );
    }

    const exp = process.env.JWT_EXPIRATION_TIME || "500000000";

    const token = await signJWT({ sub: user.id }, { expiresIn: `${exp}m` });
    const expInSec = parseInt(exp) * 60;
    const cookie = {
      name: "token",
      value: token,
      httpOnly: true,
      maxAge: expInSec,
      path: "/",
      secure: process.env.NODE_ENV === "production",
    };

    const response = NextResponse.json(
      getResponse(true, "Login success", {
        user: {
          username: user.username,
          name: user.name,
        },
        token,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    await Promise.all([
      response.cookies.set(cookie),
      response.cookies.set({
        name: "authorized",
        value: "true",
        maxAge: expInSec,
      }),
    ]);

    return response;
  } catch (err) {
    console.error(err);
    if (err instanceof ZodError) {
      return NextResponse.json(
        getResponse(false, "Zod validations failed", null),
        { status: 400 }
      );
    }
    return NextResponse.json(
      getResponse(false, "Internal server error", null),
      { status: 500 }
    );
  }
}
