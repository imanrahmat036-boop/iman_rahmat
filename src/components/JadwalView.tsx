import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { JadwalSupervisi, JadwalStatus } from '../types';
import {
  CalendarDays,
  Plus,
  Search,
  Filter,
  Sparkles,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  X,
  UserCheck
} from 'lucide-react';

export const JadwalView: React.FC = () => {
  const {
    jadwalList,
    guruList,
    addJadwal,
    updateJadwal,
    deleteJadwal,
    updateJadwalStatus,
    setSelectedJadwalForObs,
    setActiveTab,
    currentUser,
    showNotification
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJadwal, setEditingJadwal] = useState<JadwalSupervisi | null>(null);
  const [jadwalToDelete, setJadwalToDelete] = useState<JadwalSupervisi | null>(null);

  const canManage = currentUser.role === 'ADMIN' || currentUser.role === 'KEPALA_SEKOLAH' || currentUser.role === 'SUPERVISOR';

  const [formData, setFormData] = useState<Omit<JadwalSupervisi, 'id'>>({
    tanggal: new Date().toISOString().slice(0, 10),
    jam: '08:00 - 09:30',
    guruId: guruList[0]?.id || '',
    namaGuru: guruList[0]?.nama || '',
    mataPelajaran: guruList[0]?.mataPelajaran || '',
    kelas: guruList[0]?.kelas || '',
    fase: (guruList[0]?.fase || 'F') as 'E' | 'F',
    supervisor: 'Drs. H. Dadang Suryana, M.Pd.',
    status: 'Terjadwal',
    keterangan: 'Supervisi Pembelajaran Kurikulum Merdeka'
  });

  const filteredJadwal = useMemo(() => {
    return jadwalList.filter(j => {
      // Guru role sees only their own schedule
      if (currentUser.role === 'GURU' && currentUser.nama && !j.namaGuru.includes(currentUser.nama)) {
        return false;
      }

      const matchSearch =
        j.namaGuru.toLowerCase().includes(searchTerm.toLowerCase()) ||
        j.mataPelajaran.toLowerCase().includes(searchTerm.toLowerCase()) ||
        j.supervisor.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = !filterStatus || j.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [jadwalList, searchTerm, filterStatus, currentUser]);

  const handleGuruChange = (guruId: string) => {
    const selectedGuru = guruList.find(g => g.id === guruId);
    if (selectedGuru) {
      setFormData(prev => ({
        ...prev,
        guruId: selectedGuru.id,
        namaGuru: selectedGuru.nama,
        mataPelajaran: selectedGuru.mataPelajaran,
        kelas: selectedGuru.kelas,
        fase: selectedGuru.fase
      }));
    }
  };

  const handleOpenAdd = () => {
    setEditingJadwal(null);
    const defaultGuru = guruList[0];
    setFormData({
      tanggal: new Date().toISOString().slice(0, 10),
      jam: '08:00 - 09:30',
      guruId: defaultGuru?.id || '',
      namaGuru: defaultGuru?.nama || '',
      mataPelajaran: defaultGuru?.mataPelajaran || '',
      kelas: defaultGuru?.kelas || '',
      fase: (defaultGuru?.fase || 'F') as 'E' | 'F',
      supervisor: currentUser.nama || 'Drs. H. Dadang Suryana, M.Pd.',
      status: 'Terjadwal',
      keterangan: 'Supervisi Pembelajaran Kurikulum Merdeka'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (j: JadwalSupervisi) => {
    setEditingJadwal(j);
    setFormData({
      tanggal: j.tanggal,
      jam: j.jam,
      guruId: j.guruId,
      namaGuru: j.namaGuru,
      mataPelajaran: j.mataPelajaran,
      kelas: j.kelas,
      fase: j.fase,
      supervisor: j.supervisor,
      status: j.status,
      keterangan: j.keterangan
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.namaGuru || !formData.tanggal || !formData.jam) {
      showNotification('Nama Guru, Tanggal, dan Jam wajib diisi!', 'error');
      return;
    }

    if (editingJadwal) {
      updateJadwal({ ...formData, id: editingJadwal.id });
    } else {
      addJadwal(formData);
    }
    setIsModalOpen(false);
  };

  const handleStartObservasi = (j: JadwalSupervisi) => {
    setSelectedJadwalForObs(j);
    setActiveTab('observasi');
  };

  const getStatusBadge = (status: JadwalStatus) => {
    switch (status) {
      case 'Selesai':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800"><CheckCircle2 className="w-3 h-3 mr-1" /> Selesai</span>;
      case 'Terjadwal':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800"><Clock className="w-3 h-3 mr-1" /> Terjadwal</span>;
      case 'Ditunda':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800"><AlertCircle className="w-3 h-3 mr-1" /> Ditunda</span>;
      case 'Dibatalkan':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800"><XCircle className="w-3 h-3 mr-1" /> Dibatalkan</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <CalendarDays className="w-5 h-5 text-emerald-600" />
            <span>Jadwal Supervisi Pembelajaran</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Perencanaan observasi kelas Kurikulum Merdeka SMK Negeri Bojonggambir
          </p>
        </div>

        {canManage && (
          <button
            id="btn-buat-jadwal"
            onClick={handleOpenAdd}
            className="inline-flex items-center px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Buat Jadwal Baru
          </button>
        )}
      </div>

      {/* Filter and Search */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative md:col-span-2">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari guru, mata pelajaran, atau supervisor..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        <div>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="w-full py-1.5 px-3 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          >
            <option value="">Semua Status Jadwal</option>
            <option value="Terjadwal">Terjadwal</option>
            <option value="Selesai">Selesai</option>
            <option value="Ditunda">Ditunda</option>
            <option value="Dibatalkan">Dibatalkan</option>
          </select>
        </div>
      </div>

      {/* Jadwal Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-2.5 px-4">Tanggal & Jam</th>
                <th className="py-2.5 px-4">Guru & Mapel</th>
                <th className="py-2.5 px-4">Kelas & Fase</th>
                <th className="py-2.5 px-4">Supervisor</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredJadwal.map(j => (
                <tr key={j.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-2.5 px-4">
                    <p className="font-semibold text-slate-900">{j.tanggal}</p>
                    <p className="text-[11px] text-emerald-700 font-medium">{j.jam} WIB</p>
                  </td>
                  <td className="py-2.5 px-4">
                    <p className="font-semibold text-slate-900">{j.namaGuru}</p>
                    <p className="text-[11px] text-slate-500 truncate max-w-[220px]">{j.mataPelajaran}</p>
                  </td>
                  <td className="py-2.5 px-4 text-slate-700">
                    <p className="font-medium">{j.kelas}</p>
                    <span className="inline-block text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-bold border border-slate-200">
                      Fase {j.fase}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-slate-700 font-medium">
                    {j.supervisor}
                  </td>
                  <td className="py-2.5 px-4">
                    {canManage ? (
                      <select
                        value={j.status}
                        onChange={e => updateJadwalStatus(j.id, e.target.value as JadwalStatus)}
                        className="text-[11px] font-semibold py-1 px-2 rounded-md border border-slate-200 bg-white"
                      >
                        <option value="Terjadwal">Terjadwal</option>
                        <option value="Selesai">Selesai</option>
                        <option value="Ditunda">Ditunda</option>
                        <option value="Dibatalkan">Dibatalkan</option>
                      </select>
                    ) : (
                      getStatusBadge(j.status)
                    )}
                  </td>
                  <td className="py-2.5 px-4 text-right space-x-1.5">
                    {canManage && (
                      <button
                        onClick={() => handleStartObservasi(j)}
                        className="inline-flex items-center px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[11px] shadow-xs transition-colors"
                        title="Buka Form Observasi Kelas Langsung"
                      >
                        <Sparkles className="w-3 h-3 mr-1" />
                        Observasi
                      </button>
                    )}
                    {canManage && (
                      <>
                        <button
                          onClick={() => handleOpenEdit(j)}
                          className="p-1 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                          title="Edit Jadwal"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setJadwalToDelete(j)}
                          className="p-1 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                          title="Hapus Jadwal"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}

              {filteredJadwal.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-400 text-xs">
                    Tidak ada jadwal supervisi yang sesuai.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah/Edit Jadwal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full border border-slate-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                {editingJadwal ? 'Edit Jadwal Supervisi' : 'Buat Jadwal Supervisi Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Pilih Guru yang Disupervisi <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.guruId}
                  onChange={e => handleGuruChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                >
                  {guruList.map(g => (
                    <option key={g.id} value={g.id}>
                      {g.nama} — {g.mataPelajaran} ({g.kelas})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mata Pelajaran</label>
                  <input
                    type="text"
                    required
                    value={formData.mataPelajaran}
                    onChange={e => setFormData({ ...formData, mataPelajaran: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kelas & Fase</label>
                  <div className="flex space-x-1.5">
                    <input
                      type="text"
                      required
                      placeholder="XI TJKT 1"
                      value={formData.kelas}
                      onChange={e => setFormData({ ...formData, kelas: e.target.value })}
                      className="w-2/3 px-3 py-2 rounded-xl border border-slate-200"
                    />
                    <select
                      value={formData.fase}
                      onChange={e => setFormData({ ...formData, fase: e.target.value as 'E' | 'F' })}
                      className="w-1/3 px-2 py-2 rounded-xl border border-slate-200"
                    >
                      <option value="E">Fase E</option>
                      <option value="F">Fase F</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Tanggal Supervisi <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.tanggal}
                    onChange={e => setFormData({ ...formData, tanggal: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Jam Pembelajaran <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="08:00 - 09:30"
                    value={formData.jam}
                    onChange={e => setFormData({ ...formData, jam: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Supervisor</label>
                <input
                  type="text"
                  required
                  placeholder="Drs. H. Dadang Suryana, M.Pd."
                  value={formData.supervisor}
                  onChange={e => setFormData({ ...formData, supervisor: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status Awal</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as JadwalStatus })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  >
                    <option value="Terjadwal">Terjadwal</option>
                    <option value="Selesai">Selesai</option>
                    <option value="Ditunda">Ditunda</option>
                    <option value="Dibatalkan">Dibatalkan</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Keterangan / Fokus</label>
                  <input
                    type="text"
                    placeholder="PjBL / Praktikum Bengkel"
                    value={formData.keterangan}
                    onChange={e => setFormData({ ...formData, keterangan: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
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
                  {editingJadwal ? 'Simpan Perubahan' : 'Buat Jadwal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {jadwalToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full border border-slate-200 shadow-xl space-y-4 text-xs">
            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="text-center">
              <h3 className="text-sm font-bold text-slate-900">Hapus Jadwal Supervisi</h3>
              <p className="text-slate-500 mt-1">
                Hapus jadwal supervisi untuk <strong>{jadwalToDelete.namaGuru}</strong> pada tanggal {jadwalToDelete.tanggal}?
              </p>
            </div>
            <div className="flex space-x-2 pt-2">
              <button
                onClick={() => setJadwalToDelete(null)}
                className="flex-1 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 font-semibold text-slate-700"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  deleteJadwal(jadwalToDelete.id);
                  setJadwalToDelete(null);
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
