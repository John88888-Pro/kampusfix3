/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  Mail, 
  PhoneCall, 
  AlertCircle, 
  CheckCircle,
  HelpCircle,
  Clock,
  Key,
  ArrowLeft
} from 'lucide-react';
import { User, Notifikasi } from '../types';
import { KampusFixDB } from '../data/db';

/* ============================================================================
   1. TENTANG PAGE VIEW
   ============================================================================ */
export function TentangPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-12 animate-in fade-in duration-200">
      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl font-display font-black text-gray-950 tracking-tight leading-none">
          Tentang Kampus<span className="text-[#0F7B4E]">Fix</span>
        </h1>
        <p className="text-gray-500 text-sm max-w-xl mx-auto">
          Membangun jembatan tolong-menolong akademis dan ekonomi di lingkungan civitas akademika kampus.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 space-y-6 shadow-sm leading-relaxed">
        <h2 className="text-lg font-bold text-gray-950">Visi & Misi Kami</h2>
        <p className="text-xs sm:text-sm text-gray-655">
          KampusFix didirikan oleh sekumpulan mahasiswa yang melihat tingginya beban akademis kuliah serta minimnya kesempatan mahasiswa untuk mendapatkan penghasilan tambahan yang fleksibel di lingkungan kampus. Banyak sekali teman sejawat kita yang memiliki keahlian luar biasa seperti programming, desain grafis, editing video, ataupun mengajar, namun tidak memiliki wadah untuk memasarkan jasa mereka secara profesional.
        </p>
        <p className="text-xs sm:text-sm text-gray-655">
          Di sisi lain, mahasiswa yang sibuk bersosialisasi, bekerja paruh waktu, atau mengurus kepanitiaan sering kali membutuhkan asisten tepercaya demi menuntaskan pemahaman tugas kuliah mereka dengan bimbingan personal.
        </p>

        <h3 className="font-bold text-sm text-gray-950 uppercase tracking-wider font-mono">Nilai Utama KampusFix</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100/50 space-y-2">
            <h4 className="font-bold text-xs text-[#0F7B4E]">Aman Terpercaya (Escrow System)</h4>
            <p className="text-[11px] text-gray-600">Menjaga pembayaran dari risiko penipuan antara sesama mahasiswa.</p>
          </div>
          <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-100/50 space-y-2">
            <h4 className="font-bold text-xs text-purple-700">Pemberdayaan Finansial</h4>
            <p className="text-[11px] text-gray-600">Membantu mahasiswa bertalenta menjadi mandiri secara finansial.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   2. KONTAK & FORM PAGE VIEW
   ============================================================================ */
export function KontakPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-8 animate-in fade-in duration-200">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-display font-black text-gray-950 tracking-tight">Hubungi Tim KampusFix</h1>
        <p className="text-gray-500 text-xs">Punya pertanyaan, kendala sistem, atau ingin mendaftar sebagai sponsor?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Info */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 space-y-6 shadow-sm">
          <h2 className="font-bold text-sm uppercase font-mono tracking-wider text-gray-900">Saluran Bantuan</h2>
          <p className="text-xs text-gray-500">
            Tim Support Customer Service KampusFix selalu siap melayani setiap keluhan Anda terkait transaksi escrow ataupun klaim helper dalam waktu 24 jam.
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3 text-xs">
              <Mail className="w-5 h-5 text-[#0F7B4E] shrink-0" />
              <div>
                <p className="font-bold text-gray-800">Email Hubungan Publik</p>
                <p className="text-gray-500">support@kampusfix.id</p>
              </div>
            </div>
            <div className="flex items-start gap-3 text-xs">
              <PhoneCall className="w-5 h-5 text-[#0F7B4E] shrink-0" />
              <div>
                <p className="font-bold text-gray-800">WhatsApp Hotline Admin</p>
                <p className="text-gray-500">+62 821-2345-6789</p>
              </div>
            </div>
            <div className="flex items-start gap-3 text-xs">
              <MapPin className="w-5 h-5 text-[#0F7B4E] shrink-0" />
              <div>
                <p className="font-bold text-gray-800">Sekretariat Utama</p>
                <p className="text-gray-500">Kantor Inkubator Bisnis Mahasiswa Gedung C Lt. 3 Universitas Indonesia</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          {submitted ? (
            <div className="text-center py-12 space-y-3">
              <CheckCircle className="w-12 h-12 text-[#0F7B4E] mx-auto animate-bounce" />
              <h3 className="font-bold text-sm text-gray-900">Pesan Terkirim Berhasil!</h3>
              <p className="text-xs text-gray-500">
                Terima kasih atas masukannya. Tim admin kami akan segera menghubungi Anda kembali via email resmi.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="font-bold text-sm text-gray-900">Kirim Tiket Aduan</h3>
              
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-600 block">Nama Lengkap Anda</label>
                <input 
                  type="text"
                  required 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Doni Gunawan"
                  className="w-full text-xs p-2.5 border border-gray-200 focus:border-[#0F7B4E] focus:outline-none rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-600 block">Email Mahasiswa</label>
                <input 
                  type="email"
                  required 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="doni@mahasiswa.ac.id"
                  className="w-full text-xs p-2.5 border border-gray-200 focus:border-[#0F7B4E] focus:outline-none rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-600 block">Subjek Aduan</label>
                <input 
                  type="text"
                  required 
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Contoh: Pertanyaan Escrow Pembayaran"
                  className="w-full text-xs p-2.5 border border-gray-200 focus:border-[#0F7B4E] focus:outline-none rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-600 block">Deskripsi Detail Pesan</label>
                <textarea 
                  rows={4}
                  required 
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tuliskan keluhan atau kendala transaksimu disini..."
                  className="w-full text-xs p-2.5 border border-gray-200 focus:border-[#0F7B4E] focus:outline-none rounded-lg"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-2 bg-[#0F7B4E] hover:bg-[#0B5E3C] text-white font-bold text-xs rounded-lg uppercase tracking-wide cursor-pointer"
              >
                Kirim Aduan
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   3. PRIVASI & TERMS PAGE VIEW
   ============================================================================ */
export function PrivasiPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8 animate-in fade-in duration-200">
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-display font-black text-gray-950 tracking-tight leading-none text-center">
          Kebijakan Privasi & Syarat Ketentuan
        </h1>
        <p className="text-gray-400 text-xs">Pembaruan Terakhir: 11 Juni 2026</p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm text-xs sm:text-sm text-gray-600 space-y-6 leading-relaxed text-justify">
        <p>
          Selamat datang di KampusFix. Dokumen Kebijakan Privasi dan Ketentuan ini dibuat demi kelancaran dan legalitas bersama selama berinteraksi di forum penawaran jasa mahasiswa kami.
        </p>

        <h3 className="font-extrabold text-sm text-gray-900 font-display">1. Definisi Kontrak & Pihak Terkait</h3>
        <p>
          KampusFix memposisikan diri semata-mata sebagai platform mediator penyedia jasa (helper) dan pencari solusi tugas (pencari jasa). Segala bentuk kesepakatan akademis atau materi pembelajaran di luar sistem escrow KampusFix bukan merupakan tanggung jawab kami.
        </p>

        <h3 className="font-extrabold text-sm text-gray-900 font-display">2. Kebijakan Batasan Nilai Akademis (Plagiarisme)</h3>
        <p>
          Seluruh jasa bantuan tugas yang berada di KampusFix ditujukan sebagai media bimbingan, asisten referensi, mentoring penyusunan, serta pemberian contoh pengerjaan tugas demi peningkatan pemahaman materi mahasiswa yang bersangkutan. Mahasiswa sangat dilarang keras mengumpulkan mentah-mentah hasil asisten KampusFix tanpa merubah format atau mencantumkan kutipan orisinal referensi di bawah ketentuan integritas kampus masing-masing.
        </p>

        <h3 className="font-extrabold text-sm text-gray-900 font-display">3. Hukum Keamanan Transaksi Escrow</h3>
        <p>
          Setiap pencari yang menyetujui pemesanan diwajibkan menyetorkan dana sesuai kesepakatan di depan (upfront) ke dalam rekening penampung (escrow KampusFix). Helper wajib menerima konfirmasi pesanan telah "Dibayar" di dashboard sebelum mulai melakukan eksekusi pekerjaan agar jaminan pembayaran 100% terlindungi.
        </p>
      </div>
    </div>
  );
}

/* ============================================================================
   4. LUPA PASSWORD PAGE VIEW (Halaman 19)
   ============================================================================ */
export function LupaPasswordPage({ onNavigate }: { onNavigate: (view: string, params?: any) => void }) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    alert(`Link reset sandi berhasil dikirim ke email: ${email}`);
  };

  return (
    <div className="max-w-md mx-auto my-12 p-6 bg-white rounded-2xl border border-gray-100 shadow-xl space-y-6 animate-in fade-in duration-200">
      <div className="text-center space-y-2">
        <div className="mx-auto h-12 w-12 rounded-xl bg-emerald-50 text-[#0F7B4E] flex items-center justify-center text-xl font-bold">
          🔑
        </div>
        <h2 className="text-xl font-display font-extrabold text-gray-950">
          Lupa Kata Sandi?
        </h2>
        <p className="text-xs text-gray-400">Masukkan email Anda untuk menerima tautan pemulihan kata sandi KampusFix.</p>
      </div>

      {sent ? (
        <div className="space-y-4 text-center">
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-semibold">
            ✓ Tautan pemulihan kata sandi telah dikirim ke email Anda. Silakan periksa folder Inbox atau Spam Anda.
          </div>
          <button 
            type="button"
            onClick={() => onNavigate('login', { tab: 'masuk' })}
            className="text-xs font-bold text-[#0F7B4E] hover:underline flex items-center gap-1 justify-center mx-auto cursor-pointer border-none bg-transparent"
          >
            <ArrowLeft className="w-3 h-3" /> Kembali ke Login
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold tracking-wider uppercase text-gray-500 block font-mono">Email Terdaftar</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input 
                type="email"
                required
                placeholder="doni@mahasiswa.ac.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs pl-10 pr-4 py-3 border border-gray-200 focus:border-[#0F7B4E] rounded-xl outline-none"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-3 bg-[#0F7B4E] hover:bg-[#0B5E3C] text-white text-xs font-bold font-display uppercase tracking-wider rounded-xl cursor-pointer transition-colors"
          >
            Kirim Link Reset
          </button>

          <button 
            type="button"
            onClick={() => onNavigate('login', { tab: 'masuk' })}
            className="w-full text-center text-xs text-gray-500 hover:text-gray-800 font-semibold mt-2 block border-none bg-transparent cursor-pointer"
          >
            Batal & Kembali
          </button>
        </form>
      )}
    </div>
  );
}

/* ============================================================================
   5. NOTIFIKASI PAGE VIEW (Halaman 20 / P9)
   ============================================================================ */
export function NotifikasiPage({ 
  activeUser, 
  onNavigate,
  refreshTrigger,
  onMarkRead
}: { 
  activeUser: User | null; 
  onNavigate: (view: string, params?: any) => void;
  refreshTrigger: number;
  onMarkRead?: () => void;
}) {
  const [notifs, setNotifs] = useState<Notifikasi[]>([]);

  useEffect(() => {
    if (activeUser) {
      const all = KampusFixDB.getNotifications();
      const userNotifs = all.filter(n => n.userId === activeUser.id);
      setNotifs(userNotifs);
    }
  }, [activeUser, refreshTrigger]);

  const handleMarkAllRead = () => {
    if (!activeUser) return;
    const all = KampusFixDB.getNotifications();
    const updated = all.map(n => n.userId === activeUser.id ? { ...n, read: true } : n);
    KampusFixDB.saveNotifications(updated);
    setNotifs(updated.filter(n => n.userId === activeUser.id));
    if (onMarkRead) onMarkRead();
  };

  const handleItemClick = (n: Notifikasi) => {
    // mark single as read
    const all = KampusFixDB.getNotifications();
    const idx = all.findIndex(x => x.id === n.id);
    if (idx !== -1) {
      all[idx].read = true;
      KampusFixDB.saveNotifications(all);
    }
    
    if (onMarkRead) onMarkRead();

    // Navigate based on type
    if (n.pesananId) {
      if (activeUser?.role === 'penyedia') {
        onNavigate('detail-pesanan-penyedia', { id_pesanan: n.pesananId });
      } else {
        onNavigate('status-pesanan', { id_pesanan: n.pesananId });
      }
    } else if (n.jasaId) {
      onNavigate('detail-jasa', { id: n.jasaId });
    }
  };

  if (!activeUser) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-4 font-sans">
        <p className="text-4xl text-gray-400">🔒</p>
        <h2 className="text-xl font-bold text-gray-900">Akses Terbatas</h2>
        <p className="text-xs text-gray-500">Silakan login terlebih dahulu untuk melihat pemberitahuan Anda.</p>
        <button 
          onClick={() => onNavigate('login', { tab: 'masuk' })}
          className="px-4 py-2 bg-[#0F7B4E] hover:bg-[#0B5E3C] text-white rounded-lg text-xs font-bold font-sans cursor-pointer"
        >
          Login Sekarang
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-6 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-black text-gray-950 flex items-center gap-2">
            <span className="p-2 bg-emerald-50 rounded-lg text-[#0F7B4E]">🔔</span> Pusat Notifikasi
          </h1>
          <p className="text-xs text-gray-500 mt-1">Kelola pemberitahuan pemesanan dan pembaruan escrow Anda</p>
        </div>
        
        {notifs.some(n => !n.read) && (
          <button 
            onClick={handleMarkAllRead}
            className="flex items-center gap-1 text-xs font-semibold text-[#0F7B4E] hover:underline bg-transparent border-none cursor-pointer"
          >
            Tandai Semua Dibaca
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
        {notifs.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <p className="text-3xl font-sans">📭</p>
            <h3 className="font-bold text-sm text-gray-800">Tidak Ada Notifikasi</h3>
            <p className="text-xs text-gray-400">Semua pemberitahuan Anda akan muncul di halaman ini.</p>
          </div>
        ) : (
          notifs.map(n => (
            <div 
              key={n.id}
              onClick={() => handleItemClick(n)}
              className={`p-5 cursor-pointer hover:bg-emerald-50/25 transition-colors flex items-start gap-4 ${!n.read ? 'bg-emerald-50/10 border-l-4 border-l-[#0F7B4E]' : ''}`}
            >
              <div className="p-2 rounded-xl bg-gray-50 border border-gray-100 shrink-0 text-lg">
                {n.type === 'pesanan' ? '📦' : '📌'}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-bold text-xs sm:text-sm text-gray-950">{n.title}</h3>
                  <span className="text-[10px] text-gray-400 font-mono shrink-0 flex items-center gap-0.5">
                    <Clock className="w-3 h-3" />
                    {new Date(n.createdAt).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{n.message}</p>
                {n.read ? (
                  <span className="text-[10px] text-gray-400 font-medium inline-block mt-1 font-mono">Dibaca</span>
                ) : (
                  <span className="text-[10px] text-[#0F7B4E] font-bold inline-block mt-1 font-mono bg-emerald-50 border border-emerald-100 px-1.5 py-0.2 rounded">Baru</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
