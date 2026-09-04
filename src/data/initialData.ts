import { Guru, Mapel, JadwalSupervisi, Observasi, User, PenilaianDetail } from '../types';
import { INSTRUMEN_ASPEK } from './instrumentData';

export const INITIAL_USERS: User[] = [
  {
    id: 'USR-001',
    nama: 'Administrator SIPES-GURU',
    username: 'admin',
    password: 'password123',
    role: 'ADMIN',
    status: 'Aktif',
    email: 'admin.sipes@smknbojonggambir.sch.id'
  },
  {
    id: 'USR-002',
    nama: 'Drs. H. Dadang Suryana, M.Pd.',
    username: 'kepala',
    password: 'password123',
    role: 'KEPALA_SEKOLAH',
    status: 'Aktif',
    nip: '196805121994031005',
    email: 'kepala@smknbojonggambir.sch.id'
  },
  {
    id: 'USR-003',
    nama: 'Drs. Asep Nugraha, M.Pd. (Waka Kurikulum)',
    username: 'supervisor1',
    password: 'password123',
    role: 'SUPERVISOR',
    status: 'Aktif',
    nip: '197408152002121003',
    email: 'asep.nugraha@smknbojonggambir.sch.id'
  },
  {
    id: 'USR-004',
    nama: 'Hj. Siti Rohmah, S.Pd., M.M.',
    username: 'supervisor2',
    password: 'password123',
    role: 'SUPERVISOR',
    status: 'Aktif',
    nip: '197904222006042011',
    email: 'siti.rohmah@smknbojonggambir.sch.id'
  },
  {
    id: 'USR-005',
    nama: 'Iman Rahmat, S.Kom., Gr.',
    username: 'iman.rahmat',
    password: 'password123',
    role: 'GURU',
    status: 'Aktif',
    nip: '198906142019031008',
    email: 'iman.rahmat246@guru.smk.belajar.id'
  },
  {
    id: 'USR-006',
    nama: 'Rian Hidayat, S.T.',
    username: 'rian.hidayat',
    password: 'password123',
    role: 'GURU',
    status: 'Aktif',
    nip: '198711052015041002',
    email: 'rian.hidayat@smknbojonggambir.sch.id'
  }
];

export const INITIAL_MAPEL: Mapel[] = [
  {
    id: 'MP-001',
    mataPelajaran: 'Dasar-dasar Desain Komunikasi Visual',
    kelompok: 'Kejuruan',
    programKeahlian: 'Desain Komunikasi Visual (DKV)',
    fase: 'E',
    status: 'Aktif'
  },
  {
    id: 'MP-002',
    mataPelajaran: 'Perangkat Lunak Desain Grafis & Ilustrasi Digital',
    kelompok: 'Kejuruan',
    programKeahlian: 'Desain Komunikasi Visual (DKV)',
    fase: 'F',
    status: 'Aktif'
  },
  {
    id: 'MP-003',
    mataPelajaran: 'Fotografi, Videografi & Audio Visual',
    kelompok: 'Kejuruan',
    programKeahlian: 'Desain Komunikasi Visual (DKV)',
    fase: 'F',
    status: 'Aktif'
  },
  {
    id: 'MP-004',
    mataPelajaran: 'Desain Publikasi, Percetakan & Branding',
    kelompok: 'Kejuruan',
    programKeahlian: 'Desain Komunikasi Visual (DKV)',
    fase: 'F',
    status: 'Aktif'
  },
  {
    id: 'MP-005',
    mataPelajaran: 'Dasar-dasar Agribisnis Pengolahan Hasil Pertanian',
    kelompok: 'Kejuruan',
    programKeahlian: 'Agribisnis Pengolahan Hasil Pertanian (APHP)',
    fase: 'E',
    status: 'Aktif'
  },
  {
    id: 'MP-006',
    mataPelajaran: 'Produksi Pengolahan Hasil Nabati',
    kelompok: 'Kejuruan',
    programKeahlian: 'Agribisnis Pengolahan Hasil Pertanian (APHP)',
    fase: 'F',
    status: 'Aktif'
  },
  {
    id: 'MP-007',
    mataPelajaran: 'Produksi Pengolahan Hasil Hewani',
    kelompok: 'Kejuruan',
    programKeahlian: 'Agribisnis Pengolahan Hasil Pertanian (APHP)',
    fase: 'F',
    status: 'Aktif'
  },
  {
    id: 'MP-008',
    mataPelajaran: 'Keamanan Pangan, Sanitasi dan Pengujian Mutu',
    kelompok: 'Kejuruan',
    programKeahlian: 'Agribisnis Pengolahan Hasil Pertanian (APHP)',
    fase: 'F',
    status: 'Aktif'
  },
  {
    id: 'MP-009',
    mataPelajaran: 'Bahasa Inggris Komunikasi Kejuruan',
    kelompok: 'Umum',
    programKeahlian: 'Semua Program Keahlian',
    fase: 'E & F',
    status: 'Aktif'
  },
  {
    id: 'MP-010',
    mataPelajaran: 'Matematika Terapan SMK',
    kelompok: 'Umum',
    programKeahlian: 'Semua Program Keahlian',
    fase: 'E & F',
    status: 'Aktif'
  },
  {
    id: 'MP-011',
    mataPelajaran: 'Projek Kreatif dan Kewirausahaan (PKK)',
    kelompok: 'Kejuruan',
    programKeahlian: 'Semua Program Keahlian',
    fase: 'F',
    status: 'Aktif'
  },
  {
    id: 'MP-012',
    mataPelajaran: 'Pendidikan Pancasila dan Budaya Kerja',
    kelompok: 'Umum',
    programKeahlian: 'Semua Program Keahlian',
    fase: 'E',
    status: 'Aktif'
  }
];

export const INITIAL_GURU: Guru[] = [
  {
    id: 'GURU-001',
    nip: '198906142019031008',
    nuptk: '4532767668130092',
    nama: 'Iman Rahmat, S.Kom., Gr.',
    jenisKelamin: 'L',
    mataPelajaran: 'Perangkat Lunak Desain Grafis & Ilustrasi Digital',
    programKeahlian: 'Desain Komunikasi Visual (DKV)',
    kelas: 'XI DKV 1, XI DKV 2',
    fase: 'F',
    email: 'iman.rahmat246@guru.smk.belajar.id',
    noHp: '081321456789',
    status: 'Aktif'
  },
  {
    id: 'GURU-002',
    nip: '198711052015041002',
    nuptk: '7645765667210083',
    nama: 'Rian Hidayat, S.Ds.',
    jenisKelamin: 'L',
    mataPelajaran: 'Fotografi, Videografi & Audio Visual',
    programKeahlian: 'Desain Komunikasi Visual (DKV)',
    kelas: 'XII DKV 1, XII DKV 2',
    fase: 'F',
    email: 'rian.hidayat@smknbojonggambir.sch.id',
    noHp: '085223344556',
    status: 'Aktif'
  },
  {
    id: 'GURU-003',
    nip: '199203182020122014',
    nuptk: '9845770671230041',
    nama: 'Dewi Lestari, S.Pd.',
    jenisKelamin: 'P',
    mataPelajaran: 'Bahasa Inggris Komunikasi Kejuruan',
    programKeahlian: 'Semua Program Keahlian',
    kelas: 'X DKV, X APHP, XI DKV',
    fase: 'E',
    email: 'dewi.lestari@smknbojonggambir.sch.id',
    noHp: '087788991122',
    status: 'Aktif'
  },
  {
    id: 'GURU-004',
    nip: '198402102010011015',
    nuptk: '3456762664200052',
    nama: 'Ahmad Fauzi, S.T.P.',
    jenisKelamin: 'L',
    mataPelajaran: 'Produksi Pengolahan Hasil Nabati',
    programKeahlian: 'Agribisnis Pengolahan Hasil Pertanian (APHP)',
    kelas: 'XI APHP 1, XII APHP 1',
    fase: 'F',
    email: 'ahmad.fauzi@smknbojonggambir.sch.id',
    noHp: '081299887766',
    status: 'Aktif'
  },
  {
    id: 'GURU-005',
    nip: '199008242019031006',
    nuptk: '5632768669140023',
    nama: 'Yudi Kurniawan, S.Pd.',
    jenisKelamin: 'L',
    mataPelajaran: 'Matematika Terapan SMK',
    programKeahlian: 'Semua Program Keahlian',
    kelas: 'X DKV, X APHP',
    fase: 'E',
    email: 'yudi.kurniawan@smknbojonggambir.sch.id',
    noHp: '082114455667',
    status: 'Aktif'
  },
  {
    id: 'GURU-006',
    nip: '199401122022032009',
    nuptk: '1245772673220015',
    nama: 'Nurul Hidayati, S.T.P., M.Si.',
    jenisKelamin: 'P',
    mataPelajaran: 'Keamanan Pangan, Sanitasi dan Pengujian Mutu',
    programKeahlian: 'Agribisnis Pengolahan Hasil Pertanian (APHP)',
    kelas: 'XI APHP 1',
    fase: 'F',
    email: 'nurul.hidayati@smknbojonggambir.sch.id',
    noHp: '081399882211',
    status: 'Aktif'
  },
  {
    id: 'GURU-007',
    nip: '198305092009021004',
    nuptk: '8956761663110034',
    nama: 'Cecep Hendra, S.Sn.',
    jenisKelamin: 'L',
    mataPelajaran: 'Dasar-dasar Desain Komunikasi Visual',
    programKeahlian: 'Desain Komunikasi Visual (DKV)',
    kelas: 'X DKV 1, X DKV 2',
    fase: 'E',
    email: 'cecep.hendra@smknbojonggambir.sch.id',
    noHp: '085311223344',
    status: 'Aktif'
  },
  {
    id: 'GURU-008',
    nip: '198812292014022003',
    nuptk: '6745766668200071',
    nama: 'Eni Maryani, S.P.',
    jenisKelamin: 'P',
    mataPelajaran: 'Dasar-dasar Agribisnis Pengolahan Hasil Pertanian',
    programKeahlian: 'Agribisnis Pengolahan Hasil Pertanian (APHP)',
    kelas: 'X APHP 1',
    fase: 'E',
    email: 'eni.maryani@smknbojonggambir.sch.id',
    noHp: '087822334455',
    status: 'Aktif'
  }
];

export const INITIAL_JADWAL: JadwalSupervisi[] = [
  {
    id: 'SUP-2026-001',
    tanggal: '2026-09-08',
    jam: '08:00 - 09:30',
    guruId: 'GURU-001',
    namaGuru: 'Iman Rahmat, S.Kom., Gr.',
    mataPelajaran: 'Perangkat Lunak Desain Grafis & Ilustrasi Digital',
    kelas: 'XI DKV 1',
    fase: 'F',
    supervisor: 'Drs. H. Dadang Suryana, M.Pd.',
    status: 'Selesai',
    keterangan: 'Supervisi PjBL Studio DKV: Desain Identitas Visual (Branding & Packaging Produk UMKM)'
  },
  {
    id: 'SUP-2026-002',
    tanggal: '2026-09-10',
    jam: '09:45 - 11:15',
    guruId: 'GURU-004',
    namaGuru: 'Ahmad Fauzi, S.T.P.',
    mataPelajaran: 'Produksi Pengolahan Hasil Nabati',
    kelas: 'XI APHP 1',
    fase: 'F',
    supervisor: 'Drs. Asep Nugraha, M.Pd. (Waka Kurikulum)',
    status: 'Selesai',
    keterangan: 'Praktik Lab APHP: Formulasi & Pengolahan Selai Buah Lokal serta Uji Sterilisasi Kemasan'
  },
  {
    id: 'SUP-2026-003',
    tanggal: '2026-09-12',
    jam: '07:30 - 09:00',
    guruId: 'GURU-003',
    namaGuru: 'Dewi Lestari, S.Pd.',
    mataPelajaran: 'Bahasa Inggris Komunikasi Kejuruan',
    kelas: 'X DKV',
    fase: 'E',
    supervisor: 'Hj. Siti Rohmah, S.Pd., M.M.',
    status: 'Selesai',
    keterangan: 'Simulasi Pitching Portofolio Desain & Client Communication in English'
  },
  {
    id: 'SUP-2026-004',
    tanggal: '2026-09-15',
    jam: '10:00 - 11:30',
    guruId: 'GURU-002',
    namaGuru: 'Rian Hidayat, S.Ds.',
    mataPelajaran: 'Fotografi, Videografi & Audio Visual',
    kelas: 'XII DKV 1',
    fase: 'F',
    supervisor: 'Drs. Asep Nugraha, M.Pd. (Waka Kurikulum)',
    status: 'Selesai',
    keterangan: 'Praktik Studio Fotografi Komersial Produk Makanan Olahan APHP & Lighting Setup'
  },
  {
    id: 'SUP-2026-005',
    tanggal: '2026-09-18',
    jam: '08:00 - 09:30',
    guruId: 'GURU-005',
    namaGuru: 'Yudi Kurniawan, S.Pd.',
    mataPelajaran: 'Matematika Terapan SMK',
    kelas: 'X APHP',
    fase: 'E',
    supervisor: 'Drs. H. Dadang Suryana, M.Pd.',
    status: 'Terjadwal',
    keterangan: 'Materi Perhitungan Rendemen dan Rasio Formulasi Bahan Olahan Pertanian'
  },
  {
    id: 'SUP-2026-006',
    tanggal: '2026-09-22',
    jam: '10:15 - 11:45',
    guruId: 'GURU-006',
    namaGuru: 'Nurul Hidayati, S.T.P., M.Si.',
    mataPelajaran: 'Keamanan Pangan, Sanitasi dan Pengujian Mutu',
    kelas: 'XI APHP 1',
    fase: 'F',
    supervisor: 'Hj. Siti Rohmah, S.Pd., M.M.',
    status: 'Terjadwal',
    keterangan: 'Penerapan Standar SSOP, Uji Organoleptik dan Hazard Analysis Critical Control Point (HACCP)'
  }
];

// Helper to create pre-filled detail scoring for completed observations
function generateSampleDetails(obsId: string, baseScore: 4 | 3): PenilaianDetail[] {
  const details: PenilaianDetail[] = [];
  let indIdx = 1;
  for (const asp of INSTRUMEN_ASPEK) {
    for (const ind of asp.indikatorList) {
      // make slight variations
      let score: number = baseScore;
      if (indIdx % 7 === 0) score = Math.max(1, baseScore - 1);
      if (indIdx % 5 === 0 && baseScore === 3) score = 4;
      details.push({
        id: `PNL-${obsId}-${ind.id}`,
        idObservasi: obsId,
        indikatorId: ind.id,
        aspek: ind.aspek,
        indikator: ind.indikator,
        skor: score,
        catatanSupervisor: score === 4 ? 'Terlaksana sangat baik dan sistematis.' : 'Sudah dilaksanakan dengan baik sesuai kaidah.'
      });
      indIdx++;
    }
  }
  return details;
}

export const INITIAL_OBSERVASI: Observasi[] = [
  {
    id: 'OBS-2026-001',
    idSupervisi: 'SUP-2026-001',
    tanggalObservasi: '2026-09-08',
    guruId: 'GURU-001',
    namaGuru: 'Iman Rahmat, S.Kom., Gr.',
    nipGuru: '198906142019031008',
    mataPelajaran: 'Perangkat Lunak Desain Grafis & Ilustrasi Digital',
    kelas: 'XI DKV 1',
    fase: 'F',
    supervisor: 'Drs. H. Dadang Suryana, M.Pd.',
    skorTotal: 148,
    skorMaksimal: 156,
    nilaiAkhir: 94.9,
    kategori: 'Sangat Baik',
    catatan: 'Pembelajaran PjBL di Studio Komputer DKV berlangsung sangat tertib dan inspiratif. Siswa aktif merancang kemasan (packaging) dan branding produk lokal Bojonggambir.',
    kekuatan: 'Penguasaan software desain grafis (vector & bitmap) sangat mumpuni, integrasi Teaching Factory dengan pesanan riil industri nyata, interaksi kelas dinamis.',
    perluDitingkatkan: 'Alokasi waktu sesi peer-review antar kelompok perlu ditambah 5 menit agar siswa saling mengkritisi prinsip tipografi dan kontras warna secara mendalam.',
    rekomendasi: 'Pertahankan metode Teaching Factory (TeFa) DKV dan terus fasilitasi pameran karya portofolio digital siswa pada platform sekolah.',
    tindakLanjut: 'Mendiseminasi praktik baik penyusunan Modul Ajar PjBL DKV berbasis industri kepada rekan guru MGMP DKV.',
    bentukPembinaan: 'Diseminasi Komunitas Belajar (Kombel)',
    targetPerbaikan: 'Oktober 2026',
    jadwalLanjutan: '2026-11-15',
    statusTindakLanjut: 'Selesai',
    penilaianList: generateSampleDetails('OBS-2026-001', 4)
  },
  {
    id: 'OBS-2026-002',
    idSupervisi: 'SUP-2026-002',
    tanggalObservasi: '2026-09-10',
    guruId: 'GURU-004',
    namaGuru: 'Ahmad Fauzi, S.T.P.',
    nipGuru: '198402102010011015',
    mataPelajaran: 'Produksi Pengolahan Hasil Nabati',
    kelas: 'XI APHP 1',
    fase: 'F',
    supervisor: 'Drs. Asep Nugraha, M.Pd. (Waka Kurikulum)',
    skorTotal: 140,
    skorMaksimal: 156,
    nilaiAkhir: 89.7,
    kategori: 'Baik',
    catatan: 'Praktik di Laboratorium Pengolahan APHP mengedepankan Good Manufacturing Practices (GMP) dan sanitasi ketat. Siswa mengenakan APD lengkap (jas lab, masker, hairnet, sarung tangan).',
    kekuatan: 'Penerapan SOP keamanan pangan sangat disiplin, penanaman budaya industri 5R di lab APHP konsisten, pendampingan penimbangan bahan formulasi sangat akurat.',
    perluDitingkatkan: 'Lembar kerja asesmen performa (job sheet digital) perlu menyertakan lembar uji organoleptik berstandar SNI.',
    rekomendasi: 'Sinergikan produk olahan APHP (selai buah dan minuman herbal) dengan program keahlian DKV untuk pembuatan label dan kemasan komersial.',
    tindakLanjut: 'Mengikuti workshop penyusunan asesmen kinerja laboratorium pengolahan hasil pertanian.',
    bentukPembinaan: 'Pelatihan / Workshop Internal',
    targetPerbaikan: 'November 2026',
    jadwalLanjutan: '2026-11-20',
    statusTindakLanjut: 'Dalam proses',
    penilaianList: generateSampleDetails('OBS-2026-002', 3)
  },
  {
    id: 'OBS-2026-003',
    idSupervisi: 'SUP-2026-003',
    tanggalObservasi: '2026-09-12',
    guruId: 'GURU-003',
    namaGuru: 'Dewi Lestari, S.Pd.',
    nipGuru: '199203182020122014',
    mataPelajaran: 'Bahasa Inggris Komunikasi Kejuruan',
    kelas: 'X DKV',
    fase: 'E',
    supervisor: 'Hj. Siti Rohmah, S.Pd., M.M.',
    skorTotal: 142,
    skorMaksimal: 156,
    nilaiAkhir: 91.0,
    kategori: 'Sangat Baik',
    catatan: 'Suasana kelas sangat komunikatif dan kreatif, siswa berani mempresentasikan konsep desain logo mereka dalam bahasa Inggris melalui teknik presentasi singkat.',
    kekuatan: 'Apersepsi kontekstual dengan dunia industri kreatif DKV, pemanfaatan proyektor dan aplikasi interaktif membuat siswa sangat terlibat aktif.',
    perluDitingkatkan: 'Perhatikan penguatan kosakata teknis desain grafis bagi siswa yang baru mengenal istilah visual arts.',
    rekomendasi: 'Gunakan metode tutor sebaya (peer-tutoring) saat sesi latihan dialog negosiasi dengan klien asing.',
    tindakLanjut: 'Menerapkan lembar kerja berdiferensiasi pada modul ajar pertemuan selanjutnya.',
    bentukPembinaan: 'Coaching Teman Sejawat',
    targetPerbaikan: 'Oktober 2026',
    jadwalLanjutan: '2026-11-18',
    statusTindakLanjut: 'Dalam proses',
    penilaianList: generateSampleDetails('OBS-2026-003', 4)
  },
  {
    id: 'OBS-2026-004',
    idSupervisi: 'SUP-2026-004',
    tanggalObservasi: '2026-09-15',
    guruId: 'GURU-002',
    namaGuru: 'Rian Hidayat, S.Ds.',
    nipGuru: '198711052015041002',
    mataPelajaran: 'Fotografi, Videografi & Audio Visual',
    kelas: 'XII DKV 1',
    fase: 'F',
    supervisor: 'Drs. Asep Nugraha, M.Pd. (Waka Kurikulum)',
    skorTotal: 137,
    skorMaksimal: 156,
    nilaiAkhir: 87.8,
    kategori: 'Baik',
    catatan: 'Praktik di Studio Fotografi DKV berjalan produktif. Siswa mempraktikkan pemotretan produk komersial kemasan makanan hasil produksi siswa APHP.',
    kekuatan: 'Pemberian instruksi teknis kamera DSLR dan teknik lighting 3 titik (key, fill, rim light) sangat runtut dan mudah dipahami siswa.',
    perluDitingkatkan: 'Perlu bimbingan lebih intensif bagi siswa pada tahap editing color grading pasca pemotretan.',
    rekomendasi: 'Buat video micro-learning panduan editing foto produk untuk referensi mandiri siswa di rumah.',
    tindakLanjut: 'Kolaborasi pembuatan video pembelajaran bersama tim MGMP DKV.',
    bentukPembinaan: 'Pendampingan Antar-Keahlian',
    targetPerbaikan: 'November 2026',
    statusTindakLanjut: 'Belum ditindaklanjuti',
    penilaianList: generateSampleDetails('OBS-2026-004', 3)
  }
];
