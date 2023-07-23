import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { BarangReqUpdate, BarangReqUpdateInput } from "@/lib/validation";

// prisma aman

interface BarangUpdateData {
  nama: string | undefined;
  harga: number | undefined;
  stok: number | undefined;
  kode: string | undefined;
  perusahaan?: {
    connect: {
      id: string;
    }
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // aman
    const barang = await prisma.barang.findUnique({
      where: {
        id: id,
      }
    });

    if (!barang) {
      return NextResponse.json(
      { status: "error", message: "Barang not found", data: null },
      { status: 400 }
    );
    }

    return NextResponse.json({
      status: "success",
      message: "Barang successfully fetched",
      data: barang
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
    const data = BarangReqUpdate.parse((await req.json()) as BarangReqUpdateInput);

    // aman
    const updateData: BarangUpdateData = {
      nama: data.nama || undefined,
      harga: data.harga || undefined,
      stok: data.stok || undefined,
      kode: data.kode || undefined,
    }

    if (data.perusahaan_id) {
      updateData.perusahaan = {
        connect: {
          id: data.perusahaan_id,
        }
      }
    }
    const barang = await prisma.barang.update({
      where: {
        id: id,
      },
      data: updateData,
    });

    return NextResponse.json({
      status: "success",
      message: "Barang successfully updated",
      data: barang
    });
  } catch (error) {
    console.error(error);
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

    const barang = await prisma.barang.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json({
      status: "success",
      message: "Barang successfully deleted",
      data: barang
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { status: "error", message: "Internal server error", data: null },
      { status: 500 }
    );
  }
}

