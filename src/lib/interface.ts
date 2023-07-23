export interface LoginData {
  user: {
    username: string;
    name: string;
  };
  token: string;
}

export interface SelfData {
  username: string;
  name: string;
}

export interface BarangData {
  id: string;
  nama: string;
  harga: number;
  stok: number;
  kode: string;
  perusahaan_id: string;
}

export interface PerusahaanData {
  id: string;
  nama: string;
  alamat: string;
  no_telp: string;
  kode: string;
}
