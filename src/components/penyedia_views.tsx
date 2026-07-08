/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Edit, 
  Check, 
  X, 
  Upload, 
  Sparkles, 
  Briefcase, 
  DollarSign, 
  Star, 
  Clock, 
  MessageSquare,
  FileText,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Download
} from 'lucide-react';
import { Jasa, Pesanan, User, Pendapatan, PenarikanDana } from '../types';
import { KampusFixDB } from '../data/db';
import { formatRupiah } from './ServiceViews';
import { getStatusBadge } from './Dashboards';

/* ============================================================================
   1. KELOLA JASA (CRUD LISTING) - (kelola-jasa.html)
   ============================================================================ */
interface KelolaJasaProps {
  onNavigate: (view: string, params?: any) => void;
  activeUser: User | null;
  refreshTrigger: number;
  onJasaDeleted: () => void;
}

export function KelolaJasa({ onNavigate, activeUser, refreshTrigger, onJasaDeleted }: KelolaJasaProps) {
  const [myJasaList, setMyJasaList] = useState<Jasa[]>([]);

  useEffect(() => {
    if (activeUser) {
      const all = KampusFixDB.getJasa();
      setMyJasaList(all.filter(j => j.penyediaId === activeUser.id));
    }
  }, [activeUser, refreshTrigger]);

  if (!activeUser) return null;

  const handleDelete = (id: string) => {
    const doubleCheck = window.confirm('Apakah Anda yakin ingin menghapus jasa ini secara permanen dari KampusFix?');
    if (doubleCheck) {
      KampusFixDB.deleteJasa(id);
      onJasaDeleted();
    }
  };

  const handleToggleStatus = (j: Jasa) => {
    const updatedStatus = j.status === 'aktif' ? 'nonaktif' : 'aktif';
    const updated = { ...j, status: updatedStatus as 'aktif' | 'nonaktif' };
    KampusFixDB.updateJasa(updated);
    onJasaDeleted(); // Trigger reload
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-200">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <button 
            onClick={() => onNavigate('dashboard-penyedia')}
            className="text-xs text-gray-500 hover:text-[#0F7B4E] flex items-center gap-1 cursor-pointer font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
          </button>
          <h1 className="text-xl sm:text-2xl font-display font-extrabold text-gray-950 mt-1">
            Daftar Portofolio Jasa Saya
          </h1>
          <p className="text-xs text-gray-400">Atur status online/offline, ubah harga, atau tambah penawaran keahlian baru</p>
        </div>

        <button 
          onClick={() => onNavigate('form-jasa')}
          className="flex items-center gap-1.5 px-4.5 py-2.5 bg-[#0F7B4E] hover:bg-[#0B5E3C] text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Tambah Jasa Baru
        </button>
      </div>

      {myJasaList.length === 0 ? (
        <div className="bg-white p-16 text-center border rounded-2xl space-y-4">
          <p className="text-3xl text-gray-400">🎒</p>
          <h4 className="font-bold text-sm text-gray-900">Belum Ada Jasa yang Anda Tawarkan</h4>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Mulailah memonetisasi bakat Anda dengan meluncurkan iklan jasa pertamamu! Desain slide presentasi, bimbingan coding UTS, dsb.
          </p>
          <button 
            onClick={() => onNavigate('form-jasa')}
            className="px-4 py-2 bg-emerald-50 hover:bg-[#0F7B4E] text-[#0F7B4E] hover:text-white rounded-lg text-xs font-bold"
          >
            Buat Jasa Pertama +
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myJasaList.map((j) => (
            <div 
              key={j.id} 
              className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col justify-between space-y-4 shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] bg-slate-50 text-emerald-800 px-2.5 py-0.5 rounded font-bold font-mono">
                    {j.category}
                  </span>
                  
                  {/* Active indicator */}
                  <button 
                    onClick={() => handleToggleStatus(j)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${j.status === 'aktif' ? 'bg-[#0F7B4E]' : 'bg-gray-200'}`}
                  >
                    <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${j.status === 'aktif' ? 'translate-x-4' : 'translate-x-0'}`} />
                  </button>
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-gray-900 line-clamp-2 leading-tight">{j.title}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>{j.ratingAvg || 'New'}</span>
                    <span>•</span>
                    <span>Terjual {j.totalSales} kali</span>
                  </div>
                </div>

                <p className="text-xs text-gray-500 line-clamp-2">{j.description}</p>
                <p className="font-extrabold text-sm text-[#0F7B4E] font-mono">{formatRupiah(j.price)}</p>
              </div>

              {/* Action buttons */}
              <div className="grid grid-cols-2 gap-2 border-t border-gray-50 pt-3">
                <button 
                  onClick={() => onNavigate('form-jasa', { edit_id: j.id })}
                  className="flex items-center justify-center gap-1 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-lg cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5" /> Edit Jasa
                </button>
                <button 
                  onClick={() => handleDelete(j.id)}
                  className="flex items-center justify-center gap-1 px-3 py-2 bg-red-50 hover:bg-red-500 text-red-650 hover:text-white rounded-lg text-xs font-bold cursor-pointer transition-colors border border-red-100 hover:border-transparent"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}


/* ============================================================================
   2. FORM TAMBAH / EDIT JASA (tambah-jasa.html / edit-jasa.html)
   ============================================================================ */
interface FormJasaProps {
  onNavigate: (view: string, params?: any) => void;
  activeUser: User | null;
  params?: { edit_id?: string };
  onJasaSaved: () => void;
}

export function FormJasa({ onNavigate, activeUser, params, onJasaSaved }: FormJasaProps) {
  const [editJasa, setEditJasa] = useState<Jasa | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Programming & Tech');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('1 Hari');
  const [featuresInput, setFeaturesInput] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (params?.edit_id) {
      const found = KampusFixDB.getJasa().find(x => x.id === params.edit_id);
      if (found) {
        setEditJasa(found);
        setTitle(found.title);
        setCategory(found.category);
        setDescription(found.description);
        setPrice(found.price.toString());
        setDuration(found.duration);
        setFeaturesInput(found.features.join(', '));
        setImageUrl(found.images[0] || 'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=600');
      }
    } else {
      // Default placeholder image for new service
      setImageUrl('https://images.unsplash.com/photo-1547082299-de196ea013d6?w=600');
    }
  }, [params]);

  if (!activeUser) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !price) {
      alert('Mohon isi parameter judul, deskripsi dan harga.');
      return;
    }

    const ftList = featuresInput.split(',').map(s => s.trim()).filter(Boolean);
    const parsedPrice = Number(price);

    if (editJasa) {
      // update
      const updated: Jasa = {
        ...editJasa,
        title,
        category,
        description,
        price: parsedPrice,
        duration,
        features: ftList.length > 0 ? ftList : ['Responsif', 'Revisi Cepat'],
        images: [imageUrl]
      };
      KampusFixDB.updateJasa(updated);
    } else {
      // create
      KampusFixDB.addJasa({
        title,
        category,
        description,
        price: parsedPrice,
        duration,
        features: ftList.length > 0 ? ftList : ['Responsif', 'Revisi Cepat'],
        images: [imageUrl],
        status: 'aktif'
      });
    }

    onJasaSaved();
    onNavigate('kelola-jasa');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6 animate-in fade-in duration-200">
      
      <button 
        onClick={() => onNavigate('kelola-jasa')}
        className="text-xs text-gray-500 hover:text-emerald-700 flex items-center gap-1 cursor-pointer font-medium"
      >
        <ArrowLeft className="w-4 h-4" /> Batal & Kembali
      </button>

      <div>
        <h1 className="text-2xl font-display font-extrabold text-gray-950">
          {editJasa ? 'Ubah Layanan Jasa Jualan' : 'Posting Jasa Layanan Baru'}
        </h1>
        <p className="text-xs text-gray-400">Tawarkan bakat serta keahlian UTS, UAS, desain presentasi, dsb di KampusFix</p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-800 block">Judul Profil Jasa Utama</label>
            <input 
              type="text"
              required
              placeholder="Contoh: Desain PPT Proposal Skripsi Kustom Minim Sektor"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xs p-2.5 border border-gray-200 focus:border-[#0F7B4E] rounded-xl outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-850 block">Pilih Kategori Bidang</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs p-2.5 border border-gray-200 rounded-xl bg-white outline-none focus:border-[#0F7B4E]"
              >
                <option value="Programming & Tech">Programming & Tech</option>
                <option value="Desain Grafis">Desain Grafis</option>
                <option value="Penulisan Makalah">Penulisan Makalah</option>
                <option value="Pembuatan PPT">Pembuatan PPT</option>
                <option value="Editing Video">Editing Video</option>
                <option value="Penerjemah">Penerjemah</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-850 block">Durasi Pengiriman Layanan (Estimasi)</label>
              <select 
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full text-xs p-2.5 border border-gray-200 rounded-xl bg-white outline-none focus:border-[#0F7B4E]"
              >
                <option value="1 Hari">Selesai 1 Hari (Kilat)</option>
                <option value="2-3 Hari">Selesai 2-3 Hari</option>
                <option value="3+ Hari">Selesai Lebih Dari 3 Hari</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-800 block">Jelaskan Fungsionalitas Lengkap Jasa</label>
            <textarea 
              rows={5}
              required
              placeholder="Ceritakan: apa saja yang dikuasai, benefit yang didapatkan pemesan, kualifikasi Anda, dsb..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xs p-2.5 border border-gray-200 focus:border-[#0F7B4E] rounded-xl outline-none text-justify whitespace-pre-line"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-850 block">Patokan Harga Layanan (Rp)</label>
              <input 
                type="number"
                required
                placeholder="Contoh: 150000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full text-xs p-2.5 border border-gray-200 focus:border-[#0F7B4E] rounded-xl outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-850 block">Fitur & Kelebihan (Pisahkan dengan Koma)</label>
              <input 
                type="text"
                placeholder="Contoh: Revisi Bebas, File Mentahan PSD, Fast response"
                value={featuresInput}
                onChange={(e) => setFeaturesInput(e.target.value)}
                className="w-full text-xs p-2.5 border border-gray-200 focus:border-[#0F7B4E] rounded-xl outline-none"
              />
            </div>
          </div>

          {/* Custom Upload Portofolio Cover Image */}
          <div className="space-y-2 border-2 border-dashed border-emerald-500/10 hover:border-[#0F7B4E] bg-emerald-50/5 p-5 rounded-2xl transition-all cursor-pointer text-left">
            <label className="text-xs font-extrabold text-[#0F7B4E] block uppercase tracking-wider font-mono">📁 Unggah Foto Banner/Cover Postingan Jasa Anda</label>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {imageUrl && (
                <div className="w-24 h-24 rounded-xl overflow-hidden border bg-slate-50 flex-shrink-0">
                  <img src={imageUrl} alt="Cover preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              )}
              
              <div className="flex-1 text-center sm:text-left space-y-1.5">
                <input 
                  type="file" 
                  accept="image/*"
                  id="jasa-cover-uploader"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const rd = new FileReader();
                      rd.onloadend = () => {
                        setImageUrl(rd.result as string);
                      };
                      rd.readAsDataURL(file);
                    }
                  }}
                />
                <label 
                  htmlFor="jasa-cover-uploader"
                  className="px-4 py-2 bg-[#0F7B4E] hover:bg-[#0B5E3C] text-white text-[10px] font-bold rounded-xl cursor-pointer inline-flex items-center gap-1.5 transition-colors uppercase font-mono tracking-wide"
                >
                  Pilih Gambar Sampul Jasa
                </label>
                <p className="text-[10px] text-gray-400 block font-medium">Format: JPG, PNG, atau WEBP. Gambar ini akan menjadi foto sampul penawaran.</p>
              </div>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-3 bg-[#0F7B4E] hover:bg-[#0B5E3C] text-white text-xs font-bold font-mono uppercase tracking-wider rounded-xl cursor-pointer"
          >
            {editJasa ? 'Simpan Perubahan' : 'Posting Jasa Saya'}
          </button>
        </form>
      </div>

    </div>
  );
}


/* ============================================================================
   3. DETAIL PESANAN SISI HELPER (Menerima, Tolak, Upload Hasil)
   ============================================================================ */
interface DetailPesananPenyediaProps {
  onNavigate: (view: string, params?: any) => void;
  activeUser: User | null;
  params?: { id_pesanan?: string };
  refreshTrigger: number;
  onStateUpdate: () => void;
}

export function DetailPesananPenyedia({ onNavigate, activeUser, params, refreshTrigger, onStateUpdate }: DetailPesananPenyediaProps) {
  const [pesanan, setPesanan] = useState<Pesanan | null>(null);
  const [hasilCatatan, setHasilCatatan] = useState('');
  const [hasilName, setHasilName] = useState('');
  const [hasilBase64, setHasilBase64] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (params?.id_pesanan) {
      const p = KampusFixDB.getPesanan().find(x => x.id === params.id_pesanan);
      if (p) setPesanan(p);
    }
  }, [params, refreshTrigger]);

  if (!activeUser) return null;

  if (!pesanan) return <div className="text-center py-20 text-xs">Pesanan tidak ditemukan.</div>;

  const handleAcceptOrder = () => {
    KampusFixDB.updatePesananStatus(pesanan.id, 'menunggu_pembayaran', 'Pengajuan disetujui oleh Helper ' + activeUser.name + '. Silakan lakukan pembayaran escrow.');
    onStateUpdate();
  };

  const handleDeclineOrder = () => {
    const cancelText = window.prompt('Alasan penolakan pesanan ini?');
    if (cancelText !== null) {
      KampusFixDB.updatePesananStatus(pesanan.id, 'ditolak', 'Ditolak: ' + (cancelText || 'Pembatasan waktu/slot pengerjaan helper penuh.'));
      onStateUpdate();
    }
  };

  const handleStartWorking = () => {
    KampusFixDB.updatePesananStatus(pesanan.id, 'sedang_dikerjakan', 'Helper ' + activeUser.name + ' mengonfirmasi mulai melakukan pengerjaan.');
    onStateUpdate();
  };

  const handleFileResultUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setHasilName(file.name);
      const read = new FileReader();
      read.onloadend = () => {
        setHasilBase64(read.result as string);
      };
      read.readAsDataURL(file);
    }
  };

  const handleSendResult = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasilBase64) {
      alert('Mohon pilih file zip/pdf hasil pekerjaan.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // Save deliverables and status atomically to avoid concurrent Firestore race overrides
      const all = KampusFixDB.getPesanan();
      const idx = all.findIndex(x => x.id === pesanan.id);
      if (idx !== -1) {
        all[idx].hasilPekerjaanFile = hasilBase64;
        all[idx].hasilPekerjaanName = hasilName;
        all[idx].hasilPekerjaanCatatan = hasilCatatan;
        all[idx].status = 'selesai_menunggu_konfirmasi';
        all[idx].historis.push({
          status: 'selesai_menunggu_konfirmasi',
          date: new Date().toISOString(),
          note: 'Helper mengupload hasil pekerjaan tugas: ' + hasilName
        });

        // Add corresponding Notification
        KampusFixDB.addNotification(
          pesanan.pencariId,
          'Pekerjaan Selesai!',
          `Penyedia ${activeUser.name} telah mengirim hasil pekerjaan tugas. Silakan konfirmasi.`,
          'pesanan',
          pesanan.id
        );

        KampusFixDB.savePesanan(all);
        
        // Single document real-time push write
        KampusFixDB.syncSingleItem('pesanan', all[idx]);

        onStateUpdate();
        onNavigate('dashboard-penyedia');
      }
      setIsLoading(false);
    }, 1000);
  };

  const chatPencari = `https://wa.me/${pesanan.pencariWhatsapp}?text=${encodeURIComponent(`Halo ${pesanan.pencariName}, saya ${activeUser.name} helper KampusFix Anda.`)}`;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-150">
      
      <div className="flex justify-between items-center text-xs">
        <button 
          onClick={() => onNavigate('dashboard-penyedia')}
          className="text-gray-500 hover:text-emerald-700 flex items-center gap-1 cursor-pointer font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali Dashboard
        </button>

        <span className="text-[10px] bg-slate-100 text-slate-700 px-3 py-1 border border-slate-200 rounded font-mono font-bold uppercase">
          Progres: {pesanan.status.replace('_', ' ').toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Detail Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">
            <div className="border-b border-gray-50 pb-3">
              <h3 className="font-extrabold text-sm text-gray-900 uppercase tracking-widest font-mono">Daftar Kerja Tambahan</h3>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 font-mono">Judul Kegiatan Pemesan</p>
                  <p className="font-bold text-sm text-gray-900 mt-0.5">{pesanan.tugasTitle}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 font-mono">Batas Akhir (Deadline)</p>
                  <p className="font-bold text-sm text-red-700 mt-0.5 font-mono">{pesanan.tugasDeadline}</p>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold text-gray-400 font-mono">Instruksi Pengerjaan Tugas</p>
                <p className="text-gray-600 bg-emerald-50/10 p-3.5 border-l-2 border-emerald-500 rounded mt-1 text-justify whitespace-pre-line leading-relaxed">
                  {pesanan.tugasDesc}
                </p>
              </div>

              {pesanan.tugasFileName && (
                <div>
                  <p className="text-[10px] font-bold text-gray-400 font-mono">Bahan PDF Pendukung:</p>
                  <button 
                    onClick={() => alert('Download file simulated matching: ' + pesanan.tugasFileName)}
                    className="mt-1 flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-bold"
                  >
                    <Download className="w-4.5 h-4.5" /> Download bahan ({pesanan.tugasFileName})
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* DELIVER PRODUCT RESULT UPLOAD (If state is sedang dikerjakan) */}
          {pesanan.status === 'sedang_dikerjakan' && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-emerald-100 shadow-md space-y-5">
              <div className="border-b border-gray-100 pb-3.5 flex items-center gap-2">
                <div className="h-6 w-6 rounded bg-emerald-100 flex items-center justify-center font-bold">🎯</div>
                <h3 className="font-bold text-sm text-emerald-800 uppercase tracking-wider font-mono">Upload Modul Hasil Pekerjaan</h3>
              </div>

              <form onSubmit={handleSendResult} className="space-y-4 text-xs">
                
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">Pilih Dokumen Tugas Hasil Garapan (.zip / .pdf)</label>
                  <div className="relative border border-dashed border-gray-250 p-6 rounded-xl hover:bg-emerald-50/20 text-center transition-all cursor-pointer">
                    <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <span className="font-bold block text-slate-500">
                      {hasilName ? hasilName : 'Pilih file hasil kerja'}
                    </span>
                    <input 
                      type="file" 
                      required
                      onChange={handleFileResultUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">Catatan/Pesan Tambahan untuk Pemesan</label>
                  <textarea 
                    rows={3}
                    placeholder="Contoh: Lampiran proposal bab 1-3 selesai digarap. Revisi UTS siap Kak."
                    value={hasilCatatan}
                    onChange={(e) => setHasilCatatan(e.target.value)}
                    className="w-full text-xs p-2.5 border border-gray-200 focus:border-[#0F7B4E] outline-none rounded-xl"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider font-mono rounded-xl cursor-pointer"
                >
                  {isLoading ? 'Mengirim berkas...' : 'Kirim Berkas Pekerjaan Selesai'}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Right Side Control Actions */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">
            <div className="border-b border-gray-55 pb-3">
              <p className="text-[10px] text-gray-400 uppercase font-mono leading-none">Net Pendapatan Bersih</p>
              <h4 className="text-xl font-bold text-[#0F7B4E] font-display mt-1">{formatRupiah(pesanan.jasaPrice)}</h4>
              <p className="text-[9px] text-gray-400 leading-none mt-1">Sistem Escrow otomatis memotong admin platform 5% dari pemesan.</p>
            </div>

            {/* Stage Actions */}
            <div className="space-y-3">
              {pesanan.status === 'menunggu_konfirmasi' && (
                <div className="space-y-2.5">
                  <div className="p-3 bg-amber-50 rounded-xl text-amber-800 text-xs text-justify">
                    💼 Pencari mengajukan tugas baru. Silakan terima jika waktu Anda memadai demi mengaktifkan rekening transfer pencari.
                  </div>
                  <button 
                    onClick={handleAcceptOrder}
                    className="w-full py-2.5 bg-[#0F7B4E] hover:bg-[#0B5E3C] text-white font-extrabold text-xs uppercase rounded-xl tracking-wider cursor-pointer"
                  >
                    Terima Pekerjaan
                  </button>
                  <button 
                    onClick={handleDeclineOrder}
                    className="w-full py-2 bg-white text-red-650 hover:bg-red-50 border border-red-200 rounded-xl text-xs font-bold uppercase cursor-pointer"
                  >
                    Tolak / Batalkan
                  </button>
                </div>
              )}

              {pesanan.status === 'menunggu_pembayaran' && (
                <div className="p-3 bg-blue-50 border text-blue-800 rounded-xl text-xs">
                  ⏳ Menunggu pencari mengupload bukti transfer dana escrow ke rekening bank KampusFix.
                </div>
              )}

              {pesanan.status === 'dibayar' && (
                <div className="space-y-2">
                  <div className="p-3 bg-purple-50 border text-purple-800 rounded-xl text-xs">
                    🔔 Dana Escrow sudah diamankan di KampusFix. Klik "Mulaikan Kerjakan" untuk memulai penggarapan tugas.
                  </div>
                  <button 
                    onClick={handleStartWorking}
                    className="w-full py-2.5 bg-[#0F7B4E] hover:bg-[#0B5E3C] text-white font-extrabold text-xs uppercase rounded-xl cursor-pointer"
                  >
                    Mulai Kerjakan
                  </button>
                </div>
              )}

              {pesanan.status === 'sedang_dikerjakan' && (
                <div className="p-3 bg-emerald-50 border text-[#0F7B4E] rounded-xl text-xs space-y-3">
                  <p>🛠️ Anda sedang dalam sesi pengerjaan. Segera selesaikan dan kumpulkan melalui upload form.</p>
                  <a 
                    href={chatPencari} 
                    target="_blank" 
                    rel="noreferrer"
                    className="block w-full py-2 bg-white text-center border border-emerald-600 rounded text-[#0F7B4E] font-bold"
                  >
                    Chat Pemesan via WA
                  </a>
                </div>
              )}

              {pesanan.status === 'selesai_menunggu_konfirmasi' && (
                <div className="p-3 bg-orange-50 border border-orange-100 text-orange-900 rounded-xl text-xs">
                  💼 Hasil tugas telah Anda upload. Menunggu konfirmasi kelayakan selesai dari mahasiswa pemesan.
                </div>
              )}

              {['selesai', 'rated'].includes(pesanan.status) && (
                <div className="p-3 bg-emerald-50 border text-emerald-800 rounded-xl text-xs">
                  ✓ Pekerjaan rampung 100%! Dana pembayaran bersih telah dicairkan ke tabungan saldo dompet Anda.
                </div>
              )}
            </div>

            <div className="border-t border-gray-100 pt-3.5 space-y-2.5 text-xs">
              <p className="text-[10px] font-bold text-gray-400 font-mono uppercase">Info Mahasiswa Pemesan</p>
              <div className="flex justify-between">
                <span className="text-gray-500">Nama Pemesan:</span>
                <span className="font-bold text-gray-800">{pesanan.pencariName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Hubungi WA:</span>
                <a 
                  href={`https://wa.me/${pesanan.pencariWhatsapp}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="font-bold text-emerald-700 hover:underline flex items-center gap-0.5"
                >
                  Direct chat <ExternalLink className="w-3 h-3" />
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
   4. RIWAYAT PENDAPATAN & KEUANGAN HELPER (riwayat-pendapatan.html)
   ============================================================================ */
interface RiwayatPendapatanProps {
  onNavigate: (view: string, params?: any) => void;
  activeUser: User | null;
  refreshTrigger: number;
}

export function RiwayatPendapatan({ onNavigate, activeUser, refreshTrigger }: RiwayatPendapatanProps) {
  const [revenues, setRevenues] = useState<Pendapatan[]>([]);
  const [success, setSuccess] = useState(false);

  // withdrawal form states
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);
  const [withdrawMethod, setWithdrawMethod] = useState<'bank' | 'ewallet'>('bank');
  const [withdrawBank, setWithdrawBank] = useState(activeUser?.rekeningBank || 'BCA');
  const [withdrawEwallet, setWithdrawEwallet] = useState('GOPAY');
  const [withdrawAccountNo, setWithdrawAccountNo] = useState('');
  const [withdrawAccountName, setWithdrawAccountName] = useState(activeUser?.rekeningNama || '');

  useEffect(() => {
    if (activeUser) {
      const all = KampusFixDB.getPendapatan().filter(r => r.penyediaId === activeUser.id);
      setRevenues(all);
      if (activeUser.rekeningBank) setWithdrawBank(activeUser.rekeningBank);
      if (activeUser.rekeningNama) setWithdrawAccountName(activeUser.rekeningNama);
    }
  }, [activeUser, refreshTrigger]);

  if (!activeUser) return null;

  const totalEarned = revenues.reduce((sum, item) => sum + item.amount, 0);
  const successCair = revenues.filter(r => r.statusCair).reduce((sum, item) => sum + item.amount, 0);
  
  // Real-time penarikan data
  const withdrawals = KampusFixDB.getPenarikanDana().filter(w => w.penyediaId === activeUser.id);
  const totalPendingWithdrawalAmount = withdrawals.filter(w => w.status === 'pending').reduce((sum, item) => sum + item.amount, 0);
  
  // Real withdrawable balance is unpaid revenues minus any amount that is currently pending approval
  const totalUnpaid = revenues.filter(r => !r.statusCair).reduce((sum, item) => sum + item.amount, 0);
  const pendingCair = Math.max(0, totalUnpaid - totalPendingWithdrawalAmount);

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check pending requests
    const hasPending = withdrawals.some(w => w.status === 'pending');
    if (hasPending) {
      alert('Anda masih memiliki pengajuan penarikan dana yang sedang diproses oleh Admin. Harap tunggu persetujuan.');
      return;
    }

    if (pendingCair === 0) {
      alert('Maaf, saldo dompet Anda yang tersedia untuk ditarik adalah Rp 0.');
      return;
    }
    if (!withdrawAccountNo) {
      alert('Mohon masukkan Nomor Rekening Bank atau Nomor HP E-Wallet.');
      return;
    }
    if (!withdrawAccountName) {
      alert('Mohon masukkan Atas Nama rekening/akun penerima tujuan.');
      return;
    }

    const methodLabel = withdrawMethod === 'bank' ? `Bank ${withdrawBank}` : `E-Wallet ${withdrawEwallet}`;
    
    // Create pending withdrawal request
    KampusFixDB.addPenarikanDana(
      activeUser.id,
      activeUser.name,
      methodLabel,
      withdrawAccountName,
      withdrawAccountNo,
      pendingCair
    );

    setSuccess(true);
    setShowWithdrawForm(false);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-200">
      
      <div>
        <button 
          onClick={() => onNavigate('dashboard-penyedia')}
          className="text-xs text-gray-500 hover:text-emerald-700 flex items-center gap-1 cursor-pointer font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
        </button>
        <h1 className="text-xl sm:text-2xl font-display font-extrabold text-gray-950 mt-1">Dompet Keuangan Helper</h1>
        <p className="text-xs text-gray-400">Tarik penghasilan jerih payah akademis Anda langsung ke kartu bank/e-wallet</p>
      </div>

      {success && (
        <div className="p-3 bg-emerald-50 border border-emerald-250 text-emerald-800 text-xs rounded-xl font-bold">
          ✓ Pengajuan pencairan berhasil diproses! Saldo akan mendarat di rekening Anda dalam 1x24 jam kerja.
        </div>
      )}

      {/* Metrics board */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-1">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">Total Akumulasi Hasil</p>
          <p className="text-xl font-extrabold text-gray-900 font-mono">{formatRupiah(totalEarned)}</p>
        </div>

        <div className="bg-emerald-950 text-emerald-100 p-5 rounded-2xl border border-emerald-900 shadow-md space-y-2">
          <p className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider font-mono">Belum Dicairkan (Dompet)</p>
          <p className="text-2xl font-extrabold font-mono text-emerald-400">{formatRupiah(pendingCair)}</p>
          {pendingCair > 0 && (
            <button 
              onClick={() => setShowWithdrawForm(prev => !prev)}
              className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 font-bold text-[10px] uppercase rounded cursor-pointer transition-colors"
            >
              {showWithdrawForm ? 'Tutup Formulir ✕' : 'Cairkan Sekarang 💸'}
            </button>
          )}
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-1">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">Telah Ditransfer Aman</p>
          <p className="text-xl font-extrabold text-gray-600 font-mono">{formatRupiah(successCair)}</p>
        </div>
      </div>

      {/* Toggled Withdrawal Form */}
      {showWithdrawForm && pendingCair > 0 && (
        <form onSubmit={handleWithdrawSubmit} className="bg-slate-50 border border-emerald-500/20 p-6 rounded-2xl shadow-sm space-y-4 text-xs animate-in slide-in-from-top-4 duration-250">
          <h3 className="font-bold text-[#0F7B4E] uppercase tracking-wider font-mono text-[10px] border-b border-gray-200 pb-2 flex items-center gap-1">
            💸 Form Pengajuan Pencairan Saldo Pendapatan
          </h3>
          <p className="text-[11px] text-gray-500">
            Penghasilan Anda sebesar <strong className="text-gray-900 font-mono">{formatRupiah(pendingCair)}</strong> akan ditransfer langsung ke rekening bank atau akun e-wallet Anda yang terverifikasi.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* 1. Method Select */}
            <div className="space-y-1 text-left">
              <label className="text-[10px] font-mono uppercase text-gray-500 font-bold block">Pilih Metode Pencairan:</label>
              <select
                value={withdrawMethod}
                onChange={(e) => setWithdrawMethod(e.target.value as 'bank' | 'ewallet')}
                className="w-full p-2.5 bg-white border border-gray-200 rounded-xl focus:border-[#0F7B4E] outline-none"
              >
                <option value="bank">🏛️ Transfer Bank</option>
                <option value="ewallet">📱 E-Wallet Elektronik</option>
              </select>
            </div>

            {/* 2. Bank / Wallet Choice */}
            {withdrawMethod === 'bank' ? (
              <div className="space-y-1 text-left">
                <label className="text-[10px] font-mono uppercase text-gray-500 font-bold block">Pilih Bank Tujuan:</label>
                <select
                  value={withdrawBank}
                  onChange={(e) => setWithdrawBank(e.target.value)}
                  className="w-full p-2.5 bg-white border border-gray-200 rounded-xl focus:border-[#0F7B4E] outline-none"
                >
                  <option value="BCA">BANK BCA</option>
                  <option value="MANDIRI">BANK MANDIRI</option>
                  <option value="BNI">BANK BNI</option>
                  <option value="BRI">BANK BRI</option>
                  <option value="CIMB">CIMB NIAGA</option>
                </select>
              </div>
            ) : (
              <div className="space-y-1 text-left">
                <label className="text-[10px] font-mono uppercase text-gray-500 font-bold block">Pilih E-Wallet Tujuan:</label>
                <select
                  value={withdrawEwallet}
                  onChange={(e) => setWithdrawEwallet(e.target.value)}
                  className="w-full p-2.5 bg-white border border-gray-200 rounded-xl focus:border-[#0F7B4E] outline-none"
                >
                  <option value="GOPAY">GOPAY (GoTo)</option>
                  <option value="OVO">OVO (Lippo)</option>
                  <option value="DANA">DANA INDONESIA</option>
                  <option value="LINKAJA">LINKAJA</option>
                  <option value="SHOPEEPAY">SHOPEEPAY</option>
                </select>
              </div>
            )}

            {/* 3. Account Number */}
            <div className="space-y-1 text-left">
              <label className="text-[10px] font-mono uppercase text-gray-500 font-bold block">
                {withdrawMethod === 'bank' ? 'Nomor Rekening Bank:' : 'Nomor HP Akun E-Wallet:'}
              </label>
              <input
                type="text"
                required
                placeholder={withdrawMethod === 'bank' ? 'Contoh: 123456789' : 'Contoh: 081234567890'}
                value={withdrawAccountNo}
                onChange={(e) => setWithdrawAccountNo(e.target.value)}
                className="w-full p-2.5 bg-white border border-gray-200 rounded-xl focus:border-[#0F7B4E] outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 4. Atas Nama */}
            <div className="space-y-1 text-left">
              <label className="text-[10px] font-mono uppercase text-gray-500 font-bold block">Atas Nama Pemilik Rekening/Akun:</label>
              <input
                type="text"
                required
                placeholder="Sesuai dengan nama terdaftar di buku tabungan/akun"
                value={withdrawAccountName}
                onChange={(e) => setWithdrawAccountName(e.target.value)}
                className="w-full p-2.5 bg-white border border-gray-200 rounded-xl focus:border-[#0F7B4E] outline-none"
              />
            </div>

            {/* 5. Simpan Konfirmasi Rekening */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-gray-400 font-bold block">&nbsp;</label>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#0F7B4E] hover:bg-[#0B5E3C] text-white font-extrabold uppercase rounded-xl tracking-wider cursor-pointer font-mono"
                >
                  Ajukan Transfer Sekarang
                </button>
                <button
                  type="button"
                  onClick={() => setShowWithdrawForm(false)}
                  className="px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-xl cursor-pointer font-mono"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Received income records */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden text-xs">
        <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center">
          <h3 className="font-bold text-sm uppercase text-gray-900 font-mono">Mutasi Pendapatan Tugas</h3>
          <span className="text-xs bg-slate-100 px-2.5 py-0.5 rounded-full font-bold">Total {revenues.length} Klaim</span>
        </div>

        <div className="overflow-x-auto">
          {revenues.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              Belum ada mutasi keuangan akademis yang terdaftar di sistem.
            </div>
          ) : (
            <table className="w-full text-left font-sans text-xs">
              <thead className="bg-slate-50 font-bold uppercase text-[10px] text-gray-505 border-b select-none">
                <tr>
                  <th className="px-6 py-3">Tanggal Selesai</th>
                  <th className="px-6 py-3">Judul Layanan Jasa</th>
                  <th className="px-6 py-3">Mahasiswa Pemesan</th>
                  <th className="px-6 py-3">Jumlah Bersih</th>
                  <th className="px-6 py-3 text-right">Status Cair</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {revenues.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50/20">
                    <td className="px-6 py-4 text-gray-400 font-mono font-medium">
                      {new Date(r.createdAt).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-950">
                      {r.jasaTitle}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-700">
                      {r.pencariName}
                    </td>
                    <td className="px-6 py-4 font-bold text-emerald-800 font-mono">
                      {formatRupiah(r.amount)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`px-2 py-0.5 rounded font-mono font-bold text-[9px] uppercase ${r.statusCair ? 'bg-slate-100 text-slate-800' : 'bg-emerald-100 text-emerald-800 animate-pulse'}`}>
                        {r.statusCair ? 'Sudah Ditransfer' : 'Dalam Dompet'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Withdrawals list */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden text-xs">
        <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
          <h3 className="font-bold text-sm uppercase text-gray-900 font-mono">Status Pengajuan Penarikan Dana (Withdrawals)</h3>
          <span className="text-xs bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold">Total {withdrawals.length} Pengajuan</span>
        </div>

        <div className="overflow-x-auto">
          {withdrawals.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              Belum ada riwayat pengajuan penarikan dana.
            </div>
          ) : (
            <table className="w-full text-left font-sans text-xs">
              <thead className="bg-slate-50 font-bold uppercase text-[10px] text-gray-500 border-b">
                <tr>
                  <th className="px-6 py-3">Tanggal Pengajuan</th>
                  <th className="px-6 py-3">Metode Tujuan</th>
                  <th className="px-6 py-3">No. Rekening / HP</th>
                  <th className="px-6 py-3">Nama Penerima</th>
                  <th className="px-6 py-3">Jumlah Tarik</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Catatan Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {withdrawals.map((w) => (
                  <tr key={w.id} className="hover:bg-gray-50/20">
                    <td className="px-6 py-4 text-gray-400 font-medium">
                      {new Date(w.createdAt).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-850">
                      {w.rekeningBank}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {w.rekeningNomor}
                    </td>
                    <td className="px-6 py-4 font-sans text-gray-700 font-semibold">
                      {w.rekeningNama}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">
                      {formatRupiah(w.amount)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded font-bold text-[9px] uppercase ${
                        w.status === 'disetujui' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : w.status === 'ditolak' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-amber-100 text-amber-800 animate-pulse'
                      }`}>
                        {w.status === 'disetujui' ? 'Berhasil Ditransfer' : w.status === 'ditolak' ? 'Ditolak' : 'Diproses Admin'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-sans text-gray-500 text-[11px]">
                      {w.catatanAdmin || '-'}
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

interface PesananMasukPageProps {
  onNavigate: (view: string, params?: any) => void;
  activeUser: User | null;
  refreshTrigger: number;
}

export function PesananMasukPage({ onNavigate, activeUser, refreshTrigger }: PesananMasukPageProps) {
  const [orders, setOrders] = useState<Pesanan[]>([]);
  const [filter, setFilter] = useState<string>('semua');

  useEffect(() => {
    if (activeUser) {
      const all = KampusFixDB.getPesanan().filter(p => p.penyediaId === activeUser.id);
      // Sort newest first
      setOrders(all.sort((a,b) => b.createdAt.localeCompare(a.createdAt)));
    }
  }, [activeUser, refreshTrigger]);

  if (!activeUser) return null;

  const filteredOrders = orders.filter(o => {
    if (filter === 'semua') return true;
    if (filter === 'baru') return o.status === 'menunggu_konfirmasi';
    if (filter === 'pengerjaan') return ['dibayar', 'sedang_dikerjakan', 'selesai_menunggu_konfirmasi'].includes(o.status);
    if (filter === 'selesai') return ['selesai', 'rated'].includes(o.status);
    if (filter === 'ditolak') return o.status === 'ditolak';
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6 animate-in fade-in duration-200">
      
      <div>
        <button 
          onClick={() => onNavigate('dashboard-penyedia')}
          className="text-xs text-gray-400 hover:text-[#0F7B4E] flex items-center gap-1 cursor-pointer font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
        </button>
        <h1 className="text-xl sm:text-2xl font-display font-extrabold text-[#0F7B4E] mt-1">
          Daftar Kelola Pesanan Masuk
        </h1>
        <p className="text-xs text-gray-500">Kelola konfirmasi, unduh deskripsi tugas, dan upload berkas pengerjaan untuk dicairkan</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-100 pb-3">
        {[
          { id: 'semua', label: 'Semua Pesanan' },
          { id: 'baru', label: 'Baru Masuk' },
          { id: 'pengerjaan', label: 'Sedang Berjalan' },
          { id: 'selesai', label: 'Selesai & Cair' },
          { id: 'ditolak', label: 'Ditolak' }
        ].map(tab => {
          const count = orders.filter(o => {
            if (tab.id === 'semua') return true;
            if (tab.id === 'baru') return o.status === 'menunggu_konfirmasi';
            if (tab.id === 'pengerjaan') return ['dibayar', 'sedang_dikerjakan', 'selesai_menunggu_konfirmasi'].includes(o.status);
            if (tab.id === 'selesai') return ['selesai', 'rated'].includes(o.status);
            if (tab.id === 'ditolak') return o.status === 'ditolak';
            return true;
          }).length;

          return (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${filter === tab.id ? 'bg-[#0F7B4E] text-white font-extrabold' : 'bg-slate-50 text-gray-500 hover:text-gray-800 border'}`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold ${filter === tab.id ? 'bg-white/20 text-white font-extrabold' : 'bg-slate-200 text-gray-655'}`}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* List content */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {filteredOrders.length === 0 ? (
            <div className="text-center p-16 space-y-3">
              <p className="text-2xl">📥</p>
              <h4 className="font-bold text-sm text-gray-800">Tidak Ada Pesanan Terkait</h4>
              <p className="text-xs text-gray-450">Pesanan dengan kategori ini belum terdaftar di dasbor helper Anda.</p>
            </div>
          ) : (
            <table className="w-full text-left font-sans text-xs">
              <thead className="bg-[#0F7B4E]/5 text-[10px] uppercase tracking-wider font-bold text-gray-500 border-b border-gray-100 select-none">
                <tr>
                  <th className="px-6 py-3.5">Kode / Tanggal</th>
                  <th className="px-6 py-3.5">Tugas Jasa</th>
                  <th className="px-6 py-3.5">Mahasiswa Pemesan</th>
                  <th className="px-6 py-3.5">Total Harga</th>
                  <th className="px-6 py-3.5">Status Progres</th>
                  <th className="px-6 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredOrders.map(ord => (
                  <tr key={ord.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4.5 space-y-0.5">
                      <p className="font-mono text-[10px] font-bold text-slate-400">#{ord.id.slice(8, 14).toUpperCase()}</p>
                      <p className="text-[10px] text-gray-400">{new Date(ord.createdAt).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'})}</p>
                    </td>
                    <td className="px-6 py-4.5 space-y-0.5">
                      <p className="font-bold text-gray-900 leading-snug">{ord.jasaTitle}</p>
                      <p className="text-[10px] text-gray-400 line-clamp-1 italic">"{ord.tugasTitle}"</p>
                    </td>
                    <td className="px-6 py-4.5 space-y-0.5">
                      <p className="font-semibold text-gray-800">{ord.pencariName}</p>
                      <p className="text-[10px] text-emerald-800 font-bold font-mono">WA: {ord.pencariWhatsapp}</p>
                    </td>
                    <td className="px-6 py-4.5">
                      <span className="font-mono font-extrabold text-slate-800">{formatRupiah(ord.jasaPrice)}</span>
                    </td>
                    <td className="px-6 py-4.5">
                      {getStatusBadge(ord.status)}
                    </td>
                    <td className="px-6 py-4.5 text-right">
                      <button
                        onClick={() => onNavigate('detail-pesanan-penyedia', { id_pesanan: ord.id })}
                        className="px-3.5 py-1.5 bg-[#0F7B4E] text-white hover:bg-[#0B5E3C] text-[10px] font-bold rounded-lg cursor-pointer transition-all uppercase tracking-wider font-mono"
                      >
                        Kelola
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
