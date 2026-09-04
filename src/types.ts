export type UserRole = 'ADMIN' | 'KEPALA_SEKOLAH' | 'SUPERVISOR' | 'GURU';

export const PROGRAM_KEAHLIAN_OPTIONS = [
  'Desain Komunikasi Visual (DKV)',
  'Agribisnis Pengolahan Hasil Pertanian (APHP)',
  'Semua Program Keahlian'
] as const;

export type ProgramKeahlian = typeof PROGRAM_KEAHLIAN_OPTIONS[number];

export interface User {
  id: string;
  nama: string;
  username: string;
  password?: string;
  role: UserRole;
  status: 'Aktif' | 'Nonaktif';
  email?: string;
  nip?: string;
}

export interface Guru {
  id: string;
  nip: string;
  nuptk: string;
  nama: string;
  jenisKelamin: 'L' | 'P';
  mataPelajaran: string;
  programKeahlian: string;
  kelas: string;
  fase: 'E' | 'F';
  email: string;
  noHp: string;
  status: 'Aktif' | 'Cuti' | 'Pindah';
}

export interface Mapel {
  id: string;
  mataPelajaran: string;
  kelompok: 'Umum' | 'Kejuruan' | 'Pilihan' | 'Muatan Lokal';
  programKeahlian: string;
  fase: 'E' | 'F' | 'E & F';
  status: 'Aktif' | 'Nonaktif';
}

export type JadwalStatus = 'Terjadwal' | 'Selesai' | 'Ditunda' | 'Dibatalkan';

export interface JadwalSupervisi {
  id: string;
  tanggal: string;
  jam: string;
  guruId: string;
  namaGuru: string;
  mataPelajaran: string;
  kelas: string;
  fase: 'E' | 'F';
  supervisor: string;
  status: JadwalStatus;
  keterangan: string;
}

export interface IndikatorItem {
  id: number;
  aspekId: number;
  aspek: string;
  indikator: string;
  deskripsi: string;
  bobot?: number;
}

export interface AspekSupervisi {
  id: number;
  nama: string;
  deskripsi: string;
  indikatorList: IndikatorItem[];
}

export interface PenilaianDetail {
  id: string;
  idObservasi: string;
  indikatorId: number;
  aspek: string;
  indikator: string;
  skor: number; // 1 | 2 | 3 | 4
  catatanSupervisor: string;
}

export type KategoriNilai = 'Sangat Baik' | 'Baik' | 'Cukup' | 'Perlu Pembinaan';

export interface Observasi {
  id: string;
  idSupervisi: string;
  tanggalObservasi: string;
  guruId: string;
  namaGuru: string;
  nipGuru: string;
  mataPelajaran: string;
  kelas: string;
  fase: 'E' | 'F';
  supervisor: string;
  skorTotal: number;
  skorMaksimal: number;
  nilaiAkhir: number;
  kategori: KategoriNilai;
  catatan: string;
  rekomendasi: string;
  kekuatan: string;
  perluDitingkatkan: string;
  tindakLanjut: string;
  bentukPembinaan: string;
  targetPerbaikan: string;
  jadwalLanjutan?: string;
  statusTindakLanjut: 'Belum ditindaklanjuti' | 'Dalam proses' | 'Selesai';
  penilaianList?: PenilaianDetail[];
}

export interface DashboardStats {
  totalGuru: number;
  guruSudahDisupervisi: number;
  guruBelumDisupervisi: number;
  totalJadwal: number;
  jadwalMendatang: number;
  rataRataNilai: number;
  countSangatBaik: number;
  countBaik: number;
  countCukup: number;
  countPerluPembinaan: number;
}
