import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../store/useStore'

const N      = '#022B3A'
const T      = '#3C6E71'
const TEXT   = '#1a2e3b'
const MUTED  = '#5A7080'
const BORDER = '#D6DCE4'
const CARD   = '#FFFFFF'
const BG     = '#E1E5F2'
const RED    = '#C0392B'
const GREEN  = '#1E7E4A'

const CAMS = [
  {
    id: 1, label: 'Megamas — CAM 01', resolusi: '1080p', fps: 25, alert: true,
    detections: [
      { x: 0.28, y: 0.25, w: 80, h: 130, conf: 94, color: '#E8401C' },
      { x: 0.52, y: 0.30, w: 70, h: 110, conf: 87, color: '#F5A623' },
    ],
  },
  { id: 2, label: 'Pasar 45 — CAM 02',    resolusi: '720p',  fps: 20, alert: false, detections: [] },
  { id: 3, label: 'Matos — CAM 03',        resolusi: '1080p', fps: 30, alert: false, detections: [] },
  { id: 4, label: 'Boulevard — CAM 04',    resolusi: '720p',  fps: 15, alert: false, detections: [] },
]

// ── SVG Icons (sama dengan AdminBeranda) ──────────────────────
const Icon = {
  cctv: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7"/>
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
    </svg>
  ),
  refresh: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10"/>
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
    </svg>
  ),
  grid2: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
    </svg>
  ),
  grid1: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="4" rx="1"/><rect x="3" y="10" width="18" height="4" rx="1"/>
      <rect x="3" y="17" width="18" height="4" rx="1"/>
    </svg>
  ),
  rec: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="8"/>
    </svg>
  ),
  stop: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <rect x="4" y="4" width="16" height="16" rx="2"/>
    </svg>
  ),
  arrow: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="5" y1="12" x2="19" y2="12"/>
      <polyline points="12 5 19 12 12 19"/>
    </svg>
  ),
  back: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="19" y1="12" x2="5" y2="12"/>
      <polyline points="12 19 5 12 12 5"/>
    </svg>
  ),
  expand: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
    </svg>
  ),
  focus: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  pin: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  warning: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  check: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  detect: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  report: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
    </svg>
  ),
  handled: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
  cam: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <polygon points="23 7 16 12 23 17 23 7"/>
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
    </svg>
  ),
}

export default function AdminCCTV() {
  const navigate  = useNavigate()
  const openModal = useStore(s => s.openModal)
  const showToast = useStore(s => s.showToast)

  const [layout,    setLayout]    = useState('2x2')
  const [focus,     setFocus]     = useState(null)
  const [recording, setRecording] = useState(false)
  const [refreshing,setRefreshing]= useState(false)
  const [clock,     setClock]     = useState('')

  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleString('id-ID', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
    }))
    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [])

  const handleRecord = () => {
    setRecording(r => !r)
    showToast(recording ? 'Rekaman dihentikan' : 'Rekaman dimulai')
  }

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => { setRefreshing(false); showToast('Feed CCTV diperbarui') }, 1200)
  }

  const displayCams = focus !== null ? [CAMS[focus]] : CAMS

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');

        .ac-root * { box-sizing: border-box; }

        .ac-root {
          font-family: 'Inter', sans-serif;
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
        .ac-banner {
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
        .ac-banner::before {
          content: '';
          position: absolute;
          right: -80px; top: -80px;
          width: 320px; height: 320px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(60,110,113,0.3) 0%, transparent 65%);
          pointer-events: none;
        }
        .ac-banner::after {
          content: '';
          position: absolute;
          left: 40%; bottom: -60px;
          width: 200px; height: 200px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(191,219,247,0.06) 0%, transparent 70%);
          pointer-events: none;
        }
        .ac-banner-eyebrow {
          font-size: 11px;
          color: rgba(191,219,247,0.5);
          margin-bottom: 8px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .ac-banner-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: clamp(22px, 3vw, 30px);
          font-weight: 800;
          color: #fff;
          line-height: 1.15;
          margin-bottom: 10px;
          letter-spacing: -0.02em;
        }
        .ac-banner-title span { color: #BFDBF7; }
        .ac-banner-sub {
          font-size: 13px;
          color: rgba(255,255,255,0.6);
          line-height: 1.65;
          max-width: 440px;
        }
        .ac-banner-sub strong { color: #fff; font-weight: 700; }
        .ac-banner-clock {
          font-size: 11px;
          color: rgba(191,219,247,0.35);
          margin-top: 12px;
          font-family: 'Inter', monospace;
          letter-spacing: 0.02em;
        }
        .ac-banner-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
          flex-shrink: 0;
          position: relative;
          z-index: 1;
        }
        .ac-btn-teal {
          display: flex; align-items: center; gap: 8px;
          padding: 12px 22px;
          background: ${T};
          color: #fff; border: none; border-radius: 10px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13px; font-weight: 700;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
          white-space: nowrap;
        }
        .ac-btn-teal:hover { background: #2f5759; transform: translateY(-1px); }
        .ac-btn-teal.danger { background: ${RED}; }
        .ac-btn-teal.danger:hover { background: #a93226; }
        .ac-btn-ghost {
          display: flex; align-items: center; gap: 8px;
          padding: 11px 22px;
          background: rgba(255,255,255,0.08);
          color: #fff;
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 10px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13px; font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
          white-space: nowrap;
        }
        .ac-btn-ghost:hover { background: rgba(255,255,255,0.14); }

        /* ══ KPI GLASS CARDS ══ */
        .ac-kpi-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
        }
        .ac-kpi-card {
          background: rgba(255, 255, 255, 0.55);
          backdrop-filter: blur(16px) saturate(180%);
          -webkit-backdrop-filter: blur(16px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.7);
          border-radius: 16px;
          padding: 22px;
          position: relative;
          overflow: hidden;
        }
        .ac-kpi-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: ${T};
          border-radius: 16px 16px 0 0;
        }
        .ac-kpi-icon-wrap {
          width: 40px; height: 40px;
          border-radius: 10px;
          background: rgba(60,110,113,0.1);
          border: 1px solid rgba(60,110,113,0.2);
          display: flex; align-items: center; justify-content: center;
          color: ${T};
          margin-bottom: 16px;
        }
        .ac-kpi-num {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 34px;
          font-weight: 800;
          color: ${T};
          line-height: 1;
          margin-bottom: 5px;
          letter-spacing: -0.02em;
        }
        .ac-kpi-label {
          font-size: 12px;
          color: ${MUTED};
          font-weight: 500;
          margin-bottom: 12px;
        }
        .ac-kpi-delta {
          font-size: 11px;
          font-weight: 600;
          color: ${T};
        }

        /* ══ CARD BASE ══ */
        .ac-card {
          background: ${CARD};
          border: 1px solid ${BORDER};
          border-radius: 14px;
          overflow: hidden;
        }
        .ac-card-head {
          padding: 16px 20px;
          border-bottom: 1px solid ${BORDER};
          display: flex; align-items: center; justify-content: space-between;
          gap: 12px;
        }
        .ac-card-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13px; font-weight: 700;
          color: ${N};
          display: flex; align-items: center; gap: 8px;
        }
        .ac-card-link {
          display: flex; align-items: center; gap: 4px;
          font-size: 12px; color: ${T};
          cursor: pointer; font-weight: 600;
          background: none; border: none; padding: 0;
          transition: color 0.15s;
          font-family: 'Inter', sans-serif;
        }
        .ac-card-link:hover { color: ${N}; }

        /* ══ LAYOUT BUTTONS ══ */
        .ac-layout-group {
          display: flex;
          gap: 6px;
        }
        .ac-layout-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 7px 14px;
          border-radius: 8px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 12px; font-weight: 600;
          cursor: pointer;
          transition: all 0.15s;
          border: 1.5px solid ${BORDER};
          background: transparent;
          color: ${MUTED};
        }
        .ac-layout-btn:hover { border-color: ${T}; color: ${T}; }
        .ac-layout-btn.active {
          background: rgba(60,110,113,0.1);
          border-color: ${T};
          color: ${T};
        }

        /* ══ CCTV GRID ══ */
        .ac-cctv-grid {
          display: grid;
          gap: 1px;
          background: ${BORDER};
        }
        .ac-cctv-grid.layout-2x2 {
          grid-template-columns: repeat(2, 1fr);
        }
        .ac-cctv-grid.layout-1x4 {
          grid-template-columns: 1fr;
        }
        .ac-cctv-grid.layout-focus {
          grid-template-columns: 1fr;
        }

        /* ══ CCTV FEED ══ */
        .ac-cctv-feed {
          background: #060f1c;
          position: relative;
          aspect-ratio: 16/9;
          overflow: hidden;
          cursor: pointer;
        }
        .ac-cctv-feed canvas { width: 100%; height: 100%; display: block; }
        .ac-cctv-overlay {
          position: absolute; inset: 0;
          display: flex; flex-direction: column;
          justify-content: space-between; padding: 12px;
          background: linear-gradient(
            to bottom,
            rgba(0,0,0,0.55) 0%, transparent 35%,
            transparent 60%, rgba(0,0,0,0.65) 100%
          );
        }
        .ac-cctv-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; }
        .ac-cctv-label {
          font-size: 10px; font-weight: 600;
          background: rgba(2,43,58,0.75);
          color: rgba(191,219,247,0.9);
          padding: 4px 10px; border-radius: 6px;
          display: flex; align-items: center; gap: 5px;
        }
        .ac-cctv-badge-rec {
          font-size: 9px; font-weight: 700;
          background: rgba(192,57,43,0.85);
          color: #fff;
          padding: 3px 9px; border-radius: 6px;
          display: flex; align-items: center; gap: 4px;
        }
        .ac-cctv-badge-rec-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: #fff;
          animation: ac-pulse 1.2s ease infinite;
        }
        .ac-cctv-alert-banner {
          font-size: 10px; font-weight: 700;
          background: rgba(192,57,43,0.88);
          color: #fff; padding: 6px 12px;
          border-radius: 7px; text-align: center;
          display: flex; align-items: center;
          justify-content: center; gap: 5px;
        }
        .ac-cctv-footer {
          display: flex; align-items: center; justify-content: space-between;
        }
        .ac-cctv-res {
          font-size: 9px; color: rgba(255,255,255,0.4);
          font-family: 'Inter', monospace;
        }
        .ac-cctv-actions { display: flex; gap: 6px; }
        .ac-cctv-btn {
          font-size: 10px; font-weight: 600; color: rgba(191,219,247,0.85);
          background: rgba(2,43,58,0.65);
          border: 1px solid rgba(191,219,247,0.15);
          border-radius: 6px; padding: 4px 10px; cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: background 0.15s;
          display: flex; align-items: center; gap: 4px;
        }
        .ac-cctv-btn:hover { background: rgba(60,110,113,0.55); }

        /* ══ TOMBOL OUTLINE ══ */
        .ac-btn-outline {
          padding: 9px 24px;
          background: transparent;
          color: ${N};
          border: 1.5px solid ${N};
          border-radius: 9px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13px; font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }
        .ac-btn-outline:hover { background: ${N}; color: #fff; }

        /* ══ ROW ITEM ══ */
        .ac-row-item {
          padding: 12px 20px;
          border-bottom: 1px solid ${BORDER};
          display: flex; align-items: center;
          justify-content: space-between;
          font-size: 12px;
        }
        .ac-row-item:last-child { border-bottom: none; }
        .ac-row-label { color: ${MUTED}; }
        .ac-row-val {
          font-weight: 700; font-family: 'Plus Jakarta Sans', sans-serif;
        }

        /* ══ LIVE DOT ══ */
        .ac-live-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: ${GREEN};
          display: inline-block;
          animation: ac-pulse 2s ease infinite;
        }
        @keyframes ac-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }
        @keyframes ac-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        /* ══ BOTTOM GRID ══ */
        .ac-bottom-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        /* ══ ALERT ITEM ══ */
        .ac-alert-item {
          display: flex; align-items: flex-start; gap: 12px;
          padding: 13px 20px;
          border-bottom: 1px solid ${BORDER};
          cursor: pointer; transition: background 0.15s;
        }
        .ac-alert-item:last-child { border-bottom: none; }
        .ac-alert-item:hover { background: #FEF9F9; }
        .ac-alert-dot {
          width: 8px; height: 8px; border-radius: 50%;
          flex-shrink: 0; margin-top: 3px;
        }
        .ac-alert-title {
          font-size: 12px; font-weight: 600;
          color: ${TEXT};
          font-family: 'Plus Jakarta Sans', sans-serif;
          margin-bottom: 2px;
        }
        .ac-alert-sub { font-size: 11px; color: ${MUTED}; line-height: 1.5; }
        .ac-pill {
          font-size: 10px; font-weight: 700;
          padding: 3px 10px; border-radius: 999px;
          display: inline-flex; align-items: center; gap: 4px;
          white-space: nowrap; flex-shrink: 0;
        }

        /* ══ RESPONSIVE ══ */
        @media (max-width: 1100px) {
          .ac-kpi-grid     { grid-template-columns: repeat(2, 1fr); }
          .ac-bottom-grid  { grid-template-columns: 1fr; }
          .ac-banner       { flex-direction: column; align-items: flex-start; }
          .ac-root         { padding: 20px 20px 60px; }
        }
        @media (max-width: 700px) {
          .ac-cctv-grid.layout-2x2 { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="ac-root">

        {/* ══ BANNER ══ */}
        <div className="ac-banner">
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="ac-banner-eyebrow">Monitoring Langsung</div>
            <div className="ac-banner-title">
              CCTV Live —{' '}
              <span>4 Kamera Aktif</span>
            </div>
            <div className="ac-banner-sub">
              <strong>1 kamera mendeteksi anak</strong> di kawasan Megamas.
              Gunakan tombol Fokus pada feed untuk memperbesar tampilan kamera.
            </div>
            <div className="ac-banner-clock">{clock} WITA</div>
          </div>
          <div className="ac-banner-actions">
            <button
              className={`ac-btn-teal${recording ? ' danger' : ''}`}
              onClick={handleRecord}
            >
              <span style={{ display: 'inline-flex', animation: recording ? 'ac-pulse 1.2s ease infinite' : 'none' }}>
                {recording ? Icon.stop : Icon.rec}
              </span>
              {recording ? 'Hentikan Rekaman' : 'Mulai Rekam Semua'}
            </button>
            <button className="ac-btn-ghost" onClick={handleRefresh}>
              <span style={{ display: 'inline-flex', animation: refreshing ? 'ac-spin 0.7s linear infinite' : 'none' }}>
                {Icon.refresh}
              </span>
              {refreshing ? 'Memperbarui...' : 'Perbarui Feed'}
            </button>
          </div>
        </div>

        {/* ══ KPI CARDS ══ */}
        <div className="ac-kpi-grid">
          {[
            { icon: Icon.detect,  num: 2,   label: 'Terdeteksi Hari Ini', delta: 'Confidence tertinggi: 94%' },
            { icon: Icon.report,  num: 12,  label: 'Laporan Masuk',       delta: '3 belum diverifikasi' },
            { icon: Icon.handled, num: 9,   label: 'Berhasil Ditangani',  delta: 'Tingkat penanganan 75%' },
            { icon: Icon.cam,     num: '4', label: 'Kamera Aktif',        delta: 'Semua feed berjalan normal' },
          ].map((k, i) => (
            <div key={i} className="ac-kpi-card">
              <div className="ac-kpi-icon-wrap">{k.icon}</div>
              <div className="ac-kpi-num">{k.num}</div>
              <div className="ac-kpi-label">{k.label}</div>
              <div className="ac-kpi-delta">{k.delta}</div>
            </div>
          ))}
        </div>

        {/* ══ CCTV MONITORING ══ */}
        <div className="ac-card">
          <div className="ac-card-head">
            <div className="ac-card-title">
              {Icon.cctv}
              Monitoring CCTV
              {CAMS.some(c => c.alert) && (
                <span className="ac-pill" style={{ background: 'rgba(192,57,43,0.1)', color: RED }}>
                  {Icon.warning}
                  Deteksi Aktif
                </span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {/* Layout toggle */}
              <div className="ac-layout-group">
                {[
                  { key: '2x2', icon: Icon.grid2, label: '2×2' },
                  { key: '1x4', icon: Icon.grid1, label: '1×4' },
                ].map(l => (
                  <button
                    key={l.key}
                    className={`ac-layout-btn${layout === l.key ? ' active' : ''}`}
                    onClick={() => { setLayout(l.key); setFocus(null) }}
                  >
                    {l.icon} {l.label}
                  </button>
                ))}
              </div>
              {focus !== null && (
                <button className="ac-card-link" onClick={() => setFocus(null)}>
                  {Icon.back} Semua Kamera
                </button>
              )}
            </div>
          </div>

          <div
            className={`ac-cctv-grid ${focus !== null ? 'layout-focus' : `layout-${layout}`}`}
          >
            {displayCams.map((cam, i) => (
              <CCTVFeed
                key={cam.id}
                cam={cam}
                isFocused={focus !== null}
                onFocus={() => setFocus(focus === i ? null : i)}
                onExpand={() => openModal?.('lihat-cctv', {
                  camLabel: cam.label,
                  lokasi: cam.label.split('—')[0]?.trim(),
                  resolusi: cam.resolusi,
                  hasAlert: cam.alert,
                })}
              />
            ))}
          </div>

          <div style={{ padding: '14px 20px', textAlign: 'center', borderTop: `1px solid ${BORDER}` }}>
            <button className="ac-btn-outline" onClick={() => navigate('/admin/beranda')}>
              ← Kembali ke Beranda
            </button>
          </div>
        </div>

        {/* ══ BOTTOM GRID ══ */}
        <div className="ac-bottom-grid">

          {/* Deteksi Terakhir */}
          <div className="ac-card">
            <div className="ac-card-head">
              <div className="ac-card-title" style={{ color: RED }}>
                {Icon.warning}
                Deteksi Terakhir
              </div>
              <button className="ac-card-link" onClick={() => navigate('/admin/laporan')}>
                Semua laporan {Icon.arrow}
              </button>
            </div>
            {[
              {
                dot: RED,
                title: 'CAM 01 — Megamas',
                sub: '2 anak terdeteksi berjualan. Confidence 94% & 87%.',
                time: '14 mnt lalu',
                badge: 'Kritis',
                badgeBg: 'rgba(192,57,43,0.1)',
                badgeColor: RED,
              },
              {
                dot: '#D4820A',
                title: 'CAM 02 — Pasar 45',
                sub: 'Anak mengamen di area parkir selatan.',
                time: '1 jam lalu',
                badge: 'Proses',
                badgeBg: 'rgba(212,130,10,0.1)',
                badgeColor: '#D4820A',
              },
              {
                dot: GREEN,
                title: 'CAM 04 — Boulevard',
                sub: '3 anak berhasil dijemput dan dipulangkan.',
                time: '3 jam lalu',
                badge: 'Selesai',
                badgeBg: 'rgba(30,126,74,0.1)',
                badgeColor: GREEN,
              },
            ].map((d, i) => (
              <div
                key={i}
                className="ac-alert-item"
                onClick={() => navigate('/admin/laporan')}
              >
                <div className="ac-alert-dot" style={{ background: d.dot }} />
                <div style={{ flex: 1 }}>
                  <div className="ac-alert-title">{d.title}</div>
                  <div className="ac-alert-sub">{d.sub}</div>
                  <div style={{ fontSize: 10, color: '#9BAAB5', marginTop: 4 }}>{d.time}</div>
                </div>
                <span
                  className="ac-pill"
                  style={{ background: d.badgeBg, color: d.badgeColor }}
                >
                  {d.badge}
                </span>
              </div>
            ))}
          </div>

          {/* Status Sistem */}
          <div className="ac-card">
            <div className="ac-card-head">
              <div className="ac-card-title">Status Sistem</div>
            </div>
            {[
              { label: 'Pipeline AI (YOLOv8)',   status: 'Online' },
              { label: 'Estimasi Usia (MiVolo)', status: 'Online' },
              { label: 'Klasifikasi (VideoMAE)', status: 'Online' },
              { label: 'CAM 01 — Megamas',       status: 'Live'   },
              { label: 'CAM 02 — Pasar 45',      status: 'Live'   },
              { label: 'CAM 03 — Matos',         status: 'Live'   },
              { label: 'CAM 04 — Boulevard',     status: 'Live'   },
            ].map(r => (
              <div key={r.label} className="ac-row-item">
                <span className="ac-row-label" style={{ fontSize: 12 }}>{r.label}</span>
                <span style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  fontSize: 11, fontWeight: 700, color: GREEN,
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                }}>
                  <span className="ac-live-dot" />
                  {r.status}
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  )
}

/* ─── CCTV Feed Canvas (sama dengan AdminBeranda, ditingkatkan) ── */
function CCTVFeed({ cam, isFocused, onFocus, onExpand }) {
  const canvasRef = useRef(null)
  const animRef   = useRef(null)
  const timeRef   = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const draw = (ts) => {
      const W = canvas.width
      const H = canvas.height
      timeRef.current = ts * 0.001

      // Sky
      ctx.fillStyle = '#060f1c'
      ctx.fillRect(0, 0, W, H)
      ctx.fillStyle = '#0a1828'
      ctx.fillRect(0, H * 0.7, W, H * 0.3)

      // Buildings
      const buildings = [
        { x: 0,    y: 0.20, w: 0.14, h: 0.50, c: '#0d1f38' },
        { x: 0.16, y: 0.28, w: 0.12, h: 0.42, c: '#0c1c32' },
        { x: 0.30, y: 0.16, w: 0.18, h: 0.54, c: '#0e2040' },
        { x: 0.55, y: 0.24, w: 0.15, h: 0.46, c: '#0d1f38' },
        { x: 0.72, y: 0.18, w: 0.28, h: 0.52, c: '#0c1c32' },
      ]
      buildings.forEach(b => {
        ctx.fillStyle = b.c
        ctx.fillRect(b.x * W, b.y * H, b.w * W, b.h * H)
        for (let wy = 0; wy < 4; wy++) {
          for (let wx = 0; wx < 3; wx++) {
            const lit = Math.sin(timeRef.current * 0.3 + cam.id + wy * 2 + wx) > 0.2
            ctx.fillStyle = lit ? 'rgba(255,220,100,0.15)' : 'rgba(0,0,0,0.3)'
            ctx.fillRect(
              b.x * W + 6 + wx * ((b.w * W - 12) / 3),
              b.y * H + 12 + wy * ((b.h * H - 20) / 4),
              (b.w * W - 12) / 3 - 4,
              (b.h * H - 20) / 4 - 4,
            )
          }
        }
      })

      // Road
      ctx.fillStyle = '#0f1e2e'
      ctx.fillRect(0, H * 0.68, W, H * 0.06)
      ctx.strokeStyle = 'rgba(255,255,255,0.08)'
      ctx.setLineDash([20, 15])
      ctx.lineWidth = 1
      ctx.beginPath(); ctx.moveTo(0, H * 0.71); ctx.lineTo(W, H * 0.71); ctx.stroke()
      ctx.setLineDash([])

      // Moving figures
      for (let p = 0; p < 4 + cam.id; p++) {
        const speed = 0.03 + p * 0.01
        const px = ((timeRef.current * speed * (p % 2 === 0 ? 1 : -1) + p * 0.25) % 1 + 1) % 1
        const py = 0.62 + (p % 3) * 0.04
        const h  = H * 0.12
        ctx.fillStyle = 'rgba(20,40,70,0.9)'
        ctx.beginPath()
        ctx.ellipse(px * W, py * H + h * 0.4, h * 0.12, h * 0.45, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.beginPath()
        ctx.arc(px * W, py * H - h * 0.05, h * 0.14, 0, Math.PI * 2)
        ctx.fill()
      }

      // AI Bounding boxes
      if (cam.detections.length > 0) {
        cam.detections.forEach(d => {
          const pulse = 0.7 + Math.sin(timeRef.current * 2) * 0.3
          ctx.strokeStyle = d.color
          ctx.lineWidth   = 1.5
          ctx.globalAlpha = pulse
          ctx.strokeRect(d.x * W, d.y * H, d.w, d.h)
          ctx.globalAlpha = 1
          ctx.fillStyle = d.color
          ctx.fillRect(d.x * W, d.y * H - 16, d.w, 16)
          ctx.fillStyle = d.color === '#F5A623' ? '#000' : '#fff'
          ctx.font = 'bold 9px monospace'
          ctx.fillText(`Anak ${d.conf}%`, d.x * W + 4, d.y * H - 4)
        })
      }

      // Scanlines
      for (let y = 0; y < H; y += 3) {
        ctx.fillStyle = 'rgba(0,0,0,0.06)'
        ctx.fillRect(0, y, W, 1)
      }

      // Timestamp
      ctx.fillStyle = 'rgba(191,219,247,0.35)'
      ctx.font = '8px monospace'
      ctx.fillText(new Date().toLocaleTimeString('id-ID'), 6, H - 6)
      ctx.fillText(`CAM 0${cam.id}`, W - 52, H - 6)

      animRef.current = requestAnimationFrame(draw)
    }

    animRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(animRef.current)
  }, [cam])

  return (
    <div
      className="ac-cctv-feed"
      style={{ outline: cam.alert ? `2px solid ${RED}` : 'none' }}
    >
      <canvas ref={canvasRef} width={640} height={360} />
      <div className="ac-cctv-overlay">
        <div className="ac-cctv-top">
          <span className="ac-cctv-label">
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            {cam.label}
          </span>
          <span className="ac-cctv-badge-rec">
            <span className="ac-cctv-badge-rec-dot" />
            REC
          </span>
        </div>

        {cam.alert && (
          <div className="ac-cctv-alert-banner">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
            </svg>
            Terdeteksi: anak berjualan — 14 mnt lalu
          </div>
        )}

        <div className="ac-cctv-footer">
          <span className="ac-cctv-res">{cam.resolusi} · {cam.fps}fps</span>
          <div className="ac-cctv-actions">
            <button className="ac-cctv-btn" onClick={onFocus}>
              {isFocused ? (
                <>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
                  </svg>
                  Semua
                </>
              ) : (
                <>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                  </svg>
                  Fokus
                </>
              )}
            </button>
            <button className="ac-cctv-btn" onClick={onExpand}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/>
                <line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>
              </svg>
              Perluas
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}