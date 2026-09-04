import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { GuruView } from './components/GuruView';
import { MapelView } from './components/MapelView';
import { JadwalView } from './components/JadwalView';
import { InstrumenView } from './components/InstrumenView';
import { ObservasiView } from './components/ObservasiView';
import { HasilView } from './components/HasilView';
import { TindakLanjutView } from './components/TindakLanjutView';
import { LaporanView } from './components/LaporanView';
import { PanduanGASView } from './components/PanduanGASView';
import { PengaturanView } from './components/PengaturanView';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab, notification } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'guru':
        return <GuruView />;
      case 'mapel':
        return <MapelView />;
      case 'jadwal':
        return <JadwalView />;
      case 'instrumen':
        return <InstrumenView />;
      case 'observasi':
        return <ObservasiView />;
      case 'hasil':
        return <HasilView />;
      case 'tindak-lanjut':
        return <TindakLanjutView />;
      case 'laporan':
        return <LaporanView />;
      case 'gas-export':
      case 'panduan-gas':
        return <PanduanGASView />;
      case 'pengguna':
      case 'pengaturan':
        return <PengaturanView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 font-sans text-slate-800 overflow-hidden antialiased selection:bg-emerald-600 selection:text-white">
      {/* Toast Notification Banner */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className={`px-4 py-3 rounded-xl shadow-lg flex items-center space-x-3 text-xs font-semibold text-white max-w-md ${
            notification.type === 'error'
              ? 'bg-rose-600'
              : notification.type === 'info'
              ? 'bg-slate-900'
              : 'bg-emerald-600'
          }`}>
            {notification.type === 'error' ? (
              <AlertCircle className="w-4 h-4 shrink-0" />
            ) : notification.type === 'info' ? (
              <Info className="w-4 h-4 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            )}
            <span className="flex-1">{notification.message}</span>
          </div>
        </div>
      )}

      {/* Left Sidebar Menu */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Dynamic Main Workspace Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden min-w-0 bg-slate-50">
        {/* Top Header */}
        <Navbar toggleSidebar={() => setSidebarOpen(prev => !prev)} />

        {/* Scrollable View Content */}
        <div className="p-4 sm:p-6 space-y-6 overflow-y-auto flex-1">
          {renderActiveView()}
        </div>

        {/* High Density Footer */}
        <footer className="print:hidden h-10 bg-slate-100 border-t border-slate-200 px-6 sm:px-8 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-700">SIPES-GURU</span>
            <span>•</span>
            <span>SMK Negeri Bojonggambir</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline text-emerald-700 font-medium">Kurikulum Merdeka</span>
          </div>
          <div className="flex items-center space-x-3">
            <span>Versi 2.0-GAS</span>
            <span>•</span>
            <span className="text-slate-600">DB: Google Sheets</span>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
