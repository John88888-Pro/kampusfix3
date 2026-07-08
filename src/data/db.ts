/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { User, Jasa, Pesanan, Pendapatan, Notifikasi, Review, UserRole, StatusPesanan, PenarikanDana } from '../types';
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  deleteDoc 
} from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';
import { db, auth, rtdb, handleFirestoreError, OperationType } from './firebase';
import { ref as rtdbRef, set as rtdbSet, remove as rtdbRemove, onValue } from 'firebase/database';
import { supabase } from './supabase';


// Mock Avatars
export const MOCK_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200', // Female 1
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', // Male 1
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200', // Female 2
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200', // Male 2
];

// Initial Users
const INITIAL_USERS: User[] = [
  {
    id: 'user_admin_1',
    name: 'Admin KampusFix',
    email: 'admin@kampusfix.com',
    role: 'admin',
    whatsapp: '6281122334455',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200',
    bio: 'Administrator Utama Platform Escrow KampusFix.',
    createdAt: '2026-03-01T08:00:00Z',
  },
  {
    id: 'user_pencari_1',
    name: 'Doni Gunawan',
    email: 'doni@mahasiswa.ac.id',
    role: 'pencari',
    whatsapp: '6281234567890',
    avatar: MOCK_AVATARS[1],
    bio: 'Mahasiswa Manajemen Sem 4. Sibuk di BEM dan butuh bantuan tugas presentasi!',
    createdAt: '2026-03-01T10:00:00Z',
  },
  {
    id: 'user_penyedia_1',
    name: 'Rian Pratama',
    email: 'rian@mahasiswa.ac.id',
    role: 'penyedia',
    whatsapp: '6289876543210',
    avatar: MOCK_AVATARS[3],
    bio: 'Mahasiswa Teknik Informatika Sem 6. Mahir React, Node.js, Frontend, Backend & Landing Page.',
    keahlian: 'Programming',
    createdAt: '2026-02-15T08:00:00Z',
    rekeningBank: 'Bank BCA',
    rekeningNama: 'Rian Pratama',
  },
  {
    id: 'user_penyedia_2',
    name: 'Sarah Amalia',
    email: 'sarah@mahasiswa.ac.id',
    role: 'penyedia',
    whatsapp: '6285511223344',
    avatar: MOCK_AVATARS[0],
    bio: 'Mahasiswa Desain Komunikasi Visual Sem 4. Spesialisasi vector ilustrasi, PPT keren, & feed Instagram.',
    keahlian: 'Desain Grafis',
    createdAt: '2026-02-20T09:00:00Z',
    rekeningBank: 'Bank Mandiri',
    rekeningNama: 'Sarah Amalia',
  },
  {
    id: 'user_penyedia_3',
    name: 'Budi Santoso',
    email: 'budi@mahasiswa.ac.id',
    role: 'penyedia',
    whatsapp: '6281299887766',
    avatar: MOCK_AVATARS[2],
    bio: 'Mahasiswa Sastra Inggris Sem 8. Skor TOEFL 610. Menerima terjemahan jurnal akademik & pembuatan makalah.',
    keahlian: 'Penerjemah',
    createdAt: '2026-02-28T14:00:00Z',
    rekeningBank: 'Bank BNI',
    rekeningNama: 'Budi Santoso',
  }
];

// Initial Jasa List
const INITIAL_JASA: Jasa[] = [
  {
    id: 'jasa_1',
    penyediaId: 'user_penyedia_1',
    penyediaName: 'Rian Pratama',
    penyediaAvatar: MOCK_AVATARS[3],
    penyediaWhatsapp: '6289876543210',
    title: 'Pembuatan Website Landing Page React + Tailwind Responsive',
    category: 'Programming & Tech',
    description: 'Butuh landing page untuk proyek kuliah, tugas pemrograman web, atau portofolio pribadi? Saya siap membantu membuatkan Landing Page single/multi-page menggunakan React, Vite, dan Tailwind CSS. Code dijamin bersih, responsive (mobile-friendly), dan sesuai fungsionalitas yang Anda request. File full source code akan dikirimkan.',
    price: 350000,
    duration: '2-3 Hari',
    features: ['Responsive Design', 'React Source Code', 'Revisi 2x', 'Integrasi Form'],
    ratingAvg: 4.9,
    totalSales: 12,
    status: 'aktif',
    images: ['https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&q=80&w=800']
  },
  {
    id: 'jasa_2',
    penyediaId: 'user_penyedia_2',
    penyediaName: 'Sarah Amalia',
    penyediaAvatar: MOCK_AVATARS[0],
    penyediaWhatsapp: '6285511223344',
    title: 'Desain Slide Presentasi PPT Keren & Interaktif Sidang Skripsi',
    category: 'Pembuatan PPT',
    description: 'Ingin sidang skripsi, seminar proposal, atau presentasi kelas Anda berkesan di mata dosen penguji? Saya menawarkan jasa pembuatan slide PPT kustom premium. Bukan templating biasa! Desain disesuaikan dengan topik presentasi, menggunakan infografis menarik, tipografi elegan, dan efek transisi yang tidak membosankan.',
    price: 90000,
    duration: '1 Hari',
    features: ['Minimalist Elegant Layout', 'Infografis Khusus', 'Format PPTX & PDF', 'Selesai 24 Jam', 'Revisi Bebas'],
    ratingAvg: 4.8,
    totalSales: 18,
    status: 'aktif',
    images: ['https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?auto=format&fit=crop&q=80&w=800']
  },
  {
    id: 'jasa_3',
    penyediaId: 'user_penyedia_2',
    penyediaName: 'Sarah Amalia',
    penyediaAvatar: MOCK_AVATARS[0],
    penyediaWhatsapp: '6285511223344',
    title: 'Desain Logo Brand UMKM atau Logo Kelompok Mahasiswa',
    category: 'Desain Grafis',
    description: 'Jasa pembuatan logo profesional dengan gaya modern, minimalis, dan mudah diingat. Cocok untuk tugas mata kuliah kewirausahaan, logo kelompok PKM, unit kegiatan mahasiswa (UKM), atau bisnis rintisan Anda pribadi. Anda akan mendapatkan file mentah (AI/PSD atau SVG) beserta PNG transparent latar belakang.',
    price: 150000,
    duration: '2-3 Hari',
    features: ['3 Pilihan Konsep', 'High Res PNG & SVG', 'Master File AI/PSD', 'Revisi Maksimal 3x'],
    ratingAvg: 4.7,
    totalSales: 8,
    status: 'aktif',
    images: ['https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=800']
  },
  {
    id: 'jasa_4',
    penyediaId: 'user_penyedia_3',
    penyediaName: 'Budi Santoso',
    penyediaAvatar: MOCK_AVATARS[2],
    penyediaWhatsapp: '6281299887766',
    title: 'Terjemahan Abstrak Jurnal & Artikel Akademik - Inggris Resmi',
    category: 'Penerjemah',
    description: 'Translator berpengalaman menerjemahkan dokumen skripsi dan tugas kampus. Khusus menerjemahkan Abstrak Skripsi, Paper Penelitian, maupun Jurnal berstandar Scopus. Dikerjakan manual (bukan Google Translate mentah) demi menjaga akurasi tata bahasa ilmiah, glosarium teknis, dan struktur formal (formal Indonesian-English & vice versa).',
    price: 50000,
    duration: '1 Hari',
    features: ['Manual Translation', 'Pemeriksaan Grammar Grammarly', 'Kosa Kata Akademik Standar', 'Selesai Kilat'],
    ratingAvg: 5.0,
    totalSales: 24,
    status: 'aktif',
    images: ['https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=800']
  },
  {
    id: 'jasa_5',
    penyediaId: 'user_penyedia_3',
    penyediaName: 'Budi Santoso',
    penyediaAvatar: MOCK_AVATARS[1],
    penyediaWhatsapp: '6281299887766',
    title: 'Penyusunan Makalah Metodologi Penelitian Sesuai Format Kampus',
    category: 'Penulisan Makalah',
    description: 'Mengalami kendala waktu demi menyelesaikan tugas penulisan makalah atau paper akademik? Saya siap membantu asistensi penyusunan makalah berkualitas dengan topik sosial, ekonomi, humas, maupun sains. Dilengkapi daftar pustaka standar APA/Harvard Seventh Edition dan sitasi yang rapi menggunakan Mendeley.',
    price: 120000,
    duration: '3+ Hari',
    features: ['Struktur Rapi Bebas Plagiasi', 'Referensi Up to Date', 'Mendeley Sitasi', 'Turnitin Similarity Check'],
    ratingAvg: 4.6,
    totalSales: 9,
    status: 'aktif',
    images: ['https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=800']
  },
  {
    id: 'jasa_6',
    penyediaId: 'user_penyedia_2',
    penyediaName: 'Sarah Amalia',
    penyediaAvatar: MOCK_AVATARS[0],
    penyediaWhatsapp: '6285511223344',
    title: 'Jasa Editing Video Reels Instagram, TikTok & Shorts Dinamis',
    category: 'Editing Video',
    description: 'Ubah rekaman video mentah Anda menjadi video pendek berdurasi 30-90 detik yang sangat menarik (highly engaging) untuk media sosial atau kebutuhan promosi acara kampus. Lengkap dengan caption teks otomatis, dynamic zoom, sound effects berlisensi bebas, serta color grading minimalis untuk meningkatkan nilai estetika video.',
    price: 110000,
    duration: '2-3 Hari',
    features: ['Auto Subtitling', 'Sound Effect & Music BGM', 'Color Grading Khas', 'Revisi 3x'],
    ratingAvg: 4.7,
    totalSales: 15,
    status: 'aktif',
    images: ['https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=800']
  }
];

// Initial Reviews
const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev_1',
    jasaId: 'jasa_1',
    pencariName: 'Satria Wijaya',
    pencariAvatar: MOCK_AVATARS[1],
    rating: 5,
    ulasan: 'Keren banget, hasil website responsive parah, ditanya-tanya soal coding-an juga dilayanin ramah banget! Sangat direkomendasikan.',
    createdAt: '2026-05-10T11:00:00Z',
  },
  {
    id: 'rev_2',
    jasaId: 'jasa_2',
    pencariName: 'Aulia Putri',
    pencariAvatar: MOCK_AVATARS[2],
    rating: 5,
    ulasan: 'Slide presentasi saya dapat peringkat terbaik di kelas tadi pagi! Dosen juga puji visualnya bersih dan ringkas. Fast response.',
    createdAt: '2026-05-15T09:30:00Z',
  },
  {
    id: 'rev_3',
    jasaId: 'jasa_4',
    pencariName: 'M. Syahroni',
    pencariAvatar: MOCK_AVATARS[1],
    rating: 5,
    ulasan: 'Grammar terjemahannya benar-benar formal, pas dikirim ke reviewer langsung lolos penataan bahasa Inggris abstraknya. Terima kasih Kak!',
    createdAt: '2026-05-20T14:15:00Z',
  }
];

// Initial Orders
const INITIAL_PESANAN: Pesanan[] = [
  {
    id: 'pesanan_demo_1',
    jasaId: 'jasa_2',
    jasaTitle: 'Desain Slide Presentasi PPT Keren & Interaktif Sidang Skripsi',
    jasaPrice: 90000,
    penyediaId: 'user_penyedia_2',
    penyediaName: 'Sarah Amalia',
    penyediaWhatsapp: '6285511223344',
    pencariId: 'user_pencari_1',
    pencariName: 'Doni Gunawan',
    pencariWhatsapp: '6281234567890',
    tugasTitle: 'PPT Proposal Penelitian Manajemen Pemasaran',
    tugasDesc: 'Membutuhkan presentasi 15 slide untuk ujian Proposal Skripsi mengenai analisis loyalitas pelanggan Kopi Lokal.',
    tugasDeadline: '2026-06-15',
    catatanTambahan: 'Tolong gunakan dominan warna coklat pastel agar sesuai tema kopi.',
    biayaPlatform: 4500,
    totalBayar: 94500,
    status: 'menunggu_pembayaran',
    createdAt: '2026-06-10T08:00:00Z',
    historis: [
      { status: 'menunggu_konfirmasi', date: '2026-06-10T08:00:00Z', note: 'Pesanan diajukan oleh Doni' },
      { status: 'menunggu_pembayaran', date: '2026-06-10T12:00:00Z', note: 'Diterima oleh Sarah. Silakan lakukan pembayaran.' }
    ]
  },
  {
    id: 'pesanan_demo_2',
    jasaId: 'jasa_1',
    jasaTitle: 'Pembuatan Website Landing Page React + Tailwind Responsive',
    jasaPrice: 350000,
    penyediaId: 'user_penyedia_1',
    penyediaName: 'Rian Pratama',
    penyediaWhatsapp: '6289876543210',
    pencariId: 'user_pencari_1',
    pencariName: 'Doni Gunawan',
    pencariWhatsapp: '6281234567890',
    tugasTitle: 'Landing Page Toko Sepatu Kampus',
    tugasDesc: 'Tugas mata kuliah Kewirausahaan, disuruh bikin web promosi e-commerce sepatu produk mahasiswa.',
    tugasDeadline: '2026-06-20',
    biayaPlatform: 17500,
    totalBayar: 367500,
    status: 'sedang_dikerjakan',
    buktiPembayaran: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&q=80&w=400',
    buktiPembayaranName: 'transfer-bca.png',
    createdAt: '2026-06-08T10:00:00Z',
    historis: [
      { status: 'menunggu_konfirmasi', date: '2026-06-08T10:00:00Z' },
      { status: 'menunggu_pembayaran', date: '2026-06-08T11:00:00Z' },
      { status: 'dibayar', date: '2026-06-08T11:30:00Z', note: 'Bukti pembayaran diunggah. Admin mengonfirmasi Pembayaran Escrow.' },
      { status: 'sedang_dikerjakan', date: '2026-06-08T14:00:00Z', note: 'Rian Pratama mulai mengerjakan proyek.' }
    ]
  }
];

// Initial Notifications
const INITIAL_NOTIFIKASI: Notifikasi[] = [
  {
    id: 'notif_1',
    userId: 'user_pencari_1',
    title: 'Pesanan Disetujui!',
    message: 'Pesanan Anda untuk "Desain Slide Presentasi PPT Keren" telah disetujui oleh Sarah Amalia. Harap selesaikan pembayaran.',
    read: false,
    pesananId: 'pesanan_demo_1',
    type: 'pesanan',
    createdAt: '2026-06-10T12:00:00Z',
  },
  {
    id: 'notif_2',
    userId: 'user_penyedia_1',
    title: 'Pembayaran Dikonfirmasi!',
    message: 'Doni Gunawan telah melakukan pembayaran untuk jasa pembuatan "Landing Page React". Mulai pengerjaan sekarang.',
    read: false,
    pesananId: 'pesanan_demo_2',
    type: 'pesanan',
    createdAt: '2026-06-08T11:30:00Z',
  }
];

// Database Engine with LocalStorage synchronization
export class KampusFixDB {
  static getStoredData<T>(key: string, defaults: T): T {
    try {
      const val = localStorage.getItem(`kampusfix_${key}`);
      return val ? JSON.parse(val) : defaults;
    } catch (e) {
      return defaults;
    }
  }

  static setStoredData<T>(key: string, val: T): void {
    try {
      localStorage.setItem(`kampusfix_${key}`, JSON.stringify(val));
    } catch (e) {
      console.error(e);
    }
  }

  static updateLocalCache<T>(key: string, val: T): void {
    try {
      localStorage.setItem(`kampusfix_${key}`, JSON.stringify(val));
      window.dispatchEvent(new Event('kampusfix-db-updated'));
    } catch (e) {
      console.error(e);
    }
  }

  static writeAndSync<T>(key: string, val: T): void {
    if (Array.isArray(val)) {
      const oldVal = this.getStoredData<any[]>(key, []);
      this.setStoredData(key, val);
      window.dispatchEvent(new Event('kampusfix-db-updated'));
      this.syncChangesToFirestore(key, val, oldVal);
      this.syncChangesToSupabase(key, val, oldVal);
    } else {
      this.setStoredData(key, val);
      window.dispatchEvent(new Event('kampusfix-db-updated'));
    }
  }

  static async syncSingleItem(key: string, item: any) {
    if (!item || !item.id) return;
    const collectionName = key === 'notif' || key === 'notifikasi' ? 'notifikasi' : key;
    try {
      const docRef = doc(db, collectionName, item.id);
      await setDoc(docRef, item);
      console.log(`Firestore Sync: successfully wrote single item ${collectionName}/${item.id}`);
    } catch (e) {
      console.warn(`Firestore Soft Sync Warning: failed to write single item ${collectionName}/${item.id}:`, e);
    }

    if (rtdb) {
      try {
        const dbRef = rtdbRef(rtdb, `${collectionName}/${item.id}`);
        await rtdbSet(dbRef, item);
        console.log(`RTDB Sync: successfully wrote single item ${collectionName}/${item.id}`);
      } catch (e) {
        console.warn(`RTDB Soft Sync Warning: failed to write single item ${collectionName}/${item.id}:`, e);
      }
    }

    // Supabase Sync
    try {
      const { error } = await supabase.from(collectionName).upsert(item);
      if (error) {
        console.warn(`Supabase Sync Warning: failed to write single item ${collectionName}/${item.id}:`, error.message);
      } else {
        console.log(`Supabase Sync: successfully wrote single item ${collectionName}/${item.id}`);
      }
    } catch (e) {
      console.warn(`Supabase Sync Exception: failed to write single item ${collectionName}/${item.id}:`, e);
    }
  }

  static async syncChangesToSupabase(key: string, newList: any[], oldList: any[]) {
    const tableName = key === 'notif' || key === 'notifikasi' ? 'notifikasi' : key;
    
    // Find added or modified items
    const oldMap = new Map<string, any>();
    for (const item of (oldList || [])) {
      if (item && item.id) {
        oldMap.set(item.id, item);
      }
    }

    const toWrite: any[] = [];
    for (const item of (newList || [])) {
      if (item && item.id) {
        const oldItem = oldMap.get(item.id);
        if (!oldItem) {
          toWrite.push(item);
        } else {
          if (JSON.stringify(item) !== JSON.stringify(oldItem)) {
            toWrite.push(item);
          }
        }
      }
    }

    // Find deleted items
    const newKeys = new Set((newList || []).map(item => item?.id).filter(Boolean));
    const toDelete: string[] = [];
    for (const item of (oldList || [])) {
      if (item && item.id && !newKeys.has(item.id)) {
        toDelete.push(item.id);
      }
    }

    // Write additions/modifications to Supabase
    for (const item of toWrite) {
      try {
        const { error } = await supabase.from(tableName).upsert(item);
        if (error) {
          console.warn(`Supabase Sync Warning on writing ${tableName}/${item.id}:`, error.message);
        } else {
          console.log(`Supabase Sync: successfully wrote ${tableName}/${item.id}`);
        }
      } catch (e) {
        console.warn(`Supabase Sync Exception on writing ${tableName}/${item.id}:`, e);
      }
    }

    // Delete removals from Supabase
    for (const id of toDelete) {
      try {
        const { error } = await supabase.from(tableName).delete().eq('id', id);
        if (error) {
          console.warn(`Supabase Sync Warning on deleting ${tableName}/${id}:`, error.message);
        } else {
          console.log(`Supabase Sync: successfully deleted ${tableName}/${id}`);
        }
      } catch (e) {
        console.warn(`Supabase Sync Exception on deleting ${tableName}/${id}:`, e);
      }
    }
  }

  static async syncArrayToSupabase(key: string, list: any[]) {
    const tableName = key === 'notif' || key === 'notifikasi' ? 'notifikasi' : key;
    for (const item of list) {
      if (item && item.id) {
        try {
          const { error } = await supabase.from(tableName).upsert(item);
          if (error) {
            console.warn(`Supabase Soft Warning on writing ${tableName}/${item.id}:`, error.message);
          }
        } catch (e) {
          console.warn(`Supabase Soft Exception on writing ${tableName}/${item.id}:`, e);
        }
      }
    }
  }


  static async syncChangesToFirestore(key: string, newList: any[], oldList: any[]) {
    const collectionName = key === 'notif' || key === 'notifikasi' ? 'notifikasi' : key;
    
    // Find added or modified items
    const oldMap = new Map<string, any>();
    for (const item of (oldList || [])) {
      if (item && item.id) {
        oldMap.set(item.id, item);
      }
    }

    const toWrite: any[] = [];
    for (const item of (newList || [])) {
      if (item && item.id) {
        const oldItem = oldMap.get(item.id);
        if (!oldItem) {
          // New item!
          toWrite.push(item);
        } else {
          // Compare if changed
          if (JSON.stringify(item) !== JSON.stringify(oldItem)) {
            toWrite.push(item);
          }
        }
      }
    }

    // Find deleted items
    const newKeys = new Set((newList || []).map(item => item?.id).filter(Boolean));
    const toDelete: string[] = [];
    for (const item of (oldList || [])) {
      if (item && item.id && !newKeys.has(item.id)) {
        toDelete.push(item.id);
      }
    }

    // Write additions/modifications to Firestore
    for (const item of toWrite) {
      try {
        const docRef = doc(db, collectionName, item.id);
        await setDoc(docRef, item);
        console.log(`Firestore Sync: successfully wrote ${collectionName}/${item.id}`);
      } catch (e) {
        console.warn(`Firestore Sync Warning on writing ${collectionName}/${item.id}:`, e);
      }

      if (rtdb) {
        try {
          const dbRef = rtdbRef(rtdb, `${collectionName}/${item.id}`);
          await rtdbSet(dbRef, item);
          console.log(`RTDB Sync: successfully wrote ${collectionName}/${item.id}`);
        } catch (e) {
          console.warn(`RTDB Sync Warning on writing ${collectionName}/${item.id}:`, e);
        }
      }
    }

    // Delete removals from Firestore
    for (const id of toDelete) {
      try {
        const docRef = doc(db, collectionName, id);
        await deleteDoc(docRef);
        console.log(`Firestore Sync: successfully deleted ${collectionName}/${id}`);
      } catch (e) {
        console.warn(`Firestore Sync Warning on deleting ${collectionName}/${id}:`, e);
      }

      if (rtdb) {
        try {
          const dbRef = rtdbRef(rtdb, `${collectionName}/${id}`);
          await rtdbRemove(dbRef);
          console.log(`RTDB Sync: successfully deleted ${collectionName}/${id}`);
        } catch (e) {
          console.warn(`RTDB Sync Warning on deleting ${collectionName}/${id}:`, e);
        }
      }
    }
  }

  static async syncArrayToFirestore(key: string, list: any[]) {
    const collectionName = key === 'notif' || key === 'notifikasi' ? 'notifikasi' : key;
    for (const item of list) {
      if (item && item.id) {
        try {
          const docRef = doc(db, collectionName, item.id);
          await setDoc(docRef, item);
        } catch (e) {
          // Soft warn so demo items from other developers don't break the current active user's operation path
          console.warn(`Firestore Soft Warning on writing ${collectionName}/${item.id}:`, e);
        }

        if (rtdb) {
          try {
            const dbRef = rtdbRef(rtdb, `${collectionName}/${item.id}`);
            await rtdbSet(dbRef, item);
          } catch (e) {
            console.warn(`RTDB Soft Warning on writing ${collectionName}/${item.id}:`, e);
          }
        }
      }
    }
  }

  // Load state
  static getUsers(): User[] { return this.getStoredData('users', INITIAL_USERS); }
  static saveUsers(users: User[]): void { this.writeAndSync('users', users); }

  static getJasa(): Jasa[] { return this.getStoredData('jasa', INITIAL_JASA); }
  static saveJasa(jasa: Jasa[]): void { this.writeAndSync('jasa', jasa); }

  static getPesanan(): Pesanan[] { return this.getStoredData('pesanan', INITIAL_PESANAN); }
  static savePesanan(pesanan: Pesanan[]): void { this.writeAndSync('pesanan', pesanan); }

  static getNotifications(): Notifikasi[] { return this.getStoredData('notif', INITIAL_NOTIFIKASI); }
  static saveNotifications(notif: Notifikasi[]): void { this.writeAndSync('notif', notif); }

  static getReviews(): Review[] { return this.getStoredData('reviews', INITIAL_REVIEWS); }
  static saveReviews(rev: Review[]): void { this.writeAndSync('reviews', rev); }

  static getPendapatan(): Pendapatan[] {
    const defaultPendapatan: Pendapatan[] = [
      {
        id: 'pend_1',
        pesananId: 'pesanan_demo_completed',
        penyediaId: 'user_penyedia_2',
        jasaTitle: 'Desain Slide Presentasi PPT Keren',
        pencariName: 'Ferry Ardiansyah',
        amount: 90000,
        statusCair: true,
        createdAt: '2026-06-05T09:00:00Z'
      }
    ];
    return this.getStoredData('pendapatan', defaultPendapatan);
  }
  static savePendapatan(pend: Pendapatan[]): void { this.writeAndSync('pendapatan', pend); }

  static getPenarikanDana(): PenarikanDana[] {
    const defaults: PenarikanDana[] = [
      {
        id: 'wd_demo_1',
        penyediaId: 'user_penyedia_2',
        penyediaName: 'Sarah Amalia',
        rekeningBank: 'Bank Mandiri',
        rekeningNama: 'Sarah Amalia',
        rekeningNomor: '1234567890',
        amount: 150000,
        status: 'pending',
        createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
      },
      {
        id: 'wd_demo_2',
        penyediaId: 'user_penyedia_1',
        penyediaName: 'Rian Pratama',
        rekeningBank: 'Bank BCA',
        rekeningNama: 'Rian Pratama',
        rekeningNomor: '0987654321',
        amount: 350000,
        status: 'disetujui',
        catatanAdmin: 'Sudah ditransfer via BCA, silakan periksa mutasi Anda.',
        createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString()
      }
    ];
    return this.getStoredData('penarikan_dana', defaults);
  }
  static savePenarikanDana(list: PenarikanDana[]): void {
    this.writeAndSync('penarikan_dana', list);
  }
  static addPenarikanDana(penyediaId: string, penyediaName: string, bank: string, nama: string, nomor: string, amount: number): PenarikanDana {
    const list = this.getPenarikanDana();
    const newWd: PenarikanDana = {
      id: `wd_${Date.now()}`,
      penyediaId,
      penyediaName,
      rekeningBank: bank,
      rekeningNama: nama,
      rekeningNomor: nomor,
      amount,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    list.unshift(newWd);
    this.savePenarikanDana(list);
    return newWd;
  }

  // Auth simulators
  static getActiveUser(): User | null {
    return this.getStoredData<User | null>('active_user', null); // guest by default
  }
  static setActiveUser(user: User | null): void {
    this.setStoredData('active_user', user);
  }

  // Helpers to login & signup
  static login(email: string, role: UserRole): User | null {
    const users = this.getUsers();
    let found = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.role === role);
    if (!found) {
      // Find any role match if exact fails
      found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (found) {
        // Change role for simulation convenience or alert
        found.role = role;
        this.saveUsers(users);
      }
    }
    
    if (found) {
      this.setActiveUser(found);
      return found;
    }
    return null;
  }

  static register(name: string, email: string, role: UserRole, whatsapp: string, keahlian?: string): User {
    const users = this.getUsers();
    const newUser: User = {
      id: `user_${Date.now()}`,
      name,
      email,
      role,
      whatsapp: whatsapp.startsWith('0') ? '62' + whatsapp.substring(1) : whatsapp,
      avatar: MOCK_AVATARS[users.length % MOCK_AVATARS.length],
      bio: `Mulai bergabung sebagai ${role === 'penyedia' ? 'Penyedia Jasa' : 'Pencari Jasa'} KampusFix.`,
      keahlian: role === 'penyedia' ? keahlian || 'Programming' : undefined,
      createdAt: new Date().toISOString(),
      rekeningBank: role === 'penyedia' ? 'Bank Mandiri' : undefined,
      rekeningNama: role === 'penyedia' ? name : undefined,
    };
    users.push(newUser);
    this.saveUsers(users);
    this.setActiveUser(newUser);
    return newUser;
  }

  // Jasa API Simulated
  static addJasa(jasa: Omit<Jasa, 'id' | 'penyediaId' | 'penyediaName' | 'penyediaAvatar' | 'penyediaWhatsapp' | 'ratingAvg' | 'totalSales'>): Jasa {
    const active = this.getActiveUser();
    if (!active || active.role !== 'penyedia') throw new Error('Unauthorized');
    
    const all = this.getJasa();
    const newJ: Jasa = {
      ...jasa,
      id: `jasa_${Date.now()}`,
      penyediaId: active.id,
      penyediaName: active.name,
      penyediaAvatar: active.avatar,
      penyediaWhatsapp: active.whatsapp,
      ratingAvg: 0,
      totalSales: 0
    };
    all.push(newJ);
    this.saveJasa(all);
    return newJ;
  }

  static updateJasa(updated: Jasa): void {
    const all = this.getJasa();
    const index = all.findIndex(x => x.id === updated.id);
    if (index !== -1) {
      all[index] = updated;
      this.saveJasa(all);
    }
  }

  static deleteJasa(id: string): void {
    const all = this.getJasa();
    this.saveJasa(all.filter(x => x.id !== id));
    deleteDoc(doc(db, 'jasa', id)).catch(e => console.error('Error deleting Jasa in Firestore:', e));
  }

  // Order Flow API Simulated
  static createPesanan(jasaId: string, input: { tugasTitle: string; tugasDesc: string; tugasDeadline: string; fileBase64?: string; fileName?: string; catatan?: string }): Pesanan {
    const active = this.getActiveUser();
    if (!active) throw new Error('Must be logged in');

    const jasa = this.getJasa().find(x => x.id === jasaId);
    if (!jasa) throw new Error('Jasa not found');

    const amount = jasa.price;
    const adminFee = Math.round(amount * 0.10);
    const total = amount;

    const newOrder: Pesanan = {
      id: `pesanan_${Date.now()}`,
      jasaId: jasa.id,
      jasaTitle: jasa.title,
      jasaPrice: amount,
      penyediaId: jasa.penyediaId,
      penyediaName: jasa.penyediaName,
      penyediaWhatsapp: jasa.penyediaWhatsapp,
      pencariId: active.id,
      pencariName: active.name,
      pencariWhatsapp: active.whatsapp,
      tugasTitle: input.tugasTitle,
      tugasDesc: input.tugasDesc,
      tugasDeadline: input.tugasDeadline,
      tugasFileUrl: input.fileBase64,
      tugasFileName: input.fileName,
      catatanTambahan: input.catatan,
      biayaPlatform: adminFee,
      totalBayar: total,
      status: 'menunggu_konfirmasi',
      createdAt: new Date().toISOString(),
      historis: [
        { status: 'menunggu_konfirmasi', date: new Date().toISOString(), note: 'Pesanan diajukan oleh ' + active.name }
      ]
    };

    const orders = this.getPesanan();
    orders.push(newOrder);
    this.savePesanan(orders);

    // Create Notification for Helper/Provider
    this.addNotification(
      jasa.penyediaId,
      'Pesanan Masuk Baru!',
      `Mahasiswa ${active.name} memesan jasa "${jasa.title}".`,
      'pesanan',
      newOrder.id
    );

    return newOrder;
  }

  static updatePesananStatus(id: string, newStatus: StatusPesanan, note?: string): Pesanan {
    const orders = this.getPesanan();
    const index = orders.findIndex(x => x.id === id);
    if (index === -1) throw new Error('Order not found');

    const ord = orders[index];
    ord.status = newStatus;
    ord.historis.push({
      status: newStatus,
      date: new Date().toISOString(),
      note: note || `Status diperbarui menjadi ${newStatus.replace('_', ' ')}`
    });

    if (newStatus === 'menunggu_pembayaran') {
      this.addNotification(ord.pencariId, 'Pesanan Disetujui!', `Penyedia ${ord.penyediaName} menyetujui pesanan Anda. Silakan bayar.`, 'pesanan', ord.id);
    } else if (newStatus === 'dibayar') {
      this.addNotification(ord.penyediaId, 'Pesanan Telah Dibayar!', `Pembayaran sebesar Rp ${ord.totalBayar.toLocaleString('id-ID')} diterima. Mulai pengerjaan.`, 'pesanan', ord.id);
    } else if (newStatus === 'sedang_dikerjakan') {
      this.addNotification(ord.pencariId, 'Pengerjaan Dimulai!', `Penyedia ${ord.penyediaName} sedang mengerjakan tugas Anda.`, 'pesanan', ord.id);
    } else if (newStatus === 'selesai_menunggu_konfirmasi') {
      this.addNotification(ord.pencariId, 'Pekerjaan Selesai!', `Penyedia telah mengupload hasil. Silakan periksa dan konfirmasi.`, 'pesanan', ord.id);
    } else if (newStatus === 'selesai') {
      // Escrow disburse
      const revenue = this.getPendapatan();
      const nettAmount = ord.jasaPrice - (ord.biayaPlatform || 0);
      revenue.push({
        id: `pend_${Date.now()}`,
        pesananId: ord.id,
        penyediaId: ord.penyediaId,
        jasaTitle: ord.jasaTitle,
        pencariName: ord.pencariName,
        amount: nettAmount,
        statusCair: false,
        createdAt: new Date().toISOString()
      });
      this.savePendapatan(revenue);

      // Add sales to Jasa table
      const jsAll = this.getJasa();
      const jsIndex = jsAll.findIndex(j => j.id === ord.jasaId);
      if (jsIndex !== -1) {
        jsAll[jsIndex].totalSales += 1;
        this.saveJasa(jsAll);
      }

      this.addNotification(ord.penyediaId, 'Pesanan Selesai!', `Pencari mengonfirmasi pekerjaan selesai. Dana Rp ${nettAmount.toLocaleString('id-ID')} dicairkan.`, 'pesanan', ord.id);
    } else if (newStatus === 'ditolak') {
      this.addNotification(ord.pencariId, 'Pesanan Ditolak', `Penyedia menolak pesanan Anda. Hubungi WA penyedia untuk info lebih lanjut.`, 'pesanan', ord.id);
    }

    orders[index] = ord;
    this.savePesanan(orders);
    this.syncSingleItem('pesanan', ord);
    return ord;
  }

  static addReview(jasaId: string, rating: number, ulasan: string, pencariName: string, pencariAvatar: string): void {
    const reviews = this.getReviews();
    const newRev: Review = {
      id: `rev_${Date.now()}`,
      jasaId,
      pencariName,
      pencariAvatar,
      rating,
      ulasan,
      createdAt: new Date().toISOString()
    };
    reviews.push(newRev);
    this.saveReviews(reviews);
    this.syncSingleItem('reviews', newRev);

    // Recalculate Average Rating
    const jasaAll = this.getJasa();
    const index = jasaAll.findIndex(j => j.id === jasaId);
    if (index !== -1) {
      const parentReviews = reviews.filter(r => r.jasaId === jasaId);
      const avg = parentReviews.reduce((sum, item) => sum + item.rating, 0) / parentReviews.length;
      jasaAll[index].ratingAvg = parseFloat(avg.toFixed(1));
      this.saveJasa(jasaAll);
      this.syncSingleItem('jasa', jasaAll[index]);
    }
  }

  static addNotification(userId: string, title: string, message: string, type: 'pesanan' | 'sistem' | 'kategori', pesananId?: string): void {
    const notifs = this.getNotifications();
    notifs.unshift({
      id: `notif_${Date.now()}`,
      userId,
      title,
      message,
      read: false,
      pesananId,
      type,
      createdAt: new Date().toISOString()
    });
    this.saveNotifications(notifs);
  }
}

// Firebase Sync and Initialization Engine
export class FirebaseSync {
  static initialized = false;

  static async init() {
    if (this.initialized) return;
    this.initialized = true;

    try {
      console.log('Registering Google firebase session anonymously...');
      await signInAnonymously(auth);
      console.log('Firebase auth connected as anonymous user', auth.currentUser?.uid);
    } catch (e) {
      console.error('Firebase Auth failed, operating in offline-first mode:', e);
    }

    const defaultPendapatan = [
      {
        id: 'pend_1',
        pesananId: 'pesanan_demo_completed',
        penyediaId: 'user_penyedia_2',
        jasaTitle: 'Desain Slide Presentasi PPT Keren',
        pencariName: 'Ferry Ardiansyah',
        amount: 90000,
        statusCair: true,
        createdAt: '2026-06-05T09:00:00Z'
      }
    ];

    const defaultPenarikanDana = [
      {
        id: 'wd_demo_1',
        penyediaId: 'user_penyedia_2',
        penyediaName: 'Sarah Amalia',
        rekeningBank: 'Bank Mandiri',
        rekeningNama: 'Sarah Amalia',
        rekeningNomor: '1234567890',
        amount: 150000,
        status: 'pending',
        createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
      },
      {
        id: 'wd_demo_2',
        penyediaId: 'user_penyedia_1',
        penyediaName: 'Rian Pratama',
        rekeningBank: 'Bank BCA',
        rekeningNama: 'Rian Pratama',
        rekeningNomor: '0987654321',
        amount: 350000,
        status: 'disetujui',
        catatanAdmin: 'Sudah ditransfer via BCA, silakan periksa mutasi Anda.',
        createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString()
      }
    ];

    // Set up snapshot listeners for all Firebase collections
    this.setupListener('users', INITIAL_USERS);
    this.setupListener('jasa', INITIAL_JASA);
    this.setupListener('pesanan', INITIAL_PESANAN);
    this.setupListener('notif', INITIAL_NOTIFIKASI);
    this.setupListener('reviews', INITIAL_REVIEWS);
    this.setupListener('pendapatan', defaultPendapatan);
    this.setupListener('penarikan_dana', defaultPenarikanDana);

    // Set up snapshot/real-time listeners for all Supabase tables
    this.setupSupabaseListener('users', INITIAL_USERS);
    this.setupSupabaseListener('jasa', INITIAL_JASA);
    this.setupSupabaseListener('pesanan', INITIAL_PESANAN);
    this.setupSupabaseListener('notif', INITIAL_NOTIFIKASI);
    this.setupSupabaseListener('reviews', INITIAL_REVIEWS);
    this.setupSupabaseListener('pendapatan', defaultPendapatan);
    this.setupSupabaseListener('penarikan_dana', defaultPenarikanDana);
  }

  static setupListener(key: string, fallbackDefaults: any[]) {
    const firestoreCollection = key === 'notif' || key === 'notifikasi' ? 'notifikasi' : key;
    let isListeningToRTDB = false;

    const setupRTDB = () => {
      if (isListeningToRTDB) return;
      isListeningToRTDB = true;
      if (rtdb) {
        console.log(`Setting up RTDB listener for "${firestoreCollection}"...`);
        const dbRef = rtdbRef(rtdb, firestoreCollection);
        onValue(dbRef, (snapshot) => {
          if (!snapshot.exists()) {
            console.log(`RTDB path "${firestoreCollection}" empty! Seeding fallback template...`);
            this.bootstrapRTDB(firestoreCollection, fallbackDefaults);
            return;
          }

          const data: any[] = [];
          snapshot.forEach(child => {
            data.push(child.val());
          });

          if (firestoreCollection === 'notifikasi') {
            data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          }

          // Update local cache
          KampusFixDB.updateLocalCache(key, data);
        }, (error) => {
          console.error(`RTDB listener for path ${firestoreCollection} failed:`, error);
        });
      }
    };

    onSnapshot(collection(db, firestoreCollection), (snapshot) => {
      if (snapshot.empty) {
        console.log(`Firestore collection "${firestoreCollection}" empty! Seeding fallback template...`);
        this.bootstrapCollection(firestoreCollection, fallbackDefaults);
        return;
      }

      const data: any[] = [];
      snapshot.forEach(d => {
        data.push(d.data());
      });

      // Sort notifications by newest
      if (firestoreCollection === 'notifikasi') {
        data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }

      // Update local storage without write-through recursion
      KampusFixDB.updateLocalCache(key, data);
    }, (error) => {
      console.warn(`Firebase Firestore listener for collection ${firestoreCollection} failed:`, error);
      if (rtdb) {
        setupRTDB();
      } else {
        console.warn(`Fallback active: operating with local storage and Supabase for "${firestoreCollection}".`);
      }
    });

    // If RTDB is available, listen to it to ensure instant updates from RTDB as well
    if (rtdb) {
      setupRTDB();
    }
  }

  static async bootstrapCollection(collectionName: string, defaults: any[]) {
    try {
      for (const item of defaults) {
        if (item && item.id) {
          await setDoc(doc(db, collectionName, item.id), item);
        }
      }
    } catch (e) {
      console.error(`Error bootstrapping collection ${collectionName} with defaults:`, e);
      handleFirestoreError(e, OperationType.WRITE, collectionName);
    }
  }

  static async bootstrapRTDB(collectionName: string, defaults: any[]) {
    if (!rtdb) return;
    try {
      for (const item of defaults) {
        if (item && item.id) {
          const dbRef = rtdbRef(rtdb, `${collectionName}/${item.id}`);
          await rtdbSet(dbRef, item);
        }
      }
    } catch (e) {
      console.error(`Error bootstrapping RTDB path ${collectionName} with defaults:`, e);
    }
  }

  static async setupSupabaseListener(key: string, fallbackDefaults: any[]) {
    const tableName = key === 'notif' || key === 'notifikasi' ? 'notifikasi' : key;
    console.log(`Setting up Supabase listener/fetcher for table: ${tableName}`);

    // 1. Initial Fetch
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*');
      
      if (error) {
        console.warn(`Supabase fetch failed for ${tableName}:`, error.message);
        // If there's an error (e.g. table doesn't exist yet), we keep using our local storage/defaults and don't overwrite it with empty.
      } else if (data && data.length > 0) {
        console.log(`Supabase fetch success for ${tableName}: loaded ${data.length} items.`);
        
        let sortedData = [...data];
        if (tableName === 'notifikasi') {
          sortedData.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }
        
        // Update local cache
        KampusFixDB.updateLocalCache(key, sortedData);
      } else {
        console.log(`Supabase table ${tableName} is empty. Seeding defaults...`);
        // Seed defaults to Supabase so it has data
        await this.bootstrapSupabase(tableName, fallbackDefaults);
      }
    } catch (err) {
      console.warn(`Supabase fetch connection failed for ${tableName}:`, err);
    }

    // 2. Real-time Subscription
    try {
      supabase
        .channel(`public:${tableName}`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: tableName },
          (payload) => {
            console.log(`Supabase Realtime Change in ${tableName}:`, payload);
            // Re-fetch all to keep cache fully in sync and preserve array structures
            this.reFetchSupabaseTable(key, tableName, fallbackDefaults);
          }
        )
        .subscribe();
    } catch (e) {
      console.warn(`Supabase Real-time subscription error for ${tableName}:`, e);
    }
  }

  static async reFetchSupabaseTable(key: string, tableName: string, fallbackDefaults: any[]) {
    try {
      const { data, error } = await supabase.from(tableName).select('*');
      if (!error && data) {
        let sortedData = [...data];
        if (tableName === 'notifikasi') {
          sortedData.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }
        KampusFixDB.updateLocalCache(key, sortedData);
      }
    } catch (err) {
      console.warn(`Supabase re-fetch error for ${tableName}:`, err);
    }
  }

  static async bootstrapSupabase(tableName: string, defaults: any[]) {
    try {
      for (const item of defaults) {
        if (item && item.id) {
          const { error } = await supabase.from(tableName).upsert(item);
          if (error) {
            console.warn(`Supabase seeding failed for ${tableName}/${item.id}:`, error.message);
          }
        }
      }
      console.log(`Supabase bootstrap success for ${tableName}`);
    } catch (e) {
      console.warn(`Supabase bootstrap exception for ${tableName}:`, e);
    }
  }
}

// Automatically start synchronization when the library loads
if (typeof window !== 'undefined') {
  FirebaseSync.init();
}
