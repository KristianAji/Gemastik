import { useNavigate } from 'react-router-dom'
import { useStore } from '../../store/useStore'

// ─── Mengikuti token desain PubBuatLaporan ──────────────────────────────────
// Palette: #022B3A (navy), #1F7A8C (teal), #BFDBF7 (biru muda), #E1E5F2 (abu kebiruan), #FFFFFF
// Font: Plus Jakarta Sans (heading), Inter (body)
// ──────────────────────────────────────────────────────────────────────────────

const statusInfo = {
  baru:    { label: 'Menunggu Proses',   color: '#5A7080', bg: 'rgba(90,112,128,0.10)',  Icon: IconHourglass },
  proses:  { label: 'Sedang Diproses',   color: '#022B3A', bg: 'rgba(2,43,58,0.08)',     Icon: IconRefreshCw },
  selesai: { label: 'Selesai Ditangani', color: '#1F7A8C', bg: 'rgba(31,122,140,0.12)',  Icon: IconCheckCircle },
}

/* ── Ikon SVG, mengikuti gaya line-icon di PubBuatLaporan ── */
function IconBase({ size = 14, color = 'currentColor', children }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      {children}
    </svg>
  )
}

function IconClipboardList(props) {
  return (
    <IconBase {...props}>
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <line x1="9" y1="12" x2="15" y2="12" />
      <line x1="9" y1="16" x2="15" y2="16" />
    </IconBase>
  )
}

function IconHourglass(props) {
  return (
    <IconBase {...props}>
      <path d="M5 22h14" /><path d="M5 2h14" />
      <path d="M17 22v-4.17a2 2 0 0 0-.59-1.42L12 12l-4.41 4.41a2 2 0 0 0-.59 1.42V22" />
      <path d="M7 2v4.17a2 2 0 0 0 .59 1.42L12 12l4.41-4.41A2 2 0 0 0 17 6.17V2" />
    </IconBase>
  )
}

function IconRefreshCw(props) {
  return (
    <IconBase {...props}>
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M8 16H3v5" />
    </IconBase>
  )
}

function IconCheckCircle(props) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </IconBase>
  )
}

function IconTag(props) {
  return (
    <IconBase {...props}>
      <path d="M12.59 2.59A2 2 0 0 0 11.17 2H4a2 2 0 0 0-2 2v7.17a2 2 0 0 0 .59 1.41l8.7 8.7a2.43 2.43 0 0 0 3.42 0l6.58-6.58a2.43 2.43 0 0 0 0-3.42z" />
      <circle cx="7.5" cy="7.5" r="0.5" fill={props.color || 'currentColor'} />
    </IconBase>
  )
}

function IconUser(props) {
  return (
    <IconBase {...props}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </IconBase>
  )
}

function IconClock(props) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </IconBase>
  )
}

function IconInbox(props) {
  return (
    <IconBase {...props}>
      <path d="M22 12h-6l-2 3h-4l-2-3H2" />
      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </IconBase>
  )
}

function IconFilePlus(props) {
  return (
    <IconBase {...props}>
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="12" y1="18" x2="12" y2="12" />
      <line x1="9" y1="15" x2="15" y2="15" />
    </IconBase>
  )
}

function IconPlus(props) {
  return (
    <IconBase {...props}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </IconBase>
  )
}

export default function PubRiwayat() {
  const laporan  = useStore(s => s.laporan)
  const navigate = useNavigate()

  // Show last 5 as "user's" reports (in real app would filter by user ID)
  const myReports = laporan.slice(0, 5)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');

        .riwayat-root {
          font-family: 'Inter', sans-serif;
          background: #E1E5F2;
          color: #022B3A;
          min-height: 100vh;
        }

        /* ── HEADER — disamakan persis dengan .laporan-header ── */
        .riwayat-header {
          background: #022B3A;
          padding: 48px 40px 40px;
          position: relative;
          overflow: hidden;
        }
        .riwayat-header::after {
          content: '';
          position: absolute;
          right: -60px;
          top: -60px;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(31,122,140,0.35) 0%, transparent 70%);
          pointer-events: none;
        }

        /* inner: sama dengan .laporan-header-inner */
        .riwayat-header-inner {
          max-width: 800px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        /* breadcrumb — sama persis */
        .riwayat-breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: rgba(191,219,247,0.55);
          margin-bottom: 16px;
          font-weight: 500;
        }
        .riwayat-breadcrumb button {
          background: none;
          border: none;
          color: rgba(191,219,247,0.55);
          cursor: pointer;
          font-size: 12px;
          font-family: 'Inter', sans-serif;
          padding: 0;
          transition: color 0.15s;
        }
        .riwayat-breadcrumb button:hover { color: #BFDBF7; }
        .riwayat-breadcrumb span { color: #BFDBF7; }

        /* header row: kiri teks + kanan tombol */
        .riwayat-header-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
        }

        /* badge — sama dengan .laporan-badge */
        .riwayat-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(191,219,247,0.12);
          border: 1px solid rgba(191,219,247,0.25);
          border-radius: 999px;
          padding: 4px 12px;
          font-size: 11px;
          font-weight: 600;
          color: #BFDBF7;
          letter-spacing: 0.04em;
          margin-bottom: 14px;
        }

        /* judul — sama dengan .laporan-page-title */
        .riwayat-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: clamp(28px, 4vw, 42px);
          font-weight: 800;
          color: #FFFFFF;
          margin: 0 0 10px;
          line-height: 1.1;
          letter-spacing: -0.02em;
        }
        .riwayat-title span { color: #BFDBF7; }

        /* subtitle — sama dengan .laporan-page-sub */
        .riwayat-subtitle {
          font-size: 14px;
          color: rgba(191,219,247,0.75);
          line-height: 1.6;
          max-width: 500px;
          margin: 0;
        }

        /* tombol di kanan header */
        .btn-cta-primary {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px 24px;
          background: #1F7A8C;
          color: #FFFFFF;
          border: none;
          border-radius: 12px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .btn-cta-primary:hover {
          background: #176878;
          transform: translateY(-1px);
        }

        /* ── CONTENT ── */
        .riwayat-content {
          padding: 40px 40px 80px;
        }

        .riwayat-content-inner {
          max-width: 800px;
          margin: 0 auto;
        }

        .riwayat-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .laporan-card {
          background: #FFFFFF;
          border-radius: 16px;
          border: 1px solid #D6DCE4;
          padding: 24px;
          transition: box-shadow 0.2s, transform 0.15s, border-color 0.2s;
        }
        .laporan-card:hover {
          border-color: #BFDBF7;
          box-shadow: 0 8px 24px rgba(2, 43, 58, 0.08);
          transform: translateY(-1px);
        }

        .laporan-card-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .laporan-id {
          font-family: monospace;
          font-size: 10px;
          color: #94A3B0;
          margin-bottom: 4px;
        }

        .laporan-lokasi {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: #022B3A;
        }

        .laporan-sublokasi {
          font-size: 11px;
          color: #5A7080;
          margin-top: 2px;
        }

        .status-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: 999px;
          flex-shrink: 0;
          margin-left: 12px;
          white-space: nowrap;
        }

        .laporan-meta {
          display: flex;
          gap: 16px;
          font-size: 11px;
          color: #5A7080;
          flex-wrap: wrap;
        }
        .laporan-meta span {
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }

        /* ── PROGRESS STEPPER ── */
        .progress-track {
          display: flex;
          margin-top: 14px;
        }

        .progress-step {
          flex: 1;
          text-align: center;
        }

        .progress-row {
          display: flex;
          align-items: center;
        }

        .progress-line {
          flex: 1;
          height: 2px;
          transition: background 0.3s;
        }

        .progress-dot {
          width: 13px;
          height: 13px;
          border-radius: 50%;
          flex-shrink: 0;
          transition: background 0.3s, border-color 0.3s;
        }

        .progress-label {
          font-size: 8px;
          margin-top: 5px;
          line-height: 1.3;
          letter-spacing: 0.01em;
        }

        /* ── EMPTY STATE ── */
        .empty-state {
          text-align: center;
          padding: 80px 20px;
        }

        .empty-icon {
          margin-bottom: 16px;
        }

        .empty-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 16px;
          font-weight: 700;
          color: #022B3A;
          margin-bottom: 8px;
        }

        .empty-desc {
          font-size: 13px;
          color: #5A7080;
          margin-bottom: 24px;
        }

        .btn-laporan-besar {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          max-width: 320px;
          margin: 0 auto;
          padding: 16px 28px;
          background: #022B3A;
          color: #FFFFFF;
          border: none;
          border-radius: 14px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
        }
        .btn-laporan-besar:hover {
          background: #1F7A8C;
          transform: translateY(-1px);
        }

        /* ── Responsif — disamakan dengan PubBuatLaporan ── */
        @media (max-width: 768px) {
          .riwayat-header { padding: 40px 24px 32px; }
          .riwayat-header-row { flex-direction: column; align-items: stretch; }
          .riwayat-content { padding: 24px 16px 60px; }
          .laporan-meta { gap: 10px; }
        }
      `}</style>

      <div className="riwayat-root">

        {/* ══════════════════════════════════════
            HEADER — struktur identik dengan PubBuatLaporan
        ══════════════════════════════════════ */}
        <header className="riwayat-header">
          <div className="riwayat-header-inner">

            {/* breadcrumb di luar flex row — sama dengan PubBuatLaporan */}
            <div className="riwayat-breadcrumb">
              <button onClick={() => navigate('/public')}>Beranda</button>
              <span>›</span>
              <span>Riwayat</span>
            </div>

            {/* flex row: kiri = badge + judul + sub, kanan = tombol */}
            <div className="riwayat-header-row">
              <div>
                <div className="riwayat-eyebrow">Pemantauan Personal</div>
                <h1 className="riwayat-title">Riwayat <span>Laporan</span></h1>
                <p className="riwayat-subtitle">
                  Laporan yang pernah Anda buat dan status penanganannya.
                </p>
              </div>
              <button className="btn-cta-primary" onClick={() => navigate('/public/laporan')}>
                <IconPlus size={15} />
                Buat Laporan
              </button>
            </div>

          </div>
        </header>

        {/* ══════════════════════════════════════
            CONTENT
        ══════════════════════════════════════ */}
        <section className="riwayat-content">
          <div className="riwayat-content-inner">

            {myReports.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <IconInbox size={44} color="#94A3B0" />
                </div>
                <div className="empty-title">Belum ada laporan</div>
                <div className="empty-desc">Anda belum pernah membuat laporan.</div>
                <button className="btn-laporan-besar" onClick={() => navigate('/public/laporan')}>
                  <IconFilePlus size={18} />
                  Buat Laporan Pertama
                </button>
              </div>
            ) : (
              <div className="riwayat-list">
                {myReports.map(l => {
                  const st = statusInfo[l.status] || statusInfo.baru
                  return (
                    <div key={l.id} className="laporan-card">
                      <div className="laporan-card-top">
                        <div>
                          <div className="laporan-id">#{l.id}</div>
                          <div className="laporan-lokasi">{l.lokasi}</div>
                          {l.subLokasi && <div className="laporan-sublokasi">{l.subLokasi}</div>}
                        </div>
                        <span className="status-pill" style={{ background: st.bg, color: st.color }}>
                          <st.Icon size={12} color={st.color} />
                          {st.label}
                        </span>
                      </div>

                      <div className="laporan-meta" style={{ marginBottom: l.status !== 'baru' ? 14 : 0 }}>
                        <span><IconTag size={12} /> {l.jenis}</span>
                        <span><IconUser size={12} /> {l.jumlah} anak</span>
                        <span><IconClock size={12} /> {l.waktu}</span>
                      </div>

                      {/* Progress */}
                      {l.status !== 'baru' && (
                        <div className="progress-track">
                          {['Laporan Masuk', 'Verifikasi', 'Penugasan', 'Penanganan', 'Selesai'].map((s, i) => {
                            const active = (l.status === 'proses' && i <= 2) || (l.status === 'selesai' && i <= 4)
                            const lineColor = active ? '#1F7A8C' : '#D6DCE4'
                            return (
                              <div key={s} className="progress-step">
                                <div className="progress-row">
                                  {i > 0 && <div className="progress-line" style={{ background: lineColor }} />}
                                  <div
                                    className="progress-dot"
                                    style={{
                                      background: active ? '#1F7A8C' : '#D6DCE4',
                                      border: `2px solid ${active ? '#1F7A8C' : '#D6DCE4'}`,
                                    }}
                                  />
                                  {i < 4 && (
                                    <div
                                      className="progress-line"
                                      style={{ background: active && i < 2 ? '#1F7A8C' : '#D6DCE4' }}
                                    />
                                  )}
                                </div>
                                <div
                                  className="progress-label"
                                  style={{ color: active ? '#1F7A8C' : '#94A3B0' }}
                                >
                                  {s}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

          </div>
        </section>

      </div>
    </>
  )
}