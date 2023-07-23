import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PerusahaanReqUpdate, PerusahaanReqUpdateInput } from "@/lib/validation";

// prisma aman

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // aman
    const perusahaan = await prisma.perusahaan.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        nama: true,
        alamat: true,
        no_telp: true,
        kode: true,
      }
    });

    if (!perusahaan) {
      return NextResponse.json({ message: "Perusahaan not found" }, { status: 400 });
    }

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

export async function PATCH(req: NextRequest,
  { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const data = PerusahaanReqUpdate.parse((await req.json()) as PerusahaanReqUpdateInput);

    // aman
    const perusahaan = await prisma.perusahaan.update({
      where: {
        id: id,
      },
      data: {
        nama: data.nama || undefined,
        alamat: data.alamat || undefined,
        no_telp: data.no_telp || undefined,
        kode: data.kode || undefined,
      },
    });

    return NextResponse.json({
      status: "success",
      message: "Perusahaan successfully updated",
      data: perusahaan
    });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: "Internal server error", data: null },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest,
  { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    // aman
    const barang = prisma.barang.deleteMany({
      where: {
        perusahaan_id: id,
      },
    });

    const perusahaan = prisma.perusahaan.delete({
      where: {
        id: id,
      },
    });

    await prisma.$transaction([barang, perusahaan]);
    return NextResponse.json({
      status: "success",
      message: "Perusahaan successfully deleted",
      data: perusahaan
    });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: "Internal server error", data: null },
      { status: 500 }
    );
  }
}
