import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PerusahaanQuery, PerusahaanQueryInput, PerusahaanReq, PerusahaanReqInput } from "@/lib/validation";
import { getResponse } from "@/lib/response";
import { ZodError } from "zod";

export async function GET(req: NextRequest) {
  try {
    const query = PerusahaanQuery.parse(({
      q: req.nextUrl.searchParams.get("q"),
    }) as PerusahaanQueryInput);

    const perusahaan = await prisma.perusahaan.findMany({
      where: {
        OR: [
          {
            nama: {
              contains: query.q,
              mode: "insensitive",
            },
          },
          {
            kode: {
              contains: query.q,
            },
          },
        ],
      },

      select: {
        id: true,
        nama: true,
        alamat: true,
        no_telp: true,
        kode: true,
      }
    });

    return NextResponse.json(
      getResponse(true, "Perusahaan successfully fetched", perusahaan)
    );
  } catch (error) {
    if (error instanceof ZodError) {
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

export async function POST(req: NextRequest) {
  try {
    const data = PerusahaanReq.parse((await req.json()) as PerusahaanReqInput);

    const perusahaan = await prisma.perusahaan.create({
      data: {
        nama: data.nama,
        alamat: data.alamat,
        no_telp: data.no_telp,
        kode: data.kode,
      },
    });

    return NextResponse.json(
      getResponse(true, "Perusahaan successfully created", perusahaan),
    );
  } catch (error) {
    if (error instanceof ZodError) {
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
