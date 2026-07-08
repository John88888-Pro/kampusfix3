import { createClient } from '@supabase/supabase-js';

// Supabase configuration provided by user
let SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
if (!SUPABASE_URL || typeof SUPABASE_URL !== 'string' || !SUPABASE_URL.startsWith('http')) {
  SUPABASE_URL = 'https://haapeekywphpklkcxekl.supabase.co';
}

let SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
if (!SUPABASE_ANON_KEY || typeof SUPABASE_ANON_KEY !== 'string' || SUPABASE_ANON_KEY.trim() === '' || SUPABASE_ANON_KEY.startsWith('YOUR_')) {
  SUPABASE_ANON_KEY = 'sb_publishable_79EoUpXby1sIPsfTQQl58g_ryfAZvdt';
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * SQL DDL to create tables in Supabase SQL Editor:
 * 
 * -- 1. USERS TABLE
 * CREATE TABLE IF NOT EXISTS users (
 *   id TEXT PRIMARY KEY,
 *   name TEXT,
 *   email TEXT,
 *   role TEXT,
 *   whatsapp TEXT,
 *   avatar TEXT,
 *   bio TEXT,
 *   keahlian TEXT,
 *   "createdAt" TEXT,
 *   "rekeningBank" TEXT,
 *   "rekeningNama" TEXT,
 *   "rekeningNomor" TEXT
 * );
 * 
 * -- Enable Row Level Security (RLS) or disable for testing
 * ALTER TABLE users DISABLE ROW LEVEL SECURITY;
 * 
 * -- 2. JASA TABLE
 * CREATE TABLE IF NOT EXISTS jasa (
 *   id TEXT PRIMARY KEY,
 *   "penyediaId" TEXT,
 *   "penyediaName" TEXT,
 *   "penyediaAvatar" TEXT,
 *   "penyediaWhatsapp" TEXT,
 *   title TEXT,
 *   category TEXT,
 *   description TEXT,
 *   price NUMERIC,
 *   duration TEXT,
 *   features JSONB,
 *   "ratingAvg" NUMERIC,
 *   "totalSales" INTEGER,
 *   status TEXT,
 *   images JSONB
 * );
 * ALTER TABLE jasa DISABLE ROW LEVEL SECURITY;
 * 
 * -- 3. PESANAN TABLE
 * CREATE TABLE IF NOT EXISTS pesanan (
 *   id TEXT PRIMARY KEY,
 *   "jasaId" TEXT,
 *   "jasaTitle" TEXT,
 *   "jasaPrice" NUMERIC,
 *   "penyediaId" TEXT,
 *   "penyediaName" TEXT,
 *   "penyediaWhatsapp" TEXT,
 *   "pencariId" TEXT,
 *   "pencariName" TEXT,
 *   "pencariWhatsapp" TEXT,
 *   "tugasTitle" TEXT,
 *   "tugasDesc" TEXT,
 *   "tugasDeadline" TEXT,
 *   "catatanTambahan" TEXT,
 *   "biayaPlatform" NUMERIC,
 *   "totalBayar" NUMERIC,
 *   status TEXT,
 *   "buktiPembayaran" TEXT,
 *   "buktiPembayaranName" TEXT,
 *   "createdAt" TEXT,
 *   historis JSONB
 * );
 * ALTER TABLE pesanan DISABLE ROW LEVEL SECURITY;
 * 
 * -- 4. NOTIFIKASI TABLE
 * CREATE TABLE IF NOT EXISTS notifikasi (
 *   id TEXT PRIMARY KEY,
 *   "userId" TEXT,
 *   title TEXT,
 *   message TEXT,
 *   read BOOLEAN,
 *   "pesananId" TEXT,
 *   type TEXT,
 *   "createdAt" TEXT
 * );
 * ALTER TABLE notifikasi DISABLE ROW LEVEL SECURITY;
 * 
 * -- 5. REVIEWS TABLE
 * CREATE TABLE IF NOT EXISTS reviews (
 *   id TEXT PRIMARY KEY,
 *   "pesananId" TEXT,
 *   "jasaId" TEXT,
 *   "pencariName" TEXT,
 *   "pencariAvatar" TEXT,
 *   rating NUMERIC,
 *   comment TEXT,
 *   "createdAt" TEXT
 * );
 * ALTER TABLE reviews DISABLE ROW LEVEL SECURITY;
 * 
 * -- 6. PENDAPATAN TABLE
 * CREATE TABLE IF NOT EXISTS pendapatan (
 *   id TEXT PRIMARY KEY,
 *   "pesananId" TEXT,
 *   "penyediaId" TEXT,
 *   "jasaTitle" TEXT,
 *   "pencariName" TEXT,
 *   amount NUMERIC,
 *   "statusCair" BOOLEAN,
 *   "createdAt" TEXT
 * );
 * ALTER TABLE pendapatan DISABLE ROW LEVEL SECURITY;
 * 
 * -- 7. PENARIKAN DANA TABLE
 * CREATE TABLE IF NOT EXISTS penarikan_dana (
 *   id TEXT PRIMARY KEY,
 *   "penyediaId" TEXT,
 *   "penyediaName" TEXT,
 *   "rekeningBank" TEXT,
 *   "rekeningNama" TEXT,
 *   "rekeningNomor" TEXT,
 *   amount NUMERIC,
 *   status TEXT,
 *   "catatanAdmin" TEXT,
 *   "createdAt" TEXT
 * );
 * ALTER TABLE penarikan_dana DISABLE ROW LEVEL SECURITY;
 */
