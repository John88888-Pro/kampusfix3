/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  DollarSign, 
  Wallet, 
  ShieldCheck, 
  Activity, 
  Search, 
  Trash2, 
  Edit, 
  Check, 
  X, 
  Settings, 
  FileText, 
  ArrowUpRight, 
  BarChart2, 
  PieChart, 
  Landmark, 
  Star, 
  LogIn, 
  Filter,
  CheckCircle,
  XCircle,
  HelpCircle,
  AlertTriangle,
  RefreshCw,
  Download
} from 'lucide-react';
import { User, Jasa, Pesanan, Pendapatan, PenarikanDana, UserRole, StatusPesanan } from '../types';
import { KampusFixDB } from '../data/db';
import { formatRupiah } from './ServiceViews';

interface AdminDashboardProps {
  onNavigate: (view: string, params?: any) => void;
  activeUser: User | null;
  refreshTrigger: number;
  onStateUpdate: () => void;
}

type AdminTab = 'ringkasan' | 'pengguna' | 'transaksi' | 'penarikan' | 'komisi';

export function AdminDashboard({ onNavigate, activeUser, refreshTrigger, onStateUpdate }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('ringkasan');
  const [users, setUsers] = useState<User[]>([]);
  const [jasas, setJasas] = useState<Jasa[]>([]);
  const [pesanans, setPesanans] = useState<Pesanan[]>([]);
  const [revenues, setRevenues] = useState<Pendapatan[]>([]);
  const [withdrawals, setWithdrawals] = useState<PenarikanDana[]>([]);
  
  // Search & Filter state
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<string>('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [withdrawalFilter, setWithdrawalFilter] = useState<string>('all');

  // Modals state
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editUserName, setEditUserName] = useState('');
  const [editUserWhatsapp, setEditUserWhatsapp] = useState('');
  const [editUserEmail, setEditUserEmail] = useState('');
  const [editUserRole, setEditUserRole] = useState<UserRole>('pencari');
  
  const [approvingWd, setApprovingWd] = useState<PenarikanDana | null>(null);
  const [rejectingWd, setRejectingWd] = useState<PenarikanDana | null>(null);
  const [actionNote, setActionNote] = useState('');

  // Commissions State (stored in localStorage)
  const [commissionRate, setCommissionRate] = useState<number>(() => {
    return Number(localStorage.getItem('admin_commission_rate') || '5'); // Default 5%
  });
  const [commissionSuccess, setCommissionSuccess] = useState(false);

  // Load All DB data
  useEffect(() => {
    setUsers(KampusFixDB.getUsers());
    setJasas(KampusFixDB.getJasa());
    setPesanans(KampusFixDB.getPesanan());
    setRevenues(KampusFixDB.getPendapatan());
    setWithdrawals(KampusFixDB.getPenarikanDana());
  }, [refreshTrigger]);

  if (!activeUser || activeUser.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto my-20 p-6 bg-red-50 border border-red-200 text-red-800 rounded-2xl shadow-sm text-center">
        <ShieldCheck className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h2 className="font-bold text-lg">Akses Ditolak</h2>
        <p className="text-xs text-red-600 mt-1">Halaman ini hanya dapat diakses oleh Akun Administrator platform KampusFix.</p>
        <button onClick={() => onNavigate('home')} className="mt-4 px-4 py-2 bg-[#0F7B4E] hover:bg-[#0B5E3C] text-white rounded-xl text-xs font-bold transition-colors">
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  // Impersonate / Login as user directly
  const handleSimulateLogin = (targetUser: User) => {
    if (confirm(`Apakah Anda yakin ingin masuk mensimulasikan sesi sebagai ${targetUser.name} (${targetUser.role})? Anda akan otomatis diarahkan ke dashboard miliknya.`)) {
      KampusFixDB.setActiveUser(targetUser);
      onStateUpdate();
      onNavigate(targetUser.role === 'admin' ? 'dashboard-admin' : targetUser.role === 'pencari' ? 'dashboard-pencari' : 'dashboard-penyedia');
    }
  };

  // Save Configured Commission
  const handleSaveCommission = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('admin_commission_rate', String(commissionRate));
    setCommissionSuccess(true);
    setTimeout(() => setCommissionSuccess(false), 3000);
  };

  // Delete User handler
  const handleDeleteUser = (id: string) => {
    if (id === activeUser.id) {
      alert('Anda tidak bisa menghapus akun admin aktif Anda sendiri.');
      return;
    }
    if (confirm('PERINGATAN: Menghapus pengguna ini akan menghapus semua data profil mereka secara permanen dari sistem. Lanjutkan?')) {
      const all = KampusFixDB.getUsers();
      const filtered = all.filter(u => u.id !== id);
      KampusFixDB.saveUsers(filtered);
      
      // Also write single item deletion if supported
      KampusFixDB.syncArrayToFirestore('users', filtered);
      
      setUsers(filtered);
      onStateUpdate();
    }
  };

  // Edit User submit
  const handleEditUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    const all = KampusFixDB.getUsers();
    const updated = all.map(u => {
      if (u.id === editingUser.id) {
        return {
          ...u,
          name: editUserName,
          whatsapp: editUserWhatsapp.startsWith('0') ? '62' : editUserWhatsapp,
          email: editUserEmail,
          role: editUserRole
        };
      }
      return u;
    });

    KampusFixDB.saveUsers(updated);
    
    // sync to firestore
    const updatedSingle = updated.find(u => u.id === editingUser.id);
    if (updatedSingle) {
      KampusFixDB.syncSingleItem('users', updatedSingle);
    }

    setUsers(updated);
    setEditingUser(null);
    onStateUpdate();
  };

  // Open edit modal
  const startEditUser = (user: User) => {
    setEditingUser(user);
    setEditUserName(user.name);
    setEditUserWhatsapp(user.whatsapp);
    setEditUserEmail(user.email);
    setEditUserRole(user.role);
  };

  // Approve Withdrawal request
  const handleApproveWithdrawal = () => {
    if (!approvingWd) return;

    const wds = KampusFixDB.getPenarikanDana();
    const updatedWds = wds.map(w => {
      if (w.id === approvingWd.id) {
        return {
          ...w,
          status: 'disetujui' as const,
          catatanAdmin: actionNote || 'Permintaan penarikan dana disetujui & ditransfer sukses.'
        };
      }
      return w;
    });

    // Save withdrawals
    KampusFixDB.savePenarikanDana(updatedWds);

    // Update corresponding helper Pendapatan items to statusCair = true
    const pds = KampusFixDB.getPendapatan();
    const updatedPds = pds.map(p => {
      if (p.penyediaId === approvingWd.penyediaId && !p.statusCair) {
        return {
          ...p,
          statusCair: true,
          withdrawDate: new Date().toISOString(),
          withdrawNote: `Pencairan via ${approvingWd.rekeningBank} No. ${approvingWd.rekeningNomor}`
        };
      }
      return p;
    });

    KampusFixDB.savePendapatan(updatedPds);

    // Sync all
    const changedWd = updatedWds.find(w => w.id === approvingWd.id);
    if (changedWd) KampusFixDB.syncSingleItem('penarikan_dana', changedWd);
    updatedPds.forEach(item => {
      if (item.penyediaId === approvingWd.penyediaId && item.statusCair) {
        KampusFixDB.syncSingleItem('pendapatan', item);
      }
    });

    // Create system notification for helper
    KampusFixDB.addNotification(
      approvingWd.penyediaId,
      '💸 Penarikan Dana Disetujui!',
      `Pengajuan penarikan dana sebesar ${formatRupiah(approvingWd.amount)} telah disetujui oleh admin dan ditransfer ke rekening Anda.`,
      'sistem'
    );

    setWithdrawals(updatedWds);
    setRevenues(updatedPds);
    setApprovingWd(null);
    setActionNote('');
    onStateUpdate();
  };

  // Reject Withdrawal request
  const handleRejectWithdrawal = () => {
    if (!rejectingWd) return;

    const wds = KampusFixDB.getPenarikanDana();
    const updatedWds = wds.map(w => {
      if (w.id === rejectingWd.id) {
        return {
          ...w,
          status: 'ditolak' as const,
          catatanAdmin: actionNote || 'Ditolak: Informasi rekening tidak valid atau kendala transfer.'
        };
      }
      return w;
    });

    KampusFixDB.savePenarikanDana(updatedWds);

    const changedWd = updatedWds.find(w => w.id === rejectingWd.id);
    if (changedWd) KampusFixDB.syncSingleItem('penarikan_dana', changedWd);

    // Create system notification for helper
    KampusFixDB.addNotification(
      rejectingWd.penyediaId,
      '⚠️ Penarikan Dana Ditolak',
      `Pengajuan penarikan dana sebesar ${formatRupiah(rejectingWd.amount)} ditolak oleh admin. Alasan: ${actionNote || 'Informasi rekening tidak valid.'}`,
      'sistem'
    );

    setWithdrawals(updatedWds);
    setRejectingWd(null);
    setActionNote('');
    onStateUpdate();
  };

  // Force Update Order Status (Platform Escrow Override)
  const handleForceOrderStatus = (orderId: string, newStatus: StatusPesanan) => {
    if (confirm(`Apakah Anda yakin ingin mematangkan/memaksa status pesanan ini menjadi "${newStatus.replace(/_/g, ' ').toUpperCase()}"? Sesi escrow akan disinkronisasikan.`)) {
      const orders = KampusFixDB.getPesanan();
      const updated = orders.map(ord => {
        if (ord.id === orderId) {
          const changed = {
            ...ord,
            status: newStatus,
            historis: [
              ...ord.historis,
              {
                status: newStatus,
                date: new Date().toISOString(),
                note: `Status dipaksa/diubah secara manual oleh Administrator Platform.`
              }
            ]
          };
          return changed;
        }
        return ord;
      });

      KampusFixDB.savePesanan(updated);
      const target = updated.find(o => o.id === orderId);
      if (target) {
        KampusFixDB.syncSingleItem('pesanan', target);
        
        // Notify both parties
        KampusFixDB.addNotification(
          target.pencariId,
          '⚙️ Status Pesanan Diubah Admin',
          `Pesanan "${target.tugasTitle}" statusnya telah diubah admin menjadi: ${newStatus.toUpperCase()}`,
          'pesanan',
          target.id
        );
        KampusFixDB.addNotification(
          target.penyediaId,
          '⚙️ Status Pesanan Diubah Admin',
          `Pesanan "${target.tugasTitle}" statusnya telah diubah admin menjadi: ${newStatus.toUpperCase()}`,
          'pesanan',
          target.id
        );
      }

      setPesanans(updated);
      onStateUpdate();
    }
  };

  // OVERVIEW METRIC CALCULATIONS
  const completedOrders = pesanans.filter(p => p.status === 'selesai' || p.status === 'rated');
  const paidOrders = pesanans.filter(p => p.status !== 'menunggu_konfirmasi' && p.status !== 'menunggu_pembayaran' && p.status !== 'ditolak');

  // Total Gross Transaction Volume
  const totalGTV = completedOrders.reduce((sum, p) => sum + p.totalBayar, 0);
  
  // Platform Commission income
  const totalPlatformFees = paidOrders.reduce((sum, p) => sum + (p.biayaPlatform || 0), 0);
  
  // Total Helper payouts approved
  const totalPayoutsPaid = withdrawals.filter(w => w.status === 'disetujui').reduce((sum, w) => sum + w.amount, 0);
  
  // Total Unpaid Helper balance waiting in ecosystem
  const totalUnpaidHelperBalance = revenues.filter(r => !r.statusCair).reduce((sum, r) => sum + r.amount, 0);

  // Filtered Lists
  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(userSearch.toLowerCase()) || 
                          u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
                          u.whatsapp.includes(userSearch);
    const matchesRole = userRoleFilter === 'all' ? true : u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  const filteredOrders = pesanans.filter(o => {
    const matchesSearch = o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
                          o.tugasTitle.toLowerCase().includes(orderSearch.toLowerCase()) ||
                          o.penyediaName.toLowerCase().includes(orderSearch.toLowerCase()) ||
                          o.pencariName.toLowerCase().includes(orderSearch.toLowerCase());
    const matchesStatus = orderStatusFilter === 'all' ? true : o.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredWithdrawals = withdrawals.filter(w => {
    return withdrawalFilter === 'all' ? true : w.status === withdrawalFilter;
  });

  // Simple Helper to draw progress bars or badges
  const getStatusLabelText = (status: StatusPesanan) => {
    switch (status) {
      case 'menunggu_konfirmasi': return 'Menunggu Konfirmasi Jasa';
      case 'menunggu_pembayaran': return 'Menunggu Pembayaran';
      case 'dibayar': return 'Sudah Bayar (Escrow)';
      case 'sedang_dikerjakan': return 'Sedang Dikerjakan';
      case 'selesai_menunggu_konfirmasi': return 'Selesai (Menunggu Review)';
      case 'selesai': return 'Selesai';
      case 'rated': return 'Sudah Diulas';
      case 'ditolak': return 'Ditolak';
      default: return status;
    }
  };

  const getStatusColorClass = (status: StatusPesanan) => {
    switch (status) {
      case 'menunggu_konfirmasi': return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      case 'menunggu_pembayaran': return 'bg-amber-50 text-amber-800 border-amber-200 animate-pulse';
      case 'dibayar': return 'bg-indigo-50 text-indigo-800 border-indigo-200';
      case 'sedang_dikerjakan': return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'selesai_menunggu_konfirmasi': return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'selesai': return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'rated': return 'bg-emerald-100 text-emerald-900 border-emerald-350';
      case 'ditolak': return 'bg-red-50 text-red-800 border-red-200';
      default: return 'bg-gray-50 text-gray-800 border-gray-200';
    }
  };

  const downloadCSV = () => {
    const headers = ['ID Pesanan', 'Tanggal Dibuat', 'Judul Tugas', 'Pemesan', 'Helper', 'Biaya Jasa', 'Fee Platform', 'Total Bayar', 'Status'];
    const csvRows = [];
    csvRows.push(headers.join(','));

    for (const o of filteredOrders) {
      const values = [
        o.id,
        new Date(o.createdAt).toISOString().split('T')[0],
        o.tugasTitle,
        o.pencariName,
        o.penyediaName,
        o.jasaPrice.toString(),
        (o.biayaPlatform || 0).toString(),
        o.totalBayar.toString(),
        getStatusLabelText(o.status)
      ];
      
      const escaped = values.map(val => {
        const formatted = val.replace(/"/g, '""');
        return `"${formatted}"`;
      });
      csvRows.push(escaped.join(','));
    }

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `laporan_transaksi_kampusfix_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadExcel = () => {
    const title = "LAPORAN TRANSAKSI ESCROW KAMPUSFIX";
    const dateStr = new Date().toLocaleString('id-ID');
    
    let html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8"/>
        <style>
          table { border-collapse: collapse; font-family: Arial, sans-serif; }
          th { background-color: #0F7B4E; color: white; font-weight: bold; text-align: left; border: 1px solid #ddd; padding: 8px; }
          td { border: 1px solid #ddd; padding: 8px; }
          .title { font-size: 16px; font-weight: bold; color: #0F7B4E; font-family: Arial, sans-serif; }
          .meta { font-size: 11px; color: #555; margin-bottom: 20px; font-family: Arial, sans-serif; }
          .number { text-align: right; }
          .status { font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="title">${title}</div>
        <div class="meta">Diekspor oleh Admin pada: ${dateStr} | Total Sesi: ${filteredOrders.length}</div>
        <br/>
        <table>
          <thead>
            <tr>
              <th>ID Pesanan</th>
              <th>Tanggal Dibuat</th>
              <th>Judul Tugas</th>
              <th>Pemesan (Pencari)</th>
              <th>Helper (Penyedia)</th>
              <th>Biaya Jasa (IDR)</th>
              <th>Fee Platform (IDR)</th>
              <th>Total Bayar (IDR)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
    `;

    filteredOrders.forEach(o => {
      html += `
        <tr>
          <td>#${o.id}</td>
          <td>${new Date(o.createdAt).toLocaleDateString('id-ID')}</td>
          <td>${o.tugasTitle}</td>
          <td>${o.pencariName}</td>
          <td>${o.penyediaName}</td>
          <td class="number">${o.jasaPrice}</td>
          <td class="number">${o.biayaPlatform || 0}</td>
          <td class="number">${o.totalBayar}</td>
          <td class="status">${getStatusLabelText(o.status)}</td>
        </tr>
      `;
    });

    html += `
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `laporan_transaksi_kampusfix_${new Date().toISOString().split('T')[0]}.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadWord = () => {
    const title = "LAPORAN RESMI TRANSAKSI KAMPUSFIX";
    const dateStr = new Date().toLocaleString('id-ID');

    let html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta http-equiv="content-type" content="text/html; charset=UTF-8"/>
        <style>
          body { font-family: 'Times New Roman', serif; margin: 1in; line-height: 1.5; }
          h1 { color: #0F7B4E; font-family: Arial, sans-serif; border-bottom: 2px solid #0F7B4E; padding-bottom: 5px; }
          .meta-table { width: 100%; margin-bottom: 20px; border: none; font-size: 11pt; }
          .data-table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 10pt; }
          .data-table th { background-color: #0F7B4E; color: white; font-weight: bold; border: 1px solid #333; padding: 6px; text-align: left; }
          .data-table td { border: 1px solid #333; padding: 6px; }
          .footer { text-align: center; font-size: 9pt; color: #777; margin-top: 50px; border-top: 1px solid #ccc; padding-top: 10px; }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <p>Laporan ini menyajikan rangkuman log finansial dan sesi mediasi escrow tugas mahasiswa di platform KampusFix.</p>
        
        <table class="meta-table">
          <tr>
            <td><strong>Tanggal Cetak:</strong></td>
            <td>${dateStr}</td>
          </tr>
          <tr>
            <td><strong>Operator Pencetak:</strong></td>
            <td>Administrator Platform (${activeUser.name})</td>
          </tr>
          <tr>
            <td><strong>Jumlah Transaksi Terfilter:</strong></td>
            <td>${filteredOrders.length} Sesi Escrow</td>
          </tr>
          <tr>
            <td><strong>Total Volume Transaksi (GTV):</strong></td>
            <td>${formatRupiah(filteredOrders.reduce((sum, o) => sum + (o.status === 'selesai' || o.status === 'rated' ? o.totalBayar : 0), 0))}</td>
          </tr>
        </table>

        <table class="data-table">
          <thead>
            <tr>
              <th>ID Pesanan</th>
              <th>Judul Tugas</th>
              <th>Pemesan</th>
              <th>Helper</th>
              <th>Biaya Jasa</th>
              <th>Total Bayar</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
    `;

    filteredOrders.forEach(o => {
      html += `
        <tr>
          <td>#${o.id}</td>
          <td><strong>${o.tugasTitle}</strong></td>
          <td>${o.pencariName}</td>
          <td>${o.penyediaName}</td>
          <td>${formatRupiah(o.jasaPrice)}</td>
          <td>${formatRupiah(o.totalBayar)}</td>
          <td>${getStatusLabelText(o.status)}</td>
        </tr>
      `;
    });

    html += `
          </tbody>
        </table>

        <div class="footer">
          Laporan Keuangan Otomatis KampusFix &copy; 2026. Seluruh hak cipta dilindungi.
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([html], { type: 'application/msword;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `laporan_transaksi_kampusfix_${new Date().toISOString().split('T')[0]}.doc`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-200">
      
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
          <span className="bg-[#0F7B4E]/10 text-[#0F7B4E] text-[10px] uppercase font-bold font-mono px-3 py-1 rounded-full border border-[#0F7B4E]/20">
            👑 Administrator Suite
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-gray-950 mt-1">Sistem Konsol Admin KampusFix</h1>
          <p className="text-xs text-gray-400">Kelola operasional platform escrow tugas mahasiswa, komisi, dan persetujuan penarikan dana.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => { onStateUpdate(); }}
            className="p-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-semibold cursor-pointer flex items-center gap-1.5 transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4 text-gray-400 animate-hover" /> Refresh
          </button>
          <button 
            onClick={() => onNavigate('home')}
            className="px-4 py-2.5 bg-[#0F7B4E] hover:bg-[#0B5E3C] text-white rounded-xl text-xs font-bold shadow-sm transition-colors cursor-pointer"
          >
            Kembali ke Portal Publik
          </button>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex overflow-x-auto gap-1 bg-white p-1 rounded-xl border border-gray-200 shadow-sm select-none">
        <button
          onClick={() => setActiveTab('ringkasan')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer whitespace-nowrap ${activeTab === 'ringkasan' ? 'bg-[#0F7B4E] text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-[#0F7B4E]'}`}
        >
          <BarChart2 className="w-4 h-4" /> Ringkasan Bisnis
        </button>
        <button
          onClick={() => setActiveTab('pengguna')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer whitespace-nowrap ${activeTab === 'pengguna' ? 'bg-[#0F7B4E] text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-[#0F7B4E]'}`}
        >
          <Users className="w-4 h-4" /> Kelola Pengguna
        </button>
        <button
          onClick={() => setActiveTab('transaksi')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer whitespace-nowrap ${activeTab === 'transaksi' ? 'bg-[#0F7B4E] text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-[#0F7B4E]'}`}
        >
          <FileText className="w-4 h-4" /> Sesi Transaksi Escrow
        </button>
        <button
          onClick={() => setActiveTab('penarikan')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer relative whitespace-nowrap ${activeTab === 'penarikan' ? 'bg-[#0F7B4E] text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-[#0F7B4E]'}`}
        >
          <Wallet className="w-4 h-4" /> Penarikan Dana (Withdrawals)
          {withdrawals.some(w => w.status === 'pending') && (
            <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-red-500 animate-ping" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('komisi')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer whitespace-nowrap ${activeTab === 'komisi' ? 'bg-[#0F7B4E] text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-[#0F7B4E]'}`}
        >
          <Settings className="w-4 h-4" /> Pengaturan Komisi
        </button>
      </div>

      {/* 1. RINGKASAN BUSINESS TAB */}
      {activeTab === 'ringkasan' && (
        <div className="space-y-8 animate-in fade-in duration-150">
          
          {/* Bento metrics panel */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3 relative overflow-hidden">
              <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-[0.06] text-gray-950">
                <BarChart2 className="w-32 h-32" />
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">Gross Transaction Volume</p>
              <p className="text-2xl font-extrabold text-gray-950 font-mono">{formatRupiah(totalGTV)}</p>
              <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                <span className="text-emerald-600 font-bold">✓ 100%</span> dari {completedOrders.length} pesanan tuntas.
              </div>
            </div>

            <div className="bg-emerald-950 text-emerald-100 p-5 rounded-2xl border border-emerald-900 shadow-md space-y-3 relative overflow-hidden">
              <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-[0.08] text-emerald-300">
                <DollarSign className="w-32 h-32" />
              </div>
              <p className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider font-mono">Pendapatan Platform (Fee)</p>
              <p className="text-2xl font-extrabold text-emerald-400 font-mono">{formatRupiah(totalPlatformFees)}</p>
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-200/80">
                <span className="text-emerald-300 font-bold">Sistem Escrow</span> tarif aktif: {commissionRate}% per transaksi.
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3 relative overflow-hidden">
              <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-[0.06] text-gray-950">
                <Wallet className="w-32 h-32" />
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">Total Dana Cair (Transfered)</p>
              <p className="text-2xl font-extrabold text-gray-800 font-mono">{formatRupiah(totalPayoutsPaid)}</p>
              <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                <span className="text-[#0F7B4E] font-bold">✓ Dana Bersih</span> berhasil dicairkan ke rekening helper.
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3 relative overflow-hidden">
              <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-[0.06] text-gray-950">
                <Landmark className="w-32 h-32" />
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">Dana Helper Tertahan (Ecosystem)</p>
              <p className="text-2xl font-extrabold text-amber-700 font-mono">{formatRupiah(totalUnpaidHelperBalance)}</p>
              <div className="flex items-center gap-1.5 text-[11px] text-amber-700">
                <span className="font-bold">⚠️ Saldo Helper</span> belum mengajukan pencairan.
              </div>
            </div>

          </div>

          {/* Business Statistics & Simple Analytics Drawing */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Visual Chart 1: SVG Revenue Trends */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm lg:col-span-2 space-y-4">
              <div>
                <h3 className="font-bold text-sm uppercase text-gray-900 font-mono">Grafik Tren Pendapatan Platform</h3>
                <p className="text-[11px] text-gray-400">Estimasi akumulasi komisi platform bulanan berjalan (Maret - Juni 2026)</p>
              </div>

              {/* Styled SVG Trend Line */}
              <div className="h-48 w-full border-b border-l border-gray-100 flex items-end relative pt-6 px-4">
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 150" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="0" y1="37" x2="400" y2="37" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3,3" />
                  <line x1="0" y1="75" x2="400" y2="75" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3,3" />
                  <line x1="0" y1="112" x2="400" y2="112" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3,3" />
                  
                  {/* Line Trend path */}
                  <path 
                    d="M 50 130 C 120 120, 180 80, 250 50 S 330 20, 350 15" 
                    fill="none" 
                    stroke="#0F7B4E" 
                    strokeWidth="3.5" 
                    strokeLinecap="round"
                  />
                  
                  {/* Fill Area gradient under line */}
                  <path 
                    d="M 50 130 C 120 120, 180 80, 250 50 S 330 20, 350 15 L 350 150 L 50 150 Z" 
                    fill="url(#gradient_rev)" 
                    opacity="0.1" 
                  />

                  {/* Dot Markers */}
                  <circle cx="50" cy="130" r="5" fill="#0F7B4E" stroke="#FFFFFF" strokeWidth="1.5" />
                  <circle cx="150" cy="100" r="5" fill="#0F7B4E" stroke="#FFFFFF" strokeWidth="1.5" />
                  <circle cx="250" cy="50" r="5" fill="#0F7B4E" stroke="#FFFFFF" strokeWidth="1.5" />
                  <circle cx="350" cy="15" r="5" fill="#0F7B4E" stroke="#FFFFFF" strokeWidth="1.5" />

                  {/* Gradient definitions */}
                  <defs>
                    <linearGradient id="gradient_rev" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#0F7B4E" />
                      <stop offset="100%" stopColor="#FFFFFF" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* X Axis Labels */}
                <div className="absolute inset-x-0 bottom-0 translate-y-6 flex justify-between px-6 text-[9px] font-bold font-mono text-gray-400">
                  <span>MARET (Rp 25K)</span>
                  <span>APRIL (Rp 75K)</span>
                  <span>MEI (Rp 180K)</span>
                  <span>JUNI (Rp {Math.round(totalPlatformFees / 1000)}K)</span>
                </div>
              </div>
              <div className="pt-2 text-right">
                <span className="text-[10px] text-gray-400 font-mono">Grafik interaktif real-time disimulasikan dari escrow selesai.</span>
              </div>
            </div>

            {/* Visual Chart 2: Category distribution bar chart */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <div>
                <h3 className="font-bold text-sm uppercase text-gray-900 font-mono">Distribusi Jasa Terlaris</h3>
                <p className="text-[11px] text-gray-400">Berdasarkan total pendaftaran kategori di sistem</p>
              </div>

              {/* Custom list representation with progress bars */}
              <div className="space-y-4 pt-2">
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold text-gray-700">
                    <span>Programming & Tech</span>
                    <span className="font-mono text-[#0F7B4E]">40%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#0F7B4E] rounded-full" style={{ width: '40%' }}></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold text-gray-700">
                    <span>Pembuatan PPT</span>
                    <span className="font-mono text-emerald-600">30%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '30%' }}></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold text-gray-700">
                    <span>Desain Grafis / Logo</span>
                    <span className="font-mono text-teal-600">20%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-400 rounded-full" style={{ width: '20%' }}></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold text-gray-700">
                    <span>Penerjemah & Lainnya</span>
                    <span className="font-mono text-amber-600">10%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: '10%' }}></div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Quick Platform Statistics counters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-slate-50 border border-gray-100 p-5 rounded-2xl flex items-center gap-4">
              <div className="p-3 bg-blue-100 text-blue-800 rounded-xl">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-mono font-bold text-gray-400 uppercase">Total Akun</p>
                <p className="text-lg font-bold text-gray-900 font-mono">{users.length} Akun Terdaftar</p>
              </div>
            </div>

            <div className="bg-slate-50 border border-gray-100 p-5 rounded-2xl flex items-center gap-4">
              <div className="p-3 bg-teal-100 text-teal-800 rounded-xl">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-mono font-bold text-gray-400 uppercase">Jasa Aktif</p>
                <p className="text-lg font-bold text-gray-900 font-mono">{jasas.length} Layanan Aktif</p>
              </div>
            </div>

            <div className="bg-slate-50 border border-gray-100 p-5 rounded-2xl flex items-center gap-4">
              <div className="p-3 bg-purple-100 text-purple-800 rounded-xl">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-mono font-bold text-gray-400 uppercase">Total Pesanan</p>
                <p className="text-lg font-bold text-gray-900 font-mono">{pesanans.length} Tiket Pesanan</p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* 2. KELOLA PENGGUNA TAB */}
      {activeTab === 'pengguna' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden text-xs animate-in fade-in duration-150">
          
          {/* Header toolbar */}
          <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
            <div>
              <h3 className="font-bold text-sm uppercase text-gray-900 font-mono">Kelola Pengguna Sistem</h3>
              <p className="text-[11px] text-gray-500">Total {filteredUsers.length} pengguna terfilter. Admin dapat mengedit, menghapus, atau mensimulasikan login pengguna.</p>
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto">
              {/* Search */}
              <div className="relative flex-1 sm:flex-initial">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari nama, email, whatsapp..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 bg-white border border-gray-200 rounded-xl focus:border-[#0F7B4E] outline-none text-xs"
                />
              </div>

              {/* Role filter */}
              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="p-1.5 bg-white border border-gray-200 rounded-xl focus:border-[#0F7B4E] outline-none text-xs font-semibold"
              >
                <option value="all">Semua Peran</option>
                <option value="admin">🛡️ Admin</option>
                <option value="pencari">👤 Pencari Jasa</option>
                <option value="penyedia">👨🎓 Penyedia Jasa</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            {filteredUsers.length === 0 ? (
              <div className="p-12 text-center text-gray-400 font-medium">
                Tidak ada pengguna yang cocok dengan filter pencarian Anda.
              </div>
            ) : (
              <table className="w-full text-left font-sans text-xs">
                <thead className="bg-slate-50 font-bold uppercase text-[10px] text-gray-500 border-b">
                  <tr>
                    <th className="px-6 py-3">Nama Lengkap</th>
                    <th className="px-6 py-3">Kontak Email</th>
                    <th className="px-6 py-3">No. Whatsapp</th>
                    <th className="px-6 py-3">Peran Akun</th>
                    <th className="px-6 py-3">Tanggal Terdaftar</th>
                    <th className="px-6 py-3 text-right">Tindakan Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/40">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <img 
                            src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                            alt={u.name}
                            referrerPolicy="no-referrer"
                            className="w-8 h-8 rounded-full object-cover border border-[#0F7B4E]/10"
                          />
                          <div>
                            <span className="font-bold text-gray-900 block">{u.name}</span>
                            <span className="text-[9px] font-mono text-gray-400 block">{u.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-gray-600">
                        {u.email}
                      </td>
                      <td className="px-6 py-4 font-mono text-gray-600">
                        +{u.whatsapp}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] uppercase ${
                          u.role === 'admin' 
                            ? 'bg-red-100 text-red-800' 
                            : u.role === 'pencari' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {u.role === 'admin' ? '🛡️ Admin' : u.role === 'pencari' ? '👤 Pencari' : '👨🎓 Helper'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400 font-mono">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString('id-ID') : '-'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex gap-1.5 justify-end">
                          <button 
                            onClick={() => handleSimulateLogin(u)}
                            className="p-1 px-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                            title="Simulasikan masuk sebagai pengguna ini"
                          >
                            <LogIn className="w-3 h-3" /> Simulasikan Sesi
                          </button>
                          <button 
                            onClick={() => startEditUser(u)}
                            className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-[#0F7B4E] rounded-lg transition-colors cursor-pointer"
                            title="Ubah info akun"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(u.id)}
                            className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors cursor-pointer"
                            title="Hapus Pengguna Permanen"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Edit User Modal Overlay */}
          {editingUser && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <form onSubmit={handleEditUserSubmit} className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-150">
                <div className="px-6 py-4 bg-[#0F7B4E] text-white flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-sm uppercase font-mono">Ubah Informasi Pengguna</h3>
                    <p className="text-[10px] text-emerald-100 mt-0.5">UID: {editingUser.id}</p>
                  </div>
                  <button type="button" onClick={() => setEditingUser(null)} className="text-white hover:text-emerald-150 cursor-pointer">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-gray-400 font-mono">Nama Lengkap:</label>
                    <input
                      type="text"
                      required
                      value={editUserName}
                      onChange={(e) => setEditUserName(e.target.value)}
                      className="w-full p-2.5 border border-gray-200 rounded-xl focus:border-[#0F7B4E] outline-none text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-gray-400 font-mono">Kontak Email:</label>
                    <input
                      type="email"
                      required
                      value={editUserEmail}
                      onChange={(e) => setEditUserEmail(e.target.value)}
                      className="w-full p-2.5 border border-gray-200 rounded-xl focus:border-[#0F7B4E] outline-none text-xs font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-gray-400 font-mono">No. Whatsapp (Format 62xxx):</label>
                    <input
                      type="text"
                      required
                      value={editUserWhatsapp}
                      onChange={(e) => setEditUserWhatsapp(e.target.value)}
                      className="w-full p-2.5 border border-gray-200 rounded-xl focus:border-[#0F7B4E] outline-none text-xs font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-gray-400 font-mono">Peran Sistem (Role):</label>
                    <select
                      value={editUserRole}
                      onChange={(e) => setEditUserRole(e.target.value as UserRole)}
                      className="w-full p-2.5 border border-gray-200 rounded-xl focus:border-[#0F7B4E] outline-none text-xs font-semibold"
                    >
                      <option value="pencari">👤 Pencari Jasa (Mahasiswa Pemesan)</option>
                      <option value="penyedia">👨🎓 Penyedia Jasa (Helper)</option>
                      <option value="admin">🛡️ Administrator Sistem</option>
                    </select>
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex gap-2 justify-end">
                  <button 
                    type="button" 
                    onClick={() => setEditingUser(null)} 
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 bg-[#0F7B4E] hover:bg-[#0B5E3C] text-white text-xs font-bold rounded-xl shadow-sm cursor-pointer"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      )}

      {/* 3. SEMUA TRANSAKSI ESCROW TAB */}
      {activeTab === 'transaksi' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden text-xs animate-in fade-in duration-150">
          
          <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
            <div>
              <h3 className="font-bold text-sm uppercase text-gray-900 font-mono">Semua Sesi Transaksi Escrow</h3>
              <p className="text-[11px] text-gray-500">Total {filteredOrders.length} transaksi escrow terfilter. Admin dapat bertindak sebagai mediator untuk mematangkan status pesanan.</p>
              
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <span className="text-[10px] font-bold text-gray-400 uppercase font-mono">Unduh Laporan:</span>
                <button
                  onClick={downloadExcel}
                  className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  title="Unduh Laporan Excel (.xls)"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-600" /> Excel (.xls)
                </button>
                <button
                  onClick={downloadCSV}
                  className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  title="Unduh Laporan CSV (.csv)"
                >
                  <Download className="w-3.5 h-3.5 text-slate-600" /> CSV (.csv)
                </button>
                <button
                  onClick={downloadWord}
                  className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  title="Unduh Laporan Word (.doc)"
                >
                  <Download className="w-3.5 h-3.5 text-blue-600" /> Word (.doc)
                </button>
              </div>
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              {/* Search */}
              <div className="relative flex-1 sm:flex-initial">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari ID, judul tugas, helper..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 bg-white border border-gray-200 rounded-xl focus:border-[#0F7B4E] outline-none text-xs"
                />
              </div>

              {/* Status filter */}
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="p-1.5 bg-white border border-gray-200 rounded-xl focus:border-[#0F7B4E] outline-none text-xs font-semibold"
              >
                <option value="all">Semua Status</option>
                <option value="menunggu_konfirmasi">Menunggu Konfirmasi</option>
                <option value="menunggu_pembayaran">Menunggu Pembayaran</option>
                <option value="dibayar">Dibayar (Escrow)</option>
                <option value="sedang_dikerjakan">Sedang Dikerjakan</option>
                <option value="selesai_menunggu_konfirmasi">Selesai (Menunggu Review)</option>
                <option value="selesai">Selesai</option>
                <option value="rated">Sudah Diulas</option>
                <option value="ditolak">Ditolak</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            {filteredOrders.length === 0 ? (
              <div className="p-12 text-center text-gray-400 font-medium">
                Tidak ada data pesanan escrow yang cocok dengan pencarian Anda.
              </div>
            ) : (
              <table className="w-full text-left font-sans text-xs">
                <thead className="bg-slate-50 font-bold uppercase text-[10px] text-gray-500 border-b">
                  <tr>
                    <th className="px-6 py-3">ID Pesanan / Judul Tugas</th>
                    <th className="px-6 py-3">Pemesan (Pencari)</th>
                    <th className="px-6 py-3">Helper (Penyedia)</th>
                    <th className="px-6 py-3">Biaya Layanan</th>
                    <th className="px-6 py-3">Fee Platform</th>
                    <th className="px-6 py-3">Total Bayar</th>
                    <th className="px-6 py-3">Status Terkini</th>
                    <th className="px-6 py-3 text-right">Escrow Overrides (Mediasi)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {filteredOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-50/30">
                      <td className="px-6 py-4">
                        <span className="font-bold text-gray-400 text-[10px] block">#{o.id}</span>
                        <span className="font-bold text-gray-900 font-sans block max-w-xs truncate" title={o.tugasTitle}>{o.tugasTitle}</span>
                        <span className="text-[9px] text-gray-400 font-sans block">Dibuat: {new Date(o.createdAt).toLocaleDateString('id-ID')}</span>
                      </td>
                      <td className="px-6 py-4 font-sans font-semibold text-gray-700">
                        {o.pencariName}
                      </td>
                      <td className="px-6 py-4 font-sans font-semibold text-gray-700">
                        {o.penyediaName}
                      </td>
                      <td className="px-6 py-4 text-gray-600 font-bold">
                        {formatRupiah(o.jasaPrice)}
                      </td>
                      <td className="px-6 py-4 text-emerald-800 font-bold">
                        {formatRupiah(o.biayaPlatform || 0)}
                      </td>
                      <td className="px-6 py-4 text-gray-900 font-extrabold">
                        {formatRupiah(o.totalBayar)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded font-bold text-[9px] uppercase border ${getStatusColorClass(o.status)}`}>
                          {getStatusLabelText(o.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-sans">
                        <div className="flex gap-1 justify-end items-center">
                          {/* Force Confirm Payment */}
                          {o.status === 'menunggu_pembayaran' && (
                            <button
                              onClick={() => handleForceOrderStatus(o.id, 'dibayar')}
                              className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[9px] rounded uppercase cursor-pointer transition-colors"
                              title="Konfirmasi Pembayaran Manual"
                            >
                              Konfirmasi Pembayaran
                            </button>
                          )}

                          {/* Force Selesai (Mark completed on disputes) */}
                          {o.status === 'selesai_menunggu_konfirmasi' && (
                            <button
                              onClick={() => handleForceOrderStatus(o.id, 'selesai')}
                              className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[9px] rounded uppercase cursor-pointer transition-colors"
                              title="Selesaikan Transaksi Manual"
                            >
                              Selesaikan & Lepas Dana
                            </button>
                          )}

                          {/* Detail page navigate shortcut */}
                          <button
                            onClick={() => {
                              onNavigate('detail-pesanan-penyedia', { orderId: o.id });
                            }}
                            className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-[9px] rounded uppercase cursor-pointer transition-colors"
                          >
                            Buka Tiket
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

        </div>
      )}

      {/* 4. PERSETUJUAN PENARIKAN TAB */}
      {activeTab === 'penarikan' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden text-xs animate-in fade-in duration-150">
          
          <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
            <div>
              <h3 className="font-bold text-sm uppercase text-gray-900 font-mono">Persetujuan Penarikan Dana Helper</h3>
              <p className="text-[11px] text-gray-500">Tinjau, setujui, atau tolak penarikan saldo pendapatan akademis dari para mahasiswa helper.</p>
            </div>

            <select
              value={withdrawalFilter}
              onChange={(e) => setWithdrawalFilter(e.target.value)}
              className="p-1.5 bg-white border border-gray-200 rounded-xl focus:border-[#0F7B4E] outline-none text-xs font-semibold"
            >
              <option value="all">Semua Status Pengajuan</option>
              <option value="pending">⏳ Pending (Menunggu Tindakan)</option>
              <option value="disetujui">✓ Disetujui / Sukses Transfer</option>
              <option value="ditolak">✕ Ditolak</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            {filteredWithdrawals.length === 0 ? (
              <div className="p-12 text-center text-gray-400 font-medium">
                Tidak ada pengajuan penarikan dana terdaftar.
              </div>
            ) : (
              <table className="w-full text-left font-sans text-xs">
                <thead className="bg-slate-50 font-bold uppercase text-[10px] text-gray-500 border-b">
                  <tr>
                    <th className="px-6 py-3">ID Pengajuan</th>
                    <th className="px-6 py-3">Nama Helper</th>
                    <th className="px-6 py-3">Tujuan Transfer</th>
                    <th className="px-6 py-3">No. Rekening / HP</th>
                    <th className="px-6 py-3">Atas Nama</th>
                    <th className="px-6 py-3">Jumlah Penarikan</th>
                    <th className="px-6 py-3">Tanggal Pengajuan</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Tindakan Persetujuan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {filteredWithdrawals.map((w) => (
                    <tr key={w.id} className="hover:bg-slate-50/30">
                      <td className="px-6 py-4 text-gray-400 font-medium">
                        #{w.id}
                      </td>
                      <td className="px-6 py-4 font-sans font-bold text-gray-900">
                        {w.penyediaName}
                      </td>
                      <td className="px-6 py-4 font-sans text-gray-700 font-semibold">
                        {w.rekeningBank}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {w.rekeningNomor}
                      </td>
                      <td className="px-6 py-4 font-sans text-gray-600">
                        {w.rekeningNama}
                      </td>
                      <td className="px-6 py-4 font-bold text-emerald-800 text-sm">
                        {formatRupiah(w.amount)}
                      </td>
                      <td className="px-6 py-4 text-gray-400">
                        {new Date(w.createdAt).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded font-bold text-[9px] uppercase ${
                          w.status === 'disetujui' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : w.status === 'ditolak' 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-amber-100 text-amber-800 animate-pulse'
                        }`}>
                          {w.status === 'disetujui' ? '✓ Disetujui' : w.status === 'ditolak' ? '✕ Ditolak' : '⏳ Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-sans">
                        {w.status === 'pending' ? (
                          <div className="flex gap-1 justify-end">
                            <button
                              onClick={() => {
                                setApprovingWd(w);
                                setActionNote('');
                              }}
                              className="p-1 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-lg cursor-pointer transition-colors"
                            >
                              Setujui (Transfer)
                            </button>
                            <button
                              onClick={() => {
                                setRejectingWd(w);
                                setActionNote('');
                              }}
                              className="p-1 px-2.5 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold rounded-lg cursor-pointer transition-colors"
                            >
                              Tolak
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-400 font-mono text-[10px] block max-w-xs truncate" title={w.catatanAdmin}>
                            {w.catatanAdmin || '-'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Approve Modal Overlay */}
          {approvingWd && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-150 text-left">
                <div className="px-6 py-4 bg-emerald-600 text-white flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-sm uppercase font-mono">Persetujuan Transfer Dana</h3>
                    <p className="text-[10px] text-emerald-100 mt-0.5">ID Pengajuan: {approvingWd.id}</p>
                  </div>
                  <button type="button" onClick={() => setApprovingWd(null)} className="text-white hover:text-emerald-150 cursor-pointer">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2 text-xs">
                    <p className="text-gray-500 font-sans">Helper Penerima: <strong className="text-gray-950">{approvingWd.penyediaName}</strong></p>
                    <p className="text-gray-500 font-sans">Tujuan Rekening: <strong className="text-gray-950">{approvingWd.rekeningBank} - {approvingWd.rekeningNomor}</strong></p>
                    <p className="text-gray-500 font-sans">Atas Nama: <strong className="text-gray-950">{approvingWd.rekeningNama}</strong></p>
                    <p className="text-gray-500 font-sans">Total Transfer Cair: <strong className="text-[#0F7B4E] font-mono text-sm">{formatRupiah(approvingWd.amount)}</strong></p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-gray-400 font-mono">Catatan Transfer / Bukti Referensi Bank:</label>
                    <textarea
                      required
                      placeholder="Masukkan catatan / ID mutasi bank untuk referensi helper. Contoh: Transfer berhasil via KlikBCA No ref 882736152"
                      value={actionNote}
                      onChange={(e) => setActionNote(e.target.value)}
                      className="w-full p-2.5 border border-gray-200 rounded-xl focus:border-[#0F7B4E] outline-none text-xs h-24 resize-none"
                    />
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex gap-2 justify-end">
                  <button 
                    type="button" 
                    onClick={() => setApprovingWd(null)} 
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Batal
                  </button>
                  <button 
                    onClick={handleApproveWithdrawal}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm cursor-pointer"
                  >
                    Konfirmasi Sukses Transfer ✓
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Reject Modal Overlay */}
          {rejectingWd && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-150 text-left">
                <div className="px-6 py-4 bg-red-600 text-white flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-sm uppercase font-mono">Tolak Pengajuan Penarikan</h3>
                    <p className="text-[10px] text-red-100 mt-0.5">ID Pengajuan: {rejectingWd.id}</p>
                  </div>
                  <button type="button" onClick={() => setRejectingWd(null)} className="text-white hover:text-red-150 cursor-pointer">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  <div className="p-4 bg-red-50/50 border border-red-100 rounded-xl space-y-2 text-xs">
                    <p className="text-gray-500 font-sans">Helper Pengaju: <strong className="text-gray-950">{rejectingWd.penyediaName}</strong></p>
                    <p className="text-gray-500 font-sans">Jumlah Penarikan: <strong className="text-red-700 font-mono text-sm">{formatRupiah(rejectingWd.amount)}</strong></p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-gray-400 font-mono">Alasan Penolakan:</label>
                    <textarea
                      required
                      placeholder="Tulis alasan logis penolakan agar helper dapat merevisi rekening/HP mereka. Contoh: Nama Atas Nama rekening tidak sesuai dengan profile data."
                      value={actionNote}
                      onChange={(e) => setActionNote(e.target.value)}
                      className="w-full p-2.5 border border-gray-200 rounded-xl focus:border-red-500 outline-none text-xs h-24 resize-none"
                    />
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex gap-2 justify-end">
                  <button 
                    type="button" 
                    onClick={() => setRejectingWd(null)} 
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Batal
                  </button>
                  <button 
                    onClick={handleRejectWarningCheck}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-sm cursor-pointer"
                  >
                    Tolak Pengajuan ✕
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* 5. SETTINGS KOMISI TAB */}
      {activeTab === 'komisi' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm max-w-2xl p-6 space-y-6 animate-in fade-in duration-150">
          <div>
            <h3 className="font-bold text-base text-gray-900 flex items-center gap-1.5 font-display">
              <Settings className="w-5 h-5 text-[#0F7B4E]" /> Pengaturan Tarif Komisi Escrow
            </h3>
            <p className="text-xs text-gray-400 mt-1">Konfigurasikan persentase biaya administrasi platform escrow yang dipotong pada setiap transaksi pembayaran tugas sukses.</p>
          </div>

          {commissionSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-250 text-emerald-800 text-xs rounded-xl font-bold">
              ✓ Pengaturan tarif komisi berhasil disimpan! Semua transaksi baru akan dipotong otomatis.
            </div>
          )}

          <form onSubmit={handleSaveCommission} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-gray-400 font-mono">Persentase Komisi Platform (%):</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="50"
                  required
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(Number(e.target.value))}
                  className="p-2.5 bg-white border border-gray-200 rounded-xl focus:border-[#0F7B4E] outline-none text-xs font-mono w-32 font-bold"
                />
                <span className="text-sm font-bold text-gray-500">% per Transaksi</span>
              </div>
              <p className="text-[10px] text-gray-400">Contoh: Jika harga tugas Rp 100.000 dengan tarif 5%, pembeli membayar Rp 105.000 atau helper menerima Rp 95.000 sesuai kebijakan pembagian.</p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
              <h4 className="font-bold text-gray-700 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-[#0F7B4E]" /> Aturan Escrow KampusFix
              </h4>
              <ul className="list-disc pl-4 space-y-1 text-[11px] text-gray-500 font-sans">
                <li>Komisi ditarik otomatis dari kalkulasi total bayar pesanan.</li>
                <li>Dana tertahan di rekening platform sampai pencari mengonfirmasi selesai / rated.</li>
                <li>Penyedia Jasa (Helper) berhak mencairkan saldo bersih 100% setelah dikurangi komisi platform.</li>
              </ul>
            </div>

            <button 
              type="submit" 
              className="px-4 py-2.5 bg-[#0F7B4E] hover:bg-[#0B5E3C] text-white font-bold text-xs rounded-xl shadow-sm cursor-pointer uppercase font-mono tracking-wider"
            >
              Simpan Aturan Komisi
            </button>
          </form>
        </div>
      )}

    </div>
  );

  function handleRejectWarningCheck() {
    if (!actionNote.trim()) {
      alert('Mohon tulis alasan penolakan agar helper mengetahui penyebabnya.');
      return;
    }
    handleRejectWithdrawal();
  }
}
