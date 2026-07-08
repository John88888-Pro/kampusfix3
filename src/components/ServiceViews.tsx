/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Terminal, 
  Palette, 
  FileText, 
  Presentation, 
  Video, 
  Globe, 
  Star, 
  ArrowRight, 
  CheckCircle, 
  ShieldCheck, 
  User as UserIcon, 
  PhoneCall, 
  Sparkles,
  ArrowUpDown,
  Filter,
  DollarSign,
  Award,
  ArrowLeft,
  Briefcase
} from 'lucide-react';
import { Jasa, Review, User } from '../types';
import { KampusFixDB } from '../data/db';
import { motion } from 'motion/react';

// Formatting Helper
export function formatRupiah(amount: number): string {
  return 'Rp ' + amount.toLocaleString('id-ID');
}

// Global Category Configuration
export const CATEGORY_LIST = [
  { name: 'Programming & Tech', icon: Terminal, color: 'bg-emerald-50 text-emerald-700 border-emerald-100', desc: 'Coding, Web Dev, Mobile App, Bug Fixing' },
  { name: 'Desain Grafis', icon: Palette, color: 'bg-purple-50 text-purple-700 border-purple-100', desc: 'Logo, Ilustrasi, Poster, Feed Instagram' },
  { name: 'Penulisan Makalah', icon: FileText, color: 'bg-blue-50 text-blue-700 border-blue-100', desc: 'Makalah, Paper Ilmiah, Esai Kuliah' },
  { name: 'Pembuatan PPT', icon: Presentation, color: 'bg-amber-50 text-amber-700 border-amber-100', desc: 'PPT Sidang, Seminar, PPT Interaktif' },
  { name: 'Editing Video', icon: Video, color: 'bg-rose-50 text-rose-700 border-rose-100', desc: 'Video Reels, Shorts, Video Profil UKM' },
  { name: 'Penerjemah', icon: Globe, color: 'bg-cyan-50 text-cyan-700 border-cyan-100', desc: 'Jurnal Resmi, Abstrak, TOEFL Helper' },
];

/* ============================================================================
   1. LANDING PAGE VIEW
   ============================================================================ */
interface LandingPageProps {
  onNavigate: (view: string, params?: any) => void;
  activeUser: User | null;
  refreshTrigger: number;
}

export function LandingPage({ onNavigate, activeUser, refreshTrigger }: LandingPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [jasaList, setJasaList] = useState<Jasa[]>([]);

  useEffect(() => {
    // Show only active services on landing page
    const all = KampusFixDB.getJasa().filter(j => j.status === 'aktif');
    setJasaList(all.slice(0, 8)); // Top 8
  }, [refreshTrigger]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('kategori', { search: searchQuery });
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-900 text-white rounded-3xl mx-4 sm:mx-8 px-6 sm:px-12 py-16 sm:py-24 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500 rounded-full blur-[120px] opacity-20 -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500 rounded-full blur-[120px] opacity-10 -ml-20 -mb-20"></div>

        <div className="max-w-3xl relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-800/80 border border-emerald-600 rounded-full text-xs font-semibold text-emerald-200">
            <Sparkles className="w-3.5 h-3.5" />
            Platform Solusi Mahasiswa Terbesar No. 1 di Kampus
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-display font-extrabold tracking-tight leading-tight">
            Tugas Kuliah Menumpuk? <br />
            Selesaikan dengan <span className="text-emerald-400">Mudah, Cepat, dan Aman</span>
          </h1>
          
          <p className="text-gray-300 text-sm sm:text-base max-w-2xl">
            Hubungkan dirimu dengan ratusan mahasiswa "helper" berbakat di kampusmu. Selesaikan project koding, desain PPT infografis, edit video reels, hingga terjemahan jurnal akademik dengan sistem pembayaran escrow yang 100% aman.
          </p>

          {/* Elegant Search Input */}
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-2.5 max-w-xl bg-white/10 p-2 border border-white/20 rounded-2xl backdrop-blur-md">
            <div className="flex items-center gap-2 px-3 flex-1 w-full">
              <Search className="w-5 h-5 text-emerald-400 shrink-0" />
              <input 
                type="text" 
                placeholder="Cari jasa: 'ppt skripsi', 'react', 'terjemahan'..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none text-white placeholder-gray-400 focus:outline-none text-sm py-2"
              />
            </div>
            <button 
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-xs font-bold font-display tracking-wide uppercase transition-all duration-150 rounded-xl text-white cursor-pointer"
            >
              Cari Jasa
            </button>
          </form>

          <div className="flex items-center gap-6 pt-4 text-xs text-gray-300">
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              100% Mahasiswa Asli
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              Secure Escrow Selesai Baru Bayar
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-gray-900 tracking-tight">
            Kategori Layanan Jasa Kampus
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm max-w-xl mx-auto">
            Temukan helper yang menguasai bidang spesifik yang sedang kamu cari demi hasil akademis terbaik.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORY_LIST.map((cat, idx) => {
            const IconComp = cat.icon;
            return (
              <motion.div 
                key={idx}
                whileHover={{ y: -4, scale: 1.02 }}
                onClick={() => onNavigate('kategori', { category: cat.name })}
                className={`p-5 rounded-2xl border text-center cursor-pointer transition-all duration-200 bg-white hover:shadow-lg ${cat.color}`}
              >
                <div className="mx-auto w-10 h-10 rounded-xl bg-current/10 flex items-center justify-center mb-3">
                  <IconComp className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-xs sm:text-sm text-gray-900 tracking-tight">{cat.name}</h3>
                <p className="text-[10px] text-gray-500 mt-1 line-clamp-1">{cat.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Featured Services Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-display font-bold text-gray-950 tracking-tight">
              Rekomendasi Jasa Populer
            </h2>
            <p className="text-gray-500 text-xs">Jasa terbaik dengan rating murni dari mahasiswa kampus</p>
          </div>
          <button 
            onClick={() => onNavigate('kategori')} 
            className="group flex items-center gap-1.5 text-xs font-bold text-[#0F7B4E] hover:underline cursor-pointer"
          >
            Lihat Semua Jasa
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {jasaList.map((j) => (
            <div 
              key={j.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-all duration-150 group"
            >
              {/* Service Cover aspect-video */}
              <div className="relative aspect-video bg-gray-100 overflow-hidden">
                <img 
                  src={j.images[0]} 
                  alt={j.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute top-2.5 left-2.5 bg-black/50 text-white text-[10px] font-bold tracking-wide rounded-full px-2.5 py-0.5 backdrop-blur-sm shadow-sm font-mono">
                  {j.category}
                </div>
              </div>

              {/* Service Info */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3.5">
                <div className="space-y-1.5">
                  <div 
                    onClick={() => onNavigate('detail-penyedia', { id_penyedia: j.penyediaId })}
                    className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    <img 
                      src={j.penyediaAvatar} 
                      alt={j.penyediaName} 
                      referrerPolicy="no-referrer"
                      className="w-5 h-5 rounded-full object-cover"
                    />
                    <span className="text-[11px] font-medium text-gray-600 truncate hover:text-[#0F7B4E]">{j.penyediaName}</span>
                  </div>
                  <h3 
                    onClick={() => onNavigate('detail-jasa', { id: j.id })}
                    className="font-bold text-xs sm:text-sm text-gray-900 line-clamp-2 hover:text-[#0F7B4E] transition-colors cursor-pointer leading-snug"
                  >
                    {j.title}
                  </h3>
                </div>

                <div className="flex items-center justify-between border-t border-gray-50 pt-2.5">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-xs font-bold text-gray-800">{j.ratingAvg || 'New'}</span>
                    <span className="text-[10px] text-gray-400 font-mono">({j.totalSales})</span>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 leading-none">Mulai dari</p>
                    <p className="font-extrabold text-sm text-[#0F7B4E] font-display">{formatRupiah(j.price)}</p>
                  </div>
                </div>
                
                <button 
                  onClick={() => onNavigate('detail-jasa', { id: j.id })}
                  className="w-full py-2 bg-emerald-50 hover:bg-[#0F7B4E] text-[#0F7B4E] hover:text-white rounded-lg text-xs font-bold cursor-pointer transition-colors duration-150 text-center uppercase tracking-wider"
                >
                  Lihat Detail Jasa
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Escrow Mechanism Explanation */}
      <section className="bg-gray-50 border border-gray-100 rounded-3xl mx-4 sm:mx-8 px-6 sm:px-12 py-12 flex flex-col lg:flex-row items-center gap-12">
        <div className="lg:w-1/2 space-y-4">
          <div className="h-10 w-10 rounded-xl bg-teal-50 flex items-center justify-center text-[#0F7B4E]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-display font-extrabold text-gray-950 tracking-tight leading-tight">
            Bagaimana Escrow KampusFix Melindungi Uangmu?
          </h2>
          <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
            Tidak perlu khawatir tertipu atau pesanan tidak digarap. KampusFix menyimpan pembayaran Anda sementara di rekening aman. Setelah tugas dikirim dan Anda mengonfirmasi "Garap Selesai", dana baru diserahkan kepada penyedia jasa.
          </p>
          <ul className="space-y-2 text-xs text-gray-700 font-medium">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
              1. Pesan & Bayar Ke Rekening Escrow KampusFix
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
              2. Helper Memulai & Mengirim Hasil Pekerjaan
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
              3. Konfirmasi Selesai & Dana Cair Ke Rekening Helper
            </li>
          </ul>
        </div>
        
        {/* Step Visual Board */}
        <div className="lg:w-1/2 w-full grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 space-y-2 relative">
            <span className="absolute top-3 right-3 text-2xl font-extrabold font-display text-emerald-100">01</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-50 text-[#0F7B4E] flex items-center justify-center font-bold">💳</div>
            <h4 className="font-bold text-xs text-gray-900">Pencari Pesan</h4>
            <p className="text-[10px] text-gray-500">Pencari mengisi parameter tugas dan mentransfer biaya.</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 space-y-2 relative">
            <span className="absolute top-3 right-3 text-2xl font-extrabold font-display text-emerald-100">02</span>
            <div className="h-8 w-8 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center font-bold">💻</div>
            <h4 className="font-bold text-xs text-gray-900">Helper Garap</h4>
            <p className="text-[10px] text-gray-500">Helper menyelesaikan dan mengupload hasil tugas ke sistem.</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 space-y-2 relative">
            <span className="absolute top-3 right-3 text-2xl font-extrabold font-display text-emerald-100">03</span>
            <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center font-bold">🎉</div>
            <h4 className="font-bold text-xs text-gray-900">Dana Cair</h4>
            <p className="text-[10px] text-gray-500">Penerima puas, konfirmasi selesai, uang auto transfer.</p>
          </div>
        </div>
      </section>

      {/* CTA Provider Banner */}
      <section className="bg-emerald-900 text-white rounded-3xl mx-4 sm:mx-8 px-6 sm:px-12 py-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg">
        <div className="space-y-1.5 max-w-xl">
          <h3 className="text-xl font-bold font-display leading-tight">Punya Skill & Keahlian Khusus?</h3>
          <p className="text-emerald-200 text-xs max-w-md">
            Mulai monetisasi keahlianmu mendesain PPT, coding, menulis esai, edit video reels atau menjadi translator tugas teman kampus dan cairkan pendapatan langsung ke rekening pribadimu!
          </p>
        </div>
        <button 
          onClick={() => {
            if (activeUser) {
              onNavigate('profile-page');
            } else {
              onNavigate('login', { tab: 'daftar', roleSet: 'penyedia' });
            }
          }}
          className="px-6 py-3 bg-white hover:bg-emerald-50 hover:shadow-md text-emerald-900 font-bold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer shrink-0"
        >
          Gabung Jadi Helper
        </button>
      </section>

    </div>
  );
}


/* ============================================================================
   2. KATEGORI PAGE VIEW
   ============================================================================ */
interface KategoriPageProps {
  onNavigate: (view: string, params?: any) => void;
  initialParams?: { category?: string; search?: string };
}

export function KategoriPage({ onNavigate, initialParams }: KategoriPageProps) {
  const [jasaList, setJasaList] = useState<Jasa[]>([]);
  const [filteredJasa, setFilteredJasa] = useState<Jasa[]>([]);
  const [searchQuery, setSearchQuery] = useState(initialParams?.search || '');
  const [selectedCategory, setSelectedCategory] = useState(initialParams?.category || 'Semua');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('sales_desc'); // sales_desc, price_asc, price_desc, rating_desc

  useEffect(() => {
    // Sync initial params on change
    if (initialParams?.category) {
      setSelectedCategory(initialParams.category);
    }
    if (initialParams?.search) {
      setSearchQuery(initialParams.search);
    }
  }, [initialParams]);

  useEffect(() => {
    // Load all active services
    const all = KampusFixDB.getJasa().filter(j => j.status === 'aktif');
    setJasaList(all);
  }, []);

  useEffect(() => {
    // Apply filters
    let result = [...jasaList];

    // Category filter
    if (selectedCategory !== 'Semua') {
      result = result.filter(j => j.category === selectedCategory);
    }

    // Search query filter
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(j => 
        j.title.toLowerCase().includes(q) || 
        j.description.toLowerCase().includes(q) ||
        j.penyediaName.toLowerCase().includes(q)
      );
    }

    // Min price
    if (minPrice !== '') {
      result = result.filter(j => j.price >= Number(minPrice));
    }

    // Max price
    if (maxPrice !== '') {
      result = result.filter(j => j.price <= Number(maxPrice));
    }

    // Sorting
    if (sortBy === 'sales_desc') {
      result.sort((a, b) => b.totalSales - a.totalSales);
    } else if (sortBy === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating_desc') {
      result.sort((a, b) => b.ratingAvg - a.ratingAvg);
    }

    setFilteredJasa(result);
  }, [jasaList, selectedCategory, searchQuery, minPrice, maxPrice, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory('Semua');
    setSearchQuery('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('sales_desc');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Search Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="w-full md:max-w-md relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
          <input 
            type="text"
            placeholder="Cari jasa perkuliahan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 focus:border-[#0F7B4E] focus:outline-none rounded-xl text-sm"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <label className="text-xs text-gray-500 font-semibold font-mono flex items-center gap-1 shrink-0">
            <ArrowUpDown className="w-4 h-4" /> Urutkan:
          </label>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs border border-gray-200 outline-none rounded-xl p-2 bg-white flex-1 md:flex-none cursor-pointer"
          >
            <option value="sales_desc">Terpopuler (Penjualan)</option>
            <option value="price_asc">Harga Terrendah</option>
            <option value="price_desc">Harga Tertinggi</option>
            <option value="rating_desc">Ulasan Terbaik (Rating)</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Side: Filter Sidebar */}
        <aside className="w-full lg:w-64 bg-white p-5 rounded-2xl border border-gray-100 h-fit space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-50 pb-3">
            <h3 className="font-bold text-sm text-gray-950 flex items-center gap-1">
              <Filter className="w-4 h-4 text-[#0F7B4E]" /> Filter Pencarian
            </h3>
            <button 
              onClick={handleResetFilters}
              className="text-[10px] text-red-500 hover:underline font-bold cursor-pointer"
            >
              Reset All
            </button>
          </div>

          {/* Categories select list */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider font-mono">Pilih Kategori</h4>
            <div className="flex flex-wrap lg:flex-col gap-1.5 text-xs text-left">
              <button 
                onClick={() => setSelectedCategory('Semua')}
                className={`px-3 py-1.5 rounded-lg text-left border text-xs font-medium cursor-pointer ${selectedCategory === 'Semua' ? 'bg-emerald-50 text-[#0F7B4E] border-emerald-200 font-bold' : 'bg-transparent text-gray-600 border-transparent hover:bg-gray-50'}`}
              >
                Semua Kategori (Pilihan)
              </button>
              {CATEGORY_LIST.map((c) => (
                <button 
                  key={c.name}
                  onClick={() => setSelectedCategory(c.name)}
                  className={`px-3 py-1.5 rounded-lg text-left border text-xs font-medium cursor-pointer ${selectedCategory === c.name ? 'bg-emerald-50 text-[#0F7B4E] border-emerald-200 font-bold' : 'bg-transparent text-gray-600 border-transparent hover:bg-gray-50'}`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price Filters */}
          <div className="space-y-3.5 border-t border-gray-50 pt-4">
            <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider font-mono">Rentang Harga (Rp)</h4>
            <div className="space-y-2">
              <input 
                type="number" 
                placeholder="Harga Minimum" 
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full text-xs p-2 border border-gray-200 rounded-lg focus:border-[#0F7B4E] focus:outline-none"
              />
              <input 
                type="number" 
                placeholder="Harga Maksimum" 
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full text-xs p-2 border border-gray-200 rounded-lg focus:border-[#0F7B4E] focus:outline-none"
              />
            </div>
          </div>
        </aside>

        {/* Right Side: Services Grid */}
        <main className="flex-1 space-y-6">
          <div className="flex justify-between items-center text-xs text-gray-500 font-medium">
            <span>Ditemukan {filteredJasa.length} jasa aktif</span>
            {selectedCategory !== 'Semua' && (
              <span className="font-semibold bg-emerald-50 text-[#0F7B4E] py-1 px-3 border border-emerald-100 rounded-full">
                Kategori: {selectedCategory}
              </span>
            )}
          </div>

          {filteredJasa.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-gray-100 space-y-3">
              <p className="text-gray-400 text-3xl">📭</p>
              <h4 className="font-bold text-sm text-gray-900">Maaf, Jasa Tidak Ditemukan</h4>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Coba kurangi parameter filter Anda atau ketik kata kunci yang lebih umum.
              </p>
              <button 
                onClick={handleResetFilters}
                className="px-4 py-2 bg-emerald-50 hover:bg-[#0F7B4E] text-[#0F7B4E] hover:text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJasa.map((j) => (
                <div 
                  key={j.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-all duration-150 group"
                >
                  <div className="relative aspect-video bg-gray-100 overflow-hidden">
                    <img 
                      src={j.images[0]} 
                      alt={j.title} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-black/50 text-white text-[10px] font-bold rounded-full px-2.5 py-0.5 font-mono shadow-sm">
                      {j.category}
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1.5">
                      <div 
                        onClick={() => onNavigate('detail-penyedia', { id_penyedia: j.penyediaId })}
                        className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity"
                      >
                        <img 
                          src={j.penyediaAvatar} 
                          alt={j.penyediaName} 
                          referrerPolicy="no-referrer"
                          className="w-5 h-5 rounded-full object-cover"
                        />
                        <span className="text-[11px] font-medium text-gray-600 truncate hover:text-[#0F7B4E]">{j.penyediaName}</span>
                      </div>
                      <h3 
                        onClick={() => onNavigate('detail-jasa', { id: j.id })}
                        className="font-bold text-xs sm:text-sm text-gray-900 line-clamp-2 hover:text-[#0F7B4E] transition-colors cursor-pointer leading-snug"
                      >
                        {j.title}
                      </h3>
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-50 pt-2.5">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span className="text-xs font-bold text-gray-800">{j.ratingAvg || 'New'}</span>
                        <span className="text-[10px] text-gray-400 font-mono">({j.totalSales})</span>
                      </div>
                      <div className="text-right">
                        <p className="font-extrabold text-sm text-[#0F7B4E] font-display">{formatRupiah(j.price)}</p>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => onNavigate('detail-jasa', { id: j.id })}
                      className="w-full py-2 bg-emerald-50 hover:bg-[#0F7B4E] text-[#0F7B4E] hover:text-white rounded-lg text-xs font-bold cursor-pointer transition-colors duration-150 text-center uppercase tracking-wider"
                    >
                      Lihat Jasa Detail
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}


/* ============================================================================
   3. DETAIL JASA PAGE VIEW
   ============================================================================ */
interface DetailJasaPageProps {
  onNavigate: (view: string, params?: any) => void;
  activeUser: User | null;
  params?: { id?: string };
  refreshTrigger: number;
}

export function DetailJasaPage({ onNavigate, activeUser, params, refreshTrigger }: DetailJasaPageProps) {
  const [jasa, setJasa] = useState<Jasa | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [copiedWA, setCopiedWA] = useState(false);

  useEffect(() => {
    if (params?.id) {
      const j = KampusFixDB.getJasa().find(x => x.id === params.id);
      if (j) {
        setJasa(j);
        
        // Find reviews for this service
        const r = KampusFixDB.getReviews().filter(rev => rev.jasaId === j.id);
        setReviews(r);
      }
    }
  }, [params, refreshTrigger]);

  if (!jasa) {
    return (
      <div className="max-w-md mx-auto text-center py-20">
        <p className="text-2xl">🔍</p>
        <p className="font-bold mt-2">Detail Jasa Tidak Ditemukan</p>
        <button onClick={() => onNavigate('home')} className="mt-4 px-4 py-2 bg-[#0F7B4E] text-white rounded-lg text-xs font-semibold cursor-pointer">
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  const handleOrderClick = () => {
    if (!activeUser) {
      sessionStorage.setItem('redirect_after_login_view', 'detail-jasa');
      sessionStorage.setItem('redirect_after_login_params', JSON.stringify({ id: jasa.id }));
      onNavigate('login', { tab: 'masuk' });
    } else {
      onNavigate('form-pesan', { jasa_id: jasa.id });
    }
  };

  // Build the WhatsApp message link
  const waNo = jasa.penyediaWhatsapp;
  const waText = encodeURIComponent(`Halo ${jasa.penyediaName}, saya tertarik dengan jasa Anda "${jasa.title}" yang saya lihat di KampusFix. Apakah bisa berdiskusi lebih lanjut?`);
  const waLink = `https://wa.me/${waNo}?text=${waText}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-150">
      
      {/* Breadcrumbs */}
      <div className="text-xs text-gray-400 font-medium font-mono">
        <span className="cursor-pointer hover:text-emerald-600" onClick={() => onNavigate('home')}>Beranda</span>
        <span className="mx-2">/</span>
        <span className="cursor-pointer hover:text-emerald-600" onClick={() => onNavigate('kategori')}>Kategori</span>
        <span className="mx-2">/</span>
        <span className="cursor-pointer text-emerald-700 font-bold hover:underline" onClick={() => onNavigate('kategori', { category: jasa.category })}>{jasa.category}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Columns (Content & Reviews) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Main Card with Image and Info */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6 shadow-sm">
            <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden relative border border-gray-50">
              <img 
                src={jasa.images[0]} 
                alt={jasa.title} 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <span className="absolute top-4 left-4 bg-black/60 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm shadow-md font-mono">
                {jasa.category}
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="text-xl sm:text-2xl font-display font-black text-gray-950 tracking-tight leading-snug">
                {jasa.title}
              </h1>

              {/* Quick meta indicators */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-medium border-y border-gray-50 py-3.5">
                <div className="flex items-center gap-1.5 shrink-0">
                  <img 
                    src={jasa.penyediaAvatar} 
                    alt={jasa.penyediaName} 
                    referrerPolicy="no-referrer"
                    className="w-6 h-6 rounded-full object-cover border border-[#0F7B4E]/10"
                  />
                  <span className="font-bold text-gray-800">{jasa.penyediaName}</span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
                  <span className="font-bold text-gray-800">{jasa.ratingAvg || 'New'}</span>
                  <span className="text-gray-400 font-mono">({reviews.length} ulasan)</span>
                </div>
                <div className="text-gray-400 font-mono hidden sm:inline">|</div>
                <div className="text-gray-500 shrink-0">
                  Estimasi Kirim: <strong className="text-gray-800 font-semibold">{jasa.duration}</strong>
                </div>
                <div className="text-gray-400 font-mono hidden sm:inline">|</div>
                <div className="text-gray-500 shrink-0">
                  Terjual: <strong className="text-emerald-700 font-mono font-bold">{jasa.totalSales} kali</strong>
                </div>
              </div>

              {/* Service Description */}
              <div className="space-y-2.5">
                <h3 className="font-bold text-sm text-gray-950 uppercase tracking-wider font-mono">Deskripsi Lengkap Jasa</h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed text-justify whitespace-pre-line">
                  {jasa.description}
                </p>
              </div>

              {/* Key benefit features checklist */}
              <div className="space-y-3.5 border-t border-gray-50 pt-4">
                <h4 className="font-bold text-xs text-gray-900 uppercase tracking-wider font-mono">Yang Akan Anda Dapatkan</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {jasa.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-gray-700 font-medium">
                      <CheckCircle className="w-4 h-4 text-[#0F7B4E] shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Provider Profile Info Card */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4 shadow-sm">
            <div className="flex justify-between items-center border-b border-gray-50 pb-3">
              <h3 className="font-bold text-xs text-[#0F7B4E] uppercase tracking-wider font-mono">Profil Mahasiswa Helper</h3>
              <button 
                onClick={() => onNavigate('detail-penyedia', { id_penyedia: jasa.penyediaId })}
                className="text-[11px] text-[#0F7B4E] hover:underline font-bold"
              >
                Lihat Portofolio & Rating →
              </button>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div 
                onClick={() => onNavigate('detail-penyedia', { id_penyedia: jasa.penyediaId })}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <img 
                  src={jasa.penyediaAvatar} 
                  alt={jasa.penyediaName} 
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-full object-cover border-2 border-emerald-500/10 group-hover:border-emerald-500 transition-colors"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-extrabold text-sm text-gray-900 group-hover:text-[#0F7B4E] transition-colors">{jasa.penyediaName}</h4>
                    <span className="bg-emerald-50 text-[#0F7B4E] text-[9px] px-2 py-0.2 rounded font-mono font-semibold uppercase border border-emerald-100">
                      Verified Helper
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500 font-semibold font-mono">Fakultas / Jurusan: {jasa.category === 'Programming & Tech' ? 'Teknik Informatika' : 'DKV / Sastra'}</p>
                  <p className="text-[11px] text-gray-600 italic mt-1 font-medium">{jasa.penyediaWhatsapp ? 'WhatsApp Aktif & Terhubung' : 'No WA belum diisi'}</p>
                </div>
              </div>
              <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
                <button
                  onClick={() => onNavigate('detail-penyedia', { id_penyedia: jasa.penyediaId })}
                  className="flex-1 text-center px-4.5 py-2 bg-slate-50 hover:bg-slate-100 text-gray-700 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer border border-gray-100"
                >
                  Lihat Portofolio
                </button>
                <a 
                  href={waLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 px-4.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer border border-emerald-105"
                >
                  <PhoneCall className="w-3.5 h-3.5" /> Diskusi WA
                </a>
              </div>
            </div>
          </div>

          {/* Customer Reviews/Ulasan section */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6 shadow-sm">
            <h3 className="font-bold text-sm text-gray-950 uppercase tracking-wider font-mono">Ulasan Mahasiswa ({reviews.length})</h3>
            
            {reviews.length === 0 ? (
              <div className="text-center py-6 text-xs text-gray-400">
                Belum ada ulasan untuk jasa ini. Jadilah pemesan pertama!
              </div>
            ) : (
              <div className="space-y-4 divide-y divide-gray-50">
                {reviews.map((rev) => (
                  <div key={rev.id} className="pt-4 first:pt-0 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img 
                          src={rev.pencariAvatar} 
                          alt={rev.pencariName} 
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="font-bold text-xs text-gray-900">{rev.pencariName}</span>
                        <span className="text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.2 rounded font-mono font-bold">Pemesan</span>
                      </div>
                      <span className="text-[10px] text-gray-400 font-mono">
                        {new Date(rev.createdAt).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star 
                          key={idx} 
                          className={`w-3 h-3 ${idx < rev.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} 
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-600 italic">
                      "{rev.ulasan}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Checkout Pricing Card */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-emerald-100 p-6 space-y-6 shadow-md sticky top-24">
            <div className="space-y-2">
              <span className="text-[10px] bg-emerald-50 text-[#0F7B4E] px-2.5 py-1 rounded-full font-mono font-bold uppercase border border-emerald-100">
                Escrow Guarantee Safe
              </span>
              <p className="text-xs text-gray-400 leading-none">Total Investasi Tugas</p>
              <h2 className="text-3xl font-display font-extrabold text-[#0F7B4E]">
                {formatRupiah(jasa.price)}
              </h2>
            </div>

            <div className="space-y-3 pt-3 border-t border-gray-100 text-xs text-gray-600">
              <div className="flex items-center justify-between">
                <span>Harga Biaya Jasa:</span>
                <span className="font-bold text-gray-800">{formatRupiah(jasa.price)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Estimasi Pengiriman:</span>
                <span className="font-mono font-bold text-gray-800">{jasa.duration}</span>
              </div>
              <div className="flex items-center justify-between text-emerald-700 font-semibold bg-emerald-50/50 p-2 rounded-lg border border-emerald-50">
                <span>Platform Fee Escrow:</span>
                <span className="font-mono">Gratis (Disimulasikan)</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <button 
                onClick={handleOrderClick}
                className="w-full py-3 bg-[#0F7B4E] hover:bg-[#0B5E3C] active:scale-[0.98] transition-all text-white font-extrabold text-sm rounded-xl tracking-wide uppercase cursor-pointer"
              >
                Pesan Sekarang
              </button>
              
              <a 
                href={waLink}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 bg-white border border-emerald-600 text-emerald-800 font-bold text-xs rounded-xl transition-all cursor-pointer block text-center"
              >
                Chat via WhatsApp
              </a>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1 text-[11px] text-slate-500">
              <strong className="text-slate-800">🔒 KampusFix Secure Tabungan:</strong>
              <p>Uang Anda aman bersama escrow KampusFix. Helper hanya dibayar bila revisi Anda selesai disetujui.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}


/* ============================================================================
   4. DETAIL PENYEDIA PAGE (PUBLIC HELPER PROFILE)
   ============================================================================ */
interface DetailPenyediaPageProps {
  onNavigate: (view: string, params?: any) => void;
  activeUser: User | null;
  params: { id_penyedia: string };
  refreshTrigger: number;
}

export function DetailPenyediaPage({ onNavigate, activeUser, params, refreshTrigger }: DetailPenyediaPageProps) {
  const [provider, setProvider] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'portofolio' | 'jasa' | 'ulasan'>('portofolio');
  const [zoomedCertUrl, setZoomedCertUrl] = useState<string | null>(null);

  useEffect(() => {
    const users = KampusFixDB.getUsers();
    const found = users.find(u => u.id === params?.id_penyedia);
    if (found) {
      setProvider(found);
    }
  }, [params, refreshTrigger]);

  if (!provider) {
    return (
      <div className="max-w-md mx-auto text-center py-24 px-4 space-y-4">
        <p className="font-bold text-gray-800">Profil Helper tidak ditemukan.</p>
        <button 
          onClick={() => onNavigate('home')} 
          className="px-4 py-2 bg-[#0F7B4E] hover:bg-[#0B5E3C] text-white rounded-xl text-xs font-semibold cursor-pointer"
        >
          Kembali Beranda
        </button>
      </div>
    );
  }

  // Get offered services
  const allJasa = KampusFixDB.getJasa();
  const providerServices = allJasa.filter(j => j.penyediaId === provider.id);

  // Get cumulative reviews for this helper's services
  const allReviews = KampusFixDB.getReviews() || [];
  const serviceIds = providerServices.map(s => s.id);
  const providerReviews = allReviews.filter(rev => serviceIds.includes(rev.jasaId));

  // Average Rating
  const avgRating = providerReviews.length > 0
    ? (providerReviews.reduce((sum, r) => sum + r.rating, 0) / providerReviews.length).toFixed(1)
    : null;

  const totalCompleted = providerReviews.length;
  const portfolioItems = provider.portofolio || [];

  const waLink = provider.whatsapp
    ? `https://wa.me/${provider.whatsapp}?text=${encodeURIComponent(`Halo ${provider.name}, saya menemukan profil Helper Anda di KampusFix dan tertarik memesan jasa Anda.`)}`
    : '#';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in duration-200">
      
      {/* Back button */}
      <div>
        <button 
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 group font-mono font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          KEMBALI KE BERANDA
        </button>
      </div>

      {/* Main Profile Info Header */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xs relative overflow-hidden">
        {/* Decorative corner glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 opacity-50 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <img 
              src={provider.avatar} 
              alt={provider.name} 
              referrerPolicy="no-referrer"
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-emerald-500/10 shadow-sm"
            />
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-display font-black text-gray-950 leading-tight">{provider.name}</h1>
                <span className="bg-emerald-50 text-[#0F7B4E] text-[10px] sm:text-[11px] px-2.5 py-0.5 rounded-full font-mono font-bold uppercase border border-emerald-100 shadow-3xs">
                  ✓ Verified Helper
                </span>
                {portfolioItems.length > 0 && (
                  <span className="bg-amber-50 text-amber-800 text-[10px] sm:text-[11px] px-2.5 py-0.5 rounded-full font-mono font-bold uppercase border border-amber-100 shadow-3xs">
                    ★ Portofolio Terverifikasi
                  </span>
                )}
              </div>
              
              <p className="text-xs sm:text-sm text-gray-500 font-medium">{provider.keahlian || 'Programming & Tech'} • Mahasiswa Aktif Kampus</p>
              
              {/* Star rating summary */}
              <div className="flex items-center gap-3 text-xs text-gray-600 font-mono">
                <div className="flex items-center gap-1 bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-100 font-bold">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  {avgRating || 'New'}
                </div>
                <span>•</span>
                <span>Completed Jasa: <strong>{totalCompleted} kali</strong></span>
                <span>•</span>
                <span>Terdaftar sejak: <strong>{provider.createdAt ? new Date(provider.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' }) : 'Baru'}</strong></span>
              </div>
            </div>
          </div>

          <div className="w-full md:w-auto flex flex-col gap-2 shrink-0 sm:min-w-[200px]">
            {provider.whatsapp ? (
              <a 
                href={waLink}
                target="_blank"
                rel="noreferrer"
                className="w-full text-center py-3 bg-[#0F7B4E] hover:bg-[#0B5E3C] text-white font-bold text-xs font-display tracking-wider uppercase rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <PhoneCall className="w-4 h-4" /> Hubungi via WhatsApp
              </a>
            ) : (
              <div className="bg-amber-50 border border-amber-100 text-amber-800 text-[10px] p-2.5 rounded-xl font-medium text-center">
                Nomor WhatsApp Tidak Tersedia
              </div>
            )}
            <p className="text-[10px] text-gray-400 text-center leading-tight">Gunakan WhatsApp Direct untuk mendiskusikan kustomisasi tugas.</p>
          </div>
        </div>

        {/* Bio segment */}
        <div className="mt-6 pt-5 border-t border-gray-100 space-y-2 relative z-10">
          <h3 className="text-xs font-extrabold tracking-wider text-gray-400 uppercase font-mono">Tentang Helper</h3>
          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed italic bg-emerald-50/20 p-4 rounded-xl border border-emerald-50/50">
            "{provider.bio || 'Helper ini belum mengisi deskripsi tentang dirinya.'}"
          </p>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex border-b border-gray-200 gap-1 sm:gap-4 overflow-x-auto pb-px">
        <button
          onClick={() => setActiveTab('portofolio')}
          className={`pb-3 text-xs font-bold tracking-wide uppercase font-mono border-b-2 transition-all px-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'portofolio'
              ? 'border-[#0F7B4E] text-[#0F7B4E]'
              : 'border-transparent text-gray-400 hover:text-gray-900'
          }`}
        >
          📂 Portofolio / Sertifikat ({portfolioItems.length})
        </button>
        <button
          onClick={() => setActiveTab('jasa')}
          className={`pb-3 text-xs font-bold tracking-wide uppercase font-mono border-b-2 transition-all px-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'jasa'
              ? 'border-[#0F7B4E] text-[#0F7B4E]'
              : 'border-transparent text-gray-400 hover:text-gray-900'
          }`}
        >
          🛠️ Jasa yang Ditawarkan ({providerServices.length})
        </button>
        <button
          onClick={() => setActiveTab('ulasan')}
          className={`pb-3 text-xs font-bold tracking-wide uppercase font-mono border-b-2 transition-all px-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'ulasan'
              ? 'border-[#0F7B4E] text-[#0F7B4E]'
              : 'border-transparent text-gray-400 hover:text-gray-900'
          }`}
        >
          ★ Ulasan Mahasiswa ({providerReviews.length})
        </button>
      </div>

      {/* Tab Contents */}
      <div className="min-h-[250px]">
        {activeTab === 'portofolio' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
              <h3 className="font-bold text-sm text-gray-950 font-mono uppercase tracking-wide">Lampiran Kelayakan Kompetensi</h3>
              
              {portfolioItems.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 border border-slate-100 border-dashed rounded-xl">
                  <Award className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-bold text-gray-600">Dokumen Portofolio Belum Tersedia</p>
                  <p className="text-[10px] text-gray-400">Helper belum mengunggah sertifikat kelulusan atau sertifikasi keahlian.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {portfolioItems.map((item: any) => (
                    <div key={item.id} className="p-4 border border-gray-100 rounded-2xl bg-gray-50/40 hover:bg-white hover:shadow-xs transition-all space-y-3 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <span className="p-1 px-2.5 bg-[#0F7B4E]/10 text-[#0F7B4E] text-[10px] font-bold rounded-lg font-mono uppercase">
                            Validated Certificate
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono font-bold">Lulus {item.year}</span>
                        </div>
                        <div className="space-y-0.5">
                          <h4 className="font-extrabold text-xs sm:text-sm text-gray-900 leading-tight">{item.title}</h4>
                          <p className="text-[10px] text-[#0F7B4E] font-bold tracking-wide font-mono uppercase">{item.issuer}</p>
                        </div>
                        {item.description && (
                          <p className="text-[11px] text-gray-500 leading-relaxed font-medium bg-white/60 p-2.5 rounded-lg border border-gray-100/50">
                            {item.description}
                          </p>
                        )}
                      </div>

                      {item.fileUrl && (
                        <div className="pt-2 border-t border-gray-100">
                          <button
                            onClick={() => setZoomedCertUrl(item.fileUrl)}
                            className="w-full py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-[10px] font-bold rounded-lg border border-gray-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                          >
                            🔍 Perbesar Lampiran Sertifikat
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'jasa' && (
          <div className="space-y-6">
            {providerServices.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                <Briefcase className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-gray-600">Saat ini helper tidak menawarkan jasa aktif.</p>
                <p className="text-[10px] text-gray-400">Silakan hubungi helper lewat WhatsApp untuk menanyakan kustom kerjaan.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {providerServices.map((j) => (
                  <div key={j.id} className="bg-white rounded-2xl border border-gray-150 overflow-hidden flex flex-col justify-between group hover:shadow-md transition-all duration-200">
                    <div className="relative h-40 bg-gray-100 overflow-hidden shrink-0">
                      <img 
                        src={j.images[0] || "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&auto=format&fit=crop&q=60"} 
                        alt={j.title} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      <div className="absolute top-2.5 left-2.5 bg-black/50 text-white text-[10px] font-bold rounded-full px-2.5 py-0.5 font-mono">
                        {j.category}
                      </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-1">
                        <h3 
                          onClick={() => onNavigate('detail-jasa', { id: j.id })}
                          className="font-bold text-xs sm:text-sm text-gray-900 line-clamp-2 hover:text-[#0F7B4E] transition-colors cursor-pointer leading-tight"
                        >
                          {j.title}
                        </h3>
                      </div>

                      <div className="flex items-center justify-between border-t border-gray-50 pt-2.5 shrink-0">
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          <span className="text-xs font-bold text-gray-800">{j.ratingAvg || 'New'}</span>
                          <span className="text-[10px] text-gray-400 font-mono">({j.totalSales})</span>
                        </div>
                        <div className="text-right">
                          <p className="font-extrabold text-sm text-[#0F7B4E] font-display">{formatRupiah(j.price)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'ulasan' && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6 shadow-3xs">
            <h3 className="font-bold text-sm text-gray-950 font-mono uppercase tracking-wide">Historical feedback pekerjaan</h3>
            
            {providerReviews.length === 0 ? (
              <div className="text-center py-8 text-xs text-gray-400">
                Belum ada penilai untuk jasa yang dicipitakan helper ini.
              </div>
            ) : (
              <div className="space-y-4 divide-y divide-gray-100">
                {providerReviews.map((rev) => (
                  <div key={rev.id} className="pt-4 first:pt-0 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center font-bold text-[10px] text-gray-600 border border-gray-200 uppercase">
                          {rev.pencariName.substring(0, 2)}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-900">{rev.pencariName}</p>
                          <p className="text-[9px] text-gray-400 font-mono">Pesanan Terverifikasi • {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString('id-ID') : 'Selesai'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star 
                            key={idx} 
                            className={`w-3.5 h-3.5 ${idx < rev.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} 
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 italic bg-gray-50 p-2.5 rounded-xl border border-gray-100/30">
                      "{rev.ulasan}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Image zoom modal */}
      {zoomedCertUrl && (
        <div 
          onClick={() => setZoomedCertUrl(null)}
          className="fixed inset-0 bg-black/75 flex items-center justify-center z-[130] p-4 cursor-zoom-out animate-in fade-in duration-200"
        >
          <div className="relative max-w-3xl w-full bg-white rounded-2xl p-2 sm:p-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setZoomedCertUrl(null)}
              className="absolute -top-10 right-0 text-white font-bold text-sm bg-black/40 px-3 py-1.5 rounded-full hover:bg-black/60 font-mono cursor-pointer"
            >
              TUTUP CLose [×]
            </button>
            <img 
              src={zoomedCertUrl} 
              className="max-h-[80vh] w-full object-contain rounded-lg border border-gray-100" 
              alt="Lampiran Sertifikat Zoomed" 
            />
          </div>
        </div>
      )}

    </div>
  );
}

