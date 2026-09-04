import React, { createContext, useContext, useState, useEffect } from 'react';
import { Guru, Mapel, JadwalSupervisi, Observasi, User, DashboardStats, PenilaianDetail } from '../types';
import { INITIAL_GURU, INITIAL_MAPEL, INITIAL_JADWAL, INITIAL_OBSERVASI, INITIAL_USERS } from '../data/initialData';

export type ActiveTab =
  | 'dashboard'
  | 'guru'
  | 'mapel'
  | 'jadwal'
  | 'instrumen'
  | 'observasi'
  | 'hasil'
  | 'tindak-lanjut'
  | 'laporan'
  | 'pengguna'
  | 'gas-export';

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  switchRole: (role: User['role']) => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  
  // Data State
  users: User[];
  guruList: Guru[];
  mapelList: Mapel[];
  jadwalList: JadwalSupervisi[];
  observasiList: Observasi[];
  
  // Selected Item for Report/Observation
  selectedObservasiId: string | null;
  setSelectedObservasiId: (id: string | null) => void;
  selectedJadwalForObs: JadwalSupervisi | null;
  setSelectedJadwalForObs: (jadwal: JadwalSupervisi | null) => void;
  
  // CRUD Guru
  addGuru: (guru: Omit<Guru, 'id'>) => { success: boolean; message: string };
  updateGuru: (guru: Guru) => { success: boolean; message: string };
  deleteGuru: (id: string) => { success: boolean; message: string };
  
  // CRUD Mapel
  addMapel: (mapel: Omit<Mapel, 'id'>) => { success: boolean; message: string };
  updateMapel: (mapel: Mapel) => { success: boolean; message: string };
  deleteMapel: (id: string) => { success: boolean; message: string };

  // CRUD Jadwal
  addJadwal: (jadwal: Omit<JadwalSupervisi, 'id'>) => { success: boolean; message: string };
  updateJadwal: (jadwal: JadwalSupervisi) => { success: boolean; message: string };
  deleteJadwal: (id: string) => { success: boolean; message: string };
  updateJadwalStatus: (id: string, status: JadwalSupervisi['status']) => void;

  // Observasi & Penilaian
  saveObservasi: (obs: Observasi) => { success: boolean; message: string; id: string };
  deleteObservasi: (id: string) => { success: boolean; message: string };
  updateTindakLanjut: (id: string, updates: Partial<Observasi>) => { success: boolean; message: string };

  // CRUD Users
  addUser: (user: Omit<User, 'id'>) => { success: boolean; message: string };
  updateUser: (user: User) => { success: boolean; message: string };
  deleteUser: (id: string) => { success: boolean; message: string };

  // Helpers
  stats: DashboardStats;
  notification: { message: string; type: 'success' | 'error' | 'info' } | null;
  showNotification: (message: string, type?: 'success' | 'error' | 'info') => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Persistence via localStorage
  const [currentUser, setCurrentUserState] = useState<User>(() => {
    const saved = localStorage.getItem('sipes_current_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_USERS[1]; // Default: Drs. H. Dadang Suryana (Kepala Sekolah)
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [selectedObservasiId, setSelectedObservasiId] = useState<string | null>('OBS-2026-001');
  const [selectedJadwalForObs, setSelectedJadwalForObs] = useState<JadwalSupervisi | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('sipes_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [guruList, setGuruList] = useState<Guru[]>(() => {
    const saved = localStorage.getItem('sipes_guru');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const hasDkvOrAphp = parsed.some((g: any) => g.programKeahlian?.includes('DKV') || g.programKeahlian?.includes('APHP'));
        if (hasDkvOrAphp) return parsed;
      } catch (e) {}
    }
    return INITIAL_GURU;
  });

  const [mapelList, setMapelList] = useState<Mapel[]>(() => {
    const saved = localStorage.getItem('sipes_mapel');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const hasDkvOrAphp = parsed.some((m: any) => m.programKeahlian?.includes('DKV') || m.programKeahlian?.includes('APHP'));
        if (hasDkvOrAphp) return parsed;
      } catch (e) {}
    }
    return INITIAL_MAPEL;
  });

  const [jadwalList, setJadwalList] = useState<JadwalSupervisi[]>(() => {
    const saved = localStorage.getItem('sipes_jadwal');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const hasDkvOrAphp = parsed.some((j: any) => j.kelas?.includes('DKV') || j.kelas?.includes('APHP'));
        if (hasDkvOrAphp) return parsed;
      } catch (e) {}
    }
    return INITIAL_JADWAL;
  });

  const [observasiList, setObservasiList] = useState<Observasi[]>(() => {
    const saved = localStorage.getItem('sipes_observasi');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const hasDkvOrAphp = parsed.some((o: any) => o.kelas?.includes('DKV') || o.kelas?.includes('APHP') || o.catatan?.includes('DKV') || o.catatan?.includes('APHP'));
        if (hasDkvOrAphp) return parsed;
      } catch (e) {}
    }
    return INITIAL_OBSERVASI;
  });

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('sipes_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('sipes_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('sipes_guru', JSON.stringify(guruList));
  }, [guruList]);

  useEffect(() => {
    localStorage.setItem('sipes_mapel', JSON.stringify(mapelList));
  }, [mapelList]);

  useEffect(() => {
    localStorage.setItem('sipes_jadwal', JSON.stringify(jadwalList));
  }, [jadwalList]);

  useEffect(() => {
    localStorage.setItem('sipes_observasi', JSON.stringify(observasiList));
  }, [observasiList]);

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const setCurrentUser = (user: User) => {
    setCurrentUserState(user);
    showNotification(`Beralih pengguna sebagai: ${user.nama} (${user.role})`, 'info');
  };

  const switchRole = (role: User['role']) => {
    const found = users.find(u => u.role === role && u.status === 'Aktif') || {
      id: `USR-${role}`,
      nama: role === 'ADMIN' ? 'Administrator' : role === 'KEPALA_SEKOLAH' ? 'Drs. H. Dadang Suryana, M.Pd.' : role === 'SUPERVISOR' ? 'Drs. Asep Nugraha, M.Pd.' : 'Iman Rahmat, S.Kom., Gr.',
      username: role.toLowerCase(),
      role: role,
      status: 'Aktif' as const
    };
    setCurrentUser(found);
  };

  // CRUD GURU
  const addGuru = (guru: Omit<Guru, 'id'>) => {
    if (!guru.nama || !guru.mataPelajaran) {
      return { success: false, message: 'Nama Guru dan Mata Pelajaran wajib diisi!' };
    }
    // Cek duplikasi NIP
    if (guru.nip && guru.nip !== '-' && guruList.some(g => g.nip === guru.nip)) {
      return { success: false, message: `Guru dengan NIP ${guru.nip} sudah terdaftar!` };
    }
    const newId = `GURU-${String(guruList.length + 1).padStart(3, '0')}`;
    const newGuru: Guru = { ...guru, id: newId };
    setGuruList(prev => [newGuru, ...prev]);
    showNotification(`Data guru "${guru.nama}" berhasil ditambahkan.`);
    return { success: true, message: 'Data guru berhasil ditambahkan.' };
  };

  const updateGuru = (guru: Guru) => {
    if (!guru.nama || !guru.mataPelajaran) {
      return { success: false, message: 'Nama Guru dan Mata Pelajaran wajib diisi!' };
    }
    setGuruList(prev => prev.map(g => g.id === guru.id ? guru : g));
    showNotification(`Data guru "${guru.nama}" berhasil diperbarui.`);
    return { success: true, message: 'Data guru berhasil diperbarui.' };
  };

  const deleteGuru = (id: string) => {
    const item = guruList.find(g => g.id === id);
    setGuruList(prev => prev.filter(g => g.id !== id));
    showNotification(`Guru ${item ? item.nama : ''} berhasil dihapus.`);
    return { success: true, message: 'Data guru berhasil dihapus.' };
  };

  // CRUD MAPEL
  const addMapel = (mapel: Omit<Mapel, 'id'>) => {
    if (!mapel.mataPelajaran) {
      return { success: false, message: 'Nama Mata Pelajaran wajib diisi!' };
    }
    const newId = `MP-${String(mapelList.length + 1).padStart(3, '0')}`;
    const newMapel: Mapel = { ...mapel, id: newId };
    setMapelList(prev => [...prev, newMapel]);
    showNotification(`Mata pelajaran "${mapel.mataPelajaran}" berhasil ditambahkan.`);
    return { success: true, message: 'Mata pelajaran berhasil ditambahkan.' };
  };

  const updateMapel = (mapel: Mapel) => {
    setMapelList(prev => prev.map(m => m.id === mapel.id ? mapel : m));
    showNotification(`Mata pelajaran "${mapel.mataPelajaran}" berhasil diperbarui.`);
    return { success: true, message: 'Mata pelajaran berhasil diperbarui.' };
  };

  const deleteMapel = (id: string) => {
    setMapelList(prev => prev.filter(m => m.id !== id));
    showNotification('Mata pelajaran berhasil dihapus.');
    return { success: true, message: 'Mata pelajaran berhasil dihapus.' };
  };

  // CRUD JADWAL
  const addJadwal = (jadwal: Omit<JadwalSupervisi, 'id'>) => {
    if (!jadwal.tanggal || !jadwal.jam || !jadwal.namaGuru) {
      return { success: false, message: 'Tanggal, Jam, dan Nama Guru wajib diisi!' };
    }
    const newId = `SUP-${new Date().getFullYear()}-${String(jadwalList.length + 1).padStart(3, '0')}`;
    const newJadwal: JadwalSupervisi = { ...jadwal, id: newId };
    setJadwalList(prev => [newJadwal, ...prev]);
    showNotification(`Jadwal supervisi untuk "${jadwal.namaGuru}" berhasil dibuat.`);
    return { success: true, message: 'Jadwal supervisi berhasil dibuat.' };
  };

  const updateJadwal = (jadwal: JadwalSupervisi) => {
    setJadwalList(prev => prev.map(j => j.id === jadwal.id ? jadwal : j));
    showNotification(`Jadwal supervisi untuk "${jadwal.namaGuru}" berhasil diperbarui.`);
    return { success: true, message: 'Jadwal supervisi berhasil diperbarui.' };
  };

  const deleteJadwal = (id: string) => {
    setJadwalList(prev => prev.filter(j => j.id !== id));
    showNotification('Jadwal supervisi berhasil dihapus.');
    return { success: true, message: 'Jadwal supervisi berhasil dihapus.' };
  };

  const updateJadwalStatus = (id: string, status: JadwalSupervisi['status']) => {
    setJadwalList(prev => prev.map(j => j.id === id ? { ...j, status } : j));
    showNotification(`Status jadwal diubah menjadi: ${status}`);
  };

  // OBSERVASI
  const saveObservasi = (obs: Observasi) => {
    const isNew = !observasiList.some(o => o.id === obs.id);
    if (isNew) {
      setObservasiList(prev => [obs, ...prev]);
    } else {
      setObservasiList(prev => prev.map(o => o.id === obs.id ? obs : o));
    }

    // Update status jadwal terkait menjadi 'Selesai'
    if (obs.idSupervisi) {
      setJadwalList(prev => prev.map(j => j.id === obs.idSupervisi ? { ...j, status: 'Selesai' } : j));
    }

    setSelectedObservasiId(obs.id);
    showNotification(`Hasil observasi "${obs.namaGuru}" (Nilai: ${obs.nilaiAkhir} - ${obs.kategori}) berhasil disimpan.`);
    return { success: true, message: 'Hasil observasi berhasil disimpan.', id: obs.id };
  };

  const deleteObservasi = (id: string) => {
    setObservasiList(prev => prev.filter(o => o.id !== id));
    showNotification('Hasil observasi berhasil dihapus.');
    return { success: true, message: 'Hasil observasi berhasil dihapus.' };
  };

  const updateTindakLanjut = (id: string, updates: Partial<Observasi>) => {
    setObservasiList(prev => prev.map(o => o.id === id ? { ...o, ...updates } : o));
    showNotification('Data catatan dan tindak lanjut supervisi berhasil disimpan.');
    return { success: true, message: 'Data tindak lanjut berhasil diperbarui.' };
  };

  // CRUD USERS
  const addUser = (user: Omit<User, 'id'>) => {
    const newId = `USR-${String(users.length + 1).padStart(3, '0')}`;
    const newUser: User = { ...user, id: newId };
    setUsers(prev => [...prev, newUser]);
    showNotification(`Pengguna "${user.nama}" berhasil ditambahkan.`);
    return { success: true, message: 'Pengguna berhasil ditambahkan.' };
  };

  const updateUser = (user: User) => {
    setUsers(prev => prev.map(u => u.id === user.id ? user : u));
    showNotification(`Pengguna "${user.nama}" berhasil diperbarui.`);
    return { success: true, message: 'Pengguna berhasil diperbarui.' };
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    showNotification('Pengguna berhasil dihapus.');
    return { success: true, message: 'Pengguna berhasil dihapus.' };
  };

  const resetAllData = () => {
    localStorage.removeItem('sipes_guru');
    localStorage.removeItem('sipes_mapel');
    localStorage.removeItem('sipes_jadwal');
    localStorage.removeItem('sipes_observasi');
    localStorage.removeItem('sipes_users');
    setGuruList(INITIAL_GURU);
    setMapelList(INITIAL_MAPEL);
    setJadwalList(INITIAL_JADWAL);
    setObservasiList(INITIAL_OBSERVASI);
    setUsers(INITIAL_USERS);
    setCurrentUserState(INITIAL_USERS[1]);
    showNotification('Seluruh data berhasil direset ke kondisi default pabrik.');
  };

  // Kalkulasi statistik Dashboard
  const totalGuru = guruList.length;
  // Hitung guru yang sudah disupervisi (berdasarkan observasi unik per guruId)
  const uniqueSupervisedGuruIds = new Set(observasiList.map(o => o.guruId || o.namaGuru));
  const guruSudahDisupervisi = uniqueSupervisedGuruIds.size;
  const guruBelumDisupervisi = Math.max(0, totalGuru - guruSudahDisupervisi);

  const countSangatBaik = observasiList.filter(o => o.kategori === 'Sangat Baik').length;
  const countBaik = observasiList.filter(o => o.kategori === 'Baik').length;
  const countCukup = observasiList.filter(o => o.kategori === 'Cukup').length;
  const countPerluPembinaan = observasiList.filter(o => o.kategori === 'Perlu Pembinaan').length;

  const totalNilaiSum = observasiList.reduce((acc, curr) => acc + curr.nilaiAkhir, 0);
  const rataRataNilai = observasiList.length > 0 ? Math.round((totalNilaiSum / observasiList.length) * 10) / 10 : 0;

  const stats: DashboardStats = {
    totalGuru,
    guruSudahDisupervisi,
    guruBelumDisupervisi,
    totalJadwal: jadwalList.length,
    jadwalMendatang: jadwalList.filter(j => j.status === 'Terjadwal').length,
    rataRataNilai,
    countSangatBaik,
    countBaik,
    countCukup,
    countPerluPembinaan
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchRole,
        activeTab,
        setActiveTab,
        users,
        guruList,
        mapelList,
        jadwalList,
        observasiList,
        selectedObservasiId,
        setSelectedObservasiId,
        selectedJadwalForObs,
        setSelectedJadwalForObs,
        addGuru,
        updateGuru,
        deleteGuru,
        addMapel,
        updateMapel,
        deleteMapel,
        addJadwal,
        updateJadwal,
        deleteJadwal,
        updateJadwalStatus,
        saveObservasi,
        deleteObservasi,
        updateTindakLanjut,
        addUser,
        updateUser,
        deleteUser,
        stats,
        notification,
        showNotification,
        resetAllData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
