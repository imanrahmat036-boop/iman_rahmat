import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Observasi, KategoriNilai } from '../types';
import {
  Award,
  Search,
  Filter,
  Printer,
  Edit2,
  Trash2,
  FileText,
  Eye,
  Download,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const HasilView: React.FC = () => {
  const {
    observasiList,
    deleteObservasi,
    setSelectedObservasiId,
    setActiveTab,
    currentUser,
    showNotification
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterKategori, setFilterKategori] = useState<string>('');
  const [obsToDelete, setObsToDelete] = useState<Observasi | null>(null);

  const canEdit = currentUser.role === 'ADMIN' || currentUser.role === 'KEPALA_SEKOLAH' || currentUser.role === 'SUPERVISOR';

  const filteredObservasi = useMemo(() => {
    return observasiList.filter(obs => {
      // Guru only sees their own observations
      if (currentUser.role === 'GURU' && currentUser.nama && !obs.namaGuru.includes(currentUser.nama)) {
        return false;
      }

      const matchSearch =
        obs.namaGuru.toLowerCase().includes(searchTerm.toLowerCase()) ||
        obs.mataPelajaran.toLowerCase().includes(searchTerm.toLowerCase()) ||
        obs.supervisor.toLowerCase().includes(searchTerm.toLowerCase());

      const matchKategori = !filterKategori || obs.kategori === filterKategori;
      return matchSearch && matchKategori;
    });
  }, [observasiList, searchTerm, filterKategori, currentUser]);

  const handleOpenLaporan = (id: string) => {
    setSelectedObservasiId(id);
    setActiveTab('laporan');
  };

  const handleExportRekapCSV = () => {
    const headers = ['ID Observasi,Tanggal,Nama Guru,NIP,Mata Pelajaran,Kelas,Fase,Supervisor,Skor Total,Skor Maks,Nilai Akhir,Kategori,Status Tindak Lanjut'];
    const rows = observasiList.map(o =>
      `"${o.id}","${o.tanggalObservasi}","${o.namaGuru}","${o.nipGuru}","${o.mataPelajaran}","${o.kelas}","${o.fase}","${o.supervisor}","${o.skorTotal}","${o.skorMaksimal}","${o.nilaiAkhir}","${o.kategori}","${o.statusTindakLanjut}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `REKAP_HASIL_SUPERVISI_SMKN_BOJONGGAMBIR_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('Rekap data hasil supervisi berhasil diekspor ke CSV.');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <Award className="w-4 h-4 text-emerald-600" />
            <span>Rekap Hasil Supervisi Pembelajaran</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar evaluasi kinerja guru, skor akhir, predikat, dan tindak lanjut
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportRekapCSV}
            className="inline-flex items-center px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
            Export Rekap CSV
          </button>
          {canEdit && (
            <button
              onClick={() => setActiveTab('observasi')}
              className="inline-flex items-center px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Sparkles className="w-4 h-4 mr-1.5" />
              Observasi Baru
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative md:col-span-2">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari guru, mata pelajaran, atau supervisor penilai..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        <div>
          <select
            value={filterKategori}
            onChange={e => setFilterKategori(e.target.value)}
            className="w-full py-1.5 px-3 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
          >
            <option value="">Semua Kategori Nilai</option>
            <option value="Sangat Baik">Sangat Baik (91 - 100)</option>
            <option value="Baik">Baik (81 - 90)</option>
            <option value="Cukup">Cukup (71 - 80)</option>
            <option value="Perlu Pembinaan">Perlu Pembinaan (≤ 70)</option>
          </select>
        </div>
      </div>

      {/* Table Rekap Hasil */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-2.5 px-3.5">Guru & Tanggal</th>
                <th className="py-2.5 px-3.5">Mata Pelajaran & Kelas</th>
                <th className="py-2.5 px-3.5">Skor & Nilai Akhir</th>
                <th className="py-2.5 px-3.5">Kategori Predikat</th>
                <th className="py-2.5 px-3.5">Tindak Lanjut</th>
                <th className="py-2.5 px-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredObservasi.map(obs => (
                <tr key={obs.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-2.5 px-3.5">
                    <p className="font-semibold text-slate-900">{obs.namaGuru}</p>
                    <p className="text-[11px] text-slate-500">
                      {obs.tanggalObservasi} • Spv: {obs.supervisor}
                    </p>
                  </td>
                  <td className="py-2.5 px-3.5">
                    <p className="font-medium text-slate-800">{obs.mataPelajaran}</p>
                    <p className="text-[11px] text-slate-500">
                      {obs.kelas} • Fase {obs.fase}
                    </p>
                  </td>
                  <td className="py-2.5 px-3.5">
                    <div className="flex items-baseline space-x-1.5">
                      <span className="text-sm font-extrabold text-emerald-700">{obs.nilaiAkhir}</span>
                      <span className="text-[11px] text-slate-400">
                        ({obs.skorTotal}/{obs.skorMaksimal})
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold border ${
                      obs.kategori === 'Sangat Baik'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : obs.kategori === 'Baik'
                        ? 'bg-slate-100 text-slate-700 border-slate-200'
                        : obs.kategori === 'Cukup'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}>
                      {obs.kategori}
                    </span>
                  </td>
                  <td className="py-2.5 px-3.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${
                      obs.statusTindakLanjut === 'Selesai'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {obs.statusTindakLanjut || 'Dalam proses'}
                    </span>
                    <p className="text-[10px] text-slate-500 mt-0.5 truncate max-w-[150px]">
                      {obs.bentukPembinaan || 'Diseminasi Kombel'}
                    </p>
                  </td>
                  <td className="py-2.5 px-3.5 text-right space-x-1">
                    <button
                      onClick={() => handleOpenLaporan(obs.id)}
                      className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-[11px] transition-colors border border-slate-200"
                      title="Lihat Detail & Cetak Laporan Resmi"
                    >
                      <Printer className="w-3 h-3 mr-1 text-slate-500" />
                      Laporan
                    </button>
                    {canEdit && (
                      <button
                        onClick={() => setObsToDelete(obs)}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                        title="Hapus Hasil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              {filteredObservasi.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-400 text-xs">
                    Tidak ditemukan data hasil supervisi yang sesuai.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Modal */}
      {obsToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl p-5 max-w-sm w-full border border-slate-200 shadow-xl space-y-4 text-xs">
            <div className="w-9 h-9 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div className="text-center">
              <h3 className="text-xs font-bold text-slate-900">Hapus Data Supervisi</h3>
              <p className="text-slate-500 mt-1">
                Apakah Anda yakin ingin menghapus hasil observasi guru <strong>{obsToDelete.namaGuru}</strong>?
              </p>
            </div>
            <div className="flex space-x-2 pt-2">
              <button
                onClick={() => setObsToDelete(null)}
                className="flex-1 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 font-medium text-slate-700 text-xs"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  deleteObservasi(obsToDelete.id);
                  setObsToDelete(null);
                }}
                className="flex-1 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow-xs"
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
