import { useStore } from '../../store/useStore'

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

export default function AdminNotifikasi() {
  const notifikasi    = useStore(s => s.notifikasi)
  const laporan       = useStore(s => s.laporan)
  const markNotifRead = useStore(s => s.markNotifRead)
  const markAllRead   = useStore(s => s.markAllNotifRead)
  const openModal     = useStore(s => s.openModal)

  const unread  = notifikasi.filter(n => !n.read).length
  const today   = notifikasi.filter(n =>
    !['Kemarin','2 hari lalu'].some(t => n.meta?.some(m => m.includes(t))) &&
    !n.read || n.meta?.some(m => m.includes('mnt') || m.includes('jam'))
  )
  const earlier = notifikasi.filter(n =>
    n.meta?.some(m => m.includes('Kemarin') || m.includes('hari lalu'))
  )

  const accentColor = {
    red: RED, amber: AMBER, green: GREEN, blue: T, '': BORDER,
  }

  const handleAction = (notif, action) => {
    markNotifRead(notif.id)
    const lap = notif.laporanId ? laporan.find(l => l.id === notif.laporanId) : null
    if (action === 'tugaskan' && lap)  openModal('tugaskan', lap)
    if (action === 'verifikasi' && lap) openModal('verifikasi', lap)
    if (action === 'cctv') openModal('lihat-cctv', { camLabel:'CAM-01 — Megamas', lokasi:'Kawasan Megamas', resolusi:'1080p', hasAlert:true })
    if (action === 'detail' && lap)    openModal('detail', lap)
  }

  const NotifItem = ({ n }) => (
    <div
      onClick={() => markNotifRead(n.id)}
      style={{
        background: CARD,
        borderRadius: 12,
        padding: '16px 18px',
        marginBottom: 8,
        display: 'flex',
        gap: 14,
        alignItems: 'flex-start',
        borderLeft: `3px solid ${accentColor[n.warna] ?? BORDER}`,
        cursor: 'pointer',
        transition: 'background 0.15s, box-shadow 0.15s',
        opacity: n.read ? 0.65 : 1,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = '#F8FAFC'
        e.currentTarget.style.boxShadow  = '0 2px 12px rgba(60,110,113,0.08)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = CARD
        e.currentTarget.style.boxShadow  = 'none'
      }}
    >
      <div style={{ fontSize: 22, flexShrink: 0, marginTop: 2 }}>{n.icon}</div>

      <div style={{ flex: 1 }}>
        <div style={{
          fontFamily: "'Plus Jakarta Sans',sans-serif",
          fontSize: 13, fontWeight: 600, color: N, marginBottom: 4,
        }}>
          {n.judul}
        </div>
        <div style={{ fontSize: 12, color: MUTED, lineHeight: 1.6, marginBottom: 6 }}>
          {n.deskripsi}
        </div>
        <div style={{
          display: 'flex', gap: 12, flexWrap: 'wrap',
          fontSize: 11, color: '#9BAAB5',
          marginBottom: (n.tipe === 'alert' || n.tipe === 'laporan') && !n.read ? 10 : 0,
        }}>
          {n.meta?.map((m, i) => <span key={i}>{m}</span>)}
        </div>

        {n.tipe === 'alert' && !n.read && (
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              style={btnPrimary}
              onClick={e => { e.stopPropagation(); handleAction(n, 'tugaskan') }}
              onMouseEnter={e => e.currentTarget.style.background = '#2f5759'}
              onMouseLeave={e => e.currentTarget.style.background = T}
            >
              Tugaskan Petugas
            </button>
            <button
              style={btnOutline}
              onClick={e => { e.stopPropagation(); handleAction(n, 'cctv') }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = T; e.currentTarget.style.color = T }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.color = N }}
            >
              Lihat CCTV
            </button>
          </div>
        )}
        {n.tipe === 'laporan' && !n.read && (
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              style={btnPrimary}
              onClick={e => { e.stopPropagation(); handleAction(n, 'verifikasi') }}
              onMouseEnter={e => e.currentTarget.style.background = '#2f5759'}
              onMouseLeave={e => e.currentTarget.style.background = T}
            >
              Verifikasi
            </button>
            <button
              style={btnOutline}
              onClick={e => { e.stopPropagation(); handleAction(n, 'detail') }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = T; e.currentTarget.style.color = T }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.color = N }}
            >
              Detail
            </button>
          </div>
        )}
      </div>

      {!n.read && (
        <div style={{
          width: 8, height: 8, borderRadius: '50%',
          background: accentColor[n.warna] ?? T,
          flexShrink: 0, marginTop: 6,
        }} />
      )}
    </div>
  )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');
        .an-root * { box-sizing: border-box; }
        .an-root {
          font-family: 'Inter', sans-serif;
          background: ${BG};
          color: ${TEXT};
          flex: 1;
          overflow-y: auto;
          padding: 28px 32px 60px;
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .an-section-label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #9BAAB5;
          margin: 0 0 10px;
        }
        @media (max-width: 768px) {
          .an-root { padding: 20px 16px 60px; }
        }
      `}</style>

      <div className="an-root">

        {/* ── Topbar ── */}
        <div style={{
          padding: '16px 20px',
          borderBottom: `1px solid ${BORDER}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: CARD,
          borderRadius: '14px 14px 0 0',
        }}>
          <div>
            <div style={{
              fontFamily: "'Plus Jakarta Sans',sans-serif",
              fontSize: 16, fontWeight: 800, color: N,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              Notifikasi
              {unread > 0 && (
                <span style={{
                  background: 'rgba(192,57,43,0.1)', color: RED,
                  fontSize: 10, fontWeight: 700,
                  padding: '3px 10px', borderRadius: 999,
                }}>
                  {unread} Baru
                </span>
              )}
            </div>
            <div style={{ fontSize: 12, color: MUTED, marginTop: 3 }}>
              {unread > 0
                ? `${unread} notifikasi belum dibaca`
                : 'Semua notifikasi sudah dibaca'}
            </div>
          </div>

          {unread > 0 && (
            <button
              style={{
                padding: '9px 18px', background: 'transparent', color: N,
                border: `1.5px solid ${N}`, borderRadius: 9,
                fontFamily: "'Plus Jakarta Sans',sans-serif",
                fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
              }}
              onClick={markAllRead}
              onMouseEnter={e => { e.currentTarget.style.background = N; e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = N }}
            >
              Tandai semua dibaca
            </button>
          )}
        </div>

        {/* ── Body ── */}
        <div style={{ background: CARD, borderRadius: '0 0 14px 14px' }}>
          <div style={{ maxWidth: 760, margin: '0 auto', padding: 24 }}>

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

            {notifikasi.length === 0 && (
              <div style={{ textAlign: 'center', padding: 60, color: '#9BAAB5' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🔕</div>
                <div style={{
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                  fontSize: 14, fontWeight: 600,
                }}>
                  Tidak ada notifikasi
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </>
  )
}

/* ── Style constants ── */
const btnPrimary = {
  padding: '7px 14px',
  background: '#3C6E71',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  fontFamily: "'Plus Jakarta Sans',sans-serif",
  fontSize: 12, fontWeight: 700,
  cursor: 'pointer', transition: 'background 0.2s',
}

const btnOutline = {
  padding: '7px 14px',
  background: 'transparent',
  color: '#022B3A',
  border: '1.5px solid #D6DCE4',
  borderRadius: 8,
  fontFamily: "'Plus Jakarta Sans',sans-serif",
  fontSize: 12, fontWeight: 600,
  cursor: 'pointer', transition: 'all 0.2s',
}