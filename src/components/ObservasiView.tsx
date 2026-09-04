import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { INSTRUMEN_ASPEK, TOTAL_INDIKATOR, SKOR_MAKSIMAL_TOTAL, calculateScoreAndCategory, generateAutoRecommendations } from '../data/instrumentData';
import { Observasi, PenilaianDetail } from '../types';
import {
  Sparkles,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Award,
  BookOpen,
  Calendar,
  Clock,
  User,
  Check,
  Printer,
  ChevronRight,
  Zap
} from 'lucide-react';

export const ObservasiView: React.FC = () => {
  const {
    guruList,
    jadwalList,
    selectedJadwalForObs,
    setSelectedJadwalForObs,
    saveObservasi,
    setActiveTab,
    setSelectedObservasiId,
    currentUser,
    showNotification
  } = useApp();

  // Selected Teacher and Session Metadata
  const defaultGuru = guruList[0];
  const [selectedGuruId, setSelectedGuruId] = useState<string>(
    selectedJadwalForObs ? selectedJadwalForObs.guruId : (defaultGuru?.id || '')
  );

  const activeGuru = guruList.find(g => g.id === selectedGuruId) || defaultGuru;

  const [metadata, setMetadata] = useState({
    idSupervisi: selectedJadwalForObs ? selectedJadwalForObs.id : '',
    tanggal: selectedJadwalForObs ? selectedJadwalForObs.tanggal : new Date().toISOString().slice(0, 10),
    jam: selectedJadwalForObs ? selectedJadwalForObs.jam : '08:00 - 09:30',
    namaGuru: activeGuru?.nama || '',
    nipGuru: activeGuru?.nip || '-',
    mataPelajaran: activeGuru?.mataPelajaran || '',
    kelas: activeGuru?.kelas || 'XI TJKT 1',
    fase: (activeGuru?.fase || 'F') as 'E' | 'F',
    supervisor: currentUser.nama || 'Drs. H. Dadang Suryana, M.Pd.'
  });

  // Keep metadata in sync when teacher changes
  useEffect(() => {
    if (activeGuru && !selectedJadwalForObs) {
      setMetadata(prev => ({
        ...prev,
        namaGuru: activeGuru.nama,
        nipGuru: activeGuru.nip,
        mataPelajaran: activeGuru.mataPelajaran,
        kelas: activeGuru.kelas,
        fase: activeGuru.fase
      }));
    }
  }, [selectedGuruId, activeGuru, selectedJadwalForObs]);

  // Scores state: Map of indicatorId -> score (1..4)
  const [scores, setScores] = useState<Record<number, number>>(() => {
    const initial: Record<number, number> = {};
    // Pre-fill default 3 for convenience or leave empty
    INSTRUMEN_ASPEK.forEach(asp => {
      asp.indikatorList.forEach(ind => {
        initial[ind.id] = 3; // Default 3 (Terlaksana) for smooth supervisor experience
      });
    });
    return initial;
  });

  // Notes state per aspect
  const [aspekNotes, setAspekNotes] = useState<Record<number, string>>({
    1: 'Modul ajar lengkap dan telah mengintegrasikan tujuan pembelajaran kontekstual.',
    2: 'Pembelajaran interaktif, siswa aktif berkolaborasi dalam kelompok kerja praktikum.',
    3: 'Asesmen formatif berjalan dengan baik selama proses pembelajaran berlangsung.',
    4: 'Penggunaan media presentasi dan referensi digital berjalan optimal.',
    5: 'Budaya kerja industri, K3 bengkel/lab, dan sopan santun diterapkan dengan konsisten.'
  });

  // Real-time calculation
  const scoreResult = calculateScoreAndCategory(scores);

  // Calculate scores per aspect for automated recommendation
  const aspectPercentages = INSTRUMEN_ASPEK.map(asp => {
    let aspectTotal = 0;
    asp.indikatorList.forEach(ind => {
      aspectTotal += scores[ind.id] || 0;
    });
    const maxScore = asp.indikatorList.length * 4;
    return {
      nama: asp.nama,
      percentage: maxScore > 0 ? (aspectTotal / maxScore) * 100 : 0
    };
  });

  const autoRecs = generateAutoRecommendations(scoreResult.nilaiAkhir, scoreResult.kategori, aspectPercentages);

  // Additional follow-up state
  const [catatanUmum, setCatatanUmum] = useState(
    'Proses pembelajaran berlangsung kondusif dan siswa aktif menyelesaikan tugas berbasis proyek.'
  );
  const [kekuatan, setKekuatan] = useState(autoRecs.kekuatan);
  const [perluDitingkatkan, setPerluDitingkatkan] = useState(autoRecs.perluDitingkatkan);
  const [rekomendasi, setRekomendasi] = useState(autoRecs.rekomendasi);
  const [tindakLanjut, setTindakLanjut] = useState(autoRecs.tindakLanjut);
  const [bentukPembinaan, setBentukPembinaan] = useState('Diseminasi Komunitas Belajar (Kombel)');
  const [targetPerbaikan, setTargetPerbaikan] = useState('November 2026');

  // Update recommendations if score changes significantly
  const handleRefreshRecommendations = () => {
    const updated = generateAutoRecommendations(scoreResult.nilaiAkhir, scoreResult.kategori, aspectPercentages);
    setKekuatan(updated.kekuatan);
    setPerluDitingkatkan(updated.perluDitingkatkan);
    setRekomendasi(updated.rekomendasi);
    setTindakLanjut(updated.tindakLanjut);
    showNotification('Rekomendasi & tindak lanjut diperbarui sesuai skor saat ini.', 'info');
  };

  const handleScoreChange = (indikatorId: number, val: number) => {
    setScores(prev => ({
      ...prev,
      [indikatorId]: val
    }));
  };

  // Quick fill buttons
  const handleQuickFill = (targetScore: number) => {
    const filled: Record<number, number> = {};
    INSTRUMEN_ASPEK.forEach(asp => {
      asp.indikatorList.forEach(ind => {
        filled[ind.id] = targetScore;
      });
    });
    setScores(filled);
    showNotification(`Semua indikator diset ke skor ${targetScore}`, 'info');
  };

  const handleSaveObservation = () => {
    if (!metadata.namaGuru || !metadata.supervisor) {
      showNotification('Nama Guru dan Supervisor wajib diisi!', 'error');
      return;
    }

    const obsId = `OBS-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`;

    // Build detail list
    const detailList: PenilaianDetail[] = [];
    INSTRUMEN_ASPEK.forEach(asp => {
      asp.indikatorList.forEach(ind => {
        detailList.push({
          id: `PNL-${obsId}-${ind.id}`,
          idObservasi: obsId,
          indikatorId: ind.id,
          aspek: ind.aspek,
          indikator: ind.indikator,
          skor: scores[ind.id] || 3,
          catatanSupervisor: aspekNotes[asp.id] || ''
        });
      });
    });

    const newObservasi: Observasi = {
      id: obsId,
      idSupervisi: metadata.idSupervisi || '',
      tanggalObservasi: metadata.tanggal,
      guruId: activeGuru?.id || '',
      namaGuru: metadata.namaGuru,
      nipGuru: metadata.nipGuru,
      mataPelajaran: metadata.mataPelajaran,
      kelas: metadata.kelas,
      fase: metadata.fase,
      supervisor: metadata.supervisor,
      skorTotal: scoreResult.skorTotal,
      skorMaksimal: scoreResult.skorMaksimal,
      nilaiAkhir: scoreResult.nilaiAkhir,
      kategori: scoreResult.kategori,
      catatan: catatanUmum,
      rekomendasi,
      kekuatan,
      perluDitingkatkan,
      tindakLanjut,
      bentukPembinaan,
      targetPerbaikan,
      statusTindakLanjut: 'Dalam proses',
      penilaianList: detailList
    };

    const res = saveObservasi(newObservasi);
    if (res.success) {
      setSelectedObservasiId(obsId);
      setSelectedJadwalForObs(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Classroom Live Indicator */}
      <div className="bg-slate-900 border border-slate-800 text-white p-4 sm:p-5 rounded-xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Instrumen Observasi Kelas Berlangsung</span>
          </div>
          <h2 className="text-base font-bold text-white">Lembar Observasi & Penilaian Supervisi Kelas</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Evaluasi pembelajaran Kurikulum Merdeka secara langsung, terstruktur, dan akurat
          </p>
        </div>

        {/* Quick Fill Actions */}
        <div className="flex items-center space-x-2 bg-slate-800/80 p-1 rounded-lg border border-slate-700">
          <span className="text-[11px] font-semibold text-slate-300 px-2 flex items-center">
            <Zap className="w-3.5 h-3.5 mr-1 text-amber-400" />
            Isi Cepat:
          </span>
          <button
            onClick={() => handleQuickFill(4)}
            className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors"
            title="Isi semua indikator dengan skor 4 (Sangat Baik)"
          >
            Semua 4
          </button>
          <button
            onClick={() => handleQuickFill(3)}
            className="px-2.5 py-1 rounded bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold transition-colors"
            title="Isi semua indikator dengan skor 3 (Terlaksana)"
          >
            Semua 3
          </button>
        </div>
      </div>

      {/* Floating / Sticky Score Status Summary Bar */}
      <div className="sticky top-16 z-20 bg-white/95 backdrop-blur-xs p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="text-center px-3 py-1 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block">Skor Diperoleh</span>
            <span className="text-base font-extrabold text-slate-900">
              {scoreResult.skorTotal} <span className="text-xs text-slate-400 font-normal">/ {scoreResult.skorMaksimal}</span>
            </span>
          </div>

          <div className="text-center px-3 py-1 bg-emerald-50 rounded-lg border border-emerald-200">
            <span className="text-[10px] text-emerald-700 uppercase font-semibold block">Nilai Akhir</span>
            <span className="text-base font-extrabold text-emerald-700">{scoreResult.nilaiAkhir}</span>
          </div>

          <div>
            <span className="text-[10px] text-slate-500 uppercase font-semibold block mb-0.5">Predikat Kategori</span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-bold border ${
              scoreResult.kategori === 'Sangat Baik'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : scoreResult.kategori === 'Baik'
                ? 'bg-slate-100 text-slate-700 border-slate-200'
                : scoreResult.kategori === 'Cukup'
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-rose-50 text-rose-700 border-rose-200'
            }`}>
              <Award className="w-3.5 h-3.5 mr-1" />
              {scoreResult.kategori}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleRefreshRecommendations}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs transition-colors shadow-xs"
          >
            Sinkronkan Rekomendasi
          </button>
          <button
            id="btn-simpan-observasi"
            onClick={handleSaveObservation}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-xs transition-all flex items-center space-x-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Hasil Observasi</span>
          </button>
        </div>
      </div>

      {/* Identitas Observasi Form Box */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-slate-900 flex items-center space-x-2">
          <User className="w-4 h-4 text-emerald-600" />
          <span>Identitas Guru & Pelaksanaan Observasi</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block font-medium text-slate-700 mb-1">Pilih Guru</label>
            <select
              value={selectedGuruId}
              onChange={e => setSelectedGuruId(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium bg-slate-50 text-xs"
            >
              {guruList.map(g => (
                <option key={g.id} value={g.id}>
                  {g.nama} ({g.mataPelajaran})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Mata Pelajaran</label>
            <input
              type="text"
              value={metadata.mataPelajaran}
              onChange={e => setMetadata({ ...metadata, mataPelajaran: e.target.value })}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Kelas & Fase</label>
            <div className="flex space-x-1.5">
              <input
                type="text"
                value={metadata.kelas}
                onChange={e => setMetadata({ ...metadata, kelas: e.target.value })}
                className="w-2/3 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs"
              />
              <select
                value={metadata.fase}
                onChange={e => setMetadata({ ...metadata, fase: e.target.value as 'E' | 'F' })}
                className="w-1/3 px-2 py-1.5 rounded-lg border border-slate-200 bg-slate-50 font-semibold text-xs"
              >
                <option value="E">Fase E</option>
                <option value="F">Fase F</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Supervisor Penilai</label>
            <input
              type="text"
              value={metadata.supervisor}
              onChange={e => setMetadata({ ...metadata, supervisor: e.target.value })}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
          <div>
            <label className="block font-medium text-slate-700 mb-1">Tanggal Observasi</label>
            <input
              type="date"
              value={metadata.tanggal}
              onChange={e => setMetadata({ ...metadata, tanggal: e.target.value })}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs"
            />
          </div>
          <div>
            <label className="block font-medium text-slate-700 mb-1">Jam Pelaksanaan</label>
            <input
              type="text"
              value={metadata.jam}
              onChange={e => setMetadata({ ...metadata, jam: e.target.value })}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs"
            />
          </div>
        </div>
      </div>

      {/* 5 Aspects & 39 Indicators Live Scoring Forms */}
      <div className="space-y-4">
        {INSTRUMEN_ASPEK.map((aspek, aIdx) => {
          const aspectSubtotal = aspek.indikatorList.reduce((acc, ind) => acc + (scores[ind.id] || 0), 0);
          const aspectMax = aspek.indikatorList.length * 4;
          const aspectPct = Math.round((aspectSubtotal / aspectMax) * 100);

          return (
            <div key={aspek.id} className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              {/* Aspect Header */}
              <div className="p-3.5 bg-slate-50/90 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-2.5">
                  <span className="w-6 h-6 rounded-md bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                    {aIdx + 1}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{aspek.nama}</h4>
                    <p className="text-[11px] text-slate-500">{aspek.deskripsi}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-xs">
                  <span className="font-semibold text-slate-600">
                    Subtotal: <strong>{aspectSubtotal}</strong> / {aspectMax}
                  </span>
                  <span className="px-2 py-0.5 rounded font-bold bg-emerald-50 text-emerald-700 text-[11px] border border-emerald-200">
                    {aspectPct}%
                  </span>
                </div>
              </div>

              {/* Indicators Table */}
              <div className="divide-y divide-slate-100">
                {aspek.indikatorList.map((ind) => {
                  const currentScore = scores[ind.id] || 0;
                  return (
                    <div
                      key={ind.id}
                      className="p-3 sm:p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs hover:bg-slate-50/50 transition-colors"
                    >
                      <div className="max-w-xl">
                        <div className="flex items-start space-x-2">
                          <span className="font-mono text-slate-400 font-bold mt-0.5 text-[11px]">{ind.id}.</span>
                          <div>
                            <p className="font-semibold text-slate-900">{ind.indikator}</p>
                            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{ind.deskripsi}</p>
                          </div>
                        </div>
                      </div>

                      {/* 1..4 Score Buttons */}
                      <div className="flex items-center space-x-1.5 shrink-0 self-start md:self-center pl-6 md:pl-0">
                        {[1, 2, 3, 4].map(val => {
                          const isSelected = currentScore === val;
                          return (
                            <button
                              key={val}
                              type="button"
                              onClick={() => handleScoreChange(ind.id, val)}
                              className={`w-8 h-8 rounded-lg font-bold text-xs transition-all flex flex-col items-center justify-center ${
                                isSelected
                                  ? val === 4
                                    ? 'bg-emerald-600 text-white ring-2 ring-emerald-300 shadow-xs'
                                    : val === 3
                                    ? 'bg-slate-800 text-white ring-2 ring-slate-400 shadow-xs'
                                    : val === 2
                                    ? 'bg-amber-500 text-white ring-2 ring-amber-300 shadow-xs'
                                    : 'bg-rose-600 text-white ring-2 ring-rose-300 shadow-xs'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                              }`}
                              title={
                                val === 1 ? '1 = Belum Terlaksana' : val === 2 ? '2 = Mulai Terlaksana' : val === 3 ? '3 = Terlaksana' : '4 = Sangat Baik'
                              }
                            >
                              <span>{val}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Aspect Supervisor Notes Input */}
              <div className="p-3 bg-slate-50/50 border-t border-slate-100 text-xs">
                <label className="block font-medium text-slate-700 mb-1">
                  Catatan Pengamatan Supervisor untuk Aspek {aIdx + 1}:
                </label>
                <input
                  type="text"
                  placeholder="Berikan catatan spesifik pengamatan kelas untuk aspek ini..."
                  value={aspekNotes[aspek.id] || ''}
                  onChange={e => setAspekNotes({ ...aspekNotes, [aspek.id]: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-xs"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Catatan, Kekuatan, Rekomendasi & Tindak Lanjut Box */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs space-y-4 text-xs">
        <h3 className="text-xs font-bold text-slate-900 flex items-center space-x-2">
          <Award className="w-4 h-4 text-emerald-600" />
          <span>Analisis Hasil, Rekomendasi, dan Rencana Tindak Lanjut</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block font-medium text-emerald-800 mb-1">Kekuatan Guru (Strengths)</label>
            <textarea
              rows={3}
              value={kekuatan}
              onChange={e => setKekuatan(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-emerald-200 bg-emerald-50/20 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 text-xs"
            />
          </div>

          <div>
            <label className="block font-medium text-amber-800 mb-1">Hal yang Perlu Ditingkatkan</label>
            <textarea
              rows={3}
              value={perluDitingkatkan}
              onChange={e => setPerluDitingkatkan(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-amber-200 bg-amber-50/20 focus:bg-white focus:ring-2 focus:ring-amber-500/20 text-xs"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block font-medium text-slate-800 mb-1">Rekomendasi Supervisor</label>
            <textarea
              rows={3}
              value={rekomendasi}
              onChange={e => setRekomendasi(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 text-xs"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-800 mb-1">Rencana Tindak Lanjut</label>
            <textarea
              rows={3}
              value={tindakLanjut}
              onChange={e => setTindakLanjut(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 text-xs"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div>
            <label className="block font-medium text-slate-700 mb-1">Bentuk Pembinaan</label>
            <select
              value={bentukPembinaan}
              onChange={e => setBentukPembinaan(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-medium text-xs"
            >
              <option value="Diseminasi Komunitas Belajar (Kombel)">Diseminasi Komunitas Belajar (Kombel)</option>
              <option value="Coaching / Pendampingan Klinis">Coaching / Pendampingan Klinis</option>
              <option value="Pelatihan / Workshop Internal">Pelatihan / Workshop Internal</option>
              <option value="Peer Teaching (Tutor Teman Sejawat)">Peer Teaching (Tutor Teman Sejawat)</option>
              <option value="Penugasan Khusus / Magang Industri">Penugasan Khusus / Magang Industri</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Target Penyelesaian / Supervisi Ulang</label>
            <input
              type="text"
              value={targetPerbaikan}
              onChange={e => setTargetPerbaikan(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs"
            />
          </div>
        </div>

        {/* Action Save Bar */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
          <button
            onClick={() => setActiveTab('hasil')}
            className="px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs"
          >
            Batal
          </button>
          <button
            onClick={handleSaveObservation}
            className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-xs flex items-center space-x-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Simpan dan Terbitkan Hasil</span>
          </button>
        </div>
      </div>
    </div>
  );
};
