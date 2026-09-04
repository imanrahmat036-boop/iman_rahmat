import React, { useState } from 'react';
import { INSTRUMEN_ASPEK, TOTAL_INDIKATOR, SKOR_MAKSIMAL_TOTAL } from '../data/instrumentData';
import { ClipboardCheck, Sparkles, Search, ChevronDown, ChevronUp, CheckCircle2, HelpCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const InstrumenView: React.FC = () => {
  const { setActiveTab } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedAspek, setExpandedAspek] = useState<number[]>([1, 2, 3, 4, 5]);

  const toggleAspek = (id: number) => {
    setExpandedAspek(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const skalaRubrik = [
    { skor: 1, label: 'Belum Terlaksana', desc: 'Indikator belum muncul atau belum diterapkan dalam proses pembelajaran.', color: 'border-rose-200 bg-rose-50 text-rose-800' },
    { skor: 2, label: 'Mulai Terlaksana', desc: 'Indikator mulai dipraktikkan namun belum konsisten atau masih memerlukan bimbingan.', color: 'border-amber-200 bg-amber-50 text-amber-800' },
    { skor: 3, label: 'Terlaksana', desc: 'Indikator terlaksana secara konsisten, terstruktur, dan sesuai kaidah Kurikulum Merdeka.', color: 'border-blue-200 bg-blue-50 text-blue-800' },
    { skor: 4, label: 'Sangat Baik', desc: 'Indikator terlaksana secara ekselen, inovatif, berpusat pada siswa, dan menginspirasi.', color: 'border-emerald-200 bg-emerald-50 text-emerald-800' }
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <ClipboardCheck className="w-5 h-5 text-blue-600" />
            <span>Instrumen Supervisi Pembelajaran Kurikulum Merdeka</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Instrumen resmi SMK Negeri Bojonggambir: <strong>5 Aspek</strong> • <strong>{TOTAL_INDIKATOR} Indikator</strong> • Skor Maksimal <strong>{SKOR_MAKSIMAL_TOTAL}</strong>
          </p>
        </div>

        <button
          onClick={() => setActiveTab('observasi')}
          className="inline-flex items-center px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-xs transition-colors"
        >
          <Sparkles className="w-4 h-4 mr-1.5" />
          Mulai Observasi Sekarang
        </button>
      </div>

      {/* Rubrik Penilaian Guide Box */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
          <HelpCircle className="w-4 h-4 text-blue-600" />
          <span>Panduan Skala Penilaian Observasi (1 - 4)</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {skalaRubrik.map(s => (
            <div key={s.skor} className={`p-3 rounded-xl border ${s.color}`}>
              <div className="flex items-center space-x-2 mb-1">
                <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center font-black text-xs shadow-2xs">
                  {s.skor}
                </span>
                <span className="font-bold text-xs">{s.label}</span>
              </div>
              <p className="text-[11px] leading-relaxed opacity-90">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Search Indicator */}
      <div className="relative bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        <Search className="w-4 h-4 absolute left-6 top-5 text-slate-400" />
        <input
          type="text"
          placeholder="Cari indikator supervisi..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
        />
      </div>

      {/* Aspects Accordion List */}
      <div className="space-y-4">
        {INSTRUMEN_ASPEK.map((aspek, aIdx) => {
          const isExpanded = expandedAspek.includes(aspek.id);
          const filteredIndikators = aspek.indikatorList.filter(ind =>
            ind.indikator.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ind.deskripsi.toLowerCase().includes(searchTerm.toLowerCase())
          );

          if (searchTerm && filteredIndikators.length === 0) return null;

          return (
            <div key={aspek.id} className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
              <button
                onClick={() => toggleAspek(aspek.id)}
                className="w-full p-4 flex items-center justify-between bg-slate-50/70 hover:bg-slate-100/70 text-left transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                    {aIdx + 1}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{aspek.nama}</h4>
                    <p className="text-[11px] text-slate-500">{aspek.deskripsi} ({aspek.indikatorList.length} Indikator)</p>
                  </div>
                </div>
                {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
              </button>

              {isExpanded && (
                <div className="p-4 border-t border-slate-100 divide-y divide-slate-100">
                  {filteredIndikators.map((ind, iIdx) => (
                    <div key={ind.id} className="py-3 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs">
                      <div className="flex items-start space-x-3">
                        <span className="font-mono text-slate-400 font-semibold w-5 text-right shrink-0 mt-0.5">
                          {ind.id}.
                        </span>
                        <div>
                          <p className="font-bold text-slate-900">{ind.indikator}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{ind.deskripsi}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 sm:self-center shrink-0 pl-8 sm:pl-0">
                        <span className="text-[10px] font-semibold text-slate-400 mr-1">Skor Opsi:</span>
                        {[1, 2, 3, 4].map(num => (
                          <span
                            key={num}
                            className="w-6 h-6 rounded-md bg-slate-100 text-slate-700 font-bold text-[11px] flex items-center justify-center border border-slate-200"
                          >
                            {num}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
