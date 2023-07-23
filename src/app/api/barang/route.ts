import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { BarangData } from "@/lib/interface";
import {
  BarangQuery,
  BarangQueryInput,
  BarangReq,
  BarangReqInput,
} from "@/lib/validation";
import { getResponse } from "@/lib/response";
import { ZodError } from "zod";

export async function GET(req: NextRequest) {
  try {
    const query = BarangQuery.parse({
      q: req.nextUrl.searchParams.get("q"),
      perusahaan: req.nextUrl.searchParams.get("perusahaan"),
    } as BarangQueryInput);

    const barang = await prisma.barang.findMany({
      where: {
        AND: [
          {
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
          {
            OR: [
              {
                perusahaan: {
                  nama: {
                    contains: query.perusahaan,
                    mode: "insensitive",
                  },
                },
              },
              {
                perusahaan: {
                  kode: {
                    contains: query.perusahaan,
                  },
                },
              },
            ],
          },
        ],
      },
      select: {
        id: true,
        nama: true,
        harga: true,
        stok: true,
        kode: true,
        perusahaan: {
          select: {
            id: true,
          },
        },
      },
    });

    let result: BarangData[] = [];
    barang.map((barang) => {
      result.push({
        id: barang.id,
        nama: barang.nama,
        harga: barang.harga,
        stok: barang.stok,
        kode: barang.kode,
        perusahaan_id: barang.perusahaan.id,
      });
    });

    return NextResponse.json(
      getResponse(true, "Barang successfully fetched", result)
    );
  } catch (error) {
    console.error(error);
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
    const data = BarangReq.parse((await req.json()) as BarangReqInput);

    const barang = await prisma.barang.create({
      data: {
        nama: data.nama,
        harga: data.harga,
        stok: data.stok,
        perusahaan: {
          connect: {
            id: data.perusahaan_id,
          },
        },
        kode: data.kode,
      },
    });

    const result: BarangData = {
      id: barang.id,
      nama: barang.nama,
      harga: barang.harga,
      stok: barang.stok,
      perusahaan_id: barang.perusahaan_id,
      kode: barang.kode,
    };

    return NextResponse.json(
      getResponse(true, "Barang successfully created", result)
    );
  } catch (error) {
    console.error(error);
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
