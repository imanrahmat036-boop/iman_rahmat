import { AspekSupervisi, IndikatorItem } from '../types';

export const INSTRUMEN_ASPEK: AspekSupervisi[] = [
  {
    id: 1,
    nama: 'PERENCANAAN PEMBELAJARAN',
    deskripsi: 'Kelengkapan dan keselarasan modul ajar / RPP berbasis Kurikulum Merdeka',
    indikatorList: [
      {
        id: 1,
        aspekId: 1,
        aspek: 'PERENCANAAN PEMBELAJARAN',
        indikator: 'Tujuan pembelajaran jelas',
        deskripsi: 'Tujuan pembelajaran dirumuskan secara terukur, spesifik, dan memuat kompetensi serta konten.'
      },
      {
        id: 2,
        aspekId: 1,
        aspek: 'PERENCANAAN PEMBELAJARAN',
        indikator: 'Tujuan pembelajaran sesuai capaian pembelajaran',
        deskripsi: 'Kesesuaian tujuan pembelajaran dengan Capaian Pembelajaran (CP) Fase yang diampu.'
      },
      {
        id: 3,
        aspekId: 1,
        aspek: 'PERENCANAAN PEMBELAJARAN',
        indikator: 'Perencanaan pembelajaran sesuai karakteristik peserta didik',
        deskripsi: 'Rancangan modul ajar mempertimbangkan kesiapan belajar, minat, dan latar belakang siswa SMK.'
      },
      {
        id: 4,
        aspekId: 1,
        aspek: 'PERENCANAAN PEMBELAJARAN',
        indikator: 'Materi pembelajaran relevan',
        deskripsi: 'Materi ajar relevan dengan kebutuhan industri/dunia kerja dan kontekstual kejuruan.'
      },
      {
        id: 5,
        aspekId: 1,
        aspek: 'PERENCANAAN PEMBELAJARAN',
        indikator: 'Metode/model pembelajaran sesuai tujuan',
        deskripsi: 'Penggunaan model inovatif (misal: PjBL, PBL, Discovery Learning, Teaching Factory) sesuai tujuan.'
      },
      {
        id: 6,
        aspekId: 1,
        aspek: 'PERENCANAAN PEMBELAJARAN',
        indikator: 'Media dan sumber belajar sesuai',
        deskripsi: 'Media, bahan tayang, alat peraga, dan sumber belajar dirancang mendukung pemahaman peserta didik.'
      },
      {
        id: 7,
        aspekId: 1,
        aspek: 'PERENCANAAN PEMBELAJARAN',
        indikator: 'Perencanaan asesmen jelas',
        deskripsi: 'Terdapat kriteria penilaian, rubrik, dan instrumen asesmen yang jelas dan selaras dengan tujuan.'
      },
      {
        id: 8,
        aspekId: 1,
        aspek: 'PERENCANAAN PEMBELAJARAN',
        indikator: 'Memperhatikan diferensiasi pembelajaran jika relevan',
        deskripsi: 'Rancangan menyediakan pilihan konten, proses, atau produk sesuai keberagaman kecepatan belajar siswa.'
      }
    ]
  },
  {
    id: 2,
    nama: 'PELAKSANAAN PEMBELAJARAN',
    deskripsi: 'Aktivitas proses belajar mengajar di kelas/bengkel/laboratorium',
    indikatorList: [
      {
        id: 9,
        aspekId: 2,
        aspek: 'PELAKSANAAN PEMBELAJARAN',
        indikator: 'Guru membuka pembelajaran dengan baik',
        deskripsi: 'Menyapa siswa, berdoa bersama, memeriksa kehadiran, membangun suasana hangat dan apersepsi.'
      },
      {
        id: 10,
        aspekId: 2,
        aspek: 'PELAKSANAAN PEMBELAJARAN',
        indikator: 'Guru menyampaikan tujuan pembelajaran',
        deskripsi: 'Menjelaskan tujuan pembelajaran dan manfaat nyata bagi kompetensi kejuruan/kehidupan peserta didik.'
      },
      {
        id: 11,
        aspekId: 2,
        aspek: 'PELAKSANAAN PEMBELAJARAN',
        indikator: 'Guru menciptakan suasana belajar yang positif',
        deskripsi: 'Membangun iklim kelas yang aman, saling menghargai, antusias, dan bebas dari intimidasi.'
      },
      {
        id: 12,
        aspekId: 2,
        aspek: 'PELAKSANAAN PEMBELAJARAN',
        indikator: 'Guru mengaktifkan peserta didik',
        deskripsi: 'Mendorong semua siswa untuk berpartisipasi aktif, bertanya, berpendapat, dan mencoba praktik.'
      },
      {
        id: 13,
        aspekId: 2,
        aspek: 'PELAKSANAAN PEMBELAJARAN',
        indikator: 'Pembelajaran berpusat pada peserta didik',
        deskripsi: 'Guru berperan sebagai fasilitator, siswa mengeksplorasi konsep dan mempraktikkan keterampilan.'
      },
      {
        id: 14,
        aspekId: 2,
        aspek: 'PELAKSANAAN PEMBELAJARAN',
        indikator: 'Guru menggunakan metode/model pembelajaran yang sesuai',
        deskripsi: 'Sintaks model pembelajaran dijalankan secara terstruktur dan terarah dalam proses pembelajaran.'
      },
      {
        id: 15,
        aspekId: 2,
        aspek: 'PELAKSANAAN PEMBELAJARAN',
        indikator: 'Guru menggunakan media pembelajaran secara efektif',
        deskripsi: 'Media/alat peraga/bengkel dioperasikan optimal untuk memperjelas konsep dan keterampilan.'
      },
      {
        id: 16,
        aspekId: 2,
        aspek: 'PELAKSANAAN PEMBELAJARAN',
        indikator: 'Guru mengembangkan kemampuan berpikir kritis',
        deskripsi: 'Mengajukan pertanyaan pemantik tingkat tinggi (HOTS) dan memfasilitasi pemecahan masalah.'
      },
      {
        id: 17,
        aspekId: 2,
        aspek: 'PELAKSANAAN PEMBELAJARAN',
        indikator: 'Guru mendorong kolaborasi dan komunikasi',
        deskripsi: 'Memfasilitasi kerja kelompok terarah, diskusi aktif, dan presentasi hasil karya peserta didik.'
      },
      {
        id: 18,
        aspekId: 2,
        aspek: 'PELAKSANAAN PEMBELAJARAN',
        indikator: 'Guru mengaitkan pembelajaran dengan konteks kehidupan nyata',
        deskripsi: 'Menghubungkan materi dengan dunia kerja, industri, isu lokal Tasikmalaya/Jawa Barat, dan kehidupan siswa.'
      },
      {
        id: 19,
        aspekId: 2,
        aspek: 'PELAKSANAAN PEMBELAJARAN',
        indikator: 'Guru melakukan asesmen selama proses pembelajaran',
        deskripsi: 'Melakukan observasi keaktifan, mengajukan cek pemahaman, dan mencatat progres belajar siswa.'
      },
      {
        id: 20,
        aspekId: 2,
        aspek: 'PELAKSANAAN PEMBELAJARAN',
        indikator: 'Guru memberikan umpan balik',
        deskripsi: 'Memberikan umpan balik konstruktif, tepat waktu, dan memotivasi peningkatan performa siswa.'
      },
      {
        id: 21,
        aspekId: 2,
        aspek: 'PELAKSANAAN PEMBELAJARAN',
        indikator: 'Guru melakukan pengelolaan kelas dengan baik',
        deskripsi: 'Mengatur waktu, ruang gerak, ketertiban, keselamatan kerja bengkel (K3), dan transisi kegiatan.'
      },
      {
        id: 22,
        aspekId: 2,
        aspek: 'PELAKSANAAN PEMBELAJARAN',
        indikator: 'Guru melakukan penyesuaian pembelajaran berdasarkan kondisi peserta didik',
        deskripsi: 'Fleksibel merespons kesulitan siswa atau memberikan pengayaan bagi yang cepat paham.'
      }
    ]
  },
  {
    id: 3,
    nama: 'ASESMEN PEMBELAJARAN',
    deskripsi: 'Pelaksanaan asesmen diagnostik, formatif, dan sumatif',
    indikatorList: [
      {
        id: 23,
        aspekId: 3,
        aspek: 'ASESMEN PEMBELAJARAN',
        indikator: 'Asesmen diagnostik jika diperlukan',
        deskripsi: 'Mendeteksi pemahaman awal atau gaya belajar siswa sebelum masuk ke materi inti.'
      },
      {
        id: 24,
        aspekId: 3,
        aspek: 'ASESMEN PEMBELAJARAN',
        indikator: 'Asesmen formatif',
        deskripsi: 'Menggunakan asesmen formatif berkala selama pembelajaran untuk memantau kemajuan peserta didik.'
      },
      {
        id: 25,
        aspekId: 3,
        aspek: 'ASESMEN PEMBELAJARAN',
        indikator: 'Asesmen sumatif',
        deskripsi: 'Melaksanakan asesmen sumatif terencana untuk mengukur ketercapaian tujuan pembelajaran.'
      },
      {
        id: 26,
        aspekId: 3,
        aspek: 'ASESMEN PEMBELAJARAN',
        indikator: 'Instrumen asesmen sesuai tujuan pembelajaran',
        deskripsi: 'Alat ukur (lembar kerja, tes praktik, rubrik portofolio) valid mengukur kompetensi yang dituju.'
      },
      {
        id: 27,
        aspekId: 3,
        aspek: 'ASESMEN PEMBELAJARAN',
        indikator: 'Asesmen memberikan informasi perkembangan peserta didik',
        deskripsi: 'Hasil asesmen menggambarkan peta kekuatan dan kelemahan belajar setiap peserta didik secara autentik.'
      },
      {
        id: 28,
        aspekId: 3,
        aspek: 'ASESMEN PEMBELAJARAN',
        indikator: 'Guru memberikan umpan balik',
        deskripsi: 'Catatan hasil asesmen dikomunikasikan secara jelas kepada siswa untuk perbaikan.'
      },
      {
        id: 29,
        aspekId: 3,
        aspek: 'ASESMEN PEMBELAJARAN',
        indikator: 'Hasil asesmen digunakan untuk perbaikan pembelajaran',
        deskripsi: 'Data nilai/observasi dijadikan dasar merancang remedial, pengayaan, dan refleksi modul guru.'
      }
    ]
  },
  {
    id: 4,
    nama: 'PEMANFAATAN TEKNOLOGI',
    deskripsi: 'Integrasi teknologi informasi dan media digital dalam pembelajaran',
    indikatorList: [
      {
        id: 30,
        aspekId: 4,
        aspek: 'PEMANFAATAN TEKNOLOGI',
        indikator: 'Pemanfaatan teknologi sesuai kebutuhan',
        deskripsi: 'Menggunakan hardware/software yang relevan dan tepat guna sesuai tuntutan materi pembelajaran.'
      },
      {
        id: 31,
        aspekId: 4,
        aspek: 'PEMANFAATAN TEKNOLOGI',
        indikator: 'Media digital mendukung pembelajaran',
        deskripsi: 'Slide interaktif, video tutorial, simulasi, atau aplikasi LMS memperjelas pemahaman materi.'
      },
      {
        id: 32,
        aspekId: 4,
        aspek: 'PEMANFAATAN TEKNOLOGI',
        indikator: 'Guru menggunakan sumber belajar digital secara tepat',
        deskripsi: 'Memanfaatkan referensi digital, modul online, e-library, atau portal Rumah Belajar/Merdeka Mengajar.'
      },
      {
        id: 33,
        aspekId: 4,
        aspek: 'PEMANFAATAN TEKNOLOGI',
        indikator: 'Teknologi meningkatkan keterlibatan peserta didik',
        deskripsi: 'Penggunaan kuis interaktif, kolaborasi dokumen digital, atau perangkat lunak kejuruan menaikkan antusiasme.'
      }
    ]
  },
  {
    id: 5,
    nama: 'PENGUATAN KARAKTER DAN BUDAYA POSITIF',
    deskripsi: 'Internalisasi Profil Pelajar Pancasila dan budaya kerja industri (5R/5S)',
    indikatorList: [
      {
        id: 34,
        aspekId: 5,
        aspek: 'PENGUATAN KARAKTER DAN BUDAYA POSITIF',
        indikator: 'Guru menunjukkan keteladanan',
        deskripsi: 'Menampilkan sikap profesional, tepat waktu, santun, bertutur kata positif, dan berpakaian rapi.'
      },
      {
        id: 35,
        aspekId: 5,
        aspek: 'PENGUATAN KARAKTER DAN BUDAYA POSITIF',
        indikator: 'Mengembangkan sikap disiplin',
        deskripsi: 'Menanamkan budaya tepat waktu, ketaatan pada SOP bengkel/kelas, dan konsistensi tata tertib.'
      },
      {
        id: 36,
        aspekId: 5,
        aspek: 'PENGUATAN KARAKTER DAN BUDAYA POSITIF',
        indikator: 'Mengembangkan tanggung jawab',
        deskripsi: 'Mendorong siswa merawat peralatan, menuntaskan tugas mandiri dan kelompok, serta menjaga kebersihan.'
      },
      {
        id: 37,
        aspekId: 5,
        aspek: 'PENGUATAN KARAKTER DAN BUDAYA POSITIF',
        indikator: 'Mengembangkan gotong royong/kolaborasi',
        deskripsi: 'Membiasakan saling membantu, bekerja dalam tim yang solid, dan menghargai kontribusi rekan.'
      },
      {
        id: 38,
        aspekId: 5,
        aspek: 'PENGUATAN KARAKTER DAN BUDAYA POSITIF',
        indikator: 'Menghargai keberagaman',
        deskripsi: 'Menghargai perbedaan pendapat, latar belakang, dan kemampuan antar peserta didik tanpa diskriminasi.'
      },
      {
        id: 39,
        aspekId: 5,
        aspek: 'PENGUATAN KARAKTER DAN BUDAYA POSITIF',
        indikator: 'Menciptakan lingkungan belajar yang aman dan inklusif',
        deskripsi: 'Memastikan ruang kelas/bengkel bebas dari perundungan (bullying), kekerasan, dan nyaman bagi semua siswa.'
      }
    ]
  }
];

export const TOTAL_INDIKATOR = INSTRUMEN_ASPEK.reduce((acc, curr) => acc + curr.indikatorList.length, 0); // 39
export const SKOR_MAKSIMAL_TOTAL = TOTAL_INDIKATOR * 4; // 156

export function calculateScoreAndCategory(penilaian: Record<number, number>): {
  skorTotal: number;
  skorMaksimal: number;
  nilaiAkhir: number;
  kategori: 'Sangat Baik' | 'Baik' | 'Cukup' | 'Perlu Pembinaan';
} {
  let total = 0;
  let count = 0;

  for (const asp of INSTRUMEN_ASPEK) {
    for (const ind of asp.indikatorList) {
      count++;
      const val = penilaian[ind.id] || 0;
      total += val;
    }
  }

  const skorMaksimal = count * 4;
  const nilaiAkhir = skorMaksimal > 0 ? Math.round((total / skorMaksimal) * 100 * 10) / 10 : 0;

  let kategori: 'Sangat Baik' | 'Baik' | 'Cukup' | 'Perlu Pembinaan' = 'Perlu Pembinaan';
  if (nilaiAkhir >= 91) {
    kategori = 'Sangat Baik';
  } else if (nilaiAkhir >= 81) {
    kategori = 'Baik';
  } else if (nilaiAkhir >= 71) {
    kategori = 'Cukup';
  } else {
    kategori = 'Perlu Pembinaan';
  }

  return {
    skorTotal: total,
    skorMaksimal,
    nilaiAkhir,
    kategori
  };
}

export function generateAutoRecommendations(
  nilaiAkhir: number,
  kategori: string,
  aspekScores: { nama: string; percentage: number }[]
): { kekuatan: string; perluDitingkatkan: string; rekomendasi: string; tindakLanjut: string } {
  const sortedAspek = [...aspekScores].sort((a, b) => b.percentage - a.percentage);
  const bestAspek = sortedAspek[0]?.nama || 'Pelaksanaan Pembelajaran';
  const lowestAspek = sortedAspek[sortedAspek.length - 1]?.nama || 'Pemanfaatan Teknologi';

  let kekuatan = `Guru menunjukkan penguasaan yang sangat baik pada aspek ${bestAspek.toLowerCase()}, mampu mengelola kelas dengan interaktif dan menciptakan keterlibatan aktif peserta didik.`;
  let perluDitingkatkan = `Penguatan pada aspek ${lowestAspek.toLowerCase()}, khususnya dalam diferensiasi pembelajaran dan integrasi asesmen formatif yang teratur.`;
  let rekomendasi = '';
  let tindakLanjut = '';

  if (nilaiAkhir >= 91) {
    rekomendasi = 'Pertahankan kinerja unggul dan jadilah guru model/mentor sebaya bagi rekan pendidik di lingkungan SMK Negeri Bojonggambir.';
    tindakLanjut = 'Disarankan berbagi praktik baik (best practices) pada forum Komunitas Belajar (Kombel) / MGMP Sekolah.';
  } else if (nilaiAkhir >= 81) {
    rekomendasi = 'Lanjutkan konsistensi pembelajaran berpusat pada siswa dan tingkatkan pemanfaatan sumber belajar digital dan variasi asesmen.';
    tindakLanjut = 'Mengikuti workshop pendalaman diferensiasi modul ajar dan optimalisasi media digital pembelajaran.';
  } else if (nilaiAkhir >= 71) {
    rekomendasi = 'Perlu perbaikan dalam perancangan tujuan pembelajaran terukur dan teknik asesmen formatif selama proses pembelajaran berlangsung.';
    tindakLanjut = 'Pendampingan klinis (coaching) bersama supervisor dan penelaahan ulang modul ajar sebelum kegiatan supervisi lanjutan.';
  } else {
    rekomendasi = 'Diperlukan pembinaan intensif terkait pemahaman capaian pembelajaran Kurikulum Merdeka, pengelolaan kelas, dan penerapan model ajar inovatif.';
    tindakLanjut = 'Mengikuti program coaching berkala oleh Kepala Sekolah/Wakil Kepala Bidang Kurikulum dan supervisi klinis ulang dalam 30 hari kerja.';
  }

  return {
    kekuatan,
    perluDitingkatkan,
    rekomendasi,
    tindakLanjut
  };
}
