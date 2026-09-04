import React from 'react';
import { useApp, ActiveTab } from '../context/AppContext';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  FileSpreadsheet,
  CheckSquare,
  FileText,
  UserCog,
  FileCode2,
  LogOut,
  Sparkles,
  School,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { activeTab, setActiveTab, currentUser, switchRole, stats } = useApp();

  interface NavItem {
    id: ActiveTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string | number;
    roles?: string[];
  }

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      roles: ['ADMIN', 'KEPALA_SEKOLAH', 'SUPERVISOR', 'GURU']
    },
    {
      id: 'guru',
      label: 'Data Guru',
      icon: Users,
      badge: stats.totalGuru,
      roles: ['ADMIN', 'KEPALA_SEKOLAH', 'SUPERVISOR']
    },
    {
      id: 'mapel',
      label: 'Mata Pelajaran',
      icon: BookOpen,
      roles: ['ADMIN', 'KEPALA_SEKOLAH', 'SUPERVISOR']
    },
    {
      id: 'jadwal',
      label: 'Jadwal Supervisi',
      icon: CalendarDays,
      badge: stats.jadwalMendatang > 0 ? stats.jadwalMendatang : undefined,
      roles: ['ADMIN', 'KEPALA_SEKOLAH', 'SUPERVISOR', 'GURU']
    },
    {
      id: 'instrumen',
      label: 'Instrumen Supervisi',
      icon: ClipboardCheck,
      roles: ['ADMIN', 'KEPALA_SEKOLAH', 'SUPERVISOR', 'GURU']
    },
    {
      id: 'observasi',
      label: 'Observasi Kelas',
      icon: Sparkles,
      roles: ['ADMIN', 'KEPALA_SEKOLAH', 'SUPERVISOR']
    },
    {
      id: 'hasil',
      label: 'Hasil Supervisi',
      icon: FileSpreadsheet,
      badge: stats.guruSudahDisupervisi,
      roles: ['ADMIN', 'KEPALA_SEKOLAH', 'SUPERVISOR', 'GURU']
    },
    {
      id: 'tindak-lanjut',
      label: 'Tindak Lanjut',
      icon: CheckSquare,
      roles: ['ADMIN', 'KEPALA_SEKOLAH', 'SUPERVISOR', 'GURU']
    },
    {
      id: 'laporan',
      label: 'Laporan & PDF',
      icon: FileText,
      roles: ['ADMIN', 'KEPALA_SEKOLAH', 'SUPERVISOR', 'GURU']
    },
    {
      id: 'pengguna',
      label: 'Pengguna',
      icon: UserCog,
      roles: ['ADMIN']
    },
    {
      id: 'gas-export',
      label: 'Kode GAS & Sheets',
      icon: FileCode2,
      roles: ['ADMIN', 'KEPALA_SEKOLAH', 'SUPERVISOR', 'GURU']
    }
  ];

  // Filter items visible for current user role
  const visibleNavItems = navItems.filter(item => 
    !item.roles || item.roles.includes(currentUser.role)
  );

  const handleNavClick = (tabId: ActiveTab) => {
    setActiveTab(tabId);
    onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        id="app-sidebar"
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-auto h-full shrink-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* School Branding Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800/80 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-emerald-400">SIPES-GURU</h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-400 mt-1">SMKN Bojonggambir</p>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 text-slate-400 hover:text-white rounded-md"
            aria-label="Tutup Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-3 space-y-0.5">
          <div className="px-5 mb-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
            Menu Utama
          </div>

          {visibleNavItems
            .filter(item => !['pengguna', 'gas-export'].includes(item.id))
            .map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-5 py-2.5 text-xs transition-colors ${
                    isActive
                      ? 'bg-emerald-600 text-white border-l-4 border-emerald-300 font-semibold'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white font-medium'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

          {/* Sistem Section */}
          <div className="mt-5 px-5 mb-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
            Sistem & Pengaturan
          </div>

          {visibleNavItems
            .filter(item => ['pengguna', 'gas-export'].includes(item.id))
            .map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-5 py-2 text-xs transition-colors ${
                    isActive
                      ? 'bg-emerald-600 text-white border-l-4 border-emerald-300 font-semibold'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white font-medium'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                </button>
              );
            })}

          <button
            id="btn-logout-sidebar-menu"
            onClick={() => {
              if (confirm('Keluar dari sesi saat ini? Anda dapat memilih peran lain.')) {
                switchRole('GURU');
                setActiveTab('dashboard');
              }
            }}
            className="w-full flex items-center px-5 py-2 text-xs text-rose-400 hover:bg-slate-800 hover:text-rose-300 transition-colors font-medium"
          >
            <div className="flex items-center space-x-3">
              <LogOut className="w-4 h-4 shrink-0" />
              <span>Ganti Sesi / Keluar</span>
            </div>
          </button>
        </nav>

        {/* User Identity Chip in Bottom Footer */}
        <div className="p-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center min-w-0">
            <div className="w-8 h-8 rounded bg-emerald-500 flex items-center justify-center font-bold text-xs text-white shrink-0">
              {currentUser.role === 'KEPALA_SEKOLAH'
                ? 'KS'
                : currentUser.role === 'ADMIN'
                ? 'AD'
                : currentUser.role === 'SUPERVISOR'
                ? 'SP'
                : 'GU'}
            </div>
            <div className="ml-3 min-w-0">
              <p className="text-xs font-medium text-white truncate">{currentUser.nama}</p>
              <p className="text-[10px] text-slate-500 truncate">
                {currentUser.role === 'KEPALA_SEKOLAH'
                  ? 'Kepala Sekolah'
                  : currentUser.role === 'ADMIN'
                  ? 'Administrator'
                  : currentUser.role === 'SUPERVISOR'
                  ? 'Supervisor / Waka'
                  : 'Guru Pendidik'}
              </p>
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" title="Aktif" />
        </div>
      </aside>
    </>
  );
};
