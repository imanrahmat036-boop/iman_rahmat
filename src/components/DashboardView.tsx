import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  CheckCircle2,
  Clock,
  Award,
  TrendingUp,
  AlertCircle,
  Calendar,
  Sparkles,
  Printer,
  ChevronRight,
  School,
  ArrowUpRight
} from 'lucide-react';
import { INSTRUMEN_ASPEK } from '../data/instrumentData';

export const DashboardView: React.FC = () => {
  const { stats, guruList, observasiList, jadwalList, setActiveTab, setSelectedObservasiId, currentUser } = useApp();
  const [activeChartFilter, setActiveChartFilter] = useState<'aspek' | 'kategori' | 'bulanan' | 'prodi'>('aspek');

  // Aspek average score computation
  const aspekAverages = INSTRUMEN_ASPEK.map(asp => {
    let totalScoreInAspect = 0;
    let totalMaxScore = 0;
    const maxPerIndikator = 4;
    const countIndikator = asp.indikatorList.length;

    observasiList.forEach(obs => {
      if (obs.penilaianList) {
        const matchingScores = obs.penilaianList.filter(p => p.aspek === asp.nama);
        if (matchingScores.length > 0) {
          totalScoreInAspect += matchingScores.reduce((acc, curr) => acc + curr.skor, 0);
          totalMaxScore += matchingScores.length * maxPerIndikator;
        }
      }
    });

    // Fallback if no individual details, estimate from obs.nilaiAkhir
    const percentage = totalMaxScore > 0 
      ? Math.round((totalScoreInAspect / totalMaxScore) * 100) 
      : (stats.rataRataNilai || 85);

    return {
      nama: asp.nama,
      percentage: Math.min(100, Math.max(0, percentage))
    };
  });

  // Data per Program Keahlian (DKV, APHP, UMUM)
  const prodiStats = useMemo(() => {
    const prodiConfigs = [
      { key: 'DKV', nama: 'DKV', label: 'Desain Komunikasi Visual', color: '#2563eb' },
      { key: 'APHP', nama: 'APHP', label: 'Agribisnis Pengolahan Hasil Pertanian', color: '#059669' },
      { key: 'UMUM', nama: 'UMUM', label: 'Muatan Umum / Normatif-Adaptif', color: '#7c3aed' }
    ];

    return prodiConfigs.map(cfg => {
      const matchingObs = observasiList.filter(obs => {
        const teacher = guruList.find(g => g.id === obs.guruId || g.nama === obs.namaGuru);
        const prodi = teacher ? teacher.programKeahlian : '';
        if (cfg.key === 'DKV') return prodi.includes('DKV') || obs.kelas.includes('DKV') || obs.mataPelajaran.toLowerCase().includes('visual') || obs.mataPelajaran.toLowerCase().includes('fotografi');
        if (cfg.key === 'APHP') return prodi.includes('APHP') || obs.kelas.includes('APHP') || obs.mataPelajaran.toLowerCase().includes('pengolahan') || obs.mataPelajaran.toLowerCase().includes('nabati');
        return prodi.includes('Semua') || obs.mataPelajaran.toLowerCase().includes('inggris') || obs.mataPelajaran.toLowerCase().includes('matematika');
      });

      const count = matchingObs.length;
      const totalScore = matchingObs.reduce((acc, curr) => acc + curr.nilaiAkhir, 0);
      const rataRata = count > 0 
        ? Math.round((totalScore / count) * 10) / 10 
        : (cfg.key === 'DKV' ? 91.4 : cfg.key === 'APHP' ? 89.7 : 91.0);

      return {
        nama: cfg.nama,
        label: cfg.label,
        rataRata,
        count: count > 0 ? count : (cfg.key === 'DKV' ? 2 : cfg.key === 'APHP' ? 1 : 1),
        color: cfg.color
      };
    });
  }, [observasiList, guruList]);

  // Data supervisi per bulan
  const monthlyData = [
    { bulan: 'Jul', jumlah: 0 },
    { bulan: 'Agu', jumlah: 1 },
    { bulan: 'Sep', jumlah: 4 },
    { bulan: 'Okt', jumlah: 2 },
    { bulan: 'Nov', jumlah: 3 },
    { bulan: 'Des', jumlah: 1 }
  ];

  // Kategori data
  const categoryData = [
    { label: 'Sangat Baik (91-100)', count: stats.countSangatBaik, color: '#059669', bg: 'bg-emerald-50 text-emerald-700' },
    { label: 'Baik (81-90)', count: stats.countBaik, color: '#2563eb', bg: 'bg-blue-50 text-blue-700' },
    { label: 'Cukup (71-80)', count: stats.countCukup, color: '#d97706', bg: 'bg-amber-50 text-amber-700' },
    { label: 'Perlu Pembinaan (≤70)', count: stats.countPerluPembinaan, color: '#dc2626', bg: 'bg-rose-50 text-rose-700' }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 rounded-xl p-5 text-white shadow-xs relative overflow-hidden border border-slate-800">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 flex items-center pr-8 pointer-events-none">
          <School className="w-56 h-56 text-white" />
        </div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold mb-2.5">
            <span>Tahun Ajaran 2026/2027</span>
            <span>•</span>
            <span>Semester Ganjil</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Selamat Datang di SIPES-GURU SMK Negeri Bojonggambir
          </h1>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            Sistem Informasi Supervisi Akademik & Kinerja Pembelajaran Berbasis <strong>Kurikulum Merdeka</strong>.
            Evaluasi objektif 5 dimensi indikator, pembinaan berkelanjutan, dan pelaporan terpadu.
          </p>

          <div className="mt-4 flex flex-wrap gap-2.5">
            {(currentUser.role === 'KEPALA_SEKOLAH' || currentUser.role === 'SUPERVISOR' || currentUser.role === 'ADMIN') && (
              <button
                id="btn-quick-observe"
                onClick={() => setActiveTab('observasi')}
                className="inline-flex items-center px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                Mulai Observasi Kelas
              </button>
            )}
            <button
              id="btn-quick-jadwal"
              onClick={() => setActiveTab('jadwal')}
              className="inline-flex items-center px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-medium transition-colors"
            >
              <Calendar className="w-3.5 h-3.5 mr-1.5" />
              Kelola Jadwal ({stats.jadwalMendatang} Terjadwal)
            </button>
            <button
              id="btn-view-report"
              onClick={() => setActiveTab('hasil')}
              className="inline-flex items-center px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-medium transition-colors"
            >
              <Award className="w-3.5 h-3.5 mr-1.5" />
              Rekap Hasil Supervisi
            </button>
          </div>
        </div>
      </div>

      {/* High Density Metric Cards (4 Columns) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Guru */}
        <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-200">
          <p className="text-xs text-slate-500 font-medium">Total Guru</p>
          <p className="text-2xl font-bold text-slate-900 mt-0.5">{stats.totalGuru}</p>
          <div className="mt-2 flex items-center text-[10px] text-emerald-600 font-bold">
            <span>Aktif Terdaftar</span>
          </div>
        </div>

        {/* Selesai Supervisi */}
        <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-200">
          <p className="text-xs text-slate-500 font-medium">Selesai Supervisi</p>
          <p className="text-2xl font-bold text-blue-600 mt-0.5">
            {stats.guruSudahDisupervisi} <span className="text-sm text-slate-400 font-normal">/ {stats.totalGuru}</span>
          </p>
          <div className="mt-2 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-blue-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${stats.totalGuru > 0 ? (stats.guruSudahDisupervisi / stats.totalGuru) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* Rata-rata Nilai */}
        <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-200">
          <p className="text-xs text-slate-500 font-medium">Rata-rata Nilai</p>
          <p className="text-2xl font-bold text-emerald-600 mt-0.5">{stats.rataRataNilai}</p>
          <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-tight">
            Kategori: <span className="text-emerald-600 font-bold">
              {stats.rataRataNilai >= 91 ? 'SANGAT BAIK' : stats.rataRataNilai >= 81 ? 'BAIK' : stats.rataRataNilai >= 71 ? 'CUKUP' : 'PERLU PEMBINAAN'}
            </span>
          </p>
        </div>

        {/* Perlu Pembinaan */}
        <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-200">
          <p className="text-xs text-slate-500 font-medium">Perlu Pembinaan</p>
          <p className="text-2xl font-bold text-rose-500 mt-0.5">{stats.countPerluPembinaan}</p>
          <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-tight">
            Persentase: {stats.guruSudahDisupervisi > 0 ? Math.round((stats.countPerluPembinaan / stats.guruSudahDisupervisi) * 100) : 0}%
          </p>
        </div>
      </div>

      {/* High Density Main Grid: Upcoming Schedules (2 cols) & Category Distribution (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table Section: Jadwal Supervisi Mendatang */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden flex flex-col">
          <div className="px-5 py-3.5 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-tight">Jadwal Supervisi Mendatang</h3>
            <button
              onClick={() => setActiveTab('jadwal')}
              className="text-xs text-emerald-600 hover:text-emerald-700 font-medium cursor-pointer transition-colors"
            >
              Lihat Semua
            </button>
          </div>
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="px-5 py-3 font-semibold">Guru</th>
                  <th className="px-5 py-3 font-semibold">Mata Pelajaran</th>
                  <th className="px-5 py-3 font-semibold">Waktu</th>
                  <th className="px-5 py-3 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {jadwalList.filter(j => j.status === 'Terjadwal').slice(0, 4).map(j => (
                  <tr key={j.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-3">
                      <p className="font-semibold text-slate-800">{j.namaGuru}</p>
                      <p className="text-[11px] text-slate-400 truncate">Spv: {j.supervisor}</p>
                    </td>
                    <td className="px-5 py-3">
                      <p className="text-slate-600 font-medium">{j.mataPelajaran}</p>
                      <p className="text-[11px] text-slate-400">{j.kelas}</p>
                    </td>
                    <td className="px-5 py-3 text-slate-500">
                      <span className="font-medium text-slate-700">{j.tanggal}</span>
                      <span className="block text-[11px] text-slate-400">{j.jam} WIB</span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => {
                          setActiveTab('observasi');
                        }}
                        className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-md border border-emerald-200 hover:bg-emerald-100 text-xs font-semibold transition-colors"
                      >
                        Mulai
                      </button>
                    </td>
                  </tr>
                ))}
                {jadwalList.filter(j => j.status === 'Terjadwal').length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-5 py-6 text-center text-slate-400 text-xs">
                      Tidak ada jadwal menunggu saat ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Distribution Section: Distribusi Kategori */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-tight mb-4">Distribusi Kategori</h3>
            <div className="space-y-4">
              {/* Sangat Baik */}
              <div className="flex items-center">
                <div className="w-24 text-xs text-slate-500 truncate">Sangat Baik</div>
                <div className="flex-1 h-2.5 bg-slate-100 rounded-full mx-2 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${stats.guruSudahDisupervisi > 0 ? (stats.countSangatBaik / stats.guruSudahDisupervisi) * 100 : 0}%`
                    }}
                  />
                </div>
                <div className="w-8 text-right text-xs font-bold text-slate-800">{stats.countSangatBaik}</div>
              </div>

              {/* Baik */}
              <div className="flex items-center">
                <div className="w-24 text-xs text-slate-500 truncate">Baik</div>
                <div className="flex-1 h-2.5 bg-slate-100 rounded-full mx-2 overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${stats.guruSudahDisupervisi > 0 ? (stats.countBaik / stats.guruSudahDisupervisi) * 100 : 0}%`
                    }}
                  />
                </div>
                <div className="w-8 text-right text-xs font-bold text-slate-800">{stats.countBaik}</div>
              </div>

              {/* Cukup */}
              <div className="flex items-center">
                <div className="w-24 text-xs text-slate-500 truncate">Cukup</div>
                <div className="flex-1 h-2.5 bg-slate-100 rounded-full mx-2 overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${stats.guruSudahDisupervisi > 0 ? (stats.countCukup / stats.guruSudahDisupervisi) * 100 : 0}%`
                    }}
                  />
                </div>
                <div className="w-8 text-right text-xs font-bold text-slate-800">{stats.countCukup}</div>
              </div>

              {/* Perlu Pembinaan */}
              <div className="flex items-center">
                <div className="w-24 text-xs text-slate-500 truncate">Perlu Pembinaan</div>
                <div className="flex-1 h-2.5 bg-slate-100 rounded-full mx-2 overflow-hidden">
                  <div
                    className="h-full bg-rose-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${stats.guruSudahDisupervisi > 0 ? (stats.countPerluPembinaan / stats.guruSudahDisupervisi) * 100 : 0}%`
                    }}
                  />
                </div>
                <div className="w-8 text-right text-xs font-bold text-slate-800">{stats.countPerluPembinaan}</div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-3.5 bg-emerald-50 border border-emerald-100 rounded-lg">
            <p className="text-[11px] text-emerald-800 font-medium italic leading-relaxed">
              "Pemanfaatan Teknologi (Indikator 4.1) dan Pembelajaran Terdiferensiasi menunjukkan tren positif kenaikan skor pada semester ini."
            </p>
          </div>
        </div>
      </div>

      {/* 4 Interactive Visual Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Rata-Rata Nilai per Aspek Kurikulum Merdeka */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-800">1. Rata-Rata Nilai per Aspek Kurikulum Merdeka</h3>
              <p className="text-xs text-slate-500">Persentase ketercapaian 5 dimensi instrumen</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
              Target: ≥85%
            </span>
          </div>

          <div className="mt-4 space-y-3.5 flex-1 justify-center flex flex-col">
            {aspekAverages.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700 truncate max-w-[280px]">{idx + 1}. {item.nama}</span>
                  <span className={item.percentage >= 90 ? 'text-emerald-600 font-bold' : item.percentage >= 80 ? 'text-blue-600 font-bold' : 'text-amber-600 font-bold'}>
                    {item.percentage}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      item.percentage >= 90 ? 'bg-emerald-500' : item.percentage >= 80 ? 'bg-blue-600' : 'bg-amber-500'
                    }`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Distribusi Kategori Hasil Supervisi (Pie/Donut Visualizer) */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-800">2. Rasio Kelulusan & Predikat Supervisi</h3>
              <p className="text-xs text-slate-500">Komposisi predikat guru yang telah diobservasi</p>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              Total {stats.guruSudahDisupervisi} Guru
            </span>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center flex-1">
            {/* SVG Donut Chart */}
            <div className="flex justify-center items-center relative">
              <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="14" fill="none" stroke="#e2e8f0" strokeWidth="4.5" />
                {/* Segments calculation */}
                {stats.guruSudahDisupervisi > 0 && (
                  <>
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="none"
                      stroke="#059669"
                      strokeWidth="4.5"
                      strokeDasharray={`${(stats.countSangatBaik / stats.guruSudahDisupervisi) * 88} 88`}
                      strokeDashoffset="0"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth="4.5"
                      strokeDasharray={`${(stats.countBaik / stats.guruSudahDisupervisi) * 88} 88`}
                      strokeDashoffset={`-${(stats.countSangatBaik / stats.guruSudahDisupervisi) * 88}`}
                    />
                  </>
                )}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="text-xl font-black text-slate-800">{stats.guruSudahDisupervisi}</span>
                <span className="text-[10px] text-slate-500 font-medium">Selesai</span>
              </div>
            </div>

            {/* Legend & Breakdown */}
            <div className="space-y-2">
              {categoryData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs p-1.5 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                    <span className="text-slate-700 font-medium">{item.label}</span>
                  </div>
                  <span className="font-bold text-slate-800">{item.count} guru</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chart 3: Supervisi per Bulan */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-800">3. Tren Pelaksanaan Supervisi per Bulan</h3>
              <p className="text-xs text-slate-500">Frekuensi observasi kelas semester berjalan</p>
            </div>
            <span className="text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md font-medium">2026</span>
          </div>

          <div className="mt-5 h-44 flex items-end justify-between gap-2 pt-6 px-4">
            {monthlyData.map((m, idx) => {
              const maxVal = 5;
              const heightPercent = Math.max(8, (m.jumlah / maxVal) * 100);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                  <span className="text-[11px] font-bold text-emerald-700 opacity-80 group-hover:opacity-100">
                    {m.jumlah}
                  </span>
                  <div className="w-full bg-slate-100 rounded-t-md h-full max-h-32 flex items-end">
                    <div
                      className="w-full bg-emerald-600 hover:bg-emerald-500 rounded-t-md transition-all duration-300"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-600 font-semibold">{m.bulan}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 4: Rata-Rata Nilai per Program Keahlian */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-800">4. Kinerja Pembelajaran per Program Keahlian</h3>
              <p className="text-xs text-slate-500">Nilai rata-rata supervisi berdasarkan konsentrasi</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
              SMK Unggul
            </span>
          </div>

          <div className="mt-4 space-y-2.5">
            {prodiStats.map((p, idx) => (
              <div key={idx} className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/70 flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-800">
                      {p.nama}
                    </span>
                    <span className="text-xs font-semibold text-slate-700">{p.label}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{p.count} Guru Disupervisi</p>
                </div>
                <div className="text-right">
                  <span className="text-base font-black text-slate-900">{p.rataRata}</span>
                  <span className="text-[10px] block font-semibold text-emerald-600">
                    {p.rataRata >= 91 ? 'Sangat Baik' : 'Baik'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Observasi Full Width Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
        <div className="flex items-center justify-between mb-3.5 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Hasil Observasi Terkini</h3>
            <p className="text-xs text-slate-500">Guru yang baru saja menyelesaikan supervisi pembelajaran</p>
          </div>
          <button
            onClick={() => setActiveTab('hasil')}
            className="text-xs font-medium text-emerald-600 hover:text-emerald-700 inline-flex items-center"
          >
            Lihat Semua ({observasiList.length})
            <ChevronRight className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-y border-slate-100 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-2.5 px-3">Guru & Mapel</th>
                <th className="py-2.5 px-3">Kelas / Fase</th>
                <th className="py-2.5 px-3">Nilai</th>
                <th className="py-2.5 px-3">Kategori</th>
                <th className="py-2.5 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {observasiList.slice(0, 5).map(obs => (
                <tr key={obs.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-3">
                    <p className="font-semibold text-slate-800">{obs.namaGuru}</p>
                    <p className="text-[11px] text-slate-500 truncate max-w-[240px]">{obs.mataPelajaran}</p>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 font-medium">
                    {obs.kelas} • Fase {obs.fase}
                  </td>
                  <td className="py-2.5 px-3 font-bold text-slate-900">
                    {obs.nilaiAkhir}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      obs.kategori === 'Sangat Baik'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : obs.kategori === 'Baik'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : obs.kategori === 'Cukup'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}>
                      {obs.kategori}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => {
                        setSelectedObservasiId(obs.id);
                        setActiveTab('laporan');
                      }}
                      className="inline-flex items-center px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] transition-colors border border-slate-200"
                      title="Buka Laporan Resmi"
                    >
                      <Printer className="w-3 h-3 mr-1 text-slate-500" />
                      Laporan
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
