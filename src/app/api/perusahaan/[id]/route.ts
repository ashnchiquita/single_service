import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  PerusahaanReqUpdate,
  PerusahaanReqUpdateInput,
} from "@/lib/validation";
import { getResponse } from "@/lib/response";
import { ZodError } from "zod";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

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
      },
    });

    if (!perusahaan) {
      return NextResponse.json(
        getResponse(false, "Perusahaan not found", null),
        { status: 400 }
      );
    }

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

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const data = PerusahaanReqUpdate.parse(
      (await req.json()) as PerusahaanReqUpdateInput
    );

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

    return NextResponse.json(
      getResponse(true, "Perusahaan successfully updated", perusahaan)
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const toBeDeleted = await prisma.perusahaan.findUnique({
      where: {
        id: id,
      },
    });

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
    return NextResponse.json(
      getResponse(true, "Perusahaan successfully deleted", toBeDeleted)
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
