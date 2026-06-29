// ─── Design Tokens (identik dengan AdminPeta / tema final DP3A) ─
export const N      = '#284B63'
export const T      = '#3C6E71'
export const TEXT   = '#353535'
export const MUTED   = '#6B7C8D'
export const BORDER = '#D9D9D9'
export const CARD   = '#FFFFFF'
export const BG     = '#F4F7F9'
export const RED    = '#C0392B'
export const AMBER  = '#D4820A'
export const GREEN  = '#1E7E4A'

// ─── Data Kasus ───────────────────────────────────────────────
export const KASUS_DATA = [
  {
    id: 'KS-001', nama: 'Anak A (L, 10 th)', lokasi: 'Kawasan Megamas',
    tanggal: '12 Mei 2025', status: 'selesai', petugas: 'Tim Satpol PP 1',
    progres: [
      { tgl: '12 Mei', aksi: 'Anak ditemukan berjualan di Megamas', aktor: 'Satpol PP' },
      { tgl: '12 Mei', aksi: 'Orang tua dihubungi dan dipanggil ke kantor', aktor: 'Dinas Sosial' },
      { tgl: '13 Mei', aksi: 'Anak dikembalikan ke keluarga, surat peringatan diberikan', aktor: 'Dinas Sosial' },
      { tgl: '14 Mei', aksi: 'Keluarga menerima bantuan PKH, kasus ditutup', aktor: 'Dinas Sosial' },
    ],
  },
  {
    id: 'KS-002', nama: 'Anak B (P, 8 th)', lokasi: 'Pasar 45',
    tanggal: '10 Mei 2025', status: 'proses', petugas: 'Tim Satpol PP 2',
    progres: [
      { tgl: '10 Mei', aksi: 'Anak dilaporkan mengamen di area parkir Pasar 45', aktor: 'Warga' },
      { tgl: '10 Mei', aksi: 'Petugas turun ke lapangan, anak diamankan', aktor: 'Satpol PP' },
      { tgl: '11 Mei', aksi: 'Pendampingan psikolog dijadwalkan', aktor: 'Dinas Sosial' },
    ],
  },
  {
    id: 'KS-003', nama: 'Anak C (L, 12 th)', lokasi: 'Matos Entrance',
    tanggal: '09 Mei 2025', status: 'selesai', petugas: 'Tim Satpol PP 1',
    progres: [
      { tgl: '9 Mei', aksi: 'Terdeteksi kamera CCTV Matos memakai kostum kartun', aktor: 'AI CCTV' },
      { tgl: '9 Mei', aksi: 'Anak diamankan oleh Satpol PP', aktor: 'Satpol PP' },
      { tgl: '10 Mei', aksi: 'Anak dikembalikan ke sekolah, orang tua ditegur', aktor: 'Dinas Sosial' },
    ],
  },
  {
    id: 'KS-004', nama: 'Anak D (L, 9 th)', lokasi: 'Jl. Boulevard',
    tanggal: '07 Mei 2025', status: 'selesai', petugas: 'Tim Satpol PP 3',
    progres: [
      { tgl: '7 Mei', aksi: 'Laporan warga: anak meminta-minta di Jl. Boulevard', aktor: 'Warga' },
      { tgl: '7 Mei', aksi: 'Dijemput Satpol PP, dibawa ke shelter sementara', aktor: 'Satpol PP' },
      { tgl: '8 Mei', aksi: 'Keluarga ditemukan, anak dikembalikan', aktor: 'Dinas Sosial' },
      { tgl: '9 Mei', aksi: 'Follow-up kunjungan rumah dilakukan', aktor: 'Dinas Sosial' },
      { tgl: '12 Mei', aksi: 'Kasus ditutup, keluarga terdaftar PKH', aktor: 'Dinas Sosial' },
    ],
  },
  {
    id: 'KS-005', nama: 'Anak E (P, 11 th)', lokasi: 'Kawasan Megamas',
    tanggal: '05 Mei 2025', status: 'proses', petugas: 'Tim Satpol PP 2',
    progres: [
      { tgl: '5 Mei', aksi: 'Terdeteksi CCTV — berjualan koran', aktor: 'AI CCTV' },
      { tgl: '5 Mei', aksi: 'Anak diamankan, orang tua belum ditemukan', aktor: 'Satpol PP' },
      { tgl: '6 Mei', aksi: 'Pencarian orang tua berlanjut via RT/RW', aktor: 'Dinas Sosial' },
    ],
  },
  {
    id: 'KS-006', nama: 'Anak F (L, 7 th)', lokasi: 'Pasar Bersehati',
    tanggal: '03 Mei 2025', status: 'selesai', petugas: 'Tim Satpol PP 1',
    progres: [
      { tgl: '3 Mei', aksi: 'Laporan warga: anak berjualan kantong plastik', aktor: 'Warga' },
      { tgl: '3 Mei', aksi: 'Diamankan dan dibawa ke kantor Dinas Sosial', aktor: 'Satpol PP' },
      { tgl: '4 Mei', aksi: 'Orang tua datang, penandatanganan surat pernyataan', aktor: 'Dinas Sosial' },
      { tgl: '5 Mei', aksi: 'Kasus selesai, anak kembali bersekolah', aktor: 'Dinas Sosial' },
    ],
  },
]

// ─── Titik Peta ───────────────────────────────────────────────
export const PETA_TITIK = [
  { label: 'Megamas',         x: 0.62, y: 0.28, count: 48, alert: true  },
  { label: 'Pasar 45',        x: 0.50, y: 0.42, count: 35, alert: false },
  { label: 'Boulevard',       x: 0.58, y: 0.55, count: 27, alert: false },
  { label: 'Matos',           x: 0.38, y: 0.50, count: 19, alert: false },
  { label: 'Pasar Bersehati', x: 0.45, y: 0.33, count: 14, alert: false },
  { label: 'Malalayang',      x: 0.28, y: 0.65, count:  9, alert: false },
]

// ─── SVG Icons ────────────────────────────────────────────────
export const Icon = {
  peta: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
      <line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/>
    </svg>
  ),
  chart: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6"  y1="20" x2="6"  y2="14"/>
    </svg>
  ),
  export: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  ),
  kasus: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  ),
  pin: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    </svg>
  ),
  check: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  clock: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  arrow: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  ),
  user: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  warning: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  total: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
    </svg>
  ),
  refresh: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10"/>
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
    </svg>
  ),
}

// ─── Shared CSS (banner, KPI, card, tabs, live-dot) ──────────
// Disamakan dengan tema final AdminPeta (DP3A): font tunggal Plus Jakarta Sans,
// N=#284B63, TEXT=#353535, MUTED=#6B7C8D, BORDER=#D9D9D9, BG=#F4F7F9
export const SHARED_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  .ds-root * { box-sizing: border-box; }
  .ds-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: ${BG};
    color: ${TEXT};
    flex: 1;
    overflow-y: auto;
    padding: 28px 32px 60px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  /* ══ BANNER ══ */
  .ds-banner {
    background: ${N};
    border-radius: 18px;
    padding: 28px 36px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    position: relative;
    overflow: hidden;
  }
  .ds-banner::before {
    content:''; position:absolute; right:-80px; top:-80px;
    width:320px; height:320px; border-radius:50%;
    background:radial-gradient(circle,rgba(60,110,113,0.3) 0%,transparent 65%);
    pointer-events:none;
  }
  .ds-banner::after {
    content:''; position:absolute; left:40%; bottom:-60px;
    width:200px; height:200px; border-radius:50%;
    background:radial-gradient(circle,rgba(191,219,247,0.06) 0%,transparent 70%);
    pointer-events:none;
  }
  .ds-banner-eyebrow {
    font-size:11px; color:rgba(191,219,247,0.5); margin-bottom:8px;
    font-weight:600; letter-spacing:0.06em; text-transform:uppercase;
    font-family:'Plus Jakarta Sans',sans-serif;
  }
  .ds-banner-title {
    font-family:'Plus Jakarta Sans',sans-serif;
    font-size:clamp(22px,3vw,30px); font-weight:800;
    color:#fff; line-height:1.15; margin-bottom:10px; letter-spacing:-0.02em;
  }
  .ds-banner-title span { color:#BFDBF7; }
  .ds-banner-sub {
    font-size:13px; color:rgba(255,255,255,0.6); line-height:1.65; max-width:460px;
  }
  .ds-banner-sub strong { color:#fff; font-weight:700; }
  .ds-banner-clock {
    font-size:11px; color:rgba(191,219,247,0.35); margin-top:12px;
    font-family:'Plus Jakarta Sans',sans-serif; letter-spacing:0.02em;
  }
  .ds-banner-actions {
    display:flex; flex-direction:column; gap:10px; flex-shrink:0;
    position:relative; z-index:1;
  }
  .ds-btn-teal {
    display:flex; align-items:center; gap:8px; padding:12px 22px;
    background:${T}; color:#fff; border:none; border-radius:10px;
    font-family:'Plus Jakarta Sans',sans-serif; font-size:13px; font-weight:700;
    cursor:pointer; transition:background 0.2s,transform 0.15s; white-space:nowrap;
  }
  .ds-btn-teal:hover { background:#2f5759; transform:translateY(-1px); }
  .ds-btn-ghost {
    display:flex; align-items:center; gap:8px; padding:11px 22px;
    background:rgba(255,255,255,0.08); color:#fff;
    border:1px solid rgba(255,255,255,0.18); border-radius:10px;
    font-family:'Plus Jakarta Sans',sans-serif; font-size:13px; font-weight:600;
    cursor:pointer; transition:background 0.2s; white-space:nowrap;
  }
  .ds-btn-ghost:hover { background:rgba(255,255,255,0.14); }

  /* ══ KPI CARDS ══ */
  .ds-kpi-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; }
  .ds-kpi-card {
    background:rgba(255,255,255,0.55);
    backdrop-filter:blur(16px) saturate(180%);
    -webkit-backdrop-filter:blur(16px) saturate(180%);
    border:1px solid rgba(255,255,255,0.7);
    border-radius:16px; padding:22px; cursor:pointer;
    transition:box-shadow 0.2s,transform 0.15s,background 0.2s;
    position:relative; overflow:hidden;
  }
  .ds-kpi-card::before {
    content:''; position:absolute; top:0; left:0; right:0;
    height:3px; background:${T}; border-radius:16px 16px 0 0;
  }
  .ds-kpi-card:hover {
    background:rgba(255,255,255,0.75);
    box-shadow:0 8px 32px rgba(60,110,113,0.14); transform:translateY(-2px);
  }
  .ds-kpi-icon-wrap {
    width:40px; height:40px; border-radius:10px;
    background:rgba(60,110,113,0.1); border:1px solid rgba(60,110,113,0.2);
    display:flex; align-items:center; justify-content:center;
    color:${T}; margin-bottom:16px;
  }
  .ds-kpi-num {
    font-family:'Plus Jakarta Sans',sans-serif; font-size:34px; font-weight:800;
    color:${T}; line-height:1; margin-bottom:5px; letter-spacing:-0.02em;
  }
  .ds-kpi-label { font-size:12px; color:${MUTED}; font-weight:500; margin-bottom:8px; }
  .ds-kpi-delta { font-size:11px; font-weight:600; color:${T}; }
  .ds-kpi-bar {
    height:3px; border-radius:2px; background:rgba(60,110,113,0.12);
    margin-top:14px; overflow:hidden;
  }
  .ds-kpi-bar-fill { height:100%; border-radius:2px; background:${T}; transition:width 1s ease; }

  /* ══ CARD BASE ══ */
  .ds-card { background:${CARD}; border:1px solid ${BORDER}; border-radius:14px; overflow:hidden; }
  .ds-card-head {
    padding:16px 20px; border-bottom:1px solid ${BORDER};
    display:flex; align-items:center; justify-content:space-between;
  }
  .ds-card-title {
    font-family:'Plus Jakarta Sans',sans-serif; font-size:13px; font-weight:700;
    color:${N}; display:flex; align-items:center; gap:8px;
  }
  .ds-card-link {
    display:flex; align-items:center; gap:4px; font-size:12px; color:${T};
    cursor:pointer; font-weight:600; background:none; border:none; padding:0;
    transition:color 0.15s; font-family:'Plus Jakarta Sans',sans-serif;
  }
  .ds-card-link:hover { color:${N}; }

  /* ══ ROW ITEM ══ */
  .ds-row-item {
    padding:12px 20px; border-bottom:1px solid ${BORDER};
    display:flex; align-items:center; justify-content:space-between; font-size:12px;
  }
  .ds-row-item:last-child { border-bottom:none; }
  .ds-row-label { color:${MUTED}; }
  .ds-row-val { font-weight:700; font-family:'Plus Jakarta Sans',sans-serif; }

  /* ══ PILL ══ */
  .ds-pill {
    font-size:10px; font-weight:700; padding:3px 10px; border-radius:999px;
    display:inline-flex; align-items:center; gap:4px; flex-shrink:0;
  }

  /* ══ LIVE DOT ══ */
  .ds-live-dot {
    width:7px; height:7px; border-radius:50%; background:${GREEN};
    display:inline-block; animation:ds-pulse 2s ease infinite;
  }
  @keyframes ds-pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
  @keyframes ds-spin  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes ds-fadein  { from{opacity:0} to{opacity:1} }
  @keyframes ds-slidein { from{transform:translateX(100%)} to{transform:translateX(0)} }

  /* ══ BUTTON OUTLINE ══ */
  .ds-btn-outline {
    padding:9px 24px; background:transparent; color:${N};
    border:1.5px solid ${N}; border-radius:9px;
    font-family:'Plus Jakarta Sans',sans-serif; font-size:13px; font-weight:700;
    cursor:pointer; transition:all 0.2s;
  }
  .ds-btn-outline:hover { background:${N}; color:#fff; }

  /* ══ RESPONSIVE ══ */
  @media (max-width:1100px) {
    .ds-kpi-grid { grid-template-columns:repeat(2,1fr); }
    .ds-banner   { flex-direction:column; align-items:flex-start; }
    .ds-root     { padding:20px 20px 60px; }
  }
`