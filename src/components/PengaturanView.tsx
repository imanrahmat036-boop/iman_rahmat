import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { INITIAL_USERS } from '../data/initialData';
import {
  Settings,
  School,
  Calendar,
  Users,
  Shield,
  RotateCcw,
  Save,
  CheckCircle2,
  AlertTriangle,
  Lock
} from 'lucide-react';

export const PengaturanView: React.FC = () => {
  const { currentUser, showNotification } = useApp();

  const [sekolahInfo, setSekolahInfo] = useState({
    namaSekolah: 'SMK NEGERI BOJONGGAMBIR',
    npsn: '69888765',
    alamat: 'Jl. Raya Bojonggambir, Kec. Bojonggambir, Kab. Tasikmalaya, Jawa Barat 46188',
    kepalaSekolah: 'Drs. H. Dadang Suryana, M.Pd.',
    nipKepalaSekolah: '196803151994031007',
    tahunAjaran: '2026/2027',
    semester: 'Ganjil',
    kurikulum: 'Kurikulum Merdeka'
  });

  const [users, setUsers] = useState(INITIAL_USERS);

  const handleSaveSekolah = (e: React.FormEvent) => {
    e.preventDefault();
    showNotification('Informasi sekolah dan tahun ajaran berhasil disimpan.');
  };

  const handleResetData = () => {
    if (window.confirm('Apakah Anda yakin ingin mengatur ulang data ke kondisi awal (default)?')) {
      localStorage.removeItem('sipes_guru_list');
      localStorage.removeItem('sipes_mapel_list');
      localStorage.removeItem('sipes_jadwal_list');
      localStorage.removeItem('sipes_observasi_list');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs">
        <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
          <Settings className="w-4 h-4 text-emerald-600" />
          <span>Pengaturan Sistem & Administrasi Sekolah</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Kelola profil SMK Negeri Bojonggambir, parameter tahun ajaran, dan manajemen pengguna
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Form Profil Sekolah (2 cols) */}
        <div className="lg:col-span-2 bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs space-y-3.5">
          <h3 className="text-xs font-bold text-slate-900 flex items-center space-x-2 pb-2 border-b border-slate-100">
            <School className="w-4 h-4 text-emerald-600" />
            <span>Profil Satuan Pendidikan & Pejabat Penandatangan</span>
          </h3>

          <form onSubmit={handleSaveSekolah} className="space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Satuan Pendidikan</label>
                <input
                  type="text"
                  value={sekolahInfo.namaSekolah}
                  onChange={e => setSekolahInfo({ ...sekolahInfo, namaSekolah: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 font-bold text-slate-800 text-xs focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">NPSN</label>
                <input
                  type="text"
                  value={sekolahInfo.npsn}
                  onChange={e => setSekolahInfo({ ...sekolahInfo, npsn: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Alamat Lengkap</label>
              <input
                type="text"
                value={sekolahInfo.alamat}
                onChange={e => setSekolahInfo({ ...sekolahInfo, alamat: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Kepala Sekolah</label>
                <input
                  type="text"
                  value={sekolahInfo.kepalaSekolah}
                  onChange={e => setSekolahInfo({ ...sekolahInfo, kepalaSekolah: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 font-semibold text-xs focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">NIP Kepala Sekolah</label>
                <input
                  type="text"
                  value={sekolahInfo.nipKepalaSekolah}
                  onChange={e => setSekolahInfo({ ...sekolahInfo, nipKepalaSekolah: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tahun Ajaran Aktif</label>
                <input
                  type="text"
                  value={sekolahInfo.tahunAjaran}
                  onChange={e => setSekolahInfo({ ...sekolahInfo, tahunAjaran: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 font-bold text-xs focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Semester</label>
                <select
                  value={sekolahInfo.semester}
                  onChange={e => setSekolahInfo({ ...sekolahInfo, semester: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 font-semibold text-xs focus:ring-2 focus:ring-emerald-500/20"
                >
                  <option value="Ganjil">Semester Ganjil</option>
                  <option value="Genap">Semester Genap</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Kurikulum Acuan</label>
                <input
                  type="text"
                  disabled
                  value={sekolahInfo.kurikulum}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-100 text-slate-600 font-medium text-xs"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-xs flex items-center space-x-1.5 transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan Pengaturan</span>
              </button>
            </div>
          </form>
        </div>

        {/* User Roles & Reset Box (1 col) */}
        <div className="space-y-4">
          {/* Akun Pengguna Role Matrix */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2.5">
            <h3 className="text-xs font-bold text-slate-900 flex items-center space-x-2">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>Daftar Pengguna & Hak Akses</span>
            </h3>

            <div className="space-y-1.5 text-xs">
              {users.map(u => (
                <div key={u.id} className="p-2 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-800 text-xs">{u.nama}</p>
                    <p className="text-[10px] text-slate-500">@{u.username} • {u.email}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    u.role === 'KEPALA_SEKOLAH'
                      ? 'bg-purple-100 text-purple-800'
                      : u.role === 'ADMIN'
                      ? 'bg-emerald-100 text-emerald-800'
                      : u.role === 'SUPERVISOR'
                      ? 'bg-teal-100 text-teal-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {u.role}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Reset System Data */}
          <div className="bg-white p-4 rounded-xl border border-rose-200 shadow-xs space-y-2.5">
            <h3 className="text-xs font-bold text-rose-800 flex items-center space-x-2">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              <span>Atur Ulang Data (Reset Prototype)</span>
            </h3>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Mengembalikan seluruh data guru, jadwal supervisi, dan lembar observasi ke data contoh bawaan sistem.
            </p>
            <button
              onClick={handleResetData}
              className="w-full py-1.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold transition-colors flex items-center justify-center space-x-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Data ke Awal</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
