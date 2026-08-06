import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../store/useStore'
import FooterPublic from '../../components/FooterPublic'


const PINS = [
  { x:120, y:220, label:'Kawasan Megamas',   desc:'2 anak berjualan', time:'14 mnt', status:'baru',   color:'#E8401C' },
  { x:300, y:220, label:'Pasar 45',          desc:'1 anak mengamen',  time:'1 jam',  status:'proses', color:'#F5A623' },
  { x:300, y:310, label:'Jl. Boulevard',     desc:'Selesai ditangani',time:'3 jam',  status:'selesai',color:'#2ECC71' },
  { x:450, y:220, label:'Mantos',             desc:'Figuran karakter', time:'5 jam',  status:'proses', color:'#F5A623' },
  { x:560, y:280, label:'Kawasan Wenang',    desc:'2 anak mengemis',  time:'Kemarin',status:'selesai',color:'#2ECC71' },
]

/* ── Ikon SVG ── */
function IconBase({ size = 14, color = 'currentColor', strokeWidth = 2.2, children }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      {children}
    </svg>
  )
}
function IconMap(props) {
  return (
    <IconBase {...props}>
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
      <line x1="9" y1="3" x2="9" y2="18"/>
      <line x1="15" y1="6" x2="15" y2="21"/>
    </IconBase>
  )
}
function IconMapPin(props) {
  return (
    <IconBase {...props}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </IconBase>
  )
}
function IconClock(props) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </IconBase>
  )
}

const statusLabel = { baru: 'Baru', proses: 'Diproses', selesai: 'Selesai' }
const statusBg    = { baru: 'rgba(232,64,28,0.15)', proses: 'rgba(245,166,35,0.15)', selesai: 'rgba(46,204,113,0.15)' }

export default function PubPeta() {
  const [selected, setSelected] = useState(null)
  const navigate = useNavigate()

  const toggle = (pin) => setSelected(prev => prev?.label === pin.label ? null : pin)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');

        .peta-root {
          font-family: 'Inter', sans-serif;
          background: #E1E5F2;
          color: #022B3A;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        /* ── HEADER — identik dengan PubBuatLaporan ── */
        .page-title-row {
  display: flex;
  align-items: center;
  gap: 14px;
}

.page-title-logo {
  width: 42px;
  height: 42px;
  object-fit: contain;
  flex-shrink: 0;
}
        .peta-header {
          background: #022B3A;
          padding: 48px 40px 40px;
          position: relative;
          overflow: hidden;
        }
        .peta-header::after {
          content: '';
          position: absolute;
          right: -60px;
          top: -60px;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(31,122,140,0.35) 0%, transparent 70%);
          pointer-events: none;
        }
        .peta-header-inner {
          max-width: 800px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }
        .peta-breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: rgba(191,219,247,0.55);
          margin-bottom: 16px;
          font-weight: 500;
        }
        .peta-breadcrumb button {
          background: none;
          border: none;
          color: rgba(191,219,247,0.55);
          cursor: pointer;
          font-size: 12px;
          font-family: 'Inter', sans-serif;
          padding: 0;
          transition: color 0.15s;
        }
        .peta-breadcrumb button:hover { color: #BFDBF7; }
        .peta-breadcrumb span { color: #BFDBF7; }

        .peta-badge {
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
        .peta-page-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: clamp(28px, 4vw, 42px);
          font-weight: 800;
          color: #FFFFFF;
          margin: 0 0 10px;
          line-height: 1.1;
          letter-spacing: -0.02em;
        }
        .peta-page-title span { color: #BFDBF7; }
        .peta-page-sub {
          font-size: 14px;
          color: rgba(191,219,247,0.75);
          line-height: 1.6;
          max-width: 500px;
          margin: 0;
        }

        /* ── BODY ── */
        .peta-body {
          max-width: 800px;
          margin: 0 auto;
          width: 100%;
          padding: 40px 40px 80px;
          box-sizing: border-box;
        }

        /* ── MAP CARD ── */
        .map-card {
          background: #FFFFFF;
          border-radius: 16px;
          border: 1px solid #D6DCE4;
          overflow: hidden;
          margin-bottom: 20px;
        }
        .map-card-header {
          background: #022B3A;
          padding: 16px 24px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .map-card-header-icon {
          width: 32px; height: 32px;
          background: rgba(191,219,247,0.15);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .map-card-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px; font-weight: 700; color: #FFFFFF;
        }
        .map-card-subtitle {
          font-size: 11px; color: rgba(191,219,247,0.6); margin-top: 1px;
        }

        /* ── SVG MAP ── */
        .map-wrap {
          background: #0A1420;
          position: relative;
          overflow: hidden;
          min-height: 360px;
        }
        .map-wrap svg { display: block; width: 100%; }

        /* ── LAPORAN LIST ── */
        .list-card {
          background: #FFFFFF;
          border-radius: 16px;
          border: 1px solid #D6DCE4;
          overflow: hidden;
        }
        .list-card-header {
          background: #022B3A;
          padding: 16px 24px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .list-section-label {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 12px; font-weight: 700;
          color: rgba(191,219,247,0.8);
          text-transform: uppercase; letter-spacing: 0.08em;
        }
        .list-scroll {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          padding: 20px 24px;
          scrollbar-width: thin;
          scrollbar-color: #D6DCE4 transparent;
        }
        .list-scroll::-webkit-scrollbar { height: 4px; }
        .list-scroll::-webkit-scrollbar-thumb { background: #D6DCE4; border-radius: 4px; }

        .pin-card {
          background: #F8FAFC;
          border-radius: 12px;
          padding: 14px 16px;
          flex-shrink: 0;
          min-width: 170px;
          cursor: pointer;
          transition: all 0.15s;
          border: 1.5px solid #D6DCE4;
        }
        .pin-card:hover {
          border-color: #1F7A8C;
          box-shadow: 0 4px 12px rgba(2,43,58,0.08);
          transform: translateY(-1px);
        }
        .pin-card.active {
          background: #fff;
          box-shadow: 0 4px 12px rgba(2,43,58,0.1);
        }
        .pin-card-name {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 12px; font-weight: 700;
          color: #022B3A;
          margin-bottom: 4px;
          display: flex; align-items: center; gap: 5px;
        }
        .pin-card-desc {
          font-size: 11px; color: #5A7080;
          margin-bottom: 10px;
        }
        .pin-card-time {
          font-size: 10px; color: #94A3B0;
          display: flex; align-items: center; gap: 4px;
          margin-bottom: 8px;
        }
        .pin-status-pill {
          display: inline-flex;
          align-items: center;
          font-size: 10px; font-weight: 700;
          padding: 3px 10px;
          border-radius: 999px;
        }

        /* ── Responsif ── */
        @media (max-width: 768px) {
          .peta-header { padding: 40px 24px 32px; }
          .peta-body   { padding: 24px 16px 60px; }
        }
      `}</style>

      <div className="peta-root">

        {/* ══ HEADER ══ */}
        <div className="peta-header">
          <div className="peta-header-inner">
            <div className="peta-breadcrumb">
              <button onClick={() => navigate('/public')}>Beranda</button>
              <span>›</span>
              <span>Peta Laporan</span>
            </div>
            <div className="peta-badge">Sebaran Laporan Aktif</div>
            <div className="page-title-row">
            <img
              src={`${import.meta.env.BASE_URL}logowhite.png`}
              alt="Logo Delcion"
              className="page-title-logo"
            />

            <h1 className="laporan-page-title">
              Peta <span>Laporan</span>
            </h1>
          </div>
            <p className="peta-page-sub">
              Sebaran laporan pekerja anak aktif di Kota Manado secara real-time.
            </p>
          </div>
        </div>

        {/* ══ BODY ══ */}
        <div className="peta-body">

          {/* Map card */}
          <div className="map-card">
            <div className="map-card-header">
              <div className="map-card-header-icon">
                <IconMap size={16} color="#BFDBF7" />
              </div>
              <div>
                <div className="map-card-title">Peta Interaktif</div>
                <div className="map-card-subtitle">Klik titik untuk melihat detail laporan</div>
              </div>
            </div>
            <div className="map-wrap">
              <svg viewBox="0 0 700 400" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
                <rect width="700" height="400" fill="#0A1420"/>
                <defs>
                  <pattern id="pgrid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="700" height="400" fill="url(#pgrid)"/>
                <line x1="0" y1="230" x2="700" y2="230" stroke="rgba(255,255,255,0.12)" strokeWidth="3"/>
                <line x1="0" y1="310" x2="700" y2="310" stroke="rgba(255,255,255,0.08)" strokeWidth="2"/>
                <line x1="180" y1="0" x2="180" y2="400" stroke="rgba(255,255,255,0.10)" strokeWidth="3"/>
                <line x1="380" y1="0" x2="380" y2="400" stroke="rgba(255,255,255,0.08)" strokeWidth="2"/>

                <text x="40"  y="210" fill="rgba(255,255,255,0.2)" fontSize="11" fontFamily="Inter, sans-serif">Megamas</text>
                <text x="240" y="210" fill="rgba(255,255,255,0.2)" fontSize="11" fontFamily="Inter, sans-serif">Pasar 45</text>
                <text x="395" y="210" fill="rgba(255,255,255,0.2)" fontSize="11" fontFamily="Inter, sans-serif">Matos</text>
                <text x="240" y="340" fill="rgba(255,255,255,0.2)" fontSize="11" fontFamily="Inter, sans-serif">Jl. Boulevard</text>

                {PINS.map((pin, i) => (
                  <g key={i} onClick={() => toggle(pin)} style={{ cursor: 'pointer' }}>
                    <circle cx={pin.x} cy={pin.y} r="20" fill={`${pin.color}10`}>
                      <animate attributeName="r" from="8" to="22" dur="2s" repeatCount="indefinite"/>
                      <animate attributeName="opacity" from="0.6" to="0" dur="2s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx={pin.x} cy={pin.y} r="12" fill={`${pin.color}20`} stroke={pin.color}
                      strokeWidth={selected?.label === pin.label ? 2.5 : 1.5}/>
                    <circle cx={pin.x} cy={pin.y} r="5" fill={pin.color}/>
                  </g>
                ))}

                {selected && (
                  <g>
                    <rect
                      x={Math.min(selected.x + 16, 530)}
                      y={Math.max(selected.y - 70, 10)}
                      width="175" height="65" rx="9"
                      fill="#0F2744" stroke={selected.color} strokeWidth="1.5"
                    />
                    <text x={Math.min(selected.x + 26, 540)} y={Math.max(selected.y - 48, 32)}
                      fill={selected.color} fontSize="11" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="700">
                      {selected.label}
                    </text>
                    <text x={Math.min(selected.x + 26, 540)} y={Math.max(selected.y - 32, 48)}
                      fill="rgba(255,255,255,0.7)" fontSize="10" fontFamily="Inter, sans-serif">
                      {selected.desc}
                    </text>
                    <text x={Math.min(selected.x + 26, 540)} y={Math.max(selected.y - 16, 64)}
                      fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="Inter, sans-serif">
                      {selected.time} lalu
                    </text>
                  </g>
                )}

                {/* Legend */}
                {[{ c:'#E8401C', l:'Baru' }, { c:'#F5A623', l:'Diproses' }, { c:'#2ECC71', l:'Selesai' }].map((x, i) => (
                  <g key={x.l} transform={`translate(${16 + i * 82}, 376)`}>
                    <rect width="8" height="8" rx="2" fill={x.c}/>
                    <text x="13" y="8" fill="rgba(255,255,255,0.45)" fontSize="10" fontFamily="Inter, sans-serif">{x.l}</text>
                  </g>
                ))}
              </svg>
            </div>
          </div>

          {/* List card */}
          <div className="list-card">
            <div className="list-card-header">
              <div className="map-card-header-icon">
                <IconMapPin size={16} color="#BFDBF7" />
              </div>
              <div className="list-section-label">Laporan Terkini</div>
            </div>
            <div className="list-scroll">
              {PINS.map((pin, i) => (
                <div
                  key={i}
                  className={`pin-card ${selected?.label === pin.label ? 'active' : ''}`}
                  style={{ borderColor: selected?.label === pin.label ? pin.color : undefined }}
                  onClick={() => toggle(pin)}
                >
                  <div className="pin-card-name">
                    <IconMapPin size={11} color={pin.color} strokeWidth={2.5} />
                    {pin.label}
                  </div>
                  <div className="pin-card-desc">{pin.desc}</div>
                  <div className="pin-card-time">
                    <IconClock size={10} color="#94A3B0" strokeWidth={2} />
                    {pin.time} lalu
                  </div>
                  <span
                    className="pin-status-pill"
                    style={{ background: statusBg[pin.status], color: pin.color }}
                  >
                    {statusLabel[pin.status]}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
        <FooterPublic />
        
      </div>
    </>
  )
}