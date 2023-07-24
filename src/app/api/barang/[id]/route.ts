import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { BarangReqUpdate, BarangReqUpdateInput } from "@/lib/validation";
import { getResponse } from "@/lib/response";
import { ZodError } from "zod";

interface BarangUpdateData {
  nama: string | undefined;
  harga: number | undefined;
  stok: number | undefined;
  kode: string | undefined;
  perusahaan?: {
    connect: {
      id: string;
    };
  };
}

export async function OPTIONS(req: NextRequest) {
  return NextResponse.json(null, { status: 200 });
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const barang = await prisma.barang.findUnique({
      where: {
        id: id,
      },
    });

    if (!barang) {
      return NextResponse.json(getResponse(false, "Barang not found", null), {
        status: 400,
      });
    }

    return NextResponse.json(
      getResponse(true, "Barang successfully fetched", barang)
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
    const data = BarangReqUpdate.parse(
      (await req.json()) as BarangReqUpdateInput
    );

    const updateData: BarangUpdateData = {
      nama: data.nama || undefined,
      harga: data.harga || undefined,
      stok: data.stok || undefined,
      kode: data.kode || undefined,
    };

    if (data.perusahaan_id) {
      updateData.perusahaan = {
        connect: {
          id: data.perusahaan_id,
        },
      };
    }
    const barang = await prisma.barang.update({
      where: {
        id: id,
      },
      data: updateData,
    });

    return NextResponse.json(
      getResponse(true, "Barang successfully updated", barang)
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const toBeDeleted = await prisma.barang.findUnique({
      where: {
        id: id,
      },
    });

    await prisma.barang.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json(
      getResponse(true, "Barang successfully deleted", toBeDeleted)
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
