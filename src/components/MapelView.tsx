import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Mapel, PROGRAM_KEAHLIAN_OPTIONS } from '../types';
import { BookOpen, Plus, Search, Edit2, Trash2, X, AlertTriangle } from 'lucide-react';

export const MapelView: React.FC = () => {
  const { mapelList, addMapel, updateMapel, deleteMapel, currentUser, showNotification } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterKelompok, setFilterKelompok] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMapel, setEditingMapel] = useState<Mapel | null>(null);
  const [mapelToDelete, setMapelToDelete] = useState<Mapel | null>(null);

  const [formData, setFormData] = useState<Omit<Mapel, 'id'>>({
    mataPelajaran: '',
    kelompok: 'Kejuruan',
    programKeahlian: 'Desain Komunikasi Visual (DKV)',
    fase: 'F',
    status: 'Aktif'
  });

  const canEdit = currentUser.role === 'ADMIN' || currentUser.role === 'KEPALA_SEKOLAH' || currentUser.role === 'SUPERVISOR';

  const filteredMapel = useMemo(() => {
    return mapelList.filter(m => {
      const matchSearch =
        m.mataPelajaran.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.programKeahlian.toLowerCase().includes(searchTerm.toLowerCase());
      const matchKelompok = !filterKelompok || m.kelompok === filterKelompok;
      return matchSearch && matchKelompok;
    });
  }, [mapelList, searchTerm, filterKelompok]);

  const handleOpenAdd = () => {
    setEditingMapel(null);
    setFormData({
      mataPelajaran: '',
      kelompok: 'Kejuruan',
      programKeahlian: 'Desain Komunikasi Visual (DKV)',
      fase: 'F',
      status: 'Aktif'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (m: Mapel) => {
    setEditingMapel(m);
    setFormData({
      mataPelajaran: m.mataPelajaran,
      kelompok: m.kelompok,
      programKeahlian: m.programKeahlian,
      fase: m.fase,
      status: m.status
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.mataPelajaran) {
      showNotification('Nama Mata Pelajaran wajib diisi!', 'error');
      return;
    }
    if (editingMapel) {
      updateMapel({ ...formData, id: editingMapel.id });
    } else {
      addMapel(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            <span>Mata Pelajaran Kurikulum Merdeka</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelompok Umum, Kejuruan, dan Pilihan SMK Negeri Bojonggambir
          </p>
        </div>

        {canEdit && (
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Tambah Mapel
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari mata pelajaran atau program keahlian..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        <div>
          <select
            value={filterKelompok}
            onChange={e => setFilterKelompok(e.target.value)}
            className="w-full py-1.5 px-3 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          >
            <option value="">Semua Kelompok Mapel</option>
            <option value="Kejuruan">Kejuruan (Konsentrasi)</option>
            <option value="Umum">Umum (Normada)</option>
            <option value="Pilihan">Pilihan</option>
            <option value="Muatan Lokal">Muatan Lokal</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-2.5 px-4">ID</th>
                <th className="py-2.5 px-4">Mata Pelajaran</th>
                <th className="py-2.5 px-4">Kelompok</th>
                <th className="py-2.5 px-4">Program Keahlian</th>
                <th className="py-2.5 px-4">Fase</th>
                <th className="py-2.5 px-4">Status</th>
                {canEdit && <th className="py-2.5 px-4 text-right">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMapel.map(m => (
                <tr key={m.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-2.5 px-4 font-mono font-semibold text-slate-500">{m.id}</td>
                  <td className="py-2.5 px-4 font-semibold text-slate-900">{m.mataPelajaran}</td>
                  <td className="py-2.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      m.kelompok === 'Kejuruan'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : m.kelompok === 'Umum'
                        ? 'bg-slate-100 text-slate-700 border-slate-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {m.kelompok}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-slate-600">{m.programKeahlian}</td>
                  <td className="py-2.5 px-4">
                    <span className="font-bold text-slate-700">Fase {m.fase}</span>
                  </td>
                  <td className="py-2.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {m.status}
                    </span>
                  </td>
                  {canEdit && (
                    <td className="py-2.5 px-4 text-right space-x-1">
                      <button
                        onClick={() => handleOpenEdit(m)}
                        className="p-1 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setMapelToDelete(m)}
                        className="p-1 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full border border-slate-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                {editingMapel ? 'Edit Mata Pelajaran' : 'Tambah Mata Pelajaran'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Mata Pelajaran <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Administrasi Infrastruktur Jaringan"
                  value={formData.mataPelajaran}
                  onChange={e => setFormData({ ...formData, mataPelajaran: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kelompok</label>
                  <select
                    value={formData.kelompok}
                    onChange={e => setFormData({ ...formData, kelompok: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="Kejuruan">Kejuruan</option>
                    <option value="Umum">Umum</option>
                    <option value="Pilihan">Pilihan</option>
                    <option value="Muatan Lokal">Muatan Lokal</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Fase Kurikulum</label>
                  <select
                    value={formData.fase}
                    onChange={e => setFormData({ ...formData, fase: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="E">Fase E</option>
                    <option value="F">Fase F</option>
                    <option value="E & F">Fase E & F</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Program Keahlian</label>
                <select
                  value={formData.programKeahlian}
                  onChange={e => setFormData({ ...formData, programKeahlian: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  {PROGRAM_KEAHLIAN_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                  {formData.programKeahlian && !PROGRAM_KEAHLIAN_OPTIONS.includes(formData.programKeahlian as any) && (
                    <option value={formData.programKeahlian}>{formData.programKeahlian}</option>
                  )}
                </select>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-xs"
                >
                  {editingMapel ? 'Simpan Perubahan' : 'Tambah Mapel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {mapelToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full border border-slate-200 shadow-xl space-y-4 text-xs">
            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="text-center">
              <h3 className="text-sm font-bold text-slate-900">Hapus Mata Pelajaran</h3>
              <p className="text-slate-500 mt-1">
                Hapus mata pelajaran <strong>{mapelToDelete.mataPelajaran}</strong>?
              </p>
            </div>
            <div className="flex space-x-2 pt-2">
              <button
                onClick={() => setMapelToDelete(null)}
                className="flex-1 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 font-semibold text-slate-700"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  deleteMapel(mapelToDelete.id);
                  setMapelToDelete(null);
                }}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-xs"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
