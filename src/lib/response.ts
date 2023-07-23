import { BarangData, PerusahaanData, SelfData, LoginData } from "./interface";

export interface ResponseData {
  status: "success" | "error";
  message: string;
  data: LoginData | SelfData | BarangData | PerusahaanData | BarangData[] | PerusahaanData[] | null;
}

export function getResponse(isSuccess: boolean, message: string, data: LoginData | SelfData | BarangData | PerusahaanData | BarangData[] | PerusahaanData[] | null): ResponseData {
  return {
    status: (isSuccess ? "success" : "error"),
    message: message,
    data: data
  }
}
