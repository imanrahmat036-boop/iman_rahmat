import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Observasi } from '../types';
import {
  Sparkles,
  CheckCircle2,
  Clock,
  AlertCircle,
  Edit2,
  UserCheck,
  Calendar,
  X,
  Printer
} from 'lucide-react';

export const TindakLanjutView: React.FC = () => {
  const {
    observasiList,
    updateObservasi,
    setSelectedObservasiId,
    setActiveTab,
    currentUser,
    showNotification
  } = useApp();

  const [editingObs, setEditingObs] = useState<Observasi | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');

  const [formData, setFormData] = useState({
    statusTindakLanjut: 'Dalam proses' as 'Belum' | 'Dalam proses' | 'Selesai',
    bentukPembinaan: '',
    targetPerbaikan: '',
    tindakLanjut: '',
    rekomendasi: ''
  });

  const canEdit = currentUser.role === 'ADMIN' || currentUser.role === 'KEPALA_SEKOLAH' || currentUser.role === 'SUPERVISOR';

  const filteredList = observasiList.filter(o => {
    if (currentUser.role === 'GURU' && currentUser.nama && !o.namaGuru.includes(currentUser.nama)) {
      return false;
    }
    if (!statusFilter) return true;
    return (o.statusTindakLanjut || 'Dalam proses') === statusFilter;
  });

  const handleOpenEdit = (obs: Observasi) => {
    setEditingObs(obs);
    setFormData({
      statusTindakLanjut: obs.statusTindakLanjut || 'Dalam proses',
      bentukPembinaan: obs.bentukPembinaan || 'Diseminasi Komunitas Belajar (Kombel)',
      targetPerbaikan: obs.targetPerbaikan || 'November 2026',
      tindakLanjut: obs.tindakLanjut || '',
      rekomendasi: obs.rekomendasi || ''
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingObs) return;

    updateObservasi({
      ...editingObs,
      statusTindakLanjut: formData.statusTindakLanjut,
      bentukPembinaan: formData.bentukPembinaan,
      targetPerbaikan: formData.targetPerbaikan,
      tindakLanjut: formData.tindakLanjut,
      rekomendasi: formData.rekomendasi
    });

    setEditingObs(null);
    showNotification('Data tindak lanjut & pembinaan berhasil diperbarui.');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <UserCheck className="w-4 h-4 text-emerald-600" />
            <span>Tindak Lanjut & Pembinaan Berkelanjutan</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitoring perkembangan guru pasca-supervisi, coaching klinis, dan Komunitas Belajar (Kombel)
          </p>
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="py-1.5 px-3 text-xs rounded-lg border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="">Semua Status Tindak Lanjut</option>
            <option value="Belum">Belum Dimulai</option>
            <option value="Dalam proses">Dalam Proses</option>
            <option value="Selesai">Selesai / Tuntas</option>
          </select>
        </div>
      </div>

      {/* Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredList.map(obs => {
          const status = obs.statusTindakLanjut || 'Dalam proses';
          return (
            <div key={obs.id} className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-slate-900 text-xs">{obs.namaGuru}</h3>
                    <p className="text-[11px] text-slate-500">{obs.mataPelajaran} • {obs.kelas}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                    status === 'Selesai'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : status === 'Dalam proses'
                      ? 'bg-slate-100 text-slate-700 border-slate-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {status}
                  </span>
                </div>

                <div className="mt-2.5 p-2.5 bg-slate-50 rounded-lg space-y-1.5 text-xs">
                  <div>
                    <span className="text-slate-400 font-medium block text-[10px] uppercase">Bentuk Pembinaan</span>
                    <p className="font-semibold text-slate-800 text-[11px]">{obs.bentukPembinaan || 'Diseminasi Komunitas Belajar (Kombel)'}</p>
                  </div>

                  <div>
                    <span className="text-slate-400 font-medium block text-[10px] uppercase">Rencana Tindak Lanjut</span>
                    <p className="text-slate-600 line-clamp-2 text-[11px]">{obs.tindakLanjut || 'Peningkatan modul ajar dan diferensiasi konten pembelajaran.'}</p>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500 border-t border-slate-200/60">
                    <span>Target: <strong className="text-slate-700">{obs.targetPerbaikan || 'November 2026'}</strong></span>
                    <span>Nilai: <strong className="text-emerald-700 font-bold">{obs.nilaiAkhir}</strong> ({obs.kategori})</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-1.5 pt-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    setSelectedObservasiId(obs.id);
                    setActiveTab('laporan');
                  }}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-xs transition-colors flex items-center space-x-1"
                >
                  <Printer className="w-3 h-3 text-slate-500" />
                  <span>Lihat Dokumen</span>
                </button>

                {canEdit && (
                  <button
                    onClick={() => handleOpenEdit(obs)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-xs transition-colors flex items-center space-x-1"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Update Status</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {filteredList.length === 0 && (
          <div className="col-span-2 py-10 text-center text-slate-400 text-xs bg-white rounded-xl border border-slate-200">
            Tidak ada data tindak lanjut yang sesuai filter.
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingObs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full border border-slate-200">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900">Perbarui Tindak Lanjut & Pembinaan</h3>
                <p className="text-[11px] text-slate-500">{editingObs.namaGuru}</p>
              </div>
              <button onClick={() => setEditingObs(null)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-4 space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Status Tindak Lanjut</label>
                <select
                  value={formData.statusTindakLanjut}
                  onChange={e => setFormData({ ...formData, statusTindakLanjut: e.target.value as any })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 font-semibold text-xs"
                >
                  <option value="Belum">Belum Dimulai</option>
                  <option value="Dalam proses">Dalam Proses</option>
                  <option value="Selesai">Selesai (Tuntas)</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Bentuk Pembinaan</label>
                <select
                  value={formData.bentukPembinaan}
                  onChange={e => setFormData({ ...formData, bentukPembinaan: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                >
                  <option value="Diseminasi Komunitas Belajar (Kombel)">Diseminasi Komunitas Belajar (Kombel)</option>
                  <option value="Coaching / Pendampingan Klinis">Coaching / Pendampingan Klinis</option>
                  <option value="Pelatihan / Workshop Internal">Pelatihan / Workshop Internal</option>
                  <option value="Peer Teaching (Tutor Teman Sejawat)">Peer Teaching (Tutor Teman Sejawat)</option>
                  <option value="Penugasan Khusus / Magang Industri">Penugasan Khusus / Magang Industri</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Rencana Tindak Lanjut</label>
                <textarea
                  rows={3}
                  value={formData.tindakLanjut}
                  onChange={e => setFormData({ ...formData, tindakLanjut: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Target Waktu Perbaikan</label>
                <input
                  type="text"
                  value={formData.targetPerbaikan}
                  onChange={e => setFormData({ ...formData, targetPerbaikan: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingObs(null)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-xs"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
