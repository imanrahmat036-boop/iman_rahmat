import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Guru, PROGRAM_KEAHLIAN_OPTIONS } from '../types';
import {
  Users,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Edit2,
  Trash2,
  Phone,
  Mail,
  CheckCircle2,
  X,
  AlertTriangle
} from 'lucide-react';

export const GuruView: React.FC = () => {
  const { guruList, addGuru, updateGuru, deleteGuru, currentUser, showNotification } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterProdi, setFilterProdi] = useState('');
  const [filterMapel, setFilterMapel] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGuru, setEditingGuru] = useState<Guru | null>(null);
  const [guruToDelete, setGuruToDelete] = useState<Guru | null>(null);

  // Form State
  const [formData, setFormData] = useState<Omit<Guru, 'id'>>({
    nip: '',
    nuptk: '',
    nama: '',
    jenisKelamin: 'L',
    mataPelajaran: '',
    programKeahlian: 'Desain Komunikasi Visual (DKV)',
    kelas: '',
    fase: 'F',
    email: '',
    noHp: '',
    status: 'Aktif'
  });

  const canEdit = currentUser.role === 'ADMIN' || currentUser.role === 'KEPALA_SEKOLAH' || currentUser.role === 'SUPERVISOR';

  // Filtered Guru List
  const filteredGuru = useMemo(() => {
    return guruList.filter(g => {
      const matchSearch =
        g.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.nip.includes(searchTerm) ||
        g.nuptk.includes(searchTerm) ||
        g.mataPelajaran.toLowerCase().includes(searchTerm.toLowerCase());

      const matchProdi = !filterProdi || g.programKeahlian.includes(filterProdi);
      const matchMapel = !filterMapel || g.mataPelajaran === filterMapel;

      return matchSearch && matchProdi && matchMapel;
    });
  }, [guruList, searchTerm, filterProdi, filterMapel]);

  // Unique lists for filter dropdowns
  const prodiOptions = Array.from(new Set(guruList.map(g => g.programKeahlian)));
  const mapelOptions = Array.from(new Set(guruList.map(g => g.mataPelajaran)));

  const handleOpenAddModal = () => {
    setEditingGuru(null);
    setFormData({
      nip: '',
      nuptk: '',
      nama: '',
      jenisKelamin: 'L',
      mataPelajaran: '',
      programKeahlian: 'Desain Komunikasi Visual (DKV)',
      kelas: '',
      fase: 'F',
      email: '',
      noHp: '',
      status: 'Aktif'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (guru: Guru) => {
    setEditingGuru(guru);
    setFormData({
      nip: guru.nip,
      nuptk: guru.nuptk,
      nama: guru.nama,
      jenisKelamin: guru.jenisKelamin,
      mataPelajaran: guru.mataPelajaran,
      programKeahlian: guru.programKeahlian,
      kelas: guru.kelas,
      fase: guru.fase,
      email: guru.email,
      noHp: guru.noHp,
      status: guru.status
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama || !formData.mataPelajaran) {
      showNotification('Nama Guru dan Mata Pelajaran wajib diisi!', 'error');
      return;
    }

    if (editingGuru) {
      const res = updateGuru({ ...formData, id: editingGuru.id });
      if (res.success) setIsModalOpen(false);
    } else {
      const res = addGuru(formData);
      if (res.success) setIsModalOpen(false);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['ID Guru,NIP,NUPTK,Nama Guru,Jenis Kelamin,Mata Pelajaran,Program Keahlian,Kelas,Fase,Email,No HP,Status'];
    const rows = guruList.map(g => 
      `"${g.id}","${g.nip}","${g.nuptk}","${g.nama}","${g.jenisKelamin}","${g.mataPelajaran}","${g.programKeahlian}","${g.kelas}","${g.fase}","${g.email}","${g.noHp}","${g.status}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DATA_GURU_SMKN_BOJONGGAMBIR_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('Data guru berhasil diekspor ke format CSV.');
  };

  // Quick Mock Import CSV file
  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (!content) return;
      
      const lines = content.split('\n');
      let countAdded = 0;
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const parts = line.split(',').map(s => s.replace(/^"|"$/g, '').trim());
        if (parts.length >= 4 && parts[3]) {
          addGuru({
            nip: parts[1] || '-',
            nuptk: parts[2] || '-',
            nama: parts[3],
            jenisKelamin: (parts[4] === 'P' ? 'P' : 'L'),
            mataPelajaran: parts[5] || 'Mata Pelajaran Kejuruan',
            programKeahlian: parts[6] || 'Semua Program Keahlian',
            kelas: parts[7] || 'X / XI',
            fase: parts[8] === 'E' ? 'E' : 'F',
            email: parts[9] || '-',
            noHp: parts[10] || '-',
            status: 'Aktif'
          });
          countAdded++;
        }
      }
      showNotification(`Import selesai: ${countAdded} data guru ditambahkan.`);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <Users className="w-5 h-5 text-emerald-600" />
            <span>Data Pendidik & Tenaga Pendidik</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar guru pengampu Kurikulum Merdeka SMK Negeri Bojonggambir
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Export Button */}
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium shadow-xs transition-colors"
            title="Download CSV untuk Excel / Spreadsheet"
          >
            <Download className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
            Export CSV
          </button>

          {/* Import Button */}
          {canEdit && (
            <label className="inline-flex items-center px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium shadow-xs transition-colors cursor-pointer">
              <Upload className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
              Import CSV
              <input type="file" accept=".csv" className="hidden" onChange={handleImportCSV} />
            </label>
          )}

          {/* Add Guru Button */}
          {canEdit && (
            <button
              id="btn-add-guru"
              onClick={handleOpenAddModal}
              className="inline-flex items-center px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Tambah Guru
            </button>
          )}
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama, NIP, NUPTK, atau mapel..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        {/* Filter Program Keahlian */}
        <div>
          <select
            value={filterProdi}
            onChange={e => setFilterProdi(e.target.value)}
            className="w-full py-1.5 px-3 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          >
            <option value="">Semua Program Keahlian</option>
            {prodiOptions.map((prodi, idx) => (
              <option key={idx} value={prodi}>{prodi}</option>
            ))}
          </select>
        </div>

        {/* Filter Mata Pelajaran */}
        <div>
          <select
            value={filterMapel}
            onChange={e => setFilterMapel(e.target.value)}
            className="w-full py-1.5 px-3 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          >
            <option value="">Semua Mata Pelajaran</option>
            {mapelOptions.map((mapel, idx) => (
              <option key={idx} value={mapel}>{mapel}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Guru Table List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Menampilkan <strong>{filteredGuru.length}</strong> dari {guruList.length} guru</span>
          <span className="font-medium text-slate-400">SMK Negeri Bojonggambir</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-2.5 px-4">Nama & NIP</th>
                <th className="py-2.5 px-4">Mata Pelajaran</th>
                <th className="py-2.5 px-4">Program Keahlian</th>
                <th className="py-2.5 px-4">Kelas & Fase</th>
                <th className="py-2.5 px-4">Kontak</th>
                <th className="py-2.5 px-4">Status</th>
                {canEdit && <th className="py-2.5 px-4 text-right">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredGuru.map(guru => (
                <tr key={guru.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-2.5 px-4">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center text-xs border border-emerald-200">
                        {guru.nama.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{guru.nama}</p>
                        <p className="text-[11px] text-slate-500">
                          NIP: {guru.nip} • NUPTK: {guru.nuptk}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 px-4 font-medium text-slate-700">
                    {guru.mataPelajaran}
                  </td>
                  <td className="py-2.5 px-4 text-slate-600">
                    <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-[11px] font-medium text-slate-700 border border-slate-200">
                      {guru.programKeahlian}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-slate-600">
                    <span className="font-medium">{guru.kelas}</span>
                    <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                      Fase {guru.fase}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-slate-600 space-y-0.5">
                    {guru.email && (
                      <div className="flex items-center text-[11px] text-slate-500">
                        <Mail className="w-3 h-3 mr-1 text-slate-400" />
                        <span className="truncate max-w-[150px]">{guru.email}</span>
                      </div>
                    )}
                    {guru.noHp && (
                      <div className="flex items-center text-[11px] text-slate-500">
                        <Phone className="w-3 h-3 mr-1 text-slate-400" />
                        <span>{guru.noHp}</span>
                      </div>
                    )}
                  </td>
                  <td className="py-2.5 px-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${
                      guru.status === 'Aktif'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {guru.status}
                    </span>
                  </td>
                  {canEdit && (
                    <td className="py-2.5 px-4 text-right space-x-1">
                      <button
                        onClick={() => handleOpenEditModal(guru)}
                        className="p-1 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                        title="Edit Data Guru"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setGuruToDelete(guru)}
                        className="p-1 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                        title="Hapus Data Guru"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}

              {filteredGuru.length === 0 && (
                <tr>
                  <td colSpan={canEdit ? 7 : 6} className="py-10 text-center text-slate-400 text-xs">
                    Tidak ditemukan data guru yang sesuai dengan kata kunci atau filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah / Edit Guru */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto border border-slate-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                {editingGuru ? 'Edit Data Guru' : 'Tambah Data Guru Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nama Lengkap & Gelar <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Iman Rahmat, S.Kom., Gr."
                    value={formData.nama}
                    onChange={e => setFormData({ ...formData, nama: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jenis Kelamin</label>
                  <select
                    value={formData.jenisKelamin}
                    onChange={e => setFormData({ ...formData, jenisKelamin: e.target.value as 'L' | 'P' })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="L">Laki-laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">NIP</label>
                  <input
                    type="text"
                    placeholder="198906142019031008"
                    value={formData.nip}
                    onChange={e => setFormData({ ...formData, nip: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">NUPTK</label>
                  <input
                    type="text"
                    placeholder="4532767668130092"
                    value={formData.nuptk}
                    onChange={e => setFormData({ ...formData, nuptk: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Mata Pelajaran <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Administrasi Infrastruktur Jaringan"
                    value={formData.mataPelajaran}
                    onChange={e => setFormData({ ...formData, mataPelajaran: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
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
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Kelas yang Diampu</label>
                  <input
                    type="text"
                    placeholder="XI DKV 1, XI DKV 2 atau XI APHP 1"
                    value={formData.kelas}
                    onChange={e => setFormData({ ...formData, kelas: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Fase Kurikulum</label>
                  <select
                    value={formData.fase}
                    onChange={e => setFormData({ ...formData, fase: e.target.value as 'E' | 'F' })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="E">Fase E (Kelas X)</option>
                    <option value="F">Fase F (Kelas XI - XII)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Belajar.id / Sekolah</label>
                  <input
                    type="email"
                    placeholder="iman.rahmat@guru.smk.belajar.id"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">No. WhatsApp / HP</label>
                  <input
                    type="text"
                    placeholder="081234567890"
                    value={formData.noHp}
                    onChange={e => setFormData({ ...formData, noHp: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
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
                  {editingGuru ? 'Simpan Perubahan' : 'Tambah Guru'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {guruToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full border border-slate-200 shadow-xl space-y-4 text-xs">
            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="text-center">
              <h3 className="text-sm font-bold text-slate-900">Konfirmasi Hapus Guru</h3>
              <p className="text-slate-500 mt-1">
                Apakah Anda yakin ingin menghapus data <strong>{guruToDelete.nama}</strong>? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            <div className="flex space-x-2 pt-2">
              <button
                onClick={() => setGuruToDelete(null)}
                className="flex-1 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 font-semibold text-slate-700"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  deleteGuru(guruToDelete.id);
                  setGuruToDelete(null);
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
