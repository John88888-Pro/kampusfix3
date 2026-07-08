/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';

// Core Service Views
import { LandingPage, KategoriPage, DetailJasaPage, DetailPenyediaPage } from './components/ServiceViews';

// Informational Views
import { TentangPage, KontakPage, PrivasiPage, LupaPasswordPage, NotifikasiPage } from './components/shared_views';

// Auth and Profile Views
import { LoginPage, ProfilePage } from './components/UserAuthViews';

// Main Dashboard Views
import { DashboardPencari, DashboardPenyedia } from './components/Dashboards';
import { AdminDashboard } from './components/admin_views';

// Seeking (Pencari) Action Views
import { FormPesan, StatusPesanan, PembayaranPage, RatingPage } from './components/pencari_views';

// Helping (Penyedia) Action Views
import { KelolaJasa, FormJasa, DetailPesananPenyedia, RiwayatPendapatan, PesananMasukPage } from './components/penyedia_views';

import { User } from './types';
import { KampusFixDB } from './data/db';

export default function App() {
  const [currentView, setCurrentView] = useState<{ name: string; params?: any }>({ name: 'home', params: {} });
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    // Check initial active user in localStorage storage
    const user = KampusFixDB.getActiveUser();
    setActiveUser(user);

    // Live update event listener for real-time Firestore sync triggers
    const handleDbSyncUpdate = () => {
      setRefreshTrigger(prev => prev + 1);
      const currentUser = KampusFixDB.getActiveUser();
      setActiveUser(currentUser);
    };
    window.addEventListener('kampusfix-db-updated', handleDbSyncUpdate);
    return () => window.removeEventListener('kampusfix-db-updated', handleDbSyncUpdate);
  }, []);

  const handleNavigate = (viewName: string, params?: any) => {
    setCurrentView({ name: viewName, params });
    setRefreshTrigger(prev => prev + 1);
    // Scroll window smoothly to top
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleSimulateUser = (user: User) => {
    setActiveUser(user);
    KampusFixDB.setActiveUser(user);
    handleNavigate(user.role === 'admin' ? 'dashboard-admin' : user.role === 'pencari' ? 'dashboard-pencari' : 'dashboard-penyedia');
    setRefreshTrigger(prev => prev + 1);
  };

  const handleLogout = () => {
    KampusFixDB.setActiveUser(null);
    setActiveUser(null);
    handleNavigate('home');
    setRefreshTrigger(prev => prev + 1);
  };

  const handleLoginSuccess = (user: User) => {
    setActiveUser(user);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleProfileUpdate = (user: User) => {
    setActiveUser(user);
    setRefreshTrigger(prev => prev + 1);
  };

  const triggerRefresh = () => {
    setRefreshTrigger(p => p + 1);
  };

  // Render view dispatcher based on active view name state
  const renderView = () => {
    switch (currentView.name) {
      case 'home':
        return (
          <LandingPage 
            onNavigate={handleNavigate} 
            activeUser={activeUser}
            refreshTrigger={refreshTrigger}
          />
        );
      
      case 'kategori':
        return (
          <KategoriPage 
            onNavigate={handleNavigate} 
            initialParams={currentView.params}
          />
        );
      
      case 'detail-jasa':
        return (
          <DetailJasaPage 
            onNavigate={handleNavigate} 
            activeUser={activeUser}
            params={currentView.params}
            refreshTrigger={refreshTrigger}
          />
        );
      
      case 'detail-penyedia':
        return (
          <DetailPenyediaPage 
            onNavigate={handleNavigate}
            activeUser={activeUser}
            params={currentView.params}
            refreshTrigger={refreshTrigger}
          />
        );
      
      case 'tentang':
        return <TentangPage />;
      
      case 'kontak':
        return <KontakPage />;
      
      case 'privasi':
        return <PrivasiPage />;

      case 'lupa-password':
        return <LupaPasswordPage onNavigate={handleNavigate} />;

      case 'notifikasi-page':
        return (
          <NotifikasiPage 
            activeUser={activeUser} 
            onNavigate={handleNavigate} 
            refreshTrigger={refreshTrigger}
            onMarkRead={triggerRefresh}
          />
        );
      
      case 'login':
        return (
          <LoginPage 
            onNavigate={handleNavigate} 
            onLoginSuccess={handleLoginSuccess}
            tabInitial={currentView.params?.tab}
            roleSetInitial={currentView.params?.roleSet}
            refreshTrigger={refreshTrigger}
          />
        );
      
      case 'profile-page':
        return (
          <ProfilePage 
            onNavigate={handleNavigate}
            activeUser={activeUser}
            onProfileUpdate={handleProfileUpdate}
            refreshTrigger={refreshTrigger}
          />
        );

      /* Pencari Views */
      case 'dashboard-admin':
        return (
          <AdminDashboard 
            onNavigate={handleNavigate}
            activeUser={activeUser}
            refreshTrigger={refreshTrigger}
            onStateUpdate={triggerRefresh}
          />
        );

      case 'dashboard-pencari':
        return (
          <DashboardPencari 
            onNavigate={handleNavigate}
            activeUser={activeUser}
            refreshTrigger={refreshTrigger}
          />
        );
      
      case 'form-pesan':
        return (
          <FormPesan 
            onNavigate={handleNavigate}
            activeUser={activeUser}
            params={currentView.params}
            onOrderCreated={triggerRefresh}
          />
        );

      case 'status-pesanan':
        return (
          <StatusPesanan 
            onNavigate={handleNavigate}
            activeUser={activeUser}
            params={currentView.params}
            refreshTrigger={refreshTrigger}
            onStateUpdate={triggerRefresh}
          />
        );

      case 'pembayaran-escrow':
        return (
          <PembayaranPage 
            onNavigate={handleNavigate}
            activeUser={activeUser}
            params={currentView.params}
            refreshTrigger={refreshTrigger}
            onPaymentSuccess={triggerRefresh}
          />
        );

      case 'rating-page':
        return (
          <RatingPage 
            onNavigate={handleNavigate}
            activeUser={activeUser}
            params={currentView.params}
            refreshTrigger={refreshTrigger}
            onRatingSubmit={triggerRefresh}
          />
        );

      /* Penyedia Views */
      case 'dashboard-penyedia':
        return (
          <DashboardPenyedia 
            onNavigate={handleNavigate}
            activeUser={activeUser}
            refreshTrigger={refreshTrigger}
          />
        );

      case 'kelola-jasa':
        return (
          <KelolaJasa 
            onNavigate={handleNavigate}
            activeUser={activeUser}
            refreshTrigger={refreshTrigger}
            onJasaDeleted={triggerRefresh}
          />
        );

      case 'form-jasa':
        return (
          <FormJasa 
            onNavigate={handleNavigate}
            activeUser={activeUser}
            params={currentView.params}
            onJasaSaved={triggerRefresh}
          />
        );

      case 'detail-pesanan-penyedia':
        return (
          <DetailPesananPenyedia 
            onNavigate={handleNavigate}
            activeUser={activeUser}
            params={currentView.params}
            refreshTrigger={refreshTrigger}
            onStateUpdate={triggerRefresh}
          />
        );

      case 'riwayat-pendapatan':
        return (
          <RiwayatPendapatan 
            onNavigate={handleNavigate}
            activeUser={activeUser}
            refreshTrigger={refreshTrigger}
          />
        );

      case 'pesanan-masuk':
        return (
          <PesananMasukPage 
            onNavigate={handleNavigate}
            activeUser={activeUser}
            refreshTrigger={refreshTrigger}
          />
        );

      default:
        return (
          <div className="text-center py-20 text-sm p-4">
            <h2 className="font-bold text-gray-800">404: Halaman tidak ditemukan</h2>
            <button onClick={() => handleNavigate('home')} className="mt-4 px-4 py-2 bg-[#0F7B4E] text-white rounded">
              Kembali Ke Beranda
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Header 
        activeUser={activeUser}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        onSimulateUser={handleSimulateUser}
        refreshTrigger={refreshTrigger}
      />
      
      {/* Dynamic Content Mount Surface */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        {renderView()}
      </main>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
