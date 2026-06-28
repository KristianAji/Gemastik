import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../store/useStore'

/* ── Palette (identik dengan AdminPeta / AdminBeranda) ─────── */
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

/* ── SVG Icons ──────────────────────────────────────────────── */
const Icon = {
  bell: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  ),
  warning: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  zap: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  check: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  checkLg: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  tugaskan: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
      <line x1="19" y1="8" x2="23" y2="8"/>
      <line x1="21" y1="6" x2="21" y2="10"/>
    </svg>
  ),
  cctv: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
      <circle cx="12" cy="13" r="4"/>
    </svg>
  ),
  arrow: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="5" y1="12" x2="19" y2="12"/>
      <polyline points="12 5 19 12 12 19"/>
    </svg>
  ),
  list: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
      <line x1="9" y1="12" x2="15" y2="12"/>
      <line x1="9" y1="16" x2="15" y2="16"/>
    </svg>
  ),
}

export default function AdminNotifikasi() {
  const navigate       = useNavigate()
  const notifikasi     = useStore(s => s.notifikasi)
  const laporan        = useStore(s => s.laporan)
  const markNotifRead  = useStore(s => s.markNotifRead)
  const markAllRead    = useStore(s => s.markAllNotifRead)
  const openModal      = useStore(s => s.openModal)

  const [filter, setFilter] = useState('semua')

  const accentColor = {
    red: RED, amber: AMBER, green: GREEN, blue: T, '': BORDER,
  }

  /* ── KPI ── */
  const total        = notifikasi.length
  const unreadCount  = notifikasi.filter(n => !n.read).length
  const readCount    = total - unreadCount
  const actionNeeded = notifikasi.filter(n => !n.read && (n.tipe === 'alert' || n.tipe === 'laporan')).length

  /* ── Filter ── */
  const filteredNotif = notifikasi.filter(n => {
    if (filter === 'unread')   return !n.read
    if (filter === 'alert')    return n.tipe === 'alert'
    if (filter === 'laporan')  return n.tipe === 'laporan'
    return true
  })

  const today = filteredNotif.filter(n =>
    !['Kemarin','2 hari lalu'].some(t => n.meta?.some(m => m.includes(t))) &&
    !n.read || n.meta?.some(m => m.includes('mnt') || m.includes('jam'))
  )
  const earlier = filteredNotif.filter(n =>
    n.meta?.some(m => m.includes('Kemarin') || m.includes('hari lalu'))
  )

  const handleAction = (notif, action) => {
    markNotifRead(notif.id)
    const lap = notif.laporanId ? laporan.find(l => l.id === notif.laporanId) : null
    if (action === 'tugaskan' && lap)   openModal('tugaskan', lap)
    if (action === 'verifikasi' && lap) openModal('verifikasi', lap)
    if (action === 'cctv') openModal('lihat-cctv', { camLabel:'CAM-01 — Megamas', lokasi:'Kawasan Megamas', resolusi:'1080p', hasAlert:true })
    if (action === 'detail' && lap)     openModal('detail', lap)
  }

  const NotifItem = ({ n }) => (
    <div
      className={`an-notif-card${n.read ? ' read' : ''}`}
      style={{ '--accent-color': accentColor[n.warna] ?? BORDER }}
      onClick={() => markNotifRead(n.id)}
    >
      <div
        className="an-notif-icon"
        style={{
          background: `${accentColor[n.warna] ?? MUTED}18`,
          color: accentColor[n.warna] ?? MUTED,
        }}
      >
        {n.icon}
      </div>

      <div className="an-notif-body">
        <div className="an-notif-title">{n.judul}</div>
        <div className="an-notif-desc">{n.deskripsi}</div>

        {n.meta?.length > 0 && (
          <div className="an-notif-meta">
            {n.meta.map((m, i) => <span key={i}>{m}</span>)}
          </div>
        )}

        {n.tipe === 'alert' && !n.read && (
          <div className="an-notif-actions" onClick={e => e.stopPropagation()}>
            <button className="an-btn-solid" onClick={() => handleAction(n, 'tugaskan')}>
              {Icon.tugaskan} Tugaskan Petugas
            </button>
            <button className="an-btn-outline" onClick={() => handleAction(n, 'cctv')}>
              {Icon.cctv} Lihat CCTV
            </button>
          </div>
        )}
        {n.tipe === 'laporan' && !n.read && (
          <div className="an-notif-actions" onClick={e => e.stopPropagation()}>
            <button className="an-btn-solid" onClick={() => handleAction(n, 'verifikasi')}>
              {Icon.check} Verifikasi
            </button>
            <button className="an-btn-outline" onClick={() => handleAction(n, 'detail')}>
              {Icon.arrow} Detail
            </button>
          </div>
        )}
      </div>

      {!n.read && (
        <span className="an-notif-dot" style={{ background: accentColor[n.warna] ?? T }} />
      )}
    </div>
  )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .an-root * { box-sizing: border-box; }

        .an-root {
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
        .an-banner {
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
        .an-banner::before {
          content: '';
          position: absolute;
          right: -80px; top: -80px;
          width: 320px; height: 320px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(60,110,113,0.3) 0%, transparent 65%);
          pointer-events: none;
        }
        .an-banner::after {
          content: '';
          position: absolute;
          left: 40%; bottom: -60px;
          width: 200px; height: 200px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(191,219,247,0.06) 0%, transparent 70%);
          pointer-events: none;
        }
        .an-banner-eyebrow {
          font-size: 11px;
          color: rgba(191,219,247,0.5);
          margin-bottom: 8px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .an-banner-title {
          font-size: clamp(22px, 3vw, 30px);
          font-weight: 800;
          color: #fff;
          line-height: 1.15;
          margin-bottom: 10px;
          letter-spacing: -0.02em;
        }
        .an-banner-title span { color: #BFDBF7; }
        .an-banner-sub {
          font-size: 13px;
          color: rgba(255,255,255,0.6);
          line-height: 1.65;
          max-width: 440px;
        }
        .an-banner-sub strong { color: #fff; font-weight: 700; }
        .an-banner-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
          flex-shrink: 0;
          position: relative;
          z-index: 1;
        }
        .an-btn-teal {
          display: flex; align-items: center; gap: 8px;
          padding: 12px 22px;
          background: ${T};
          color: #fff; border: none; border-radius: 10px;
          font-size: 13px; font-weight: 700;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
          white-space: nowrap;
        }
        .an-btn-teal:hover { background: #2f5759; transform: translateY(-1px); }
        .an-btn-ghost {
          display: flex; align-items: center; gap: 8px;
          padding: 11px 22px;
          background: rgba(255,255,255,0.08);
          color: #fff;
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 10px;
          font-size: 13px; font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
          white-space: nowrap;
        }
        .an-btn-ghost:hover { background: rgba(255,255,255,0.14); }

        /* ══ KPI GLASS CARDS ══ */
        .an-kpi-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
        }
        .an-kpi-card {
          background: rgba(255, 255, 255, 0.55);
          backdrop-filter: blur(16px) saturate(180%);
          -webkit-backdrop-filter: blur(16px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.7);
          border-radius: 16px;
          padding: 22px;
          cursor: default;
          transition: box-shadow 0.2s, transform 0.15s, background 0.2s;
          position: relative;
          overflow: hidden;
        }
        .an-kpi-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: var(--accent-color, ${T});
          border-radius: 16px 16px 0 0;
        }
        .an-kpi-card:hover {
          background: rgba(255, 255, 255, 0.75);
          box-shadow: 0 8px 32px rgba(60,110,113,0.14);
          transform: translateY(-2px);
        }
        .an-kpi-icon-wrap {
          width: 40px; height: 40px;
          border-radius: 10px;
          background: var(--icon-bg, rgba(60,110,113,0.1));
          border: 1px solid var(--icon-border, rgba(60,110,113,0.2));
          display: flex; align-items: center; justify-content: center;
          color: var(--icon-color, ${T});
          margin-bottom: 16px;
        }
        .an-kpi-num {
          font-size: 34px;
          font-weight: 800;
          color: var(--num-color, ${T});
          line-height: 1;
          margin-bottom: 5px;
          letter-spacing: -0.02em;
        }
        .an-kpi-label {
          font-size: 12px;
          color: ${MUTED};
          font-weight: 500;
          margin-bottom: 12px;
        }
        .an-kpi-delta {
          font-size: 11px;
          font-weight: 600;
          color: var(--delta-color, ${T});
        }
        .an-kpi-bar {
          height: 3px;
          border-radius: 2px;
          background: rgba(60,110,113,0.12);
          margin-top: 14px;
          overflow: hidden;
        }
        .an-kpi-bar-fill {
          height: 100%;
          border-radius: 2px;
          background: var(--bar-color, ${T});
          transition: width 1s ease;
        }

        /* ══ FILTER PILLS ══ */
        .an-filter-row { display: flex; align-items: center; gap: 8px; }
        .an-filter-pill {
          padding: 7px 16px;
          border-radius: 999px;
          font-size: 12px; font-weight: 600;
          cursor: pointer; border: 1.5px solid ${BORDER};
          transition: all 0.18s;
          background: rgba(255,255,255,0.7);
          color: ${MUTED};
        }
        .an-filter-pill:hover {
          background: rgba(60,110,113,0.08);
          border-color: ${T};
          color: ${T};
        }
        .an-filter-pill.active {
          background: ${N};
          color: #fff;
          border-color: ${N};
        }
        .an-live-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: ${GREEN};
          display: inline-block;
          animation: an-pulse 2s ease infinite;
        }
        @keyframes an-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }

        /* ══ CARD ══ */
        .an-card {
          background: ${CARD};
          border: 1px solid ${BORDER};
          border-radius: 14px;
          overflow: hidden;
        }
        .an-card-head {
          padding: 16px 20px;
          border-bottom: 1px solid ${BORDER};
          display: flex; align-items: center; justify-content: space-between;
        }
        .an-card-title {
          font-size: 13px; font-weight: 700;
          color: ${N};
          display: flex; align-items: center; gap: 8px;
        }
        .an-card-body { padding: 20px; }
        .an-section-label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #9BAAB5;
          margin: 0 0 10px;
        }

        /* ══ NOTIF CARD ══ */
        .an-notif-card {
          background: #F8FAFC;
          border: 1.5px solid ${BORDER};
          border-radius: 12px;
          padding: 14px 16px;
          margin-bottom: 8px;
          display: flex;
          gap: 14px;
          align-items: flex-start;
          cursor: pointer;
          transition: all 0.18s;
          position: relative;
          overflow: hidden;
        }
        .an-notif-card::before {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 3px;
          background: var(--accent-color);
        }
        .an-notif-card:hover {
          background: rgba(255,255,255,0.95);
          box-shadow: 0 4px 16px rgba(60,110,113,0.1);
          border-color: var(--accent-color);
        }
        .an-notif-card.read { opacity: 0.62; }
        .an-notif-icon {
          width: 38px; height: 38px;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
          margin-left: 6px;
        }
        .an-notif-body { flex: 1; min-width: 0; }
        .an-notif-title {
          font-size: 13px; font-weight: 700; color: ${N};
          margin-bottom: 4px;
        }
        .an-notif-desc {
          font-size: 12px; color: ${MUTED};
          line-height: 1.6; margin-bottom: 6px;
        }
        .an-notif-meta {
          display: flex; gap: 12px; flex-wrap: wrap;
          font-size: 11px; color: #9BAAB5;
          margin-bottom: 4px;
        }
        .an-notif-actions {
          display: flex; gap: 6px; margin-top: 8px;
        }
        .an-notif-dot {
          width: 8px; height: 8px; border-radius: 50%;
          flex-shrink: 0; margin-top: 6px;
          animation: an-pulse 2s ease infinite;
        }

        .an-btn-solid {
          padding: 6px 12px;
          background: ${T};
          color: #fff;
          border: none; border-radius: 8px;
          font-size: 11px; font-weight: 700;
          cursor: pointer;
          display: flex; align-items: center; gap: 5px;
          transition: background 0.15s;
        }
        .an-btn-solid:hover { background: #2f5759; }
        .an-btn-outline {
          padding: 6px 12px;
          background: transparent;
          color: ${N};
          border: 1.5px solid ${BORDER};
          border-radius: 8px;
          font-size: 11px; font-weight: 600;
          cursor: pointer;
          display: flex; align-items: center; gap: 5px;
          transition: all 0.15s;
        }
        .an-btn-outline:hover { border-color: ${T}; color: ${T}; }

        @media (max-width: 1100px) {
          .an-kpi-grid { grid-template-columns: repeat(2, 1fr); }
          .an-banner   { flex-direction: column; align-items: flex-start; }
          .an-root     { padding: 20px 20px 60px; }
        }
      `}</style>

      <div className="an-root">

        {/* ══ BANNER ══ */}
        <div className="an-banner">
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="an-banner-eyebrow">Pusat Notifikasi</div>
            <div className="an-banner-title">
              Notifikasi<br/>
              <span>&amp; Aktivitas Sistem</span>
            </div>
            <div className="an-banner-sub">
              {unreadCount > 0 ? (
                <>Terdapat <strong>{unreadCount} notifikasi belum dibaca</strong> — <strong>{actionNeeded} memerlukan tindakan segera</strong> dari tim Anda.</>
              ) : (
                <>Semua notifikasi sudah dibaca. Sistem berjalan normal tanpa ada tindakan tertunda.</>
              )}
            </div>
          </div>
          <div className="an-banner-actions">
            {unreadCount > 0 && (
              <button className="an-btn-teal" onClick={markAllRead}>
                {Icon.checkLg}
                Tandai Semua Dibaca
                <span style={{
                  background: '#fff', color: T,
                  borderRadius: '999px', fontSize: 10, fontWeight: 800,
                  padding: '1px 7px', marginLeft: 2,
                }}>
                  {unreadCount}
                </span>
              </button>
            )}
            <button className="an-btn-ghost" onClick={() => navigate('/admin/laporan')}>
              {Icon.list}
              Lihat Semua Laporan
            </button>
          </div>
        </div>

        {/* ══ KPI GLASS CARDS ══ */}
        <div className="an-kpi-grid">
          {[
            {
              icon: Icon.bell, num: total, label: 'Total Notifikasi',
              delta: 'Seluruh notifikasi tercatat', fill: 100,
              accentColor: T, iconBg: 'rgba(60,110,113,0.1)', iconBorder: 'rgba(60,110,113,0.2)',
              iconColor: T, numColor: T, deltaColor: T, barColor: T,
            },
            {
              icon: Icon.warning, num: unreadCount, label: 'Belum Dibaca',
              delta: 'Menunggu untuk ditinjau', fill: total ? (unreadCount/total)*100 : 0,
              accentColor: RED, iconBg: 'rgba(192,57,43,0.1)', iconBorder: 'rgba(192,57,43,0.2)',
              iconColor: RED, numColor: RED, deltaColor: RED, barColor: RED,
            },
            {
              icon: Icon.zap, num: actionNeeded, label: 'Memerlukan Tindakan',
              delta: 'Alert & laporan aktif', fill: total ? (actionNeeded/total)*100 : 0,
              accentColor: AMBER, iconBg: 'rgba(212,130,10,0.1)', iconBorder: 'rgba(212,130,10,0.2)',
              iconColor: AMBER, numColor: AMBER, deltaColor: AMBER, barColor: AMBER,
            },
            {
              icon: Icon.checkLg, num: readCount, label: 'Sudah Dibaca',
              delta: `${total ? Math.round((readCount/total)*100) : 0}% telah ditinjau`,
              fill: total ? (readCount/total)*100 : 0,
              accentColor: GREEN, iconBg: 'rgba(30,126,74,0.1)', iconBorder: 'rgba(30,126,74,0.2)',
              iconColor: GREEN, numColor: GREEN, deltaColor: GREEN, barColor: GREEN,
            },
          ].map((k, i) => (
            <div key={i} className="an-kpi-card" style={{
              '--accent-color': k.accentColor,
              '--icon-bg': k.iconBg,
              '--icon-border': k.iconBorder,
              '--icon-color': k.iconColor,
              '--num-color': k.numColor,
              '--delta-color': k.deltaColor,
              '--bar-color': k.barColor,
            }}>
              <div className="an-kpi-icon-wrap">{k.icon}</div>
              <div className="an-kpi-num">{k.num}</div>
              <div className="an-kpi-label">{k.label}</div>
              <div className="an-kpi-delta">{k.delta}</div>
              <div className="an-kpi-bar">
                <div className="an-kpi-bar-fill" style={{ width: `${k.fill}%` }} />
              </div>
            </div>
          ))}
        </div>

        {/* ══ FILTER + LIVE ══ */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div className="an-filter-row">
            {[
              { key: 'semua',   label: 'Semua' },
              { key: 'unread',  label: 'Belum Dibaca' },
              { key: 'alert',   label: 'Alert' },
              { key: 'laporan', label: 'Laporan' },
            ].map(f => (
              <button
                key={f.key}
                className={`an-filter-pill${filter === f.key ? ' active' : ''}`}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: GREEN, fontWeight: 600 }}>
            <span className="an-live-dot" />
            Live Update
          </div>
        </div>

        {/* ══ LIST ══ */}
        <div className="an-card">
          <div className="an-card-head">
            <div className="an-card-title">
              {Icon.bell}
              Daftar Notifikasi
            </div>
          </div>

          <div className="an-card-body">
            {today.length > 0 && (
              <>
                <div className="an-section-label">Hari ini</div>
                {today.map(n => <NotifItem key={n.id} n={n} />)}
              </>
            )}

            {earlier.length > 0 && (
              <>
                <div className="an-section-label" style={{ marginTop: 24 }}>Sebelumnya</div>
                {earlier.map(n => <NotifItem key={n.id} n={n} />)}
              </>
            )}

            {filteredNotif.length === 0 && (
              <div style={{ textAlign: 'center', padding: 60, color: '#9BAAB5' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🔕</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>
                  {notifikasi.length === 0 ? 'Tidak ada notifikasi' : 'Tidak ada notifikasi yang sesuai filter ini'}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </>
  )
}