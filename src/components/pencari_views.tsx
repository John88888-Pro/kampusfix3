/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Check, 
  Upload, 
  FileText, 
  Star, 
  Calendar, 
  Wallet, 
  MessageSquare, 
  ShieldCheck, 
  ExternalLink,
  ChevronRight,
  Download,
  CheckCircle,
  Clock,
  Briefcase,
  AlertCircle
} from 'lucide-react';
import { Jasa, Pesanan, User } from '../types';
import { KampusFixDB } from '../data/db';
import { formatRupiah } from './ServiceViews';

/* ============================================================================
   1. FORM PEMESANAN JASA (form-pesan.html)
   ============================================================================ */
interface FormPesanProps {
  onNavigate: (view: string, params?: any) => void;
  activeUser: User | null;
  params?: { jasa_id?: string };
  onOrderCreated: () => void;
}

export function FormPesan({ onNavigate, activeUser, params, onOrderCreated }: FormPesanProps) {
  const [jasa, setJasa] = useState<Jasa | null>(null);
  const [tugasTitle, setTugasTitle] = useState('');
  const [tugasDesc, setTugasDesc] = useState('');
  const [tugasDeadline, setTugasDeadline] = useState('');
  const [catatan, setCatatan] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileBase64, setFileBase64] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (params?.jasa_id) {
      const found = KampusFixDB.getJasa().find(x => x.id === params.jasa_id);
      if (found) setJasa(found);
    }
  }, [params]);

  if (!activeUser) return null;

  if (!jasa) {
    return (
      <div className="max-w-md mx-auto text-center py-20">
        <p className="font-bold">Detail Jasa Tidak Ditemukan</p>
        <button onClick={() => onNavigate('home')} className="mt-4 px-4 py-2 bg-[#0F7B4E] text-white text-xs font-semibold rounded-lg">
          Kembali Beranda
        </button>
      </div>
    );
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      // Simulate base64 read for presentation
      const r = new FileReader();
      r.onloadend = () => {
        setFileBase64(r.result as string);
      };
      r.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tugasTitle || !tugasDesc || !tugasDeadline) {
      alert('Mohon lengkapi seluruh form parameter tugas.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      try {
        const order = KampusFixDB.createPesanan(jasa.id, {
          tugasTitle,
          tugasDesc,
          tugasDeadline,
          fileBase64,
          fileName,
          catatan
        });

        onOrderCreated(); // Trigger reload
        onNavigate('status-pesanan', { id_pesanan: order.id });
      } catch (e: any) {
        alert(e.message);
      } finally {
        setIsLoading(false);
      }
    }, 800);
  };

  const adminFee = Math.round(jasa.price * 0.10);
  const total = jasa.price;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in duration-200">
      
      {/* Back to service */}
      <button 
        onClick={() => onNavigate('detail-jasa', { id: jasa.id })}
        className="flex items-center gap-1 text-xs text-gray-500 hover:text-[#0F7B4E] cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Kembali ke detail jasa
      </button>

      <div>
        <h1 className="text-2xl font-display font-extrabold text-gray-950">Form Pemesanan Jasa</h1>
        <p className="text-xs text-gray-400">Isi parameter penjelasan tugas Anda secara detail demi membimbing penyedia</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Form area */}
        <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 block">Judul Tugas / Proyek Perkuliahan</label>
              <input 
                type="text"
                required
                placeholder="Contoh: PPT Proposal Penelitian Manajemen / Code Web Kalkulator"
                value={tugasTitle}
                onChange={(e) => setTugasTitle(e.target.value)}
                className="w-full text-xs p-2.5 border border-gray-200 focus:border-[#0F7B4E] rounded-xl outline-none"
              />
              <p className="text-[10px] text-gray-400">Judul ringkas mengenai topik bantuan kuliah Anda.</p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 block">Deskripsi Detail Instruksi Pengerjaan</label>
              <textarea 
                rows={5}
                required
                placeholder="Deskripsikan sedetail mungkin: apa saja modulnya, software/bahasa pemrograman yang dipakai, format pengumpulan, revisi yang diinginkan, dsb."
                value={tugasDesc}
                onChange={(e) => setTugasDesc(e.target.value)}
                className="w-full text-xs p-2.5 border border-gray-200 focus:border-[#0F7B4E] rounded-xl outline-none text-justify whitespace-pre-line"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">Tanggal Batas Akhir (Deadline)</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                  <input 
                    type="date"
                    required
                    value={tugasDeadline}
                    onChange={(e) => setTugasDeadline(e.target.value)}
                    className="w-full text-xs pl-9 pr-3 py-2.5 border border-gray-200 focus:border-[#0F7B4E] rounded-xl outline-none"
                  />
                </div>
              </div>

              {/* Upload field */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">File Pendukung Tugas (Opsional)</label>
                <div className="relative border border-dashed border-gray-200 hover:border-[#0F7B4E] hover:bg-emerald-50/20 rounded-xl transition-all p-2.5 flex items-center justify-center gap-1.5 cursor-pointer">
                  <Upload className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-500 truncate font-semibold">
                    {fileName ? fileName : 'Upload File Tugas (PDF/ZIP)'}
                  </span>
                  <input 
                    type="file" 
                    onChange={handleFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 block">Catatan Tambahan untuk Helper</label>
              <input 
                type="text"
                placeholder="Contoh: Gunakan format font Arial / butuh pengerjaan cepat"
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                className="w-full text-xs p-2.5 border border-gray-200 focus:border-[#0F7B4E] rounded-xl outline-none"
              />
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 bg-[#0F7B4E] hover:bg-[#0B5E3C] text-white rounded-xl text-xs font-bold uppercase cursor-pointer transition-all ${isLoading ? 'opacity-50' : ''}`}
            >
              {isLoading ? 'Mengirim Pesanan...' : 'Kirim Pengajuan Pesanan'}
            </button>
          </form>
        </div>

        {/* Jasa details card */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-gray-950 uppercase tracking-wider border-b border-gray-50 pb-2.5 font-mono">Ringkasan Layanan</h3>
            
            <div className="flex items-center gap-3">
              <img 
                src={jasa.images[0]} 
                alt={jasa.title} 
                className="w-16 h-12 rounded object-cover border"
              />
              <div>
                <h4 className="font-bold text-xs text-gray-950 leading-tight line-clamp-2">{jasa.title}</h4>
                <p className="text-[10px] text-[#0F7B4E] font-bold font-mono mt-0.5">{jasa.category}</p>
              </div>
            </div>

            <div className="space-y-2 border-t border-gray-50 pt-3 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Harga Jasa:</span>
                <span className="font-bold text-gray-800">{formatRupiah(jasa.price)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Biaya Platform (10%):</span>
                <span className="font-semibold text-gray-400">Sudah Termasuk (Dipotong dari Helper)</span>
              </div>
              <div className="flex justify-between text-gray-800 font-extrabold border-t border-gray-50 pt-2 text-sm">
                <span>Total Pembayaran:</span>
                <span className="text-[#0F7B4E] font-display">{formatRupiah(total)}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}


/* ============================================================================
   2. DETAIL STATUS PESANAN (status-pesanan.html + alur monitoring)
   ============================================================================ */
interface StatusPesananProps {
  onNavigate: (view: string, params?: any) => void;
  activeUser: User | null;
  params?: { id_pesanan?: string };
  refreshTrigger: number;
  onStateUpdate: () => void;
}

export function StatusPesanan({ onNavigate, activeUser, params, refreshTrigger, onStateUpdate }: StatusPesananProps) {
  const [pesanan, setPesanan] = useState<Pesanan | null>(null);

  useEffect(() => {
    if (params?.id_pesanan) {
      const p = KampusFixDB.getPesanan().find(x => x.id === params.id_pesanan);
      if (p) setPesanan(p);
    }
  }, [params, refreshTrigger]);

  if (!activeUser) return null;

  if (!pesanan) {
    return (
      <div className="max-w-md mx-auto text-center py-20">
        <p className="font-bold">Eror: Pesanan Tidak Ditemukan</p>
        <button onClick={() => onNavigate('dashboard-pencari')} className="mt-4 px-4 py-2 bg-[#0F7B4E] text-white rounded-lg text-xs font-semibold cursor-pointer">
          Kembali Dashboard
        </button>
      </div>
    );
  }

  // Determine Timeline Progress (1 to 5)
  // Stages: 'menunggu_konfirmasi' 'menunggu_pembayaran' 'dibayar' 'sedang_dikerjakan' 'selesai_menunggu_konfirmasi' 'selesai' ('rated')
  const statusRanks: Record<string, number> = {
    menunggu_konfirmasi: 1,
    menunggu_pembayaran: 2,
    dibayar: 3,
    sedang_dikerjakan: 3,
    selesai_menunggu_konfirmasi: 4,
    selesai: 5,
    rated: 5,
    ditolak: 0,
  };

  const activeRank = statusRanks[pesanan.status] || 1;

  const handleConfirmFinish = () => {
    const confirmVal = window.confirm('Konfirmasi pekerjaan selesai? Dana escrow akan segera dicarikan ke rekening helper Anda.');
    if (confirmVal) {
      KampusFixDB.updatePesananStatus(pesanan.id, 'selesai', 'Pencari mengonfirmasi pekerjaan selesai dan merilis dana escrow.');
      onStateUpdate();
      // Navigate to Rating Page
      onNavigate('rating-page', { id_pesanan: pesanan.id });
    }
  };

  const handleRevisiClick = () => {
    // Open WA directly to chat resolver
    const waNo = pesanan.penyediaWhatsapp;
    const revMsg = encodeURIComponent(`Halo Kak ${pesanan.penyediaName}, terkait pesanan #${pesanan.id.slice(10)} yang telah dikirim, saya ingin berkonsultasi mengenai revisi berikut: `);
    window.open(`https://wa.me/${waNo}?text=${revMsg}`, '_blank');
  };

  // WhatsApp Link for chat
  const chatWA = `https://wa.me/${pesanan.penyediaWhatsapp}?text=${encodeURIComponent(`Halo ${pesanan.penyediaName}, terkait pengerjaan tugas #${pesanan.id.slice(10)} yang sedang digarap.`)}`;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in duration-150">
      
      {/* Header breadcrumb */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <button 
          onClick={() => onNavigate('dashboard-pencari')}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#0F7B4E] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali Dashboard
        </button>

        <span className="text-[10px] bg-slate-100 text-slate-700 px-3 py-1 border border-slate-200 rounded font-mono font-bold uppercase">
          ID ORDER: #{pesanan.id.toUpperCase()}
        </span>
      </div>

      {/* Visual Progress Timeline (Steps Bar) */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
        <h3 className="font-bold text-xs uppercase text-gray-400 tracking-wider font-mono">Status Timeline Penggarapan Jasa</h3>
        
        {pesanan.status === 'ditolak' ? (
          <div className="p-4 bg-red-50 border border-red-100 text-red-800 text-xs rounded-xl flex items-center gap-2 font-medium">
            <AlertCircle className="w-5 h-5" /> 
            <span>Pengajuan pesanan Anda ditolak oleh Helper. Silakan ajukan ulang atau hubungi via WhatsApp.</span>
          </div>
        ) : (
          <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 sm:gap-1 pl-4 sm:pl-0 border-l sm:border-l-0 border-slate-100">
            {/* Horizontal progress bar behind icons on desktop */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 -translate-y-1/2 -z-0 hidden sm:block"></div>
            
            {/* Step 1 */}
            <div className="flex sm:flex-col items-center gap-3 sm:gap-2 relative z-10 text-left sm:text-center shrink-0">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold leading-none border-2 ${activeRank >= 1 ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-gray-200 text-gray-400'}`}>
                {activeRank > 1 ? '✓' : '1'}
              </div>
              <div>
                <p className="font-bold text-xs text-gray-900 leading-tight">Pengajuan</p>
                <p className="text-[10px] text-gray-400">Menunggu Helper Konfirmasi</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex sm:flex-col items-center gap-3 sm:gap-2 relative z-10 text-left sm:text-center shrink-0">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold leading-none border-2 ${activeRank >= 2 ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-gray-200 text-gray-400'}`}>
                {activeRank > 2 ? '✓' : '2'}
              </div>
              <div>
                <p className="font-bold text-xs text-gray-900 leading-tight">Pembayaran</p>
                <p className="text-[10px] text-gray-400">Escrow Uang Ditabung</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex sm:flex-col items-center gap-3 sm:gap-2 relative z-10 text-left sm:text-center shrink-0">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold leading-none border-2 ${activeRank >= 3 ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-gray-200 text-gray-400'}`}>
                {activeRank > 3 ? '✓' : '3'}
              </div>
              <div>
                <p className="font-bold text-xs text-gray-900 leading-tight">Pengerjaan</p>
                <p className="text-[10px] text-gray-400">Helper Mulai Garap Tugas</p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex sm:flex-col items-center gap-3 sm:gap-2 relative z-10 text-left sm:text-center shrink-0">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold leading-none border-2 ${activeRank >= 4 ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-gray-200 text-gray-400'}`}>
                {activeRank > 4 ? '✓' : '4'}
              </div>
              <div>
                <p className="font-bold text-xs text-gray-900 leading-tight">Kirim Hasil</p>
                <p className="text-[10px] text-gray-400">Revisi & Cek Preview File</p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex sm:flex-col items-center gap-3 sm:gap-2 relative z-10 text-left sm:text-center shrink-0">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold leading-none border-2 ${activeRank >= 5 ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-gray-200 text-gray-400'}`}>
                5
              </div>
              <div>
                <p className="font-bold text-xs text-gray-900 leading-tight">Dana Cair</p>
                <p className="text-[10px] text-gray-400">Pemberian Rating Ulasan</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Core Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Order data and deliverables */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Order Details box */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5 shadow-sm">
            <h3 className="font-bold text-sm text-gray-950 uppercase tracking-wider font-mono">Lampiran Rincian Tugas</h3>
            
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 font-mono">Topik / Tema Tugas</p>
                  <p className="font-bold text-sm text-gray-900 mt-0.5">{pesanan.tugasTitle}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 font-mono">Batas Akhir (Deadline)</p>
                  <p className="font-bold text-sm text-amber-800 mt-0.5 font-mono">{pesanan.tugasDeadline}</p>
                </div>
              </div>

              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400 font-mono">Deskripsi Detail Instruksi</p>
                <p className="text-gray-600 mt-1 pl-3 border-l-2 border-emerald-500 bg-emerald-50/10 p-2 rounded whitespace-pre-line text-justify leading-relaxed">
                  {pesanan.tugasDesc}
                </p>
              </div>

              {pesanan.tugasFileName && (
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 font-mono">Lampiran Pemesan (File):</p>
                  <div className="mt-1 inline-flex items-center gap-1.5 p-2 bg-slate-50 rounded border text-slate-800 font-semibold font-mono">
                    <FileText className="w-4 h-4 text-slate-400" />
                    <span>{pesanan.tugasFileName}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* DELIVERABLES PREVIEW ACTION CONTAINER (If finished uploading results) */}
          {['selesai_menunggu_konfirmasi', 'selesai', 'rated'].includes(pesanan.status) && (
            <div className="bg-white rounded-2xl border border-emerald-100 p-6 space-y-5 shadow-md">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <h3>Dokumen Hasil Tugas Siap Diunduh!</h3>
              </div>

              <div className="bg-emerald-50/40 p-4 border border-emerald-100 rounded-xl space-y-3.5 text-xs text-gray-700">
                <p className="font-medium">
                  <strong>Catatan Helper:</strong> "{pesanan.hasilPekerjaanCatatan || 'Pekerjaan selesai digarap dengan baik. Link project terlampir.'}"
                </p>

                <div className="flex items-center gap-2">
                  <a 
                    href="#download"
                    onClick={(e) => { e.preventDefault(); alert('Simulasi Pengunduhan: File "' + (pesanan.hasilPekerjaanName || 'hasil-tugas.zip') + '" sedang disimpan.'); }}
                    className="inline-flex items-center gap-1.5 px-4.5 py-2 bg-[#0F7B4E] hover:bg-[#0B5E3C] text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm"
                  >
                    <Download className="w-4 h-4" /> Download Hasil ({pesanan.hasilPekerjaanName || 'hasil-tugas.zip'})
                  </a>
                </div>
              </div>

              {pesanan.status === 'selesai_menunggu_konfirmasi' && (
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button 
                    onClick={handleConfirmFinish}
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl uppercase tracking-wider cursor-pointer"
                  >
                    Setujui & Konfirmasi Selesai
                  </button>
                  <button 
                    onClick={handleRevisiClick}
                    className="flex-1 py-2.5 bg-white border border-red-500 hover:bg-red-50 text-red-700 font-bold text-xs rounded-xl uppercase tracking-wider cursor-pointer"
                  >
                    Ajukan Revisi via WhatsApp
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Order Historis timeline logger logs */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4 shadow-sm">
            <h3 className="font-bold text-sm text-gray-950 uppercase tracking-wider font-mono">Log Log Historis Escrow</h3>
            <div className="space-y-4 relative pl-4 border-l border-gray-100 ml-2">
              {pesanan.historis?.map((log, idx) => (
                <div key={idx} className="relative space-y-1">
                  <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-emerald-600 border border-white"></span>
                  <div className="flex justify-between text-[11px] font-medium text-gray-400">
                    <span className="font-bold uppercase tracking-wider text-gray-700">{log.status.replace('_', ' ')}</span>
                    <span className="font-mono">{new Date(log.date).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  {log.note && <p className="text-xs text-gray-600 font-medium">{log.note}</p>}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Side: Status Actions Helper box */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5 sticky top-24">
            <div className="space-y-1.5 border-b border-gray-50 pb-3">
              <p className="text-[10px] text-gray-400 uppercase font-mono leading-none">Rangkuman Pembayaran</p>
              <h4 className="text-xl font-bold font-display text-[#0F7B4E]">{formatRupiah(pesanan.totalBayar)}</h4>
            </div>

            {/* Active Control Buttons based on order stage */}
            <div className="space-y-3">
              {pesanan.status === 'menunggu_konfirmasi' && (
                <div className="text-center p-3 bg-amber-50 text-amber-800 rounded-xl border border-amber-100 text-xs">
                  ⏳ Menunggu konfirmasi kesiapan pengerjaan dari mahasiswa Helper.
                </div>
              )}

              {pesanan.status === 'menunggu_pembayaran' && (
                <div className="space-y-3.5">
                  <div className="p-3 bg-blue-50 text-blue-800 border border-blue-100 rounded-xl text-xs">
                    🔔 Jasa disetujui! Lakukan transfer pembayaran escrow agar helper dapat mulai menggarap tugas Anda.
                  </div>
                  <button 
                    onClick={() => onNavigate('pembayaran-escrow', { id_pesanan: pesanan.id })}
                    className="w-full py-3 bg-[#0F7B4E] hover:bg-[#0B5E3C] text-white font-extrabold text-xs uppercase rounded-xl tracking-wider cursor-pointer transition-all"
                  >
                    Bayar Sekarang
                  </button>
                </div>
              )}

              {pesanan.status === 'dibayar' && (
                <div className="p-3 bg-purple-50 text-purple-800 border border-purple-100 rounded-xl text-xs space-y-2">
                  <p>💼 Dana Escrow berhasil disimpan aman di sistem KampusFix.</p>
                  <p className="text-[10px] text-gray-500 font-semibold uppercase">Menunggu Helper Mulai Menggarap</p>
                </div>
              )}

              {pesanan.status === 'sedang_dikerjakan' && (
                <div className="p-3 bg-emerald-55 bg-emerald-50/50 text-[#0F7B4E] border border-emerald-100 rounded-xl text-xs space-y-3">
                  <p>🛠️ Helper Anda sedang giat-giatnya menggarap tugas!</p>
                  <p className="text-[10px] text-gray-500">Anda dapat memantau atau berdiskusi langsung.</p>
                  <a 
                    href={chatWA}
                    target="_blank"
                    rel="noreferrer"
                    className="block w-full py-2 bg-white text-center border border-emerald-600 rounded-lg text-xs font-bold text-[#0F7B4E]"
                  >
                    Chat Helper via WA
                  </a>
                </div>
              )}

              {pesanan.status === 'selesai' && (
                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 border text-slate-700 rounded-xl text-xs">
                    🤝 Transaksi rampung! Uang escrow telah dicairkan ke rekening helper Anda. Berikan ulasan bintang!
                  </div>
                  <button 
                    onClick={() => onNavigate('rating-page', { id_pesanan: pesanan.id })}
                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs uppercase rounded-xl cursor-pointer"
                  >
                    Beri Ulasan Bintang
                  </button>
                </div>
              )}

              {pesanan.status === 'rated' && (
                <div className="p-3 bg-green-50 border border-green-150 text-green-800 text-xs rounded-xl">
                  ✓ Transaksi rampung sempurna! Anda telah memberikan bintang ulasan untuk helper ini. Terima kasih!
                </div>
              )}
            </div>

            <div className="pt-3.5 border-t border-gray-100 space-y-2.5 text-xs">
              <p className="text-[10px] font-bold text-gray-400 font-mono uppercase">Data Mahasiswa Helper</p>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Nama Lengkap:</span>
                <span className="font-bold text-gray-800">{pesanan.penyediaName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Grup WA Direct:</span>
                <a 
                  href={`https://wa.me/${pesanan.penyediaWhatsapp}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="font-bold text-emerald-700 hover:underline inline-flex items-center gap-0.5"
                >
                  Hubungi WA Helper <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}


/* ============================================================================
   3. PENGISIAN PEMBAYARAN ESCROW (pembayaran.html)
   ============================================================================ */
interface PembayaranPageProps {
  onNavigate: (view: string, params?: any) => void;
  activeUser: User | null;
  params?: { id_pesanan?: string };
  refreshTrigger: number;
  onPaymentSuccess: () => void;
}

export function PembayaranPage({ onNavigate, activeUser, params, refreshTrigger, onPaymentSuccess }: PembayaranPageProps) {
  const [pesanan, setPesanan] = useState<Pesanan | null>(null);
  const [copiedText, setCopiedText] = useState(false);
  const [proofName, setProofName] = useState('');
  const [proofBase64, setProofBase64] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Custom Payment Types states
  const [paymentType, setPaymentType] = useState<'bank' | 'ewallet'>('bank');
  const [selectedBank, setSelectedBank] = useState('MANDIRI');
  const [selectedEwallet, setSelectedEwallet] = useState('GOPAY');
  const [senderName, setSenderName] = useState('');
  const [senderAccountOrPhone, setSenderAccountOrPhone] = useState('');
  const [bankPengirim, setBankPengirim] = useState('');

  useEffect(() => {
    if (params?.id_pesanan) {
      const p = KampusFixDB.getPesanan().find(x => x.id === params.id_pesanan);
      if (p) setPesanan(p);
    }
  }, [params, refreshTrigger]);

  if (!activeUser) return null;

  if (!pesanan) return <div className="text-center py-20 text-xs">Eror: Pesanan tidak valid.</div>;

  const getAccountNo = () => {
    if (paymentType === 'bank') {
      if (selectedBank === 'MANDIRI') return '12300099887766';
      if (selectedBank === 'BCA') return '770123456789';
      if (selectedBank === 'BNI') return '009876543210';
      return '002112233445'; // BRI
    } else {
      return '081234567890'; // E-wallet
    }
  };

  const handleCopyNo = () => {
    navigator.clipboard.writeText(getAccountNo());
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 1500);
  };

  const handleProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProofName(file.name);
      const render = new FileReader();
      render.onloadend = () => {
        setProofBase64(render.result as string);
      };
      render.readAsDataURL(file);
    }
  };

  const handleProofSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofBase64) {
      alert('Unggah bukti transfer pembayaran Anda.');
      return;
    }
    if (!senderName) {
      alert('Nama pengirim atau akun wajib diisi sebagai identifikasi verifikasi.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      // update payment status to "dibayar"
      const orders = KampusFixDB.getPesanan();
      const idx = orders.findIndex(x => x.id === pesanan.id);
      if (idx !== -1) {
        orders[idx].buktiPembayaran = proofBase64;
        orders[idx].buktiPembayaranName = proofName;
        // save additional payment meta
        (orders[idx] as any).tipePembayaran = paymentType;
        (orders[idx] as any).metodePembayaranPilihan = paymentType === 'bank' ? `Transfer Bank - ${selectedBank}` : `E-Wallet - ${selectedEwallet}`;
        (orders[idx] as any).namaPengirimPembayaran = senderName;
        (orders[idx] as any).rekeningPengirimPembayaran = senderAccountOrPhone;
        KampusFixDB.savePesanan(orders);
        
        KampusFixDB.updatePesananStatus(pesanan.id, 'dibayar', 'Bukti transfer diunggah oleh ' + activeUser.name + '. Admin mengonfirmasi dana Escrow Aman.');
        
        // Also call single-item sync write through to Firestore
        KampusFixDB.syncSingleItem('pesanan', orders[idx]);

        onPaymentSuccess();
        onNavigate('status-pesanan', { id_pesanan: pesanan.id });
      }
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-150">
      
      <button 
        onClick={() => onNavigate('status-pesanan', { id_pesanan: pesanan.id })}
        className="text-xs text-gray-500 hover:text-emerald-700 flex items-center gap-1 cursor-pointer font-medium"
      >
        <ArrowLeft className="w-4 h-4" /> Batal pembayaran
      </button>

      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-display font-extrabold text-gray-950">Konfirmasi Pembayaran Escrow</h1>
        <p className="text-xs text-gray-400">Silakan selesaikan pembayaran agar Helper Anda segera mulai mengerjakan tugas</p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#0F7B4E]/10 shadow-lg space-y-6">
        
        <div className="bg-emerald-50 text-[#0F7B4E] border border-emerald-100 p-4 rounded-xl flex items-center justify-between text-xs font-bold font-mono">
          <span>Nilai Tagihan Pembayaran:</span>
          <span className="text-sm font-extrabold font-display">{formatRupiah(pesanan.totalBayar)}</span>
        </div>

        {/* Tab Selector Bank vs E-Wallet */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 border rounded-xl text-center font-bold">
          <button
            type="button"
            onClick={() => setPaymentType('bank')}
            className={`py-2 text-xs rounded-lg cursor-pointer transition-all ${paymentType === 'bank' ? 'bg-white text-[#0F7B4E] shadow-sm font-extrabold' : 'text-gray-500 hover:text-gray-800'}`}
          >
            🏛️ Transfer Bank
          </button>
          <button
            type="button"
            onClick={() => setPaymentType('ewallet')}
            className={`py-2 text-xs rounded-lg cursor-pointer transition-all ${paymentType === 'ewallet' ? 'bg-white text-[#0F7B4E] shadow-sm font-extrabold' : 'text-gray-500 hover:text-gray-800'}`}
          >
            📱 E-Wallet & QRIS
          </button>
        </div>

        {/* Option sub-selects */}
        {paymentType === 'bank' ? (
          <div className="space-y-4">
            <p className="text-[10px] font-mono uppercase text-gray-450 font-bold tracking-wider leading-none">Pilih Bank Rekening Escrow</p>
            <div className="grid grid-cols-4 gap-2 text-center">
              {['MANDIRI', 'BCA', 'BNI', 'BRI'].map(bank => (
                <button
                  type="button"
                  key={bank}
                  onClick={() => setSelectedBank(bank)}
                  className={`py-2 border text-[10px] font-mono font-bold rounded-lg cursor-pointer transition-all ${selectedBank === bank ? 'border-[#0F7B4E] bg-emerald-50/50 text-[#0F7B4E]' : 'border-gray-200 text-gray-600 hover:bg-slate-50'}`}
                >
                  {bank}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-[10px] font-mono uppercase text-gray-450 font-bold tracking-wider leading-none">Pilih E-Wallet Escrow</p>
            <div className="grid grid-cols-4 gap-2 text-center">
              {['GOPAY', 'OVO', 'DANA', 'QRIS'].map(wallet => (
                <button
                  type="button"
                  key={wallet}
                  onClick={() => setSelectedEwallet(wallet)}
                  className={`py-2 border text-[10px] font-mono font-bold rounded-lg cursor-pointer transition-all ${selectedEwallet === wallet ? 'border-[#0F7B4E] bg-emerald-50/50 text-[#0F7B4E]' : 'border-gray-200 text-gray-600 hover:bg-slate-50'}`}
                >
                  {wallet}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Payment Account Details */}
        <div className="bg-slate-50 border p-4.5 rounded-xl space-y-3.5 text-xs">
          <p className="font-bold border-b border-gray-200 pb-1.5 uppercase font-mono text-[10px] text-gray-500">
            Tujuan {paymentType === 'bank' ? 'Rekening' : 'Nomor HP'} Escrow Penampung KampusFix
          </p>
          
          <div className="space-y-1.5">
            <p className="text-gray-500 leading-none">{paymentType === 'bank' ? 'Bank Penerima:' : 'E-wallet Penerima:'}</p>
            <p className="font-extrabold text-sm text-gray-800">
              {paymentType === 'bank' ? `BANK ${selectedBank}` : (selectedEwallet === 'QRIS' ? 'QRIS OVERALL MERCHANT' : selectedEwallet)}
            </p>
          </div>
          
          {!(paymentType === 'ewallet' && selectedEwallet === 'QRIS') && (
            <div className="space-y-1.5">
              <p className="text-gray-500 leading-none">{paymentType === 'bank' ? 'Nomor Rekening Virtual Account:' : 'Nomor Akun HP Merchant:'}</p>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-extrabold tracking-wider text-gray-950">
                  {getAccountNo()}
                </span>
                <button 
                  onClick={handleCopyNo}
                  className="text-[10px] text-[#0F7B4E] hover:underline font-bold cursor-pointer bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded"
                >
                  {copiedText ? 'Disalin! ✓' : 'Salin Nomor'}
                </button>
              </div>
            </div>
          )}

          {paymentType === 'ewallet' && selectedEwallet === 'QRIS' && (
            <div className="flex flex-col items-center bg-white p-4 rounded-xl border border-dashed border-gray-200 gap-1 text-center">
              <div className="w-40 h-40 bg-slate-100 rounded-lg flex items-center justify-center font-bold text-[10px] text-gray-400">
                <img 
                  src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=PT%20KAMPUSFIX%20MEDIATOR%20UTAMA" 
                  alt="QRIS Code KampusFix" 
                  className="w-full h-full rounded object-contain p-1"
                />
              </div>
              <p className="text-[9px] text-[#0F7B4E] font-extrabold uppercase tracking-wide mt-1 animate-pulse font-mono">Pindai Kode QRIS Resmi KampusFix</p>
            </div>
          )}

          <div className="space-y-1.5">
            <p className="text-gray-500 leading-none">Atas Nama Rekening/Merchant:</p>
            <p className="font-bold text-gray-800">PT KAMPUSFIX MEDIATOR UTAMA</p>
          </div>
        </div>

        {/* Verification Form Inputs */}
        <div className="border border-emerald-200/50 bg-[#0F7B4E]/5 p-4 rounded-xl space-y-4 text-xs">
          <p className="font-bold border-b border-[#0F7B4E]/10 pb-1.5 uppercase font-mono text-[10px] text-emerald-800">1. Konfirmasi Pengirim Dana Anda</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-gray-500 font-bold block">
                {paymentType === 'bank' ? 'Nama Atas Nama Rekening Pengirim:' : 'Nama Akun E-Wallet Pengirim:'}
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: John Doe"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className="w-full p-2 bg-white border rounded outline-none focus:border-[#0F7B4E]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-gray-500 font-bold block">
                {paymentType === 'bank' ? 'Nomor Rekening Pengirim (Opsional):' : 'Nomor HP Akun Pengirim:'}
              </label>
              <input
                type="text"
                placeholder={paymentType === 'bank' ? 'Contoh: 123456789' : 'Contoh: 0812xxxxxxxx'}
                value={senderAccountOrPhone}
                onChange={(e) => setSenderAccountOrPhone(e.target.value)}
                className="w-full p-2 bg-white border rounded outline-none focus:border-[#0F7B4E]"
              />
            </div>
          </div>

          {paymentType === 'bank' && (
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-gray-500 font-bold block">Bank Pengirim Anda:</label>
              <input
                type="text"
                placeholder="Contoh: BRI / BCA / Mandiri / CIMB"
                value={bankPengirim}
                onChange={(e) => setBankPengirim(e.target.value)}
                className="w-full p-2 bg-white border rounded outline-none focus:border-[#0F7B4E]"
              />
            </div>
          )}
        </div>

        {/* Bukti upload form */}
        <form onSubmit={handleProofSubmit} className="space-y-4">
          <h3 className="font-bold text-xs uppercase text-gray-450 font-mono tracking-wider">2. Unggah Bukti Resi Transfer</h3>
          
          <div className="relative border-2 border-dashed border-gray-200 hover:border-[#0F7B4E] hover:bg-emerald-50/20 text-center p-6 rounded-xl transition-all cursor-pointer">
            <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <span className="text-xs text-gray-500 block font-bold">
              {proofName ? proofName : 'Seret file atau klik untuk memilih gambar/resi'}
            </span>
            <span className="text-[10px] text-gray-400 block mt-1">Format gambar JPG, PNG atau PDF berukuran maks 2MB</span>
            <input 
              type="file" 
              required
              onChange={handleProofChange}
              className="absolute inset-0 opacity-0 cursor-pointer w-full"
            />
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-[#0F7B4E] hover:bg-[#0B5E3C] text-white text-xs font-bold uppercase tracking-wider font-mono rounded-xl cursor-pointer shadow-md"
          >
            {isSubmitting ? 'Mengirim Data resi...' : 'Kirim Bukti Pembayaran'}
          </button>
        </form>

      </div>
    </div>
  );
}


/* ============================================================================
   4. PENILAIAN RATING & ULASAN (rating.html)
   ============================================================================ */
interface RatingPageProps {
  onNavigate: (view: string, params?: any) => void;
  activeUser: User | null;
  params?: { id_pesanan?: string };
  refreshTrigger: number;
  onRatingSubmit: () => void;
}

export function RatingPage({ onNavigate, activeUser, params, refreshTrigger, onRatingSubmit }: RatingPageProps) {
  const [pesanan, setPesanan] = useState<Pesanan | null>(null);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [ulasan, setUlasan] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (params?.id_pesanan) {
      const p = KampusFixDB.getPesanan().find(x => x.id === params.id_pesanan);
      if (p) setPesanan(p);
    }
  }, [params, refreshTrigger]);

  if (!activeUser) return null;

  if (!pesanan) return <div className="text-center py-20 text-xs">Eror: Transaksi pesanan tidak valid.</div>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ulasan.trim()) {
      alert('Mohon ketik ulasan atau tanggapan Anda untuk Helper.');
      return;
    }

    setIsSaving(true);

    setTimeout(() => {
      // 1. save review matching Jasa
      KampusFixDB.addReview(
        pesanan.jasaId,
        rating,
        ulasan,
        activeUser.name,
        activeUser.avatar
      );

      // 2. update order status to rated
      const orders = KampusFixDB.getPesanan();
      const idx = orders.findIndex(x => x.id === pesanan.id);
      if (idx !== -1) {
        orders[idx].status = 'rated';
        orders[idx].rating = rating;
        orders[idx].ulasan = ulasan;
        orders[idx].historis.push({
          status: 'rated',
          date: new Date().toISOString(),
          note: `Ulasan ${rating} bintang diberikan oleh pemesan.`
        });
        
        KampusFixDB.savePesanan(orders);
        
        // Single document real-time push write
        KampusFixDB.syncSingleItem('pesanan', orders[idx]);
      }

      onRatingSubmit();
      onNavigate('dashboard-pencari');
      setIsSaving(false);
    }, 800);
  };

  return (
    <div className="max-w-md mx-auto my-12 p-6 sm:p-8 bg-white border border-gray-100 rounded-2xl shadow-xl space-y-6 animate-in fade-in duration-200">
      
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-display font-extrabold text-gray-950">Beri Ulasan Helper</h1>
        <p className="text-xs text-gray-400 text-justify">Tugas Anda telah selesai digarap. Berikan bintang ulasan atas kinerja {pesanan.penyediaName} demi meningkatkan reputasinya.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Star Rating selector */}
        <div className="space-y-2 text-center">
          <label className="text-xs font-bold text-gray-500 block">Kualitas Hasil Pekerjaan</label>
          <div className="flex justify-center gap-1.5">
            {Array.from({ length: 5 }).map((_, idx) => {
              const starVal = idx + 1;
              return (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setRating(starVal)}
                  onMouseEnter={() => setHoverRating(starVal)}
                  onMouseLeave={() => setHoverRating(null)}
                  className="p-1 focus:outline-none hover:scale-110 cursor-pointer transition-transform"
                >
                  <Star 
                    className={`w-9 h-9 ${starVal <= (hoverRating || rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} 
                  />
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-700 block">Tulis Ulasan & Komentar</label>
          <textarea 
            rows={4}
            required
            placeholder="Tulis kritik & saran yang konstruktif untuk helper Anda..."
            value={ulasan}
            onChange={(e) => setUlasan(e.target.value)}
            className="w-full text-xs p-3 border border-gray-200 focus:border-[#0F7B4E] outline-none rounded-xl"
          />
        </div>

        <button 
          type="submit"
          disabled={isSaving}
          className="w-full py-3 bg-[#0F7B4E] hover:bg-[#0B5E3C] text-white text-xs font-bold uppercase tracking-wider font-mono rounded-xl cursor-pointer"
        >
          {isSaving ? 'Menyimpan Ulasan...' : 'Kirim Ulasan Bintang'}
        </button>

      </form>
    </div>
  );
}
