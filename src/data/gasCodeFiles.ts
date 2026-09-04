export interface GasFile {
  name: string;
  type: 'server' | 'html';
  description: string;
  content: string;
}

export const GAS_FILES: GasFile[] = [
  {
    name: 'Config.gs',
    type: 'server',
    description: 'Konfigurasi Spreadsheet, Nama Sekolah, dan Variabel Global',
    content: `/**
 * SIPES-GURU SMK NEGERI BOJONGGAMBIR
 * File: Config.gs
 * Deskripsi: Konfigurasi nama sekolah, sheet database, dan konstanta sistem.
 */

const APP_CONFIG = {
  APP_NAME: "SIPES-GURU",
  FULL_NAME: "Sistem Informasi Supervisi Guru SMK Negeri Bojonggambir",
  SUB_TITLE: "Supervisi Pembelajaran Berbasis Kurikulum Merdeka",
  SCHOOL_NAME: "SMK NEGERI BOJONGGAMBIR",
  PROVINCE: "PEMERINTAH DAERAH PROVINSI JAWA BARAT",
  OFFICE: "DINAS PENDIDIKAN",
  KCD: "CABANG DINAS PENDIDIKAN WILAYAH XII",
  ADDRESS: "Jalan Raya Bojonggambir, Desa Campakasari, Kec. Bojonggambir, Kab. Tasikmalaya 46188",
  EMAIL: "smknegeribojonggambir@gmail.com",
  HEADMASTER: "Drs. H. Dadang Suryana, M.Pd.",
  HEADMASTER_NIP: "196805121994031005",
  
  // Nama Sheet Database
  SHEETS: {
    USERS: "USERS",
    GURU: "GURU",
    MAPEL: "MAPEL",
    JADWAL: "JADWAL_SUPERVISI",
    OBSERVASI: "OBSERVASI",
    PENILAIAN: "PENILAIAN"
  },
  
  // Skala Penilaian Kurikulum Merdeka
  SKOR_MAX_INDIKATOR: 4,
  TOTAL_INDIKATOR: 39,
  SKOR_MAX_TOTAL: 156
};

// Ambil spreadsheet aktif
function getSpreadsheet() {
  return SpreadsheetApp.getActiveSpreadsheet();
}
`
  },
  {
    name: 'Code.gs',
    type: 'server',
    description: 'Routing Web App (doGet, doPost) dan Templating Engine',
    content: `/**
 * SIPES-GURU SMK NEGERI BOJONGGAMBIR
 * File: Code.gs
 * Deskripsi: Entry point Web App Google Apps Script (doGet & doPost)
 */

function doGet(e) {
  var template = HtmlService.createTemplateFromFile('Index');
  template.config = APP_CONFIG;
  
  return template.evaluate()
    .setTitle(APP_CONFIG.APP_NAME + " - " + APP_CONFIG.SCHOOL_NAME)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// Fungsi include untuk menyertakan file HTML parsial (CSS.html, JavaScript.html, dll)
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

// Fungsi testing API endpoint via POST jika diakses secara REST
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var action = data.action;
    var result = {};
    
    switch (action) {
      case 'login':
        result = authLogin(data.username, data.password);
        break;
      case 'getDashboard':
        result = getDashboardData();
        break;
      default:
        result = { status: false, message: 'Aksi tidak dikenali' };
    }
    
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
`
  },
  {
    name: 'Database.gs',
    type: 'server',
    description: 'Inisialisasi Otomatis Sheet, Header Kolom, dan Seed Data Awal',
    content: `/**
 * SIPES-GURU SMK NEGERI BOJONGGAMBIR
 * File: Database.gs
 * Deskripsi: Otomasi pembuatan struktur tabel/sheet database Google Sheets
 */

function inisialisasiDatabaseOtomatis() {
  var ss = getSpreadsheet();
  var sheetsDef = [
    {
      name: APP_CONFIG.SHEETS.USERS,
      headers: ["ID", "Nama", "Username", "Password", "Role", "Status"],
      initialData: [
        ["USR-001", "Administrator SIPES", "admin", "admin123", "ADMIN", "Aktif"],
        ["USR-002", APP_CONFIG.HEADMASTER, "kepala", "kepala123", "KEPALA_SEKOLAH", "Aktif"],
        ["USR-003", "Drs. Asep Nugraha, M.Pd.", "supervisor", "super123", "SUPERVISOR", "Aktif"],
        ["USR-004", "Iman Rahmat, S.Kom., Gr.", "iman.rahmat", "guru123", "GURU", "Aktif"]
      ]
    },
    {
      name: APP_CONFIG.SHEETS.GURU,
      headers: ["ID Guru", "NIP", "NUPTK", "Nama Guru", "Jenis Kelamin", "Mata Pelajaran", "Program Keahlian", "Kelas yang Diampu", "Email", "No HP", "Status"],
      initialData: [
        ["GURU-001", "198906142019031008", "4532767668130092", "Iman Rahmat, S.Kom., Gr.", "L", "Perangkat Lunak Desain Grafis & Ilustrasi Digital", "Desain Komunikasi Visual (DKV)", "XI DKV 1, XI DKV 2", "iman.rahmat246@guru.smk.belajar.id", "081321456789", "Aktif"],
        ["GURU-002", "198711052015041002", "7645765667210083", "Rian Hidayat, S.Ds.", "L", "Fotografi, Videografi & Audio Visual", "Desain Komunikasi Visual (DKV)", "XII DKV 1, XII DKV 2", "rian.hidayat@smknbojonggambir.sch.id", "085223344556", "Aktif"],
        ["GURU-003", "199203182020122014", "9845770671230041", "Dewi Lestari, S.Pd.", "P", "Bahasa Inggris Komunikasi Kejuruan", "Semua Program Keahlian", "X DKV, X APHP, XI DKV", "dewi.lestari@smknbojonggambir.sch.id", "087788991122", "Aktif"],
        ["GURU-004", "198402102010011015", "3456762664200052", "Ahmad Fauzi, S.T.P.", "L", "Produksi Pengolahan Hasil Nabati", "Agribisnis Pengolahan Hasil Pertanian (APHP)", "XI APHP 1, XII APHP 1", "ahmad.fauzi@smknbojonggambir.sch.id", "081299887766", "Aktif"]
      ]
    },
    {
      name: APP_CONFIG.SHEETS.MAPEL,
      headers: ["ID", "Mata Pelajaran", "Kelompok", "Program Keahlian", "Fase", "Status"],
      initialData: [
        ["MP-001", "Dasar-dasar Desain Komunikasi Visual", "Kejuruan", "Desain Komunikasi Visual (DKV)", "E", "Aktif"],
        ["MP-002", "Perangkat Lunak Desain Grafis & Ilustrasi Digital", "Kejuruan", "Desain Komunikasi Visual (DKV)", "F", "Aktif"],
        ["MP-003", "Dasar-dasar Agribisnis Pengolahan Hasil Pertanian", "Kejuruan", "Agribisnis Pengolahan Hasil Pertanian (APHP)", "E", "Aktif"],
        ["MP-004", "Produksi Pengolahan Hasil Nabati", "Kejuruan", "Agribisnis Pengolahan Hasil Pertanian (APHP)", "F", "Aktif"],
        ["MP-005", "Bahasa Inggris Komunikasi Kejuruan", "Umum", "Semua Program Keahlian", "E & F", "Aktif"],
        ["MP-006", "Projek Kreatif dan Kewirausahaan (PKK)", "Kejuruan", "Semua Program Keahlian", "F", "Aktif"]
      ]
    },
    {
      name: APP_CONFIG.SHEETS.JADWAL,
      headers: ["ID Supervisi", "Tanggal", "Jam", "Nama Guru", "Mata Pelajaran", "Kelas", "Fase", "Supervisor", "Status", "Keterangan"],
      initialData: [
        ["SUP-2026-001", "2026-09-08", "08:00 - 09:30", "Iman Rahmat, S.Kom., Gr.", "Perangkat Lunak Desain Grafis & Ilustrasi Digital", "XI DKV 1", "F", APP_CONFIG.HEADMASTER, "Selesai", "Supervisi PjBL Studio DKV: Branding & Packaging"],
        ["SUP-2026-002", "2026-09-10", "09:45 - 11:15", "Ahmad Fauzi, S.T.P.", "Produksi Pengolahan Hasil Nabati", "XI APHP 1", "F", "Drs. Asep Nugraha, M.Pd.", "Selesai", "Praktik Lab APHP: Olahan Selai Buah & Sanitasi GMP"]
      ]
    },
    {
      name: APP_CONFIG.SHEETS.OBSERVASI,
      headers: ["ID Observasi", "ID Supervisi", "Tanggal Observasi", "Nama Guru", "Mata Pelajaran", "Kelas", "Fase", "Supervisor", "Skor Total", "Nilai Akhir", "Kategori", "Catatan", "Rekomendasi", "Tindak Lanjut"],
      initialData: []
    },
    {
      name: APP_CONFIG.SHEETS.PENILAIAN,
      headers: ["ID", "ID Observasi", "Aspek", "Indikator", "Skor", "Catatan Supervisor"],
      initialData: []
    }
  ];
  
  sheetsDef.forEach(function(item) {
    var sheet = ss.getSheetByName(item.name);
    if (!sheet) {
      sheet = ss.insertSheet(item.name);
    }
    
    // Set Header jika sheet masih kosong
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(item.headers);
      var headerRange = sheet.getRange(1, 1, 1, item.headers.length);
      headerRange.setBackground("#1E3A8A"); // Navy Blue
      headerRange.setFontColor("#FFFFFF");
      headerRange.setFontWeight("bold");
      headerRange.setHorizontalAlignment("center");
      
      // Sisipkan initial data jika ada
      if (item.initialData && item.initialData.length > 0) {
        sheet.getRange(2, 1, item.initialData.length, item.headers.length).setValues(item.initialData);
      }
      
      sheet.autoResizeColumns(1, item.headers.length);
    }
  });
  
  return { status: true, message: "Database Google Sheets SIPES-GURU berhasil diinisialisasi lengkap!" };
}
`
  },
  {
    name: 'Auth.gs',
    type: 'server',
    description: 'Autentikasi Pengguna, Validasi Role, dan Sesi Login',
    content: `/**
 * SIPES-GURU SMK NEGERI BOJONGGAMBIR
 * File: Auth.gs
 * Deskripsi: Manajemen otorisasi dan login pengguna multi-role
 */

function authLogin(username, password) {
  var sheet = getSpreadsheet().getSheetByName(APP_CONFIG.SHEETS.USERS);
  if (!sheet) return { status: false, message: "Sheet USERS belum diinisialisasi!" };
  
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var uName = String(row[2]).trim();
    var uPass = String(row[3]).trim();
    var uStatus = String(row[5]).trim();
    
    if (uName.toLowerCase() === String(username).trim().toLowerCase() && uPass === String(password).trim()) {
      if (uStatus !== "Aktif") {
        return { status: false, message: "Akun Anda saat ini dinonaktifkan. Hubungi Administrator!" };
      }
      return {
        status: true,
        user: {
          id: row[0],
          nama: row[1],
          username: row[2],
          role: row[4],
          status: row[5]
        }
      };
    }
  }
  
  return { status: false, message: "Username atau Password yang Anda masukkan tidak sesuai!" };
}

function getAllUsers() {
  var sheet = getSpreadsheet().getSheetByName(APP_CONFIG.SHEETS.USERS);
  if (!sheet) return [];
  var data = sheet.getDataRange().getValues();
  var users = [];
  for (var i = 1; i < data.length; i++) {
    users.push({
      id: data[i][0],
      nama: data[i][1],
      username: data[i][2],
      role: data[i][4],
      status: data[i][5]
    });
  }
  return users;
}
`
  },
  {
    name: 'Guru.gs',
    type: 'server',
    description: 'CRUD Data Guru dan Pengelolaan Mata Pelajaran',
    content: `/**
 * SIPES-GURU SMK NEGERI BOJONGGAMBIR
 * File: Guru.gs
 * Deskripsi: Logika backend CRUD data guru dan mata pelajaran
 */

function getAllGuru() {
  var sheet = getSpreadsheet().getSheetByName(APP_CONFIG.SHEETS.GURU);
  if (!sheet) return [];
  var data = sheet.getDataRange().getValues();
  var list = [];
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    list.push({
      id: row[0],
      nip: row[1],
      nuptk: row[2],
      nama: row[3],
      jenisKelamin: row[4],
      mataPelajaran: row[5],
      programKeahlian: row[6],
      kelas: row[7],
      email: row[8],
      noHp: row[9],
      status: row[10]
    });
  }
  return list;
}

function saveGuru(guruData) {
  var sheet = getSpreadsheet().getSheetByName(APP_CONFIG.SHEETS.GURU);
  var data = sheet.getDataRange().getValues();
  
  // Cek duplikasi NIP jika baru
  var isEdit = false;
  var targetRow = -1;
  
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === guruData.id) {
      isEdit = true;
      targetRow = i + 1;
      break;
    }
    if (!guruData.id && data[i][1] === guruData.nip && guruData.nip !== "-") {
      return { status: false, message: "NIP " + guruData.nip + " sudah terdaftar di sistem!" };
    }
  }
  
  var newId = guruData.id || ("GURU-" + Utilities.formatDate(new Date(), "GMT+7", "yyyyMMddHHmmss"));
  var rowValues = [
    newId,
    guruData.nip || "-",
    guruData.nuptk || "-",
    guruData.nama,
    guruData.jenisKelamin,
    guruData.mataPelajaran,
    guruData.programKeahlian,
    guruData.kelas,
    guruData.email || "-",
    guruData.noHp || "-",
    guruData.status || "Aktif"
  ];
  
  if (isEdit) {
    sheet.getRange(targetRow, 1, 1, rowValues.length).setValues([rowValues]);
    return { status: true, message: "Data guru berhasil diperbarui!" };
  } else {
    sheet.appendRow(rowValues);
    return { status: true, message: "Data guru baru berhasil disimpan!", id: newId };
  }
}

function deleteGuru(id) {
  var sheet = getSpreadsheet().getSheetByName(APP_CONFIG.SHEETS.GURU);
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === id) {
      sheet.deleteRow(i + 1);
      return { status: true, message: "Data guru berhasil dihapus!" };
    }
  }
  return { status: false, message: "Guru dengan ID tersebut tidak ditemukan!" };
}
`
  },
  {
    name: 'Supervisi.gs',
    type: 'server',
    description: 'Manajemen Jadwal, Observasi Kelas, dan Instrumen Penilaian',
    content: `/**
 * SIPES-GURU SMK NEGERI BOJONGGAMBIR
 * File: Supervisi.gs
 * Deskripsi: Pengelolaan jadwal, form observasi langsung, dan perhitungan skor
 */

function getAllJadwal() {
  var sheet = getSpreadsheet().getSheetByName(APP_CONFIG.SHEETS.JADWAL);
  if (!sheet) return [];
  var data = sheet.getDataRange().getValues();
  var list = [];
  for (var i = 1; i < data.length; i++) {
    var r = data[i];
    list.push({
      id: r[0],
      tanggal: r[1] instanceof Date ? Utilities.formatDate(r[1], "GMT+7", "yyyy-MM-dd") : r[1],
      jam: r[2],
      namaGuru: r[3],
      mataPelajaran: r[4],
      kelas: r[5],
      fase: r[6],
      supervisor: r[7],
      status: r[8],
      keterangan: r[9]
    });
  }
  return list;
}

function saveJadwal(jadwal) {
  var sheet = getSpreadsheet().getSheetByName(APP_CONFIG.SHEETS.JADWAL);
  var id = jadwal.id || ("SUP-" + Utilities.formatDate(new Date(), "GMT+7", "yyyy-") + Math.floor(100 + Math.random() * 900));
  var rowValues = [
    id,
    jadwal.tanggal,
    jadwal.jam,
    jadwal.namaGuru,
    jadwal.mataPelajaran,
    jadwal.kelas,
    jadwal.fase,
    jadwal.supervisor,
    jadwal.status || "Terjadwal",
    jadwal.keterangan || ""
  ];
  
  if (jadwal.id) {
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] === jadwal.id) {
        sheet.getRange(i + 1, 1, 1, rowValues.length).setValues([rowValues]);
        return { status: true, message: "Jadwal supervisi berhasil diperbarui!" };
      }
    }
  }
  
  sheet.appendRow(rowValues);
  return { status: true, message: "Jadwal supervisi berhasil ditambahkan!", id: id };
}

function simpanHasilObservasi(payload) {
  var ss = getSpreadsheet();
  var sheetObs = ss.getSheetByName(APP_CONFIG.SHEETS.OBSERVASI);
  var sheetPnl = ss.getSheetByName(APP_CONFIG.SHEETS.PENILAIAN);
  var sheetJadwal = ss.getSheetByName(APP_CONFIG.SHEETS.JADWAL);
  
  var obsId = payload.id || ("OBS-" + Utilities.formatDate(new Date(), "GMT+7", "yyyyMMdd-HHmmss"));
  
  // Hitung Nilai Akhir: (Skor Diperoleh / 156) * 100
  var skorTotal = Number(payload.skorTotal) || 0;
  var skorMax = APP_CONFIG.SKOR_MAX_TOTAL;
  var nilaiAkhir = Math.round((skorTotal / skorMax) * 100 * 10) / 10;
  
  var kategori = "Perlu Pembinaan";
  if (nilaiAkhir >= 91) kategori = "Sangat Baik";
  else if (nilaiAkhir >= 81) kategori = "Baik";
  else if (nilaiAkhir >= 71) kategori = "Cukup";
  
  var obsRow = [
    obsId,
    payload.idSupervisi || "",
    payload.tanggalObservasi,
    payload.namaGuru,
    payload.mataPelajaran,
    payload.kelas,
    payload.fase,
    payload.supervisor,
    skorTotal,
    nilaiAkhir,
    kategori,
    payload.catatan || "",
    payload.rekomendasi || "",
    payload.tindakLanjut || ""
  ];
  
  sheetObs.appendRow(obsRow);
  
  // Simpan rincian skor per indikator
  if (payload.indikatorList && payload.indikatorList.length > 0) {
    var pnlRows = [];
    payload.indikatorList.forEach(function(item) {
      pnlRows.push([
        "PNL-" + obsId + "-" + item.indikatorId,
        obsId,
        item.aspek,
        item.indikator,
        item.skor,
        item.catatanSupervisor || ""
      ]);
    });
    sheetPnl.getRange(sheetPnl.getLastRow() + 1, 1, pnlRows.length, 6).setValues(pnlRows);
  }
  
  // Update status jadwal menjadi Selesai
  if (payload.idSupervisi) {
    var jData = sheetJadwal.getDataRange().getValues();
    for (var j = 1; j < jData.length; j++) {
      if (jData[j][0] === payload.idSupervisi) {
        sheetJadwal.getRange(j + 1, 9).setValue("Selesai");
        break;
      }
    }
  }
  
  return {
    status: true,
    message: "Hasil observasi supervisi berhasil disimpan secara permanen!",
    idObservasi: obsId,
    nilaiAkhir: nilaiAkhir,
    kategori: kategori
  };
}
`
  },
  {
    name: 'Laporan.gs',
    type: 'server',
    description: 'Rekapitulasi Nilai dan Pembuatan Laporan PDF ke Google Drive',
    content: `/**
 * SIPES-GURU SMK NEGERI BOJONGGAMBIR
 * File: Laporan.gs
 * Deskripsi: Agregasi data laporan, cetak, dan ekspor dokumen PDF
 */

function getLaporanDetail(idObservasi) {
  var ss = getSpreadsheet();
  var sheetObs = ss.getSheetByName(APP_CONFIG.SHEETS.OBSERVASI);
  var sheetPnl = ss.getSheetByName(APP_CONFIG.SHEETS.PENILAIAN);
  
  var obsData = sheetObs.getDataRange().getValues();
  var targetObs = null;
  for (var i = 1; i < obsData.length; i++) {
    if (obsData[i][0] === idObservasi) {
      targetObs = {
        id: obsData[i][0],
        idSupervisi: obsData[i][1],
        tanggal: obsData[i][2],
        namaGuru: obsData[i][3],
        mataPelajaran: obsData[i][4],
        kelas: obsData[i][5],
        fase: obsData[i][6],
        supervisor: obsData[i][7],
        skorTotal: obsData[i][8],
        nilaiAkhir: obsData[i][9],
        kategori: obsData[i][10],
        catatan: obsData[i][11],
        rekomendasi: obsData[i][12],
        tindakLanjut: obsData[i][13]
      };
      break;
    }
  }
  
  if (!targetObs) return { status: false, message: "Data observasi tidak ditemukan" };
  
  var pnlData = sheetPnl.getDataRange().getValues();
  var details = [];
  for (var k = 1; k < pnlData.length; k++) {
    if (pnlData[k][1] === idObservasi) {
      details.push({
        aspek: pnlData[k][2],
        indikator: pnlData[k][3],
        skor: pnlData[k][4],
        catatan: pnlData[k][5]
      });
    }
  }
  
  targetObs.details = details;
  return { status: true, data: targetObs };
}
`
  },
  {
    name: 'Utils.gs',
    type: 'server',
    description: 'Fungsi Utility, Kalkulasi Statistik Dashboard, dan Format Tanggal',
    content: `/**
 * SIPES-GURU SMK NEGERI BOJONGGAMBIR
 * File: Utils.gs
 * Deskripsi: Helper perhitungan statistik dashboard dan formatting
 */

function getDashboardStats() {
  var ss = getSpreadsheet();
  var sGuru = ss.getSheetByName(APP_CONFIG.SHEETS.GURU);
  var sJadwal = ss.getSheetByName(APP_CONFIG.SHEETS.JADWAL);
  var sObs = ss.getSheetByName(APP_CONFIG.SHEETS.OBSERVASI);
  
  var totalGuru = sGuru ? Math.max(0, sGuru.getLastRow() - 1) : 0;
  var totalJadwal = sJadwal ? Math.max(0, sJadwal.getLastRow() - 1) : 0;
  
  var countSelesai = 0;
  var totalNilai = 0;
  var countSangatBaik = 0;
  var countBaik = 0;
  var countCukup = 0;
  var countPerluPembinaan = 0;
  
  if (sObs && sObs.getLastRow() > 1) {
    var obsData = sObs.getDataRange().getValues();
    for (var i = 1; i < obsData.length; i++) {
      var n = Number(obsData[i][9]) || 0;
      var kat = obsData[i][10];
      countSelesai++;
      totalNilai += n;
      if (kat === "Sangat Baik") countSangatBaik++;
      else if (kat === "Baik") countBaik++;
      else if (kat === "Cukup") countCukup++;
      else countPerluPembinaan++;
    }
  }
  
  var rataRata = countSelesai > 0 ? Math.round((totalNilai / countSelesai) * 10) / 10 : 0;
  
  return {
    totalGuru: totalGuru,
    guruSudahDisupervisi: countSelesai,
    guruBelumDisupervisi: Math.max(0, totalGuru - countSelesai),
    totalJadwal: totalJadwal,
    rataRataNilai: rataRata,
    countSangatBaik: countSangatBaik,
    countBaik: countBaik,
    countCukup: countCukup,
    countPerluPembinaan: countPerluPembinaan
  };
}
`
  },
  {
    name: 'Index.html',
    type: 'html',
    description: 'Layout Utama, Sidebar Navigasi, Header, dan Kontainer Aplikasi',
    content: `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title><?= config.APP_NAME ?> | <?= config.SCHOOL_NAME ?></title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <!-- Bootstrap 5 CSS -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">
  <?!= include('CSS'); ?>
</head>
<body>
  <!-- Wrapper Aplikasi -->
  <div id="app" class="d-flex">
    <!-- Sidebar Menu Navigasi -->
    <nav id="sidebar" class="bg-primary text-white p-3">
      <div class="sidebar-header text-center mb-4">
        <h5 class="fw-bold"><?= config.APP_NAME ?></h5>
        <small class="text-white-50">SMK Negeri Bojonggambir</small>
      </div>
      <ul class="nav nav-pills flex-column mb-auto">
        <li class="nav-item"><a href="#" class="nav-link active" onclick="loadView('dashboard')"><i class="bi bi-speedometer2 me-2"></i> Dashboard</a></li>
        <li><a href="#" class="nav-link" onclick="loadView('guru')"><i class="bi bi-people me-2"></i> Data Guru</a></li>
        <li><a href="#" class="nav-link" onclick="loadView('mapel')"><i class="bi bi-book me-2"></i> Mata Pelajaran</a></li>
        <li><a href="#" class="nav-link" onclick="loadView('jadwal')"><i class="bi bi-calendar-check me-2"></i> Jadwal Supervisi</a></li>
        <li><a href="#" class="nav-link" onclick="loadView('instrumen')"><i class="bi bi-card-checklist me-2"></i> Instrumen Supervisi</a></li>
        <li><a href="#" class="nav-link" onclick="loadView('observasi')"><i class="bi bi-pencil-square me-2"></i> Observasi Kelas</a></li>
        <li><a href="#" class="nav-link" onclick="loadView('hasil')"><i class="bi bi-clipboard-data me-2"></i> Hasil Supervisi</a></li>
        <li><a href="#" class="nav-link" onclick="loadView('tindak-lanjut')"><i class="bi bi-arrow-repeat me-2"></i> Tindak Lanjut</a></li>
        <li><a href="#" class="nav-link" onclick="loadView('laporan')"><i class="bi bi-printer me-2"></i> Laporan</a></li>
        <li><a href="#" class="nav-link" onclick="loadView('pengguna')"><i class="bi bi-shield-lock me-2"></i> Pengguna</a></li>
      </ul>
      <hr>
      <div class="user-footer d-flex align-items-center justify-content-between">
        <span id="currentUserName" class="small">Admin</span>
        <button class="btn btn-sm btn-outline-light" onclick="doLogout()"><i class="bi bi-box-arrow-right"></i></button>
      </div>
    </nav>

    <!-- Konten Utama -->
    <main class="flex-grow-1 p-4 bg-light overflow-auto">
      <header class="d-flex justify-content-between align-items-center pb-3 mb-4 border-bottom">
        <div>
          <h4 id="pageTitle" class="fw-bold mb-0">Dashboard Supervisi</h4>
          <small class="text-muted">Kurikulum Merdeka - SMK Negeri Bojonggambir</small>
        </div>
        <div id="authStatusBadge">
          <span class="badge bg-success">Online</span>
        </div>
      </header>

      <!-- Kontainer View Dinamis -->
      <div id="mainContainer">
        <!-- Konten modul akan dimuat melalui loadView() -->
      </div>
    </main>
  </div>

  <!-- Script JS & Bootstrap Bundle -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <?!= include('JavaScript'); ?>
</body>
</html>
`
  },
  {
    name: 'CSS.html',
    type: 'html',
    description: 'Styling Modern CSS Kompatibel dengan Google Apps Script Web App',
    content: `<style>
  :root {
    --primary-color: #1e3a8a;
    --primary-hover: #172554;
    --accent-color: #0284c7;
    --success-color: #059669;
    --warning-color: #d97706;
    --danger-color: #dc2626;
  }
  
  body {
    font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
    background-color: #f8fafc;
    color: #1e293b;
  }
  
  #sidebar {
    width: 260px;
    min-height: 100vh;
    background-color: #0f172a !important;
  }
  
  #sidebar .nav-link {
    color: #94a3b8;
    border-radius: 8px;
    margin-bottom: 4px;
    font-size: 0.92rem;
    transition: all 0.2s ease;
  }
  
  #sidebar .nav-link:hover,
  #sidebar .nav-link.active {
    color: #ffffff;
    background-color: #1e293b;
  }
  
  #sidebar .nav-link.active {
    background-color: #2563eb;
  }
  
  .card-stat {
    border-radius: 12px;
    border: none;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    transition: transform 0.15s ease;
  }
  
  .card-stat:hover {
    transform: translateY(-2px);
  }
  
  /* Laporan Resmi Cetak */
  @media print {
    #sidebar, header, .btn, .no-print {
      display: none !important;
    }
    main {
      padding: 0 !important;
      background: white !important;
    }
    .print-only {
      display: block !important;
    }
  }
</style>
`
  },
  {
    name: 'JavaScript.html',
    type: 'html',
    description: 'Interaksi Frontend, AJAX Google.script.run, dan State Manager',
    content: `<script>
  /**
   * Client-side JavaScript untuk SIPES-GURU Web App
   */
  var currentUser = {
    nama: "Drs. H. Dadang Suryana, M.Pd.",
    role: "KEPALA_SEKOLAH"
  };

  function loadView(viewName) {
    var container = document.getElementById('mainContainer');
    var pageTitle = document.getElementById('pageTitle');
    
    // Update active nav
    document.querySelectorAll('#sidebar .nav-link').forEach(el => el.classList.remove('active'));
    event.currentTarget.classList.add('active');

    if (viewName === 'dashboard') {
      pageTitle.innerText = "Dashboard Supervisi Guru";
      container.innerHTML = '<div class="text-center py-5"><div class="spinner-border text-primary" role="status"></div><p class="mt-2">Memuat statistik...</p></div>';
      google.script.run.withSuccessHandler(renderDashboard).getDashboardStats();
    } else if (viewName === 'guru') {
      pageTitle.innerText = "Data Guru SMK Negeri Bojonggambir";
      container.innerHTML = '<div class="text-center py-5"><div class="spinner-border text-primary"></div><p>Mengambil data guru...</p></div>';
      google.script.run.withSuccessHandler(renderGuruList).getAllGuru();
    } else if (viewName === 'jadwal') {
      pageTitle.innerText = "Jadwal Supervisi Pembelajaran";
      google.script.run.withSuccessHandler(renderJadwalList).getAllJadwal();
    }
  }

  function renderDashboard(stats) {
    var container = document.getElementById('mainContainer');
    container.innerHTML = \`
      <div class="row g-3 mb-4">
        <div class="col-md-3">
          <div class="card card-stat p-3 bg-white">
            <small class="text-muted">Total Guru</small>
            <h3 class="fw-bold text-primary mt-1">\${stats.totalGuru}</h3>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card card-stat p-3 bg-white">
            <small class="text-muted">Sudah Disupervisi</small>
            <h3 class="fw-bold text-success mt-1">\${stats.guruSudahDisupervisi}</h3>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card card-stat p-3 bg-white">
            <small class="text-muted">Belum Disupervisi</small>
            <h3 class="fw-bold text-warning mt-1">\${stats.guruBelumDisupervisi}</h3>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card card-stat p-3 bg-white">
            <small class="text-muted">Rata-rata Nilai</small>
            <h3 class="fw-bold text-info mt-1">\${stats.rataRataNilai}</h3>
          </div>
        </div>
      </div>
    \`;
  }

  function doLogout() {
    if (confirm("Apakah Anda yakin ingin keluar dari sistem?")) {
      window.top.location.reload();
    }
  }
</script>
`
  }
];
