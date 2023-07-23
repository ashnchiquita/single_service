import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { BarangData } from "@/lib/interface";
import {
  BarangQuery,
  BarangQueryInput,
  BarangReq,
  BarangReqInput,
} from "@/lib/validation";

// prisma aman

export async function GET(req: NextRequest) {
  try {
    const query = BarangQuery.parse({
      q: req.nextUrl.searchParams.get("q"),
      perusahaan: req.nextUrl.searchParams.get("perusahaan"),
    } as BarangQueryInput);

    // aman
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

    return NextResponse.json({
      status: "success",
      message: "Barang successfully fetched",
      data: result
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { status: "error", message: "Internal server error", data: null },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = BarangReq.parse((await req.json()) as BarangReqInput);

    // aman
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

    return NextResponse.json({
      status: "success",
      message: "Barang successfully created",
      data: result
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { status: "error", message: "Internal server error", data: null },
      { status: 500 }
    );
  }
}
