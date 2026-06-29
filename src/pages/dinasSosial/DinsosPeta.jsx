import { useState, useEffect } from 'react'
import { useStore } from '../../store/useStore'
import { PETA_TITIK, KASUS_DATA } from './dinsoConstants'

// ── Palette identik AdminPeta (DP3A) ──────────────────────────
const N      = '#284B63'
const T      = '#3C6E71'
const TEXT   = '#353535'
const MUTED  = '#6B7C8D'
const BORDER = '#D9D9D9'
const CARD   = '#FFFFFF'
const BG     = '#F4F7F9'
const RED    = '#C0392B'
const AMBER  = '#D4820A'
const GREEN  = '#1E7E4A'

const STATUS_META = {
  baru:    { label: 'Baru',     color: RED,   bg: `rgba(192,57,43,0.1)`,  pinColor: '#E8401C' },
  proses:  { label: 'Diproses', color: AMBER, bg: `rgba(212,130,10,0.1)`, pinColor: '#D4820A' },
  selesai: { label: 'Selesai',  color: GREEN, bg: `rgba(30,126,74,0.1)`,  pinColor: '#2ECC71' },
}

// Normalisasi PETA_TITIK → PINS (tambah field status jika belum ada)
const PINS = PETA_TITIK.map((p, i) => ({
  id:     p.id     ?? `pin-${i}`,
  x:      p.x,
  y:      p.y,
  label:  p.label,
  desc:   p.desc   ?? `${p.count} laporan terverifikasi`,
  time:   p.time   ?? 'Hari ini',
  count:  p.count  ?? 0,
  status: p.status ?? (p.alert ? 'baru' : 'selesai'),
}))

const Icon = {
  pin: (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>),
  map: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>),
  total: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/></svg>),
  warning: (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>),
  check: (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>),
  proses: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>),
  arrow: (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>),
  focus: (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>),
  tugaskan: (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/><line x1="19" y1="8" x2="23" y2="8"/><line x1="21" y1="6" x2="21" y2="10"/></svg>),
  refresh: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>),
  download: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>),
  clock: (<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>),
}

export default function DinsosPeta() {
  const showToast  = useStore(s => s.showToast)
  const [clock, setClock]           = useState('')
  const [selected, setSelected]     = useState(null)
  const [filter, setFilter]         = useState('semua')
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleString('id-ID', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
    }))
    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [])

  const totalBaru    = PINS.filter(p => p.status === 'baru').length
  const totalProses  = PINS.filter(p => p.status === 'proses').length
  const totalSelesai = PINS.filter(p => p.status === 'selesai').length
  const totalAktif   = PINS.filter(p => p.status !== 'selesai').length
  const tingkat      = PINS.length ? Math.round((totalSelesai / PINS.length) * 100) : 0
  const filtered     = PINS.filter(p => filter === 'semua' || p.status === filter)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .dp-root * { box-sizing: border-box; }
        .dp-root {
          font-family: 'Plus Jakarta Sans', sans-serif; background: ${BG}; color: ${TEXT};
          flex: 1; overflow-y: auto; padding: 28px 32px 60px;
          display: flex; flex-direction: column; gap: 24px;
        }
        .dp-banner {
          background: ${N}; border-radius: 18px; padding: 28px 36px;
          display: flex; align-items: center; justify-content: space-between;
          gap: 24px; position: relative; overflow: hidden;
        }
        .dp-banner::before {
          content: ''; position: absolute; right: -80px; top: -80px;
          width: 320px; height: 320px; border-radius: 50%;
          background: radial-gradient(circle, rgba(60,110,113,0.3) 0%, transparent 65%);
          pointer-events: none;
        }
        .dp-banner::after {
          content: ''; position: absolute; left: 40%; bottom: -60px;
          width: 200px; height: 200px; border-radius: 50%;
          background: radial-gradient(circle, rgba(191,219,247,0.06) 0%, transparent 70%);
          pointer-events: none;
        }
        .dp-banner-eyebrow {
          font-size: 11px; color: rgba(191,219,247,0.5); margin-bottom: 8px;
          font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .dp-banner-title {
          font-family: 'Plus Jakarta Sans', sans-serif; font-size: clamp(22px,3vw,30px);
          font-weight: 800; color: #fff; line-height: 1.15; margin-bottom: 10px; letter-spacing: -0.02em;
        }
        .dp-banner-title span { color: #BFDBF7; }
        .dp-banner-sub { font-size: 13px; color: rgba(255,255,255,0.6); line-height: 1.65; max-width: 440px; }
        .dp-banner-sub strong { color: #fff; font-weight: 700; }
        .dp-banner-clock { font-size: 11px; color: rgba(191,219,247,0.35); margin-top: 12px; font-family: 'Plus Jakarta Sans', sans-serif; letter-spacing: 0.02em; display: flex; align-items: center; gap: 6px; }
        .dp-banner-actions { display: flex; flex-direction: column; gap: 10px; flex-shrink: 0; position: relative; z-index: 1; }
        .dp-btn-teal {
          display: flex; align-items: center; gap: 8px; padding: 12px 22px;
          background: ${T}; color: #fff; border: none; border-radius: 10px;
          font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; font-weight: 700;
          cursor: pointer; transition: background 0.2s, transform 0.15s; white-space: nowrap;
        }
        .dp-btn-teal:hover { background: #2f5759; transform: translateY(-1px); }
        .dp-btn-ghost {
          display: flex; align-items: center; gap: 8px; padding: 11px 22px;
          background: rgba(255,255,255,0.08); color: #fff;
          border: 1px solid rgba(255,255,255,0.18); border-radius: 10px;
          font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; font-weight: 600;
          cursor: pointer; transition: background 0.2s; white-space: nowrap;
        }
        .dp-btn-ghost:hover { background: rgba(255,255,255,0.14); }
        .dp-kpi-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; }
        .dp-kpi-card {
          background: rgba(255,255,255,0.55); backdrop-filter: blur(16px) saturate(180%);
          -webkit-backdrop-filter: blur(16px) saturate(180%);
          border: 1px solid rgba(255,255,255,0.7); border-radius: 16px; padding: 22px;
          cursor: default; transition: box-shadow 0.2s, transform 0.15s, background 0.2s;
          position: relative; overflow: hidden;
        }
        .dp-kpi-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
          background: var(--accent-color, ${T}); border-radius: 16px 16px 0 0;
        }
        .dp-kpi-card:hover { background: rgba(255,255,255,0.75); box-shadow: 0 8px 32px rgba(60,110,113,0.14); transform: translateY(-2px); }
        .dp-kpi-icon-wrap {
          width: 40px; height: 40px; border-radius: 10px;
          background: var(--icon-bg, rgba(60,110,113,0.1));
          border: 1px solid var(--icon-border, rgba(60,110,113,0.2));
          display: flex; align-items: center; justify-content: center;
          color: var(--icon-color, ${T}); margin-bottom: 16px;
        }
        .dp-kpi-num { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 34px; font-weight: 800; color: var(--num-color, ${T}); line-height: 1; margin-bottom: 5px; letter-spacing: -0.02em; }
        .dp-kpi-label { font-size: 12px; color: ${MUTED}; font-weight: 500; margin-bottom: 12px; }
        .dp-kpi-delta { font-size: 11px; font-weight: 600; color: var(--delta-color, ${T}); display: flex; align-items: center; gap: 4px; }
        .dp-kpi-bar { height: 3px; border-radius: 2px; background: rgba(60,110,113,0.12); margin-top: 14px; overflow: hidden; }
        .dp-kpi-bar-fill { height: 100%; border-radius: 2px; background: var(--bar-color, ${T}); transition: width 1s ease; }
        .dp-card { background: ${CARD}; border: 1px solid ${BORDER}; border-radius: 14px; overflow: hidden; }
        .dp-card-head { padding: 16px 20px; border-bottom: 1px solid ${BORDER}; display: flex; align-items: center; justify-content: space-between; }
        .dp-card-title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; font-weight: 700; color: ${N}; display: flex; align-items: center; gap: 8px; }
        .dp-filter-row { display: flex; align-items: center; gap: 8px; }
        .dp-filter-pill {
          padding: 7px 16px; border-radius: 999px; font-size: 12px; font-weight: 600;
          cursor: pointer; border: 1.5px solid ${BORDER};
          font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.18s;
          background: rgba(255,255,255,0.7); color: ${MUTED};
        }
        .dp-filter-pill:hover { background: rgba(60,110,113,0.08); border-color: ${T}; color: ${T}; }
        .dp-filter-pill.active { background: ${N}; color: #fff; border-color: ${N}; }
        .dp-map-wrap { background: #0A1420; flex: 1; position: relative; min-height: 380px; }
        .dp-map-wrap svg { display: block; width: 100%; height: 100%; }
        .dp-main-grid { display: grid; grid-template-columns: 1fr 300px; gap: 16px; min-height: 480px; }
        .dp-pin-card {
          background: #F8FAFC; border: 1.5px solid ${BORDER}; border-radius: 12px;
          padding: 14px; cursor: pointer; transition: all 0.18s; position: relative; overflow: hidden;
        }
        .dp-pin-card::before {
          content: ''; position: absolute; left: 0; top: 0; bottom: 0;
          width: 3px; border-radius: 12px 0 0 12px; background: var(--pin-color);
        }
        .dp-pin-card:hover { background: rgba(255,255,255,0.9); box-shadow: 0 4px 16px rgba(60,110,113,0.1); border-color: var(--pin-color); }
        .dp-pin-card.selected { background: #fff; border-color: var(--pin-color); box-shadow: 0 4px 20px rgba(40,75,99,0.08); }
        .dp-pin-card-head { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 5px; padding-left: 10px; }
        .dp-pin-card-name { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; font-weight: 700; color: ${TEXT}; display: flex; align-items: center; gap: 5px; }
        .dp-pin-card-time { font-size: 10px; color: #9BAAB5; white-space: nowrap; flex-shrink: 0; padding-top: 1px; }
        .dp-pin-card-desc { font-size: 11px; color: ${MUTED}; line-height: 1.55; margin-bottom: 10px; padding-left: 10px; }
        .dp-pin-card-footer { display: flex; align-items: center; justify-content: space-between; padding-left: 10px; }
        .dp-pill { font-size: 10px; font-weight: 700; padding: 3px 10px; border-radius: 999px; display: inline-flex; align-items: center; gap: 4px; font-family: 'Plus Jakarta Sans', sans-serif; }
        .dp-pin-btns { display: flex; gap: 6px; }
        .dp-btn-solid { padding: 6px 12px; background: ${T}; color: #fff; border: none; border-radius: 8px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 11px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 5px; transition: background 0.15s; }
        .dp-btn-solid:hover { background: #2f5759; }
        .dp-btn-outline { padding: 6px 12px; background: transparent; color: ${N}; border: 1.5px solid ${BORDER}; border-radius: 8px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 11px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 5px; transition: all 0.15s; }
        .dp-btn-outline:hover { border-color: ${T}; color: ${T}; }
        .dp-legend { display: flex; align-items: center; gap: 16px; padding: 10px 16px; border-top: 1px solid ${BORDER}; background: rgba(255,255,255,0.6); flex-wrap: wrap; }
        .dp-legend-item { display: flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 600; color: ${MUTED}; font-family: 'Plus Jakarta Sans', sans-serif; }
        .dp-legend-dot { width: 8px; height: 8px; border-radius: 50%; }
        .dp-live-dot { width: 7px; height: 7px; border-radius: 50%; background: ${GREEN}; display: inline-block; animation: dp-pulse 2s ease infinite; }
        @keyframes dp-pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes dp-spin  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @media (max-width: 1100px) {
          .dp-kpi-grid  { grid-template-columns: repeat(2,1fr); }
          .dp-main-grid { grid-template-columns: 1fr; }
          .dp-banner    { flex-direction: column; align-items: flex-start; }
          .dp-root      { padding: 20px 20px 60px; }
        }
        @media (max-width: 600px) { .dp-kpi-grid { grid-template-columns: 1fr; } }
      `}</style>

      <div className="dp-root">

        {/* ══ BANNER ══ */}
        <div className="dp-banner">
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="dp-banner-eyebrow">Portal Dinas Sosial — Kota Manado</div>
            <div className="dp-banner-title">
              Peta Sebaran<br/><span>Laporan Terverifikasi</span>
            </div>
            <div className="dp-banner-sub">
              Terdapat <strong>{totalAktif} laporan aktif</strong> —{' '}
              <strong>{totalBaru} baru</strong> menunggu tindakan dan{' '}
              <strong>{totalProses} sedang diproses</strong> petugas.
            </div>
            <div className="dp-banner-clock">{Icon.clock} {clock} WITA</div>
          </div>
          <div className="dp-banner-actions">
            <button className="dp-btn-teal">{Icon.download} Unduh Peta PDF</button>
            <button className="dp-btn-ghost" onClick={() => {
              setRefreshing(true)
              setTimeout(() => { setRefreshing(false); showToast('Data peta diperbarui') }, 1200)
            }}>
              <span style={{ display: 'inline-flex', animation: refreshing ? 'dp-spin 0.7s linear infinite' : 'none' }}>
                {Icon.refresh}
              </span>
              {refreshing ? 'Memperbarui...' : 'Perbarui Data'}
            </button>
          </div>
        </div>

        {/* ══ KPI GLASS CARDS ══ */}
        <div className="dp-kpi-grid">
          {[
            { icon: Icon.total,   num: KASUS_DATA.length, label: 'Total Kasus Terverifikasi', delta: 'Naik 12% dari bulan lalu',       fill: 100,    accentColor: T,     iconBg: 'rgba(60,110,113,0.1)',  iconBorder: 'rgba(60,110,113,0.2)',  iconColor: T,     numColor: T,     deltaColor: T,     barColor: T     },
            { icon: Icon.warning, num: totalBaru,          label: 'Laporan Baru',              delta: 'Menunggu tindakan segera',       fill: PINS.length ? (totalBaru    / PINS.length) * 100 : 0, accentColor: RED,   iconBg: 'rgba(192,57,43,0.1)',   iconBorder: 'rgba(192,57,43,0.2)',   iconColor: RED,   numColor: RED,   deltaColor: RED,   barColor: RED   },
            { icon: Icon.proses,  num: totalProses,        label: 'Sedang Diproses',           delta: 'Dalam penanganan petugas',       fill: PINS.length ? (totalProses  / PINS.length) * 100 : 0, accentColor: AMBER, iconBg: 'rgba(212,130,10,0.1)',  iconBorder: 'rgba(212,130,10,0.2)',  iconColor: AMBER, numColor: AMBER, deltaColor: AMBER, barColor: AMBER },
            { icon: Icon.check,   num: totalSelesai,       label: 'Berhasil Ditangani',        delta: `${tingkat}% tingkat penanganan`, fill: tingkat, accentColor: GREEN, iconBg: 'rgba(30,126,74,0.1)',   iconBorder: 'rgba(30,126,74,0.2)',   iconColor: GREEN, numColor: GREEN, deltaColor: GREEN, barColor: GREEN },
          ].map((k, i) => (
            <div key={i} className="dp-kpi-card" style={{ '--accent-color': k.accentColor, '--icon-bg': k.iconBg, '--icon-border': k.iconBorder, '--icon-color': k.iconColor, '--num-color': k.numColor, '--delta-color': k.deltaColor, '--bar-color': k.barColor }}>
              <div className="dp-kpi-icon-wrap">{k.icon}</div>
              <div className="dp-kpi-num">{k.num}</div>
              <div className="dp-kpi-label">{k.label}</div>
              <div className="dp-kpi-delta">{k.delta}</div>
              <div className="dp-kpi-bar"><div className="dp-kpi-bar-fill" style={{ width: `${k.fill}%` }} /></div>
            </div>
          ))}
        </div>

        {/* ══ FILTER + LIVE ══ */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div className="dp-filter-row">
            {[{ key:'semua', label:'Semua Lokasi' }, { key:'baru', label:'Baru' }, { key:'proses', label:'Diproses' }, { key:'selesai', label:'Selesai' }].map(f => (
              <button key={f.key} className={`dp-filter-pill${filter === f.key ? ' active' : ''}`} onClick={() => setFilter(f.key)}>{f.label}</button>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: GREEN, fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <span className="dp-live-dot" /> Live Map
          </div>
        </div>

        {/* ══ MAP + SIDE PANEL ══ */}
        <div className="dp-main-grid">

          {/* MAP */}
          <div className="dp-card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div className="dp-card-head">
              <div className="dp-card-title">{Icon.map} Peta Sebaran Laporan Terverifikasi — Kota Manado</div>
              <span style={{ fontSize: 11, color: GREEN, display: 'flex', alignItems: 'center', gap: 5, fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                <span className="dp-live-dot" /> Data real-time
              </span>
            </div>

            <div className="dp-map-wrap">
              <svg viewBox="0 0 700 480" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
                <rect width="700" height="480" fill="#0A1420"/>
                <defs>
                  <pattern id="dp-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="700" height="480" fill="url(#dp-grid)"/>
                {/* Roads */}
                <line x1="0"   y1="230" x2="700" y2="230" stroke="rgba(255,255,255,0.12)" strokeWidth="3"/>
                <line x1="0"   y1="310" x2="700" y2="310" stroke="rgba(255,255,255,0.08)" strokeWidth="2"/>
                <line x1="180" y1="0"   x2="180" y2="480" stroke="rgba(255,255,255,0.10)" strokeWidth="3"/>
                <line x1="380" y1="0"   x2="380" y2="480" stroke="rgba(255,255,255,0.08)" strokeWidth="2"/>
                <line x1="540" y1="0"   x2="540" y2="480" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5"/>
                <line x1="100" y1="100" x2="600" y2="400" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5"/>
                {/* Area labels */}
                <text x="40"  y="210" fill="rgba(255,255,255,0.18)" fontSize="11" fontFamily="'Plus Jakarta Sans', sans-serif">Megamas</text>
                <text x="240" y="210" fill="rgba(255,255,255,0.18)" fontSize="11" fontFamily="'Plus Jakarta Sans', sans-serif">Pasar 45</text>
                <text x="395" y="210" fill="rgba(255,255,255,0.18)" fontSize="11" fontFamily="'Plus Jakarta Sans', sans-serif">Matos</text>
                <text x="240" y="340" fill="rgba(255,255,255,0.18)" fontSize="11" fontFamily="'Plus Jakarta Sans', sans-serif">Jl. Boulevard</text>
                <text x="548" y="265" fill="rgba(255,255,255,0.18)" fontSize="11" fontFamily="'Plus Jakarta Sans', sans-serif">Wenang</text>
                <text x="290" y="420" fill="rgba(255,255,255,0.10)" fontSize="13" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="700">Kota Manado</text>
                {/* Pins — PETA_TITIK x/y adalah 0–1 → SVG 700×480 */}
                {filtered.map((pin, i) => {
                  const meta  = STATUS_META[pin.status] ?? STATUS_META.selesai
                  const isSel = selected?.id === pin.id
                  return (
                    <PinSVG
                      key={pin.id}
                      pin={{ ...pin, svgX: pin.x * 700, svgY: pin.y * 480, color: meta.pinColor }}
                      isSelected={isSel}
                      onClick={() => setSelected(isSel ? null : pin)}
                    />
                  )
                })}
                {/* Selected callout */}
                {selected && (() => {
                  const p    = selected
                  const meta = STATUS_META[p.status] ?? STATUS_META.selesai
                  const cx   = Math.min(p.x * 700 + 18, 490)
                  const cy   = Math.max(p.y * 480 - 100, 8)
                  return (
                    <g>
                      <rect x={cx} y={cy} width="190" height="84" rx="10" fill="#fff" stroke={meta.pinColor} strokeWidth="1.5" opacity="0.97"/>
                      <text x={cx+12} y={cy+20} fill={meta.pinColor} fontSize="11" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="700">{p.label}</text>
                      <text x={cx+12} y={cy+36} fill="rgba(53,53,53,0.8)" fontSize="10" fontFamily="'Plus Jakarta Sans', sans-serif">{p.desc}</text>
                      <text x={cx+12} y={cy+50} fill="rgba(107,124,141,0.9)" fontSize="9" fontFamily="'Plus Jakarta Sans', sans-serif">🕐 {p.time}</text>
                      <rect x={cx+12} y={cy+60} width="90" height="16" rx="5" fill={meta.pinColor} style={{ cursor: 'pointer' }} onClick={() => setSelected(null)}/>
                      <text x={cx+57} y={cy+71} textAnchor="middle" fill="#fff" fontSize="9" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="700" style={{ pointerEvents: 'none' }}>Tutup Detail</text>
                    </g>
                  )
                })()}
              </svg>
            </div>

            {/* Legend */}
            <div className="dp-legend">
              <span style={{ fontSize: 11, color: MUTED, fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif", marginRight: 4 }}>Status:</span>
              {[{ color: '#E8401C', label: `Baru (${totalBaru})` }, { color: AMBER, label: `Diproses (${totalProses})` }, { color: '#2ECC71', label: `Selesai (${totalSelesai})` }].map(l => (
                <span key={l.label} className="dp-legend-item"><span className="dp-legend-dot" style={{ background: l.color }} />{l.label}</span>
              ))}
              <span style={{ fontSize: 10, color: '#9BAAB5', marginLeft: 'auto', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Ukuran pin = jumlah laporan</span>
            </div>
          </div>

          {/* SIDE PANEL */}
          <div className="dp-card" style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            <div className="dp-card-head">
              <div className="dp-card-title" style={{ color: RED }}>{Icon.warning} Lokasi Rawan ({PINS.length})</div>
            </div>
            <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8, flex: 1, overflowY: 'auto' }}>
              {[...PINS].sort((a, b) => b.count - a.count).map(pin => {
                const meta  = STATUS_META[pin.status] ?? STATUS_META.selesai
                const isSel = selected?.id === pin.id
                return (
                  <div key={pin.id} className={`dp-pin-card${isSel ? ' selected' : ''}`} style={{ '--pin-color': meta.pinColor }} onClick={() => setSelected(isSel ? null : pin)}>
                    <div className="dp-pin-card-head">
                      <div className="dp-pin-card-name">{Icon.pin}{pin.label}</div>
                      <div className="dp-pin-card-time">{pin.time}</div>
                    </div>
                    <div className="dp-pin-card-desc">{pin.desc}</div>
                    <div className="dp-pin-card-footer">
                      <span className="dp-pill" style={{ background: meta.bg, color: meta.color }}>{meta.label}</span>
                      <div className="dp-pin-btns" onClick={e => e.stopPropagation()}>
                        {pin.status === 'baru'    && <><button className="dp-btn-solid">{Icon.tugaskan} Tugaskan</button><button className="dp-btn-outline">Detail</button></>}
                        {pin.status === 'proses'  && <button className="dp-btn-outline">{Icon.focus} Detail</button>}
                        {pin.status === 'selesai' && <span style={{ fontSize: 10, color: GREEN, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>{Icon.check} Selesai</span>}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

      </div>
    </>
  )
}

function PinSVG({ pin, isSelected, onClick }) {
  const r  = pin.r ?? 12
  const cx = pin.svgX
  const cy = pin.svgY
  return (
    <g onClick={onClick} style={{ cursor: 'pointer' }}>
      <circle cx={cx} cy={cy} r={r + 8} fill={`${pin.color}15`} stroke={pin.color} strokeWidth="1" opacity="0.5">
        <animate attributeName="r"       from={r}   to={r + 14} dur="2s" repeatCount="indefinite"/>
        <animate attributeName="opacity" from="0.7" to="0"      dur="2s" repeatCount="indefinite"/>
      </circle>
      <circle cx={cx} cy={cy} r={r}          fill={`${pin.color}20`} stroke={pin.color} strokeWidth={isSelected ? 2 : 1.5}/>
      <circle cx={cx} cy={cy} r={r * 0.45}   fill={pin.color}/>
      {isSelected && <circle cx={cx} cy={cy} r={r + 4} fill="none" stroke={pin.color} strokeWidth="2" strokeDasharray="4 3"/>}
    </g>
  )
}