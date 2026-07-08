/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  Plus, 
  ArrowRight, 
  Star, 
  FileText, 
  FolderLock, 
  Sparkles,
  ChevronRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { User, Pesanan, Jasa, Pendapatan } from '../types';
import { KampusFixDB } from '../data/db';
import { formatRupiah } from './ServiceViews';

// Status styling helper
export function getStatusBadge(status: string) {
  const styles: Record<string, string> = {
    menunggu_konfirmasi: 'bg-amber-100 text-amber-800 border-amber-200',
    menunggu_pembayaran: 'bg-blue-100 text-blue-800 border-blue-200',
    dibayar: 'bg-purple-100 text-purple-800 border-purple-200',
    sedang_dikerjakan: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    selesai_menunggu_konfirmasi: 'bg-orange-100 text-orange-850 border-orange-200',
    selesai: 'bg-slate-100 text-slate-800 border-slate-200',
    rated: 'bg-green-100 text-green-800 border-green-200',
    ditolak: 'bg-red-100 text-red-850 border-red-200',
  };
  
  const text: Record<string, string> = {
    menunggu_konfirmasi: 'Menunggu Konfirmasi',
    menunggu_pembayaran: 'Belum Dibayar',
    dibayar: 'Dana Escrow Dibayar',
    sedang_dikerjakan: 'Sedang Digarap',
    selesai_menunggu_konfirmasi: 'Selesai - Meminta Konfirmasi',
    selesai: 'Selesai & Cair',
    rated: 'Selesai & Direview',
    ditolak: 'Pesanan Ditolak',
  };

  return (
    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border uppercase tracking-wider font-mono ${styles[status] || styles.selesai}`}>
      {text[status] || status}
    </span>
  );
}

/* ============================================================================
   1. DASHBOARD PENCARI JASA
   ============================================================================ */
interface DashboardPencariProps {
  onNavigate: (view: string, params?: any) => void;
  activeUser: User | null;
  refreshTrigger: number;
}

export function DashboardPencari({ onNavigate, activeUser, refreshTrigger }: DashboardPencariProps) {
  const [pesananList, setPesananList] = useState<Pesanan[]>([]);

  useEffect(() => {
    if (activeUser) {
      const all = KampusFixDB.getPesanan();
      const filtered = all.filter(p => p.pencariId === activeUser.id);
      // Sort newest first
      setPesananList(filtered.sort((a,b) => b.createdAt.localeCompare(a.createdAt)));
    }
  }, [activeUser, refreshTrigger]);

  if (!activeUser) return null;

  // Overview metrics
  const activeOrders = pesananList.filter(p => ['menunggu_konfirmasi', 'menunggu_pembayaran', 'dibayar', 'sedang_dikerjakan', 'selesai_menunggu_konfirmasi'].includes(p.status)).length;
  const completedOrders = pesananList.filter(p => ['selesai', 'rated'].includes(p.status)).length;
  const totalSpent = pesananList
    .filter(p => !['ditolak', 'menunggu_konfirmasi', 'menunggu_pembayaran'].includes(p.status))
    .reduce((sum, item) => sum + item.totalBayar, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      
      {/* Greetings Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-display font-black text-gray-950">
            Selamat Datang, {activeUser.name}!
          </h1>
          <p className="text-xs text-gray-400">Dashboard Pencari Jasa • Semuanya terkontrol lewat escrow KampusFix</p>
        </div>
        <button 
          onClick={() => onNavigate('kategori')}
          className="flex items-center gap-1.5 px-4.5 py-2 bg-[#0F7B4E] hover:bg-[#0B5E3C] text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md shadow-emerald-950/10"
        >
          <Plus className="w-4 h-4" /> Cari Jasa Baru
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="h-10 w-10 bg-emerald-50 text-[#0F7B4E] rounded-xl flex items-center justify-center font-bold text-base">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400 font-mono">Pesanan Aktif</p>
            <p className="text-xl font-bold text-gray-900 font-display">{activeOrders} Pesanan</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="h-10 w-10 bg-emerald-50 text-[#0F7B4E] rounded-xl flex items-center justify-center font-bold text-base">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400 font-mono">Pesanan Rampung</p>
            <p className="text-xl font-bold text-gray-900 font-display">{completedOrders} Selesai</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="h-10 w-10 bg-emerald-50 text-[#0F7B4E] rounded-xl flex items-center justify-center font-bold text-base">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400 font-mono">Total Dana Keluar (Escrow)</p>
            <p className="text-xl font-bold text-emerald-700 font-display">{formatRupiah(totalSpent)}</p>
          </div>
        </div>
      </div>

      {/* Orders Table Container */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4.5 border-b border-gray-50 flex items-center justify-between">
          <h2 className="font-bold text-sm text-gray-950 uppercase tracking-wider font-mono">Riwayat Pesanan Tugas Saya</h2>
          <span className="text-xs bg-emerald-50 text-[#0F7B4E] px-2.5 py-0.5 border border-emerald-100 rounded-full font-bold">
            Total {pesananList.length} Transaksi
          </span>
        </div>

        <div className="overflow-x-auto">
          {pesananList.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <p className="text-gray-400 text-3xl">📭</p>
              <h4 className="font-bold text-sm text-gray-900">Belum Ada Transaksi Apapun</h4>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Anda belum memesan bantuan tugas sejauh ini. Mulai cari helper berkemampuan tinggi sekarang!
              </p>
              <button 
                onClick={() => onNavigate('kategori')}
                className="px-4.5 py-2 bg-emerald-50 hover:bg-[#0F7B4E] text-[#0F7B4E] hover:text-white rounded-lg text-xs font-bold cursor-pointer transition-colors"
              >
                Jelajahi Jasa
              </button>
            </div>
          ) : (
            <table className="w-full text-left font-sans text-xs">
              <thead className="bg-slate-50 text-[10px] uppercase tracking-wider font-bold text-gray-500 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3.5">No. Pesanan</th>
                  <th className="px-6 py-3.5">Nama/Judul Jasa</th>
                  <th className="px-6 py-3.5">Mahasiswa Helper</th>
                  <th className="px-6 py-3.5">Total Bayar</th>
                  <th className="px-6 py-3.5">Status Escrow</th>
                  <th className="px-6 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {pesananList.map((ord) => (
                  <tr key={ord.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4.5 font-mono text-[10px] font-bold text-gray-400">
                      #{ord.id.substring(8, 14).toUpperCase()}
                    </td>
                    <td className="px-6 py-4.5">
                      <div>
                        <p className="font-bold text-gray-900 line-clamp-1">{ord.jasaTitle}</p>
                        <p className="text-[10px] text-gray-400 font-mono mt-0.5">Topik: {ord.tugasTitle}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-gray-800">{ord.penyediaName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4.5 font-bold font-mono text-gray-950">
                      {formatRupiah(ord.totalBayar)}
                    </td>
                    <td className="px-6 py-4.5">
                      {getStatusBadge(ord.status)}
                    </td>
                    <td className="px-6 py-4.5 text-right">
                      <button 
                        onClick={() => onNavigate('status-pesanan', { id_pesanan: ord.id })}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-[#0F7B4E] text-[#0F7B4E] hover:text-white rounded-lg font-bold text-[10px] cursor-pointer transition-colors"
                      >
                        Detail Progres
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

    </div>
  );
}


/* ============================================================================
   2. DASHBOARD PENYEDIA JASA (HELPER / PROVIDER)
   ============================================================================ */
interface DashboardPenyediaProps {
  onNavigate: (view: string, params?: any) => void;
  activeUser: User | null;
  refreshTrigger: number;
}

export function DashboardPenyedia({ onNavigate, activeUser, refreshTrigger }: DashboardPenyediaProps) {
  const [jasaCount, setJasaCount] = useState(0);
  const [pesananList, setPesananList] = useState<Pesanan[]>([]);
  const [revenues, setRevenues] = useState<Pendapatan[]>([]);

  useEffect(() => {
    if (activeUser) {
      // Services Count
      const allJasa = KampusFixDB.getJasa();
      setJasaCount(allJasa.filter(j => j.penyediaId === activeUser.id).length);

      // Orders received
      const allPesanan = KampusFixDB.getPesanan();
      setPesananList(allPesanan.filter(p => p.penyediaId === activeUser.id));

      // Earnings
      const allRev = KampusFixDB.getPendapatan();
      setRevenues(allRev.filter(r => r.penyediaId === activeUser.id));
    }
  }, [activeUser, refreshTrigger]);

  if (!activeUser) return null;

  // Calculations
  const incomingCount = pesananList.filter(p => p.status === 'menunggu_konfirmasi').length;
  const activeJobs = pesananList.filter(p => ['dibayar', 'sedang_dikerjakan', 'selesai_menunggu_konfirmasi'].includes(p.status)).length;
  
  const totalEarned = revenues.reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      
      {/* Overview header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <h1 className="text-xl sm:text-2xl font-display font-black text-gray-950">
              Kabin Helper, {activeUser.name}!
            </h1>
            <span className="bg-emerald-100 text-teal-850 px-2 py-0.5 rounded text-[9px] font-bold tracking-wide uppercase font-mono border border-emerald-200">
              PRO HELPER
            </span>
          </div>
          <p className="text-xs text-gray-400">Dashboard Penyedia Jasa • Monitor pendapatan, ganti status order, & tambah jasa baru</p>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <button 
            onClick={() => onNavigate('form-jasa')}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4.5 py-2.5 bg-[#0F7B4E] hover:bg-[#0B5E3C] text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md shadow-emerald-900/10"
          >
            <Plus className="w-4 h-4" /> Tambah Jasa Baru
          </button>
          <button 
            onClick={() => onNavigate('kelola-jasa')}
            className="flex-1 sm:flex-none border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-xs p-2.5 rounded-xl cursor-pointer"
          >
            Kelola Portofolio Jasa
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4.5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="h-9 w-9 bg-emerald-50 text-[#0F7B4E] rounded-xl flex items-center justify-center font-bold">
            🎒
          </div>
          <div>
            <p className="text-[9px] uppercase font-bold tracking-wider text-gray-400 font-mono">Portofolio Jasa</p>
            <p className="text-base font-bold text-gray-900 font-display">{jasaCount} Terposting</p>
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="h-9 w-9 bg-emerald-50 text-[#0F7B4E] rounded-xl flex items-center justify-center font-bold">
            📥
          </div>
          <div>
            <p className="text-[9px] uppercase font-bold tracking-wider text-gray-400 font-mono">Pesanan Baru Masuk</p>
            <p className="text-base font-extrabold text-blue-800 font-display animate-pulse">{incomingCount} Pesanan</p>
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="h-9 w-9 bg-emerald-50 text-[#0F7B4E] rounded-xl flex items-center justify-center font-bold">
            🔧
          </div>
          <div>
            <p className="text-[9px] uppercase font-bold tracking-wider text-gray-400 font-mono">Sedang Digarap</p>
            <p className="text-base font-bold text-gray-900 font-display">{activeJobs} Pesanan</p>
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3 col-span-2 md:col-span-1">
          <div className="h-9 w-9 bg-emerald-50 text-[#0F7B4E] rounded-xl flex items-center justify-center font-bold">
            💳
          </div>
          <div>
            <p className="text-[9px] uppercase font-bold tracking-wider text-gray-400 font-mono">Total Pendapatan</p>
            <p className="text-base font-bold text-emerald-800 font-mono font-extrabold">{formatRupiah(totalEarned)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side (Column 2/3): Received Orders */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4.5 border-b border-gray-50 flex items-center justify-between">
              <h3 className="font-bold text-sm text-gray-950 uppercase tracking-wider font-mono">Daftar Kelola Pesanan Masuk</h3>
              <button 
                onClick={() => onNavigate('pesanan-masuk')}
                className="text-xs text-[#0F7B4E] hover:underline font-bold flex items-center gap-0.5 cursor-pointer"
              >
                Lihat Semua <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="divide-y divide-gray-50">
              {pesananList.length === 0 ? (
                <div className="p-10 text-center text-xs text-gray-400">
                  Belum ada pesanan masuk dari pembeli tugas. Coba pastikan jasa Anda berstatus "Aktif".
                </div>
              ) : (
                pesananList.slice(0, 5).map((ord) => (
                  <div key={ord.id} className="p-5 hover:bg-gray-50/50 transition-all duration-150 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-mono text-gray-450 uppercase">#{ord.id.substring(8, 14)}</span>
                        {getStatusBadge(ord.status)}
                      </div>
                      <h4 className="font-extrabold text-sm text-gray-900 leading-snug">{ord.jasaTitle}</h4>
                      <p className="text-xs text-gray-500 font-medium">Pemesan: <strong className="text-gray-700">{ord.pencariName}</strong> • Deadline: <span className="font-mono">{ord.tugasDeadline}</span></p>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
                      <div className="font-mono text-right hidden sm:block">
                        <p className="text-[10px] text-gray-400">Nilai Bersih</p>
                        <p className="font-bold text-[#0F7B4E]">{formatRupiah(ord.jasaPrice)}</p>
                      </div>
                      <button 
                        onClick={() => onNavigate('detail-pesanan-penyedia', { id_pesanan: ord.id })}
                        className="w-full sm:w-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg cursor-pointer transition-colors"
                      >
                        Kelola
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Side (Column 1/3): Quick actions & Income list */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-gray-950 uppercase tracking-wider font-mono">Keuangan Helper</h3>
            
            <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl space-y-1">
              <span className="text-[9px] uppercase font-bold tracking-wider text-gray-400 font-mono">Dompet Belum Dicairkan</span>
              <h4 className="text-2xl font-bold font-mono text-emerald-800">
                {formatRupiah(revenues.filter(r => !r.statusCair).reduce((sum, r) => sum + r.amount, 0))}
              </h4>
            </div>

            <div className="space-y-2">
              <button 
                onClick={() => onNavigate('riwayat-pendapatan')} 
                className="w-full py-2.5 bg-emerald-50 hover:bg-[#0F7B4E] text-[#0F7B4E] hover:text-white rounded-xl text-xs font-bold uppercase cursor-pointer tracking-wider text-center transition-colors border border-emerald-100"
              >
                Riwayat & Cairkan Dana
              </button>
            </div>
          </div>

          <div className="bg-emerald-950 text-emerald-100 p-5 rounded-2xl border border-emerald-850 space-y-3 relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 text-7xl font-bold opacity-10">🛡️</div>
            <h4 className="font-bold text-xs tracking-tight uppercase font-mono">Tips Sukses Helper</h4>
            <p className="text-[11px] text-emerald-250 leading-relaxed text-justify">
              Selalu ingatkan pembeli tugas Anda untuk mencocokkan parameter tugas sebelum mulai mengerjakan dan direct chat WhatsApp demi hasil revisi yang dijamin memuaskan!
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
