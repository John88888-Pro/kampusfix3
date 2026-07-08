/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldCheck, Heart, Github, MessageSquare } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string, params?: any) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-[#1F2937] text-gray-400 text-sm mt-auto">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Column */}
          <div className="md:col-span-1 space-y-4">
            <div onClick={() => onNavigate('home')} className="flex items-center gap-2 cursor-pointer group">
              <div className="h-9 w-9 rounded-lg bg-[#0F7B4E] flex items-center justify-center text-white font-bold shadow-md">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <span className="text-lg font-display font-extrabold tracking-tight text-white">
                Kampus<span className="text-[#0F7B4E]">Fix</span>
              </span>
            </div>
            <p className="text-xs text-justify">
              KampusFix adalah platform digital mahasiswa masa kini. Menghubungkan para pencari solusi tugas perkuliahan dengan mahasiswa helper berkompeten tinggi. Transaksi terjamin aman lewat escrow system.
            </p>
            <div className="flex items-center gap-3">
              <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider font-mono">Status: Secure Escrow Verified</span>
            </div>
          </div>

          {/* Quick Menu */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4 font-display">Tautan Cepat</h4>
            <ul className="space-y-2.5 text-xs text-gray-300">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-[#0F7B4E] transition-colors cursor-pointer text-left">
                  Beranda Utama
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('kategori')} className="hover:text-[#0F7B4E] transition-colors cursor-pointer text-left">
                  Cari Kategori Jasa
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('tentang')} className="hover:text-[#0F7B4E] transition-colors cursor-pointer text-left">
                  Tentang KampusFix
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('kontak')} className="hover:text-[#0F7B4E] transition-colors cursor-pointer text-left">
                  Hubungi Kontak Admin
                </button>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4 font-display">Kategori Populer</h4>
            <ul className="space-y-2.5 text-xs text-gray-300">
              <li>
                <button onClick={() => onNavigate('kategori', { category: 'Programming & Tech' })} className="hover:text-[#0F7B4E] transition-colors cursor-pointer text-left">
                  Programming & Tech
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('kategori', { category: 'Pembuatan PPT' })} className="hover:text-[#0F7B4E] transition-colors cursor-pointer text-left">
                  Pembuatan PPT
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('kategori', { category: 'Desain Grafis' })} className="hover:text-[#0F7B4E] transition-colors cursor-pointer text-left">
                  Desain Grafis
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('kategori', { category: 'Penulisan Makalah' })} className="hover:text-[#0F7B4E] transition-colors cursor-pointer text-left">
                  Penulisan & Terjemah
                </button>
              </li>
            </ul>
          </div>

          {/* Security Banner */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-2 font-display">Mengapa KampusFix?</h4>
            <div className="p-3 bg-gray-800/60 rounded-xl border border-gray-700/50 space-y-2">
              <p className="text-[11px] leading-relaxed text-gray-300">
                <strong>Sistem Tabungan Escrow:</strong> Dana pencari jasa ditahan aman di sistem KampusFix, dan baru dicairkan ke rekening helper setelah pencari mengonfirmasi selesai / puas dengan pekerjaannya.
              </p>
            </div>
            <button 
              onClick={() => onNavigate('privasi')} 
              className="text-xs text-emerald-400 hover:underline font-semibold block text-left"
            >
              Kebijakan Privasi & Syarat Ketentuan
            </button>
          </div>

        </div>

        {/* Separator line */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© 2026 KampusFix Inc. Hak Cipta Dilindungi Undang-Undang.</p>
          <div className="flex items-center gap-1 text-[11px] text-gray-500">
            <span>Dibuat dengan</span>
            <Heart className="w-3 h-3 text-red-500 fill-red-500" />
            <span>untuk Mahasiswa Indonesia.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
