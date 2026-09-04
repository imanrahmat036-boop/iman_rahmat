import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { INSTRUMEN_ASPEK } from '../data/instrumentData';
import { Printer, Download, ArrowLeft, CheckCircle2, Award, Calendar, School, User } from 'lucide-react';

export const LaporanView: React.FC = () => {
  const {
    observasiList,
    guruList,
    selectedObservasiId,
    setSelectedObservasiId,
    setActiveTab
  } = useApp();

  const [mode, setMode] = useState<'individu' | 'rekap'>('individu');

  const selectedObs = observasiList.find(o => o.id === selectedObservasiId) || observasiList[0];
  const matchedGuru = guruList.find(g => g.nama === selectedObs?.namaGuru);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Top Controls Bar (Hidden during Print) */}
      <div className="print:hidden bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setActiveTab('hasil')}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
            title="Kembali ke Rekap Hasil"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-xs font-bold text-slate-900">Format Dokumen Cetak & PDF Laporan Supervisi</h2>
            <p className="text-[11px] text-slate-500">Standar resmi administrasi Kurikulum Merdeka SMK Negeri Bojonggambir</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Mode Switcher */}
          <div className="flex bg-slate-100 p-0.5 rounded-lg">
            <button
              onClick={() => setMode('individu')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                mode === 'individu' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Laporan Individu Guru
            </button>
            <button
              onClick={() => setMode('rekap')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                mode === 'rekap' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Rekapitulasi Sekolah
            </button>
          </div>

          {mode === 'individu' && (
            <select
              value={selectedObs?.id || ''}
              onChange={e => setSelectedObservasiId(e.target.value)}
              className="py-1.5 px-3 text-xs rounded-lg border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-emerald-500/20"
            >
              {observasiList.map(o => (
                <option key={o.id} value={o.id}>
                  {o.namaGuru} ({o.mataPelajaran}) - {o.nilaiAkhir}
                </option>
              ))}
            </select>
          )}

          <button
            id="btn-cetak-laporan"
            onClick={handlePrint}
            className="inline-flex items-center px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5 mr-1.5" />
            Cetak / Simpan PDF
          </button>
        </div>
      </div>

      {/* Printable Sheet Area */}
      <div className="bg-white p-8 sm:p-12 rounded-2xl border border-slate-200 shadow-sm max-w-4xl mx-auto print:border-none print:shadow-none print:p-0 print:m-0 text-slate-900 font-serif">
        
        {/* KOP SURAT RESMI */}
        <div className="border-b-4 border-double border-slate-900 pb-3 mb-6 text-center relative">
          <div className="flex items-center justify-center space-x-4 mb-1">
            <div className="w-16 h-16 shrink-0 flex items-center justify-center border-2 border-slate-800 rounded-lg p-1">
              <School className="w-12 h-12 text-slate-800" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold tracking-wider uppercase">
                PEMERINTAH DAERAH PROVINSI JAWA BARAT
              </h4>
              <h4 className="text-xs sm:text-sm font-bold tracking-wider uppercase">
                DINAS PENDIDIKAN
              </h4>
              <h3 className="text-sm sm:text-base font-bold tracking-wider uppercase">
                CABANG DINAS PENDIDIKAN WILAYAH XII
              </h3>
              <h2 className="text-base sm:text-xl font-black tracking-widest uppercase">
                SMK NEGERI BOJONGGAMBIR
              </h2>
              <p className="text-[10px] font-sans text-slate-600 mt-0.5">
                Jl. Raya Bojonggambir, Kec. Bojonggambir, Kab. Tasikmalaya, Jawa Barat 46188
                <br />
                Laman: www.smknbojonggambir.sch.id • Pos-el: info@smknbojonggambir.sch.id
              </p>
            </div>
          </div>
        </div>

        {/* MODE INDIVIDU GURU */}
        {mode === 'individu' && selectedObs && (
          <div className="space-y-6">
            {/* Judul Dokumen */}
            <div className="text-center space-y-1">
              <h3 className="text-sm sm:text-base font-bold tracking-wider uppercase underline underline-offset-4">
                LAPORAN HASIL SUPERVISI AKADEMIK PEMBELAJARAN
              </h3>
              <p className="text-xs font-sans text-slate-600">
                Tahun Ajaran 2026/2027 — Semester Ganjil (Kurikulum Merdeka)
              </p>
            </div>

            {/* Identitas Guru & Pelaksanaan */}
            <div className="font-sans text-xs border border-slate-300 rounded-lg p-3.5 bg-slate-50/50">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1.5 gap-x-6">
                <div className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="text-slate-600 font-medium">Nama Guru:</span>
                  <span className="font-bold text-slate-900">{selectedObs.namaGuru}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="text-slate-600 font-medium">Hari, Tanggal:</span>
                  <span className="font-bold text-slate-900">{selectedObs.tanggalObservasi}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="text-slate-600 font-medium">NIP / NUPTK:</span>
                  <span className="font-semibold text-slate-800">{selectedObs.nipGuru || '-'} / {matchedGuru?.nuptk || '-'}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="text-slate-600 font-medium">Kelas / Fase:</span>
                  <span className="font-semibold text-slate-800">{selectedObs.kelas} (Fase {selectedObs.fase})</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="text-slate-600 font-medium">Mata Pelajaran:</span>
                  <span className="font-semibold text-slate-800">{selectedObs.mataPelajaran}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="text-slate-600 font-medium">Supervisor:</span>
                  <span className="font-bold text-slate-900">{selectedObs.supervisor}</span>
                </div>
              </div>
            </div>

            {/* Rekap Skor per Aspek Kurikulum Merdeka */}
            <div className="font-sans text-xs space-y-2">
              <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider">
                A. Ringkasan Ketercapaian Aspek Supervisi
              </h4>
              <table className="w-full text-left border-collapse border border-slate-300">
                <thead className="bg-slate-100 font-bold text-slate-800 text-[11px]">
                  <tr>
                    <th className="border border-slate-300 py-1.5 px-2.5 text-center w-10">No</th>
                    <th className="border border-slate-300 py-1.5 px-2.5">Dimensi / Aspek Supervisi</th>
                    <th className="border border-slate-300 py-1.5 px-2.5 text-center w-28">Indikator</th>
                    <th className="border border-slate-300 py-1.5 px-2.5 text-center w-28">Ketercapaian</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {INSTRUMEN_ASPEK.map((asp, idx) => {
                    const matchScores = selectedObs.penilaianList?.filter(p => p.aspek === asp.nama) || [];
                    const subtotal = matchScores.reduce((acc, curr) => acc + curr.skor, 0);
                    const maxSubtotal = (asp.indikatorList.length * 4);
                    const pct = maxSubtotal > 0 ? Math.round((subtotal / maxSubtotal) * 100) : 85;

                    return (
                      <tr key={asp.id} className="hover:bg-slate-50">
                        <td className="border border-slate-300 py-1.5 px-2.5 text-center font-bold">{idx + 1}</td>
                        <td className="border border-slate-300 py-1.5 px-2.5 font-medium">{asp.nama}</td>
                        <td className="border border-slate-300 py-1.5 px-2.5 text-center">{asp.indikatorList.length} Indikator</td>
                        <td className="border border-slate-300 py-1.5 px-2.5 text-center font-bold text-blue-800">
                          {pct}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Rekap Nilai Akhir & Predikat Box */}
            <div className="font-sans text-xs border-2 border-slate-800 rounded-lg p-3 flex items-center justify-between bg-slate-50">
              <div>
                <span className="text-slate-500 uppercase text-[10px] font-bold block">Hasil Nilai Akhir</span>
                <span className="text-2xl font-black text-blue-900">{selectedObs.nilaiAkhir}</span>
                <span className="text-[11px] text-slate-500 ml-1.5">/ 100</span>
              </div>

              <div className="text-center">
                <span className="text-slate-500 uppercase text-[10px] font-bold block">Predikat Kinerja</span>
                <span className="text-sm font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-md border border-emerald-300 inline-block">
                  {selectedObs.kategori}
                </span>
              </div>

              <div className="text-right">
                <span className="text-slate-500 uppercase text-[10px] font-bold block">Status Tindak Lanjut</span>
                <span className="text-xs font-bold text-slate-800">{selectedObs.statusTindakLanjut || 'Dalam proses'}</span>
                <span className="text-[10px] text-slate-500 block">Target: {selectedObs.targetPerbaikan || 'November 2026'}</span>
              </div>
            </div>

            {/* Analisis Catatan, Rekomendasi & Tindak Lanjut */}
            <div className="font-sans text-xs space-y-3">
              <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider">
                B. Catatan Hasil Pengamatan & Tindak Lanjut
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 border border-slate-300 rounded-lg bg-white">
                  <strong className="text-slate-800 block mb-1 text-[11px] uppercase">1. Kekuatan Guru (Strengths):</strong>
                  <p className="text-slate-700 leading-relaxed text-[11px]">{selectedObs.kekuatan || 'Mampu mengelola kelas dengan baik dan menguasai materi ajar.'}</p>
                </div>
                <div className="p-3 border border-slate-300 rounded-lg bg-white">
                  <strong className="text-slate-800 block mb-1 text-[11px] uppercase">2. Area Pengembangan:</strong>
                  <p className="text-slate-700 leading-relaxed text-[11px]">{selectedObs.perluDitingkatkan || 'Perlu memperkaya diferensiasi asesmen diagnostik dan formatif.'}</p>
                </div>
              </div>

              <div className="p-3 border border-slate-300 rounded-lg bg-white">
                <strong className="text-slate-800 block mb-1 text-[11px] uppercase">3. Rekomendasi & Tindak Lanjut:</strong>
                <p className="text-slate-700 leading-relaxed text-[11px] mb-1">
                  <strong>Rekomendasi:</strong> {selectedObs.rekomendasi}
                </p>
                <p className="text-slate-700 leading-relaxed text-[11px]">
                  <strong>Bentuk Tindak Lanjut:</strong> {selectedObs.tindakLanjut} ({selectedObs.bentukPembinaan || 'Diseminasi Komunitas Belajar'})
                </p>
              </div>
            </div>

            {/* Lembar Pengesahan / Tanda Tangan */}
            <div className="font-sans text-xs pt-6 space-y-8">
              <div className="flex justify-between items-start text-center">
                <div className="w-56">
                  <p className="font-medium text-slate-700">Guru yang Disupervisi,</p>
                  <div className="h-16"></div>
                  <p className="font-bold text-slate-900 underline underline-offset-2">{selectedObs.namaGuru}</p>
                  <p className="text-[10px] text-slate-600">NIP. {selectedObs.nipGuru || '-------------------------'}</p>
                </div>

                <div className="w-56">
                  <p className="font-medium text-slate-700">Bojonggambir, {selectedObs.tanggalObservasi}</p>
                  <p className="font-medium text-slate-700">Supervisor Penilai,</p>
                  <div className="h-16"></div>
                  <p className="font-bold text-slate-900 underline underline-offset-2">{selectedObs.supervisor}</p>
                  <p className="text-[10px] text-slate-600">NIP. 197405122000031004</p>
                </div>
              </div>

              <div className="text-center pt-2">
                <div className="w-72 mx-auto">
                  <p className="font-medium text-slate-700">Mengetahui,</p>
                  <p className="font-bold text-slate-900">Kepala SMK Negeri Bojonggambir</p>
                  <div className="h-16"></div>
                  <p className="font-bold text-slate-900 underline underline-offset-2">Drs. H. Dadang Suryana, M.Pd.</p>
                  <p className="text-[10px] text-slate-600">NIP. 196803151994031007</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODE REKAP SEKOLAH */}
        {mode === 'rekap' && (
          <div className="space-y-6">
            <div className="text-center space-y-1">
              <h3 className="text-sm sm:text-base font-bold tracking-wider uppercase underline underline-offset-4">
                REKAPITULASI HASIL SUPERVISI AKADEMIK GURU
              </h3>
              <p className="text-xs font-sans text-slate-600">
                Tahun Ajaran 2026/2027 — Semester Ganjil SMK Negeri Bojonggambir
              </p>
            </div>

            <div className="font-sans text-xs">
              <table className="w-full text-left border-collapse border border-slate-300">
                <thead className="bg-slate-100 font-bold text-slate-800 text-[11px]">
                  <tr>
                    <th className="border border-slate-300 py-2 px-2 text-center">No</th>
                    <th className="border border-slate-300 py-2 px-2">Nama Guru / NIP</th>
                    <th className="border border-slate-300 py-2 px-2">Mata Pelajaran</th>
                    <th className="border border-slate-300 py-2 px-2">Kelas</th>
                    <th className="border border-slate-300 py-2 px-2 text-center">Nilai</th>
                    <th className="border border-slate-300 py-2 px-2 text-center">Kategori</th>
                    <th className="border border-slate-300 py-2 px-2">Tindak Lanjut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {observasiList.map((o, idx) => (
                    <tr key={o.id}>
                      <td className="border border-slate-300 py-2 px-2 text-center font-bold">{idx + 1}</td>
                      <td className="border border-slate-300 py-2 px-2">
                        <span className="font-bold block">{o.namaGuru}</span>
                        <span className="text-[10px] text-slate-500">{o.nipGuru}</span>
                      </td>
                      <td className="border border-slate-300 py-2 px-2">{o.mataPelajaran}</td>
                      <td className="border border-slate-300 py-2 px-2">{o.kelas}</td>
                      <td className="border border-slate-300 py-2 px-2 text-center font-bold text-blue-900">{o.nilaiAkhir}</td>
                      <td className="border border-slate-300 py-2 px-2 text-center font-bold">{o.kategori}</td>
                      <td className="border border-slate-300 py-2 px-2 text-[10px]">{o.bentukPembinaan || 'Kombel'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Tanda Tangan Kepala Sekolah */}
            <div className="font-sans text-xs pt-8 flex justify-end">
              <div className="w-64 text-center">
                <p className="font-medium text-slate-700">Bojonggambir, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                <p className="font-bold text-slate-900 mt-1">Kepala SMK Negeri Bojonggambir</p>
                <div className="h-16"></div>
                <p className="font-bold text-slate-900 underline underline-offset-2">Drs. H. Dadang Suryana, M.Pd.</p>
                <p className="text-[10px] text-slate-600">NIP. 196803151994031007</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
