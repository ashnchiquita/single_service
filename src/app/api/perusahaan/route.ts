import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PerusahaanQuery, PerusahaanQueryInput, PerusahaanReq, PerusahaanReqInput } from "@/lib/validation";

// prisma oke

export async function GET(req: NextRequest) {
  try {
    const query = PerusahaanQuery.parse(({
      q: req.nextUrl.searchParams.get("q"),
    }) as PerusahaanQueryInput);

    // aman
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

    return NextResponse.json({
      status: "success",
      message: "Perusahaan successfully fetched",
      data: perusahaan
    });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: "Internal server error", data: null },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = PerusahaanReq.parse((await req.json()) as PerusahaanReqInput);

    // aman
    const perusahaan = await prisma.perusahaan.create({
      data: {
        nama: data.nama,
        alamat: data.alamat,
        no_telp: data.no_telp,
        kode: data.kode,
      },
    });

    return NextResponse.json({
      status: "success",
      message: "Perusahaan successfully created",
      data: perusahaan
    });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: "Internal server error", data: null },
      { status: 500 }
    );
  }
}
