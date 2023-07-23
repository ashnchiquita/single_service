import { PrismaClient } from "@prisma/client";
import { parse } from "csv-parse";
import { hash } from "bcryptjs";
import path from "path";
import fs from "fs";

const prisma = new PrismaClient();

interface AdminData {
  username: string;
  name: string;
  password: string;
}

interface PerusahaanData {
  nama: string;
  alamat: string;
  no_telp: string;
  kode: string;
}

interface BarangData {
  nama: string;
  harga: string;
  stok: string;
  kode: string;
  kode_perusahaan: string;
}

async function main() {
  const adminPath = path.resolve(__dirname, "data/admin.csv");
  const barangPath = path.resolve(__dirname, "data/barang.csv");
  const perusahaanPath = path.resolve(__dirname, "data/perusahaan.csv");

  const adminContent = fs.readFileSync(adminPath, {
    encoding: "utf-8",
  });
  const barangContent = fs.readFileSync(barangPath, {
    encoding: "utf-8",
  });
  const perusahaanContent = fs.readFileSync(perusahaanPath, {
    encoding: "utf-8",
  });

  parse(
    adminContent,
    {
      delimiter: ",",
      columns: ["username", "name", "password"],
    },
    async (err, records: AdminData[]) => {
      if (err) console.error(err);
      const admin = await Promise.all(
        records.map(async (record) => {
          return await prisma.admin.create({
            data: {
              username: record.username,
              name: record.name,
              password: await hash(record.password, 10),
            },
          });
        })
      );
      console.log(admin);
    }
  );

  parse(
    perusahaanContent,
    {
      delimiter: ",",
      columns: ["nama", "alamat", "no_telp", "kode"],
    },
    async (err, records: PerusahaanData[]) => {
      if (err) console.error(err);
      const perusahaan = await Promise.all(
        records.map(async (record) => {
          return await prisma.perusahaan.create({
            data: {
              nama: record.nama,
              alamat: record.alamat,
              no_telp: record.no_telp,
              kode: record.kode,
            },
          });
        })
      );
      console.log(perusahaan);
    }
  );

  parse(
    barangContent,
    {
      delimiter: ",",
      columns: ["nama", "harga", "stok", "kode", "kode_perusahaan"],
    },
    async (err, records: BarangData[]) => {
      if (err) console.error(err);
      const barang = await Promise.all(
        records.map(async (record) => {
          const perusahaan = await prisma.perusahaan.findUnique({
            where: {
              kode: record.kode_perusahaan
            }
          });

          if (!perusahaan) throw new Error(`Perusahaan dgn kode pajak ${record.kode} not found`);
          return await prisma.barang.create({
            data: {
              nama: record.nama,
              harga: parseInt(record.harga),
              stok: parseInt(record.stok),
              kode: record.kode,
              perusahaan: {
                connect: {
                  id: perusahaan.id
                }
              }
            },
          });
        })
      );
      console.log(barang);
    }
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
