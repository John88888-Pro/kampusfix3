/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Key, 
  Mail, 
  User as UserIcon, 
  Phone, 
  ShieldCheck, 
  CheckCircle,
  Briefcase,
  Sliders,
  DollarSign,
  Star
} from 'lucide-react';
import { User, UserRole } from '../types';
import { KampusFixDB, MOCK_AVATARS } from '../data/db';

/* ============================================================================
   1. LOGIN & REGISTER VIEW
   ============================================================================ */
interface LoginPageProps {
  onNavigate: (view: string, params?: any) => void;
  onLoginSuccess: (user: User) => void;
  tabInitial?: 'masuk' | 'daftar';
  roleSetInitial?: UserRole;
  refreshTrigger: number;
}

export function LoginPage({ 
  onNavigate, 
  onLoginSuccess, 
  tabInitial = 'masuk', 
  roleSetInitial = 'pencari',
  refreshTrigger 
}: LoginPageProps) {
  const [activeTab, setActiveTab] = useState<'masuk' | 'daftar'>(tabInitial);
  const [role, setRole] = useState<UserRole>(roleSetInitial);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [keahlian, setKeahlian] = useState('Programming & Tech');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Certificate / Portfolio attributes during registration
  const [regCertTitle, setRegCertTitle] = useState('');
  const [regCertIssuer, setRegCertIssuer] = useState('');
  const [regCertYear, setRegCertYear] = useState('');
  const [regCertDesc, setRegCertDesc] = useState('');
  const [regCertFileUrl, setRegCertFileUrl] = useState('');

  useEffect(() => {
    setActiveTab(tabInitial || 'masuk');
  }, [tabInitial, refreshTrigger]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Simulated Login
    const users = KampusFixDB.getUsers();
    let found = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    
    // Auto-create or repair admin user if logging in as admin@kampusfix.com
    if (email.trim().toLowerCase() === 'admin@kampusfix.com') {
      if (password.trim() !== 'admin123') {
        setErrorMsg('Kata sandi administrator salah. Gunakan "admin123".');
        return;
      }
      
      if (!found) {
        // Create the admin user in db if not present
        const newAdmin: User = {
          id: 'user_admin_1',
          name: 'Admin KampusFix',
          email: 'admin@kampusfix.com',
          role: 'admin',
          whatsapp: '6281122334455',
          avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200',
          bio: 'Administrator Utama Platform Escrow KampusFix.',
          createdAt: new Date().toISOString(),
        };
        const updatedUsers = [...users, newAdmin];
        KampusFixDB.saveUsers(updatedUsers);
        found = newAdmin;
      } else if (found.role !== 'admin') {
        found.role = 'admin';
        KampusFixDB.saveUsers(users);
      }
    }

    if (found) {
      // simulate success
      KampusFixDB.setActiveUser(found);
      onLoginSuccess(found);
      
      const savedView = sessionStorage.getItem('redirect_after_login_view');
      const savedParams = sessionStorage.getItem('redirect_after_login_params');
      
      if (savedView) {
        sessionStorage.removeItem('redirect_after_login_view');
        sessionStorage.removeItem('redirect_after_login_params');
        onNavigate(savedView, savedParams ? JSON.parse(savedParams) : undefined);
      } else {
        onNavigate(
          found.role === 'admin' 
            ? 'dashboard-admin' 
            : found.role === 'pencari' 
              ? 'dashboard-pencari' 
              : 'dashboard-penyedia'
        );
      }
    } else {
      setErrorMsg('Email tidak terdaftar. Tips: gunakan email doni@mahasiswa.ac.id atau daftar baru.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name || !email || !password || !whatsapp) {
      setErrorMsg('Semua kolom wajib diisi.');
      return;
    }

    // check duplicate
    const users = KampusFixDB.getUsers();
    if (users.some(u => u.email.toLowerCase() === email.trim().toLowerCase())) {
      setErrorMsg('Email sudah terdaftar. Gunakan email lain atau silakan Masuk.');
      return;
    }

    // Success create
    const newUser = KampusFixDB.register(name, email, role, whatsapp, keahlian);
    
    // Add portfolio if penyedia provided registration certificate
    if (role === 'penyedia' && regCertTitle.trim()) {
      newUser.portofolio = [{
        id: `cert_${Date.now()}`,
        title: regCertTitle.trim(),
        issuer: regCertIssuer.trim() || 'Lembaga Mandiri',
        year: regCertYear.trim() || new Date().getFullYear().toString(),
        description: regCertDesc.trim() || '',
        fileUrl: regCertFileUrl || undefined
      }];
      
      // sync modifications to user list
      const allUsers = KampusFixDB.getUsers();
      const idx = allUsers.findIndex(u => u.id === newUser.id);
      if (idx !== -1) {
        allUsers[idx] = newUser;
        KampusFixDB.saveUsers(allUsers);
        KampusFixDB.setActiveUser(newUser);
      }
    }

    // Welcome notification
    KampusFixDB.addNotification(
      newUser.id,
      'Selamat Datang di KampusFix!',
      'Terima kasih telah bergabung. Akun Anda berhasil terverifikasi. Selamat beraktivitas.',
      'sistem'
    );

    setSuccessMsg('Pendaftaran berhasil! Mengalihkan...');
    setTimeout(() => {
      onLoginSuccess(newUser);
      onNavigate(role === 'pencari' ? 'dashboard-pencari' : 'dashboard-penyedia');
    }, 1000);
  };

  return (
    <div className="max-w-md mx-auto my-12 p-6 bg-white rounded-2xl border border-gray-100 shadow-xl space-y-6 animate-in fade-in slide-in-from-top-4 duration-200">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-display font-extrabold text-gray-950">
          Gabung Kampus<span className="text-[#0F7B4E]">Fix</span>
        </h2>
        <p className="text-xs text-gray-400">Portal transaksi jasa terpercaya antar mahasiswa kampus</p>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 p-1 bg-gray-50 rounded-xl border border-gray-200/50">
        <button 
          onClick={() => { onNavigate('login', { tab: 'masuk', roleSet: role }); setErrorMsg(''); }}
          className={`py-2 text-xs font-bold leading-none rounded-lg cursor-pointer transition-all ${activeTab === 'masuk' ? 'bg-white text-[#0F7B4E] shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
        >
          Masuk Akun
        </button>
        <button 
          onClick={() => { onNavigate('login', { tab: 'daftar', roleSet: role }); setErrorMsg(''); }}
          className={`py-2 text-xs font-bold leading-none rounded-lg cursor-pointer transition-all ${activeTab === 'daftar' ? 'bg-white text-[#0F7B4E] shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
        >
          Daftar Baru
        </button>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
          ⚠️ {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-semibold">
          🎉 {successMsg}
        </div>
      )}

      {activeTab === 'masuk' ? (
        /* LOGIN FORM */
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold tracking-wider uppercase text-gray-500 block font-mono">Email Aktif</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input 
                type="email"
                required
                placeholder="email@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs pl-10 pr-4 py-3 border border-gray-200 focus:border-[#0F7B4E] rounded-xl outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-extrabold tracking-wider uppercase text-gray-500 block font-mono">Kata Sandi (Password)</label>
              <button 
                type="button"
                onClick={() => onNavigate('lupa-password')}
                className="text-[10px] text-gray-400 hover:underline cursor-pointer border-none bg-transparent"
              >
                Lupa Password?
              </button>
            </div>
            <div className="relative">
              <Key className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input 
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs pl-10 pr-4 py-3 border border-gray-200 focus:border-[#0F7B4E] rounded-xl outline-none"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-3 bg-[#0F7B4E] hover:bg-[#0B5E3C] text-white text-xs font-bold font-display uppercase tracking-wider rounded-xl cursor-pointer transition-colors"
          >
            Masuk Sekarang
          </button>
        </form>
      ) : (
        /* REGISTER FORM */
        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          
          {/* Select Role Box */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold tracking-wider uppercase text-gray-500 block font-mono">Pilih Role Pengguna</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('pencari')}
                className={`p-3 border rounded-xl text-center cursor-pointer transition-all ${role === 'pencari' ? 'border-[#0F7B4E] bg-emerald-50/50' : 'border-gray-200 hover:bg-gray-50'}`}
              >
                <p className="font-bold text-xs text-gray-900 leading-none">Pencari Jasa</p>
                <p className="text-[9px] text-gray-400 mt-1">Butuh bantuan kerja tugas</p>
              </button>
              <button
                type="button"
                onClick={() => setRole('penyedia')}
                className={`p-3 border rounded-xl text-center cursor-pointer transition-all ${role === 'penyedia' ? 'border-[#0F7B4E] bg-emerald-50/50' : 'border-gray-200 hover:bg-gray-50'}`}
              >
                <p className="font-bold text-xs text-gray-900 leading-none">Penyedia (Helper)</p>
                <p className="text-[9px] text-gray-400 mt-1">Punya keahlian untuk monetasi</p>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold tracking-wider uppercase text-gray-500 block font-mono">Nama Lengkap</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input 
                  type="text"
                  required
                  placeholder="Contoh: Doni Gunawan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs pl-10 pr-4 py-2.5 border border-gray-200 focus:border-[#0F7B4E] rounded-xl outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-extrabold tracking-wider uppercase text-gray-500 block font-mono">Email Aktif</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input 
                  type="email"
                  required
                  placeholder="email@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs pl-10 pr-4 py-2.5 border border-gray-200 focus:border-[#0F7B4E] rounded-xl outline-none"
                />
              </div>
            </div>

            {/* Whatsapp */}
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold tracking-wider uppercase text-gray-500 block font-mono">Nomor WhatsApp Aktif</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input 
                  type="text"
                  required
                  placeholder="Contoh: 6281234567890 (Gunakan kode 62)"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full text-xs pl-10 pr-4 py-2.5 border border-gray-200 focus:border-[#0F7B4E] rounded-xl outline-none"
                />
              </div>
              <p className="text-[9px] text-gray-400">Nomor ini akan dipakai untuk tombol direct chat WhatsApp</p>
            </div>

            {role === 'penyedia' && (
              <>
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold tracking-wider uppercase text-gray-500 block font-mono">Keahlian Utama</label>
                  <select 
                    value={keahlian}
                    onChange={(e) => setKeahlian(e.target.value)}
                    className="w-full text-xs p-2.5 border border-gray-200 rounded-xl outline-none bg-white cursor-pointer focus:border-[#0F7B4E]"
                  >
                    <option value="Programming & Tech">Programming & Tech</option>
                    <option value="Desain Grafis">Desain Grafis</option>
                    <option value="Penulisan Makalah">Penulisan Makalah</option>
                    <option value="Pembuatan PPT">Pembuatan PPT</option>
                    <option value="Editing Video">Editing Video</option>
                    <option value="Penerjemah">Penerjemah</option>
                  </select>
                </div>

                <div className="space-y-3 bg-emerald-50/40 border border-emerald-100 p-3 rounded-xl mt-1.5 duration-200">
                  <p className="text-[10px] font-extrabold tracking-wider uppercase text-emerald-800 block font-mono">🔍 Portofolio / Sertifikat (Opsional)</p>
                  <div className="space-y-2">
                    <input 
                      type="text"
                      placeholder="Nama Sertifikat (contoh: Junior Web Developer)"
                      value={regCertTitle}
                      onChange={(e) => setRegCertTitle(e.target.value)}
                      className="w-full text-[11px] p-2 border border-gray-200 focus:border-[#0F7B4E] rounded-lg bg-white outline-none"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input 
                        type="text"
                        placeholder="Lembaga Penerbit"
                        value={regCertIssuer}
                        onChange={(e) => setRegCertIssuer(e.target.value)}
                        className="text-[11px] p-2 border border-gray-200 focus:border-[#0F7B4E] rounded-lg bg-white outline-none"
                      />
                      <input 
                        type="text"
                        placeholder="Tahun Perolehan"
                        value={regCertYear}
                        onChange={(e) => setRegCertYear(e.target.value)}
                        className="text-[11px] p-2 border border-gray-200 focus:border-[#0F7B4E] rounded-lg bg-white outline-none"
                      />
                    </div>
                    <textarea 
                      placeholder="Deskripsi singkat pencapaian ini..."
                      value={regCertDesc}
                      onChange={(e) => setRegCertDesc(e.target.value)}
                      rows={2}
                      className="w-full text-[11px] p-2 border border-gray-200 focus:border-[#0F7B4E] rounded-lg bg-white outline-none resize-none"
                    />
                    
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-gray-500 block">Lampiran Gambar Sertifikat</span>
                      <input 
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const r = new FileReader();
                            r.onloadend = () => {
                              setRegCertFileUrl(r.result as string);
                            };
                            r.readAsDataURL(file);
                          }
                        }}
                        className="w-full text-[10px] text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[10px] file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                      />
                      {regCertFileUrl && (
                        <div className="relative mt-1 border border-gray-100 rounded bg-white p-1 inline-block">
                          <img src={regCertFileUrl} className="h-16 w-auto object-contain" alt="Preview Sertifikat" />
                          <button
                            type="button"
                            onClick={() => setRegCertFileUrl('')}
                            className="absolute -top-1.5 -right-1.5 h-4 w-4 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold shadow hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-[9px] text-gray-400">Menyertakan sertifikat meningkatkan tingkat kepercayaan pencari jasa hingga 85%.</p>
                </div>
              </>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-extrabold tracking-wider uppercase text-gray-500 block font-mono">Password Baru</label>
              <div className="relative">
                <Key className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input 
                  type="password"
                  required
                  placeholder="Password aman"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs pl-10 pr-4 py-2.5 border border-gray-200 focus:border-[#0F7B4E] rounded-xl outline-none"
                />
              </div>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-3 bg-[#0F7B4E] hover:bg-[#0B5E3C] text-white text-xs font-bold font-display uppercase tracking-wider rounded-xl cursor-pointer transition-colors"
          >
            Daftar Sebagai {role === 'pencari' ? 'Pencari' : 'Helper'}
          </button>
        </form>
      )}

      {/* Trust Seal */}
      <div className="border-t border-gray-100 pt-3 text-center flex items-center justify-center gap-1.5 text-gray-400">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span className="text-[10px] font-bold uppercase tracking-wider font-mono">KampusFix Escrow Encrypted Protection</span>
      </div>
    </div>
  );
}


/* ============================================================================
   2. PROFILE PAGE VIEW (EDIT & STATISTICS)
   ============================================================================ */
interface ProfilePageProps {
  onNavigate: (view: string, params?: any) => void;
  activeUser: User | null;
  onProfileUpdate: (updated: User) => void;
  refreshTrigger: number;
}

export function ProfilePage({ onNavigate, activeUser, onProfileUpdate, refreshTrigger }: ProfilePageProps) {
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [bio, setBio] = useState('');
  const [keahlian, setKeahlian] = useState('');
  const [rekeningBank, setRekeningBank] = useState('');
  const [rekeningNama, setRekeningNama] = useState('');
  const [avatar, setAvatar] = useState('');
  const [success, setSuccess] = useState(false);

  // Portfolio list and temporary addition states
  const [portofolio, setPortofolio] = useState<any[]>([]);
  const [newCertTitle, setNewCertTitle] = useState('');
  const [newCertIssuer, setNewCertIssuer] = useState('');
  const [newCertYear, setNewCertYear] = useState('');
  const [newCertDesc, setNewCertDesc] = useState('');
  const [newCertFileUrl, setNewCertFileUrl] = useState('');
  const [portfolioError, setPortfolioError] = useState('');

  useEffect(() => {
    if (activeUser) {
      setName(activeUser.name);
      setWhatsapp(activeUser.whatsapp);
      setBio(activeUser.bio);
      setKeahlian(activeUser.keahlian || 'Programming');
      setRekeningBank(activeUser.rekeningBank || 'Bank Mandiri');
      setRekeningNama(activeUser.rekeningNama || activeUser.name);
      setAvatar(activeUser.avatar);
      setPortofolio(activeUser.portofolio || []);
    }
  }, [activeUser, refreshTrigger]);

  if (!activeUser) {
    return (
      <div className="max-w-md mx-auto text-center py-20">
        <p className="font-bold">Silakan login untuk mengakses halaman profil.</p>
        <button onClick={() => onNavigate('login')} className="mt-4 px-4 py-2 bg-[#0F7B4E] hover:bg-[#0B5E3C] text-white rounded-lg text-xs font-semibold cursor-pointer">
          Login Sekarang
        </button>
      </div>
    );
  }

  const handleAddPortfolioItem = () => {
    setPortfolioError('');
    if (!newCertTitle.trim()) {
      setPortfolioError('Nama sertifikat tidak boleh kosong.');
      return;
    }
    const newItem = {
      id: `cert_${Date.now()}`,
      title: newCertTitle.trim(),
      issuer: newCertIssuer.trim() || 'Lembaga Mandiri',
      year: newCertYear.trim() || new Date().getFullYear().toString(),
      description: newCertDesc.trim(),
      fileUrl: newCertFileUrl || undefined
    };
    setPortofolio(prev => [...prev, newItem]);
    // reset inputs
    setNewCertTitle('');
    setNewCertIssuer('');
    setNewCertYear('');
    setNewCertDesc('');
    setNewCertFileUrl('');
  };

  const handleRemovePortfolioItem = (id: string) => {
    setPortofolio(prev => prev.filter(item => item.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updated: User = {
      ...activeUser,
      name,
      whatsapp: whatsapp.startsWith('0') ? '62' + whatsapp.substring(1) : whatsapp,
      bio,
      keahlian: activeUser.role === 'penyedia' ? keahlian : undefined,
      rekeningBank: activeUser.role === 'penyedia' ? rekeningBank : undefined,
      rekeningNama: activeUser.role === 'penyedia' ? rekeningNama : undefined,
      avatar,
      portofolio: activeUser.role === 'penyedia' ? portofolio : undefined
    };

    // save to DB
    const users = KampusFixDB.getUsers();
    const idx = users.findIndex(u => u.id === activeUser.id);
    if (idx !== -1) {
      users[idx] = updated;
      KampusFixDB.saveUsers(users);
      KampusFixDB.setActiveUser(updated);
       KampusFixDB.syncSingleItem('users', updated);
      onProfileUpdate(updated);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in duration-200">
      
      {/* Header Profile Title */}
      <div>
        <h1 className="text-2xl font-display font-extrabold text-gray-950">Atur Profil Saya</h1>
        <p className="text-gray-400 text-xs">Kelola data profil kampus dan nomor WhatsApp pencairan escrow</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column: Avatar collection selector */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6 h-fit text-center">
          <div className="space-y-3">
            <img 
              src={avatar} 
              alt={name} 
              referrerPolicy="no-referrer"
              className="w-24 h-24 rounded-full object-cover border-4 border-emerald-500/20 mx-auto"
            />
            <div>
              <h3 className="font-bold text-sm text-gray-900">{name}</h3>
              <p className="text-xs text-gray-400 font-mono italic">{activeUser.email}</p>
            </div>
          </div>

          <div className="space-y-2 border-t border-gray-50 pt-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 font-mono">Pilih Avatar Default</p>
            <div className="flex justify-center gap-2">
              {MOCK_AVATARS.map((av, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setAvatar(av)}
                  className={`relative p-0.5 rounded-full border-2 cursor-pointer transition-all ${avatar === av ? 'border-[#0F7B4E]' : 'border-transparent hover:border-gray-200'}`}
                >
                  <img src={av} alt="avatar option" className="w-9 h-9 rounded-full object-cover" referrerPolicy="no-referrer" />
                  {avatar === av && <span className="absolute bottom-0 right-0 h-3.5 w-3.5 bg-[#0F7B4E] text-white rounded-full text-[8px] flex items-center justify-center font-bold">✓</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 border-t border-gray-50 pt-4 text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 font-mono">Atau Unggah Foto Sendiri</p>
            <div className="flex flex-col items-center gap-2">
              <input 
                type="file"
                accept="image/*"
                id="profile-avatar-upload"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const r = new FileReader();
                    r.onloadend = () => {
                      setAvatar(r.result as string);
                    };
                    r.readAsDataURL(file);
                  }
                }}
              />
              <label 
                htmlFor="profile-avatar-upload"
                className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-bold rounded-xl cursor-pointer inline-flex items-center gap-1.5 transition-colors font-mono uppercase"
              >
                📁 Pilih Berkas Foto
              </label>
            </div>
          </div>
        </div>

        {/* Right column: Form */}
        <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm">
          {success && (
            <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-semibold">
              ✓ Data profil KampusFix Anda berhasil disimpan.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">Nama Lengkap Mahasiswa</label>
                <input 
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs p-2.5 border border-gray-200 focus:border-[#0F7B4E] rounded-xl outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">Nomor WhatsApp Aktif</label>
                <input 
                  type="text"
                  required
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="628123xxxxxx"
                  className="w-full text-xs p-2.5 border border-gray-200 focus:border-[#0F7B4E] rounded-xl outline-none"
                />
                <p className="text-[10px] text-gray-400 leading-none">Pencari/penyedia akan terhubung otomatis lewat no ini.</p>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 block">Bio Deskripsi Profil</label>
              <textarea 
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Deskripsikan diri atau status akademik Anda..."
                className="w-full text-xs p-2.5 border border-gray-200 focus:border-[#0F7B4E] rounded-xl outline-none"
              />
            </div>

            {activeUser.role === 'penyedia' && (
              <div className="space-y-5 border-t border-gray-50 pt-4">
                <h3 className="font-bold text-xs text-[#0F7B4E] uppercase tracking-wider font-mono">Kelola Akun Penerimaan Pembayaran</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-800">Nama Keahlian Utama</label>
                    <select
                      value={keahlian}
                      onChange={(e) => setKeahlian(e.target.value)}
                      className="w-full text-xs p-2.5 border border-gray-200 rounded-xl bg-white outline-none focus:border-[#0F7B4E]"
                    >
                      <option value="Programming">Programming & Tech</option>
                      <option value="Desain Grafis">Desain Grafis</option>
                      <option value="Penulisan Makalah">Penulisan Makalah</option>
                      <option value="Pembuatan PPT">Pembuatan PPT</option>
                      <option value="Editing Video">Editing Video</option>
                      <option value="Penerjemah">Penerjemah</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 border border-slate-100 p-4 rounded-xl">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 block">Nama Bank Penerima</label>
                    <input 
                      type="text"
                      value={rekeningBank}
                      onChange={(e) => setRekeningBank(e.target.value)}
                      placeholder="Contoh: Bank BCA / Mandiri / GoPay"
                      className="w-full text-xs p-2.5 border border-gray-200 focus:border-[#0F7B4E] rounded-xl bg-white outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 block">Atas Nama Rekening</label>
                    <input 
                      type="text"
                      value={rekeningNama}
                      onChange={(e) => setRekeningNama(e.target.value)}
                      className="w-full text-xs p-2.5 border border-gray-200 focus:border-[#0F7B4E] rounded-xl bg-white outline-none"
                    />
                  </div>
                  <p className="col-span-2 text-[10px] text-gray-400">Untuk mencairkan dana escrow setelah pesanan dinyatakan rampung oleh pembeli.</p>
                </div>

                {/* Section Portofolio & Sertifikat */}
                <div className="space-y-4 border-t border-gray-100 pt-6">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-xs text-[#0F7B4E] uppercase tracking-wider font-mono">Portofolio & Sertifikat Keahlian ({portofolio.length})</h3>
                  </div>

                  {portofolio.length === 0 ? (
                    <div className="text-center p-6 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50">
                      <p className="text-xs text-gray-400">Belum ada portofolio atau sertifikat terdaftar.</p>
                      <p className="text-[10px] text-gray-400 italic">Tambahkan sertifikat/prestasi di bawah untuk meyakinkan pencari jasa.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3">
                      {portofolio.map((item) => (
                        <div key={item.id} className="p-3 border border-gray-100 rounded-xl bg-gray-50/50 flex gap-3 items-start justify-between flex-wrap sm:flex-nowrap">
                          <div className="flex gap-3 items-start">
                            <div className="p-1 px-2 bg-emerald-50 text-emerald-800 text-[9px] font-bold rounded-md font-mono flex-shrink-0 mt-0.5">
                              Sertifikat
                            </div>
                            <div className="space-y-0.5">
                              <h4 className="text-xs font-bold text-gray-900">{item.title}</h4>
                              <p className="text-[10px] text-gray-500 font-medium">{item.issuer} • Lulus {item.year}</p>
                              {item.description && <p className="text-[10px] text-gray-400 leading-tight">{item.description}</p>}
                              {item.fileUrl && (
                                <div className="mt-2">
                                  <a href={item.fileUrl} target="_blank" rel="noreferrer" className="text-[10px] text-[#0F7B4E] hover:underline font-bold inline-flex items-center gap-1">
                                    Lihat Lampiran Gambar ↗
                                  </a>
                                  <div className="mt-1 border border-gray-100 rounded bg-white p-1 inline-block max-w-xs">
                                    <img src={item.fileUrl} className="h-20 w-auto object-contain rounded" alt="Sertifikat" />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemovePortfolioItem(item.id)}
                            className="text-[10px] text-red-600 hover:text-red-800 font-bold px-2 py-1 hover:bg-red-50 rounded"
                          >
                            Hapus
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Form Adding New Portfolio */}
                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl space-y-3">
                    <h4 className="text-xs font-bold text-gray-800">Tambah Sertifikat / Portofolio Baru</h4>
                    {portfolioError && <p className="text-[10px] font-bold text-red-600">{portfolioError}</p>}
                    <div className="space-y-3">
                      <input 
                        type="text"
                        placeholder="Nama Sertifikat (contoh: Sertifikasi TOEFL / Ahli React)"
                        value={newCertTitle}
                        onChange={(e) => setNewCertTitle(e.target.value)}
                        className="w-full text-xs p-2.5 border border-gray-200 rounded-lg outline-none bg-white focus:border-[#0F7B4E]"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input 
                          type="text"
                          placeholder="Penerbit (e.g. TOEFL ITP, Dicoding)"
                          value={newCertIssuer}
                          onChange={(e) => setNewCertIssuer(e.target.value)}
                          className="text-xs p-2.5 border border-gray-200 rounded-lg outline-none bg-white focus:border-[#0F7B4E]"
                        />
                        <input 
                          type="text"
                          placeholder="Tahun Perolehan"
                          value={newCertYear}
                          onChange={(e) => setNewCertYear(e.target.value)}
                          className="text-xs p-2.5 border border-gray-200 rounded-lg outline-none bg-white focus:border-[#0F7B4E]"
                        />
                      </div>
                      <textarea 
                        placeholder="Deskripsi singkat mengenai apa yang Anda kerjakan atau keahlian yang divalidasi..."
                        value={newCertDesc}
                        onChange={(e) => setNewCertDesc(e.target.value)}
                        rows={2}
                        className="w-full text-xs p-2.5 border border-gray-200 rounded-lg outline-none bg-white resize-none focus:border-[#0F7B4E]"
                      />

                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-gray-500 block">Lampiran Foto Sertifikat (Opsional)</span>
                        <input 
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const r = new FileReader();
                              r.onloadend = () => {
                                setNewCertFileUrl(r.result as string);
                              };
                              r.readAsDataURL(file);
                            }
                          }}
                          className="w-full text-[10px] text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[10px] file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                        />
                        {newCertFileUrl && (
                          <div className="relative mt-1 border border-gray-200 rounded bg-white p-1 inline-block">
                            <img src={newCertFileUrl} className="h-16 w-auto object-contain" alt="Preview Sertifikat" />
                            <button
                              type="button"
                              onClick={() => setNewCertFileUrl('')}
                              className="absolute -top-1.5 -right-1.5 h-4 w-4 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold shadow hover:bg-red-600"
                            >
                              ×
                            </button>
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={handleAddPortfolioItem}
                        className="px-3 py-1.5 bg-emerald-100 text-emerald-800 hover:bg-[#0F7B4E] hover:text-white text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        + Tambahkan ke Daftar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <button 
              type="submit"
              className="px-6 py-2.5 bg-[#0F7B4E] hover:bg-[#0B5E3C] text-white text-xs font-bold tracking-wide uppercase font-mono rounded-xl cursor-pointer transition-colors"
            >
              Simpan Perubahan
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
