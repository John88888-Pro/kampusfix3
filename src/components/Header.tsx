/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Bell, 
  User as UserIcon, 
  LogOut, 
  ArrowRightLeft, 
  UserCheck, 
  Mail, 
  MessageSquare,
  Sparkles,
  ChevronDown,
  Clock,
  Menu,
  X
} from 'lucide-react';
import { User, Notifikasi } from '../types';
import { KampusFixDB } from '../data/db';

interface HeaderProps {
  activeUser: User | null;
  onNavigate: (view: string, params?: any) => void;
  onLogout: () => void;
  onSimulateUser?: (user: User) => void;
  refreshTrigger: number;
}

export default function Header({ 
  activeUser, 
  onNavigate, 
  onLogout, 
  onSimulateUser,
  refreshTrigger 
}: HeaderProps) {
  const [notifications, setNotifications] = useState<Notifikasi[]>([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    // Load notifications for the logged in user
    if (activeUser) {
      const allNotif = KampusFixDB.getNotifications();
      const userNotif = allNotif.filter(n => n.userId === activeUser.id);
      setNotifications(userNotif);
    } else {
      setNotifications([]);
    }
  }, [activeUser, refreshTrigger]);

  const handleMarkAsRead = (id: string) => {
    const all = KampusFixDB.getNotifications();
    const idx = all.findIndex(n => n.id === id);
    if (idx !== -1) {
      all[idx].read = true;
      KampusFixDB.saveNotifications(all);
      // reload
      if (activeUser) {
        setNotifications(all.filter(n => n.userId === activeUser.id));
      }
    }
  };

  const handleClearAllNotif = () => {
    if (!activeUser) return;
    const all = KampusFixDB.getNotifications();
    const updated = all.map(n => n.userId === activeUser.id ? { ...n, read: true } : n);
    KampusFixDB.saveNotifications(updated);
    setNotifications(updated.filter(n => n.userId === activeUser.id));
  };

  const handleNotificationClick = (n: Notifikasi) => {
    handleMarkAsRead(n.id);
    setShowNotifDropdown(false);
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

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            onClick={() => onNavigate('home')} 
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="h-10 w-10 rounded-xl bg-[#0F7B4E] flex items-center justify-center text-white font-bold group-hover:scale-105 transition-all duration-200 shadow-md shadow-emerald-700/10">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xl font-display font-extrabold tracking-tight text-gray-950">
                Kampus<span className="text-[#0F7B4E]">Fix</span>
              </span>
              <span className="block text-[9px] text-gray-400 font-mono tracking-wider -mt-1 font-semibold uppercase">
                Campus Escrow Jasa
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => onNavigate('home')} 
              className="text-sm font-medium text-gray-600 hover:text-[#0F7B4E] transition-colors py-2 cursor-pointer"
            >
              Beranda
            </button>
            <button 
              onClick={() => onNavigate('kategori')} 
              className="text-sm font-medium text-gray-600 hover:text-[#0F7B4E] transition-colors py-2 cursor-pointer"
            >
              Kategori Jasa
            </button>
            <button 
              onClick={() => onNavigate('tentang')} 
              className="text-sm font-medium text-gray-600 hover:text-[#0F7B4E] transition-colors py-2 cursor-pointer"
            >
              Tentang
            </button>
            <button 
              onClick={() => onNavigate('kontak')} 
              className="text-sm font-medium text-gray-600 hover:text-[#0F7B4E] transition-colors py-2 cursor-pointer"
            >
              Hubungi Kami
            </button>
          </nav>

          {/* Header Action Buttons & User Profil */}
          <div className="hidden md:flex items-center gap-4">
            {!activeUser ? (
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => onNavigate('login', { tab: 'masuk' })} 
                  className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-[#0F7B4E] cursor-pointer"
                >
                  Masuk
                </button>
                <button 
                  onClick={() => onNavigate('login', { tab: 'daftar' })} 
                  className="px-4 py-2 text-sm font-semibold text-white bg-[#0F7B4E] hover:bg-[#0B5E3C] rounded-lg shadow-sm cursor-pointer transition-colors duration-150"
                >
                  Daftar
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                {/* Dashboard Shortcut link */}
                <button 
                  onClick={() => onNavigate(activeUser.role === 'admin' ? 'dashboard-admin' : activeUser.role === 'pencari' ? 'dashboard-pencari' : 'dashboard-penyedia')}
                  className="text-sm font-semibold text-gray-700 hover:text-[#0F7B4E] cursor-pointer"
                >
                  Dashboard
                </button>

                {/* Notifications Bell */}
                <div className="relative">
                  <button 
                    onClick={() => {
                      setShowNotifDropdown(!showNotifDropdown);
                      setShowProfileDropdown(false);
                    }}
                    className="p-2 text-gray-500 hover:text-[#0F7B4E] hover:bg-gray-50 rounded-full cursor-pointer relative"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 flex h-4 w-4 bg-red-500 text-white rounded-full items-center justify-center text-[9px] font-bold font-mono">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications Dropdown Card */}
                  {showNotifDropdown && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 py-3 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 pb-2 border-b border-gray-100 flex justify-between items-center">
                        <span className="font-bold text-gray-800 text-sm">Notifikasi Baru ({unreadCount})</span>
                        {unreadCount > 0 && (
                          <button 
                            onClick={handleClearAllNotif}
                            className="text-[10px] text-gray-500 hover:text-[#0F7B4E] font-semibold cursor-pointer"
                          >
                            Tandai semua dibaca
                          </button>
                        )}
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="px-4 py-6 text-center text-xs text-gray-400">
                            Tidak ada notifikasi baru
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <div 
                              key={n.id} 
                              onClick={() => handleNotificationClick(n)}
                              className={`px-4 py-3 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${!n.read ? 'bg-emerald-50/40' : ''}`}
                            >
                              <div className="flex justify-between items-start">
                                <span className="font-semibold text-xs text-gray-900">{n.title}</span>
                                <span className="text-[9px] text-gray-400 font-mono mt-0.5"><Clock className="w-2 h-2 inline mr-0.5"/>
                                  {new Date(n.createdAt).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 mt-1 line-clamp-2">{n.message}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile menu dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => {
                      setShowProfileDropdown(!showProfileDropdown);
                      setShowNotifDropdown(false);
                    }}
                    className="flex items-center gap-1.5 focus:outline-none cursor-pointer p-1 rounded-full hover:bg-gray-50"
                  >
                    <img 
                      src={activeUser.avatar || 'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=200'}
                      alt={activeUser.name}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full object-cover border border-[#0F7B4E]/20"
                    />
                    <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                  </button>

                  {/* Profile Dropdown list */}
                  {showProfileDropdown && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 divide-y divide-gray-100 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-2.5">
                        <p className="text-xs text-gray-400">Masuk sebagai</p>
                        <p className="font-bold text-sm text-gray-800 truncate">{activeUser.name}</p>
                        <p className="text-[10px] text-gray-500 font-mono truncate">{activeUser.email}</p>
                      </div>

                      <div className="py-1">
                        <button 
                          onClick={() => {
                            setShowProfileDropdown(false);
                            onNavigate('profile-page');
                          }} 
                          className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 hover:text-[#0F7B4E] flex items-center gap-2 cursor-pointer"
                        >
                          <UserIcon className="w-3.5 h-3.5 text-gray-400" />
                          Pengaturan Profil
                        </button>
                        <button 
                          onClick={() => {
                            setShowProfileDropdown(false);
                            onNavigate(activeUser.role === 'admin' ? 'dashboard-admin' : activeUser.role === 'pencari' ? 'dashboard-pencari' : 'dashboard-penyedia');
                          }}
                          className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 hover:text-[#0F7B4E] flex items-center gap-2 cursor-pointer"
                        >
                          <UserCheck className="w-3.5 h-3.5 text-gray-400" />
                          Dashboard Saya
                        </button>
                      </div>

                      <div className="py-1">
                        <button 
                          onClick={() => {
                            setShowProfileDropdown(false);
                            onLogout();
                          }}
                          className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer font-medium"
                        >
                          <LogOut className="w-3.5 h-3.5 text-red-400" />
                          Keluar
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-3">
            {activeUser && (
              <button 
                onClick={() => onNavigate('notifikasi-page')} 
                className="p-1 px-2 bg-gray-100 rounded-lg text-xs font-semibold flex items-center gap-1"
              >
                <Bell className="w-4 h-4 text-gray-600" />
                {unreadCount > 0 && <span className="bg-red-500 text-white px-1.5 py-0.2 rounded-full text-[9px]">{unreadCount}</span>}
              </button>
            )}
            <button 
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 text-gray-600 hover:text-[#0F7B4E]"
            >
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {showMobileMenu && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
          <button 
            onClick={() => { onNavigate('home'); setShowMobileMenu(false); }} 
            className="block w-full text-left px-3 py-2 text-base font-medium rounded-lg text-gray-700 hover:bg-gray-50 hover:text-[#0F7B4E]"
          >
            Beranda
          </button>
          <button 
            onClick={() => { onNavigate('kategori'); setShowMobileMenu(false); }} 
            className="block w-full text-left px-3 py-2 text-base font-medium rounded-lg text-gray-700 hover:bg-gray-50 hover:text-[#0F7B4E]"
          >
            Kategori Jasa
          </button>
          <button 
            onClick={() => { onNavigate('tentang'); setShowMobileMenu(false); }} 
            className="block w-full text-left px-3 py-2 text-base font-medium rounded-lg text-gray-700 hover:bg-gray-50 hover:text-[#0F7B4E]"
          >
            Tentang Kami
          </button>
          <button 
            onClick={() => { onNavigate('kontak'); setShowMobileMenu(false); }} 
            className="block w-full text-left px-3 py-2 text-base font-medium rounded-lg text-gray-700 hover:bg-gray-50 hover:text-[#0F7B4E]"
          >
            Hubungi Kami
          </button>

          {activeUser ? (
            <div className="pt-4 border-t border-gray-100 space-y-2">
              <p className="text-xs text-gray-400 px-3">Masuk sebagai: {activeUser.name}</p>
              <button 
                onClick={() => { onNavigate(activeUser.role === 'admin' ? 'dashboard-admin' : activeUser.role === 'pencari' ? 'dashboard-pencari' : 'dashboard-penyedia'); setShowMobileMenu(false); }} 
                className="block w-full text-left px-3 py-2 text-base font-medium rounded-lg text-gray-700 hover:bg-gray-50 hover:text-[#0F7B4E]"
              >
                Dashboard Saya
              </button>
              <button 
                onClick={() => { onNavigate('profile-page'); setShowMobileMenu(false); }} 
                className="block w-full text-left px-3 py-2 text-base font-medium rounded-lg text-gray-700 hover:bg-gray-50 hover:text-[#0F7B4E]"
              >
                Profil Saya
              </button>
              <button 
                onClick={() => { onLogout(); setShowMobileMenu(false); }} 
                className="block w-full text-left px-3 py-2 text-base font-medium rounded-lg text-red-600 hover:bg-red-50"
              >
                Keluar
              </button>
            </div>
          ) : (
            <div className="pt-4 border-t border-gray-100 flex gap-3">
              <button 
                onClick={() => { onNavigate('login', { tab: 'masuk' }); setShowMobileMenu(false); }} 
                className="flex-1 text-center py-2 text-sm font-semibold border border-gray-200 text-gray-700 rounded-lg"
              >
                Masuk
              </button>
              <button 
                onClick={() => { onNavigate('login', { tab: 'daftar' }); setShowMobileMenu(false); }} 
                className="flex-1 text-center py-2 text-sm font-semibold bg-[#0F7B4E] hover:bg-[#0B5E3C] text-white rounded-lg"
              >
                Daftar
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
