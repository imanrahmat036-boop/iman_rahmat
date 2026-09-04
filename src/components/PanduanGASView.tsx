import React, { useState } from 'react';
import { GAS_FILES } from '../data/gasCodeFiles';
import { useApp } from '../context/AppContext';
import {
  Code,
  Copy,
  Check,
  Download,
  FileSpreadsheet,
  Globe,
  HelpCircle,
  ExternalLink,
  Layers,
  ChevronRight
} from 'lucide-react';

export const PanduanGASView: React.FC = () => {
  const { showNotification } = useApp();
  const [selectedFileName, setSelectedFileName] = useState<string>(GAS_FILES[0].name);
  const [copied, setCopied] = useState(false);
  const [activeTabSub, setActiveTabSub] = useState<'kode' | 'database' | 'deploy'>('kode');

  const currentFile = GAS_FILES.find(f => f.name === selectedFileName) || GAS_FILES[0];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentFile.content);
    setCopied(true);
    showNotification(`Kode file ${currentFile.name} berhasil disalin ke clipboard!`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadAll = () => {
    const combined = GAS_FILES.map(f => `// ==========================================\n// FILE: ${f.name} (${f.type.toUpperCase()})\n// ==========================================\n\n${f.content}\n\n`).join('\n');
    const blob = new Blob([combined], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SIPES_GURU_GAS_BACKEND_SMKN_BOJONGGAMBIR.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('Seluruh source code GAS berhasil diunduh.');
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <Code className="w-4 h-4 text-emerald-600" />
            <span>Panduan Deploy & Source Code Google Apps Script (GAS)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Integrasi lengkap Google Apps Script Web App dengan Google Sheets sebagai basis data real-time
          </p>
        </div>

        <button
          onClick={handleDownloadAll}
          className="inline-flex items-center px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs transition-colors"
        >
          <Download className="w-3.5 h-3.5 mr-1.5" />
          Unduh Seluruh Script GAS (.txt)
        </button>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 pt-1">
        <button
          onClick={() => setActiveTabSub('kode')}
          className={`px-3 py-2.5 text-xs font-semibold border-b-2 flex items-center space-x-2 transition-colors ${
            activeTabSub === 'kode'
              ? 'border-emerald-600 text-emerald-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Editor & File Kode GAS ({GAS_FILES.length} Files)</span>
        </button>

        <button
          onClick={() => setActiveTabSub('database')}
          className={`px-3 py-2.5 text-xs font-semibold border-b-2 flex items-center space-x-2 transition-colors ${
            activeTabSub === 'database'
              ? 'border-emerald-600 text-emerald-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>Struktur Tabel Google Sheets</span>
        </button>

        <button
          onClick={() => setActiveTabSub('deploy')}
          className={`px-3 py-2.5 text-xs font-semibold border-b-2 flex items-center space-x-2 transition-colors ${
            activeTabSub === 'deploy'
              ? 'border-emerald-600 text-emerald-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Petunjuk Deploy Web App</span>
        </button>
      </div>

      {/* SUB-VIEW 1: CODE EXPLORER */}
      {activeTabSub === 'kode' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 bg-white p-4 rounded-b-xl border border-t-0 border-slate-200 shadow-xs">
          {/* File Tree Left */}
          <div className="space-y-1 lg:col-span-1 border-r border-slate-100 pr-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Daftar File Google Apps Script
            </span>
            {GAS_FILES.map(file => (
              <button
                key={file.name}
                onClick={() => {
                  setSelectedFileName(file.name);
                  setCopied(false);
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                  selectedFileName === file.name
                    ? 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-200'
                    : 'text-slate-600 hover:bg-slate-50 font-medium'
                }`}
              >
                <div className="flex items-center space-x-2 truncate">
                  <span className={`w-1.5 h-1.5 rounded-full ${file.type === 'server' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                  <span className="truncate">{file.name}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono uppercase">{file.type}</span>
              </button>
            ))}
          </div>

          {/* Code Viewer Right */}
          <div className="lg:col-span-3 space-y-2">
            <div className="flex items-center justify-between bg-slate-900 text-white px-3.5 py-2 rounded-t-lg">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs text-emerald-400 font-bold">{currentFile.name}</span>
                <span className="text-slate-600 text-xs">•</span>
                <span className="text-slate-400 text-xs">{currentFile.description}</span>
              </div>

              <button
                onClick={handleCopyCode}
                className="inline-flex items-center px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-xs transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                <span>{copied ? 'Tersalin!' : 'Salin Kode'}</span>
              </button>
            </div>

            <pre className="bg-slate-950 text-slate-200 p-3.5 rounded-b-lg overflow-x-auto text-xs font-mono max-h-[500px] leading-relaxed border border-slate-800">
              <code>{currentFile.content}</code>
            </pre>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: SPREADSHEET STRUCTURE */}
      {activeTabSub === 'database' && (
        <div className="bg-white p-4 sm:p-5 rounded-b-xl border border-t-0 border-slate-200 shadow-xs space-y-4">
          <div className="max-w-3xl space-y-1">
            <h3 className="text-sm font-bold text-slate-900">Arsitektur Database Google Sheets</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Aplikasi menggunakan 1 (satu) file Google Spreadsheet yang secara otomatis di-inisialisasi oleh fungsi{' '}
              <code className="bg-slate-100 text-emerald-700 px-1.5 py-0.5 rounded font-mono font-semibold">initializeDatabase()</code> pada file{' '}
              <code className="bg-slate-100 text-emerald-700 px-1.5 py-0.5 rounded font-mono font-semibold">Database.gs</code>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/60 space-y-1.5">
              <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">1. Sheet GURU</h4>
              <p className="text-[11px] text-slate-500">Menyimpan profil lengkap pendidik SMKN Bojonggambir</p>
              <div className="font-mono text-[11px] text-slate-700 bg-white p-2 rounded-md border border-slate-200 leading-relaxed">
                ID_GURU, NIP, NUPTK, NAMA_GURU, JENIS_KELAMIN, MATA_PELAJARAN, PROGRAM_KEAHLIAN, KELAS_DIAMPU, FASE, EMAIL, NO_HP, STATUS, CREATED_AT
              </div>
            </div>

            <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/60 space-y-1.5">
              <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">2. Sheet MAPEL</h4>
              <p className="text-[11px] text-slate-500">Katalog mata pelajaran Kurikulum Merdeka</p>
              <div className="font-mono text-[11px] text-slate-700 bg-white p-2 rounded-md border border-slate-200 leading-relaxed">
                ID_MAPEL, MATA_PELAJARAN, KELOMPOK, PROGRAM_KEAHLIAN, FASE, STATUS, CREATED_AT
              </div>
            </div>

            <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/60 space-y-1.5">
              <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">3. Sheet JADWAL_SUPERVISI</h4>
              <p className="text-[11px] text-slate-500">Perencanaan kalender supervisi akademik</p>
              <div className="font-mono text-[11px] text-slate-700 bg-white p-2 rounded-md border border-slate-200 leading-relaxed">
                ID_JADWAL, TANGGAL, JAM, ID_GURU, NAMA_GURU, MATA_PELAJARAN, KELAS, FASE, SUPERVISOR, STATUS, KETERANGAN, CREATED_AT
              </div>
            </div>

            <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/60 space-y-1.5">
              <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">4. Sheet OBSERVASI</h4>
              <p className="text-[11px] text-slate-500">Hasil nilai agregat, predikat, dan rekomendasi</p>
              <div className="font-mono text-[11px] text-slate-700 bg-white p-2 rounded-md border border-slate-200 leading-relaxed">
                ID_OBSERVASI, ID_JADWAL, TANGGAL, ID_GURU, NAMA_GURU, NIP_GURU, MATA_PELAJARAN, KELAS, FASE, SUPERVISOR, SKOR_TOTAL, SKOR_MAKS, NILAI_AKHIR, KATEGORI, CATATAN, REKOMENDASI, TINDAK_LANJUT, CREATED_AT
              </div>
            </div>

            <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/60 space-y-1.5 md:col-span-2">
              <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">5. Sheet PENILAIAN (Detail 39 Indikator)</h4>
              <p className="text-[11px] text-slate-500">Rincian perolehan skor observasi tiap butir instrumen</p>
              <div className="font-mono text-[11px] text-slate-700 bg-white p-2 rounded-md border border-slate-200 leading-relaxed">
                ID_PENILAIAN, ID_OBSERVASI, INDIKATOR_ID, ASPEK, INDIKATOR, SKOR, CATATAN_SUPERVISOR, CREATED_AT
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: DEPLOYMENT STEPS */}
      {activeTabSub === 'deploy' && (
        <div className="bg-white p-4 sm:p-5 rounded-b-xl border border-t-0 border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Langkah Praktis Deploy Google Apps Script Web App</h3>

          <div className="space-y-2.5 text-xs">
            <div className="p-3.5 rounded-lg border border-slate-200 flex items-start space-x-3">
              <span className="w-6 h-6 rounded-md bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">1</span>
              <div className="space-y-0.5">
                <p className="font-bold text-slate-900 text-xs">Buat Google Spreadsheet Baru</p>
                <p className="text-slate-600 leading-relaxed">
                  Buka Google Drive &gt; Buat Spreadsheet baru dengan nama: <strong>DATABASE_SIPES_GURU_SMKN_BOJONGGAMBIR</strong>. Salin Spreadsheet ID dari URL browser.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-lg border border-slate-200 flex items-start space-x-3">
              <span className="w-6 h-6 rounded-md bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">2</span>
              <div className="space-y-0.5">
                <p className="font-bold text-slate-900 text-xs">Buka Apps Script Editor</p>
                <p className="text-slate-600 leading-relaxed">
                  Pada Google Sheet tersebut, klik menu <strong>Ekstensi (Extensions)</strong> &gt; <strong>Apps Script</strong>.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-lg border border-slate-200 flex items-start space-x-3">
              <span className="w-6 h-6 rounded-md bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">3</span>
              <div className="space-y-0.5">
                <p className="font-bold text-slate-900 text-xs">Salin Seluruh File Kode</p>
                <p className="text-slate-600 leading-relaxed">
                  Buat file-file script sesuai nama di tab <strong>Editor & File Kode GAS</strong>:
                  <code className="bg-slate-100 px-1 py-0.5 rounded font-mono mx-1">Config.gs</code>,
                  <code className="bg-slate-100 px-1 py-0.5 rounded font-mono mx-1">Code.gs</code>,
                  <code className="bg-slate-100 px-1 py-0.5 rounded font-mono mx-1">Database.gs</code>, dll.
                  Lalu paste seluruh isinya.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-lg border border-slate-200 flex items-start space-x-3">
              <span className="w-6 h-6 rounded-md bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">4</span>
              <div className="space-y-0.5">
                <p className="font-bold text-slate-900 text-xs">Jalankan Inisialisasi Database</p>
                <p className="text-slate-600 leading-relaxed">
                  Pilih fungsi <strong>initializeDatabase</strong> pada dropdown editor lalu klik <strong>Jalankan (Run)</strong>. Berikan izin akses (Review Permissions). Semua sheet otomatis terbuat!
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-lg border border-slate-200 flex items-start space-x-3">
              <span className="w-6 h-6 rounded-md bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">5</span>
              <div className="space-y-0.5">
                <p className="font-bold text-slate-900 text-xs">Terapkan Sebagai Web App (Deploy)</p>
                <p className="text-slate-600 leading-relaxed">
                  Klik <strong>Deploy &gt; New deployment &gt; Pilih jenis: Web app</strong>.
                  <br />
                  - <strong>Execute as</strong>: <em>Me (email Anda)</em>
                  <br />
                  - <strong>Who has access</strong>: <em>Anyone (Siapa saja)</em>
                  <br />
                  Salin URL Web App yang dihasilkan untuk digunakan oleh seluruh guru dan supervisor SMK Negeri Bojonggambir.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
