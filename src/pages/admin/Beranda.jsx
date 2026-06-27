import { useNavigate } from 'react-router-dom'
import { useStore } from '../../store/useStore'
import { useState, useEffect, useRef } from 'react'

// ── Palette ───────────────────────────────────────────────────
const NAVY   = '#284B63'
const TEAL   = '#3C6E71'
const TEXT   = '#353535'
const MUTED  = '#6B7C8D'
const BORDER = '#D9D9D9'
const CARD   = '#FFFFFF'
const BG     = '#F4F7F9'
const RED    = '#C0392B'
const AMBER  = '#D4820A'
const GREEN  = '#1E7E4A'
const BLUE   = '#BFDBF7'

// ── SVG Icons ─────────────────────────────────────────────────
const I = {
  notif: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  refresh: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
  arrow: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  cctv: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>,
  map: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>,
  chart: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  pin: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  warning: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  check: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
  ai: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
  user: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  doc: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  clock: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
}

export default function AdminBeranda() {
  const navigate   = useNavigate()
  const laporan    = useStore(s => s.laporan)
  const notifikasi = useStore(s => s.notifikasi)
  const openModal  = useStore(s => s.openModal)
  const showToast  = useStore(s => s.showToast)
  const [clock, setClock]           = useState({ date:'', time:'' })
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      setClock({
        date: now.toLocaleDateString('id-ID', { weekday:'long', day:'numeric', month:'long', year:'numeric' }),
        time: now.toLocaleTimeString('id-ID', { hour:'2-digit', minute:'2-digit', second:'2-digit' }),
      })
    }
    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [])

  const unread  = notifikasi.filter(n => !n.read).length
  const total   = laporan.length
  const selesai = laporan.filter(l => l.status === 'selesai').length
  const proses  = laporan.filter(l => l.status === 'proses').length
  const baru    = laporan.filter(l => l.status === 'baru')
  const tingkat = total ? Math.round((selesai / total) * 100) : 0

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => { setRefreshing(false); showToast('Data berhasil diperbarui') }, 1200)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .ab2-root * { box-sizing: border-box; }
        .ab2-root {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: ${BG};
          color: ${TEXT};
          flex: 1;
          overflow-y: auto;
          padding: 36px 36px 60px;
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        /* ══ HERO HEADER ══ */
        .ab2-hero {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 32px;
        }
        .ab2-hero-left { flex: 1; }
        .ab2-hero-eyebrow {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: ${TEAL};
          margin-bottom: 10px;
        }
        .ab2-hero-title {
          font-size: clamp(22px, 2.5vw, 30px);
          font-weight: 800;
          color: ${NAVY};
          line-height: 1.2;
          letter-spacing: -0.02em;
          margin: 0 0 6px;
        }
        .ab2-hero-sub {
          font-size: 13px;
          color: ${MUTED};
          line-height: 1.7;
          max-width: 520px;
          margin: 0 0 20px;
        }
        .ab2-hero-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        /* Glass buttons */
        .ab2-btn-primary {
          display: flex; align-items: center; gap: 7px;
          padding: 10px 20px;
          background: ${NAVY};
          color: #fff;
          border: none; border-radius: 9px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13px; font-weight: 700;
          cursor: pointer;
          transition: background 0.18s, transform 0.12s;
        }
        .ab2-btn-primary:hover { background: ${TEAL}; transform: translateY(-1px); }

        .ab2-btn-glass {
          display: flex; align-items: center; gap: 7px;
          padding: 10px 20px;
          background: rgba(255,255,255,0.65);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          color: ${NAVY};
          border: 1px solid rgba(255,255,255,0.8);
          border-radius: 9px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13px; font-weight: 600;
          cursor: pointer;
          box-shadow: 0 2px 12px rgba(40,75,99,0.08);
          transition: all 0.18s;
        }
        .ab2-btn-glass:hover {
          background: rgba(255,255,255,0.88);
          box-shadow: 0 4px 18px rgba(40,75,99,0.12);
          transform: translateY(-1px);
        }

        /* Clock box */
        .ab2-clock-box{
    background: rgba(255,255,255,.50);
    backdrop-filter: blur(30px);
    -webkit-backdrop-filter: blur(30px);

    border: 1px solid rgba(255,255,255,.45);

    box-shadow:
        0 8px 30px rgba(40,75,99,.08);

    border-radius:16px;

    padding:22px 24px;

    width:240px;
    flex-shrink:0;

    display:flex;
    flex-direction:column;
    align-items:flex-end;
    gap:6px;
}
    position: relative;
    overflow: hidden;
    .ab2-clock-box::before{
    content:"";

    position:absolute;

    inset:0;

    background:
        linear-gradient(
            135deg,
            rgba(255,255,255,.32),
            rgba(255,255,255,0)
        );

    pointer-events:none;
}

        .ab2-clock-time{

    font-size:46px;

    font-weight:800;

    color:${NAVY};

    letter-spacing:-0.04em;
}
        .ab2-clock-date{
    color:${MUTED};
    font-size:12px;
}
        .ab2-clock-wita {
          font-size: 10px;
          font-weight: 700;
          color: ${TEAL};
          letter-spacing: 0.08em;
        }

        /* ══ STATISTIK HORIZONTAL (gaya publik) ══ */
        .ab2-stats-section {
          background: ${CARD};
          border: 1px solid ${BORDER};
          border-radius: 16px;
          overflow: hidden;
        }
        .ab2-stats-row {
          display: flex;
        }
        .ab2-stat-item {
          flex: 1;
          padding: 36px 28px 28px;
          position: relative;
          border-right: 1px solid ${BORDER};
        }
        .ab2-stat-item:last-child { border-right: none; }
        .ab2-stat-num {
          font-size: clamp(48px, 5vw, 64px);
          font-weight: 800;
          line-height: 1;
          margin-bottom: 10px;
          letter-spacing: -0.03em;
        }
        .ab2-stat-label {
          font-size: 13px;
          font-weight: 500;
          color: ${MUTED};
          line-height: 1.5;
          margin-bottom: 20px;
        }
        /* Garis progress dekoratif */
        .ab2-stat-bar {
          height: 3px;
          border-radius: 2px;
          background: ${BORDER};
          overflow: hidden;
        }
        .ab2-stat-bar-fill {
          height: 100%;
          border-radius: 2px;
          transition: width 1s ease;
        }

        /* ══ CARD BASE ══ */
        .ab2-card {
          background: ${CARD};
          border: 1px solid ${BORDER};
          border-radius: 14px;
          overflow: hidden;
        }
        .ab2-card-head {
          padding: 14px 20px;
          border-bottom: 1px solid ${BORDER};
          display: flex; align-items: center; justify-content: space-between;
        }
        .ab2-card-title {
          font-size: 13px; font-weight: 700; color: ${NAVY};
          display: flex; align-items: center; gap: 8px;
        }
        .ab2-card-link {
          display: flex; align-items: center; gap: 4px;
          font-size: 12px; color: ${TEAL}; font-weight: 600;
          background: none; border: none; padding: 0; cursor: pointer;
          transition: color 0.15s; font-family: inherit;
        }
        .ab2-card-link:hover { color: ${NAVY}; }

        /* ══ MAIN GRID ══ */
        .ab2-main-grid {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 20px;
        }

        /* ══ AKTIVITAS ══ */
        .ab2-activity {
          padding: 13px 20px;
          border-bottom: 1px solid ${BORDER};
          display: flex; gap: 12px; align-items: flex-start;
          cursor: pointer; transition: background 0.12s;
        }
        .ab2-activity:last-child { border-bottom: none; }
        .ab2-activity:hover { background: #F8FAFC; }
        .ab2-act-dot {
          width: 7px; height: 7px; border-radius: 50%;
          flex-shrink: 0; margin-top: 5px;
        }
        .ab2-act-title { font-size: 12px; font-weight: 700; color: ${TEXT}; margin-bottom: 3px; }
        .ab2-act-desc  { font-size: 11px; color: ${MUTED}; line-height: 1.6; }
        .ab2-act-time  { font-size: 10px; color: #9BAAB5; flex-shrink: 0; padding-top: 2px; white-space: nowrap; }
        .ab2-act-tag {
          display: inline-flex; align-items: center; gap: 4px;
          font-size: 10px; font-weight: 700;
          padding: 2px 8px; border-radius: 20px; margin-top: 5px;
        }

        /* ══ QUICK ACCESS ══ */
        .ab2-qa-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 8px; padding: 14px;
        }
        .ab2-qa-item {
          padding: 12px 10px; border-radius: 10px;
          border: 1px solid ${BORDER}; background: #F8FAFC;
          cursor: pointer; text-align: center; transition: all 0.18s;
        }
        .ab2-qa-item:hover { border-color: ${TEAL}; background: rgba(60,110,113,0.05); }
        .ab2-qa-icon {
          width: 30px; height: 30px; border-radius: 8px;
          background: rgba(40,75,99,0.08); border: 1px solid rgba(40,75,99,0.12);
          display: flex; align-items: center; justify-content: center;
          color: ${NAVY}; margin: 0 auto 8px;
        }
        .ab2-qa-label { font-size: 11px; font-weight: 600; color: ${TEXT}; }

        /* ══ PERLU TINDAKAN ══ */
        .ab2-alert-item {
          display: flex; align-items: center; gap: 10px;
          padding: 11px 20px; border-bottom: 1px solid ${BORDER};
          cursor: pointer; transition: background 0.12s;
        }
        .ab2-alert-item:last-child { border-bottom: none; }
        .ab2-alert-item:hover { background: #FEF9F9; }
        .ab2-alert-dot { width: 6px; height: 6px; border-radius: 50%; background: ${RED}; flex-shrink: 0; }
        .ab2-alert-name { flex: 1; font-size: 12px; font-weight: 700; color: ${TEXT}; }
        .ab2-alert-sub  { font-size: 10px; color: ${MUTED}; }
        .ab2-pill {
          font-size: 10px; font-weight: 700;
          padding: 2px 9px; border-radius: 99px;
          display: inline-flex; align-items: center;
        }

        /* ══ BOTTOM GRID ══ */
        .ab2-bottom-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        /* ══ BAR CHART ══ */
        .ab2-bar-wrap { display: flex; align-items: flex-end; gap: 6px; height: 72px; padding: 0 20px; }
        .ab2-bar-col { flex: 1; position: relative; border-radius: 4px 4px 0 0; cursor: pointer; transition: opacity 0.12s; }
        .ab2-bar-labels { display: flex; justify-content: space-between; padding: 5px 20px 14px; font-size: 9px; color: #9BAAB5; }

        /* ══ ROW ITEM ══ */
        .ab2-row-item {
          padding: 11px 20px;
          border-bottom: 1px solid ${BORDER};
          display: flex; align-items: center; justify-content: space-between;
          font-size: 12px;
        }
        .ab2-row-item:last-child { border-bottom: none; }
        .ab2-row-label { color: ${MUTED}; }
        .ab2-row-val   { font-weight: 700; color: ${NAVY}; }

        /* ══ CCTV ══ */
        .ab2-cctv-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 1px; background: ${BORDER}; }
        .ab2-cctv-feed { background: #060f1c; position: relative; aspect-ratio: 16/9; overflow: hidden; cursor: pointer; }
        .ab2-cctv-feed canvas { width: 100%; height: 100%; display: block; }
        .ab2-cctv-overlay {
          position: absolute; inset: 0;
          display: flex; flex-direction: column; justify-content: space-between; padding: 10px;
          background: linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 35%, transparent 60%, rgba(0,0,0,0.65) 100%);
        }
        .ab2-cctv-top { display: flex; justify-content: space-between; align-items: flex-start; }
        .ab2-cctv-label {
          font-size: 10px; font-weight: 600;
          background: rgba(40,75,99,0.75); color: rgba(191,219,247,0.9);
          padding: 3px 9px; border-radius: 6px;
          display: flex; align-items: center; gap: 5px;
        }
        .ab2-cctv-rec {
          font-size: 9px; font-weight: 700;
          background: rgba(192,57,43,0.85); color: #fff;
          padding: 3px 8px; border-radius: 6px;
          display: flex; align-items: center; gap: 4px;
        }
        .ab2-cctv-rec-dot {
          width: 5px; height: 5px; border-radius: 50%; background: #fff;
          animation: ab2-pulse 1.2s ease infinite;
        }
        .ab2-cctv-alert {
          font-size: 10px; font-weight: 700;
          background: rgba(192,57,43,0.88); color: #fff;
          padding: 5px 10px; border-radius: 7px; text-align: center;
          display: flex; align-items: center; justify-content: center; gap: 5px;
        }
        .ab2-cctv-footer { display: flex; align-items: center; justify-content: space-between; }
        .ab2-cctv-res { font-size: 9px; color: rgba(255,255,255,0.4); font-family: monospace; }
        .ab2-cctv-btn {
          font-size: 10px; font-weight: 600; color: rgba(191,219,247,0.85);
          background: rgba(40,75,99,0.65); border: 1px solid rgba(191,219,247,0.15);
          border-radius: 6px; padding: 3px 9px; cursor: pointer; font-family: inherit;
          transition: background 0.12s;
        }
        .ab2-cctv-btn:hover { background: rgba(60,110,113,0.5); }
        .ab2-cctv-more {
          padding: 12px 20px; text-align: center; border-top: 1px solid ${BORDER};
        }
        .ab2-btn-outline {
          padding: 8px 22px; background: transparent; color: ${NAVY};
          border: 1.5px solid ${NAVY}; border-radius: 9px;
          font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; font-weight: 700;
          cursor: pointer; transition: all 0.18s;
        }
        .ab2-btn-outline:hover { background: ${NAVY}; color: #fff; }

        @keyframes ab2-pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes ab2-spin   { to{transform:rotate(360deg)} }

        @media (max-width: 1100px) {
          .ab2-main-grid   { grid-template-columns: 1fr; }
          .ab2-bottom-grid { grid-template-columns: 1fr; }
          .ab2-hero        { flex-direction: column; }
          .ab2-clock-box   { width: 100%; align-items: flex-start; }
          .ab2-root        { padding: 20px 20px 60px; }
        }
        @media (max-width: 700px) {
          .ab2-stats-row { flex-direction: column; }
          .ab2-stat-item { border-right: none; border-bottom: 1px solid ${BORDER}; }
          .ab2-stat-item:last-child { border-bottom: none; }
          .ab2-cctv-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="ab2-root">

        {/* ══ HERO HEADER ══ */}
        <div className="ab2-hero">
          <div className="ab2-hero-left">
            <div className="ab2-hero-eyebrow">Selamat datang kembali, Admin DP3A</div>
            <h1 className="ab2-hero-title">
              Dashboard Delcion:<br/>
              Pemantauan &amp; Penanganan Pekerja<br/>
              di Bawah Umur Kota Manado
            </h1>
            <p className="ab2-hero-sub">
              Terdapat <strong>{baru.length} laporan baru</strong> dan{' '}
              <strong>{unread} notifikasi</strong> yang membutuhkan perhatian Anda hari ini.
            </p>
            <div className="ab2-hero-actions">
              <button className="ab2-btn-primary" onClick={() => navigate('/admin/notifikasi')}>
                {I.notif}
                Lihat Notifikasi
                {unread > 0 && (
                  <span style={{
                    background:'rgba(191,219,247,0.25)', color:'#fff',
                    borderRadius:'99px', fontSize:10, fontWeight:800,
                    padding:'1px 7px',
                  }}>{unread}</span>
                )}
              </button>
              <button className="ab2-btn-glass" onClick={handleRefresh}>
                <span style={{ display:'inline-flex', animation: refreshing ? 'ab2-spin 0.7s linear infinite' : 'none' }}>
                  {I.refresh}
                </span>
                {refreshing ? 'Memperbarui...' : 'Perbarui Data'}
              </button>
            </div>
          </div>

          {/* Clock */}
          <div className="ab2-clock-box">
            <div className="ab2-clock-wita">WITA</div>
            <div className="ab2-clock-time">{clock.time}</div>
            <div className="ab2-clock-date">{clock.date}</div>
          </div>
        </div>

        {/* ══ STATISTIK HORIZONTAL ══ */}
        <div className="ab2-stats-section">
          <div className="ab2-stats-row">
            {[
  {
    num: total,
    label: 'Total Laporan Bulan Ini',
    color: NAVY,
    fill: 72,
    barColor: NAVY,
  },
  {
    num: baru.length,
    label: 'Laporan Baru',
    color: NAVY,
    fill: total ? (baru.length / total) * 100 : 0,
    barColor: NAVY,
  },
  {
    num: proses,
    label: 'Sedang Diproses',
    color: NAVY,
    fill: total ? (proses / total) * 100 : 0,
    barColor: NAVY,
  },
  {
    num: `${tingkat}%`,
    label: 'Tingkat Penanganan',
    color: NAVY,
    fill: tingkat,
    barColor: NAVY,
  },
].map((s, i) => (
              <div key={i} className="ab2-stat-item">
                <div className="ab2-stat-num" style={{ color: s.color }}>{s.num}</div>
                <div className="ab2-stat-label">{s.label}</div>
                <div className="ab2-stat-bar">
                  <div className="ab2-stat-bar-fill" style={{ width:`${s.fill}%`, background: s.barColor, opacity: 0.5 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ══ CCTV PREVIEW ══ */}
        <div className="ab2-card">
          <div className="ab2-card-head">
            <div className="ab2-card-title">{I.cctv} Monitoring CCTV — 4 Kamera Aktif</div>
            <button className="ab2-card-link" onClick={() => navigate('/admin/cctv')}>
              Lihat Semua {I.arrow}
            </button>
          </div>
          <div className="ab2-cctv-grid">
            {[
              { id:1, label:'Megamas — CAM 01',  res:'1080p', fps:25, alert:true,  detections:[{ x:0.28, y:0.25, w:80, h:130, conf:94, color:'#E8401C' }] },
              { id:2, label:'Pasar 45 — CAM 02', res:'720p',  fps:20, alert:false, detections:[] },
              { id:3, label:'Matos — CAM 03',    res:'1080p', fps:30, alert:false, detections:[] },
              { id:4, label:'Boulevard — CAM 04',res:'720p',  fps:15, alert:false, detections:[] },
            ].map(cam => (
              <MiniCCTV key={cam.id} cam={cam} onClick={() => navigate('/admin/cctv')} />
            ))}
          </div>
          <div className="ab2-cctv-more">
            <button className="ab2-btn-outline" onClick={() => navigate('/admin/cctv')}>
              Buka Monitoring CCTV Penuh
            </button>
          </div>
        </div>

        {/* ══ MAIN GRID ══ */}
        <div className="ab2-main-grid">

          {/* Aktivitas */}
          <div className="ab2-card">
            <div className="ab2-card-head">
              <div className="ab2-card-title">Aktivitas Terbaru</div>
              <button className="ab2-card-link" onClick={() => navigate('/admin/notifikasi')}>
                Lihat semua {I.arrow}
              </button>
            </div>
            {[
              { dot:RED,   tag:'AI',     tagBg:`rgba(192,57,43,0.09)`, tagColor:RED,   title:'Terdeteksi 2 Anak — Megamas',      desc:'CAM-01 mendeteksi 2 anak membawa dagangan. Confidence 94% dan 87%.', time:'14 mnt', href:'/admin/notifikasi', icon: I.ai },
              { dot:AMBER, tag:'Warga',  tagBg:`rgba(212,130,10,0.09)`,tagColor:AMBER, title:'Laporan Warga — Pasar 45',         desc:'M. Reza melaporkan anak usia 8–10 tahun mengamen di area parkir.',   time:'1 jam',  href:'/admin/laporan',    icon: I.user },
              { dot:AMBER, tag:'Warga',  tagBg:`rgba(212,130,10,0.09)`,tagColor:AMBER, title:'Laporan Warga — Figuran Matos',    desc:'Anak memakai kostum kartun meminta sumbangan dari pengunjung.',      time:'5 jam',  href:'/admin/laporan',    icon: I.user },
              { dot:GREEN, tag:'Selesai',tagBg:`rgba(30,126,74,0.09)`, tagColor:GREEN, title:'Penanganan Berhasil — Jl. Boulevard',desc:'3 anak berhasil dijemput dan dipulangkan ke keluarga oleh petugas.', time:'3 jam',  href:'/admin/statistik',  icon: I.check },
            ].map((a, i) => (
              <div key={i} className="ab2-activity" onClick={() => navigate(a.href)}>
                <div className="ab2-act-dot" style={{ background: a.dot }} />
                <div style={{ flex:1 }}>
                  <div className="ab2-act-title">{a.title}</div>
                  <div className="ab2-act-desc">{a.desc}</div>
                  <span className="ab2-act-tag" style={{ background: a.tagBg, color: a.tagColor }}>
                    {a.icon} {a.tag}
                  </span>
                </div>
                <div className="ab2-act-time">{a.time}</div>
              </div>
            ))}
          </div>

          {/* Kolom kanan */}
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

            {/* Akses Cepat */}
            <div className="ab2-card">
              <div className="ab2-card-head">
                <div className="ab2-card-title">Akses Cepat</div>
              </div>
              <div className="ab2-qa-grid">
                {[
                  { icon:I.cctv,  label:'CCTV Live',    href:'/admin/cctv' },
                  { icon:I.map,   label:'Peta Sebaran', href:'/admin/peta' },
                  { icon:I.notif, label:'Notifikasi',   href:'/admin/notifikasi' },
                  { icon:I.chart, label:'Statistik',    href:'/admin/statistik' },
                ].map(q => (
                  <div key={q.label} className="ab2-qa-item" onClick={() => navigate(q.href)}>
                    <div className="ab2-qa-icon">{q.icon}</div>
                    <div className="ab2-qa-label">{q.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Perlu Tindakan */}
            <div className="ab2-card">
              <div className="ab2-card-head">
                <div className="ab2-card-title" style={{ color:RED }}>
                  {I.warning} Perlu Tindakan
                </div>
                <button className="ab2-card-link" onClick={() => navigate('/admin/laporan')}>
                  Lihat semua {I.arrow}
                </button>
              </div>
              {baru.slice(0, 3).map(l => (
                <div key={l.id} className="ab2-alert-item" onClick={() => openModal?.('detail', l)}>
                  <div className="ab2-alert-dot" />
                  <div style={{ flex:1 }}>
                    <div className="ab2-alert-name">{l.lokasi}</div>
                    <div className="ab2-alert-sub">Belum diverifikasi</div>
                  </div>
                  <span className="ab2-pill" style={{ background:'rgba(192,57,43,0.09)', color:RED }}>Baru</span>
                </div>
              ))}
              {baru.length === 0 && (
                <div style={{ padding:20, textAlign:'center', fontSize:12, color:MUTED }}>
                  Tidak ada laporan menunggu
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ══ BOTTOM GRID ══ */}
        <div className="ab2-bottom-grid">

          {/* Mini chart */}
          <div className="ab2-card">
            <div className="ab2-card-head">
              <div className="ab2-card-title">{I.chart} Laporan 7 Hari Terakhir</div>
              <button className="ab2-card-link" onClick={() => navigate('/admin/statistik')}>Detail {I.arrow}</button>
            </div>
            <MiniChart />
          </div>

          {/* Lokasi rawan */}
          <div className="ab2-card">
            <div className="ab2-card-head">
              <div className="ab2-card-title">{I.pin} Lokasi Paling Rawan</div>
              <button className="ab2-card-link" onClick={() => navigate('/admin/peta')}>Peta {I.arrow}</button>
            </div>
            {[
              { label:'Kawasan Megamas',    num:'48' },
              { label:'Pasar 45',           num:'35' },
              { label:'Jl. Boulevard',      num:'27' },
              { label:'Manado Town Square', num:'19' },
            ].map(r => (
              <div key={r.label} className="ab2-row-item">
                <span className="ab2-row-label">{r.label}</span>
                <span className="ab2-row-val" style={{ color:TEAL }}>{r.num} laporan</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  )
}

/* ── Mini CCTV Canvas ─────────────────────────────────────── */
function MiniCCTV({ cam, onClick }) {
  const canvasRef = useRef(null)
  const animRef   = useRef(null)
  const timeRef   = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const draw = (ts) => {
      const W = canvas.width, H = canvas.height
      timeRef.current = ts * 0.001
      ctx.fillStyle = '#060f1c'; ctx.fillRect(0, 0, W, H)
      ctx.fillStyle = '#0a1828'; ctx.fillRect(0, H*0.7, W, H*0.3)
      const buildings = [
        {x:0,y:0.20,w:0.14,h:0.50,c:'#0d1f38'},{x:0.16,y:0.28,w:0.12,h:0.42,c:'#0c1c32'},
        {x:0.30,y:0.16,w:0.18,h:0.54,c:'#0e2040'},{x:0.55,y:0.24,w:0.15,h:0.46,c:'#0d1f38'},
        {x:0.72,y:0.18,w:0.28,h:0.52,c:'#0c1c32'},
      ]
      buildings.forEach(b => {
        ctx.fillStyle = b.c; ctx.fillRect(b.x*W, b.y*H, b.w*W, b.h*H)
        for (let wy=0;wy<3;wy++) for (let wx=0;wx<2;wx++) {
          const lit = Math.sin(timeRef.current*0.3+cam.id+wy*2+wx)>0.2
          ctx.fillStyle = lit?'rgba(255,220,100,0.15)':'rgba(0,0,0,0.3)'
          ctx.fillRect(b.x*W+5+wx*((b.w*W-10)/2),b.y*H+10+wy*((b.h*H-16)/3),(b.w*W-10)/2-3,(b.h*H-16)/3-3)
        }
      })
      ctx.fillStyle='#0f1e2e'; ctx.fillRect(0,H*0.68,W,H*0.06)
      for (let p=0;p<3+cam.id;p++) {
        const speed=0.03+p*0.01
        const px=((timeRef.current*speed*(p%2===0?1:-1)+p*0.25)%1+1)%1, py=0.63+(p%3)*0.03, h2=H*0.1
        ctx.fillStyle='rgba(20,40,70,0.9)'; ctx.beginPath()
        ctx.ellipse(px*W,py*H+h2*0.4,h2*0.1,h2*0.4,0,0,Math.PI*2); ctx.fill()
        ctx.beginPath(); ctx.arc(px*W,py*H-h2*0.05,h2*0.12,0,Math.PI*2); ctx.fill()
      }
      if (cam.detections.length>0) {
        cam.detections.forEach(d => {
          const pulse=0.7+Math.sin(timeRef.current*2)*0.3
          ctx.strokeStyle=d.color; ctx.lineWidth=1.5; ctx.globalAlpha=pulse
          ctx.strokeRect(d.x*W,d.y*H,d.w,d.h); ctx.globalAlpha=1
          ctx.fillStyle=d.color; ctx.fillRect(d.x*W,d.y*H-14,d.w,14)
          ctx.fillStyle='#fff'; ctx.font='bold 8px monospace'
          ctx.fillText(`Anak ${d.conf}%`,d.x*W+3,d.y*H-3)
        })
      }
      for (let y=0;y<H;y+=3){ctx.fillStyle='rgba(0,0,0,0.06)';ctx.fillRect(0,y,W,1)}
      ctx.fillStyle='rgba(191,219,247,0.35)'; ctx.font='7px monospace'
      ctx.fillText(new Date().toLocaleTimeString('id-ID'),6,H-5)
      animRef.current = requestAnimationFrame(draw)
    }
    animRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(animRef.current)
  }, [cam])

  return (
    <div className="ab2-cctv-feed" onClick={onClick} style={{ outline: cam.alert?`2px solid ${RED}`:'none' }}>
      <canvas ref={canvasRef} width={400} height={225} />
      <div className="ab2-cctv-overlay">
        <div className="ab2-cctv-top">
          <span className="ab2-cctv-label">
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            {cam.label}
          </span>
          <span className="ab2-cctv-rec"><span className="ab2-cctv-rec-dot"/>REC</span>
        </div>
        {cam.alert && (
          <div className="ab2-cctv-alert">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/></svg>
            Terdeteksi: anak berjualan
          </div>
        )}
        <div className="ab2-cctv-footer">
          <span className="ab2-cctv-res">{cam.res} · {cam.fps}fps</span>
          <button className="ab2-cctv-btn">Fokus</button>
        </div>
      </div>
    </div>
  )
}

/* ── Mini Bar Chart ─────────────────────────────────────── */
function MiniChart() {
  const bars = [
    {label:'Sen',val:8},{label:'Sel',val:14},{label:'Rab',val:11},
    {label:'Kam',val:20},{label:'Jum',val:17},{label:'Sab',val:9},{label:'Min',val:5},
  ]
  const max = Math.max(...bars.map(b => b.val))
  const [hov, setHov] = useState(null)

  return (
    <>
      <div className="ab2-bar-wrap">
        {bars.map((b, i) => (
          <div key={i} className="ab2-bar-col"
            style={{ height:`${(b.val/max)*100}%`, background: TEAL, opacity: hov===i?1:0.45 }}
            onMouseEnter={()=>setHov(i)} onMouseLeave={()=>setHov(null)}>
            {hov===i && (
              <div style={{
                position:'absolute', bottom:'108%', left:'50%', transform:'translateX(-50%)',
                background:NAVY, color:'#fff', borderRadius:5, padding:'2px 7px',
                fontSize:10, fontWeight:700, whiteSpace:'nowrap', fontFamily:"'Plus Jakarta Sans',sans-serif",
              }}>{b.val}</div>
            )}
          </div>
        ))}
      </div>
      <div className="ab2-bar-labels">{bars.map(b=><span key={b.label}>{b.label}</span>)}</div>
    </>
  )
}