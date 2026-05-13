import { create } from 'zustand'

// ── Seed data ──────────────────────────────────────────────

const seedLaporan = [
  { id:'LP-2024-142', lokasi:'Kawasan Megamas', subLokasi:'Jl. Pierre Tendean', jenis:'Berjualan', jumlah:2, sumber:'AI', waktu:'14 mnt lalu', status:'baru',   lat:1.4784, lng:124.8421 },
  { id:'LP-2024-141', lokasi:'Pasar 45',        subLokasi:'Area Parkir',         jenis:'Mengamen', jumlah:1, sumber:'M. Reza',  waktu:'1 jam lalu',  status:'proses', lat:1.4850, lng:124.8472 },
  { id:'LP-2024-140', lokasi:'Manado Town Square', subLokasi:'Pintu Masuk Utama', jenis:'Figuran', jumlah:1, sumber:'Andi S.',  waktu:'5 jam lalu',  status:'proses', lat:1.4901, lng:124.8562 },
  { id:'LP-2024-139', lokasi:'Jl. Boulevard',   subLokasi:'Depan BCA',           jenis:'Berjualan',jumlah:3, sumber:'Sari W.', waktu:'3 jam lalu',  status:'selesai',lat:1.4820, lng:124.8440 },
  { id:'LP-2024-138', lokasi:'Kawasan Wenang',   subLokasi:'',                    jenis:'Mengemis', jumlah:2, sumber:'AI',      waktu:'Kemarin',     status:'selesai',lat:1.4910, lng:124.8500 },
  { id:'LP-2024-137', lokasi:'Pasar Bersehati',  subLokasi:'',                    jenis:'Berjualan',jumlah:4, sumber:'Hendra K.',waktu:'Kemarin',    status:'selesai',lat:1.4860, lng:124.8460 },
  { id:'LP-2024-136', lokasi:'Jl. Sam Ratulangi',subLokasi:'',                   jenis:'Mengamen', jumlah:2, sumber:'Anonim',  waktu:'2 hari lalu', status:'selesai',lat:1.4840, lng:124.8490 },
]

const seedAnak = [
  { id:'AK-2024-047', nama:'R.S.',  usia:'±9 thn',  gender:'Laki-laki',   status:'proses',  lokasi:'Megamas',  aktivitas:'Berjualan',  avatar:'👦' },
  { id:'AK-2024-046', nama:'M.L.',  usia:'±11 thn', gender:'Perempuan',   status:'proses',  lokasi:'Megamas',  aktivitas:'Berjualan',  avatar:'👧' },
  { id:'AK-2024-045', nama:'B.T.',  usia:'±8 thn',  gender:'Laki-laki',   status:'perlu',   lokasi:'Pasar 45', aktivitas:'Mengamen',   avatar:'👦' },
  { id:'AK-2024-044', nama:'F.M.',  usia:'±10 thn', gender:'Laki-laki',   status:'pulang',  lokasi:'Boulevard',aktivitas:'Berjualan',  avatar:'👦' },
  { id:'AK-2024-043', nama:'Y.P.',  usia:'±7 thn',  gender:'Perempuan',   status:'pulang',  lokasi:'Boulevard',aktivitas:'Berjualan',  avatar:'👧' },
  { id:'AK-2024-042', nama:'D.K.',  usia:'±12 thn', gender:'Laki-laki',   status:'pulang',  lokasi:'Boulevard',aktivitas:'Berjualan',  avatar:'👦' },
  { id:'AK-2024-041', nama:'A.R.',  usia:'±13 thn', gender:'Laki-laki',   status:'proses',  lokasi:'Matos',    aktivitas:'Figuran',    avatar:'👦' },
]

const seedNotifikasi = [
  { id:1, tipe:'alert',   icon:'🚨', judul:'AI Mendeteksi Pekerja Anak — Megamas', deskripsi:'CAM-01 mendeteksi 2 anak membawa barang dagangan. Confidence: 94% dan 87%.', meta:['📍 Megamas','🕐 14 mnt lalu','🤖 AI Detection'], read:false, warna:'red',   laporanId:'LP-2024-142' },
  { id:2, tipe:'laporan', icon:'📋', judul:'Laporan Baru dari Warga — Pasar 45',  deskripsi:'Warga melaporkan anak usia 8–10 tahun mengamen di area parkir Pasar 45.',      meta:['📍 Pasar 45','🕐 1 jam lalu','👤 M. Reza'],      read:false, warna:'amber', laporanId:'LP-2024-141' },
  { id:3, tipe:'laporan', icon:'📋', judul:'Laporan Baru — Figuran Karakter Matos',deskripsi:'Anak memakai kostum figuran sambil meminta sumbangan dari pengunjung Matos.',  meta:['📍 Matos','🕐 5 jam lalu','👤 Andi S.'],         read:false, warna:'red',   laporanId:'LP-2024-140' },
  { id:4, tipe:'selesai', icon:'✅', judul:'Penanganan Selesai — Jl. Boulevard',   deskripsi:'3 anak berhasil dijemput dan dipulangkan ke keluarga oleh petugas Dinsos.',    meta:['📍 Boulevard','🕐 3 jam lalu','👷 Petugas Dinsos'], read:true,  warna:'green', laporanId:'LP-2024-139' },
  { id:5, tipe:'info',    icon:'🏫', judul:'Sinkronisasi Data Absensi Sekolah',    deskripsi:'Data absensi dari 12 sekolah mitra berhasil diperbarui.',                      meta:['🏫 12 Sekolah','🕐 Kemarin, 15:00'],            read:true,  warna:'blue',  laporanId:null },
  { id:6, tipe:'info',    icon:'📊', judul:'Laporan Mingguan Tersedia',            deskripsi:'Ringkasan minggu ke-18: 34 laporan masuk, 28 ditangani (82%).',               meta:['📅 Minggu ke-18','🕐 Kemarin, 08:00'],          read:true,  warna:'',      laporanId:null },
]

const seedPetugas = [
  { id:'P-01', nama:'Budi Santoso',   jabatan:'Petugas Lapangan', status:'tersedia' },
  { id:'P-02', nama:'Siti Rahayu',    jabatan:'Petugas Lapangan', status:'bertugas' },
  { id:'P-03', nama:'Ahmad Fauzi',    jabatan:'Koordinator',      status:'tersedia' },
  { id:'P-04', nama:'Dewi Lestari',   jabatan:'Petugas Lapangan', status:'tersedia' },
]

// ── Store ──────────────────────────────────────────────────

export const useStore = create((set, get) => ({
  // state
  role: 'admin',    // 'admin' | 'public'
  laporan: seedLaporan,
  anak: seedAnak,
  notifikasi: seedNotifikasi,
  petugas: seedPetugas,
  toast: null,
  activeModal: null,  // { type, data }

  // actions
  setRole: (role) => set({ role }),

  showToast: (msg, color = 'var(--green)') => {
    set({ toast: { msg, color } })
    setTimeout(() => set({ toast: null }), 2500)
  },

  openModal: (type, data = {}) => set({ activeModal: { type, data } }),
  closeModal: () => set({ activeModal: null }),

  markNotifRead: (id) => set(s => ({
    notifikasi: s.notifikasi.map(n => n.id === id ? { ...n, read: true } : n)
  })),
  markAllNotifRead: () => set(s => ({
    notifikasi: s.notifikasi.map(n => ({ ...n, read: true }))
  })),

  updateLaporanStatus: (id, status, petugasId = null) => set(s => ({
    laporan: s.laporan.map(l =>
      l.id === id ? { ...l, status, petugasId, waktu: 'Baru saja' } : l
    )
  })),

  tambahLaporan: (data) => set(s => {
    const id = `LP-2024-${String(s.laporan.length + 143).padStart(3,'0')}`
    const baru = { ...data, id, waktu: 'Baru saja', status: 'baru',
      lat: 1.4850 + (Math.random()-0.5)*0.02,
      lng: 124.8470 + (Math.random()-0.5)*0.02 }
    return {
      laporan: [baru, ...s.laporan],
      notifikasi: [{
        id: Date.now(), tipe:'laporan', icon:'📋',
        judul: `Laporan Baru — ${data.lokasi}`,
        deskripsi: `Warga melaporkan ${data.jenis.toLowerCase()} di ${data.lokasi}.`,
        meta: [`📍 ${data.lokasi}`, '🕐 Baru saja', `👤 ${data.pelapor || 'Anonim'}`],
        read: false, warna:'amber', laporanId: id
      }, ...s.notifikasi]
    }
  }),

  tugaskanPetugas: (laporanId, petugasId) => {
    const s = get()
    const petugas = s.petugas.find(p => p.id === petugasId)
    s.updateLaporanStatus(laporanId, 'proses', petugasId)
    set(st => ({
      petugas: st.petugas.map(p => p.id === petugasId ? { ...p, status:'bertugas' } : p)
    }))
    s.showToast(`✓ ${petugas?.nama || 'Petugas'} ditugaskan`)
    s.closeModal()
  },

  selesaikanLaporan: (laporanId) => {
    get().updateLaporanStatus(laporanId, 'selesai')
    get().showToast('✓ Laporan ditandai selesai')
    get().closeModal()
  },

  tambahAnak: (data) => set(s => {
    const id = `AK-2024-${String(s.anak.length + 48).padStart(3,'0')}`
    return { anak: [{ ...data, id, avatar: data.gender === 'Perempuan' ? '👧' : '👦' }, ...s.anak] }
  }),
}))