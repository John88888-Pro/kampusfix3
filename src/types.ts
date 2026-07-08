/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'pencari' | 'penyedia' | 'admin';

export interface PortofolioItem {
  id: string;
  title: string;
  issuer: string;
  year: string;
  fileUrl?: string; // base64 or URL image
  fileName?: string;
  description?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  whatsapp: string;
  avatar: string;
  bio: string;
  keahlian?: string;
  createdAt: string;
  rekeningBank?: string;
  rekeningNama?: string;
  portofolio?: PortofolioItem[];
}

export interface Jasa {
  id: string;
  penyediaId: string;
  penyediaName: string;
  penyediaAvatar: string;
  penyediaWhatsapp: string;
  title: string;
  category: string;
  description: string;
  price: number;
  duration: string; // e.g., '1 Hari', '2-3 Hari', '3+ Hari'
  features: string[]; // e.g., ["Revisi 2x", "Resource file", "Konsultasi"]
  ratingAvg: number;
  totalSales: number;
  status: 'aktif' | 'nonaktif';
  images: string[];
}

export type StatusPesanan = 
  | 'menunggu_konfirmasi' 
  | 'menunggu_pembayaran' 
  | 'dibayar' 
  | 'sedang_dikerjakan' 
  | 'selesai_menunggu_konfirmasi' 
  | 'selesai' 
  | 'rated' 
  | 'ditolak';

export interface Pesanan {
  id: string;
  jasaId: string;
  jasaTitle: string;
  jasaPrice: number;
  penyediaId: string;
  penyediaName: string;
  penyediaWhatsapp: string;
  pencariId: string;
  pencariName: string;
  pencariWhatsapp: string;
  tugasTitle: string;
  tugasDesc: string;
  tugasDeadline: string;
  tugasFileUrl?: string; // Optional file attached
  tugasFileName?: string;
  catatanTambahan?: string;
  biayaPlatform: number;
  totalBayar: number;
  status: StatusPesanan;
  buktiPembayaran?: string; // image/base64 upload file
  buktiPembayaranName?: string;
  hasilPekerjaanFile?: string; // zip/pdf/image upload file
  hasilPekerjaanName?: string;
  hasilPekerjaanCatatan?: string;
  rating?: number;
  ulasan?: string;
  createdAt: string;
  historis: { status: StatusPesanan; date: string; note?: string }[];
}

export interface Pendapatan {
  id: string;
  pesananId: string;
  penyediaId: string;
  jasaTitle: string;
  pencariName: string;
  amount: number;
  statusCair: boolean;
  createdAt: string;
}

export interface PenarikanDana {
  id: string;
  penyediaId: string;
  penyediaName: string;
  rekeningBank: string;
  rekeningNama: string;
  rekeningNomor: string;
  amount: number;
  status: 'pending' | 'disetujui' | 'ditolak';
  catatanAdmin?: string;
  createdAt: string;
}

export interface Notifikasi {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  pesananId?: string;
  jasaId?: string;
  type: 'pesanan' | 'sistem' | 'kategori';
  createdAt: string;
}

export interface Review {
  id: string;
  jasaId: string;
  pencariName: string;
  pencariAvatar: string;
  rating: number;
  ulasan: string;
  createdAt: string;
}
