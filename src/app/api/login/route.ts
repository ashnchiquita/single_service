import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signJWT } from "@/lib/jwt";
import { compare } from "bcryptjs";
import { LoginReq, LoginReqInput } from "@/lib/validation";

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
      { status: "error", message: "Invalid credentials", data: null },
      { status: 401 }
    );
    }

    const exp = process.env.JWT_EXPIRATION_TIME;

    const token = await signJWT({ sub: user.id }, { expiresIn: `${exp}m` });

    if (!exp) {
      return NextResponse.json(
        { message: "JWT_EXPIRATION_TIME not set" },
        { status: 500 }
      );
    }

    const expInSec = parseInt(exp) * 60;
    const cookie = {
      name: "token",
      value: token,
      httpOnly: true,
      maxAge: expInSec,
      path: "/",
      secure: process.env.NODE_ENV === "production",
    };

    const response = new NextResponse(
      JSON.stringify({
        status: "success",
        message: "Login success",
        data: {
          user: {
            username: user.username,
            name: user.name,
          },
          token,
        },
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
    return NextResponse.json(
      { status: "error", message: "Login failed", data: null },
      { status: 401 }
    );
  }
}
