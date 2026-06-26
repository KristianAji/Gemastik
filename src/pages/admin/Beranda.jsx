import { useNavigate } from 'react-router-dom'
import { useStore } from '../../store/useStore'
import { useState, useEffect, useRef } from 'react'

const N     = '#022B3A'
const T     = '#3C6E71'
const TEXT  = '#1a2e3b'
const MUTED = '#5A7080'
const BORDER= '#D6DCE4'
const CARD  = '#FFFFFF'
const BG    = '#E1E5F2'
const RED   = '#C0392B'
const AMBER = '#D4820A'
const GREEN = '#1E7E4A'

// ── SVG Icons ──────────────────────────────────────────────────
const Icon = {
  total: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  ),
  baru: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="16"/>
      <line x1="8" y1="12" x2="16" y2="12"/>
    </svg>
  ),
  proses: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10"/>
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
    </svg>
  ),
  tingkat: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
  notif: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  ),
  refresh: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10"/>
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
    </svg>
  ),
  cctv: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7"/>
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
    </svg>
  ),
  map: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
      <line x1="8" y1="2" x2="8" y2="18"/>
      <line x1="16" y1="6" x2="16" y2="22"/>
    </svg>
  ),
  chart: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6"  y1="20" x2="6"  y2="14"/>
    </svg>
  ),
  arrow: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="5" y1="12" x2="19" y2="12"/>
      <polyline points="12 5 19 12 12 19"/>
    </svg>
  ),
  pin: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  check: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  dot: (size = 8) => (
    <svg width={size} height={size} viewBox="0 0 10 10">
      <circle cx="5" cy="5" r="5" fill="currentColor"/>
    </svg>
  ),
  warning: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  ai: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <rect x="2" y="3" width="20" height="14" rx="2"/>
      <line x1="8" y1="21" x2="16" y2="21"/>
      <line x1="12" y1="17" x2="12" y2="21"/>
    </svg>
  ),
  user: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
}

export default function AdminBeranda() {
  const navigate   = useNavigate()
  const laporan    = useStore(s => s.laporan)
  const notifikasi = useStore(s => s.notifikasi)
  const openModal  = useStore(s => s.openModal)
  const showToast  = useStore(s => s.showToast)
  const [clock, setClock]           = useState('')
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleString('id-ID', {
      weekday:'long', day:'numeric', month:'long', year:'numeric',
      hour:'2-digit', minute:'2-digit', second:'2-digit',
    }))
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
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');

        /* ── Reset global untuk halaman admin ── */
        .ab-root * { box-sizing: border-box; }

        .ab-root {
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
        .ab-banner {
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
        .ab-banner::before {
          content: '';
          position: absolute;
          right: -80px; top: -80px;
          width: 320px; height: 320px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(60,110,113,0.3) 0%, transparent 65%);
          pointer-events: none;
        }
        .ab-banner::after {
          content: '';
          position: absolute;
          left: 40%; bottom: -60px;
          width: 200px; height: 200px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(191,219,247,0.06) 0%, transparent 70%);
          pointer-events: none;
        }
        .ab-banner-eyebrow {
          font-size: 11px;
          color: rgba(191,219,247,0.5);
          margin-bottom: 8px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .ab-banner-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: clamp(22px, 3vw, 30px);
          font-weight: 800;
          color: #fff;
          line-height: 1.15;
          margin-bottom: 10px;
          letter-spacing: -0.02em;
        }
        .ab-banner-title span { color: #BFDBF7; }
        .ab-banner-sub {
          font-size: 13px;
          color: rgba(255,255,255,0.6);
          line-height: 1.65;
          max-width: 440px;
        }
        .ab-banner-sub strong { color: #fff; font-weight: 700; }
        .ab-banner-clock {
          font-size: 11px;
          color: rgba(191,219,247,0.35);
          margin-top: 12px;
          font-family: 'Inter', monospace;
          letter-spacing: 0.02em;
        }
        .ab-banner-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
          flex-shrink: 0;
          position: relative;
          z-index: 1;
        }
        .ab-btn-teal {
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
        .ab-btn-teal:hover { background: #2f5759; transform: translateY(-1px); }
        .ab-btn-ghost {
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
        .ab-btn-ghost:hover { background: rgba(255,255,255,0.14); }

        /* ══ KPI GLASS CARDS ══ */
        .ab-kpi-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
        }
        .ab-kpi-card {
          /* Glass morphism */
          background: rgba(255, 255, 255, 0.55);
          backdrop-filter: blur(16px) saturate(180%);
          -webkit-backdrop-filter: blur(16px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.7);
          border-radius: 16px;
          padding: 22px;
          cursor: pointer;
          transition: box-shadow 0.2s, transform 0.15s, background 0.2s;
          position: relative;
          overflow: hidden;
        }
        .ab-kpi-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: ${T};
          border-radius: 16px 16px 0 0;
        }
        .ab-kpi-card:hover {
          background: rgba(255, 255, 255, 0.75);
          box-shadow: 0 8px 32px rgba(60,110,113,0.14);
          transform: translateY(-2px);
        }
        .ab-kpi-icon-wrap {
          width: 40px; height: 40px;
          border-radius: 10px;
          background: rgba(60,110,113,0.1);
          border: 1px solid rgba(60,110,113,0.2);
          display: flex; align-items: center; justify-content: center;
          color: ${T};
          margin-bottom: 16px;
        }
        .ab-kpi-num {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 34px;
          font-weight: 800;
          color: ${T};
          line-height: 1;
          margin-bottom: 5px;
          letter-spacing: -0.02em;
        }
        .ab-kpi-label {
          font-size: 12px;
          color: ${MUTED};
          font-weight: 500;
          margin-bottom: 12px;
        }
        .ab-kpi-delta {
          font-size: 11px;
          font-weight: 600;
          color: ${T};
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .ab-kpi-bar {
          height: 3px;
          border-radius: 2px;
          background: rgba(60,110,113,0.12);
          margin-top: 14px;
          overflow: hidden;
        }
        .ab-kpi-bar-fill {
          height: 100%;
          border-radius: 2px;
          background: ${T};
          transition: width 1s ease;
        }

        /* ══ CARD BASE ══ */
        .ab-card {
          background: ${CARD};
          border: 1px solid ${BORDER};
          border-radius: 14px;
          overflow: hidden;
        }
        .ab-card-head {
          padding: 16px 20px;
          border-bottom: 1px solid ${BORDER};
          display: flex; align-items: center; justify-content: space-between;
        }
        .ab-card-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13px; font-weight: 700;
          color: ${N};
          display: flex; align-items: center; gap: 8px;
        }
        .ab-card-link {
          display: flex; align-items: center; gap: 4px;
          font-size: 12px; color: ${T};
          cursor: pointer; font-weight: 600;
          background: none; border: none; padding: 0;
          transition: color 0.15s;
          font-family: 'Inter', sans-serif;
        }
        .ab-card-link:hover { color: ${N}; }

        /* ══ CCTV ══ */
        .ab-cctv-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1px;
          background: ${BORDER};
        }
        .ab-cctv-feed {
          background: #060f1c;
          position: relative;
          aspect-ratio: 16/9;
          overflow: hidden;
          cursor: pointer;
        }
        .ab-cctv-feed canvas { width: 100%; height: 100%; display: block; }
        .ab-cctv-overlay {
          position: absolute; inset: 0;
          display: flex; flex-direction: column;
          justify-content: space-between; padding: 10px;
          background: linear-gradient(
            to bottom,
            rgba(0,0,0,0.55) 0%, transparent 35%,
            transparent 60%, rgba(0,0,0,0.65) 100%
          );
        }
        .ab-cctv-top { display: flex; justify-content: space-between; align-items: flex-start; }
        .ab-cctv-label {
          font-size: 10px; font-weight: 600;
          background: rgba(2,43,58,0.75);
          color: rgba(191,219,247,0.9);
          padding: 3px 9px; border-radius: 6px;
          display: flex; align-items: center; gap: 5px;
        }
        .ab-cctv-badge-rec {
          font-size: 9px; font-weight: 700;
          background: rgba(192,57,43,0.85);
          color: #fff;
          padding: 3px 8px; border-radius: 6px;
          display: flex; align-items: center; gap: 4px;
        }
        .ab-cctv-badge-rec-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: #fff;
          animation: ab-pulse 1.2s ease infinite;
        }
        .ab-cctv-alert-banner {
          font-size: 10px; font-weight: 700;
          background: rgba(192,57,43,0.88);
          color: #fff; padding: 5px 10px;
          border-radius: 7px; text-align: center;
          display: flex; align-items: center;
          justify-content: center; gap: 5px;
        }
        .ab-cctv-footer {
          display: flex; align-items: center; justify-content: space-between;
        }
        .ab-cctv-res {
          font-size: 9px; color: rgba(255,255,255,0.4);
          font-family: 'Inter', monospace;
        }
        .ab-cctv-btn {
          font-size: 10px; font-weight: 600; color: rgba(191,219,247,0.8);
          background: rgba(2,43,58,0.65);
          border: 1px solid rgba(191,219,247,0.15);
          border-radius: 6px; padding: 3px 9px; cursor: pointer;
          font-family: 'Inter', sans-serif;
          transition: background 0.15s;
        }
        .ab-cctv-btn:hover { background: rgba(60,110,113,0.5); }
        .ab-cctv-more {
          padding: 14px 20px; text-align: center;
          border-top: 1px solid ${BORDER};
        }

        /* ══ TOMBOL OUTLINE ══ */
        .ab-btn-outline {
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
        .ab-btn-outline:hover { background: ${N}; color: #fff; }

        /* ══ AKTIVITAS ══ */
        .ab-activity-item {
          padding: 13px 20px;
          border-bottom: 1px solid ${BORDER};
          display: flex; gap: 12px; align-items: flex-start;
          cursor: pointer; transition: background 0.15s;
        }
        .ab-activity-item:last-child { border-bottom: none; }
        .ab-activity-item:hover { background: #F8FAFC; }
        .ab-activity-dot {
          width: 8px; height: 8px; border-radius: 50%;
          flex-shrink: 0; margin-top: 4px;
        }
        .ab-activity-title {
          font-size: 12px; font-weight: 600;
          color: ${TEXT}; margin-bottom: 3px;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .ab-activity-desc { font-size: 11px; color: ${MUTED}; line-height: 1.55; }
        .ab-activity-meta {
          display: flex; align-items: center; gap: 6px;
          margin-top: 5px;
        }
        .ab-activity-tag {
          font-size: 10px; font-weight: 600;
          padding: 2px 8px; border-radius: 20px;
          display: flex; align-items: center; gap: 4px;
        }
        .ab-activity-time {
          font-size: 10px; color: #9BAAB5;
          flex-shrink: 0; padding-top: 2px;
          white-space: nowrap;
        }

        /* ══ ALERT ITEMS ══ */
        .ab-alert-item {
          display: flex; align-items: center; gap: 12px;
          padding: 12px 20px;
          border-bottom: 1px solid ${BORDER};
          cursor: pointer; transition: background 0.15s;
        }
        .ab-alert-item:last-child { border-bottom: none; }
        .ab-alert-item:hover { background: #FEF9F9; }
        .ab-alert-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: ${RED}; flex-shrink: 0;
        }
        .ab-alert-name {
          flex: 1; font-size: 12px; font-weight: 600; color: ${TEXT};
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .ab-alert-sub { font-size: 11px; color: ${MUTED}; margin-top: 1px; }
        .ab-pill {
          font-size: 10px; font-weight: 700;
          padding: 3px 10px; border-radius: 999px;
          display: inline-flex; align-items: center; gap: 4px;
        }

        /* ══ QUICK ACCESS ══ */
        .ab-qa-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 8px; padding: 14px;
        }
        .ab-qa-item {
          padding: 14px 10px;
          border-radius: 10px;
          border: 1.5px solid ${BORDER};
          background: #F8FAFC;
          cursor: pointer; text-align: center;
          transition: all 0.2s;
        }
        .ab-qa-item:hover {
          border-color: ${T};
          background: rgba(60,110,113,0.06);
        }
        .ab-qa-icon {
          width: 32px; height: 32px; border-radius: 8px;
          background: rgba(60,110,113,0.1);
          border: 1px solid rgba(60,110,113,0.15);
          display: flex; align-items: center; justify-content: center;
          color: ${T}; margin: 0 auto 8px;
        }
        .ab-qa-label {
          font-size: 11px; font-weight: 600; color: ${TEXT};
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        /* ══ ROWS ══ */
        .ab-row-item {
          padding: 12px 20px;
          border-bottom: 1px solid ${BORDER};
          display: flex; align-items: center;
          justify-content: space-between;
          font-size: 12px;
        }
        .ab-row-item:last-child { border-bottom: none; }
        .ab-row-label { color: ${MUTED}; }
        .ab-row-val {
          font-weight: 700; font-family: 'Plus Jakarta Sans', sans-serif;
        }

        /* ══ CHART ══ */
        .ab-chart-wrap {
          display: flex; align-items: flex-end; gap: 6px;
          height: 72px; padding: 0 20px;
        }
        .ab-chart-bar {
          flex: 1; border-radius: 4px 4px 0 0;
          cursor: pointer; transition: opacity 0.15s;
          position: relative;
        }
        .ab-chart-labels {
          display: flex; justify-content: space-between;
          padding: 5px 20px 14px;
          font-size: 9px; color: #9BAAB5;
        }

        /* ══ STATUS DOT ══ */
        .ab-live-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: ${GREEN};
          display: inline-block;
          animation: ab-pulse 2s ease infinite;
        }
        @keyframes ab-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }

        /* ══ GRIDS ══ */
        .ab-main-grid {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 16px;
        }
        .ab-bottom-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 16px;
        }

        /* ══ RESPONSIVE ══ */
        @media (max-width: 1100px) {
          .ab-kpi-grid     { grid-template-columns: repeat(2, 1fr); }
          .ab-main-grid    { grid-template-columns: 1fr; }
          .ab-bottom-grid  { grid-template-columns: 1fr; }
          .ab-banner       { flex-direction: column; align-items: flex-start; }
          .ab-root         { padding: 20px 20px 60px; }
        }
      `}</style>

      <div className="ab-root">

        {/* ══ WELCOME BANNER ══ */}
        <div className="ab-banner">
          <div style={{ position:'relative', zIndex:1 }}>
            <div className="ab-banner-eyebrow">Selamat datang kembali</div>
            <div className="ab-banner-title">
              Pantau &amp; Lindungi<br/>
              <span>Anak Kota Manado</span>
            </div>
            <div className="ab-banner-sub">
              Terdapat <strong>{baru.length} laporan baru</strong> dan{' '}
              <strong>{unread} notifikasi</strong> yang membutuhkan perhatian Anda hari ini.
            </div>
            <div className="ab-banner-clock">{clock} WITA</div>
          </div>
          <div className="ab-banner-actions">
            <button className="ab-btn-teal" onClick={() => navigate('/admin/notifikasi')}>
              {Icon.notif}
              Lihat Notifikasi
              {unread > 0 && (
                <span style={{
                  background: '#fff', color: T,
                  borderRadius: '999px', fontSize: 10, fontWeight: 800,
                  padding: '1px 7px', marginLeft: 2,
                }}>
                  {unread}
                </span>
              )}
            </button>
            <button className="ab-btn-ghost" onClick={handleRefresh}>
              <span style={{ display:'inline-flex', animation: refreshing ? 'ab-spin 0.7s linear infinite' : 'none' }}>
                {Icon.refresh}
              </span>
              {refreshing ? 'Memperbarui...' : 'Perbarui Data'}
            </button>
          </div>
        </div>

        {/* ══ KPI GLASS CARDS ══ */}
        <div className="ab-kpi-grid">
          {[
            {
              icon: Icon.total,
              num: total,
              label: 'Total Laporan',
              delta: 'Naik 18% dari bulan lalu',
              fill: 72,
              href: '/admin/laporan',
            },
            {
              icon: Icon.baru,
              num: baru.length,
              label: 'Laporan Baru',
              delta: 'Menunggu verifikasi admin',
              fill: total ? (baru.length / total) * 100 : 0,
              href: '/admin/laporan',
            },
            {
              icon: Icon.proses,
              num: proses,
              label: 'Sedang Diproses',
              delta: 'Dalam penanganan petugas',
              fill: total ? (proses / total) * 100 : 0,
              href: '/admin/laporan',
            },
            {
              icon: Icon.tingkat,
              num: `${tingkat}%`,
              label: 'Tingkat Penanganan',
              delta: 'Naik 5% dari bulan lalu',
              fill: tingkat,
              href: '/admin/statistik',
            },
          ].map((k, i) => (
            <div key={i} className="ab-kpi-card" onClick={() => navigate(k.href)}>
              <div className="ab-kpi-icon-wrap">{k.icon}</div>
              <div className="ab-kpi-num">{k.num}</div>
              <div className="ab-kpi-label">{k.label}</div>
              <div className="ab-kpi-delta">{k.delta}</div>
              <div className="ab-kpi-bar">
                <div className="ab-kpi-bar-fill" style={{ width: `${k.fill}%` }} />
              </div>
            </div>
          ))}
        </div>

        {/* ══ CCTV PREVIEW ══ */}
        <div className="ab-card">
          <div className="ab-card-head">
            <div className="ab-card-title">
              {Icon.cctv}
              Monitoring CCTV — 4 Kamera Aktif
            </div>
            <button className="ab-card-link" onClick={() => navigate('/admin/cctv')}>
              Lihat Semua {Icon.arrow}
            </button>
          </div>
          <div className="ab-cctv-grid">
            {[
              { id:1, label:'Megamas — CAM 01',   res:'1080p', fps:25, alert:true,  detections:[{ x:0.28, y:0.25, w:80, h:130, conf:94, color:'#E8401C' }] },
              { id:2, label:'Pasar 45 — CAM 02',  res:'720p',  fps:20, alert:false, detections:[] },
              { id:3, label:'Matos — CAM 03',     res:'1080p', fps:30, alert:false, detections:[] },
              { id:4, label:'Boulevard — CAM 04', res:'720p',  fps:15, alert:false, detections:[] },
            ].map(cam => (
              <MiniCCTV key={cam.id} cam={cam} onClick={() => navigate('/admin/cctv')} />
            ))}
          </div>
          <div className="ab-cctv-more">
            <button className="ab-btn-outline" onClick={() => navigate('/admin/cctv')}>
              Buka Monitoring CCTV Penuh
            </button>
          </div>
        </div>

        {/* ══ MAIN GRID ══ */}
        <div className="ab-main-grid">

          {/* Aktivitas terbaru */}
          <div className="ab-card">
            <div className="ab-card-head">
              <div className="ab-card-title">Aktivitas Terbaru</div>
              <button className="ab-card-link" onClick={() => navigate('/admin/notifikasi')}>
                Lihat semua {Icon.arrow}
              </button>
            </div>
            {[
              {
                dot: RED, tag:'AI', tagBg:`rgba(192,57,43,0.1)`, tagColor: RED,
                title:'Terdeteksi 2 Anak — Megamas',
                desc:'CAM-01 mendeteksi 2 anak membawa dagangan. Confidence 94% dan 87%.',
                time:'14 mnt', href:'/admin/notifikasi',
              },
              {
                dot: AMBER, tag:'Warga', tagBg:`rgba(212,130,10,0.1)`, tagColor: AMBER,
                title:'Laporan Warga — Pasar 45',
                desc:'M. Reza melaporkan anak usia 8–10 tahun mengamen di area parkir.',
                time:'1 jam', href:'/admin/laporan',
              },
              {
                dot: AMBER, tag:'Warga', tagBg:`rgba(212,130,10,0.1)`, tagColor: AMBER,
                title:'Laporan Warga — Figuran Matos',
                desc:'Anak memakai kostum kartun meminta sumbangan dari pengunjung.',
                time:'5 jam', href:'/admin/laporan',
              },
              {
                dot: GREEN, tag:'Selesai', tagBg:`rgba(30,126,74,0.1)`, tagColor: GREEN,
                title:'Penanganan Berhasil — Jl. Boulevard',
                desc:'3 anak berhasil dijemput dan dipulangkan ke keluarga oleh petugas.',
                time:'3 jam', href:'/admin/statistik',
              },
              {
                dot: T, tag:'Sistem', tagBg:`rgba(60,110,113,0.1)`, tagColor: T,
                title:'Laporan Mingguan Tersedia',
                desc:'Ringkasan minggu ke-18: 34 laporan masuk, 28 ditangani (82%).',
                time:'Kemarin', href:'/admin/statistik',
              },
            ].map((a, i) => (
              <div key={i} className="ab-activity-item" onClick={() => navigate(a.href)}>
                <div className="ab-activity-dot" style={{ background: a.dot }} />
                <div style={{ flex: 1 }}>
                  <div className="ab-activity-title">{a.title}</div>
                  <div className="ab-activity-desc">{a.desc}</div>
                  <div className="ab-activity-meta">
                    <span className="ab-activity-tag" style={{ background: a.tagBg, color: a.tagColor }}>
                      {a.tag === 'AI'     && Icon.ai}
                      {a.tag === 'Warga'  && Icon.user}
                      {a.tag === 'Selesai'&& Icon.check}
                      {a.tag}
                    </span>
                  </div>
                </div>
                <div className="ab-activity-time">{a.time}</div>
              </div>
            ))}
          </div>

          {/* Kolom kanan */}
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>

            {/* Akses Cepat */}
            <div className="ab-card">
              <div className="ab-card-head">
                <div className="ab-card-title">Akses Cepat</div>
              </div>
              <div className="ab-qa-grid">
                {[
                  { icon: Icon.cctv, label:'CCTV Live',    href:'/admin/cctv'       },
                  { icon: Icon.map,  label:'Peta Sebaran', href:'/admin/peta'       },
                  { icon: Icon.notif,label:'Notifikasi',   href:'/admin/notifikasi' },
                  { icon: Icon.chart,label:'Statistik',    href:'/admin/statistik'  },
                ].map(q => (
                  <div key={q.label} className="ab-qa-item" onClick={() => navigate(q.href)}>
                    <div className="ab-qa-icon">{q.icon}</div>
                    <div className="ab-qa-label">{q.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Perlu Tindakan */}
            <div className="ab-card">
              <div className="ab-card-head">
                <div className="ab-card-title" style={{ color: RED }}>
                  {Icon.warning}
                  Perlu Tindakan
                </div>
                <button className="ab-card-link" onClick={() => navigate('/admin/laporan')}>
                  Lihat semua {Icon.arrow}
                </button>
              </div>
              {baru.slice(0, 3).map(l => (
                <div key={l.id} className="ab-alert-item" onClick={() => openModal?.('detail', l)}>
                  <div className="ab-alert-dot" />
                  <div style={{ flex: 1 }}>
                    <div className="ab-alert-name">{l.lokasi}</div>
                    <div className="ab-alert-sub">Belum diverifikasi</div>
                  </div>
                  <span className="ab-pill" style={{ background:'rgba(192,57,43,0.1)', color: RED }}>
                    Baru
                  </span>
                </div>
              ))}
              {baru.length === 0 && (
                <div style={{ padding:20, textAlign:'center', fontSize:12, color: MUTED }}>
                  Tidak ada laporan menunggu
                </div>
              )}
            </div>

          </div>
        </div>

        {/* ══ BOTTOM GRID ══ */}
        <div className="ab-bottom-grid">

          {/* Chart */}
          <div className="ab-card">
            <div className="ab-card-head">
              <div className="ab-card-title">
                {Icon.chart}
                Laporan 7 Hari Terakhir
              </div>
              <button className="ab-card-link" onClick={() => navigate('/admin/statistik')}>
                Detail {Icon.arrow}
              </button>
            </div>
            <MiniChart />
          </div>

          {/* Lokasi rawan */}
          <div className="ab-card">
            <div className="ab-card-head">
              <div className="ab-card-title">
                {Icon.pin}
                Lokasi Paling Rawan
              </div>
              <button className="ab-card-link" onClick={() => navigate('/admin/peta')}>
                Peta {Icon.arrow}
              </button>
            </div>
            {[
              { label:'Kawasan Megamas',    num:'48' },
              { label:'Pasar 45',           num:'35' },
              { label:'Jl. Boulevard',      num:'27' },
              { label:'Manado Town Square', num:'19' },
            ].map(r => (
              <div key={r.label} className="ab-row-item">
                <span className="ab-row-label">{r.label}</span>
                <span className="ab-row-val" style={{ color: T }}>{r.num} laporan</span>
              </div>
            ))}
          </div>

          {/* Status Sistem */}
          <div className="ab-card">
            <div className="ab-card-head">
              <div className="ab-card-title">Status Sistem</div>
            </div>
            {[
              { label:'Pipeline AI (YOLOv8)',   status:'Online' },
              { label:'Estimasi Usia (MiVolo)', status:'Online' },
              { label:'Klasifikasi (VideoMAE)', status:'Online' },
              { label:'CCTV Feed (4 kamera)',   status:'Live'   },
            ].map(r => (
              <div key={r.label} className="ab-row-item">
                <span className="ab-row-label" style={{ fontSize: 12 }}>{r.label}</span>
                <span style={{
                  display:'flex', alignItems:'center', gap: 6,
                  fontSize: 11, fontWeight: 700, color: GREEN,
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                }}>
                  <span className="ab-live-dot" />
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

/* ─── Mini CCTV Canvas ─────────────────────────────────────── */
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

      // Sky
      ctx.fillStyle = '#060f1c'
      ctx.fillRect(0, 0, W, H)
      ctx.fillStyle = '#0a1828'
      ctx.fillRect(0, H * 0.7, W, H * 0.3)

      // Buildings
      const buildings = [
        { x:0,    y:0.20, w:0.14, h:0.50, c:'#0d1f38' },
        { x:0.16, y:0.28, w:0.12, h:0.42, c:'#0c1c32' },
        { x:0.30, y:0.16, w:0.18, h:0.54, c:'#0e2040' },
        { x:0.55, y:0.24, w:0.15, h:0.46, c:'#0d1f38' },
        { x:0.72, y:0.18, w:0.28, h:0.52, c:'#0c1c32' },
      ]
      buildings.forEach(b => {
        ctx.fillStyle = b.c
        ctx.fillRect(b.x*W, b.y*H, b.w*W, b.h*H)
        for (let wy = 0; wy < 3; wy++) {
          for (let wx = 0; wx < 2; wx++) {
            const lit = Math.sin(timeRef.current * 0.3 + cam.id + wy*2 + wx) > 0.2
            ctx.fillStyle = lit ? 'rgba(255,220,100,0.15)' : 'rgba(0,0,0,0.3)'
            ctx.fillRect(
              b.x*W + 5 + wx*((b.w*W-10)/2),
              b.y*H + 10 + wy*((b.h*H-16)/3),
              (b.w*W-10)/2 - 3,
              (b.h*H-16)/3 - 3
            )
          }
        }
      })

      // Ground / road
      ctx.fillStyle = '#0f1e2e'
      ctx.fillRect(0, H*0.68, W, H*0.06)

      // Moving vehicles
      for (let p = 0; p < 3 + cam.id; p++) {
        const speed = 0.03 + p*0.01
        const px  = ((timeRef.current * speed * (p%2===0?1:-1) + p*0.25) % 1 + 1) % 1
        const py  = 0.63 + (p%3)*0.03
        const h2  = H*0.1
        ctx.fillStyle = 'rgba(20,40,70,0.9)'
        ctx.beginPath()
        ctx.ellipse(px*W, py*H + h2*0.4, h2*0.1, h2*0.4, 0, 0, Math.PI*2)
        ctx.fill()
        ctx.beginPath()
        ctx.arc(px*W, py*H - h2*0.05, h2*0.12, 0, Math.PI*2)
        ctx.fill()
      }

      // AI Bounding box
      if (cam.detections.length > 0) {
        cam.detections.forEach(d => {
          const pulse = 0.7 + Math.sin(timeRef.current * 2) * 0.3
          ctx.strokeStyle = d.color
          ctx.lineWidth   = 1.5
          ctx.globalAlpha = pulse
          ctx.strokeRect(d.x*W, d.y*H, d.w, d.h)
          ctx.globalAlpha = 1

          // Label
          ctx.fillStyle = d.color
          ctx.fillRect(d.x*W, d.y*H - 14, d.w, 14)
          ctx.fillStyle = '#fff'
          ctx.font = 'bold 8px monospace'
          ctx.fillText(`Anak ${d.conf}%`, d.x*W + 3, d.y*H - 3)
        })
      }

      // Scanlines
      for (let y = 0; y < H; y += 3) {
        ctx.fillStyle = 'rgba(0,0,0,0.06)'
        ctx.fillRect(0, y, W, 1)
      }

      // Timestamp
      ctx.fillStyle = 'rgba(191,219,247,0.35)'
      ctx.font      = '7px monospace'
      ctx.fillText(new Date().toLocaleTimeString('id-ID'), 6, H - 5)

      animRef.current = requestAnimationFrame(draw)
    }

    animRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(animRef.current)
  }, [cam])

  return (
    <div
      className="ab-cctv-feed"
      onClick={onClick}
      style={{ outline: cam.alert ? `2px solid ${RED}` : 'none' }}
    >
      <canvas ref={canvasRef} width={400} height={225} />
      <div className="ab-cctv-overlay">
        <div className="ab-cctv-top">
          <span className="ab-cctv-label">
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            {cam.label}
          </span>
          <span className="ab-cctv-badge-rec">
            <span className="ab-cctv-badge-rec-dot" />
            REC
          </span>
        </div>
        {cam.alert && (
          <div className="ab-cctv-alert-banner">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/></svg>
            Terdeteksi: anak berjualan
          </div>
        )}
        <div className="ab-cctv-footer">
          <span className="ab-cctv-res">{cam.res} · {cam.fps}fps</span>
          <button className="ab-cctv-btn">Fokus</button>
        </div>
      </div>
    </div>
  )
}

/* ─── Mini Bar Chart ───────────────────────────────────────── */
function MiniChart() {
  const bars = [
    { label:'Sen', val:8  },
    { label:'Sel', val:14 },
    { label:'Rab', val:11 },
    { label:'Kam', val:20 },
    { label:'Jum', val:17 },
    { label:'Sab', val:9  },
    { label:'Min', val:5  },
  ]
  const max = Math.max(...bars.map(b => b.val))
  const [hov, setHov] = useState(null)

  return (
    <>
      <div className="ab-chart-wrap">
        {bars.map((b, i) => (
          <div
            key={i}
            className="ab-chart-bar"
            style={{
              height: `${(b.val/max)*100}%`,
              background: T,
              opacity: hov === i ? 1 : 0.5,
            }}
            onMouseEnter={() => setHov(i)}
            onMouseLeave={() => setHov(null)}
          >
            {hov === i && (
              <div style={{
                position:'absolute', bottom:'108%', left:'50%',
                transform:'translateX(-50%)',
                background: N, color:'#fff', borderRadius:5,
                padding:'2px 7px', fontSize:10, fontWeight:700,
                whiteSpace:'nowrap',
                fontFamily:'Plus Jakarta Sans, sans-serif',
              }}>
                {b.val}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="ab-chart-labels">
        {bars.map(b => <span key={b.label}>{b.label}</span>)}
      </div>
    </>
  )
}