import { z } from 'zod';

export const LoginReq = z.object({
  username: z.string(),
  password: z.string()
});

export const BarangQuery = z.object({
  q: z.string(),
  perusahaan: z.string()
});

export const BarangReq = z.object({
  nama: z.string(),
  harga: z.number().nonnegative(),
  stok: z.number().nonnegative(),
  perusahaan_id: z.string().uuid(),
  kode: z.string()
});

export const BarangReqUpdate = z.object({
  nama: z.string().optional(),
  harga: z.number().nonnegative().optional(),
  stok: z.number().nonnegative().optional(),
  perusahaan_id: z.string().uuid().optional(),
  kode: z.string().optional()
});

export const PerusahaanQuery = z.object({
  q: z.string()
});

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

const kodePajakRegex = new RegExp(
  /^([A-Z]){3}$/
);

export const PerusahaanReq = z.object({
  nama: z.string(),
  alamat: z.string(),
  no_telp: z.string().regex(phoneRegex),
  kode: z.string().regex(kodePajakRegex)
});

export const PerusahaanReqUpdate = z.object({
  nama: z.string().optional(),
  alamat: z.string().optional(),
  no_telp: z.string().regex(phoneRegex).optional(),
  kode: z.string().regex(kodePajakRegex).optional()
});

export type LoginReqInput = z.infer<typeof LoginReq>;
export type BarangQueryInput = z.infer<typeof BarangQuery>;
export type BarangReqInput = z.infer<typeof BarangReq>;
export type BarangReqUpdateInput = z.infer<typeof BarangReqUpdate>;
export type PerusahaanQueryInput = z.infer<typeof PerusahaanQuery>;
export type PerusahaanReqInput = z.infer<typeof PerusahaanReq>;
export type PerusahaanReqUpdateInput = z.infer<typeof PerusahaanReqUpdate>;
