import React, { useState } from 'react';
import { useApp, ActiveTab } from '../context/AppContext';
import { UserRole } from '../types';
import { 
  GraduationCap, 
  UserCheck, 
  Shield, 
  ChevronDown, 
  RotateCcw, 
  Printer, 
  FileCode, 
  Menu, 
  CheckCircle2, 
  AlertTriangle,
  Info,
  Plus
} from 'lucide-react';

interface NavbarProps {
  toggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const { currentUser, switchRole, notification, resetAllData, activeTab, setActiveTab } = useApp();
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const roleLabels: Record<UserRole, { label: string; badgeClass: string }> = {
    ADMIN: { label: 'Admin', badgeClass: 'bg-rose-100 text-rose-800 border-rose-200' },
    KEPALA_SEKOLAH: { label: 'Kepala Sekolah', badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    SUPERVISOR: { label: 'Supervisor', badgeClass: 'bg-blue-100 text-blue-800 border-blue-200' },
    GURU: { label: 'Guru', badgeClass: 'bg-amber-100 text-amber-800 border-amber-200' }
  };

  const pageMeta: Record<ActiveTab, { title: string; subtitle: string }> = {
    'dashboard': { title: 'Dashboard Ringkasan', subtitle: 'Kurikulum Merdeka • Semester Ganjil 2026/2027' },
    'guru': { title: 'Data Pendidik & Tenaga Kependidikan', subtitle: 'Direktori Guru SMK Negeri Bojonggambir' },
    'mapel': { title: 'Katalog Mata Pelajaran', subtitle: 'Kurikulum Merdeka • Fase E & Fase F' },
    'jadwal': { title: 'Jadwal Supervisi Akademik', subtitle: 'Agenda Observasi & Kalender Pembelajaran' },
    'instrumen': { title: 'Instrumen Supervisi Pembelajaran', subtitle: '39 Indikator Standar Kurikulum Merdeka (5 Dimensi)' },
    'observasi': { title: 'Observasi Kelas', subtitle: 'Lembar Penilaian & Evaluasi Pembelajaran Real-Time' },
    'hasil': { title: 'Hasil & Rekapitulasi Supervisi', subtitle: 'Analisis Skor, Kategori Predikat & Rekomendasi' },
    'tindak-lanjut': { title: 'Tindak Lanjut & Pembinaan', subtitle: 'Program Coaching, Kombel & Peningkatan Kompetensi' },
    'laporan': { title: 'Laporan Resmi & Cetak PDF', subtitle: 'Standarisasi Laporan KCD Wilayah XII Jawa Barat' },
    'gas-export': { title: 'Backend Google Apps Script', subtitle: 'Integrasi Database Google Sheets & Source Code' },
    'pengguna': { title: 'Pengaturan & Pengguna', subtitle: 'Profil Satuan Pendidikan & Pejabat Penandatangan' }
  };

  const currentMeta = pageMeta[activeTab] || pageMeta['dashboard'];

  const handlePrintShortcut = () => {
    setActiveTab('laporan');
    setTimeout(() => {
      window.print();
    }, 500);
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0 z-20">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center space-x-3 min-w-0">
        <button
          id="mobile-sidebar-toggle"
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-hidden"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <h2 className="text-base sm:text-lg font-semibold text-slate-800 truncate tracking-tight">
            {currentMeta.title}
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-500 truncate">
            {currentMeta.subtitle}
          </p>
        </div>
      </div>

      {/* Right: Date, Status, Quick Actions & User Controls */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        {/* Date & Server Status Indicator */}
        <div className="hidden md:block text-right pr-2">
          <p className="text-xs font-bold text-slate-700">Kamis, 24 Okt 2026</p>
          <p className="text-[10px] text-slate-500 flex items-center justify-end">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block mr-1.5 animate-pulse" />
            Status Server: Stabil (Google Sheets)
          </p>
        </div>

        {/* Primary Action Button: Emerald "+ Jadwal Baru" */}
        <button
          id="btn-quick-new-jadwal"
          onClick={() => setActiveTab('jadwal')}
          className="inline-flex items-center px-3 sm:px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-2xs transition-colors shrink-0"
          title="Buat Jadwal Baru"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          <span>Jadwal Baru</span>
        </button>

        {/* Quick action: GAS Code Exporter */}
        <button
          id="btn-gas-guide"
          onClick={() => setActiveTab('gas-export')}
          className="hidden sm:inline-flex items-center px-2.5 py-2 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-colors"
          title="Lihat Kode Google Apps Script"
        >
          <FileCode className="w-3.5 h-3.5 mr-1 text-slate-600" />
          <span className="hidden xl:inline">Kode GAS</span>
        </button>

        {/* Print shortcut */}
        <button
          id="btn-quick-print"
          onClick={handlePrintShortcut}
          className="hidden lg:inline-flex items-center px-2.5 py-2 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-colors"
          title="Cetak Laporan Supervisi"
        >
          <Printer className="w-3.5 h-3.5 mr-1 text-slate-600" />
          <span className="hidden xl:inline">Cetak</span>
        </button>

        {/* Role Switcher Simulator */}
        <div className="relative">
          <button
            id="btn-role-switcher"
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium shadow-2xs transition-colors"
          >
            <span className="hidden xl:inline text-slate-500 text-[11px]">Peran:</span>
            <span className={`px-1.5 py-0.5 rounded text-[11px] font-semibold border ${roleLabels[currentUser.role].badgeClass}`}>
              {roleLabels[currentUser.role].label}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {roleDropdownOpen && (
            <div 
              className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150"
              onMouseLeave={() => setRoleDropdownOpen(false)}
            >
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="font-semibold text-slate-800">Simulasi Hak Akses</p>
                <p className="text-[11px] text-slate-500">Pilih peran untuk menguji antarmuka</p>
              </div>

              <button
                id="switch-role-kepala"
                onClick={() => { switchRole('KEPALA_SEKOLAH'); setRoleDropdownOpen(false); }}
                className={`w-full text-left px-3 py-2 hover:bg-emerald-50 flex items-center justify-between ${
                  currentUser.role === 'KEPALA_SEKOLAH' ? 'bg-emerald-50 text-emerald-800 font-semibold' : 'text-slate-700'
                }`}
              >
                <span>Kepala Sekolah (Drs. H. Dadang Suryana)</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </button>

              <button
                id="switch-role-admin"
                onClick={() => { switchRole('ADMIN'); setRoleDropdownOpen(false); }}
                className={`w-full text-left px-3 py-2 hover:bg-rose-50 flex items-center justify-between ${
                  currentUser.role === 'ADMIN' ? 'bg-rose-50 text-rose-800 font-semibold' : 'text-slate-700'
                }`}
              >
                <span>Administrator Sistem</span>
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              </button>

              <button
                id="switch-role-supervisor"
                onClick={() => { switchRole('SUPERVISOR'); setRoleDropdownOpen(false); }}
                className={`w-full text-left px-3 py-2 hover:bg-blue-50 flex items-center justify-between ${
                  currentUser.role === 'SUPERVISOR' ? 'bg-blue-50 text-blue-800 font-semibold' : 'text-slate-700'
                }`}
              >
                <span>Supervisor / Waka (Drs. Asep Nugraha)</span>
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              </button>

              <button
                id="switch-role-guru"
                onClick={() => { switchRole('GURU'); setRoleDropdownOpen(false); }}
                className={`w-full text-left px-3 py-2 hover:bg-amber-50 flex items-center justify-between ${
                  currentUser.role === 'GURU' ? 'bg-amber-50 text-amber-800 font-semibold' : 'text-slate-700'
                }`}
              >
                <span>Guru (Iman Rahmat, S.Kom.)</span>
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              </button>

              <div className="pt-2 mt-2 border-t border-slate-100 px-3">
                <button
                  onClick={() => {
                    if (confirm('Reset seluruh data aplikasi ke contoh default SMKN Bojonggambir?')) {
                      resetAllData();
                      setRoleDropdownOpen(false);
                    }
                  }}
                  className="w-full text-left py-1 text-slate-500 hover:text-rose-600 flex items-center text-[11px]"
                >
                  <RotateCcw className="w-3 h-3 mr-1.5" />
                  Reset Data Contoh
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
